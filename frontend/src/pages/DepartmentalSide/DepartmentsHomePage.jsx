import React, { useState, useEffect } from 'react';
import ProblemStatistics from '../../Components/DepartmentalHomeComponents/ProblemStatistics';
import ProblemList from '../../Components/DepartmentalHomeComponents/ProblemList';
import ProblemMap from '../../Components/DepartmentalHomeComponents/ProblemMap/ProblemMap';
import DepartmentalDashboard from '../../Components/DepartmentalHomeComponents/DepartmentalDashboard';
import ProblemSummary from '../../Components/DepartmentalHomeComponents/ProblemSummary';
import axiosInstance from '../../axiosInstance';
import GenericSkeletonLoader from '../../Components/GenericSkeletonLoader'; // Use generic skeleton loader
import styles from './DepartmentsHomePage.module.css';

const DepartmentsHomePage = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    resolved: 0,
    inProgress: 0,
    pending: 0,
  });
  const [departmentLocation, setDepartmentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        // First, get the department's profile to find their location
        const profileResponse = await axiosInstance.get('/api/departments/profile');
        const { location, serviceType } = profileResponse.data;
        setDepartmentLocation(location);

        // Then, fetch problems within a 3km radius of the department's location
        const problemsResponse = await axiosInstance.get('/api/problems', {
          params: {
            radius: 3, // 3km radius
            departmentLat: location.latitude,
            departmentLng: location.longitude,
            category: serviceType, // Use serviceType directly as category
          },
        });
        
        const fetchedProblems = problemsResponse.data;
        setProblems(fetchedProblems);

        // Calculate stats based on the fetched problems
        const newStats = {
          resolved: fetchedProblems.filter(p => p.status === 'Resolved' || p.status === 'Resloved').length,
          inProgress: fetchedProblems.filter(p => p.status === 'In Progress').length,
          pending: fetchedProblems.filter(p => p.status === 'Pending').length,
        };
        setStats(newStats);

      } catch (error) {
        console.error('Error fetching department data or problems:', error);
        setError('Failed to load page data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  return (
    <div>
      <main>
        {loading ? (
          <div className={styles.loaderWrapper}>
            <GenericSkeletonLoader type="dashboard-stats" count={1} height="150px" /> {/* For DepartmentalDashboard */}
            <GenericSkeletonLoader type="map" height="400px" /> {/* For ProblemMap */}
            <GenericSkeletonLoader type="list-item" count={3} height="200px" /> {/* For ProblemList */}
            <GenericSkeletonLoader type="text-block" height="100px" /> {/* For ProblemStatistics */}
            <GenericSkeletonLoader type="text-block" height="80px" /> {/* For ProblemSummary */}
          </div>
        ) : error ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <DepartmentalDashboard stats={stats} />
            <ProblemMap problems={problems} departmentLocation={departmentLocation} />
            <ProblemList problems={problems} />
            <ProblemStatistics problems={problems} />
            <ProblemSummary problems={problems} />
          </>
        )}
      </main>
    </div>
  );
};

export default DepartmentsHomePage;