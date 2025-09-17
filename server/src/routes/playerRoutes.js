import express from 'express';
import { db } from '../config/firestore.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Create player profile
router.post('/players', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, age, position, availability, location } = req.body;
    const playerDoc = {
      name,
      age,
      position,
      availability,
      location,
      createdAt: new Date(),
    };
    await db.collection('players').doc(uid).set(playerDoc);
    res.status(201).json({ message: 'Successfully created player', id: uid, ...playerDoc });

  } catch (err) {
    console.error('Error creating player:', err);
    res.status(500).json({ error: 'The player could not be created' });
  }
});

// Get player profile
router.get('/players/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'me') {
      id = req.user.uid;
    }
    const doc = await db.collection('players').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json({ id: doc.id, ...doc.data() });

  } catch (err) {
    console.error('Error getting player:', err);
    res.status(500).json({ error: 'Could not get player' });
  }
});

// Update player profile
router.put('/players/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.uid !== id) {
      return res.status(403).json({ error: 'No permission to edit this player' });
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
    await db.collection('players').doc(id).update(updates);
    res.json({ message: 'Player updated successfully', updates });
    
  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).json({ error: 'Could not update player' });
  }
});

export default router;
