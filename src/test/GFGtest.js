import { fetchGFGActivity } from '../services/GFGServices.js';

const testGFG = async () => {
  const username = 'chaudharyaz56m'; // replace with your actual GFG username
  const data = await fetchGFGActivity(username);
  console.log('📘 GFG Activity:', data);
};

testGFG();