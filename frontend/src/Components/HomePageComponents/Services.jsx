import React from "react";
import "../../StyleSheets/Services.css";

const Services = () => {
  const services = [
    { name: "Electricity", icon: "⚡", className: "electricity" },
    { name: "Transport", icon: "🚌", className: "transport" },
    { name: "Health Care", icon: "❤️", className: "healthcare" },
    { name: "Water", icon: "💧", className: "water" },
    { name: "Sanitation", icon: "🗑️", className: "sanitation" },
    { name: "Police/Grievance", icon: "🛡️", className: "police" },
  ];

  return (
    <section className="services">
      <h2 className="services-title">Services</h2>
      <p className="services-subtitle">Quick access to essential services</p>

      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className={`icon ${service.className}`}>{service.icon}</div>
            <h3>{service.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
