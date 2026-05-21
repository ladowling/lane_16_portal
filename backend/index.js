const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', uptime: process.uptime() });
});

app.get('/api/items', (req, res) => {
  res.json({ items: [] });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
