import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import './styles/TacticalHUD.css';

interface TacticalHUDProps {
  score: number;
  level: number;
  timer: number;
  color: string;
  phase?: string;
  phaseTimer?: number;
}

export const TacticalHUD = ({ score, level, timer, color, phase, phaseTimer }: TacticalHUDProps) => {
  const navigate = useNavigate();

  return (
    <div className="tactical-hud">
      <div className="hud-group">
        <div className="status-node">
          <span className="status-label">Score Protocol</span>
          <span className="status-value" style={{ color }}>
            {score < 0 ? '-' : ''}{Math.abs(score).toString().padStart(3, '0')}
          </span>
        </div>
        <div className="node-divider" />
        <div className="status-node">
          <span className="status-label">Mission Level</span>
          <span className="status-value" style={{ color }}>
            {level.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      
      <div className="hud-actions">
        <div className="status-node">
          <span className="status-label">
            {phase && phaseTimer && phaseTimer > 0 ? 'Phase Chrono' : 'Mission Chrono'}
          </span>
          <span className="status-value">
            {phase && phaseTimer && phaseTimer > 0 ? `${phaseTimer}s` : `${timer}s`}
          </span>
        </div>
        <button onClick={() => navigate('/games')} className="abort-trigger">
          <X size={12} />
          <span className="abort-label">ABORT_MISSION</span>
        </button>
      </div>
    </div>
  );
};
