import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { format, subDays, isSameDay, isYesterday } from 'date-fns';

export const updateStreak = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return;

  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  const data = snapshot.data();
  const activityLog = data.activityLog || {};

  const allDates = Object.keys(activityLog).sort().reverse(); // most recent first

  let currentStreak = 0;
  let longestStreak = 0;
  let streakRunning = true;

  let expectedDate = new Date();

  for (const dateStr of allDates) {
    const currentDateStr = format(expectedDate, 'yyyy-MM-dd');
    if (dateStr === currentDateStr) {
      currentStreak++;
      expectedDate = subDays(expectedDate, 1);
    } else if (dateStr < currentDateStr) {
      streakRunning = false;
      break;
    }
  }

  longestStreak = Math.max(currentStreak, data.longestStreak || 0);
  const lastActivityDate = allDates.length > 0 ? allDates.reverse()[0] : null;

  const streakBrokenOn = currentStreak === 0 ? today : null;

  await setDoc(userRef, {
    currentStreak,
    longestStreak,
    lastActivityDate,
    lastStreakUpdate: now.toISOString(),
    ...(streakBrokenOn && { streakBrokenOn }),
  }, { merge: true });
};