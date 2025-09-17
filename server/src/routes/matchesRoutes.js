import express from 'express';
import { db } from '../config/firestore.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Create match
router.post('/matches', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { teams = [], players = [], location, date, matchType } = req.body;
    if (!location || !date) {
      return res.status(400).json({ error: 'Location and date are required' });
    }
    const matchRef = db.collection('matches').doc();
    const matchData = {
      createdBy: uid,
      teams,
      players,
      location,
      date: new Date(date),
      matchType,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await matchRef.set(matchData);
    res.status(201).json({ id: matchRef.id, ...matchData });

  } catch (err) {
    console.error('Error creating match:', err);
    res.status(500).json({ error: 'The match could not be created' });
  }
});

// Get matches
router.get('/matches', verifyToken, async (req, res) => {
  try {
    let query = db.collection('matches');
    const { status, location, matchType } = req.query;
    if (status) {
      query = query.where('status', '==', status);
    }
    if (location) {
      query = query.where('location', '==', location);
    }
    if (matchType) {
      query = query.where('matchType', '==', matchType);
    }
    const snapshot = await query.get();
    const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data }));
    res.json(matches);

  } catch (err) {
    console.error('Error getting matches:', err);
    res.status(500).json({ error: 'Could not get matches' });
  }
});

export default router;