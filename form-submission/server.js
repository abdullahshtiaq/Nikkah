const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config(); // Load environment variables

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

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
        const formData = new FormData(req.body);
        await formData.save();
        console.log('Form Data saved:', formData);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error saving form data:', error);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
