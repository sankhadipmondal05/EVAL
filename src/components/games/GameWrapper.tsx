import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import './GameWrapper.css';

const PIXEL_TROPHY = [
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
];

const PixelTrophy = ({ color }: { color: string }) => (
  <div className="pixel-trophy">
    {PIXEL_TROPHY.map((row, i) => (
      <div key={i} className="trophy-row">
        {row.map((pixel, j) => (
          <div 
            key={j} 
            className={`trophy-pixel ${pixel ? 'active' : ''}`}
            style={pixel ? { backgroundColor: color, boxShadow: `0 0 15px ${color}` } : {}}
          />
        ))}
      </div>
    ))}
    {/* Animated particles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="trophy-particle"
        style={{ backgroundColor: color }}
        animate={{
          y: [-20, -120],
          x: [0, (i % 2 === 0 ? 40 : -40)],
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeOut"
        }}
      />
    ))}
  </div>
);

interface GameWrapperProps {
  title: string;
  briefing: string;
  icon: any;
  color: string;
  rules: {
    procedure: string[];
    scoring: string[];
    constraints: string[];
    goals: string[];
  };
  duration?: number;
  children: (props: { 
    onScore: (pts: number) => void, 
    onComplete: (stats: any) => void,
    isStarted: boolean,
    color: string,
    score: number
  }) => React.ReactNode;
}

export const GameWrapper = ({ title, briefing, icon: Icon, color, rules, duration = 60, children }: GameWrapperProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);


  const [bestScore, setBestScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem(`best_score_${title}`) || '0');
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (isStarted) {
      setTimeLeft(duration);
    }
  }, [isStarted, duration]);

  // Create an RGBA version of the theme color for the aura
  const auraColor = `${color}1A`; // 10% opacity

  useEffect(() => {
    let timer: any;
    if (isStarted && timeLeft > 0 && !isComplete) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && !isComplete) {
      handleComplete({ finalScore: score, timeSpent: 60, accuracy: 'N/A' });
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, isComplete]);

  const handleComplete = (_stats?: any) => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(`best_score_${title}`, score.toString());
    }
    setIsComplete(true);
  };



  const handleScore = (pts: number) => {
    setScore(s => s + pts);
  };


  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };

  return (
    <div 
      className="game-container" 
      style={{ 
        '--module-color': color,
        '--module-color-rgb': hexToRgb(color)
      } as React.CSSProperties}
    >
      {/* Start Screen */}
      <AnimatePresence>
        {!isStarted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="game-briefing-layout"
          >
            {/* Execution Card (Left) */}
            <div className="game-start-card" style={{ borderColor: `${color}1A` }}>
              <div className="module-icon-aura" style={{ backgroundColor: auraColor, color }}>
                <Icon className="module-icon-large" />
              </div>
              <h1 className="module-briefing-title">{title}</h1>
              <p className="module-briefing-text">{briefing}</p>

              {/* Assessment Goals */}
              <div className="goals-grid-left">
                {rules.goals.map((g, i) => (
                  <span key={i} className="goal-tag" style={{ borderColor: `${color}33`, color: `${color}99` }}>
                    {g}
                  </span>
                ))}
              </div>
              
              <div className="action-group">
                <Button 
                  size="lg" 
                  className="execute-btn" 
                  onClick={() => setIsStarted(true)}
                  style={{ backgroundColor: color, color: '#000' }}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="flex-shrink-0"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span className="btn-text">EXECUTE_PROTOCOL</span>
                </Button>
                <Link to="/games" className="back-hub-link">
                  <RotateCcw className="btn-icon" style={{ width: '18px', height: '18px', opacity: 1 }} strokeWidth={1.5} /> 
                  <span className="link-text">RETURN_TO_HUB</span>
                </Link>
              </div>
            </div>

            {/* Rules Card (Right) */}
            <div className="game-rules-card" style={{ borderColor: `${color}0D` }}>
              <div className="rules-section">
                <div className="rules-header">
                  <span className="rules-label" style={{ color }}>01 // OPERATIONAL_PROCEDURE</span>
                  <div className="rules-line" style={{ backgroundColor: `${color}33` }} />
                </div>
                <ul className="rules-list">
                  {rules.procedure.map((p, i) => (
                    <li key={i}>
                      <span style={{ color, opacity: 0.5 }}>//</span> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rules-section">
                <div className="rules-header">
                  <span className="rules-label" style={{ color }}>02 // SCORING_LOGIC</span>
                  <div className="rules-line" style={{ backgroundColor: `${color}33` }} />
                </div>
                <ul className="rules-list">
                  {rules.scoring.map((s, i) => (
                    <li key={i}>
                      <span style={{ color, opacity: 0.5 }}>//</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rules-section">
                <div className="rules-header">
                  <span className="rules-label" style={{ color }}>03 // ENGAGEMENT_RULES</span>
                  <div className="rules-line" style={{ backgroundColor: `${color}33` }} />
                </div>
                <ul className="rules-list">
                  {rules.constraints.map((c, i) => (
                    <li key={i}>
                      <span style={{ color, opacity: 0.5 }}>//</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Content */}
      {isStarted && !isComplete && (
        <div className="w-full max-w-5xl flex items-center justify-center p-4">
          {children({ 
            onScore: handleScore, 
            onComplete: handleComplete,
            isStarted,
            color,
            score
          })}
        </div>
      )}

      {/* Completion Screen - Industrial Debriefing Portal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mission-complete-portal"
          >
            <div className="debriefing-header">
              <div className="status-badge" style={{ color }}>
                <span className="status-dot" style={{ backgroundColor: color }} />
                MISSION_ACCOMPLISHED
              </div>
              <PixelTrophy color={color} />
              <h2 className="debriefing-title">MISSION_SUMMARY</h2>
            </div>


            <div className="results-grid">
              <div className="performance-node">
                <div className="node-label">// MISSION_SCORE</div>
                <div className="node-value" style={{ color }}>{score}</div>
                <div className="node-glitch-line" style={{ backgroundColor: color }} />
              </div>

              <div className="performance-node">
                <div className="node-label">// BEST_SCORE</div>
                <div className="node-value" style={{ color: score >= bestScore && score > 0 ? color : 'rgba(255,255,255,0.4)' }}>
                  {bestScore}
                </div>
                <div className="node-glitch-line" style={{ backgroundColor: color }} />
              </div>
            </div>


            <div className="debriefing-actions">
              <Link to="/games" className="action-link-wrapper">
                <Button size="lg" className="tactical-btn" style={{ backgroundColor: color }}>
                  <span className="btn-text">RETURN_TO_COMMAND</span>
                </Button>
              </Link>
              <Link to="/dashboard" className="action-link-wrapper">
                <Button size="lg" variant="outline" className="tactical-btn-outline">
                  <span className="btn-text">ACCESS_ANALYTICS</span>
                </Button>
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
