import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentProfileCard from '../../Components/DepartmentProfile/DepartmentProfileCard';
import DepartmentDetailsCard from '../../Components/DepartmentProfile/DepartmentDetailsCard';

const DepartmentProfile = () => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentProfile = async () => {
      try {
        const response = await axios.get('/api/departments/profile'); // Corrected endpoint
        setDepartment(response.data);
        console.log('Fetched department profile:', response.data);
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
        location={department.location} // Assuming a location field with { latitude, longitude }
        isActive={department.isActive} // Assuming an isActive field
        isVerified={department.isVerified} // Assuming an isVerified field
      />
      <DepartmentDetailsCard
        departmentId={department.id || 'N/A'}
        email={department.email || 'N/A'}
        locationCoords={department.location ? `${department.location.latitude}, ${department.location.longitude}` : 'N/A'}
        lastLogin={'January 15, 2024 at 02:30 PM'} // Placeholder, replace with actual data if available
        departmentStatus={department.isActive ? 'Active' : 'Inactive'}
        verificationStatus={department.isVerified ? 'Verified' : 'Unverified'}
      />
    </div>
  );
};

export default DepartmentProfile;
