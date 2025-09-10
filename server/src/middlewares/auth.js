import admin from 'firebase-admin';

export async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Required token' });
  const token = header.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}