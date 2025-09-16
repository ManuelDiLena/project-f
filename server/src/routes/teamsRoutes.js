import express from 'express';
import { db } from '../config/firestore.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Create a team
router.post('/teams', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { name } = req.body;
    const teamRef = db.collection('teams').doc();
    const teamData = {
      name,
      adminUid: uid,
      members: [uid],
      stats: { matchesPlayed: 0, wins: 0, losses: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await teamRef.set(teamData);
    res.status(201).json({ id: teamRef.id, ...teamData });
    
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ error: 'The team could not be created' });
  }
});

// Get team
router.get('/teams/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('teams').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ id: doc.id, ...doc.data() });

  } catch (err) {
    console.error('Error getting team:', err);
    res.status(500).json({ error: 'Could not get team' });
  }
});

// Update team
router.put('/teams/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const doc = await db.collection('teams').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Team not found" });
    }
    const team = doc.data();
    if (team.adminUid !== req.user.uid) {
      return res.status(403).json({ error: 'No permission to edit this team' });
    }
    const updates = {
      ...(name && { name }),
      updatedAt: new Date(),
    };
    await db.collection('teams').doc(id).update(updates);
    res.json({ message: "Team updated successfully", updates });

  } catch (err) {
    console.error('Error updating team:', err);
    res.status(500).json({ error: 'Could not update team' });
  }
});

export default router;