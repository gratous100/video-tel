import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual Netlify frontend URL
const FRONTEND_URL = 'https://your-netlify-site.netlify.app';

// Enable CORS for your frontend only
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST']
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
    return res.status(400).send('No video uploaded.');
  }

  const message = encodeURIComponent("✅ New video uploaded to the server.");

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`);
    res.status(200).send('Video uploaded and Telegram notified.');
  } catch (error) {
    console.error('Telegram notification error:', error);
    res.status(500).send('Video uploaded but Telegram notification failed.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
