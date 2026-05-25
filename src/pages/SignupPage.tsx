import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Zap, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, username.trim());
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6c63ff]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#a855f7]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#6c63ff] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Unleash Coding</span>
          </Link>
        </div>

        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#f1f5f9] mb-2">
            Create your account
          </h1>
          <p className="text-[#64748b] text-sm mb-8">
            Free forever. No credit card required.
          </p>

          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg px-4 py-3 text-sm text-[#ef4444] mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              placeholder="cooldev123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
              autoComplete="username"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-[#1a1d27] border border-[#2a2d3e] rounded-lg pl-10 pr-10 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-[#6c63ff] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-[#64748b]">
                At least 8 characters
              </p>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Create Free Account
            </Button>
          </form>

          <p className="text-center text-xs text-[#64748b] mt-5">
            By creating an account you agree to our Terms of Service and Privacy
            Policy.
          </p>

          <p className="text-center text-sm text-[#64748b] mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#6c63ff] hover:text-[#a855f7] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
