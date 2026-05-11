import { motion, AnimatePresence } from 'framer-motion';
import { useSwitchChallengeEngine } from '../../hooks/useSwitchChallengeEngine';
import { TacticalHUD } from './TacticalHUD';
import { Circle, Square, Triangle, Diamond, Star, Plus } from 'lucide-react';
import './styles/SwitchChallenge.css';

interface SwitchChallengeProps {
  onScore: (pts: number) => void;
  onComplete: (stats: any) => void;
  color: string;
  score: number;
}

const SYMBOL_MAP: Record<string, any> = {
  Circle: Circle,
  Square: Square,
  Triangle: Triangle,
  Diamond: Diamond,
  Star: Star,
  Cross: Plus
};

const COLOR_MAP: Record<string, string> = {
  Circle: '#3b82f6',    // Blue
  Square: '#ef4444',    // Red
  Triangle: '#f59e0b',  // Yellow/Amber
  Diamond: '#10b981',   // Green
  Star: '#f97316',      // Orange
  Cross: '#06b6d4'      // Cyan
};

export const SwitchChallenge = ({ onScore, onComplete, color: themeColor, score: totalScore }: SwitchChallengeProps) => {
  const {
    level,
    inputRow,
    outputRow,
    options,
    missionTimer,
    lastResult,
    isTransitioning,
    handleAnswer
  } = useSwitchChallengeEngine({ onScore, onComplete, duration: 180 });

  const renderSymbol = (type: string, size = 32) => {
    const Icon = SYMBOL_MAP[type] || Circle;
    const color = COLOR_MAP[type] || '#fff';
    
    return (
      <div 
        className="symbol-glyph-container" 
        style={{ 
          color,
          filter: `
            drop-shadow(0 0 8px ${color}ee) 
            drop-shadow(0 0 24px ${color}66)
          ` // Authoritative high-intensity neon glow
        }}
      >
        <Icon size={size} strokeWidth={1.5} fill="none" />
      </div>
    );
  };

  return (
    <div className="switch-challenge-container" style={{ '--primary-color': themeColor } as any}>
      <TacticalHUD 
        score={totalScore}
        level={level}
        timer={missionTimer}
        color={themeColor}
      />

      <div className="mission-deck">
        {/* INPUT: Top Row (Reference) */}
        <div className="simulation-sector input-sector transparent">
          <div className="sector-briefing">
            <span className="prompt-label">Input Registry</span>
            <h2 className="prompt-title">REFERENCE_STREAM</h2>
          </div>

          <div className="symbol-matrix">
            {inputRow.map((node) => (
              <div key={node.id} className="symbol-node ghost">
                {renderSymbol(node.type, 40)}
              </div>
            ))}
          </div>
        </div>

        {/* PROCESSING: Center Interaction (Code Panel) */}
        <div className="processing-sector">
          <div className="pipeline-funnel top" />
          <div className="code-entry-sector">
            <div className="code-options">
              {options.map((code) => {
                const isSelected = lastResult?.code === code;
                const isCorrect = isSelected && lastResult?.isCorrect;
                const isWrong = isSelected && !lastResult?.isCorrect;
                const wasActuallyCorrect = lastResult && !lastResult.isCorrect && lastResult.correctCode === code;

                return (
                  <button 
                    key={code} 
                    className={`code-trigger ${isCorrect ? 'result-success' : ''} ${isWrong ? 'result-error' : ''} ${wasActuallyCorrect ? 'result-hint' : ''}`}
                    onClick={() => handleAnswer(code)}
                    disabled={isTransitioning}
                  >
                    {code.split('').map((digit, i) => (
                      <span key={i} className="digit">{digit}</span>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pipeline-funnel bottom" />
        </div>

        {/* OUTPUT: Bottom Row (Target) */}
        <div className="simulation-sector output-sector transparent">
          <div className="symbol-matrix">
            <AnimatePresence mode="popLayout">
              {outputRow.map((node, i) => (
                <motion.div 
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="symbol-node ghost"
                >
                  {renderSymbol(node.type, 40)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="sector-briefing">
            <h2 className="prompt-title">OUTPUT_SEQUENCE</h2>
            <span className="prompt-label">Verify Arrangement Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
