// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import mysql from "mysql2";
import axios from "axios";
import { Server } from "socket.io";

import AuthRoutes from "./AuthRoutes.js";
import MessageRoutes from "./MessageRoutes.js";

dotenv.config();
const app = express();

// ───── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));

app.use(express.json());

// serve uploaded recordings and images
app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images",    express.static("uploads/images"));

// ───── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth",     AuthRoutes);
app.use("/api/messages", MessageRoutes);



// ───── MySQL Connection ───────────────────────────────────────────────────────
const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
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
db.connect(err => { if (err) { console.error(err); process.exit(1); } console.log("✅ Connected to MySQL"); });
app.locals.db = db;

// start HTTP & Socket.IO
const server = app.listen(process.env.PORT||3005, () => console.log("Server up"));
const io = new Server(server, { cors: { origin: "*" } });
app.locals.io = io;

// track online users
global.onlineUsers = new Map();
io.on("connection", socket => {
  socket.on("add-user", userId => {
    global.onlineUsers.set(String(userId), socket.id);
    socket.broadcast.emit("online-users", { onlineUsers: Array.from(global.onlineUsers.keys()) });
  });
  
  
// track online users
global.onlineUsers = new Map();
io.on("connection", socket => {
  socket.on("add-user", userId => {
    global.onlineUsers.set(String(userId), socket.id);
    socket.broadcast.emit("online-users", { onlineUsers: Array.from(global.onlineUsers.keys()) });
  });

  socket.on("send-msg", data => {
    const toId = String(data.to);
    const targetSocket = global.onlineUsers.get(toId);
    if (targetSocket) socket.to(targetSocket).emit("msg-receive", { from: data.from, message: data.message });
  });

  socket.on("disconnect", () => {
    // optionally remove user from map
  });
});


  socket.on("send-msg", data => {
    const toId = String(data.to);
    const targetSocket = global.onlineUsers.get(toId);
    if (targetSocket) socket.to(targetSocket).emit("msg-receive", { from: data.from, message: data.message });
  });

  socket.on("disconnect", () => {
    // optionally remove user from map
  });
});
