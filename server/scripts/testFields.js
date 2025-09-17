import 'dotenv/config';

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api/v1';
const ID_TOKEN = process.env.TEST_USER_TOKEN;
const ADMIN_FIELD_TOKEN = process.env.TEST_FIELD_TOKEN;

async function runTests() {
  try {
    // create field
    console.log('👉 Creating field...');
    let res = await fetch(`${API_BASE}/fields`, {
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
    const fieldData = await res.json();
    console.log('✅ Field:', fieldData);

    // get field
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