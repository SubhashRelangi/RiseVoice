import React, { useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import styles from "./DepartmentCharts.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DepartmentCharts = ({ departments = [] }) => {

  const departmentData = useMemo(() => {
    if (!departments || departments.length === 0) {
      return null;
    }

    // Process data for doughnut chart
    const statusCounts = departments.reduce((acc, dept) => {
      acc[dept.status] = (acc[dept.status] || 0) + 1;
      return acc;
    }, {});

    const doughnutChartData = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Departments by Status",
          data: Object.values(statusCounts),
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
          borderColor: ["#28a745", "#ffc107", "#dc3545"],
          borderWidth: 1,
        },
      ],
    };

    // Process data for bar chart
    const stateCounts = departments.reduce((acc, dept) => {
      if (dept.state && dept.state !== 'N/A') {
          acc[dept.state] = (acc[dept.state] || 0) + 1;
      }
      return acc;
    }, {});

    const barChartData = {
      labels: Object.keys(stateCounts),
      datasets: [
        {
          label: "Departments by State",
          data: Object.values(stateCounts),
          backgroundColor: "#007bff",
        },
      ],
    };

    return {
      doughnut: doughnutChartData,
      bar: barChartData,
      total: departments.length,
      statusCounts: statusCounts,
      totalStates: Object.keys(stateCounts).length
    };
  }, [departments]);


  if (!departmentData) {
    return <p>No chart data available.</p>;
  }

  const doughnutOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.chartsContainer}>
      <div className={styles.chartCard}>
        <div className={styles.chartContent}>
          <h3 className={styles.chartTitle}>Departments by Status</h3>
          <div className={styles.doughnutChart}>
            <Doughnut data={departmentData.doughnut} options={doughnutOptions} />
            <div className={styles.doughnutCenter}>
              <span className={styles.doughnutTotal}>{departmentData.total}</span>
              <span>Total</span>
            </div>
          </div>
        </div>
        <div className={styles.legend}>
          {Object.entries(departmentData.statusCounts).map(([status, count]) => (
            <div key={status} className={styles.legendItem}>
              <span className={`${styles.legendColor} ${styles[status]}`}></span>
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              <span className={styles.legendValue}>{count} ({(count / departmentData.total * 100).toFixed(0)}%)</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Departments by State</h3>
          <button className={styles.exportButton}>Export</button>
        </div>
        <Bar data={departmentData.bar} options={barOptions} />
        <div className={styles.chartFooter}>
          Showing top {departmentData.bar.labels.length} states. Total: {departmentData.totalStates} states
        </div>
      </div>
    </div>
  );
};

export default DepartmentCharts;