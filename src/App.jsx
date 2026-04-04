import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AppointmentSchedulerPage from "./pages/AppointmentSchedulerPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogPage from "./pages/BlogPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import CommunityFeedPage from "./pages/CommunityFeedPage";
import ConnectionMemberProfilePage from "./pages/ConnectionMemberProfilePage";
import ConnectionsPage from "./pages/ConnectionsPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseLibraryPage from "./pages/CourseLibraryPage";
import DocumentLibraryPage from "./pages/DocumentLibraryPage";
import FAQPage from "./pages/FAQPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LandingPage from "./pages/LandingPage";
import MentorDashboardPage from "./pages/MentorDashboardPage";
import MentorLoginPage from "./pages/MentorLoginPage";
import MentorSearchPage from "./pages/MentorSearchPage";
import MentorSignupPage from "./pages/MentorSignupPage";
import MessagesPage from "./pages/MessagesPage";
import ModerationPage from "./pages/ModerationPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VideoCallPage from "./pages/VideoCallPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route
              path="login"
              element={<Navigate to="/student-login" replace />}
            />
            <Route path="student-login" element={<StudentLoginPage />} />
            <Route path="mentor-login" element={<MentorLoginPage />} />
            <Route path="admin-login" element={<AdminLoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route
              path="signup"
              element={<Navigate to="/student-signup" replace />}
            />
            <Route path="student-signup" element={<StudentSignupPage />} />
            <Route path="mentor-signup" element={<MentorSignupPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:id" element={<BlogDetailPage />} />
            <Route path="faq" element={<FAQPage />} />
          </Route>

          <Route
            path="student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout role="student" />
              </ProtectedRoute>
            }>
            <Route index element={<StudentDashboardPage />} />
            <Route path="feed" element={<CommunityFeedPage role="student" />} />
            <Route
              path="appointments"
              element={<AppointmentSchedulerPage role="student" />}
            />
            <Route
              path="documents"
              element={<DocumentLibraryPage role="student" />}
            />
            <Route path="mentors" element={<MentorSearchPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route
              path="connections/:memberId"
              element={<ConnectionMemberProfilePage />}
            />
            <Route path="messages" element={<MessagesPage role="student" />} />
            <Route path="video-call" element={<VideoCallPage />} />
            <Route path="library" element={<CourseLibraryPage />} />
            <Route path="library/:courseId" element={<CourseDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="moderation" element={<ModerationPage />} />
          </Route>

          <Route
            path="mentor"
            element={
              <ProtectedRoute allowedRoles={["mentor"]}>
                <DashboardLayout role="mentor" />
              </ProtectedRoute>
            }>
            <Route index element={<MentorDashboardPage />} />
            <Route path="feed" element={<CommunityFeedPage role="mentor" />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route
              path="connections/:memberId"
              element={<ConnectionMemberProfilePage />}
            />
            <Route path="messages" element={<MessagesPage role="mentor" />} />
            <Route
              path="appointments"
              element={<AppointmentSchedulerPage role="mentor" />}
            />
            <Route
              path="documents"
              element={<DocumentLibraryPage role="mentor" />}
            />
            <Route path="video-call" element={<VideoCallPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="moderation" element={<ModerationPage />} />
          </Route>

          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout role="admin" />
              </ProtectedRoute>
            }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="feed" element={<CommunityFeedPage role="admin" />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route
              path="connections/:memberId"
              element={<ConnectionMemberProfilePage />}
            />
            <Route path="messages" element={<MessagesPage role="admin" />} />
            <Route
              path="appointments"
              element={<AppointmentSchedulerPage role="admin" />}
            />
            <Route
              path="documents"
              element={<DocumentLibraryPage role="admin" />}
            />
            <Route path="video-call" element={<VideoCallPage />} />
            <Route path="moderation" element={<ModerationPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route
            path="dashboard"
            element={<Navigate to="/student" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
