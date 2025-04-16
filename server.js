const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo Error:", err));

  const confessionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    answers: {
      type: [String], // This ensures the answers are just strings
      required: true,
    },
    loveAnswer: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      minlength: [200, 'Reason must be at least 200 characters'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  });

const Confession = mongoose.model("Confession", confessionSchema);

app.post('/api/confession', async (req, res) => {
  try {
    const { name, answers, loveAnswer, reason } = req.body;

    // Check if the reason is less than 300 characters
    if (!reason || reason.trim().length < 200) {
      return res.status(400).json({ error: "Reason must be at least 300 characters." });
    }

    // Create a new confession object
    const newConfession = new Confession({
      name,
      answers,
      loveAnswer,
      reason,
      submittedAt: new Date(),
    });

    // Save to MongoDB
    await newConfession.save();
    
    // Send success response
    res.status(201).json({ message: "Confession saved!" });
  } catch (err) {
    // Log the error and send error response
    console.error("❌ Error saving confession:", err);
    res.status(500).json({ error: "Error saving confession" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
