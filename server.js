import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual frontend URL (Netlify URL)
const FRONTEND_URL = 'https://beamish-churros-37d8ec.netlify.app/';

// Enable CORS for your frontend only
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
}));

// Ensure uploads folder exists
const uploadDir = path.join('./uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config to save uploaded videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `video-${timestamp}.webm`);
  }
});
const upload = multer({ storage });

// Telegram info
const TELEGRAM_TOKEN = "7536357798:AAEHFNmd8vMjAphrz-D26RKqFGtlHFJQFwg";
const TELEGRAM_CHAT_ID = "6511997676";

// Upload endpoint
app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video uploaded.' });
  }

  try {
    const message = encodeURIComponent("✅ New video uploaded to the server.");
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`);

    return res.status(200).json({ message: 'Video uploaded and Telegram notified.' });
  } catch (error) {
    console.error('Telegram notification error:', error);
    return res.status(200).json({ message: 'Video uploaded but Telegram notification failed.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
