import { fetchLeetCodeActivity } from '../services/LeetcodeService.js';

const testLeetCode = async () => {
  const username = 'leetcode'; // 🔁 Known valid username
  const activity = await fetchLeetCodeActivity(username);
  console.log('📅 LeetCode Activity:', activity);
};

testLeetCode();