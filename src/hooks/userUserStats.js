import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { format } from 'date-fns';

const knownPlatforms = ['LeetCode', 'GitHub', 'GFG', 'Codeforces'];

const useUserStats = () => {
  const { user } = useAuth();
  const [longestStreak, setLongestStreak] = useState(0);
  const [lifetimeStats, setLifetimeStats] = useState({ problems: 0, commits: 0 });
  const [platformStats, setPlatformStats] = useState({});
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchStreakAndStats = useCallback(async () => {
    const userId = user?.uid;
    if (!userId) return;

    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    const data = snapshot.data();
    if (!data) return;

    setLongestStreak(data.longestStreak ?? 0);

    let totalProblems = 0;
    let totalCommits = 0;
    const platformSummary = {};
    let monthlySummary = {};  // For monthly chart
    let pieSummary = {};      // For pie chart

    if (data.activityLog) {
      Object.entries(data.activityLog).forEach(([date, dayLogs]) => {
        const month = format(new Date(date), 'MMM');

        if (!monthlySummary[month]) {
          monthlySummary[month] = { month, problems: 0, commits: 0 };
        }

        dayLogs.forEach(log => {
          const { type, platform = 'Other' } = log;
          const key = knownPlatforms.includes(platform) ? platform : 'Other';

          if (!platformSummary[key]) {
            platformSummary[key] = { problems: 0, commits: 0 };
          }

          if (!pieSummary[key]) {
            pieSummary[key] = { platform: key, problems: 0, commits: 0 };
          }

          if (type === 'Solved Problem') {
            totalProblems++;
            platformSummary[key].problems++;
            pieSummary[key].problems++;
            monthlySummary[month].problems++;
          } else if (type === 'Commit') {
            totalCommits++;
            platformSummary[key].commits++;
            pieSummary[key].commits++;
            monthlySummary[month].commits++;
          }
        });
      });
    }

    setLifetimeStats({ problems: totalProblems, commits: totalCommits });
    setPlatformStats(platformSummary);
    setMonthlyChartData(Object.values(monthlySummary));
    setPieChartData(Object.values(pieSummary));

  }, [user?.uid]);

  useEffect(() => {
    fetchStreakAndStats();
  }, [fetchStreakAndStats]);

  return { longestStreak, lifetimeStats, platformStats, monthlyChartData, pieChartData };
};

export default useUserStats;