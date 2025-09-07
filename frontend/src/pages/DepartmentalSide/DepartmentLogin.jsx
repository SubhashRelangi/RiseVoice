import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './DepartmentLogin.module.css';

const DepartmentLogin = ({ setIsLoggedIn }) => {
  const [departmentId, setDepartmentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
      const response = await axios.post(`${API_BASE_URL}/api/departments/login`, {
        departmentId,
        password,
      });

      setIsLoggedIn(true);
      navigate('/department');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred during login.');
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
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Department Login</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
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
    </div>
  );
};

export default DepartmentLogin;
