import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useGapAnalysisEngine, GAP_SHAPES } from '../../hooks/useGapAnalysisEngine';
import { TacticalHUD } from './TacticalHUD';
import './styles/GapChallenge.css';

interface GapChallengeProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  color: string;
  score: number;
}

export const GapChallenge = ({ onScore, onComplete, color, score: totalScore }: GapChallengeProps) => {
  const {
    level,
    gridSize,
    grid,
    options,
    feedback,
    selectedIdx,
    missionTimer,
    handleOptionClick
  } = useGapAnalysisEngine({ onScore, onComplete, duration: 180 });

  return (
    <div className="gap-recall-container" style={{ '--primary-color': color } as any}>
      <TacticalHUD
        score={totalScore}
        level={level}
        timer={missionTimer}
        color={color}
      />

      <div className="mission-deck">
        <div className="analysis-deck">
          <header className="deck-header">
            <h2 className="deck-title">GAP_ANALYSIS</h2>
            <p className="deck-subtitle">Sector {gridSize}x{gridSize} // Inductive Reasoning Protocol</p>
          </header>

          <div
            className="gap-analysis-grid"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {grid.map((row, r) => (
              row.map((cell, c) => {
                const shapeData = GAP_SHAPES[cell.symbolIdx];
                const ShapeIcon = shapeData?.icon;

                return (
                  <motion.div
                    key={`${r}-${c}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`grid-unit ${cell.isHidden ? 'hidden-node' : ''} ${cell.isEmpty ? 'empty-node' : ''}`}
                  >
                    {!cell.isEmpty && (
                      <AnimatePresence mode="wait">
                        {cell.isHidden ? (
                          feedback === 'correct' ? (
                            <motion.div
                              key="correct"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="symbol-glyph"
                              style={{ color: shapeData.color }}
                            >
                              {ShapeIcon && <ShapeIcon size="100%" strokeWidth={2.5} />}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="empty"
                              className="gap-indicator"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              <HelpCircle size="95%" style={{ color: '#d97757' }} className="opacity-60" />
                            </motion.div>
                          )
                        ) : (
                          <div className="symbol-glyph" style={{ color: shapeData.color }}>
                            {ShapeIcon && <ShapeIcon size="100%" strokeWidth={2.5} />}
                          </div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                );
              })
            ))}
          </div>

          <div className="palette-deck">
            {options.map((idx) => {
              const shapeData = GAP_SHAPES[idx];
              const OptionIcon = shapeData?.icon;

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOptionClick(idx)}
                  disabled={!!feedback}
                  className={`palette-trigger ${feedback === 'correct' && selectedIdx === idx
                      ? 'trigger-success'
                      : feedback === 'wrong' && selectedIdx === idx
                        ? 'trigger-error'
                        : ''
                    }`}
                >
                  <div className="trigger-glyph" style={{ color: shapeData.color }}>
                    {OptionIcon && <OptionIcon size="100%" strokeWidth={2.5} />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
