import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PixelBackground from '../../components/auth/PixelBackground';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate('/dashboard');
    } else {
      setError("Session could not be established. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <PixelBackground count={60} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div className="auth-header">
          <h1 className="auth-title">WELCOME BACK_</h1>
          <p className="auth-subtitle">Log in to continue your journey.</p>
        </div>

        <div className="auth-tabs">
          <div className="auth-tab active">LOGIN</div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div className="input-group">
            <div className="input-label-container">
              <label className="input-label">EMAIL</label>
            </div>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-label-container">
              <label className="input-label">PASSWORD</label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="auth-input"
                required
              />
              {showPassword ? (
                <EyeOff className="eye-icon" onClick={() => setShowPassword(false)} />
              ) : (
                <Eye className="eye-icon" onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>

          <div className="auth-options">
            <input type="checkbox" id="remember" className="auth-checkbox" />
            <label htmlFor="remember" className="auth-options-label">Remember me</label>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'PROCESSING...' : (
              <>
                LOG IN <ArrowRight className="submit-arrow" />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-link">
          Don't have an account? <Link to="/signup">SIGN UP <ArrowRight className="footer-arrow" /></Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
