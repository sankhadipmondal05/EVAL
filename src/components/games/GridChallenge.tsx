import { motion, AnimatePresence } from 'framer-motion';
import { useGridRecallEngine } from '../../hooks/useGridRecallEngine';
import { TacticalHUD } from './TacticalHUD';
import './styles/GridChallenge.css';

interface GridChallengeProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  color: string;
  score: number;
}

const DOT_POSITIONS = [
  { x: 15, y: 40 }, { x: 25, y: 30 }, { x: 35, y: 55 }, { x: 50, y: 25 },
  { x: 65, y: 30 }, { x: 75, y: 40 }, { x: 85, y: 25 }, { x: 18, y: 65 },
  { x: 30, y: 42 }, { x: 35, y: 80 }, { x: 55, y: 55 }, { x: 62, y: 72 },
  { x: 70, y: 48 }, { x: 82, y: 58 }, { x: 86, y: 38 }, { x: 22, y: 82 },
  { x: 45, y: 75 }, { x: 60, y: 82 }, { x: 78, y: 78 }, { x: 88, y: 80 }
];

export const GridChallenge = ({ onScore, onComplete, color, score }: GridChallengeProps) => {
  const {
    phase,
    level,
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
  } = useGridRecallEngine({ onScore, onComplete, duration: 240, score });

  return (
    <div className="grid-recall-container" style={{ '--primary-color': color } as any}>
      <TacticalHUD 
        score={score}
        level={level}
        timer={missionTimer}
        color={color}
        phase={phase}
        phaseTimer={phaseTimer}
      />

      <div className="mission-deck">
        <AnimatePresence mode="wait">
          {phase === 'MEMORIZE' && (
            <motion.div 
              key="memorize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="phase-container"
            >
              <div className="phase-header">
                <div className="phase-indicator animate-pulse" style={{ backgroundColor: color }} />
                <span className="phase-title">Remember Highlighted Sequence</span>
              </div>
              
              {DOT_POSITIONS.map((pos, i) => (
                <div
                  key={i}
                  className={`unit-dot ${currentBlink === i ? 'active' : ''}`}
                  style={{ 
                    left: `${pos.x}%`, 
                    top: `${pos.y}%`,
                    backgroundColor: currentBlink === i ? color : 'transparent',
                    boxShadow: currentBlink === i ? `0 0 30px ${color}` : 'none'
                  }}
                />
              ))}
            </motion.div>
          )}

          {phase === 'SYMMETRY' && (
            <motion.div 
              key="symmetry"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="symmetry-deck"
            >
              <div className="symmetry-briefing">
                <span className="prompt-label">Pattern Verification</span>
                <h2 className="prompt-title">Is it Symmetric..?</h2>
              </div>

              <div className="analysis-frame">
                <div className="grid-deck">
                  {[grids?.left, grids?.right].map((grid, gIdx) => (
                    <div key={gIdx} className="unit-grid">
                      {grid?.map((row, rIdx) => 
                        row.map((cell, cIdx) => (
                          <div 
                            key={`${rIdx}-${cIdx}`}
                            className="grid-cell"
                            style={{ 
                              backgroundColor: cell ? '#fff' : 'rgba(255,255,255,0.1)',
                              opacity: cell ? 1 : 0.2,
                              transform: cell ? 'scale(1)' : 'scale(0.9)',
                              boxShadow: cell ? '0 0 15px rgba(255,255,255,0.1)' : 'none'
                            }}
                          />
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="trigger-group">
                <button 
                  onClick={() => handleSymmetryAnswer(true)}
                  className={`decision-trigger ${
                    lastSymmetryResult?.answer === true 
                      ? (lastSymmetryResult.isCorrect ? 'trigger-success' : 'trigger-error')
                      : ''
                  }`}
                  disabled={isTransitioning}
                >
                  Confirm (Yes)
                </button>
                <button 
                  onClick={() => handleSymmetryAnswer(false)}
                  className={`decision-trigger ${
                    lastSymmetryResult?.answer === false 
                      ? (lastSymmetryResult.isCorrect ? 'trigger-success' : 'trigger-error')
                      : ''
                  }`}
                  disabled={isTransitioning}
                >
                  Reject (No)
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'RECALL' && (
            <motion.div 
              key="recall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="phase-container"
            >
              <div className="phase-header">
                <div className="phase-indicator animate-pulse" style={{ backgroundColor: color }} />
                <span className="phase-title">Input Extracted Sequence</span>
              </div>

              {DOT_POSITIONS.map((pos, i) => {
                const selectedIdx = userSequence.indexOf(i);
                const isSelected = selectedIdx !== -1;
                const isCorrect = isSelected && i === blinkSequence[selectedIdx];
                
                return (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    disabled={isSelected || isTransitioning}
                    className="unit-dot extractable"
                    style={{ 
                      left: `${pos.x}%`, 
                      top: `${pos.y}%`,
                      backgroundColor: isSelected ? (isCorrect ? '#22c55e' : '#ef4444') : 'transparent',
                      boxShadow: isSelected ? `0 0 30px ${isCorrect ? '#22c55e' : '#ef4444'}` : 'none',
                      borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.1)'
                    }}
                  />
                );
              })}
            </motion.div>
          )}

          {phase === 'RESULTS' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="analysis-frame"
              style={{ maxWidth: '40rem', margin: '0 auto' }}
            >
              <div className="prompt-label" style={{ marginBottom: '1rem' }}>Mission Complete</div>
              <h3 className="prompt-title" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>RESULTS_ANALYSIS</h3>
              
              <div className="grid-deck" style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%' }}>
                <div className="unit-grid" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="status-label" style={{ marginBottom: '0.5rem' }}>Final Score</div>
                  <div className="status-value" style={{ color, fontSize: '3rem' }}>{score}</div>
                </div>
                <div className="unit-grid" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="status-label" style={{ marginBottom: '0.5rem' }}>Symmetry Rank</div>
                  <div className="status-value" style={{ fontSize: '3rem' }}>{correctSymmetryCount}/3</div>
                </div>
              </div>
              
              <button 
                onClick={() => onComplete({ score })}
                className="decision-trigger"
                style={{ width: '100%', backgroundColor: '#fff', color: '#000', fontSize: '12px' }}
              >
                Sync Data & Return
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
