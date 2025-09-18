import React, { useState, useEffect } from 'react';
import ComplaintsDashboard from '../../Components/DepartmentalComplaints/ComplaintsDashboard';
import ComplaintList from '../../Components/DepartmentalComplaints/ComplaintList';
import axiosInstance from '../../axiosInstance';
import GenericSkeletonLoader from '../../Components/GenericSkeletonLoader';
import styles from './DepartmentalComplaints.module.css';

const DepartmentalComplaints = () => {
  const [departmentLocation, setDepartmentLocation] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentType, setDepartmentType] = useState('');
  const [loading, setLoading] = useState(true); // For initial skeleton loader
  const [error, setError] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

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
      } catch (err) {
        setError('Failed to load department data.');
        console.error(err);
        setLoading(false); // Stop loading if profile fails
      }
    };

    fetchDepartmentProfile();
  }, []); // Fetch profile only once

  useEffect(() => {
    // Don't fetch problems until the department profile (and type) is loaded
    if (!departmentType) {
      return;
    }

    const fetchProblems = async () => {
      // No skeleton for updates, but we could set an `isUpdating` state here if needed
      try {
        const problemsResponse = await axiosInstance.get('/api/problems', {
          params: {
            search: searchTerm,
            status: selectedStatus === 'All Status' ? '' : selectedStatus,
            radius: selectedRadius,
            departmentLat: departmentLocation ? departmentLocation.latitude : '',
            departmentLng: departmentLocation ? departmentLocation.longitude : '',
            category: departmentType,
          },
        });
        
        const fetchedComplaints = problemsResponse.data;
        setComplaints(fetchedComplaints);

        const newStats = {
          total: fetchedComplaints.length,
          resolved: fetchedComplaints.filter(p => p.status === 'Resolved' || p.status === 'Resloved').length,
          inProgress: fetchedComplaints.filter(p => p.status === 'In Progress').length,
          pending: fetchedComplaints.filter(p => p.status === 'Pending').length,
        };
        setStats(newStats);

      } catch (err) {
        setError('Failed to load complaint data.');
        console.error(err);
      } finally {
        // This will be false after the first time problems are fetched
        if (loading) {
          setLoading(false);
        }
      }
    };

    fetchProblems();
  }, [searchTerm, selectedStatus, selectedRadius, departmentType, departmentLocation]); // Rerun on filter changes or when department data is loaded

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <GenericSkeletonLoader type="dashboard-stats" count={1} height="150px" />
        <GenericSkeletonLoader type="list-item" count={5} height="100px" />
      </div>
    );
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><p>{error}</p></div>;
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
        stats={stats}
      />
      <ComplaintList 
        departmentLocation={departmentLocation}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedRadius={selectedRadius}
        departmentType={departmentType}
        complaints={complaints}
      />
    </div>
  );
};

export default DepartmentalComplaints;
