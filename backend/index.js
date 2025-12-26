const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post("/analyze", (req, res) => {
    const { text, task } = req.body;
  
    if (task === "sentiment") {
      return res.json({
        prediction: "POSITIVE",
        confidence: 0.91,
        tokens: [
          { text: "This", score: 0.0 },
          { text: "movie", score: 0.2 },
          { text: "was", score: 0.0 },
          { text: "great", score: 0.85 }
        ]
      });
    }
  
    if (task === "emotion") {
      return res.json({
        prediction: "JOY",
        confidence: 0.78,
        tokens: [
          { text: "I", score: 0.0 },
          { text: "am", score: 0.0 },
          { text: "so", score: 0.3 },
          { text: "excited", score: 0.9 }
        ]
      });
    }
  
    res.status(400).json({ error: "Unknown task" });
  });
  