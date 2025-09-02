import React from 'react';
import DepartmentalDashboard from '../../Components/DepartmentalHomeComponents/DepartmentalDashboard';
import ProblemMap from '../../Components/ProblemMap/ProblemMap';

const DepartmentsHomePage = () => {
  return (
    <div>
      <main>
        <DepartmentalDashboard />
        <ProblemMap />
      </main>
    </div>
  );
};

export default DepartmentsHomePage;
