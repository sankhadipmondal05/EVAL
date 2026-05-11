import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TacticalHUD } from './TacticalHUD';
import './styles/TacticalHUD.css';

interface MotionChallengeProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  color: string;
  score: number;
}

export const MotionChallenge = ({ onScore, onComplete, color, score: totalScore }: MotionChallengeProps) => {
  const [level, setLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 4, y: 4 });
  const [obstacles, setObstacles] = useState<{ x: number, y: number, dx: number, dy: number }[]>([]);
  const [isFailed, setIsFailed] = useState(false);
  const [missionTimer, setMissionTimer] = useState(180);
  const missionIntervalRef = useRef<any>(null);

  const startLevel = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setTarget({ x: 4, y: 4 });
    const count = 3 + level;
    const newObstacles = Array.from({ length: count }).map(() => ({
      x: Math.floor(Math.random() * 5),
      y: Math.floor(Math.random() * 5),
      dx: Math.random() > 0.5 ? 1 : -1,
      dy: Math.random() > 0.5 ? 1 : -1
    })).filter(o => (o.x !== 0 || o.y !== 0) && (o.x !== 4 || o.y !== 4));
    
    setObstacles(newObstacles);
    setIsFailed(false);
  }, [level]);

  useEffect(() => {
    startLevel();
    missionIntervalRef.current = setInterval(() => {
      setMissionTimer(t => {
        if (t <= 1) {
          clearInterval(missionIntervalRef.current);
          onComplete({ level, score: totalScore });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (missionIntervalRef.current) clearInterval(missionIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setObstacles(prev => prev.map(o => {
        let nx = o.x + o.dx;
        let ny = o.y + o.dy;
        let ndx = o.dx;
        let ndy = o.dy;

        if (nx < 0 || nx > 4) ndx *= -1;
        if (ny < 0 || ny > 4) ndy *= -1;

        return { ...o, x: o.x + ndx, y: o.y + ndy, dx: ndx, dy: ndy };
      }));
    }, Math.max(200, 800 - (level * 50)));

    return () => clearInterval(timer);
  }, [level]);

  useEffect(() => {
    const collision = obstacles.some(o => o.x === position.x && o.y === position.y);
    if (collision) {
      setIsFailed(true);
      onScore(-50);
      setTimeout(() => startLevel(), 500);
    }

    if (position.x === target.x && position.y === target.y) {
      onScore(100);
      setLevel(l => l + 1);
      startLevel();
    }
  }, [position, obstacles, target, startLevel]);

  const move = (dx: number, dy: number) => {
    if (isFailed) return;
    const nx = Math.max(0, Math.min(4, position.x + dx));
    const ny = Math.max(0, Math.min(4, position.y + dy));
    setPosition({ x: nx, y: ny });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(0, -1);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [position, isFailed]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-black overflow-hidden relative">
      <TacticalHUD 
        score={totalScore}
        level={level}
        timer={missionTimer}
        color={color}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-2xl px-6 mt-20">
        <div className="text-center w-full">
          <div className="inline-block px-6 py-2 rounded-sm bg-white/5 border border-white/10 text-white font-pixel uppercase tracking-widest text-[9px] mb-4">
            Navigation Protocol Active
          </div>
          <h2 className="text-[10px] text-white/40 font-pixel uppercase tracking-[0.2em]">Navigate to extraction point // Avoid dynamic interference</h2>
        </div>

        <div className="relative p-1 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="grid grid-cols-5 grid-rows-5 gap-1 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px]">
            {Array.from({ length: 25 }).map((_, i) => {
              const x = i % 5;
              const y = Math.floor(i / 5);
              const isPlayer = position.x === x && position.y === y;
              const isTarget = target.x === x && target.y === y;
              const isObstacle = obstacles.some(o => o.x === x && o.y === y);

              return (
                <div key={i} className="bg-white/[0.01] border border-white/[0.03] rounded-lg flex items-center justify-center relative">
                  {isTarget && (
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-2 border-2 border-accent/30 rounded-lg flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </motion.div>
                  )}
                  {isObstacle && (
                    <motion.div 
                      layoutId={`obs-${x}-${y}`}
                      className="w-8 h-8 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    </motion.div>
                  )}
                  {isPlayer && (
                    <motion.div 
                      layoutId="player"
                      className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] z-10"
                    >
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div />
          <button onClick={() => move(0, -1)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">↑</button>
          <div />
          <button onClick={() => move(-1, 0)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">←</button>
          <button onClick={() => move(0, 1)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">↓</button>
          <button onClick={() => move(1, 0)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">→</button>
        </div>
      </div>
    </div>
  );
};
