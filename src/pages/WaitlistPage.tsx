import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  CheckCircle,
  Code2,
  BookOpen,
  Trophy,
  Users,
  Loader2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { joinWaitlist } from "@/services/beta";

const INTEREST_AREAS = [
  "Frontend Development",
  "Backend Development",
  "Full-Stack",
  "DevOps / Cloud",
  "Mobile Development",
  "Data Science",
  "Cybersecurity",
  "Other",
];

const PERKS = [
  { icon: BookOpen, text: "Structured learning paths from zero to job-ready" },
  { icon: Code2, text: "700+ coding challenges with instant feedback" },
  { icon: Trophy, text: "XP, badges, and leaderboard to keep you motivated" },
  { icon: Users, text: "Community showcase — share your projects with peers" },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error: err } = await joinWaitlist({
      email,
      name: name || undefined,
      interest_area: interest || undefined,
    });
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2d3e] max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Unleash Coding" className="w-7 h-7" />
          <span className="font-bold text-[#f1f5f9]">Unleash Coding</span>
        </Link>
        <Link
          to="/login"
          className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-2xl mx-auto w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-[#6c63ff] text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" />
          Invite-Only Beta — Join the Waitlist
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#f1f5f9] leading-tight mb-5">
          Learn to code the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#a855f7]">
            right way
          </span>
        </h1>
        <p className="text-lg text-[#64748b] mb-10 leading-relaxed">
          Unleash Coding is a structured, project-driven learning platform. Be
          among the first to get access when we open beta.
        </p>

        {submitted ? (
          <div className="w-full max-w-md bg-[#1e2130] border border-[#22c55e]/30 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-[#22c55e]" />
            </div>
            <h2 className="text-xl font-bold text-[#f1f5f9] mb-2">
              You're on the list!
            </h2>
            <p className="text-sm text-[#64748b]">
              We'll email you at{" "}
              <span className="text-[#94a3b8] font-medium">{email}</span> when
              your invite is ready. Keep an eye on your inbox!
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6 space-y-4 text-left"
          >
            <div>
              <label
                htmlFor="wl-email"
                className="block text-sm font-medium text-[#94a3b8] mb-1.5"
              >
                Email address <span className="text-[#ef4444]">*</span>
              </label>
              <input
                id="wl-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6c63ff] transition"
              />
            </div>

            <div>
              <label
                htmlFor="wl-name"
                className="block text-sm font-medium text-[#94a3b8] mb-1.5"
              >
                Your name{" "}
                <span className="text-[#64748b] font-normal">(optional)</span>
              </label>
              <input
                id="wl-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6c63ff] transition"
              />
            </div>

            <div>
              <label
                htmlFor="wl-interest"
                className="block text-sm font-medium text-[#94a3b8] mb-1.5"
              >
                What are you most interested in?{" "}
                <span className="text-[#64748b] font-normal">(optional)</span>
              </label>
              <select
                id="wl-interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-[#0f1117] border border-[#2a2d3e] rounded-xl px-4 py-2.5 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#6c63ff] transition appearance-none"
              >
                <option value="">Select an area…</option>
                {INTEREST_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-[#ef4444] bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6c63ff] hover:bg-[#5b52e8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4" />
              )}
              {loading ? "Joining…" : "Join the Waitlist"}
            </button>

            <p className="text-xs text-[#64748b] text-center">
              No spam. Unsubscribe anytime. We'll only email your invite.
            </p>
          </form>
        )}

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-12 w-full max-w-xl text-left">
          {PERKS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-3 bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-4"
            >
              <Icon className="w-4 h-4 text-[#6c63ff] mt-0.5 shrink-0" />
              <p className="text-sm text-[#94a3b8]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-[#2a2d3e] py-6 px-6 text-center">
        <p className="text-sm text-[#64748b]">
          Already have a beta invite?{" "}
          <Link
            to="/signup"
            className="text-[#6c63ff] hover:underline inline-flex items-center gap-1"
          >
            Sign up now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </footer>
    </div>
  );
}
