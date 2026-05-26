export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-6xl">📡</div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">You're Offline</h1>
        <p className="text-[#94a3b8]">
          No internet connection. Check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-semibold transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
