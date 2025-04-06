const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Simple POST endpoint to submit data
app.post('/submit-data', (req, res) => {
  const { firstName, lastName, address, city, country, phoneNumber } = req.body;
  
  // Validate input fields
  if (!firstName || !lastName || !address || !city || !country || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  // Normally, here you would insert data into a database.
  // For this simple example, we simply echo back the received data.
  res.status(201).json({ 
    message: 'Data successfully received',
    data: { firstName, lastName, address, city, country, phoneNumber }
  });
});

// Default 404 route for unmatched endpoints
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
