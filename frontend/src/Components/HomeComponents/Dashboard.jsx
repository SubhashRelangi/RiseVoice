import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        solved: 0,
        inProgress: 0,
        todayRaised: 0,
    });

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axiosInstance.get('/api/problems');
                const complaints = response.data;

                const total = complaints.length;
                const solved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Resloved').length;
                const inProgress = complaints.filter(c => c.status === 'In Progress').length;

                const today = new Date().toISOString().split('T')[0];
                const todayRaised = complaints.filter(c => c.createdAt.split('T')[0] === today).length;

                setStats({ total, solved, inProgress, todayRaised });
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, []);

    return (
        <div className={styles.DashboardDiv}>
            <div className={styles.DashboardContainer}>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>{stats.total}+</h1>
                    <p className={styles.Para}>Problems</p>
                </div>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>{stats.solved}+</h1>
                    <p className={styles.Para}>Sloved</p>
                </div>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>{stats.inProgress}+</h1>
                    <p className={styles.Para}>In-Progress</p>
                </div>
                <div className={styles.DashboardContent}>
                    <h1 className={styles.Heading}>{stats.todayRaised}+</h1>
                    <p className={styles.Para}>Today Raised</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

