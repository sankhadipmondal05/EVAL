import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { 
  ArrowRight, Target, Zap, Users, 
  Search, Shield, Layout, Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Background Noise & Grid */}
      <div className="bg-overlay-grid" />
      <div className="bg-overlay-noise" />
      
      {/* Floating Pixel Text */}
      <div className="floating-label-top">
        <span className="pixel-border-text">EVAL</span>
      </div>
      <div className="floating-label-bottom">
        <span className="pixel-border-text">SYSTEM</span>
      </div>

      <main className="landing-main">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="hero-title">
                TRAIN YOUR MIND <br />
                LIKE AN <span className="highlight-primary">ENGINEER.</span>
              </h1>
              <p className="hero-subtitle">
                Advanced cognitive assessments and brain training games designed for B.Tech students to test, improve and outperform.
              </p>
              <div className="hero-actions">
                <Link to="/signup">
                  <Button className="hero-btn">
                    START ASSESSMENT <ArrowRight className="btn-icon-right" />
                  </Button>
                </Link>
                <a href="#features" className="hero-explore-link">
                  EXPLORE PLATFORM <ArrowRight className="icon-down" />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="leaderboard-preview-column">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="preview-card"
            >
              <div className="preview-header">
                <span className="status-indicator">
                  <span className="status-dot" />
                  Live Leaderboard
                </span>
              </div>
              <div className="preview-body">
                {[
                  { rank: '01', user: 'RISHABH+', score: '9850' },
                  { rank: '02', user: 'ARJUN', score: '9520' },
                  { rank: '03', user: 'ISHAAN', score: '9150' },
                  { rank: '04', user: 'ANANYA', score: '8720' },
                  { rank: '05', user: 'DEVANSH', score: '8450' },
                ].map((item, i) => (
                  <div key={i} className="preview-row">
                    <div className="row-user-info">
                      <span className="row-rank">{item.rank}</span>
                      <span className="row-username">{item.user}</span>
                    </div>
                    <span className="row-score">{item.score}</span>
                  </div>
                ))}
                <Link to="/leaderboard" className="preview-footer-link">
                  View Full Leaderboard →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* METRICS SECTION */}
        <section className="metrics-section">
          <div className="metrics-grid">
            {[
              { icon: Users, value: '12.4K+', label: 'Engineers Training' },
              { icon: Layout, value: '5', label: 'Cognitive Games' },
              { icon: Target, value: '2.8M+', label: 'Assessments Taken' },
              { icon: Award, value: '98.6%', label: 'Improvement Rate' },
            ].map((stat, i) => (
              <div key={i} className="metric-card">
                <stat.icon className="metric-icon" />
                <div className="metric-value">{stat.value}</div>
                <div className="metric-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CORE SKILLS SECTION */}
        <section id="features" className="skills-section">
          <div className="section-header">
            <h2 className="section-title">Core Cognitive Skills</h2>
            <span className="section-tag">// What you train</span>
          </div>
          <div className="skills-grid">
            {[
              { icon: Search, title: 'Executive Attention' },
              { icon: Layout, title: 'Working Memory' },
              { icon: Users, title: 'Inductive Reasoning' },
              { icon: Target, title: 'Deductive Reasoning' },
              { icon: Shield, title: 'Planning & Problem Solving' },
              { icon: Zap, title: 'Cognitive Switching' },
            ].map((skill, i) => (
              <div key={i} className="skill-node">
                <skill.icon className="skill-icon" />
                <h3 className="skill-title">{skill.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED GAMES SECTION */}
        <section className="games-section">
          <div className="section-header">
            <h2 className="section-title">Featured Games</h2>
            <Link to="/games" className="preview-footer-link">View All Games →</Link>
          </div>
          <div className="games-grid">
            {[
              { title: 'Grid Challenge', desc: 'Test your memory and attention to detail.', difficulty: 3 },
              { title: 'Scales CLX', desc: 'Find patterns. Solve the logic.', difficulty: 4 },
              { title: 'Motion Challenge', desc: 'Plan your moves. Outthink the motion.', difficulty: 4 },
              { title: 'Switch Challenge', desc: 'Adapt fast. Switch logic. Stay sharp.', difficulty: 3 },
              { title: 'Gap Challenge', desc: 'Identify the missing piece. Deduce.', difficulty: 5 },
            ].map((game, i) => (
              <div key={i} className="game-card">
                <div className="game-visual">
                  <div className="game-icon-mock">
                    <div className="icon-corner-tl" />
                    <div className="icon-corner-br" />
                    <Zap className="metric-icon-small" />
                  </div>
                </div>
                <h4 className="game-title">{game.title}</h4>
                <p className="game-description">{game.desc}</p>
                <div className="game-meta">
                  <div className="difficulty-meter">
                    {[1, 2, 3, 4, 5].map(v => (
                      <div key={v} className={`meter-bar ${v <= game.difficulty ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                  </div>
                  <span className="difficulty-label">{game.difficulty === 5 ? 'Hard' : 'Medium'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="process-section">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <span className="section-tag">// Simple. Effective. Impactful.</span>
          </div>
          <div className="process-grid">
            <div className="process-connector" />
            {[
              { step: '1', title: 'Assess', desc: 'Play cognitive games designed by experts.' },
              { step: '2', title: 'Analyze', desc: 'Get in-depth insights on your performance.' },
              { step: '3', title: 'Improve', desc: 'Train your weak areas with smart challenges.' },
              { step: '4', title: 'Outperform', desc: 'Climb the leaderboard and outperform peers.' },
            ].map((step, i) => (
              <div key={i} className="process-step">
                <div className="step-number">
                  {step.step}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="cta-section">
          <div className="cta-banner">
            <div className="cta-quote-area">
              <Quote className="quote-icon" />
              <p className="quote-text">
                "The best engineers aren't just good at what they know. They're good at thinking. This is where that begins."
              </p>
            </div>
            <div className="cta-action-area">
              <div className="cta-tagline">JOIN 12.4K+ ENGINEERS</div>
              <Link to="/signup" className="w-full">
                <Button className="cta-btn">
                  START YOUR JOURNEY <ArrowRight className="btn-icon-right" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="landing-footer">
          <div className="footer-container">
            <div className="footer-system-info">
              <span className="footer-copyright">© 2026 EVAL_</span>
              <span className="status-dot-accent" />
              <span className="status-text">System Status: Optimal</span>
            </div>
            <div className="footer-socials">
              {['Twitter', 'GitHub', 'Discord'].map(s => (
                <a key={s} href="#" className="social-link">{s}</a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const Award = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

export default LandingPage;
