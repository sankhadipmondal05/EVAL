import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Lenis from 'lenis';

// Stores
import { useAuthStore } from './store/authStore';

// Components
import Navbar from './components/layout/Navbar';
import { ProtectedRoute, PublicRoute } from './components/auth/AuthGuard';

// Pages
import LandingPage from './pages/landing/LandingPage';
import GamesHub from './pages/games/GamesHub';
import Dashboard from './pages/dashboard/Dashboard';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProfilePage from './pages/profile/ProfilePage';
import GamePlay from './pages/games/GamePlay';
import ContactPage from './pages/contact/ContactPage';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const initializeAuth = useAuthStore(state => state.initialize);

  // Hide navbar on individual game pages to increase immersion
  const isGamePage = location.pathname.startsWith('/games/') && location.pathname !== '/games';

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {!isGamePage && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PublicRoute><PageWrapper><LandingPage /></PageWrapper></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><PageWrapper><LoginPage /></PageWrapper></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><PageWrapper><SignupPage /></PageWrapper></PublicRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><PageWrapper><GamesHub /></PageWrapper></ProtectedRoute>} />
          <Route path="/games/:id" element={<ProtectedRoute><PageWrapper><GamePlay /></PageWrapper></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><PageWrapper><LeaderboardPage /></PageWrapper></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageWrapper><ProfilePage /></PageWrapper></ProtectedRoute>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
