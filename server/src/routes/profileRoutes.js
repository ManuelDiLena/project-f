import express from 'express';
import { db } from '../config/firestore.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Create player profile
router.post('/users', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, age, position, availability, location } = req.body;
    const userDoc = {
      name,
      age,
      position,
      availability,
      location,
      createdAt: new Date(),
    };
    await db.collection('users').doc(uid).set(userDoc);
    res.status(201).json({ message: 'Successfully created profile', user: userDoc });
  } catch (err) {
    console.error('Error creating profile:', err);
    res.status(500).json({ error: 'The profile could not be created' });
  }
});

// Get player profile
router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Error getting profile:', err);
    res.status(500).json({ error: 'Could not get profile' });
  }
});

// Update player profile
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.uid !== id) {
      return res.status(403).json({ error: 'No permission to edit this profile' });
    }
    const { name, age, position, availability, location } = req.body;
    const updates = {
      ...(name && { name }),
      ...(age && { age }),
      ...(position && { position }),
      ...(availability && { availability }),
      ...(location && { location }),
      updatedAt: new Date(),
    };
    await db.collection('users').doc(id).update(updates);
    res.json({ message: 'Profile updated successfully', updates });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Could not update profile' });
  }
});

export default router;
