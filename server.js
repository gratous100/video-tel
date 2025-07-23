import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Change this to your frontend URL (where your HTML runs)
const FRONTEND_URL = 'https://your-netlify-site.netlify.app';

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['POST']
}));

// Ensure uploads folder exists or create it
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config for saving uploaded videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `video-${timestamp}.webm`);
  }
});
const upload = multer({ storage });

// Telegram bot info
const TELEGRAM_TOKEN = "7536357798:AAEHFNmd8vMjAphrz-D26RKqFGtlHFJQFwg";
const TELEGRAM_CHAT_ID = "6511997676";

// POST /upload endpoint
app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No video uploaded.');
  }

  try {
    const message = encodeURIComponent(`✅ New video uploaded: ${req.file.filename}`);
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`);
    res.status(200).send('Video uploaded and Telegram notified.');
  } catch (err) {
    console.error('Telegram notification error:', err);
    res.status(500).send('Video uploaded but Telegram notification failed.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
