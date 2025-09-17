import 'dotenv/config';

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api/v1';
const ID_TOKEN = process.env.TEST_USER_TOKEN;

async function runTests() {
  try {
    // create match
    console.log('👉 Creating match...');
    let res = await fetch(`${API_BASE}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ID_TOKEN}`,
      },
      body: JSON.stringify({
        teams: [],
        players: [],
        location: 'Valencia',
        date: new Date().toISOString(),
        matchType: 'F7',
      }),
    });
    const matchData = await res.json();
    console.log('✅ Match created:', matchData);

    // get matches
    console.log('👉 Getting matches...');
    res = await fetch(`${API_BASE}/matches?location=Valencia`, {
      headers: { Authorization: `Bearer ${ID_TOKEN}` },
    });
    const matches = await res.json();
    console.log('✅ Matches found:', matches);

  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

runTests();