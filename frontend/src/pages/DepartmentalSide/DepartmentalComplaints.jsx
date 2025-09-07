import React, { useState, useEffect } from 'react';
import ComplaintsDashboard from '../../Components/DepartmentalComplaints/ComplaintsDashboard';
import ComplaintList from '../../Components/DepartmentalComplaints/ComplaintList';
import axiosInstance from '../../axiosInstance';

const DepartmentalComplaints = () => {
  const [departmentLocation, setDepartmentLocation] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentType, setDepartmentType] = useState('');
  const [loadingDepartment, setLoadingDepartment] = useState(true);
  const [errorDepartment, setErrorDepartment] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRadius, setSelectedRadius] = useState('3');

  useEffect(() => {
    const fetchDepartmentProfile = async () => {
      try {
        const profileResponse = await axiosInstance.get('/api/departments/profile');
        const profileData = profileResponse.data;
        setDepartmentLocation(profileData.location);
        setDepartmentName(profileData.name);
        setDepartmentType(profileData.serviceType);
      } catch (error) {
        setErrorDepartment(error.message);
      } finally {
        setLoadingDepartment(false);
      }
    };

    fetchDepartmentProfile();
  }, []);

  if (loadingDepartment) {
    return <div>Loading department data...</div>;
  }

  if (errorDepartment) {
    return <div>Error loading department data: {errorDepartment}</div>;
  }

  return (
    <div>
      <ComplaintsDashboard 
        departmentLocation={departmentLocation}
        departmentName={departmentName}
        departmentType={departmentType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedRadius={selectedRadius}
        setSelectedRadius={setSelectedRadius}
      />
      <ComplaintList 
        departmentLocation={departmentLocation}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedRadius={selectedRadius}
      />
    </div>
  );
};

export default DepartmentalComplaints;
