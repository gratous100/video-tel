import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const FRONTEND_URL = 'https://spectacular-paletas-f2d45b.netlify.app/';
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST']
}));

// ✅ Make uploads folder publicly accessible
app.use('/uploads', express.static(path.join('.', 'uploads')));

// Ensure uploads folder exists
const uploadDir = path.join('./uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `video-${timestamp}.webm`);
  }
});
const upload = multer({ storage });

// Telegram credentials
const TELEGRAM_TOKEN = "7536357798:AAEHFNmd8vMjAphrz-D26RKqFGtlHFJQFwg";
const TELEGRAM_CHAT_ID = "6511997676";

// Upload route
app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).send('No video uploaded.');

  const filename = req.file.filename;
  const videoURL = `https://telegram-request10.onrender.com/uploads/${filename}`;
  const message = `✅ New video uploaded: ${filename}\n\n🔗 ${videoURL}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`);
    res.status(200).send('Video uploaded and Telegram notified.');
  } catch (error) {
    console.error('Telegram error:', error);
    res.status(500).send('Uploaded, but failed to notify Telegram.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
