import React from "react";
import styles from "./Services.module.css"; 
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    { name: "Electricity", icon: "⚡", className: styles.electricity, category: "ELECTRICITY" },
    { name: "Transport", icon: "🚌", className: styles.transport, category: "TRANSPORT" },
    { name: "Health Care", icon: "❤️", className: styles.healthcare, category: "HEALTHCARE" },
    { name: "Water", icon: "💧", className: styles.water, category: "WATER" },
    { name: "Sanitation", icon: "🗑️", className: styles.sanitation, category: "WASTE_MANAGEMENT" },
    { name: "Police/Grievance", icon: "🛡️", className: styles.police, category: "POLICE" },
  ];

  return (
    <section className={styles.services}>
      <h2 className={styles.servicesTitle}>Services</h2>
      <p className={styles.servicesSubtitle}>Quick access to essential services</p>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <Link to="/raise-complaint" state={{ category: service.category }} key={index} className={styles.serviceCardLink}>
            <div className={styles.serviceCard}>
              <div className={`${styles.icon} ${service.className}`}>{service.icon}</div>
              <h3>{service.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Services;
