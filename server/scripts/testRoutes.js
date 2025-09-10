import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.FIREBASE_API_KEY;

// Test user
const email = 'test@example.com';
const password = '123456';

// Firebase Auth endpoint
const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

async function main() {
  try {
    // 1. login with Firebase Auth REST API
    const res = await fetch(signInUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const idToken = data.idToken;
    console.log("✅ ID Token:", idToken.slice(0, 30) + "...");
    // 2. test protected route
    const privateRes = await fetch('http://localhost:4000/api/v1/private', {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    console.log("🔒 Private route:", await privateRes.json());
    // 3. test role-protected route
    const adminRes = await fetch('http://localhost:4000/api/v1/fields/admin', {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    console.log("🛡️ Admin route:", await adminRes.json());
  } catch (err) {
    console.error("❌ Error:", err.message);
  } 
}

main();

