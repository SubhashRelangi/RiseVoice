import React from 'react';
import styles from './DepartmentList.module.css';
import { FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DepartmentList = ({ departments, totalDepartments }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length > 1) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>
        Departments ({departments.length} of {totalDepartments})
      </h2>
      <div className={styles.tableResponsiveWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Department</th>
              <th>Location</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept._id}>
                <td>
                  <div className={styles.departmentCell}>
                    <div className={styles.avatar}>
                      {getInitials(dept.departmentName)}
                    </div>
                    <div>
                      <div className={styles.departmentName}>{dept.departmentName}</div>
                      <div className={styles.departmentEmail}>{dept.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.locationCell}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    <div>
                      <div>{dept.state}</div>
                      <div className={styles.subtext}>{dept.city}, {dept.district}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.status} ${styles[dept.status]}`}>
                    {dept.status === 'approved' ? 'Active' : dept.status}
                  </span>
                </td>
                <td>{formatDate(dept.createdAt)}</td>
                <td>
                  <Link to={`/admin/department/${dept._id}`} className={styles.viewDetailsLink}>
                    <button className={styles.viewButton}>
                      <FaEye />
                      <span>View Details</span>
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentList;
