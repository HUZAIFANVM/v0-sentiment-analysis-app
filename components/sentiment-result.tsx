"use client"

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

interface Props {
  result: SentimentResponse
}

export default function SentimentResult({ result }: Props) {
  const isPositive = result.sentiment === "Positive"
  const sentimentColor = isPositive ? "text-green-400" : "text-red-400"
  const sentimentBg = isPositive ? "bg-green-500/10" : "bg-red-500/10"
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <div className="space-y-4">
      {/* Sentiment Badge */}
      <div className={`rounded-lg ${sentimentBg} p-6`}>
        <div className="mb-2 text-sm font-medium text-slate-400">Sentiment</div>
        <div className={`text-3xl font-bold ${sentimentColor}`}>{result.sentiment}</div>
        <div className="mt-2 text-sm text-slate-400">Confidence: {confidencePercent}%</div>
      </div>

      {/* Probability Breakdown */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
        <h3 className="mb-4 font-semibold text-white">Probability Breakdown</h3>
        <div className="space-y-3">
          {/* Positive */}
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-300">Positive</span>
              <span className="font-medium text-green-400">{Math.round(result.probabilities.positive * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${result.probabilities.positive * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Negative */}
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-300">Negative</span>
              <span className="font-medium text-red-400">{Math.round(result.probabilities.negative * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{
                  width: `${result.probabilities.negative * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
        <h3 className="mb-4 font-semibold text-white">Analysis Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Vocabulary Coverage</span>
            <span className="font-medium text-slate-200">{result.vocab_coverage.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Text Length</span>
            <span className="font-medium text-slate-200">{result.text.split(" ").length} words</span>
          </div>
        </div>
      </div>
    </div>
  )
}
