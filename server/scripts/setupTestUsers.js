import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { admin } from '../src/config/firestore.js';

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
if (!FIREBASE_API_KEY) throw new Error('⚠️ FIREBASE_API_KEY is missing in .env');

const users = [
  {
    role: 'player',
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
    envVar: 'TEST_USER_TOKEN',
  },
  {
    role: 'adminField',
    email: process.env.TEST_FIELD_EMAIL,
    password: process.env.TEST_FIELD_PASSWORD,
    envVar: 'TEST_FIELD_TOKEN',
  },
];

async function signInOrRegister(email, password) {
  const url = (endpoint) =>
    `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${FIREBASE_API_KEY}`;
  // try login
  let res = await fetch(url('signInWithPassword'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  let data = await res.json();
  if (data.error) {
    if (data.error.message === 'EMAIL_NOT_FOUND') {
      console.log(`👉 User ${email} does not exist, creating...`);
      res = await fetch(url('signUp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      data = await res.json();
      if (data.error) throw new Error(data.error.message);
    } else {
      throw new Error(data.error.message);
    }
  }
  return { idToken: data.idToken, uid: data.localId };
}

async function setRole(uid, role) {
  await admin.auth().setCustomUserClaims(uid, { role });
  console.log(`✅ Role '${role}' assigned to ${uid}`);
}

async function run() {
  const envPath = path.resolve(process.cwd(), '.env');
  let envContent = fs.readFileSync(envPath, 'utf-8');
  for (const u of users) {
    if (!u.email || !u.password) {
      console.log(`⚠️ Credentials for ${u.role} are missing`);
      continue;
    }
    console.log(`👉 Processing ${u.role} (${u.email})...`);
    const { idToken, uid } = await signInOrRegister(u.email, u.password);
    if (u.role !== 'player') {
      await setRole(uid, u.role);
    }
    // save token in .env
    const regex = new RegExp(`^${u.envVar}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${u.envVar}=${idToken}`);
    } else {
      envContent += `\n${u.envVar}=${idToken}`;
    }
  }
  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log('📝 Tokens updated in .env');
}

run().catch((err) => console.error('❌', err.message));
