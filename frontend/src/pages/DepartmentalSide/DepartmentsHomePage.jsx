import React from 'react';
import ProblemStatistics from '../../Components/DepartmentalHomeComponents/ProblemStatistics';
import ProblemList from '../../Components/DepartmentalHomeComponents/ProblemList';
import ProblemMap from '../../Components/DepartmentalHomeComponents/ProblemMap/ProblemMap';
import DepartmentalDashboard from '../../Components/DepartmentalHomeComponents/DepartmentalDashboard';
import ProblemSummary from '../../Components/DepartmentalHomeComponents/ProblemSummary';

const DepartmentsHomePage = () => {
  return (
    <div>
      <main>
        <DepartmentalDashboard />
        <ProblemMap />
        <ProblemList />
        <ProblemStatistics />
        <ProblemSummary />
      </main>
    </div>
  );
};

export default DepartmentsHomePage;
