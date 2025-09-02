import React from 'react';
import DepartmentalDashboard from '../../Components/DepartmentalHomeComponents/DepartmentalDashboard';
import ProblemList from '../../Components/DepartmentalHomeComponents/ProblemList';
import ProblemMap from '../../Components/DepartmentalHomeComponents/ProblemMap/ProblemMap';

const DepartmentsHomePage = () => {
  return (
    <div>
      <main>
        <DepartmentalDashboard />
        <ProblemMap />
        <ProblemList />
      </main>
    </div>
  );
}; // Added a comment to trigger recompile

export default DepartmentsHomePage;
