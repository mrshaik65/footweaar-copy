const express = require('express');
const cors = require('cors');        // <-- add this line
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());                     // <-- add this line BEFORE your routes
app.use(express.json());

let footwearData = require('./data.json').footwear;

// Root route
app.get('/', (req, res) => {
  res.send('✅ Footwear API is running. Visit /footwear to access data.');
});

// Get all footwear (with optional query filters)
app.get('/footwear', (req, res) => {
  let result = footwearData;

  if (req.query.q) {
    const q = req.query.q.toLowerCase();
    result = result.filter(item => item.title.toLowerCase().includes(q));
  }

  if (req.query.brand) {
    result = result.filter(item => item.brand.toLowerCase() === req.query.brand.toLowerCase());
  }

  if (req.query.gender) {
    result = result.filter(item => item.gender.toLowerCase() === req.query.gender.toLowerCase());
  }

  res.json(result);
});

// Get footwear by ID
app.get('/footwear/:id', (req, res) => {
  const item = footwearData.find(f => f.id == req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Create new footwear
app.post('/footwear', (req, res) => {
  const newItem = { id: footwearData.length + 1, ...req.body };
  footwearData.push(newItem);
  res.status(201).json(newItem);
});

// Update existing footwear by ID
app.put('/footwear/:id', (req, res) => {
  const idx = footwearData.findIndex(f => f.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  footwearData[idx] = { ...footwearData[idx], ...req.body };
  res.json(footwearData[idx]);
});

// Delete footwear by ID
app.delete('/footwear/:id', (req, res) => {
  const idx = footwearData.findIndex(f => f.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const deleted = footwearData.splice(idx, 1);
  res.json(deleted[0]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
