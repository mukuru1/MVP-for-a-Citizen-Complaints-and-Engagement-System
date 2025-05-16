import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import AgencyDashboard from '../components/agency/AgencyDashboard';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useApp();
  
  if (!isAuthenticated || !currentUser) {
    navigate('/login');
    return null;
  }
  
  if (currentUser.role !== 'admin' && currentUser.role !== 'agency') {
    navigate('/');
    return null;
  }
  
  return (
    <div>
      {currentUser.role === 'admin' ? <AdminDashboard /> : <AgencyDashboard />}
    </div>
  );
};

export default Dashboard;