import express from 'express';
import { db } from '../config/firestore.js';
import { verifyToken } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';

const router = express.Router();

// Create field
router.post('/fields', verifyToken, requireRole('adminField'), async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, location, address, fieldType, schedules } = req.body;
    const fieldRef = db.collection('fields').doc();
    const fieldData = {
      name,
      adminUid: uid,
      location,
      address,
      fieldType,
      schedules,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await fieldRef.set(fieldData);
    res.status(201).json({ id: fieldRef.id, ...fieldData });

  } catch (err) {
    console.error('Error creating field:', err);
    res.status(500).json({ error: 'The field could not be created' });
  }
});

// Get field
router.get('/fields/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('fields').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json({ id: doc.id, ...doc.data() });

  } catch (err) {
    console.error('Error getting field:', err);
    res.status(500).json({ error: 'Could not get field' });
  }
});

// Update field
router.put('/fields/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, schedules } = req.body;
    const doc = await db.collection('fields').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Field not found" });
    }
    const field = doc.data();
    if (field.adminUid !== req.user.uid) {
      return res.status(403).json({ error: 'No permission to edit this field' });
    }
    const updates = {
      ...(name && { name }),
      ...(address && { address }),
      ...(schedules && { schedules }),
      updatedAt: new Date(),
    };
    await db.collection('fields').doc(id).update(updates);
    res.json({ message: "Field updated successfully", updates });
    
  } catch (err) {
    console.error('Error updating Field:', err);
    res.status(500).json({ error: 'Could not update Field' });
  }
});

export default router;