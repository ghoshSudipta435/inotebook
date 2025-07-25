// Import required modules
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
require('dotenv').config({ path: './backend/.env' }); // ✅ Correct path

// Initialize the app
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectToMongo();

// Middleware
// Allow frontend domain
app.use(cors({
    origin: "https://inotebook-frontend-jet.vercel.app/", // <-- your frontend deployed URL
    credentials: true
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send("Sudipta, calm down and work hard 💪🔥");
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Start server
app.listen(PORT, () => {
  console.log(`🟢 iNotebook backend running at http://localhost:${PORT}`);
});
