import React from 'react';
import { useDashboardController } from '../controllers/useDashboardController';
import DashboardView from '../components/Dashboard/DashboardView';

const Dashboard = () => {
  const { state, actions } = useDashboardController();

  return <DashboardView state={state} actions={actions} />;
};

export default Dashboard;
