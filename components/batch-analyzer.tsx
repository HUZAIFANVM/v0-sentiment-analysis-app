"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BatchResult {
  text: string
  sentiment: string
  confidence: number
}

interface Props {
  apiUrl: string
}

export default function BatchAnalyzer({ apiUrl }: Props) {
  const [batchText, setBatchText] = useState("")
  const [results, setResults] = useState<BatchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleBatchAnalyze = async () => {
    const reviews = batchText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0)

    if (reviews.length === 0) {
      setError("Please enter at least one review")
      return
    }

    setLoading(true)
    setError("")
    setResults([])

    try {
      const response = await fetch(`${apiUrl}/batch-predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviews.map((text) => ({ text }))),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze batch")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const positiveCount = results.filter((r) => r.sentiment === "Positive").length
  const negativeCount = results.filter((r) => r.sentiment === "Negative").length

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Batch Analysis</h2>
          <p className="mb-4 text-sm text-slate-400">Enter one review per line to analyze multiple reviews at once</p>
          <textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder="Review 1&#10;Review 2&#10;Review 3..."
            className="mb-4 h-48 w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />

          {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

          <Button
            onClick={handleBatchAnalyze}
            disabled={loading || !batchText.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Batch"}
          </Button>
        </div>
      </Card>

      {/* Results Summary */}
      {results.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <div className="text-sm text-slate-400">Total Reviews</div>
              <div className="mt-2 text-3xl font-bold text-white">{results.length}</div>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <div className="text-sm text-green-400">Positive</div>
              <div className="mt-2 text-3xl font-bold text-green-400">{positiveCount}</div>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <div className="text-sm text-red-400">Negative</div>
              <div className="mt-2 text-3xl font-bold text-red-400">{negativeCount}</div>
            </Card>
          </div>

          {/* Results List */}
          <Card className="border-slate-700 bg-slate-800/50">
            <div className="p-6">
              <h3 className="mb-4 font-semibold text-white">Results</h3>
              <div className="space-y-3">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{result.text}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          result.sentiment === "Positive"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {result.sentiment}
                      </span>
                      <span className="text-sm text-slate-400">{Math.round(result.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
