import React, { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './DepartmentLogin.module.css';

const DepartmentLogin = ({ setIsLoggedIn }) => {
  const [departmentId, setDepartmentId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      await axiosInstance.post('/api/departments/login', {
        departmentId,
        password,
      });

      setIsLoggedIn(true);
      navigate('/department');
    } catch (err) {
      if (err.response) {
        const message = err.response.data.message;
        if (err.response.status === 401 && err.response.data.requiresOTP) {
          setShowOtpInput(true);
          setError(message);
        } else if (message === 'Your account is pending admin approval.' || message === 'Your account has been rejected. Please contact support for more information.') {
          setInfo(message);
        } else {
          setError(message || 'An error occurred during login.');
        }
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axiosInstance.post('/api/departments/verify-login-otp', {
        departmentId,
        otp,
      });

      setIsLoggedIn(true);
      navigate('/department');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred during OTP verification.');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {!showOtpInput ? (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2>Department Login</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {info && <p className={styles.infoMessage}>{info}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="departmentId">Department ID:</label>
            <input
              type="text"
              id="departmentId"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
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
          <button type="submit" disabled={loading} className={styles.loginButton}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className={styles.loginForm}>
          <h2>Verify Device</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <p>A verification code has been sent to your email. Please enter it below.</p>
          <div className={styles.formGroup}>
            <label htmlFor="otp">Verification Code:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
            />
          </div>
          <button type="submit" disabled={loading} className={styles.loginButton}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}
    </div>
  );
};

export default DepartmentLogin;
