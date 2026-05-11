import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Lenis from 'lenis';

// Stores
import { useAuthStore } from './store/authStore';

// Components
import Navbar from './components/layout/Navbar';


// Pages
import GamesHub from './pages/games/GamesHub';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
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
          <Route path="/" element={<PageWrapper><GamesHub /></PageWrapper>} />
          <Route path="/games" element={<PageWrapper><GamesHub /></PageWrapper>} />
          <Route path="/games/:id" element={<PageWrapper><GamePlay /></PageWrapper>} />
          <Route path="/leaderboard" element={<PageWrapper><LeaderboardPage /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          
          {/* Fallback */}
          <Route path="*" element={<GamesHub />} />
        </Routes>

      </AnimatePresence>
    </div>
  );
}

export default App;
