import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import useUserSettings from "../hooks/useUserSetting";
import { format } from 'date-fns';
import { useAuth } from "../context/AuthContext";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useAuth()
  const { nickname, dailyGoal, platforms, usernames,setting } = useUserSettings();
  // const [streak, setStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActivityDate, setLastActivityDate] = useState(0);
  const [todayStats, setTodayStats] = useState({ problems: 0, commits: 0 });
  const [lifetimeStats, setLifetimeStats] = useState({ problems: 0, commits: 0 });
  const [heatmapData, setHeatmapData] = useState([]);
  const [showSyncInfo, setShowSyncInfo] = useState(false);

const fetchStreakAndStats = useCallback(async () => {
  const userId = user?.uid;
  if (!userId) return;

  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  const data = snapshot.data();
  if (!data) return;


  setCurrentStreak(data.currentStreak ?? 0);
  setLongestStreak(data.longestStreak ?? 0);
  setLastActivityDate(data.lastActivityDate)

  const today = format(new Date(), 'yyyy-MM-dd');
  const logs = data.activityLog?.[today] ?? [];


  const problems = logs.filter(log => log.type === 'Solved Problem').length;
  const commits = logs.filter(log => log.type === 'Commit').length;


  setTodayStats({ problems, commits });

  let totalProblems = 0;
  let totalCommits = 0;

  if (data.activityLog) {
    Object.values(data.activityLog).forEach(dayLogs => {
      totalProblems += dayLogs.filter(log => log.type === 'Solved Problem').length;
      totalCommits += dayLogs.filter(log => log.type === 'Commit').length;
    });
  }

  setLifetimeStats({ problems: totalProblems, commits: totalCommits });

  // Debugging: Print all types for each day

  // Temporary fallback: count all logs as contributions
  const transformedHeatmapData = Object.entries(data.activityLog || {}).map(([date, logs]) => {
    return { date, count: logs.length };
  });
  setHeatmapData(transformedHeatmapData);
}, [user?.uid]);

useEffect(() => {
  fetchStreakAndStats();

  const handleRefresh = () => fetchStreakAndStats();

  const visibilityHandler = () => {
    if (document.visibilityState === 'visible') {
      fetchStreakAndStats();
    }
  };

  document.addEventListener('visibilitychange', visibilityHandler);
  window.addEventListener('log-added', handleRefresh);

  return () => {
    document.removeEventListener('visibilitychange', visibilityHandler);
    window.removeEventListener('log-added', handleRefresh);
  };
}, [fetchStreakAndStats, location.pathname]);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-4 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
      {/* Greeting and Streak Summary */}
      <section className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
        <h1 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
          {` Welcome back, ${nickname}!`}
        </h1>
        
      </section>

    
      {/* Streak Overview Card */}
      <section className="bg-light-surface flex gap-4 flex-wrap items-center dark:bg-dark-surface p-4 rounded-xl shadow  w-full md:max-w-md">
        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">🔥 Streak Overview</h2>

        <p className="text-base text-light-accent dark:text-dark-accent font-semibold">
          Current Streak: {currentStreak ?? 0} days
        </p>

        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Longest Streak: {longestStreak ?? 0} days
        </p>

        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Last Activity: {lastActivityDate || '—'}
        </p>

        {setting?.streakBrokenOn && (
          <p className="text-sm text-red-500">
            Streak broken on: {setting.streakBrokenOn}
          </p>)
        }

        {setting?.lastStreakUpdate && (
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Last updated: {new Date(setting.lastStreakUpdate).toLocaleString()}
          </p>
        )}
      </section>

      {/* Activity Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Problems Solved Today</p>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{todayStats.problems}</h2>
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">GitHub Commits Today</p>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{todayStats.commits}</h2>
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Current Goal</p>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{`Solve ${dailyGoal} problems/day`}</h2>
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow col-span-1 sm:col-span-2 lg:col-span-3">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">All Time Summary</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 text-light-text-primary dark:text-dark-text-primary">
            <p>🧠 Problems Solved: <span className="font-bold">{lifetimeStats.problems}</span></p>
            <p>🔧 Commits: <span className="font-bold">{lifetimeStats.commits}</span></p>
          </div>
        </div>
      </section>

      {/* Contribution Heatmap */}
      <section className="bg-light-surface  dark:bg-dark-surface p-4 rounded-xl shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-base font-bold text-light-text-primary dark:text-dark-text-primary">Contribution Heatmap</p>
          <button
            onClick={() => window.dispatchEvent(new Event('log-added'))}
            className="text-xs cursor-pointer px-3 py-1 rounded-md bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary hover:opacity-90"
          >
            Sync Now
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <CalendarHeatmap
              startDate={new Date(new Date().setDate(new Date().getDate() - 180))}
              endDate={new Date()}
              values={heatmapData}
              showWeekdayLabels={false}
              classForValue={value => {
                if (!value || value.count === 0) return 'color-empty';
                if (value.count >= 6) return 'color-scale-4';
                if (value.count >= 4) return 'color-scale-3';
                if (value.count >= 2) return 'color-scale-2';
                return 'color-scale-1';
              }}
              tooltipDataAttrs={value => {
                if (!value?.date) return { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': 'No activity' };
                const date = new Date(value.date);
                const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                return {
                  'data-tooltip-id': 'heatmap-tooltip',
                  'data-tooltip-content': `${formattedDate} — ${value.count ?? 0} contribution${value.count === 1 ? '' : 's'}`
                };
              }}
            />
          </div>
        </div>
        <ReactTooltip id="heatmap-tooltip" />
        <div className="mt-4 flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
          <span className="">Less</span>
          <span className="w-4 h-4 rounded-sm bg-[color:theme('colors.gray.200')] dark:bg-[color:theme('colors.dark.border')]"></span>
          <span className="w-4 h-4 rounded-sm bg-[color:theme('colors.green.200')]"></span>
          <span className="w-4 h-4 rounded-sm bg-[color:theme('colors.green.400')]"></span>
          <span className="w-4 h-4 rounded-sm bg-[color:theme('colors.green.600')]"></span>
          <span className="w-4 h-4 rounded-sm bg-[color:theme('colors.green.800')]"></span>
          <span className="">More</span>
        </div>
      </section>

      {/* Synced Platforms */}
      <section className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
        <p className="text-base font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Linked Platforms</p>
        {/* Later: map user's platforms and show sync status/toggles */}
        <div className="flex gap-4 flex-wrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {Object.keys(platforms).map((platform) => (
            <span key={platform}>
              {platforms[platform] ? '✅' : '❌'} {platform}
            </span>
          ))}
        </div>
      </section>

            {/* Sync Limitation Notice Toggle */}
      <section className="flex items-center gap-2">
        <button
          onClick={() => setShowSyncInfo(!showSyncInfo)}
          className="text-yellow-600 cursor-pointer dark:text-yellow-300 text-sm underline"
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


      <section className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
        <ul className="text-light-text-primary dark:text-dark-text-primary flex flex-col sm:flex-row gap-4">
          <li ><Link className="py-2 px-3 bg-light-accent dark:bg-dark-accent rounded-lg hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent" to='/log-history'>Add a log</Link></li>
          <li ><Link className="py-2 px-3 bg-light-accent dark:bg-dark-accent rounded-lg hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent" to='/stats'>Check Stats</Link></li>
          <li ><Link className="py-2 px-3 bg-light-accent dark:bg-dark-accent rounded-lg hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent" to='/setting'>Add Platform to track</Link></li>
          <li ><Link className="py-2 px-3 bg-light-accent dark:bg-dark-accent rounded-lg hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent" to='/setting'>Add Daily Goal</Link></li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;