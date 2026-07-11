import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { encrypt, decrypt } from './encryption.js';
import { auth, firestore } from './firebaseAdmin.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const mockDatabase = {};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Airaspark Server Running' });
});

// --- NEW ENCRYPTION ROUTES BELOW ---

// 2. Route to receive frontend data and encrypt the sensitive parts
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!message) {
      return res.status(400).json({ error: 'Message is required' });
  }

  // Encrypt the sensitive message using AES-256-GCM
  const encryptedPayload = encrypt(message);

  // Generate a mock ID to save the entry
  const entryId = Date.now().toString();

  // Save the securely encrypted message to the mock database
  mockDatabase[entryId] = {
      name,
      email,
      secureMessage: encryptedPayload // Stores { iv, encryptedData, authTag }
  };

  console.log('Saved Encrypted Data to DB:', mockDatabase[entryId]);

  res.status(201).json({ 
      status: 'success', 
      message: 'Message securely encrypted and saved.',
      id: entryId
  });
});

// 3. Route to decrypt the data when an authorized user needs to read it
app.get('/api/contact/:id', (req, res) => {
  const entryId = req.params.id;
  const record = mockDatabase[entryId];

  if (!record) {
      return res.status(404).json({ error: 'Record not found' });
  }

  try {
      // Decrypt the secure message back into readable text
      const decryptedMessage = decrypt(record.secureMessage);

      // Send the decrypted data back
      res.json({
          name: record.name,
          email: record.email,
          message: decryptedMessage
      });
  } catch (error) {
      console.error("Decryption failed:", error);
      res.status(500).json({ error: 'Failed to decrypt data.' });
  }
});
// ==============================
// CREATE CUSTOMER API
// ==============================
app.post('/api/customers', async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      password,
    } = req.body;

    if (!name || !company || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // Create Firebase Authentication user
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Temporary Customer ID
    const customerId = `ASC-${new Date().getFullYear()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    // Save customer in Firestore
    await firestore.collection('customers').doc(user.uid).set({
      customerId,
      firebaseUid: user.uid,
      authEmail: email,

      name,
      company,
      email,
      phone,

      assignedStaffIds: [],
      isActive: true,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Customer created successfully.',
      uid: user.uid,
      customerId,
    });
  } catch (error) {
    console.error('Create Customer Error:', error);

    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists.',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create customer.',
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});