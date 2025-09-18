import React, { useState, useEffect } from 'react';
import DashboardStats from '../../Components/AdminComponents/DashboardStats';
import DepartmentMap from '../../Components/AdminComponents/DepartmentMap';
import DepartmentCharts from '../../Components/AdminComponents/DepartmentCharts';
import AdminHomePageSkeleton from '../../Components/AdminComponents/Skeletons/AdminHomePageSkeleton';
import styles from './AdminHomePage.module.css';
import axiosInstance from '../../axiosInstance';
import axios from 'axios';

const AdminHomePage = () => {
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and departments in parallel
        const [statsResponse, departmentsResponse] = await Promise.all([
          axiosInstance.get('/api/admin/stats'),
          axiosInstance.get('/api/admin/all-departments')
        ]);

        setStats(statsResponse.data);

        // Process departments with geocoding
        const departmentsData = departmentsResponse.data;
        const departmentsWithAddress = [];
        for (const dept of departmentsData) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
            const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${dept.location.latitude}&lon=${dept.location.longitude}`, { withCredentials: false });
            const address = geoResponse.data.display_name || 'N/A';
            const state = geoResponse.data.address?.state || 'N/A';
            departmentsWithAddress.push({ ...dept, address, state });
          } catch (geoError) {
            console.error('Error fetching address for department', dept._id, geoError);
            departmentsWithAddress.push({ ...dept, address: 'N/A', state: 'N/A' });
          }
        }
        setDepartments(departmentsWithAddress);

      } catch (err) {
        setError('Failed to fetch page data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.homeContainer}>
      {loading ? (
        <div className={styles.loaderWrapper}>
          <AdminHomePageSkeleton />
        </div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <DashboardStats stats={stats} />
          <DepartmentMap departments={departments} />
          <DepartmentCharts departments={departments} />
        </>
      )}
    </div>
  );
};

export default AdminHomePage;