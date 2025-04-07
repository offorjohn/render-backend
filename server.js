const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import UUID v4
const mysql = require('mysql2');
const cors = require('cors');

const axios = require('axios'); // Make sure to install axios: npm install axios

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Create MySQL connection using your certificate
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUERt7YR9jM6EfYwhtPB9fQ8HjkwwwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZmYzNzJlYTMtZjhhNS00NjczLWJlNjMtMjEyZjkwMzQx
YTU4IFByb2plY3QgQ0EwHhcNMjQxMTI1MTAyODE4WhcNMzQxMTIzMTAyODE4WjA6
MTgwNgYDVQQDDC9mZjM3MmVhMy1mOGE1LTQ2NzMtYmU2My0yMTJmOTAzNDFhNTgg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAML3lHyA
3MXuxfj29WTx0erDUKpPeGycYgEREE8OCeLpql4EkD5xUmoO6W5YqMH/Va/M5n+x
R0R86ilR++lrCJOEps8P+/hmXaqZXlba4y+YRoJlZrJ9WWnioKxA5EtMUJSaI22I
caqS7DMl+/l/R1C1cUfXDNu0hHVWOTWmYbzekocSMJIQ1+HmDpMr4vuWhnGUUbBq
o7wTGzen36vyIG8m852dtOX/q0pSCXJ63qIcqJE0bkvOwhMTScfe13QNTFSQ/IZ6
JDashWmVOHeFVl0250facjkQtkbCBQpM4OmlAIF1LC9JC4WK8nfWKoi8KyQtN4Dw
HFw4beaE8+7j0oLlzIt7caBgCQ/OBi+j22wVnzsjrXRLv1QHkEI8uPr/g+i8dPfr
rmjuRfpPfk/slhnNTcSvrkPK2s1lyNzURKurjK5K3l8kY+Tjjnt/2x153FJLQDds
eSFs9CsmwcpgV+IYQ3M4k8GRfsf7XH6deL/naXOZOjGaCCGvGArrMUKLAwIDAQAB
oz8wPTAdBgNVHQ4EFgQUvmIWU3a0J6rmD/GgorgsK1XvnuwwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAJOdwS5DvrSiMyzY
sR1gimYRWaRTEfkLH1Oj3gezwDSFMcCB70zd8eEqEnHoUk//AK8ULPk4QEJhmDgN
pK/XoOyk0cHZH/US+JFipKX1W9b3yiEpuS+doeWpvd1t+P2G0sHNQ/cdArQGvHeY
CEZKZa4x8GxaKd0iuQyoE16Lz9FCWsEimALewwbpuqdY2+FeFCuyHO/lFlq2s3C7
RpoL6qaEyUMP8pRDUN3vysmIzQm65EsAIb+Mgc9kWtoGLrXX6HjFgjztEOKlZs80
FOm+5IV44qCXbB87KyTXZo1UuoNSltJiHFVXQC+6GSfSoLn4YrBtdUHnlLm1fzdv
9d6taC69BBedXIF3hRjOqXKbzclLMkltProMfWgJhJUK5/bY2JekqCbF0RFrSNX1
ARqiTWIvp4eyPjvxfMmmRnjB5jZ1quioeDlS8S/QYg1kdZvu4QGTJt0HTHLjEwAx
zMcNJBgXS9wrHbstOMlGQiXKC8pX29kOfpskNtNg56huPDf0VQ==
-----END CERTIFICATE-----`,
    rejectUnauthorized: true
  }
});

connection.connect(err => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

const getAuthToken = async () => {
  try {
    const response = await axios.post('https://software-invite-api-self.vercel.app/admin/login', {
      email: 'stalo161@gmail.com',
      password: 'stalo001'
    });

    const token = response.data.token; // Adjust based on actual response shape
    console.log('New token:', token);

    // Store it in a global variable or any context you want to use it from
    currentToken = token;

    return token;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
  }
};

// Global variable to hold the current token
let currentToken = null;

// Call once at start
getAuthToken();
setInterval(() => {
  getAuthToken();
}, 40 * 60 * 1000); // 25 minutes in milliseconds



app.post('/submit-data', async (req, res) => {
  // Expecting the scan result JSON with a "results" array
  const { results } = req.body;
  if (!results || !results.length) {
    return res.status(400).json({ message: 'No scan results provided' });
  }

  // Use the first scan result (adjust if multiple results need handling)
  const scanResult = results[0];
  const decodedText = scanResult.decodedText;
  console.log('Received scan decodedText:', decodedText);

  // Parse the decodedText to extract details
  let firstName, lastName, email, phone;
  decodedText.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('First Name:')) {
      firstName = trimmedLine.split('First Name:')[1].trim();
    } else if (trimmedLine.startsWith('Last Name:')) {
      lastName = trimmedLine.split('Last Name:')[1].trim();
    } else if (trimmedLine.startsWith('Email:')) {
      email = trimmedLine.split('Email:')[1].trim();
    } else if (trimmedLine.startsWith('Phone:')) {
      phone = trimmedLine.split('Phone:')[1].trim();
    }
  });

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : undefined;
  console.log('Parsed values:', { name: fullName, email, phone });

  // Ensure all necessary values were extracted
  if (!fullName || !email || !phone) {
    return res.status(400).json({ message: 'Incomplete scan data' });
  }

  // Query the database for a matching user record
  const query = 'SELECT qrCode FROM users WHERE name = ? AND email = ? AND phone = ?';
  connection.query(query, [fullName, email, phone], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    // If no matching user is found, return a 404 response
    if (results.length === 0) {
      console.log('No matching user found for:', { name: fullName, email, phone });
      return res.status(404).json({ message: 'No matching user found' });
    }

    // Retrieve the stored QR code URL from the matched record
    const qrCodeUrl = results[0].qrCode;
    console.log('Match found with qrCode:', qrCodeUrl);

      const token = await getAuthToken();
    try {
      // Send the matching QR code to the soft invite API in the expected JSON format
      const inviteRes = await axios.post(
        'https://software-invite-api-self.vercel.app/guest/scan-qrcode/',
        { qrData: qrCodeUrl },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response from soft invite API:', inviteRes.data);
      return res.status(200).json({
        message: 'Match found and QR code sent to soft invite API',
        inviteResponse: inviteRes.data
      });
    } catch (error) {
      console.error('Error sending QR code to soft invite API:', error);
      return res.status(500).json({ message: 'Error sending QR code to soft invite API', error });
    }
  });
});



app.post('/submit-dat', (req, res) => {
  const data = req.body;
  console.log(data);
  

  const uniqueIds = new Set();
  const processedData = data.map(item => {
    // If the item already has an ID, but it's a duplicate, generate a new unique ID
    if (uniqueIds.has(item.id)) {
      item.id = uuidv4(); // Assign a new unique ID
    }
    uniqueIds.add(item.id); // Add the ID to the set

    return item;
  });

  // Assuming data is an array of objects and your table has columns that match the keys
  const query = `INSERT INTO users (id, name, email, phone, createdAt, status, qrCode)
                 VALUES ?
                 ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), phone = VALUES(phone), createdAt = VALUES(createdAt), status = VALUES(status), qrCode = VALUES(qrCode)`;

  const values = processedData.map(item => [
    item.id,
    item.name,
    item.email,
    item.phone,
    item.createdAt,
    item.status,
    item.qrCode
  ]);

  connection.query(query, [values], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    console.log("Data inserted:", results);
    res.status(201).json({ message: 'Data successfully saved', results });
  });
});

// Example: Securely fetch data (ensure you add proper authentication in a real-world scenario)
app.get('/view-data', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ data: results });
  });
});

app.post('/submit-data', (req, res) => {
  const data = req.body;
  
  // Log the received JSON data to the console
  console.log('Received JSON:', data);
  
  // Convert the JSON object to a string for storage
  const jsonData = JSON.stringify(data);

  // Insert the JSON data into the 'submissions' table
  const insertQuery = 'INSERT INTO submissions (data) VALUES (?)';
  connection.query(insertQuery, [jsonData], (err, results) => {
    if (err) {
      console.error("Error inserting data into database:", err);
      return res.status(500).json({ message: 'Failed to save data', error: err });
    }
    
    console.log("Data inserted successfully with ID:", results.insertId);
    res.status(201).json({ 
      message: 'Data successfully received and saved',
      insertId: results.insertId,
      data: data
    });
  });
});

function deleteAllUsers() {
  const query = 'DELETE FROM users';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error deleting all users from database:', err);
      return;
    }
    console.log('All users successfully deleted. Affected rows:', results.affectedRows);
  });
}

// Schedule the deletion function to run every 5 seconds (5000 milliseconds)
setInterval(deleteAllUsers, 5000);


// Route to delete all submissions from the database
app.delete('/delete-all-submissions', (req, res) => {
  const query = 'DELETE FROM submissions';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error deleting data from database:', err);
      return res.status(500).json({ message: 'Failed to delete data', error: err });
    }

    res.status(200).json({
      message: 'All submissions successfully deleted',
      affectedRows: results.affectedRows
    });
  });
});



// Route to get all submissions from the database
app.get('/get-submissions', (req, res) => {
  const query = 'SELECT * FROM submissions';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      return res.status(500).json({ message: 'Failed to fetch data', error: err });
    }

    res.status(200).json({
      message: 'Data fetched successfully',
      submissions: results
    });
  });
});


// Example: Securely fetch data (ensure you add proper authentication in a real-world scenario)
app.get('/view-data', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ data: results });
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
