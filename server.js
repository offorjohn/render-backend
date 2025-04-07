const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// POST endpoint that accepts any JSON payload
app.post('/submit-data', (req, res) => {
  const data = req.body;

  // Log the received JSON data to the console
  console.log('Received JSON:', data);

  // Destructure the first object from the data array
  const {
    id,
    _id,
    name,
    email,
    phone,
    createdAt,
    status,
    qrCode
  } = data[0];

  // Log the destructured data
  console.log('Destructured Data:', {
    id,
    _id,
    name,
    email,
    phone,
    createdAt,
    status,
    qrCode
  });

  // Normally, here you would insert data into a database.
  // For this simple example, we simply echo back the received data.
  res.status(201).json({
    message: 'Data successfully received',
    data: {
      id,
      _id,
      name,
      email,
      phone,
      createdAt,
      status,
      qrCode
    }
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
