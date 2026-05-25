import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import PathDetailPage from "@/pages/PathDetailPage";
import LessonPage from "@/pages/LessonPage";
import ChallengePage from "@/pages/ChallengePage";
import ChallengesPage from "@/pages/ChallengesPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import PortfolioPage from "@/pages/PortfolioPage";
import ProfilePage from "@/pages/ProfilePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import CommunityPage from "@/pages/CommunityPage";
import PublicProfilePage from "@/pages/PublicProfilePage";
import ProjectShowcasePage from "@/pages/ProjectShowcasePage";

/** Redirect authenticated users away from auth pages */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Redirect unauthenticated users to login */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected — app shell */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/paths" element={<DashboardPage />} />
        <Route path="/paths/:slug" element={<PathDetailPage />} />
        <Route path="/paths/:slug/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/paths/:slug/lesson/start" element={<LessonPage />} />
        <Route
          path="/paths/:slug/challenge/:challengeId"
          element={<ChallengePage />}
        />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route
          path="/paths/:slug/project/:projectId"
          element={<ProjectDetailPage />}
        />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/u/:userId" element={<PublicProfilePage />} />
        <Route path="/showcase/:submissionId" element={<ProjectShowcasePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
