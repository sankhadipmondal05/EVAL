import { useState, useEffect, useCallback, useRef } from 'react';

export type GroupType = 'RED' | 'GREEN';

export interface DiamondMatrix {
  id: string;
  data: (string | number)[];
  group?: GroupType;
  userAnswer?: GroupType;
}

interface LogicalGroupingEngineProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  duration: number;
}

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export const useLogicalGroupingEngine = ({ onScore, onComplete, duration }: LogicalGroupingEngineProps) => {
  const [level, setLevel] = useState(1);
  const [examples, setExamples] = useState<DiamondMatrix[]>([]);
  const [targets, setTargets] = useState<DiamondMatrix[]>([]);
  const [missionTimer, setMissionTimer] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  
  const levelRef = useRef(level);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Continuous Chrono Protocol
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          if (!isComplete) {
            setIsComplete(true);
            onCompleteRef.current({ level: levelRef.current, finalScore: 0 });
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const generateMatrix = (rule: (data: (string | number)[]) => boolean): (string | number)[] => {
    for (let attempt = 0; attempt < 1000; attempt++) {
      const data = Array.from({ length: 9 }, () => {
        const isLetter = Math.random() > 0.45;
        return isLetter ? LETTERS[Math.floor(Math.random() * LETTERS.length)] : Math.floor(Math.random() * 9) + 1;
      });
      if (rule(data)) return data;
    }
    return ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']; 
  };

  const generateLevel = useCallback(() => {
    const step = Math.floor((level - 1) / 5);
    const numExamples = Math.min(2 + step, 6);
    const numTargets = Math.min(1 + step, 6);

    // RECALIBRATED: VISUALLY STABLE GEOMETRIC RULES
    const patterns = [
      { // TIER 1: MAJORITY TYPE (Very clear)
        id: 'majority_alpha',
        rule: (d: any[]) => d.filter(x => typeof x === 'string').length >= 6,
        minLevel: 1
      },
      { // TIER 1: BOUNDARY TYPE (Corners match)
        id: 'corner_symmetry',
        rule: (d: any[]) => typeof d[0] === typeof d[2] && typeof d[2] === typeof d[6] && typeof d[6] === typeof d[8],
        minLevel: 1
      },
      { // TIER 1: REPETITION (At least 3 of a kind)
        id: 'repetition_hard',
        rule: (d: any[]) => {
          const counts: Record<string, number> = {};
          d.forEach(x => counts[String(x)] = (counts[String(x)] || 0) + 1);
          return Object.values(counts).some(c => c >= 3);
        },
        minLevel: 1
      },
      { // TIER 2: DIAGONAL CONSISTENCY
        id: 'diagonal_letters',
        rule: (d: any[]) => typeof d[0] === 'string' && typeof d[4] === 'string' && typeof d[8] === 'string',
        minLevel: 6
      },
      { // TIER 2: CROSS PARITY
        id: 'cross_numbers',
        rule: (d: any[]) => typeof d[1] === 'number' && typeof d[3] === 'number' && typeof d[5] === 'number' && typeof d[7] === 'number',
        minLevel: 6
      },
      { // TIER 3: CENTER DEVIATION
        id: 'center_unique',
        rule: (d: any[]) => {
          const centerType = typeof d[4];
          const perimeter = [0, 1, 2, 3, 5, 6, 7, 8];
          return perimeter.every(idx => typeof d[idx] !== centerType);
        },
        minLevel: 11
      },
      { // TIER 3: SEQUENCE (Contains 3 consecutive numbers)
        id: 'numeric_sequence',
        rule: (d: any[]) => {
          const nums = d.filter(x => typeof x === 'number').sort((a, b) => a - b);
          for (let i = 0; i < nums.length - 2; i++) {
            if (nums[i+1] === nums[i] + 1 && nums[i+2] === nums[i+1] + 1) return true;
          }
          return false;
        },
        minLevel: 16
      }
    ];

    const availablePatterns = patterns.filter(p => level >= p.minLevel);
    const selectedPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
    const redRule = selectedPattern.rule;
    
    // Authoritative Group Contrast Protocol
    const greenRule = (d: any[]) => !redRule(d);

    const redCount = Math.ceil(numExamples / 2);
    const greenCount = numExamples - redCount;

    const redEx = Array.from({ length: redCount }, (_, i) => ({
      id: `red-ex-${i}-${level}`,
      data: generateMatrix(redRule),
      group: 'RED' as GroupType
    }));

    const greenEx = Array.from({ length: greenCount }, (_, i) => ({
      id: `green-ex-${i}-${level}`,
      data: generateMatrix(greenRule),
      group: 'GREEN' as GroupType
    }));

    const newTargets = Array.from({ length: numTargets }, (_, i) => {
      const isRed = Math.random() > 0.5;
      return {
        id: `target-${i}-${level}`,
        data: generateMatrix(isRed ? redRule : greenRule),
        group: isRed ? 'RED' as GroupType : 'GREEN' as GroupType
      };
    });

    setExamples([...redEx, ...greenEx].sort(() => Math.random() - 0.5));
    setTargets(newTargets);
  }, [level]);

  useEffect(() => {
    if (!isComplete) generateLevel();
  }, [generateLevel, isComplete]);

  const handleAnswer = (targetIdx: number, answer: GroupType) => {
    if (targets[targetIdx].userAnswer || isComplete) return;

    const isCorrect = targets[targetIdx].group === answer;
    const newTargets = [...targets];
    newTargets[targetIdx].userAnswer = answer;
    setTargets(newTargets);

    if (isCorrect) onScore(1);
    else onScore(-2);

    if (newTargets.every(t => t.userAnswer)) {
      setTimeout(() => setLevel(prev => prev + 1), 800);
    }
  };

  return {
    level,
    examples,
    targets,
    missionTimer,
    handleAnswer
  };
};
