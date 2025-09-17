import 'dotenv/config';

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api/v1';
const ID_TOKEN = process.env.TEST_USER_TOKEN;

async function runTests() {
  try {
    // create player profile
    console.log('👉 Creating player profile...');
    let res = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ID_TOKEN}`,
      },
      body: JSON.stringify({
        name: 'Jon Doe',
        age: 20,
        position: ['DC'],
        availability: ['Monday'],
        location: 'Valencia',
      }),
    });
    const playerData = await res.json();
    console.log('✅ Player:', playerData);

    // get player
    console.log('👉 Getting player...');
    res = await fetch(`${API_BASE}/players/${playerData.id || 'me'}`, {
      headers: { Authorization: `Bearer ${ID_TOKEN}` },
    });
    console.log('✅ Player data:', await res.json());

  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

runTests();