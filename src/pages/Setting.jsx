import { useAuth } from "../context/AuthContext"
import { requestNotificationPermission } from "../utils/requestNotificationPermission"
import { useEffect, useState } from "react"
import { db } from "../Firebase";
import { setDoc,doc,getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { GithubAuthProvider, GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
import { resetSyncedLogs } from "../utils/resetSyncedLogs";

const Setting = () => {
  const {user} = useAuth()
  const connectedProviders = user?.providerData.map(p => p.providerId) || [];
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [platforms,setPlatforms] = useState({
    Github:false,
    LeetCode: false,
    GFG: false,
    CodeForces:false,
  })
  const [usernames,setUsernames] = useState({
     Github:'',
    LeetCode: '',
    GFG: '',
    CodeForces:'',
  })
  const [originalUsernames, setOriginalUsernames] = useState({});
  const [dailyGoal,setDailyGoal] = useState(1)
  const [nickname, setNickname] = useState('');

  const linkGitHub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await linkWithPopup(auth.currentUser, provider);
      const nickname = result.user.reloadUserInfo?.screenName || result.user.displayName || '';
      const userRef = doc(db, 'users', result.user.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists() || !snapshot.data().nickname) {
        await setDoc(userRef, { nickname }, { merge: true });
      }
      toast.success("GitHub account linked!");
      window.location.reload();
    } catch (err) {
      toast.error("Linking failed: " + err.message);
    }
  };

  const handleDailyGoalChange = async()=>{
    await setDoc(doc(db,'users',user.uid),{dailyGoal},{merge:true})
    toast.success(' Daily goal updated')
  }

  const linkGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await linkWithPopup(auth.currentUser, provider);
      const nickname = result.user.displayName || '';
      const userRef = doc(db, 'users', result.user.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists() || !snapshot.data().nickname) {
        await setDoc(userRef, { nickname }, { merge: true });
      }
      toast.success("Google account linked!");
      window.location.reload();
    } catch (err) {
      toast.error("Linking failed: " + err.message);
    }
  };

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);

      let defaultPlatforms = {
        Github: false,
        LeetCode: false,
        GFG: false,
        CodeForces: false,
      };
      let defaultUsernames = {
        Github: '',
        LeetCode: '',
        GFG: '',
        CodeForces: '',
      };

      if (snapshot.exists()) {
        const data = snapshot.data();
        const fetchedPlatforms = { ...defaultPlatforms, ...(data.platforms || {}) };
        const fetchedUsernames = { ...defaultUsernames, ...(data.usernames || {}) };
        setDailyGoal(data.dailyGoal??1)
        setNickname(data.nickname ?? '');
        setNotificationsEnabled(data.notificationsEnabled ?? false);

        const isGitHubUser = user.providerData.some(p => p.providerId === 'github.com');
        if (isGitHubUser) {
          fetchedPlatforms.Github = true;
          fetchedUsernames.Github = fetchedUsernames.Github || user.reloadUserInfo?.screenName || user.displayName || '';
          await setDoc(userRef, {
            platforms: fetchedPlatforms,
            usernames: fetchedUsernames,
          }, { merge: true });
        }

        const validKeys = ['Github', 'LeetCode', 'GFG', 'CodeForces'];
        const cleanedPlatforms = Object.fromEntries(
          Object.entries(fetchedPlatforms).filter(([key]) => validKeys.includes(key))
        );
        const cleanedUsernames = Object.fromEntries(
          Object.entries(fetchedUsernames).filter(([key]) => validKeys.includes(key))
        );

        if (
          Object.keys(cleanedPlatforms).length !== Object.keys(fetchedPlatforms).length ||
          Object.keys(cleanedUsernames).length !== Object.keys(fetchedUsernames).length
        ) {
          await setDoc(userRef, {
            platforms: cleanedPlatforms,
            usernames: cleanedUsernames,
          }, { merge: true });
        }

        setPlatforms(cleanedPlatforms);
        setUsernames(cleanedUsernames);
        setOriginalUsernames(cleanedUsernames);
      } else {
        await setDoc(userRef, {
          platforms: defaultPlatforms,
          usernames: defaultUsernames,
        });
        setPlatforms(defaultPlatforms);
        setUsernames(defaultUsernames);
        setOriginalUsernames(defaultUsernames);
      }
    };

    fetchPreferences();
  }, [user]);

  const handlePlatformChange = async (platform) => {
    const isBeingDisabled = platforms[platform];
    const updatedPlatforms = {
      ...platforms,
      [platform]: !platforms[platform]
    };

    if (isBeingDisabled) {
      const confirmReset = window.confirm(
        `Disabling ${platform} will remove all synced logs from this platform (manual logs will be preserved). Do you want to continue?`
      );
      if (!confirmReset) return;

      await resetSyncedLogs(user.uid,platform);
      toast.info(`${platform} disabled and synced logs cleared.`);
    } else {
      toast.success(`${platform} enabled.`);
    }

    setPlatforms(updatedPlatforms);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { platforms: updatedPlatforms }, { merge: true });
    }
  }

  const handleUsernameChange = async (platform, value) => {
    if (value === originalUsernames[platform]) return;

    const updatedUsernames = {
      ...usernames,
      [platform]: value,
    };

    const confirmReset = window.confirm(
      `Changing your ${platform} username will reset all previously synced logs from that platform (manual logs will be preserved). Do you want to continue?`
    );

    if (!confirmReset) {
      setUsernames({ ...usernames, [platform]: originalUsernames[platform] });
      return;
    }

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { usernames: updatedUsernames }, { merge: true });
      setUsernames(updatedUsernames);
      setOriginalUsernames(updatedUsernames);
      await resetSyncedLogs(user.uid, platform);
      toast.success(`${platform} username updated and synced logs reset.`);
    }
  };
  

  const toggleNotifications = async () => {
    const updatedValue = !notificationsEnabled;
    setNotificationsEnabled(updatedValue);

    if (user) {
      await setDoc(doc(db, 'users', user.uid), { notificationsEnabled: updatedValue }, { merge: true });
    }

    if (updatedValue) {
      await requestNotificationPermission();
      toast.success('Streak notifications enabled');
    } else {
      toast.info('Streak notifications disabled');
    }
  };
  return (
    <div className="max-w-2xl p-4 flex  flex-col space-y-6">
      <h1 className=" text-light-text-primary self-center dark:text-dark-text-primary text-4xl">Setting</h1>

      <div className=" bg-light-bg border border-light-border dark:border-light-border dark:bg-dark-surface rounded-xl p-4 shadow-2xs shadow-light-accent dark:shadow-dark-accent">
        <p className=" text-light-text-primary dark:text-dark-text-primary font-medium">Account</p>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">Email:  {user?.email}</p>
        <div className="text-sm mt-2 text-light-text-secondary dark:text-dark-text-secondary">
          Connected Accounts:
          <div>
          <span className='ml-2'>
            {connectedProviders.includes('google.com') ? '🟢 Google' : '🔴 Google'}
          </span>
          {!connectedProviders.includes('google.com') && (
            <button
              onClick={linkGoogle}
              className="ml-2 text-sm text-dark-accent cursor-pointer dark:text-light-accent underline"
            >
              Link Google
            </button>
          )}
          <span className="ml-2">
            {connectedProviders.includes('github.com') ? '🟢 GitHub' : '🔴 GitHub'}
          </span>
          {!connectedProviders.includes('github.com') && (
            <button
              onClick={linkGitHub}
              className="ml-2 text-sm text-dark-accent cursor-pointer dark:text-light-accent underline"
            >
              Link GitHub
            </button>
          )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
            Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="mt-1 w-full rounded-md border border-light-border dark:border-dark-border p-2 bg-white dark:bg-darkbg text-light-text-primary dark:text-dark-text-primary"
          />
          <button
            onClick={async () => {
              if (!user) return;
              await setDoc(doc(db, 'users', user.uid), { nickname }, { merge: true });
              toast.success('Nickname updated');
            }}
            className="mt-2 px-3 py-1 rounded-md cursor-pointer bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary text-sm hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent"
          >
            Save Nickname
          </button>
        </div>
      </div>
      <div className="bg-light-bg border border-light-border dark:border-light-border dark:bg-dark-surface rounded-xl p-4 shadow-2xs shadow-light-accent dark:shadow-dark-accent">
        <div className="flex justify-between items-center">

        <div>
          <p className="text-light-text-primary dark:text-dark-text-primary font-medium">Streak Alerts</p>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Get notified if you forget to log activity.
            </p>
        </div>
        <button 
        onClick={toggleNotifications}
        className=" bg-light-accent dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary px-2 py-1 rounded-lg cursor-pointer hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent">{notificationsEnabled?'Disable':'Enable'}</button>
        </div>
      </div>

      <div className="bg-light-surface border border-light-border dark:border-dark-text-secondary dark:bg-dark-surface shadow-light-accent dark:shadow-dark-accent rounded-xl p-4 shadow-2xs space-y-3">
          <p className="text-base text-light-text-primary dark:text-dark-text-primary font-medium">Daily Goal</p>
          <label className="block text-sm text-light-text-secondary dark:text-dark-text-secondary">
            How many problems do you want to solve per day?
          </label>
          <input
            type="number"
            min="1"
            value={dailyGoal}
            onChange={(e)=> setDailyGoal(Number(e.target.value))}
            className="w-full rounded-md border border-light-border dark:border-dark-border p-2 bg-white dark:bg-darkbg text-light-text-primary dark:text-dark-text-primary"
          />
          <button onClick={handleDailyGoalChange} className="bg-light-accent cursor-pointer hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent dark:text-dark-text-primary rounded-lg px-2 py-1 dark:bg-dark-accent">Save</button>
        </div>
         <div className="bg-light-surface border shadow-light-accent dark:shadow-dark-accent border-light-text-secondary dark:border-dark-text-secondary dark:bg-dark-surface rounded-xl p-4 shadow-2xs space-y-2">
        <p className="text-base text-light-text-primary dark:text-dark-text-primary font-medium mb-2">Track Platforms</p>
        <div className="space-y-4">
         {Object.keys(platforms).map(platform=>(
          <div key = {platform} className="space-y-1 flex gap-3 text-light-text-secondary dark:text-dark-text-secondary">
            <label className="flex items-center space-x-2">
              <input 
              checked={platforms[platform]}
              onChange={()=> handlePlatformChange(platform)}
              className=" accent-light-accent dark:accent-dark-accent"
              type="checkbox" />
              <span>{platform}</span>
            </label>
            {platforms[platform] && (
              <div className="flex gap-4 items-center">
                <input
                  value={usernames[platform] || ''}
                  placeholder={`username / URL`}
                  className="w-full px-3 py-1 border border-light-border dark:border-dark-border rounded-lg"
                  onChange={(e) =>
                    setUsernames((prev) => ({ ...prev, [platform]: e.target.value }))
                  }
                  type="text"
                />
                <button
                  onClick={() => handleUsernameChange(platform, usernames[platform])}
                  className="px-2 py-1 bg-light-accent cursor-pointer dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary rounded-lg hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent"
                >
                  Save
                </button>
              </div>
            )}
          </div>
         ))}
        </div>
      </div> 
    </div>
  )
}

export default Setting