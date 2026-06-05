require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let sampleData = { message: "Hello from Question 2 Express Backend!", items: [1, 2, 3] };

app.get('/api/data', (req, res) => {
    res.json(sampleData);
});

app.post('/api/data', (req, res) => {
    const newData = req.body;
    sampleData = { ...sampleData, ...newData };
    res.json({ message: "Data updated successfully", data: sampleData });
});

app.listen(PORT, () => {
    console.log(`Question 2 server running on port ${PORT}`);
});
