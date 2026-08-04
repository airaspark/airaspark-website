import express from 'express';
import bcrypt from 'bcryptjs';
import { auth, firestore } from '../firebaseAdmin.js';

const router = express.Router();

function normalizePortalId(id) {
  return (id || '').trim().toUpperCase();
}

router.post('/login', async (req, res) => {
  try {
    const { portalId, password } = req.body || {};
    if (!portalId || !password) {
      return res.status(400).json({ success: false, message: 'portalId and password are required' });
    }

    const loginId = normalizePortalId(portalId);
    let collectionName = null;
    let idField = null;

    if (loginId.startsWith('ADM-')) {
      collectionName = 'admins';
      idField = 'adminId';
    } else if (loginId.startsWith('STF-')) {
      collectionName = 'staff';
      idField = 'staffId';
    } else if (loginId.startsWith('ASC-')) {
      collectionName = 'customers';
      idField = 'customerId';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid Portal ID format' });
    }

    const q = firestore.collection(collectionName).where(idField, '==', loginId).limit(1);
    const snap = await q.get();
    if (snap.empty) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const doc = snap.docs[0];
    const data = doc.data();

    // Check active flags in a forgiving way
    if (typeof data.active === 'boolean' && !data.active) {
      return res.status(403).json({ success: false, message: 'Inactive account' });
    }
    if (typeof data.isActive === 'boolean' && !data.isActive) {
      return res.status(403).json({ success: false, message: 'Inactive account' });
    }
    if (typeof data.status === 'string' && data.status.toLowerCase() !== 'active') {
      return res.status(403).json({ success: false, message: 'Inactive account' });
    }

   // Password verification (Admin, Staff, Customer)
let valid = false;

const hash = data.passwordHash;

if (!hash) {
  return res.status(500).json({
    success: false,
    message: "Password has not been configured for this account."
  });
}

valid = await bcrypt.compare(password, hash);

if (!valid) {
  return res.status(401).json({
    success: false,
    message: "Incorrect password"
  });
}

    // Staff first login handling
    if (collectionName === 'staff' && data.profileCompleted === false) {
      // Let client handle first-login flow
      return res.json({ success: false, code: 'FIRST_LOGIN', role: 'staff', entityId: doc.id, staffId: data.staffId });
    }

    // Determine email / uid for creating custom token
    const email = (data.authEmail || data.email || null);
    let targetUid = data.firebaseUid || null;

    if (!targetUid && email) {
      try {
        const userRecord = await auth.getUserByEmail(email);
        targetUid = userRecord.uid;
      } catch (err) {
        // user not found; create silently
        try {
          const created = await auth.createUser({
            email,
            emailVerified: true,
            displayName: data.name || undefined,
          });
          targetUid = created.uid;
        } catch (createErr) {
          console.error('Failed to create firebase user:', createErr);
          return res.status(500).json({ success: false, message: 'Failed to provision user' });
        }
      }
    }

    if (!targetUid) {
      // fallback: create a synthetic firebase user with unique email-like id
      try {
        const created = await auth.createUser({
          displayName: data.name || loginId,
        });
        targetUid = created.uid;
      } catch (err) {
        console.error('Failed creating fallback user', err);
        return res.status(500).json({ success: false, message: 'Failed to provision user' });
      }
    }

    // Ensure Firestore mapping of firebaseUid exists
    if (data.firebaseUid !== targetUid) {
      try {
        await firestore.collection(collectionName).doc(doc.id).update({ firebaseUid: targetUid, updatedAt: new Date() });
      } catch (e) {
        // non-fatal
        console.error('Failed to update firebaseUid mapping:', e);
      }
    }

    // Create custom token
    const customToken = await auth.createCustomToken(targetUid, { role: collectionName === 'admins' ? 'admin' : collectionName === 'staff' ? 'staff' : 'customer' });

    return res.json({
      success: true,
      role: collectionName === 'admins' ? 'admin' : collectionName === 'staff' ? 'staff' : 'customer',
      customToken,
      entityId: doc.id,
      redirect: '/portal'
    });
  } catch (err) {
    console.error('Auth login error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
