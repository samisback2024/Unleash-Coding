import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ShieldCheck, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { validateInviteCode } from "@/services/beta";

export default function BetaInvitePage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "valid" | "invalid">(
    "checking",
  );
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!code) {
      setStatus("invalid");
      setErrorMsg("No invite code provided.");
      return;
    }

    validateInviteCode(code).then(({ valid, email: e, error }) => {
      if (valid) {
        setEmail(e);
        setStatus("valid");
      } else {
        setErrorMsg(error ?? "Invalid invite code.");
        setStatus("invalid");
      }
    });
  }, [code]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#ef4444]/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-[#ef4444]" />
          </div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] mb-3">
            Invalid Invite
          </h1>
          <p className="text-[#64748b] mb-6">{errorMsg}</p>
          <Link
            to="/waitlist"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6c63ff] hover:bg-[#5b52e8] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Join the Waitlist
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
      <div className="text-center max-w-sm w-full">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-8 h-8 text-[#6c63ff]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-semibold mb-4">
          Valid Beta Invite
        </div>

        <h1 className="text-2xl font-bold text-[#f1f5f9] mb-2">
          You're invited!
        </h1>
        <p className="text-[#64748b] mb-1">
          This invite is for{" "}
          <span className="text-[#94a3b8] font-medium">{email}</span>
        </p>
        <p className="text-sm text-[#64748b] mb-8">
          Create your account to get started on Unleash Coding.
        </p>

        <div className="space-y-3">
          <button
            onClick={() =>
              navigate(
                `/signup?invite=${code}&email=${encodeURIComponent(email)}`,
              )
            }
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#6c63ff] hover:bg-[#5b52e8] text-white font-semibold rounded-xl transition-colors"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#64748b]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6c63ff] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
