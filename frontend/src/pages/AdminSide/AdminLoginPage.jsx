import React, { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';
import { useAuth } from '../../Components/Auth/AuthContext'; // Import useAuth

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();
  const { setIsAdminAuthenticated } = useAuth(); // Use setIsAdminAuthenticated

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/api/admin/auth/login', { email, password });
      setMessage(res.data.message);
      if (res.data.requiresOTP) {
        setShowOtpInput(true);
      } else {
        // This case should ideally not be reached with OTP flow
        setIsAdminAuthenticated(true); // Set authenticated state
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/api/admin/auth/verify-otp', { email, otp });
      setMessage(res.data.message);
      setIsAdminAuthenticated(true); // Set authenticated state
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during OTP verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <h2 className={styles.adminTitle}>Admin Login</h2>
        {message && <p className={styles.adminMessage}>{message}</p>}
        {error && <p className={styles.adminError}>{error}</p>}

        {!showOtpInput ? (
          <form onSubmit={handleLogin} className={styles.adminForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className={styles.adminButton}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className={styles.adminForm}>
            <p>A One-Time Password has been sent to your email. Please enter it below.</p>
            <div className={styles.formGroup}>
              <label htmlFor="otp">OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
              />
            </div>
            <button type="submit" disabled={loading} className={styles.adminButton}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;