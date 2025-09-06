import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentProfileCard from '../../Components/DepartmentProfile/DepartmentProfileCard';

const DepartmentProfile = () => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentProfile = async () => {
      try {
        const response = await axios.get('/api/departments/profile'); // Corrected endpoint
        setDepartment(response.data);
      } catch (err) {
        setError('Failed to fetch department profile.');
        console.error('Error fetching department profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentProfile();
  }, []);

  if (loading) {
    return <div>Loading department profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!department) {
    return <div>No department data found.</div>;
  }

  return (
    <div>
      <DepartmentProfileCard
        departmentName={department.name}
        serviceType={department.serviceType} // Assuming a serviceType field
        isActive={department.isActive} // Assuming an isActive field
        isVerified={department.isVerified} // Assuming an isVerified field
      />
    </div>
  );
};

export default DepartmentProfile;
