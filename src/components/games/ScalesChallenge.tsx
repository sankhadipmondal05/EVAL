import { motion, AnimatePresence } from 'framer-motion';
import { useLogicalGroupingEngine } from '../../hooks/useLogicalGroupingEngine';
import { TacticalHUD } from './TacticalHUD';
import './styles/ScalesChallenge.css';

interface ScalesChallengeProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  color: string;
  score: number;
}

export const ScalesChallenge = ({ onScore, onComplete, color, score: totalScore }: ScalesChallengeProps) => {
  const {
    level,
    examples,
    targets,
    missionTimer,
    handleAnswer
  } = useLogicalGroupingEngine({ onScore, onComplete, duration: 240 });

  return (
    <div className="logical-grouping-container" style={{ '--primary-color': color } as any}>
      <TacticalHUD 
        score={totalScore}
        level={level}
        timer={missionTimer}
        color={color}
      />

      <div className="mission-deck">
        <div className="analysis-sector">
          <h3 className="deck-label">ANALYSIS_SECTOR // EXAMPLE_GRIDS</h3>
          <div className="example-deck">
            {examples.map((ex) => (
              <div key={ex.id} className="diamond-matrix-unit">
                <div className="diamond-grid">
                  {ex.data.map((val, i) => (
                    <div key={i} className="diamond-cell">
                      <span className="cell-content">{val}</span>
                    </div>
                  ))}
                </div>
                <div className={`group-tag ${ex.group === 'RED' ? 'tag-red' : 'tag-green'}`}>
                  {ex.group}_GROUP
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stabilization-sector">
          <h3 className="deck-label">STABILIZATION_SECTOR // CLASSIFY_TARGETS</h3>
          <div className="target-deck">
            {targets.map((target, idx) => (
              <div key={target.id} className="target-unit">
                <div className="diamond-matrix-unit">
                  <div className="diamond-grid">
                    {target.data.map((val, i) => (
                      <div key={i} className="diamond-cell">
                        <span className="cell-content">{val}</span>
                      </div>
                    ))}
                  </div>
                  <AnimatePresence>
                    {target.userAnswer && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`result-overlay ${target.userAnswer === target.group ? 'res-correct' : 'res-wrong'}`}
                      >
                        {target.userAnswer === target.group ? 'STABLE' : 'VOID'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="classification-triggers">
                  <button 
                    onClick={() => handleAnswer(idx, 'RED')}
                    disabled={!!target.userAnswer}
                    className={`class-btn ${target.userAnswer === 'RED' ? 'active-red' : ''}`}
                  >
                    RED
                  </button>
                  <button 
                    onClick={() => handleAnswer(idx, 'GREEN')}
                    disabled={!!target.userAnswer}
                    className={`class-btn ${target.userAnswer === 'GREEN' ? 'active-green' : ''}`}
                  >
                    GREEN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
