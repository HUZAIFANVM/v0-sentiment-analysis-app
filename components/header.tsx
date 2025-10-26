export default function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sentiment Analysis</h1>
            <p className="mt-1 text-sm text-slate-400">Analyze customer feedback and reviews in real-time</p>
          </div>
          <div className="rounded-lg bg-blue-500/10 px-4 py-2">
            <p className="text-sm font-medium text-blue-400">Customer Support</p>
          </div>
        </div>
      </div>
    </header>
  )
}
