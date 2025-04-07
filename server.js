const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/submit-data', async (req, res) => {
  const users = req.body;
  console.log('Received JSON from client:', users);

  // Replace with your actual token or retrieve from environment/config
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2NkN2U0OWE3MGQ2MTdkYWIyMmJjYjEiLCJpYXQiOjE3NDM5ODQwNzcsImV4cCI6MTc0Mzk4NzY3N30.D0wYpdzOy9_XnAk0lltEGEL4z2H9tf8Dca1vHt5Y5qc';

  try {
    console.log('Sending QR data to scan endpoint...');
    // Fetch scanned QR data from your Vercel endpoint with Bearer token in headers
    const scanRes = await axios.post(
      'https://software-invite-api-self.vercel.app/guest/scan-qrcode/',
      {
        qrData: users[0]?.qrCode || '' // fallback, or adjust if needed
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Received response from scan endpoint:', scanRes.data);

    const scanned = scanRes.data?.results || [];
    console.log('Scanned results:', scanned);

    // Check for match
    const matched = [];
    scanned.forEach((scan, scanIndex) => {
      const decoded = scan.decodedText;
      console.log(`Processing scanned result ${scanIndex}:`, decoded);

      users.forEach((user, userIndex) => {
        console.log(`Comparing with user ${userIndex}:`, user);
        const found =
          decoded.includes(user.name) &&
          decoded.includes(user.email) &&
          decoded.includes(user.phone);

        if (found) {
          console.log(`Match found for user ${userIndex} in scanned result ${scanIndex}`);
          matched.push({
            name: user.name,
            email: user.email,
            phone: user.phone,
            qrCode: user.qrCode
          });
        } else {
          console.log(`No match for user ${userIndex} in scanned result ${scanIndex}`);
        }
      });
    });

    if (matched.length > 0) {
      console.log('Matches found:', matched);
      return res.status(200).json({
        message: 'Match found!',
        qrCodes: matched
      });
    } else {
      console.log('No matching users found.');
      return res.status(404).json({ message: 'No matching users found' });
    }
  } catch (error) {
    console.error('Error during comparison:', error);
    return res.status(500).json({ message: 'Server error during match check' });
  }
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
