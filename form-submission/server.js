const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config(); // Load environment variables

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000, // 5 seconds
  socketTimeoutMS: 45000, // 45 seconds
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if MongoDB connection fails
  });

// Define a schema and model for form data
const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  attending: String,
  guests: Number
}, { timestamps: true });

const FormData = mongoose.model('FormData', formDataSchema);

// Configure multer for file upload handling
const upload = multer();

app.use(express.static('public'));

// Endpoint to handle form submission
app.post('/api/submit', upload.none(), async (req, res) => {
  try {
    console.log('Form Data received:', req.body); // Log received data
    const formData = new FormData(req.body);
    await formData.save();
    console.log('Form Data saved:', formData);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving form data:', error); // Log detailed error
    res.status(500).send({ error: 'Error saving form data', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
