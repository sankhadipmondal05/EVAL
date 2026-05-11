import { useState, useEffect, useCallback, useRef } from 'react';

export interface SymbolNode {
  id: string;
  type: string;
  originalPos: number; // 1-indexed
}

interface SwitchChallengeEngineProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  duration: number;
}

const SYMBOL_TYPES = [
  'Circle', 'Square', 'Triangle', 'Diamond', 'Star', 'Cross'
];

export const useSwitchChallengeEngine = ({ onScore, onComplete, duration }: SwitchChallengeEngineProps) => {
  const [level, setLevel] = useState(1);
  const [inputRow, setInputRow] = useState<SymbolNode[]>([]);
  const [outputRow, setOutputRow] = useState<SymbolNode[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [missionTimer, setMissionTimer] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const [lastResult, setLastResult] = useState<{ code: string, isCorrect: boolean, correctCode: string } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const levelRef = useRef(level);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Mission Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          if (!isComplete) {
            setIsComplete(true);
            onCompleteRef.current({ level: levelRef.current });
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const generateLevel = useCallback(() => {
    // 1. SCALING SYMBOL COMPLEXITY (Every 5 levels, Cap at 6)
    const tier = Math.floor((level - 1) / 5);
    const symbolCount = Math.min(3 + tier, 6); 
    
    // 2. SCALING OPTION COUNT (Confusing decoys, Cap at 6)
    const optionCount = Math.min(4 + tier, 6);

    const shuffledTypes = [...SYMBOL_TYPES].sort(() => Math.random() - 0.5);
    const selectedTypes = shuffledTypes.slice(0, symbolCount);

    const input: SymbolNode[] = selectedTypes.map((type, i) => ({
      id: `in-${i}-${level}`,
      type,
      originalPos: i + 1
    }));

    const output = [...input].sort(() => Math.random() - 0.5);
    const correctCodeArray = output.map(n => n.originalPos);
    const correctCode = correctCodeArray.join('');

    // 3. HEURISTIC DISTRACTOR GENERATION (Highly confusing near-matches)
    const distractors = new Set<string>();
    let attempts = 0;
    
    while (distractors.size < optionCount - 1 && attempts < 50) {
      attempts++;
      const dArray = [...correctCodeArray];
      
      // Heuristic: Swap only 2 positions to create a confusing distractor
      const idx1 = Math.floor(Math.random() * symbolCount);
      let idx2 = Math.floor(Math.random() * symbolCount);
      while (idx1 === idx2) idx2 = Math.floor(Math.random() * symbolCount);
      
      [dArray[idx1], dArray[idx2]] = [dArray[idx2], dArray[idx1]];
      const dCode = dArray.join('');
      
      if (dCode !== correctCode) distractors.add(dCode);
    }

    // Fallback if heuristics fail to generate enough unique codes
    while (distractors.size < optionCount - 1) {
      const d = [...correctCodeArray].sort(() => Math.random() - 0.5).join('');
      if (d !== correctCode) distractors.add(d);
    }

    setInputRow(input);
    setOutputRow(output);
    setOptions([correctCode, ...Array.from(distractors)].sort(() => Math.random() - 0.5));
    setLastResult(null);
  }, [level]);

  useEffect(() => {
    if (!isComplete && !isTransitioning) generateLevel();
  }, [generateLevel, isComplete, isTransitioning]);

  const handleAnswer = (code: string) => {
    if (isTransitioning || isComplete) return;

    const correctCode = outputRow.map(n => n.originalPos).join('');
    const isCorrect = code === correctCode;

    if (isCorrect) {
      onScore(3);
    } else {
      onScore(-2);
    }

    setLastResult({ code, isCorrect, correctCode });
    setIsTransitioning(true);

    setTimeout(() => {
      setIsTransitioning(false);
      setLevel(prev => prev + 1);
    }, 600);
  };

  return {
    level,
    inputRow,
    outputRow,
    options,
    missionTimer,
    lastResult,
    isTransitioning,
    handleAnswer
  };
};
