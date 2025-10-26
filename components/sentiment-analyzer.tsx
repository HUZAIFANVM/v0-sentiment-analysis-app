"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SentimentResult from "./sentiment-result"
import BatchAnalyzer from "./batch-analyzer"

interface SentimentResponse {
  text: string
  sentiment: string
  confidence: number
  probabilities: {
    negative: number
    positive: number
  }
  vocab_coverage: number
}

export default function SentimentAnalyzer() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<SentimentResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single")

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to analyze sentiment")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("[v0] Sentiment analysis error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText("")
    setResult(null)
    setError("")
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("single")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "single" ? "border-b-2 border-blue-500 text-blue-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Single Review
        </button>
        <button
          onClick={() => setActiveTab("batch")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "batch" ? "border-b-2 border-blue-500 text-blue-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Batch Analysis
        </button>
      </div>

      {/* Single Review Tab */}
      {activeTab === "single" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <Card className="border-slate-700 bg-slate-800/50">
            <div className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Enter Customer Review</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a customer review or feedback here..."
                className="mb-4 h-40 w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />

              {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Analyze Sentiment"}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          {/* Result Card */}
          {result && <SentimentResult result={result} />}
        </div>
      )}

      {/* Batch Analysis Tab */}
      {activeTab === "batch" && <BatchAnalyzer apiUrl={API_URL} />}
    </div>
  )
}
