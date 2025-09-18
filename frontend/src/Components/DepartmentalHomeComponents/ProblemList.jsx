import React, { useState, useEffect } from 'react';
import styles from './ProblemList.module.css';
import { FaFire } from 'react-icons/fa';
import axios from 'axios';

const getStatusClass = (status) => {
  if (status === 'Resolved' || status === 'Resloved') {
    return styles.resolved;
  }
  if (status === 'In Progress') {
    return styles.inprogress;
  }
  if (status === 'Pending') {
    return styles.pending;
  }
  return ''; // Default class if no match
};

const ProblemList = ({ problems }) => {
  const [localProblems, setLocalProblems] = useState(problems);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setLocalProblems(problems);
  }, [problems]);

  const [likedProblems, setLikedProblems] = useState(() => {
    try {
      const storedLikes = localStorage.getItem('departmentLikedProblems');
      return storedLikes ? new Set(JSON.parse(storedLikes)) : new Set();
    } catch (error) {
      console.error("Failed to parse liked problems from localStorage", error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('departmentLikedProblems', JSON.stringify(Array.from(likedProblems)));
    } catch (error) {
      console.error("Failed to save liked problems to localStorage", error);
    }
  }, [likedProblems]);

  const handleLike = async (problemId) => {
    if (likedProblems.has(problemId)) return;

    try {
      await axios.post(`${API_BASE_URL}/api/problems/${problemId}/like`);
      
      setLocalProblems(prevProblems => 
        prevProblems.map(p => 
          p._id === problemId 
            ? { ...p, likes: (p.likes || 0) + 1 } 
            : p
        )
      );
      
      setLikedProblems(prevLiked => new Set(prevLiked).add(problemId));
    } catch (error) {
      console.error("Error liking problem:", error);
    }
  };

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
              <th>Fires</th>
            </tr>
          </thead>
          <tbody>
            {localProblems.map((problem) => (
              <tr key={problem._id}>
                <td>{problem.problemId}</td>
                <td>{problem.title}</td>
                <td>{problem.location.address}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(problem.status)}`}>
                    {problem.status}
                  </span>
                </td>
                <td>{new Date(problem.updatedAt).toLocaleString()}</td>
                <td>
                  <span
                    onClick={() => handleLike(problem._id)}
                    style={{
                      cursor: likedProblems.has(problem._id) ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <FaFire style={{ color: likedProblems.has(problem._id) ? 'red' : 'orange' }} />
                    {problem.likes || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
