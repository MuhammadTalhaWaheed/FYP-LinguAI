const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const app = express();
const PORT = 3000;

app.use(express.json()); 
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://linguaai-ab6ae-default-rtdb.firebaseio.com"
});

const db = admin.database();
const storage = admin.storage();

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save the new user
    const newUser = { fullName, email, passwordHash };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Forgot password endpoint
app.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Update password
    user.passwordHash = await bcrypt.hash(newPassword, 10);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

// Recording endpoint
app.post('/recording', async (req, res) => {
  const { audioUri } = req.body;

  try {
    // You can add logic here to store the audioUri to Firebase if needed
    res.status(200).json({ message: 'Recording received successfully!' });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error saving recording', error: error.message });
  }
});

// Answers endpoint
app.post('/answers', async (req, res) => {
  const { questionId, answerUri, answerText, selectedOption } = req.body;

  try {
    if (questionId === 2) {
      await db.ref('answers').push({
        questionId,
        answerUri: answerUri,
        answerText: answerText,
      });
    } else if (questionId === 4) {
      await db.ref('answers').push({
        questionId,
        selectedOption: selectedOption,
      });
    } else if (questionId === 5) {
      await db.ref('answers').push({
        questionId,
        answerText: answerText,
      });
    }

    res.status(200).json({ message: 'Answer saved successfully!' });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error saving answer', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
