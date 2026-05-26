import { useNavigate } from "react-router-dom";
import { FileSearch, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Decorative */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-3xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center">
            <FileSearch className="w-12 h-12 text-[#6c63ff]" />
          </div>
          <span className="absolute -top-3 -right-3 text-3xl font-black text-[#6c63ff]/20 select-none">
            404
          </span>
        </div>

        <h1 className="text-3xl font-black text-[#f1f5f9] mb-3">
          Page Not Found
        </h1>
        <p className="text-[#64748b] mb-8 leading-relaxed">
          The page you're looking for doesn't exist, or may have been moved.
          Double-check the URL or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-[#2a2d3e] hover:border-[#6c63ff]/50 text-[#94a3b8] hover:text-[#f1f5f9] rounded-xl transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6c63ff] hover:bg-[#5b52e8] text-white rounded-xl transition-colors text-sm font-semibold"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
