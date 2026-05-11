import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './Contact.css';
import HeroImg from '../../assets/Hero_img_linkedin_bg.png';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        <div className="bento-grid">

          {/* ROW 1: Hero Text (1st) + Portrait Card (2nd) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bento-item hero-card"
          >
            <div className="hero-decoration">
              <div className="pixel-galaxy">
                {[...Array(85)].map((_, i) => {
                  const angle = Math.random() * Math.PI * 2;
                  const radius = Math.sqrt(Math.random()) * 50; // Random radius up to 50%
                  const top = 50 + radius * Math.sin(angle);
                  const left = 50 + radius * Math.cos(angle);
                  return (
                    <div
                      key={i}
                      className={`galaxy-node node-variant-${i % 8} flicker-hollow`}
                      style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 1 - (radius / 120) // Much slower fade, keeping edges bright
                      }}
                    />
                  );
                })}
                <svg className="galaxy-links">
                  <path d="M10,10 L40,30" className="link-path" />
                  <path d="M40,30 L70,10" className="link-path" />
                  <path d="M20,60 L50,40" className="link-path" />
                  <path d="M50,40 L80,70" className="link-path" />
                  <path d="M70,10 L90,40" className="link-path" />
                  <path d="M30,80 L10,50" className="link-path" />
                  <path d="M60,20 L80,50" className="link-path" />
                  <path d="M10,90 L40,70" className="link-path" />
                </svg>
              </div>
            </div>
            <h1 className="hero-title-pixel">
              <span className="designer-hollow">Designer</span> <span className="architect-highlight">Architecting</span> Digital Products <span className="normal-sub-title">THROUGH CODE & DESIGN_</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bento-item portrait-card"
          >
            <div className="portrait-bg">
              <div className="pixel-galaxy portrait-galaxy">
                {[...Array(85)].map((_, i) => {
                  const angle = Math.random() * Math.PI * 2;
                  const radius = Math.sqrt(Math.random()) * 50;
                  const top = 50 + radius * Math.sin(angle);
                  const left = 50 + radius * Math.cos(angle);
                  return (
                    <div
                      key={i}
                      className={`galaxy-node node-variant-${i % 8}`}
                      style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        animationDelay: `${Math.random() * -10}s`,
                        opacity: 1 - (radius / 120)
                      }}
                    />
                  );
                })}
              </div>
              <img src={HeroImg} alt="Sankhadip Mondal" className="portrait-image" />
              <div className="portrait-gradient" />
              <div className="grain-overlay" />
            </div>
            <div className="portrait-info">
              <div className="data-label">DEVELOPER_ID_</div>
              <div className="data-name">SANKHADIP_MONDAL</div>
              <div className="data-role">UI/UX & Product Designer</div>
            </div>
            <div className="scanline" />
          </motion.div>

          {/* ROW 2: About (Reduced) + Contact Me + Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bento-item bio-card"
          >
            <div className="neural-icon-block">
              <div className="grid-bits">
                <div className="bit-1" />
                <div className="bit-2" />
                <div className="bit-3" />
                <div className="bit-4" />
              </div>
            </div>
            <div className="bio-footer">
              <p className="bio-text">
                Sankhadip Mondal is a <span className="text-bold">product-focused designer</span> and developer, specializing in the intersection of aesthetics and engineering. He bridges the gap between complex logic and intuitive experiences.
              </p>
            </div>
          </motion.div>

          <motion.a
            href="mailto:sankhadip.mondal05@gmail.com"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bento-item contact-trigger"
          >
            <div className="trigger-header">
              <div className="data-label-orange">Direct_Link</div>
              <ArrowUpRight className="trigger-arrow" />
            </div>
            <div className="trigger-footer">
              <div className="trigger-subtext">Any questions?</div>
              <div className="trigger-title">Contact Me</div>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bento-item social-terminal"
          >
            <div className="social-content-wrapper">
              <div className="social-links-area">
                <div className="social-label-primary">Social_Nodes</div>
                <div className="social-links-column">
                  {[
                    { name: 'INSTAGRAM', url: 'https://www.instagram.com/sankhadip_05' },
                    { name: 'GITHUB', url: 'https://github.com/sankhadipmondal05' },
                    { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/sankhadip-mondal-506b953ba/' }
                  ].map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      style={{ animationDelay: `${i * 0.8}s` }}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="voxel-swarm-container">
                <div className="voxel-swarm">
                  {(() => {
                    const voxels = [];
                    const gridSize = 4;
                    const spacing = 18;
                    for (let x = 0; x < gridSize; x++) {
                      for (let y = 0; y < gridSize; y++) {
                        for (let z = 0; z < gridSize; z++) {
                          const isShell =
                            x === 0 || x === gridSize - 1 ||
                            y === 0 || y === gridSize - 1 ||
                            z === 0 || z === gridSize - 1;

                          if (isShell) {
                            const posX = (x - (gridSize - 1) / 2) * spacing;
                            const posY = (y - (gridSize - 1) / 2) * spacing;
                            const posZ = (z - (gridSize - 1) / 2) * spacing;
                            const size = 14;
                            const rand = Math.random();
                            // Three states: 
                            // 0-0.5: Solid Orange
                            // 0.5-0.75: Solid White
                            // 0.75-1.0: Hollow White
                            const isWhite = rand > 0.5;
                            const isHollow = isWhite && rand > 0.75;

                            voxels.push(
                              <div
                                key={`${x}-${y}-${z}`}
                                className={`voxel ${isHollow ? 'is-hollow' : ''} ${isWhite ? 'is-white' : ''}`}
                                style={{
                                  transform: `translate3d(${posX}px, ${posY}px, ${posZ}px)`,
                                  width: `${size}px`,
                                  height: `${size}px`,
                                }}
                              >
                                {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
                                  <div key={face} className={`voxel-face face-${face}`} />
                                ))}
                              </div>
                            );
                          }
                        }
                      }
                    }
                    return voxels;
                  })()}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
