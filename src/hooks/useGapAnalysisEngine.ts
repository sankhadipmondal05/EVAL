import { useState, useEffect, useCallback, useRef } from 'react';
import { Circle, Triangle, Square, Plus, Star } from 'lucide-react';

export type GamePhase = 'PLAYING' | 'RESULTS';

// Definitive Shape Palette with Chromatic Identity
export const GAP_SHAPES = [
  { id: 'circle', icon: Circle, color: '#10b981' }, // Green
  { id: 'triangle', icon: Triangle, color: '#3b82f6' }, // Blue
  { id: 'square', icon: Square, color: '#ef4444' }, // Red
  { id: 'plus', icon: Plus, color: '#06b6d4' }, // Cyan
  { id: 'star', icon: Star, color: '#a855f7' } // Purple
];

interface GridCell {
  symbolIdx: number;
  isHidden?: boolean;
  isEmpty?: boolean;
}

interface GapAnalysisEngineProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  duration: number;
}

export const useGapAnalysisEngine = ({ onScore, onComplete, duration }: GapAnalysisEngineProps) => {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [targetCell, setTargetCell] = useState<{ r: number, c: number } | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [missionTimer, setMissionTimer] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);

  // Mirrors to avoid stale closures in the timer
  const levelRef = useRef(level);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Authoritative mission timer - SINGLETON instance, never restarts
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          setIsComplete(true);
          onCompleteRef.current({ level: levelRef.current, finalScore: 0 });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Run exactly once on mount

  const generateLevel = useCallback(() => {
    const size = level <= 5 ? 3 : level <= 10 ? 4 : 5;
    setGridSize(size);

    const difficultyStep = Math.floor((level - 1) / 5);
    
    let emptyChance;
    if (level > 20) {
      emptyChance = Math.min(0.65 + ((level - 20) * 0.01), 0.75);
    } else {
      emptyChance = Math.min(0.25 + (difficultyStep * 0.05), 0.50);
    }
    
    const availableShapes = level > 20 
      ? GAP_SHAPES.length 
      : Math.min(Math.max(3, 3 + difficultyStep), GAP_SHAPES.length, size);

    const baseRow = Array.from({ length: size }, (_, i) => i % availableShapes);
    for (let i = baseRow.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [baseRow[i], baseRow[j]] = [baseRow[j], baseRow[i]];
    }

    const newGrid: GridCell[][] = [];

    for (let r = 0; r < size; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < size; c++) {
        const symbolIdx = baseRow[(c + r) % size];
        const isEmpty = Math.random() < emptyChance;
        row.push({ symbolIdx, isEmpty });
      }
      newGrid.push(row);
    }

    for (let i = size - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newGrid[i], newGrid[j]] = [newGrid[j], newGrid[i]];
    }
    for (let i = size - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      for (let r = 0; r < size; r++) {
        [newGrid[r][i], newGrid[r][j]] = [newGrid[r][j], newGrid[r][i]];
      }
    }

    const targetR = Math.floor(Math.random() * size);
    const targetC = Math.floor(Math.random() * size);
    newGrid[targetR][targetC].isHidden = true;
    newGrid[targetR][targetC].isEmpty = false;

    setGrid(newGrid);
    setTargetCell({ r: targetR, c: targetC });
    setOptions(Array.from({ length: availableShapes }, (_, i) => i).sort(() => Math.random() - 0.5));
    setFeedback(null);
    setSelectedIdx(null);
  }, [level]);

  useEffect(() => {
    if (!isComplete) {
      generateLevel();
    }
  }, [generateLevel, isComplete]);

  const handleOptionClick = (idx: number) => {
    if (feedback || !targetCell || isComplete) return;
    setSelectedIdx(idx);
    const correctIdx = grid[targetCell.r][targetCell.c].symbolIdx;

    if (idx === correctIdx) {
      setFeedback('correct');
      onScore(1);
      setTimeout(() => setLevel(prev => prev + 1), 600);
    } else {
      setFeedback('wrong');
      onScore(-1);
      setTimeout(() => setLevel(prev => prev + 1), 600);
    }
  };

  return {
    level,
    gridSize,
    grid,
    options,
    feedback,
    selectedIdx,
    missionTimer,
    handleOptionClick
  };
};
