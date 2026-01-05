const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
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

app.post("/analyze", async (req, res) => {
  const { text, task } = req.body;

  if (!text || !task) {
    return res.status(400).json({ error: "Missing text or task" });
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, task }),
    });

    const data = await response.json();

    return res.json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ML service unavailable" });
  }
});

  