import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch


app = FastAPI()
MODEL_NAME = "distilbert-base-uncased-finetuned-sst-2-english"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

class AnalyzeRequest(BaseModel):
    text: str
    task: str

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    text = request.text
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    logits = outputs.logits
    probs = torch.softmax(logits, dim=1)
    pred_idx = torch.argmax(probs).item()
    label_map = {0: "NEGATIVE", 1: "POSITIVE"}
    prediction = label_map[pred_idx]
    confidence = probs[0][pred_idx].item()

    return {
        "prediction": prediction,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
