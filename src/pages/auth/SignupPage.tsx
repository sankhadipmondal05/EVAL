import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PixelBackground from '../../components/auth/PixelBackground';
import './Auth.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else if (data.session) {
      // Auto-login successful (Confirm Email is likely disabled in Supabase)
      navigate('/dashboard');
    } else if (data.user) {
      // Confirmation required
      setSuccess(true);
      setLoading(false);
    } else {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <PixelBackground count={60} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        {success ? (
          <div className="verify-success-container">
            <div className="verify-icon-wrapper">
              <Mail className="verify-icon" />
            </div>
            <h2 className="auth-title">Verify Email_</h2>
            <p className="verify-message">
              We've sent a verification link to <span className="highlight-text">{email}</span>. 
              Please check your inbox to activate your node.
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="auth-submit-btn"
            >
              GO TO LOGIN <ArrowRight className="submit-arrow" />
            </button>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h1 className="auth-title">CREATE ACCOUNT_</h1>
              <p className="auth-subtitle">Start your journey to a sharper mind.</p>
            </div>

            <div className="auth-tabs">
              <div className="auth-tab active">SIGN UP</div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-banner">
                  {error}
                </div>
              )}

          <div className="input-group">
            <div className="input-label-container">
              <label className="input-label">FULL NAME</label>
            </div>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name" 
                className="auth-input"
                required
              />
            </div>
          </div>

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
            </div>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password" 
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
            <input type="checkbox" id="terms" className="auth-checkbox" required />
            <label htmlFor="terms" className="auth-options-label">
              I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'PROCESSING...' : (
              <>
                CREATE ACCOUNT <ArrowRight className="submit-arrow" />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account? <Link to="/login">LOG IN <ArrowRight className="footer-arrow" /></Link>
        </p>
      </>
    )}
      </motion.div>
    </div>
  );
};

export default SignupPage;
