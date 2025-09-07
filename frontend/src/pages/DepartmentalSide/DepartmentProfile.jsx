import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentProfileCard from '../../Components/DepartmentProfile/DepartmentProfileCard';
import DepartmentDetailsCard from '../../Components/DepartmentProfile/DepartmentDetailsCard';
import DepartmentAuditTrailCard from '../../Components/DepartmentProfile/DepartmentAuditTrailCard';
import DepartmentClassificationCard from '../../Components/DepartmentProfile/DepartmentClassificationCard';

const DepartmentProfile = () => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departmentData = {
    water: {
      name: 'Water Services',
      description: 'Responsible for municipal water supply, distribution, and operations.'
    },
    electricity: {
      name: 'Electricity Services',
      description: 'Handles power generation, distribution, and maintenance of electrical infrastructure.'
    },
    roads_infrastructure: {
      name: 'Roads & Infrastructure',
      description: 'Manages construction, repair, and maintenance of roads, bridges, and public infrastructure.'
    },
    waste_management: {
      name: 'Waste Management',
      description: 'Oversees garbage collection, recycling, sanitation, and disposal services.'
    },
    healthcare: {
      name: 'Healthcare Services',
      description: 'Provides medical facilities, hospitals, and public health programs.'
    },
    education: {
      name: 'Education Department',
      description: 'Responsible for schools, colleges, educational programs, and literacy initiatives.'
    },
    transport: {
      name: 'Transport Services',
      description: 'Manages public transportation systems, bus services, and traffic operations.'
    },
    agriculture: {
      name: 'Agriculture Department',
      description: 'Supports farmers, crop development, irrigation, and agricultural innovation.'
    },
    revenue: {
      name: 'Revenue Department',
      description: 'Handles taxation, land revenue, and financial records for the municipality.'
    },
    police: {
      name: 'Police Department',
      description: 'Ensures public safety, law enforcement, and crime prevention.'
    }
  };

  const getServiceDescription = (serviceType) => {
    const lowerCaseServiceType = serviceType.toLowerCase();
    return departmentData[lowerCaseServiceType]?.description || 'No description available';
  };

  useEffect(() => {
    const fetchDepartmentProfile = async () => {
      try {
        const response = await axios.get('/api/departments/profile'); // Corrected endpoint
        setDepartment(response.data);
        console.log('Fetched department profile:', response.data);
      } catch (err) {
        setError('Failed to fetch department profile.');
        console.error('Error fetching department profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentProfile();
  }, []);

  if (loading) {
    return <div>Loading department profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!department) {
    return <div>No department data found.</div>;
  }

  return (
    <div>
      <DepartmentProfileCard
        departmentName={department.name}
        serviceType={department.serviceType} // Assuming a serviceType field
        location={department.location} // Assuming a location field with { latitude, longitude }
        isActive={department.isActive} // Assuming an isActive field
        isVerified={department.isVerified} // Assuming an isVerified field
      />
      <DepartmentDetailsCard
        departmentId={department.id || 'N/A'}
        email={department.email || 'N/A'}
        locationCoords={department.location ? `${department.location.latitude}, ${department.location.longitude}` : 'N/A'}
        lastLogin={department.lastLogin ? new Date(department.lastLogin).toLocaleString() : 'N/A'}
        departmentStatus={department.isActive ? 'Active' : 'Inactive'}
        verificationStatus={department.isVerified ? 'Verified' : 'Unverified'}
      />
      <DepartmentAuditTrailCard
        createdDate={department.createdAt ? new Date(department.createdAt).toLocaleString() : 'N/A'}
        lastUpdatedDate={department.updatedAt ? new Date(department.updatedAt).toLocaleString() : 'N/A'}
      />
      <DepartmentClassificationCard
        departmentType={department.serviceType || 'N/A'}
        description={getServiceDescription(department.serviceType)}
      />
    </div>
  );
};

export default DepartmentProfile;
