const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize express app
const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/qrdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schema and model
const usnSchema = new mongoose.Schema({
    usn: String,
    scannedAt: { type: Date, default: Date.now }
});

const USN = mongoose.model('USN', usnSchema);

// Route to handle QR code scan
app.post('/scan', async (req, res) => {
    const usn = req.body.usn;

    if (!usn) {
        return res.status(400).send({ message: 'USN is required' });
    }

    try {
        const newUSN = new USN({ usn });
        await newUSN.save();
        res.status(200).send({ message: 'USN stored successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to store USN', error });
    }
});

// Route to get all stored USNs
app.get('/usns', async (req, res) => {
    try {
        const usns = await USN.find(); // Retrieve all USNs from the database
        res.status(200).send(usns); // Send the retrieved data as the response
    } catch (error) {
        res.status(500).send({ message: 'Failed to retrieve USNs', error });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
