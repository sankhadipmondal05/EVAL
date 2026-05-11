import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Menu, X, User, Trophy, Gamepad2, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NAV_LINKS = [
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-default'}`}>
      {/* Mobile Backdrop Blur Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="mobile-overlay-blur"
          />
        )}
      </AnimatePresence>

      <div className="nav-container">
        <div className={`nav-content ${scrolled ? 'nav-content-scrolled' : ''}`}>
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="nav-logo-link">
            <span className="logo-text">EVAL<span className="cursor-blink">_</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links-desktop">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="nav-actions">
            {user && (
              <Link to="/profile" className="profile-btn">
                <User className="profile-icon" />
              </Link>
            )}
            {!user && !isAuthPage && (
              <Link to="/login">
                <Button className="login-nav-btn">LOG IN_</Button>
              </Link>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-toggle-btn"
            >
              {isOpen ? <X className="toggle-icon" /> : <Menu className="toggle-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-content">
              {user ? (
                <>
                  {NAV_LINKS.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="mobile-nav-link"
                    >
                      <link.icon className="mobile-link-icon" />
                      {link.name}
                    </Link>
                  ))}
                  <div className="mobile-divider" />
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="mobile-nav-link"
                  >
                    <User className="mobile-link-icon-muted" />
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="mobile-nav-link-bold">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="mobile-nav-link-bold">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
