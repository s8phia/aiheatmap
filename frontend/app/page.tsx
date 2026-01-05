"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [task, setTask] = useState("sentiment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getColourFromScore = (score: number) => {
    if (score <= -0.6) return "bg-red-700 text-white";
    if (score <= -0.2) return "bg-red-300 text-red-900";
    if (score <= 0.2) return "bg-gray-400 text-gray-900";
    if (score <= 0.6) return "bg-green-300 text-green-900";
    return "bg-green-700 text-white";
  };

  const getLabelFromScore = (score: number) => {
    if (score <= -0.6) return "Strong Negative";
    if (score <= -0.2) return "Weak Negative";
    if (score <= 0.2) return "Neutral";
    if (score <= 0.6) return "Weak Positive";
    return "Strong Positive";
  };

  const cleanToken = (token: string) => {
    // Replace tokenizer space markers (Ġ = U+0120) with actual spaces
    return token.replace(/Ġ/g, " ");
  };

  const TokenTooltip = ({ token, score, label, children }: { token: string; score: number; label: string; children: React.ReactNode }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    return (
      <span
        className="relative inline-block"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none">
            <div className="font-semibold mb-1">{token}</div>
            <div className="text-gray-300">{label}</div>
            <div className="text-blue-300 font-mono">Score: {score.toFixed(3)}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        )}
      </span>
    );
  };

  const LegendItem = ({ colour, label }: { colour: string; label: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${colour}`} />
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );

  const analyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, task }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze text");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze text. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      analyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Token Importance Visualizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Analyze text sentiment or emotion and visualize which tokens are most important to the AI's decision
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
          {/* Task Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Analysis Type
            </label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              disabled={loading}
            >
              <option value="sentiment">Sentiment Analysis</option>
              <option value="emotion">Emotion Classification</option>
            </select>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Text to Analyze
            </label>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter text to analyze (e.g., 'I love this product! It makes me so happy.')"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              disabled={loading}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Press Cmd/Ctrl + Enter to analyze
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={analyze}
            disabled={loading || !text.trim()}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Text</span>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Prediction Card */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Prediction
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                    {result.prediction}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Confidence
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                Token Importance Legend
              </h4>
              <div className="flex flex-wrap gap-6">
                <LegendItem colour="bg-green-700" label="Strong Positive" />
                <LegendItem colour="bg-green-300" label="Weak Positive" />
                <LegendItem colour="bg-gray-400" label="Neutral" />
                <LegendItem colour="bg-red-300" label="Weak Negative" />
                <LegendItem colour="bg-red-700" label="Strong Negative" />
              </div>
            </div>

            {/* Token Visualization */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Token Breakdown
              </h4>
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="leading-relaxed text-lg break-words">
                  {result.tokens.map((token: any, index: number) => {
                    const label = getLabelFromScore(token.score);
                    const cleanedToken = cleanToken(token.token);
                    return (
                      <TokenTooltip
                        key={index}
                        token={cleanedToken}
                        score={token.score}
                        label={label}
                      >
                        <span
                          className={`inline-block px-2 py-1 mb-1 mr-1 rounded-md ${getColourFromScore(
                            token.score
                          )} transition-all hover:scale-110 hover:shadow-md cursor-pointer`}
                        >
                          {cleanedToken}
                        </span>
                      </TokenTooltip>
                    );
                  })}
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                Hover over tokens to see their importance scores
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
        <p>AI Token Importance Visualizer • Powered by Transformers</p>
      </footer>
    </div>
  );
}
