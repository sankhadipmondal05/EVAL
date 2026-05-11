import { motion } from 'framer-motion';
import { Brain, Target, Zap, Move, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Games.css';

const GAMES = [
  {
    id: 'grid-challenge',
    title: 'GRID_RECALL',
    module: '01',
    desc: 'Reconstruct complex grids from limited visual exposure.',
    icon: Target,
    color: '#d97757',
    time: '04:00',
    difficulty: 'MEDIUM',
    skills: ['MEMORY', 'ATTENTION'],
    status: 'READY'
  },
  {
    id: 'scales-clx',
    title: 'SCALES_CLX',
    module: '02',
    desc: 'Analyze symbolic sequences and balance abstract logical patterns.',
    icon: Brain,
    color: '#7e69ab',
    time: '04:00',
    difficulty: 'HARD',
    skills: ['REASONING'],
    status: 'READY'
  },
  {
    id: 'motion-challenge',
    title: 'MOTION_TRACE',
    module: '03',
    desc: 'Predict movement patterns and solve pathfinding puzzles in a dynamic simulation.',
    icon: Move,
    color: '#33cccc',
    time: '05:00',
    difficulty: 'HARD',
    skills: ['PLANNING', 'PROBLEM SOLVING'],
    status: 'READY'
  },
  {
    id: 'switch-challenge',
    title: 'SWITCH_PROTOCOL',
    module: '04',
    desc: 'Determine the correct switch sequence to stabilize the circuit system.',
    icon: Zap,
    color: '#d97757',
    time: '06:00',
    difficulty: 'EXTREME',
    skills: ['LOGIC'],
    status: 'READY'
  },
  {
    id: 'gap-challenge',
    title: 'GAP_ANALYSIS',
    module: '05',
    desc: 'Identify missing elements in structured datasets and logical sequences.',
    icon: Brain,
    color: '#7e69ab',
    time: '04:30',
    difficulty: 'MEDIUM',
    skills: ['ANALYSIS'],
    status: 'READY'
  }
];

const GameCard = ({ game, index }: { game: typeof GAMES[0], index: number }) => {
  const navigate = useNavigate();
  const isLocked = game.status === 'LOCKED';

  const handleCardClick = () => {
    if (!isLocked) {
      navigate(`/games/${game.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`game-card ${isLocked ? 'locked' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: isLocked ? 'default' : 'pointer' }}
      whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
    >
      <div className={`status-badge ${isLocked ? 'status-locked' : 'status-ready'}`}>
        STATUS: {game.status}
      </div>

      <div className="module-info">
        <div className="visual-block">
          <div className="visual-brackets" />
          <div className="wireframe-container">
            <game.icon
              className="module-icon-svg"
              style={{ color: game.color, filter: `drop-shadow(0 0 10px ${game.color}40)` }}
            />
          </div>
        </div>

        <div className="content-block">
          <span className="module-id">MODULE_{game.module}</span>
          <h3 className="module-title">{game.title}</h3>
          <p className="module-desc">{game.desc}</p>
        </div>
      </div>

      <div className="meta-grid">
        <div className="meta-item">
          <span className="meta-label">DIFFICULTY</span>
          <span className="meta-value" style={{ color: game.color }}>{game.difficulty}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">DURATION</span>
          <span className="meta-value">{game.time}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">TYPE</span>
          <div className="type-tags">
            {game.skills.map((skill, i) => (
              <span key={i} className="type-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card-footer">
        {!isLocked ? (
          <div className="execute-link">
            <span>&gt; EXECUTE_MODULE</span>
            <ArrowRight className="arrow-icon" />
          </div>
        ) : (
          <div className="locked-notice">
            <Lock className="locked-icon" />
            <span>COMPLETE PRIOR MODULES TO UNLOCK</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const GamesHub = () => {
  return (
    <div className="games-hub-container">
      <div className="games-header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="games-title"
        >
          ASSESSMENT <span className="hub-text">HUB<span className="cursor-blink">_</span></span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="games-subtitle"
        >
          Select a specialized cognitive module to evaluate and sharpen your engineering mindset. All performance data is recorded for your cognitive profile.
        </motion.p>
      </div>

      <div className="games-grid">
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>
    </div>
  );
};

export default GamesHub;
