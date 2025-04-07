const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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
});app.post('/submit-data', (req, res) => {
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


// Default 404 route for unmatched endpoints
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
