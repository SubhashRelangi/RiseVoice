import React from 'react';
import styles from './ProblemList.module.css';

const ProblemList = ({ problems }) => {
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
