import React from 'react';
import styles from './DepartmentList.module.css';

const DepartmentList = ({ departments }) => {
  return (
    <div className={styles.listContainer}>
      <table>
        <thead>
          <tr>
            <th>Department Name</th>
            <th>State</th>
            <th>District</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dept => (
            <tr key={dept._id}>
              <td>{dept.name}</td>
              <td>{dept.state}</td>
              <td>{dept.district}</td>
              <td>
                <span className={`${styles.status} ${styles[dept.status]}`}>
                  {dept.status}
                </span>
              </td>
              <td>
                <button>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentList;
