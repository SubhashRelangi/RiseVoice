import React from "react";
import { FaTools, FaWater, FaLeaf, FaLandmark } from "react-icons/fa";

import styles from "./Departments.module.css"; 

const Departments = () => {
  const departments = [
    {
      icon: <FaTools size={40} color="#2b7de9" />,
      title: "Infrastructure",
      desc: "Roads, bridges, construction issues",
    },
    {
      icon: <FaWater size={40} color="#0099ff" />,
      title: "Utilities & Services",
      desc: "Water, electricity, gas services",
    },
    {
      icon: <FaLeaf size={40} color="#16a34a" />,
      title: "Environmental",
      desc: "Pollution, waste management",
    },
    {
      icon: <FaLandmark size={40} color="#1e3a8a" />,
      title: "Governance",
      desc: "Administrative, legal issues",
    },
  ];

  return (
    <section className={styles.departments}>
      <h2 className={styles.departmentsTitle}>Departments</h2>
      <p className={styles.departmentsSubtitle}>
        Choose the relevant department for your complaint
      </p>

      <div className={styles.departmentsGrid}>
        {departments.map((dept, index) => (
          <div className={styles.departmentCard} key={index}>
            <div className={styles.icon}>{dept.icon}</div>
            <h3>{dept.title}</h3>
            <p>{dept.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Departments;
