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
    const text = req.body.text;
  
    res.json({
        prediction: "POSITIVE",
        confidence: 0.91,
        tokens: [
          { text: "This", score: 0.0 },
          { text: "movie", score: 0.2 },
          { text: "was", score: 0.0 },
          { text: "great", score: 0.85 }
        ]
      });   
  });
  