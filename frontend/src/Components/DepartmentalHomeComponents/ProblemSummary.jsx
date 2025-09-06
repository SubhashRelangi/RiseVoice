import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProblemSummary.module.css';

const ProblemSummary = () => {
  const [resolvedProblems, setResolvedProblems] = useState([]);
  const [inProgressProblems, setInProgressProblems] = useState([]);
  const [pendingProblems, setPendingProblems] = useState([]);

  useEffect(() => {
    const fetchAllProblems = async () => {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      try {
        const response = await axios.get(`${API_BASE_URL}/api/problems`); // Fetch all problems
        const allProblems = response.data;

        setResolvedProblems(allProblems.filter(problem => problem.status === 'Resolved'));
        setInProgressProblems(allProblems.filter(problem => problem.status === 'In Progress'));
        setPendingProblems(allProblems.filter(problem => problem.status === 'Pending'));

      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchAllProblems();
  }, []);

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.resolved}`}></span>
        Resolved ({resolvedProblems.length})
        <ul className={styles.problemList}>
          {resolvedProblems.map(problem => (
            <li key={problem._id}>{problem.title}</li>
          ))}
        </ul>
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.inProgress}`}></span>
        In Progress ({inProgressProblems.length})
        <ul className={styles.problemList}>
          {inProgressProblems.map(problem => (
            <li key={problem._id}>{problem.title}</li>
          ))}
        </ul>
      </div>
      <div className={styles.summaryItem}>
        <span className={`${styles.colorBox} ${styles.Pending}`}></span>
        Pending ({pendingProblems.length})
        <ul className={styles.problemList}>
          {pendingProblems.map(problem => (
            <li key={problem._id}>{problem.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemSummary;
