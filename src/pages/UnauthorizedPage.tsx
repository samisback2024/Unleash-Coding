import { useNavigate } from "react-router-dom";
import { ShieldOff, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Decorative */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-3xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center">
            <ShieldOff className="w-12 h-12 text-[#ef4444]" />
          </div>
          <span className="absolute -top-3 -right-3 text-3xl font-black text-[#ef4444]/20 select-none">
            403
          </span>
        </div>

        <h1 className="text-3xl font-black text-[#f1f5f9] mb-3">
          Access Denied
        </h1>
        <p className="text-[#64748b] mb-8 leading-relaxed">
          You don't have permission to view this page. If you think this is a
          mistake, please contact support.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-[#2a2d3e] hover:border-[#ef4444]/50 text-[#94a3b8] hover:text-[#f1f5f9] rounded-xl transition-colors text-sm font-medium"
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
