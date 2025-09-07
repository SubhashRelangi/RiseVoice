import React, { useState, useEffect } from 'react';
import styles from './ProblemList.module.css';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${API_BASE_URL}/api/problems`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Could not fetch problems:", error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className={styles.problemListContainer}>
      <div className={styles.header}>
        <h2>Problem List</h2>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.problemTable}>
          <thead>
            <tr>
              <th>Problem ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id}>
                <td>{problem.problemId}</td>
                <td>{problem.title}</td>
                <td>{problem.location.address}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[problem.status.replace(/\s/g, '').toLowerCase()]}`}>
                    {problem.status}
                  </span>
                </td>
                <td>{new Date(problem.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;