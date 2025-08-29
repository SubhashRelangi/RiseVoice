import React from "react";
import styles from "./Services.module.css"; 

const Services = () => {
  const services = [
    { name: "Electricity", icon: "⚡", className: styles.electricity },
    { name: "Transport", icon: "🚌", className: styles.transport },
    { name: "Health Care", icon: "❤️", className: styles.healthcare },
    { name: "Water", icon: "💧", className: styles.water },
    { name: "Sanitation", icon: "🗑️", className: styles.sanitation },
    { name: "Police/Grievance", icon: "🛡️", className: styles.police },
  ];

  return (
    <section className={styles.services}>
      <h2 className={styles.servicesTitle}>Services</h2>
      <p className={styles.servicesSubtitle}>Quick access to essential services</p>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={`${styles.icon} ${service.className}`}>{service.icon}</div>
            <h3>{service.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
