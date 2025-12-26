"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [task, setTask] = useState("sentiment");

  const getColourFromScore = (score: number) => {
    if (score <= -0.6) return "#b91c1c";
    if (score <= -0.2) return "#fca5a5";
    if (score <= 0.2) return "#808080";
    if (score <= 0.6) return "#86efac";
    return "#166534";
  }

  const LegendItem = ({ colour, label }: { colour: string; label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          backgroundColor: colour
        }}
      />
      <span style={{ fontSize: 14 }}>{label}</span>
    </div>
  );


  const analyze = async () => {
    const res = await fetch("http://localhost:3001/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, task })
    });
    setResult(await res.json());
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Visualize AI Token Importance</h1>
      <select
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{
          marginBottom: 12,
          padding: 6,
          fontSize: 16
        }}>
          <option value="sentiment">Sentiment Analysis</option>
          <option value="emotion">Emotion Classification</option>
      </select>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%" }}
      />
      <button onClick={analyze}>Analyze</button>
      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>Prediction: {result.prediction}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>

          <div style={{ marginBottom: 16 }}>
          <strong>Legend</strong>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <LegendItem colour="#166534" label="Strong Positive" />
            <LegendItem colour="#86efac" label="Weak Positive" />
            <LegendItem colour="#808080" label="Neutral" />
            <LegendItem colour="#fca5a5" label="Weak Negative" />
            <LegendItem colour="#b91c1c" label="Strong Negative" />
          </div>
        </div>
          <h4>Token Breakdown</h4>
          <div style={{ lineHeight: "2em" }}>
            {result.tokens.map((token: any, index: number) => (
              <span
              key={index}
              style={{
                marginRight: 6,
                padding: "4px 6px",
                borderRadius: 4,
                backgroundColor: getColourFromScore(token.score)
              }}
            >
              {token.text}
            </span>
            
            ))}
          </div>
        </div>
      )}
    </div>
  );
}