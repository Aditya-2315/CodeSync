import axios from 'axios';
import { format } from 'date-fns';

/**
 * Fetches commit activity from GitHub public events API
 * @param {string} username - GitHub username
 * @returns {Promise<Object[]>} - Array of activity objects
 */
export const fetchGitHubActivity = async (username) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}/events/public`);
    const events = res.data;

    const pushEvents = events.filter(event => event.type === 'PushEvent');

    const activity = [];

    pushEvents.forEach(event => {
      const { repo, payload, created_at } = event;
      const date = format(new Date(created_at), 'yyyy-MM-dd');
      const repoName = repo.name;

      payload.commits?.forEach(commit => {
        activity.push({
          platform: 'GitHub',
          repo: repoName,
          type:'Commit',
          message: commit.message,
          hash: commit.sha,
          url: `https://github.com/${repoName}/commit/${commit.sha}`,
          date,
          source:'sync',
        });
      });
    });

    return activity;
  } catch (error) {
    console.error('GitHub Activity Fetch Error:', error.message);
    return [];
  }
};