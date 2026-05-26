import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/admin";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { FeedbackButton } from "@/components/ui/FeedbackButton";

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
import NotFoundPage from "@/pages/NotFoundPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import WaitlistPage from "@/pages/WaitlistPage";
import BetaInvitePage from "@/pages/BetaInvitePage";
import BetaOnboardingPage from "@/pages/BetaOnboardingPage";
import PlaygroundPage from "@/pages/PlaygroundPage";
import DSAVisualizerPage from "@/pages/DSAVisualizerPage";
import SystemDesignPage from "@/pages/SystemDesignPage";
import InterviewPrepPage from "@/pages/InterviewPrepPage";
import ResumeBuilderPage from "@/pages/ResumeBuilderPage";
import StudyPlannerPage from "@/pages/StudyPlannerPage";

// Admin pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminPathsPage from "@/pages/admin/AdminPathsPage";
import AdminModulesPage from "@/pages/admin/AdminModulesPage";
import AdminLessonsPage from "@/pages/admin/AdminLessonsPage";
import AdminChallengesPage from "@/pages/admin/AdminChallengesPage";
import AdminProjectsPage from "@/pages/admin/AdminProjectsPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminBetaDashboardPage from "@/pages/admin/AdminBetaDashboardPage";
import AdminFeedbackDashboardPage from "@/pages/admin/AdminFeedbackDashboardPage";
import AdminLaunchChecklistPage from "@/pages/admin/AdminLaunchChecklistPage";

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

/** Admin-only route guard */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (!profile)
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (profile.role !== "admin") return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route path="/invite/:code" element={<BetaInvitePage />} />
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
        <Route
          path="/showcase/:submissionId"
          element={<ProjectShowcasePage />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/onboarding" element={<BetaOnboardingPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/dsa" element={<DSAVisualizerPage />} />
        <Route path="/system-design" element={<SystemDesignPage />} />
        <Route path="/interview-prep" element={<InterviewPrepPage />} />
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        <Route path="/study-planner" element={<StudyPlannerPage />} />
      </Route>

      {/* Utility pages */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Admin — separate layout */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/paths" element={<AdminPathsPage />} />
        <Route path="/admin/modules" element={<AdminModulesPage />} />
        <Route path="/admin/lessons" element={<AdminLessonsPage />} />
        <Route path="/admin/challenges" element={<AdminChallengesPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/beta" element={<AdminBetaDashboardPage />} />
        <Route
          path="/admin/feedback"
          element={<AdminFeedbackDashboardPage />}
        />
        <Route
          path="/admin/launch-checklist"
          element={<AdminLaunchChecklistPage />}
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppRoutes />
            <FeedbackButton />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
