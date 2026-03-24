import { Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseLibraryPage from "./pages/CourseLibraryPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MentorDashboardPage from "./pages/MentorDashboardPage";
import MentorSearchPage from "./pages/MentorSearchPage";
import ModerationPage from "./pages/ModerationPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import VideoCallPage from "./pages/VideoCallPage";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin-login" element={<AdminLoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route path="student" element={<DashboardLayout role="student" />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="mentors" element={<MentorSearchPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="video-call" element={<VideoCallPage />} />
          <Route path="library" element={<CourseLibraryPage />} />
          <Route path="library/:courseId" element={<CourseDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="moderation" element={<ModerationPage />} />
        </Route>

        <Route path="mentor" element={<DashboardLayout role="mentor" />}>
          <Route index element={<MentorDashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="moderation" element={<ModerationPage />} />
        </Route>

        <Route path="admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="moderation" element={<ModerationPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="dashboard" element={<Navigate to="/student" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
