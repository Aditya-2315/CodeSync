export const fetchLeetCodeActivity = async (username) => {
  try {
    const res = await fetch(`https://leetcode-proxy-one.vercel.app/api/leetcode?username=${username}`);
    const submissions = await res.json();

    const activity = submissions.map(sub => ({
      platform: 'LeetCode',
      title: sub.title,
      url: `https://leetcode.com/problems/${sub.titleSlug}`,
      date: new Date(Number(sub.timestamp) * 1000).toISOString().split('T')[0],
      type: 'Solved Problem',
      source:'sync',
    }));
    return activity;
  } catch (error) {
    console.error('LeetCode fetch error:', error.message);
    return [];
  }
};