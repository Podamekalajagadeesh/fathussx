import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Profile from './components/Profile.jsx';
import Projects from './components/Projects.jsx';
import ProjectDetails from './components/ProjectDetails.jsx';
import CreateProject from './components/CreateProject.jsx';
import Dashboard from './components/Dashboard.jsx';
import DashboardRev from './pages/DashboardRev.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Gigs from './components/Gigs.jsx';
import GigDetail from './components/GigDetail.jsx';
import CreateGig from './components/CreateGig.jsx';
import Applications from './components/Applications.jsx';
import AIHelper from './components/AIHelper.jsx';
import Courses from './pages/Courses.jsx';
import MyCourses from './pages/MyCourses.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import CourseProgress from './pages/CourseProgress.jsx';
import LessonDetail from './pages/LessonDetail.jsx';
import Progress from './pages/Progress.jsx';
import PublicProfile from './components/PublicProfile.jsx';
import Users from './components/Users.jsx';
import Messenger from './components/Messenger.jsx';
import Recommendations from './components/Recommendations.jsx';
import UserSearch from './components/UserSearch.jsx';
import Notifications from './components/Notifications.jsx';
import ActivityFeed from './pages/ActivityFeed.jsx';
import Mentorship from './pages/Mentorship.jsx';
import FindMentor from './pages/FindMentor.jsx';
import Badges from './pages/Badges.jsx';
import MyBadges from './pages/MyBadges.jsx';
import Certifications from './pages/Certifications.jsx';
import MyCertifications from './pages/MyCertifications.jsx';
import MyNftCertificates from './pages/MyNftCertificates.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetail from './pages/JobDetail.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import Chat from './pages/Chat.jsx';
import VideoConference from './pages/VideoConference.jsx';
import MyCalendar from './pages/Calendar.jsx';
import Files from './pages/Files.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import NewThread from './pages/NewThread.jsx';
import Thread from './pages/Thread.jsx';
import Forum from './pages/Forum.jsx';
import Community from './pages/Community.jsx';
import Search from './pages/Search.jsx';
import SearchResults from './pages/SearchResults.jsx';
import CodingPlayground from './pages/CodingPlayground.jsx';
import Settings from './pages/Settings.jsx';
import CreatorDashboard from './pages/CreatorDashboard';
import CourseEditor from './components/CourseEditor.jsx';
import FlashcardDecks from './pages/FlashcardDecks.jsx';
import NewFlashcardDeck from './pages/NewFlashcardDeck.jsx';
import FlashcardDeck from './pages/FlashcardDeck.jsx';
import NewFlashcard from './pages/NewFlashcard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AuthCallback from './components/AuthCallback.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ThemeProvider, ThemeContext } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import LandingPage from './pages/LandingPage.jsx';
import './App.css';
import './components.css';
import './styles/design-tokens.css';

const AppContent = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div data-theme={theme}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="fade-in">
        <Breadcrumbs />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard-rev" element={<ProtectedRoute><DashboardRev /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/gigs" element={<ProtectedRoute><Gigs /></ProtectedRoute>} />
          <Route path="/gigs/:id" element={<ProtectedRoute><GigDetail /></ProtectedRoute>} />
          <Route path="/gigs/create" element={<ProtectedRoute><CreateGig /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/gigs/:gigId/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/ai-helper" element={<ProtectedRoute><AIHelper /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/courses/:courseId/progress" element={<ProtectedRoute><CourseProgress /></ProtectedRoute>} />
          <Route path="/lessons/:lessonId" element={<ProtectedRoute><LessonDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messenger /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/user-search" element={<ProtectedRoute><UserSearch /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><ActivityFeed /></ProtectedRoute>} />
          <Route path="/mentorship" element={<ProtectedRoute><Mentorship /></ProtectedRoute>} />
          <Route path="/mentorship/find" element={<ProtectedRoute><FindMentor /></ProtectedRoute>} />
          <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
          <Route path="/my-badges" element={<ProtectedRoute><MyBadges /></ProtectedRoute>} />
          <Route path="/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
          <Route path="/my-certifications" element={<ProtectedRoute><MyCertifications /></ProtectedRoute>} />
          <Route path="/my-nft-certificates" element={<ProtectedRoute><MyNftCertificates /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/companies/:id" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/chat/:recipientId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/video-conference" element={<ProtectedRoute><VideoConference /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><MyCalendar /></ProtectedRoute>} />
          <Route path="/files" element={<ProtectedRoute><Files /></ProtectedRoute>} />
          <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
          <Route path="/blog/posts/:id" element={<ProtectedRoute><BlogPost /></ProtectedRoute>} />
          <Route path="/forum/new-thread" element={<ProtectedRoute><NewThread /></ProtectedRoute>} />
          <Route path="/forum/threads/:id" element={<ProtectedRoute><Thread /></ProtectedRoute>} />
          <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/search-results" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/playground" element={<ProtectedRoute><CodingPlayground /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          <Route path="/creator/dashboard" element={<ProtectedRoute><CreatorDashboard /></ProtectedRoute>} />
          <Route path="/creator/course/new" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
          <Route path="/creator/course/:id/edit" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
          
          <Route path="/flashcards" element={<ProtectedRoute><FlashcardDecks /></ProtectedRoute>} />
          <Route path="/flashcards/new-deck" element={<ProtectedRoute><NewFlashcardDeck /></ProtectedRoute>} />
          <Route path="/flashcards/decks/:id" element={<ProtectedRoute><FlashcardDeck /></ProtectedRoute>} />
          <Route path="/flashcards/decks/:deckId/new-card" element={<ProtectedRoute><NewFlashcard /></ProtectedRoute>} />

          {/* Admin Route */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="" element={<AdminDashboard />} />
          </Route>

          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
