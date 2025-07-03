import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { updateStreak } from '../utils/updateStreak.js';

import { fetchGitHubActivity } from './githubService.js';
import { fetchLeetCodeActivity } from './LeetcodeService.js';
import { fetchCodeforcesActivity } from './CodeForcesServices.js';

const fetchers = {
  Github: fetchGitHubActivity,
  LeetCode: fetchLeetCodeActivity,
  Codeforces: fetchCodeforcesActivity,
};

export const syncPlatformActivity = async (userId, platforms, usernames) => {
  const userRef = doc(db, 'users', userId);
  const existing = await getDoc(userRef);
  const existingLog = existing.data()?.activityLog || {};

  const activityLog = {};

  for (const platform in platforms) {
    if (!platforms[platform]) continue;

    const fetchActivity = fetchers[platform];
    const username = usernames[platform];

    if (!fetchActivity || !username) continue;

    try {
      const activities = await fetchActivity(username);

      activities.forEach(activity => {
        if (!activity?.date) {
          console.warn(`⚠️ Skipping invalid log from ${platform}:`, activity);
          return;
        }

        const date = activity.date;
        const logsForDate = existingLog[date] || [];

        const isDuplicate = logsForDate.some(
          log => log.platform === platform && log.title === activity.title && log.date === activity.date
        );
        if (isDuplicate) return;

        if (!activityLog[date]) activityLog[date] = [];
        activityLog[date].push(activity);
      });
    } catch (err) {
      console.error(`Sync failed for ${platform}:`, err.message);
    }
  }

  if (Object.keys(activityLog).length > 0) {
    const mergedLog = { ...existingLog };

    for (const date in activityLog) {
      if (!mergedLog[date]) {
        mergedLog[date] = activityLog[date];
      } else {
        mergedLog[date] = [...mergedLog[date], ...activityLog[date]];
      }
    }

    await setDoc(userRef, {
      activityLog: mergedLog,
    }, { merge: true });


    await updateStreak(userId);
  }

  return activityLog;
};