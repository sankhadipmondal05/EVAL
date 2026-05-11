import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { GameWrapper } from '../../components/games/GameWrapper';
import { GridChallenge } from '../../components/games/GridChallenge';
import { SwitchChallenge } from '../../components/games/SwitchChallenge';
import { ScalesChallenge } from '../../components/games/ScalesChallenge';
import { GapChallenge } from '../../components/games/GapChallenge';
import { MotionChallenge } from '../../components/games/MotionChallenge';

import { Target, Zap, LayoutGrid, Puzzle, Move } from 'lucide-react';

interface GameProtocol {
  title: string;
  briefing: string;
  icon: any;
  color: string;
  rules: {
    procedure: string[];
    scoring: string[];
    constraints: string[];
    goals: string[];
  };
  component: React.ComponentType<any>;
}

const GAME_CONFIGS: Record<string, GameProtocol> = {
  'grid-challenge': {
    title: 'GRID_RECALL',
    briefing: 'Execute a sequential memory task requiring rapid positional recall and pattern-symmetry verification under high-pressure timing constraints.',
    icon: Target,
    color: '#d97757',
    rules: {
      procedure: [
        "A group of circles will appear on the screen.",
        "One circle will blink briefly — remember its position.",
        "Next, you will see two grid patterns.",
        "Decide whether the patterns are symmetrical or not.",
        "This process repeats 3 times.",
        "Remember the blinking circle each round.",
        "After all 3 rounds, select the circles in the same order."
      ],
      scoring: [
        "Correct answer: +3 points",
        "Wrong answer: –1 point"
      ],
      constraints: [
        "Total Mission Duration: 4 Minutes",
        "The blinking circle is visible for only 2 seconds.",
        "The grid patterns stay on screen for 4 seconds.",
        "You must remember the circle positions in order."
      ],
      goals: [
        "Executive Attention",
        "Short-term Memory",
        "Pattern Recognition",
        "Stress Resistance"
      ]
    },
    component: GridChallenge
  },
  'switch-challenge': {
    title: 'SWITCH_PROTOCOL',
    briefing: 'Track the rearrangement of symbols between the Input and Output rows. Select the digit code that correctly represents the new sequence to verify logical processing.',
    icon: Zap,
    color: '#10b981',
    rules: {
      procedure: [
        "Identify symbols in the Input row and their original positions.",
        "Compare with the rearranged symbols in the Output row.",
        "Select the digit code corresponding to the new order."
      ],
      scoring: [
        "Correct answer: +3 points",
        "Wrong answer: –2 points"
      ],
      constraints: [
        "Total test time: 3 minutes.",
        "Number of symbols increases with difficulty.",
        "Numbering patterns may change between questions."
      ],
      goals: ["Logical Reasoning", "Pattern Tracking", "Processing Speed", "Accuracy Under Pressure"]
    },
    component: SwitchChallenge
  },
  'scales-clx': {
    title: 'SCALES_CLX',
    briefing: 'Study the patterns within the example grids to identify the hidden logic separating the groups. Classify the target matrices to stabilize the inductive reasoning protocol.',
    icon: LayoutGrid,
    color: '#8b5cf6',
    rules: {
      procedure: [
        "Study the 6 example grids at the top (Red vs Green Group).",
        "Determine the hidden rule (Numbers, Letters, Positions, or Patterns).",
        "Classify the 4 unknown grids at the bottom into the correct groups."
      ],
      scoring: [
        "Correct answer: +1 mark",
        "Wrong answer: –2 marks"
      ],
      constraints: [
        "Fixed duration of 4 minutes.",
        "Precision is critical; wrong answers carry high penalties."
      ],
      goals: ["Inductive Reasoning", "Pattern Recognition", "Analytical Thinking"]
    },
    component: ScalesChallenge
  },
  'gap-challenge': {
    title: 'GAP_ANALYSIS',
    briefing: 'Analyze the grid and identify the missing symbols required to complete the logical pattern. Adhere to strict row and column constraints to stabilize the sequence.',
    icon: Puzzle,
    color: '#3b82f6',
    rules: {
      procedure: [
        "A grid (3x3, 4x4, or 5x5) will appear with pre-placed symbols.",
        "Your task is to complete the grid by choosing the correct symbols from the options.",
        "Arrange the symbols so the grid forms a proper pattern."
      ],
      scoring: [
        "Correct answer: +1 mark",
        "Wrong answer: –1 mark"
      ],
      constraints: [
        "A row cannot contain repeated symbols.",
        "A column cannot contain repeated symbols.",
        "You have 3 minutes to complete the challenge."
      ],
      goals: [
        "Processing speed",
        "Focus",
        "Logical thinking",
        "Pattern recognition"
      ]
    },
    component: GapChallenge
  },
  'motion-challenge': {
    title: 'MOTION_TRACE',
    briefing: 'Navigate your node to the target using arrow keys or on-screen controls. Avoid moving obstacles. Planning your path ahead is key to success.',
    icon: Move,
    color: '#ef4444',
    rules: {
      procedure: ["Activate movement protocol.", "Dodge incoming data obstacles.", "Reach the synchronization target."],
      scoring: ["+20 points per level cleared.", "-5 points per obstacle impact."],
      constraints: ["Collision triggers instant round restart.", "Obstacle speed scales per level."],
      goals: ["Spatial Planning", "Dynamic Response"]
    },
    component: MotionChallenge
  },
};

const GamePlay = () => {
  const { id } = useParams<{ id: string }>();
  const config = id ? GAME_CONFIGS[id] : null;

  if (!config) {
    return <Navigate to="/games" replace />;
  }

  const GameComponent = config.component;

  return (
    <GameWrapper
      title={config.title}
      briefing={config.briefing}
      rules={config.rules}
      icon={config.icon}
      color={config.color}
      duration={
        id === 'grid-challenge' ? 240 :
          id === 'gap-challenge' ? 180 :
            id === 'scales-clx' ? 240 :
              180
      }
    >
      {({ onScore, onComplete, color, score }) => (
        <GameComponent onScore={onScore} onComplete={onComplete} color={color} score={score} />
      )}
    </GameWrapper>
  );
};

export default GamePlay;
