// test/githubTest.js
import { fetchGitHubActivity } from '../services/githubService.js';

const testGitHub = async () => {
  const username = 'Aditya-2315'; // replace with your fake GitHub username
  const dates = await fetchGitHubActivity(username);
  console.log('Activity dates:', dates);
};

testGitHub();