"use client"
import SentimentAnalyzer from "@/components/sentiment-analyzer"
import Header from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <SentimentAnalyzer />
    </main>
  )
}
