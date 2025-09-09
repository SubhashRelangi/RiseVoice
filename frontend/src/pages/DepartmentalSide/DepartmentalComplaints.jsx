import React, { useState, useEffect } from 'react';
import ComplaintsDashboard from '../../Components/DepartmentalComplaints/ComplaintsDashboard';
import ComplaintList from '../../Components/DepartmentalComplaints/ComplaintList';
import axiosInstance from '../../axiosInstance';

const mapDepartmentTypeToCategory = (departmentType) => {
  const mapping = {
    WATER: 'Water',
    ELECTRICITY: 'Electricity',
    ROADS_INFRASTRUCTURE: 'Road',
    WASTE_MANAGEMENT: 'Waste',
    HEALTHCARE: 'Health',
    EDUCATION: 'Education',
  };
  return mapping[departmentType] || 'Other';
};

const DepartmentalComplaints = () => {
  const [departmentLocation, setDepartmentLocation] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentType, setDepartmentType] = useState('');
  const [loadingDepartment, setLoadingDepartment] = useState(true);
  const [errorDepartment, setErrorDepartment] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRadius, setSelectedRadius] = useState('3');

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        // Fetch department profile
        const profileResponse = await axiosInstance.get('/api/departments/profile');
        const profileData = profileResponse.data;
        setDepartmentLocation(profileData.location);
        setDepartmentName(profileData.name);
        setDepartmentType(profileData.serviceType);

        // Fetch problems based on filters
        const problemsResponse = await axiosInstance.get('/api/problems', {
          params: {
            search: searchTerm,
            status: selectedStatus === 'All Status' ? '' : selectedStatus,
            radius: selectedRadius,
            departmentLat: profileData.location ? profileData.location.latitude : '',
            departmentLng: profileData.location ? profileData.location.longitude : '',
            category: mapDepartmentTypeToCategory(profileData.serviceType),
          },
        });
        
        let fetchedComplaints = problemsResponse.data;

        // Filter complaints by department type (redundant if backend filters, but good for safety)
        const departmentCategory = mapDepartmentTypeToCategory(profileData.serviceType);
        fetchedComplaints = fetchedComplaints.filter(
          (complaint) => complaint.category === departmentCategory
        );

        setComplaints(fetchedComplaints);

        // Calculate stats from filtered complaints
        const newStats = {
          total: fetchedComplaints.length,
          resolved: fetchedComplaints.filter(p => p.status === 'Resolved' || p.status === 'Resloved').length,
          inProgress: fetchedComplaints.filter(p => p.status === 'In Progress').length,
          pending: fetchedComplaints.filter(p => p.status === 'Pending').length,
        };
        setStats(newStats);

      } catch (error) {
        setErrorDepartment(error.message); // Fixed: Use setErrorDepartment
      } finally {
        setLoadingDepartment(false);
      }
    };

    fetchDepartmentData();
  }, [searchTerm, selectedStatus, selectedRadius]); // Re-run when filters change

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
        stats={stats} // Pass stats to dashboard
      />
      <ComplaintList 
        departmentLocation={departmentLocation}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedRadius={selectedRadius}
        departmentType={departmentType}
        complaints={complaints} // Pass complaints to list
      />
    </div>
  );
};

export default DepartmentalComplaints;
