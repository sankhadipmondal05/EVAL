import { useState, useEffect, useCallback, useRef } from 'react';

export type GamePhase = 'MEMORIZE' | 'SYMMETRY' | 'RECALL' | 'RESULTS';

interface GridRecallEngineProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  duration: number;
  score: number;
}

export const useGridRecallEngine = ({ onScore, onComplete, duration, score }: GridRecallEngineProps) => {
  const [phase, setPhase] = useState<GamePhase>('MEMORIZE');
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(0);
  const [blinkSequence, setBlinkSequence] = useState<number[]>([]);
  const [currentBlink, setCurrentBlink] = useState<number | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [grids, setGrids] = useState<{ left: boolean[][], right: boolean[][], isSymmetric: boolean } | null>(null);
  const [missionTimer, setMissionTimer] = useState(duration);
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [correctSymmetryCount, setCorrectSymmetryCount] = useState(0);
  const [lastSymmetryResult, setLastSymmetryResult] = useState<{ answer: boolean, isCorrect: boolean } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roundTimeoutRef = useRef<any | null>(null);
  const missionIntervalRef = useRef<any | null>(null);
  
  // Authoritative refs to prevent closure staleness in async callbacks
  const phaseRef = useRef<GamePhase>(phase);
  const levelRef = useRef(level);
  const roundRef = useRef(round);
  const blinkSeqRef = useRef<number[]>(blinkSequence);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { roundRef.current = round; }, [round]);
  useEffect(() => { blinkSeqRef.current = blinkSequence; }, [blinkSequence]);

  const generateGrids = useCallback(() => {
    const isSymmetric = Math.random() > 0.5;
    // Deep generate left grid
    const left: boolean[][] = Array(5).fill(0).map(() => 
      Array(5).fill(0).map(() => Math.random() > 0.65)
    );
    
    // Create deep mirrored copy for right
    const right: boolean[][] = left.map(row => [...row].reverse());

    if (!isSymmetric) {
      // Force asymmetry in a non-central column to ensure it's obvious
      const r = Math.floor(Math.random() * 5);
      const c = Math.floor(Math.random() * 2); // Flip column 0 or 1
      right[r][c] = !right[r][c];
    }

    return { left, right, isSymmetric };
  }, []);

  const startNewRound = useCallback((r: number, seq: number[], l: number) => {
    if (roundTimeoutRef.current) clearTimeout(roundTimeoutRef.current);
    
    const dotsToRemember = Math.min(l + 1, 10);
    
    if (r < dotsToRemember) {
      setPhase('MEMORIZE');
      let nextIdx;
      let attempts = 0;
      do {
        nextIdx = Math.floor(Math.random() * 20);
        attempts++;
      } while (seq.includes(nextIdx) && attempts < 15);

      const nextSeq = [...seq, nextIdx];
      setBlinkSequence(nextSeq);
      setCurrentBlink(nextIdx);
      
      roundTimeoutRef.current = setTimeout(() => {
        setCurrentBlink(null);
        setPhase('SYMMETRY');
        setGrids(generateGrids());
        setPhaseTimer(4);
      }, 2000);
    } else {
      setPhase('RECALL');
    }
  }, [generateGrids]);

  // Initial Mission Start - Run exactly once on mount
  useEffect(() => {
    startNewRound(0, [], 1);
    
    missionIntervalRef.current = setInterval(() => {
      setMissionTimer(t => {
        if (t <= 1) {
          if (missionIntervalRef.current) clearInterval(missionIntervalRef.current);
          setPhase('RESULTS');
          onComplete({
            level,
            symmetryScore: correctSymmetryCount,
            score
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (missionIntervalRef.current) clearInterval(missionIntervalRef.current);
      if (roundTimeoutRef.current) clearTimeout(roundTimeoutRef.current);
    };
  }, []); // Authority-stamped mount-only execution

  // Symmetry Phase Timer
  useEffect(() => {
    let interval: any;
    if (phase === 'SYMMETRY' && phaseTimer > 0 && !isTransitioning) {
      interval = setInterval(() => {
        setPhaseTimer(t => {
          if (t <= 1) {
            handleSymmetryAnswer(null);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, phaseTimer, isTransitioning]);

  const handleSymmetryAnswer = (answer: boolean | null) => {
    if (phaseRef.current !== 'SYMMETRY' || isTransitioning) return;
    
    const isCorrect = answer === grids?.isSymmetric;
    if (isCorrect) {
      onScore(3);
      setCorrectSymmetryCount(prev => prev + 1);
    } else {
      onScore(-1);
    }

    setLastSymmetryResult({ answer: answer === null ? false : answer, isCorrect });
    setIsTransitioning(true);

    setTimeout(() => {
      setLastSymmetryResult(null);
      setIsTransitioning(false);
      
      const currentR = roundRef.current;
      const currentSeq = blinkSeqRef.current;
      const currentL = levelRef.current;
      
      const nextRound = currentR + 1;
      setRound(nextRound);
      startNewRound(nextRound, currentSeq, currentL);
    }, 800);
  };

  const handleDotClick = (idx: number) => {
    if (phase !== 'RECALL' || isTransitioning) return;
    if (userSequence.includes(idx)) return;

    const expectedIdx = blinkSequence[userSequence.length];
    const isCorrect = idx === expectedIdx;

    const nextUserSeq = [...userSequence, idx];
    setUserSequence(nextUserSeq);

    if (isCorrect) {
      onScore(3);
    } else {
      onScore(-1);
    }

    const dotsToRemember = Math.min(level + 1, 10);
    if (nextUserSeq.length === dotsToRemember) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setRound(0);
        setUserSequence([]);
        setBlinkSequence([]);
        startNewRound(0, [], nextLevel);
      }, 1000);
    }
  };

  return {
    phase,
    level,
    round,
    blinkSequence,
    currentBlink,
    userSequence,
    grids,
    missionTimer,
    phaseTimer,
    correctSymmetryCount,
    lastSymmetryResult,
    isTransitioning,
    handleSymmetryAnswer,
    handleDotClick
  };
};
