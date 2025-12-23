Visualize which words in an input text most influenced an AI classification decision, using interactive token level explainations

MVP:
- sentiment analysis
- emotion analysis

features:
 - token heatmap built in with sentence (visualization)
    - can click on each token
 - final score: prediction + confidence score
    - with bar graph
 - token analysis


 tech stack:
 - react nextjs
 - nodejs and express
 - fastAPI
 - hugging face api


 token analyzer json template:
{
  "input_text": "This movie was great",
  "task": "sentiment",
  "prediction": "POSITIVE",
  "confidence": 0.91,
  "tokens": [
    { "text": "This", "importance": 0.05 },
    { "text": "movie", "importance": 0.12 },
    { "text": "was", "importance": 0.07 },
    { "text": "great", "importance": 0.88 }
  ]
}





