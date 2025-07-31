const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const alarmPath = './alarm.json';

// GET alarm time
app.get('/alarm', (req, res) => {
  if (fs.existsSync(alarmPath)) {
    const alarm = JSON.parse(fs.readFileSync(alarmPath));
    res.json(alarm);
  } else {
    res.json({ hour: 6, minute: 0 });
  }
});

// POST new alarm time
app.post('/alarm', (req, res) => {
  fs.writeFileSync(alarmPath, JSON.stringify(req.body));
  res.json({ message: 'Alarm saved.' });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
