const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Example POST route
app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
