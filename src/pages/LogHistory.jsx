import useUserSettings from "../hooks/useUserSetting.js";
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../Firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from "react-toastify";
import { syncPlatformActivity } from "../services/platformSyncService.js";
import { format,isToday, isThisWeek, parseISO } from 'date-fns';
const LogHistory = () => {
  const {user} = useAuth()
  const {setting}= useUserSettings()
  const [activityLog,setActivityLog] = useState({})
  const [loading,setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newLog, setNewLog] = useState({
    platform: '',
    title: '',
    message: '',
    url: '',
  });
  const [showSyncInfo, setShowSyncInfo] = useState(false);

  const handleAdd = ()=>{
    setShowModal(true)
  }
  const handleAddLog = async () => {
    const date = format(new Date(), 'yyyy-MM-dd');
    const userRef = doc(db, 'users', user.uid);

    let type =
      newLog.platform === 'GitHub' && newLog.message?.trim()
        ? 'Commit'
        : 'Solved Problem';

    const entry = {
      platform: newLog.platform,
      title: newLog.title,
      message: newLog.message,
      url: newLog.url,
      date,
      type,
      source:'manual',
    };

    try {
      await updateDoc(userRef, {
        [`activityLog.${date}`]: arrayUnion(entry),
      });
      toast.success("Log added!");
      setShowModal(false);
      setNewLog({ platform: '', title: '', message: '', url: '' });
      fetchActivity();
      window.dispatchEvent(new Event('log-added'));
    } catch (error) {
      toast.error("Failed to add log");
      console.error(error);
    }
  };
  const fetchActivity = async()=>{
    if(!user?.uid) return 
    const docRef = doc(db,'users',user.uid)
    const snapshot = await getDoc(docRef)
    const data = snapshot.data()
    setActivityLog(data?.activityLog || {})
    setLoading(false)
  }
  useEffect(() => {
  fetchActivity();
  
}, [user]);

  const filteredLog = Object.keys(activityLog).reduce((acc, date) => {
    const dateObj = parseISO(date);
    const includeDate =
      selectedRange === 'all' ||
      (selectedRange === 'today' && isToday(dateObj)) ||
      (selectedRange === 'week' && isThisWeek(dateObj, { weekStartsOn: 1 }));

    if (!includeDate) return acc;

    const filteredEntries = activityLog[date].filter(log =>
      log.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.message || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredEntries.length > 0) acc[date] = filteredEntries;
    return acc;
  }, {});

  const handleSync = async () => {
    toast.info('Syncing logs...');

    // Step 1: Fetch existing logs
    const docRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(docRef);
    const existingLog = snapshot.data()?.activityLog || {};

    // Step 2: Run platform sync
    const newLog = await syncPlatformActivity(user.uid, setting.platforms, setting.usernames);

    // Step 3: Merge logs without duplicates
    const mergedLog = { ...existingLog };
    Object.entries(newLog || {}).forEach(([date, entries]) => {
      if (!mergedLog[date]) mergedLog[date] = [];
      const existingUrls = new Set(mergedLog[date].map((e) => e.url));
      entries.forEach(entry => {
        if (!existingUrls.has(entry.url)) {
          mergedLog[date].push(entry);
        }
      });
    });

    // Step 4: Write merged logs to Firestore
    try {
      await updateDoc(docRef, { activityLog: mergedLog });
      toast.success('Logs synced!');
      setTimeout(() => {
        fetchActivity();
        window.dispatchEvent(new Event('log-added'));
      }, 300);
    } catch (err) {
      console.error("Error syncing logs:", err);
      toast.error('Sync failed');
    }
  }
  return (
    <div className="p-4 flex flex-col space-y-6">
      <h1 className="text-2xl self-center font-semibold text-light-text-primary dark:text-dark-text-primary">
        Log History
      </h1>

      <section className="flex flex-col cursor-pointer sm:flex-row sm:items-center gap-2 text-yellow-700 dark:text-yellow-300">
        <button
          onClick={() => setShowSyncInfo(prev => !prev)}
          className="text-sm underline cursor-pointer"
          title="Click to learn about sync limitations"
        >
          ℹ️ Sync Limitations
        </button>
      </section>

      {showSyncInfo && (
        <section className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-400 p-4 rounded-xl shadow mt-2">
          <p className="text-sm text-yellow-800 dark:text-yellow-100">
           ⚠️ <strong>Sync Limitation:</strong> Due to platform constraints, CodeSync can only fetch your most recent activities (e.g., last 20 LeetCode submissions). Older contributions may not appear unless added manually.
            Logs for some platforms like GFG must also be added manually
          </p>
        </section>
      )}
       <section className="mt-4 flex justify-center">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-light-accent cursor-pointer text-light-text-primary dark:text-dark-text-primary dark:bg-dark-accent rounded-md hover:opacity-90"
        >
          + Add Log
        </button>
      </section>

      {/* Filter Controls */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRange('today')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer touch-manipulation duration-300 ${selectedRange === 'today' ? 'dark:bg-dark-accent bg-light-accent text-light-text-secondary dark:text-dark-text-secondary' : 'border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary'}`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedRange('week')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer touch-manipulation duration-300 ${selectedRange === 'week' ? 'dark:bg-dark-accent bg-light-accent text-light-text-secondary dark:text-dark-text-secondary' : 'border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary'}`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedRange('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer touch-manipulation duration-300 ${selectedRange === 'all' ? 'dark:bg-dark-accent bg-light-accent text-light-text-secondary dark:text-dark-text-secondary' : 'border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary'}`}
          >
            All Time
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border rounded-md border-light-border dark:border-dark-border bg-white text-light-text-secondary dark:text-dark-text-secondary dark:bg-darkbg text-sm"
          />
          <button 
            onClick={handleSync}
            className="px-3 py-1 bg-light-accent cursor-pointer touch-manipulation dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary rounded-md hover:opacity-90">
            Sync Logs
          </button>
        </div>
      </section>

      {/* Log Table */}
      <section className="overflow-x-auto  flex flex-wrap flex-col">
        <h1 className=" text-xl text-light-text-secondary dark:text-dark-text-secondary font-bold mb-3 place-self-center">Log Table</h1>
        {loading ? (
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">Loading...</p>
        ) : Object.keys(filteredLog).length === 0 ? (
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">No activity yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-light-surface dark:bg-dark-surface text-left text-light-text-secondary dark:text-dark-text-secondary">
                <th className="px-4 py-2 border border-light-border dark:border-dark-border">Date</th>
                <th className="px-4 py-2 border border-light-border dark:border-dark-border">Platform</th>
                <th className="px-4 py-2 border border-light-border dark:border-dark-border">Type</th>
                <th className="px-4 py-2 border border-light-border dark:border-dark-border">Details</th>
              </tr>
            </thead>
            <tbody className="text-light-text-primary dark:text-dark-text-primary">
              {Object.keys(filteredLog)
                .sort((a, b) => b.localeCompare(a))
                .map(date =>
                  filteredLog[date].map((item, idx) => (
                    <tr
                      key={`${date}-${idx}`}
                      className="sm:table-row block sm:border border-light-border dark:border-dark-border sm:border-0 sm:rounded-none rounded-lg overflow-hidden mb-4 sm:mb-0"
                    >
                      <td className="block sm:table-cell px-4 py-2 border border-light-border dark:border-dark-border">
                        <span className="sm:hidden font-semibold">Date: </span>{date}
                      </td>
                      <td className="block sm:table-cell px-4 py-2 border border-light-border dark:border-dark-border">
                        <span className="sm:hidden font-semibold">Platform: </span>{item.platform}
                      </td>
                      <td className="block sm:table-cell px-4 py-2 border border-light-border dark:border-dark-border">
                        <span className="sm:hidden font-semibold">Type: </span>{item.type || (item.platform === 'GitHub' ? 'Commit' : 'Solved Problem')}
                      </td>
                      <td className="block sm:table-cell px-4 py-2 border border-light-border dark:border-dark-border">
                        <span className="sm:hidden font-semibold">Details: </span>{item.title || item.message || '—'}
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        )}
      </section>

     

      {showModal && (
        <div className="fixed inset-0 text-light-text-secondary dark:text-dark-text-secondary bg-black/30 flex items-center justify-center z-50">
          <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Add Manual Log</h2>
            
            <select
              value={newLog.platform}
              onChange={(e) => setNewLog({ ...newLog, platform: e.target.value })}
              className="w-full p-2 border rounded-md bg-white dark:bg-darkbg border-light-border dark:border-dark-border"
            >
              <option value="">Select Platform</option>
              <option value="GitHub">GitHub</option>
              <option value="LeetCode">LeetCode</option>
              <option value="Codeforces">Codeforces</option>
              <option value="GFG">GFG</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              placeholder="Title or Problem Name"
              value={newLog.title}
              onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
              className="w-full p-2 border rounded-md bg-white dark:bg-darkbg border-light-border dark:border-dark-border"
            />

            <input
              type="text"
              placeholder="Optional Message"
              value={newLog.message}
              onChange={(e) => setNewLog({ ...newLog, message: e.target.value })}
              className="w-full p-2 border rounded-md bg-white dark:bg-darkbg border-light-border dark:border-dark-border"
            />

            <input
              type="text"
              placeholder="Optional Link"
              value={newLog.url}
              onChange={(e) => setNewLog({ ...newLog, url: e.target.value })}
              className="w-full p-2 border rounded-md bg-white dark:bg-darkbg border-light-border dark:border-dark-border"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black dark:bg-gray-700 dark:text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLog}
                className="px-4 py-2 bg-dark-accent text-white rounded-md hover:opacity-90"
              >
                Add Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogHistory