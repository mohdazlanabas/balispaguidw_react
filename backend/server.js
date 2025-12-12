// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getFilterOptions, querySpas, getSpaById } = require('./spaData');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Root message for quick health check
app.get('/', (_req, res) => {
  res.send(
    'Bali Spa Directory API is running. Use /api/filters, /api/spas, or start the frontend at http://localhost:5173.'
  );
});

// API – filters
app.get('/api/filters', (req, res) => {
  res.json(getFilterOptions());
});

// API – spa list with filters, sort, pagination
app.get('/api/spas', (req, res) => {
  const {
    page = 1,
    pageSize = 20,
    location,
    treatment,
    budget,
    search,
    sort,
  } = req.query;

  const data = querySpas({
    page: Number(page),
    pageSize: Number(pageSize),
    location,
    treatment,
    budget,
    search,
    sort,
  });

  res.json(data);
});

// API – spa detail
app.get('/api/spas/:id', (req, res) => {
  const spa = getSpaById(req.params.id);
  if (!spa) return res.status(404).json({ error: 'Spa not found' });
  res.json(spa);
});

// (optional) serve built frontend if you build it into /frontend/dist
app.use(
  express.static(path.join(__dirname, '..', 'frontend', 'dist'), {
    index: 'index.html',
  })
);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
