import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { LogOut, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';



import { useAuthStore } from '../../store/authStore';

import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const PacmanAvatar = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // 1.5s cycle. 300ms interval = 5 chomps per cycle.
    // At 1.5 * 0.46 = 690ms (dot arrival), the mouth will be in the 600-900ms "OPEN" phase.
    const interval = setInterval(() => setIsOpen(prev => !prev), 300);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="pacman-avatar">
      {/* Target Corners */}
      <div className="corner tl"></div>
      <div className="corner tr"></div>
      <div className="corner bl"></div>
      <div className="corner br"></div>
      
      <div className="pacman-grid">
        {Array.from({ length: 11 }).map((_, r) => (
          <div key={r} className="pacman-row">
            {Array.from({ length: 11 }).map((_, c) => {

              // Circle logic: (x-h)^2 + (y-k)^2 <= r^2
              const dx = c - 5;
              const dy = r - 5;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const isCircle = distance <= 5;
              
              // Mouth logic (right side triangle)
              const inMouthRange = isOpen && c >= 5 && Math.abs(dy) <= (c - 5);
              
              // Eye logic (left side)
              const isEye = r === 3 && c === 4;
              
              const isActive = isCircle && !inMouthRange && !isEye;

              
              return (
                <div 
                  key={c} 
                  className={`pixel ${isActive ? 'active' : ''}`}
                  style={{ 
                    opacity: isActive ? 1 : 0.05,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="dot-container">
        <motion.div 
          className="power-dot"
          animate={{ 
            x: [140, -40],
            opacity: [1, 1, 0, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear",
            times: [0, 0.46, 0.47, 1]
          }}

        />
      </div>


    </div>
  );
};


const ProfilePage = () => {
  const signOut = useAuthStore(state => state.signOut);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Global Rank', value: '#1,204', sub: 'Top 5%' },
    { label: 'Accuracy', value: '94.2%', sub: '+2.4% vs last week' },
    { label: 'Play Time', value: '24h 15m', sub: 'Active learner' },
    { label: 'Completed', value: '142', sub: 'Assessments' },
  ];

  const assessmentHistory = [
    { date: 'Oct 24, 2025', game: 'Grid Challenge', score: '2,400', level: '12', perf: 'Excellent' },
    { date: 'Oct 22, 2025', game: 'Motion Challenge', score: '3,150', level: '08', perf: 'Above Avg' },
    { date: 'Oct 20, 2025', game: 'Scales CLX', score: '1,800', level: '05', perf: 'Good' },
    { date: 'Oct 18, 2025', game: 'Switch Challenge', score: '950', level: '03', perf: 'Improvable' },
  ];

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Profile Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="profile-sidebar"
        >
          <div className="sidebar-card">
            <PacmanAvatar />
            <h2 className="profile-name">Alex Sterling</h2>
            
            <div className="info-group">
              <div className="info-item">
                <Calendar className="w-4 h-4" /> Joined May 2024
              </div>
            </div>

          </div>

          <div className="sidebar-menu">
            <button onClick={handleSignOut} className="menu-item menu-item-logout group">
              <div className="flex items-center gap-3"><LogOut className="w-4 h-4" /> Sign Out</div>
            </button>
          </div>

        </motion.div>

        {/* Profile Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="profile-content"
        >
          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* History Section */}
          <div className="section-card">
            <h3 className="section-title mb-6">Assessment History</h3>
            <div className="history-list">
              {assessmentHistory.map((item, i) => (
                <div key={i} className="history-item">
                  <div className="item-main">
                    <div className="item-info">
                      <div className="item-game-name">{item.game}</div>
                      <div className="item-game-level">Level {item.level}</div>
                    </div>
                  </div>
                  <div className="item-stats">
                    <div className="item-score-group">
                      <div className="item-score-value">{item.score}</div>
                      <div className="item-performance">{item.perf}</div>
                    </div>
                    <Button size="sm" variant="ghost" className="p-2"><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
