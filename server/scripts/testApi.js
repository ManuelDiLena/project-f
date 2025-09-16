import 'dotenv/config';

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api/v1';
const ID_TOKEN = process.env.TEST_USER_TOKEN;
const ADMIN_FIELD_TOKEN = process.env.TEST_FIELD_TOKEN;

async function runTests() {
  try {
    // create user profile
    console.log('👉 Creating user profile...');
    let res = await fetch(`${API_BASE}/users`, {
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
    let userData = await res.json();
    console.log('✅ User:', userData);
    // create team
    console.log('👉 Creating team...');
    res = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ID_TOKEN}`,
      },
      body: JSON.stringify({ name: 'The Champions' }),
    });
    let teamData = await res.json();
    console.log('✅ Team:', teamData);
    // create field
    console.log('👉 Creating field...');
    res = await fetch(`${API_BASE}/fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_FIELD_TOKEN}`,
      },
      body: JSON.stringify({
        name: 'Alameda',
        location: 'Valencia',
        address: 'Av. Siempreviva 123',
        fieldType: ['F7', 'F11'],
        schedules: ['Monday 18-22', 'Friday 18-22'],
      }),
    });
    let fieldData = await res.json();
    console.log('✅ Field:', fieldData);
    // read all
    console.log('👉 Getting user...');
    res = await fetch(`${API_BASE}/users/${userData.id || 'me'}`, {
      headers: { Authorization: `Bearer ${ID_TOKEN}` },
    });
    console.log('✅ User data:', await res.json());
    console.log('👉 Getting team...');
    res = await fetch(`${API_BASE}/teams/${teamData.id}`, {
      headers: { Authorization: `Bearer ${ID_TOKEN}` },
    });
    console.log('✅ Team data:', await res.json());
    console.log('👉 Getting field...');
    res = await fetch(`${API_BASE}/fields/${fieldData.id}`, {
      headers: { Authorization: `Bearer ${ADMIN_FIELD_TOKEN}` },
    });
    console.log('✅ Field data:', await res.json());

  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

runTests();