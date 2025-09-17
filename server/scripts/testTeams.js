import 'dotenv/config';

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api/v1';
const ID_TOKEN = process.env.TEST_USER_TOKEN;

async function runTests() {
  try {
    // create team
    console.log('👉 Creating team...');
    let res = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ID_TOKEN}`,
      },
      body: JSON.stringify({ name: 'The Champions' }),
    });
    const teamData = await res.json();
    console.log('✅ Team:', teamData);

    // get team
    console.log('👉 Getting team...');
    res = await fetch(`${API_BASE}/teams/${teamData.id}`, {
      headers: { Authorization: `Bearer ${ID_TOKEN}` },
    });
    console.log('✅ Team data:', await res.json());

  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

runTests();