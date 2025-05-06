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
app.use(cors());
app.use(express.json());

// serve uploaded recordings and images
app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images",    express.static("uploads/images"));

// ───── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth",     AuthRoutes);
app.use("/api/messages", MessageRoutes);

// example utility endpoint: generate a UUID
app.get("/api/uuid", (req, res) => {
  res.json({ id: uuidv4() });
});

// example utility endpoint: ping an external service
app.get("/api/ping-external", async (req, res) => {
  try {
    const { data } = await axios.get("https://api.ipify.org?format=json");
    res.json({ yourIp: data.ip });
  } catch (err) {
    console.error("Axios error:", err);
    res.status(502).send("Bad Gateway");
  }
});

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

db.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL");
});

// make `db` available in your routes via req.app.locals
app.locals.db = db;

// ───── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// ───── Start HTTP & Socket.IO Servers ────────────────────────────────────────
const PORT = process.env.PORT || 3005;
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
});

 const fakeUsers = [
  { id: "bot-weather", name: "WeatherBot" },
  { id: "bot-news", name: "NewsBot" },
];
  
app.get("/api/fake-users", (req, res) => {
  res.json(fakeUsers);
});

// track online users
global.onlineUsers = new Map();

io.on("connection", socket => {
  console.log("🔌 socket connected:", socket.id);
  global.chatSocket = socket;

  socket.on("add-user", userId => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys())
    });
  });

  socket.on("signout", id => {
    onlineUsers.delete(id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys())
    });
  });

  const forwardOrOffline = (eventIn, eventOut) => data => {
    const targetSocket = onlineUsers.get(data.to ?? data.from);
    if (targetSocket) {
      socket.to(targetSocket).emit(eventIn, data);
    } else {
      const senderSocket = onlineUsers.get(data.from);
      socket.to(senderSocket).emit(eventOut);
    }
  };

  socket.on("outgoing-voice-call", forwardOrOffline("incoming-voice-call", "voice-call-offline"));
  socket.on("outgoing-video-call", forwardOrOffline("incoming-video-call", "video-call-offline"));

  socket.on("reject-voice-call", data => {
    const s = onlineUsers.get(data.from);
    if (s) socket.to(s).emit("voice-call-rejected");
  });

  socket.on("reject-video-call", data => {
    const s = onlineUsers.get(data.from);
    if (s) socket.to(s).emit("video-call-rejected");
  });
  
  fakeUsers.forEach(bot => {
  onlineUsers.set(bot.id, null); // no real socket id
});

  
 


  socket.on("accept-incoming-call", ({ id }) => {
    const s = onlineUsers.get(id);
    if (s) socket.to(s).emit("accept-call");
  });

socket.on("send-msg", data => {
  const { from, to, message } = data;

  if (to === "bot-weather") {
    const reply = `🌦️ The weather is sunny and 25°C.`;
    socket.emit("msg-recieve", { from: to, message: reply });
  } else if (to === "bot-news") {
    const reply = `📰 Today's top headline: "AI takes over boring chats!"`;
    socket.emit("msg-recieve", { from: to, message: reply });
  } else {
    const s = onlineUsers.get(to);
    if (s) socket.to(s).emit("msg-recieve", { from, message });
  }
});


  socket.on("mark-read", ({ id, recieverId }) => {
    const s = onlineUsers.get(id);
    if (s) socket.to(s).emit("mark-read-recieve", { id, recieverId });
  });
});
