import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  BookOpen,
  Code2,
  Trophy,
  Star,
  Users,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { learningPaths } from "@/data/paths";

const stats = [
  { label: "Active Learners", value: "50K+", icon: Users },
  { label: "Learning Paths", value: "18", icon: BookOpen },
  { label: "Challenges", value: "700+", icon: Code2 },
  { label: "Jobs Landed", value: "2,400+", icon: Trophy },
];

const features = [
  {
    icon: BookOpen,
    title: "Structured Roadmaps",
    description:
      "Follow a clear beginner-to-advanced roadmap for every career path.",
  },
  {
    icon: Code2,
    title: "Real Challenges",
    description:
      "Hundreds of coding challenges to build muscle memory and confidence.",
  },
  {
    icon: Trophy,
    title: "XP & Badges",
    description: "Earn XP, level up, and collect badges as you progress.",
  },
  {
    icon: Star,
    title: "Real Projects",
    description:
      "Build portfolio-worthy projects you can actually show employers.",
  },
];

export default function LandingPage() {
  const featuredPaths = learningPaths.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#f1f5f9]">
      {/* Navbar */}
      <header className="border-b border-[#2a2d3e] sticky top-0 z-50 bg-[#0f1117]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6c63ff] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Unleash Coding
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#94a3b8]">
            <a href="#paths" className="hover:text-white transition-colors">
              Paths
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#stats" className="hover:text-white transition-colors">
              Community
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#6c63ff]/20 rounded-full blur-3xl" />
          <div className="absolute -top-20 right-0 w-80 h-80 bg-[#a855f7]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-[#6c63ff]/10 border border-[#6c63ff]/30 rounded-full px-4 py-1.5 text-sm text-[#6c63ff] mb-8">
            <Zap className="w-3.5 h-3.5" />
            Free forever — no credit card required
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Your roadmap to a{" "}
            <span className="bg-gradient-to-r from-[#6c63ff] to-[#a855f7] bg-clip-text text-transparent">
              software career
            </span>
          </h1>

          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Unleash Coding gives you structured learning paths, real-world
            challenges, and portfolio projects to go from beginner to job-ready
            — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="gap-2 text-base px-8 shadow-[0_0_30px_rgba(108,99,255,0.4)]"
              >
                Start Learning Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="text-base px-8">
                Browse Paths
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-[#64748b]">
            <div className="flex -space-x-2">
              {[
                "bg-blue-500",
                "bg-purple-500",
                "bg-green-500",
                "bg-yellow-500",
              ].map((c, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${c} border-2 border-[#0f1117]`}
                />
              ))}
            </div>
            <span>
              Join <strong className="text-[#94a3b8]">50,000+</strong>{" "}
              developers already learning
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-[#2a2d3e] bg-[#1a1d27]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#6c63ff]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#f1f5f9] mb-1">
                {value}
              </div>
              <div className="text-sm text-[#64748b]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Paths */}
      <section id="paths" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Choose your path</h2>
          <p className="text-[#94a3b8] text-lg max-w-xl mx-auto">
            18 career-focused tracks built for the real job market.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredPaths.map((path) => (
            <Link key={path.id} to={`/paths/${path.slug}`} className="group">
              <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6 hover:border-[#6c63ff] hover:shadow-[0_0_24px_rgba(108,99,255,0.15)] transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${path.color}20` }}
                  >
                    {path.icon}
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                    style={{
                      backgroundColor: `${path.color}20`,
                      color: path.color,
                    }}
                  >
                    {path.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2 group-hover:text-[#6c63ff] transition-colors">
                  {path.title}
                </h3>
                <p className="text-sm text-[#64748b] leading-relaxed mb-4 line-clamp-2">
                  {path.description}
                </p>
                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <span>{path.totalLessons} lessons</span>
                  <span>{path.estimatedTimeline}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                    {path.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/dashboard">
            <Button variant="secondary" size="lg">
              View All 18 Paths
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-[#1a1d27] border-y border-[#2a2d3e] py-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to get hired
            </h2>
            <p className="text-[#94a3b8] text-lg">
              No fluff. Just the skills that employers actually want.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#6c63ff]" />
                </div>
                <h3 className="text-base font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-br from-[#6c63ff]/20 to-[#a855f7]/10 border border-[#6c63ff]/30 rounded-3xl p-14">
          <h2 className="text-4xl font-bold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-[#94a3b8] text-lg mb-8 max-w-lg mx-auto">
            Join thousands of developers who've used Unleash Coding to land
            their first dev job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="px-10 shadow-[0_0_30px_rgba(108,99,255,0.4)]"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#64748b]">
            {["No credit card", "Free forever", "18 learning paths"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2d3e] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#64748b]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#6c63ff] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium text-[#94a3b8]">Unleash Coding</span>
          </div>
          <span>© 2026 Unleash Coding. Free forever.</span>
        </div>
      </footer>
    </div>
  );
}
