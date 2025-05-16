import React from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintForm from '../components/complaints/ComplaintForm';
import { useApp } from '../contexts/AppContext';

const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useApp();
  
  if (!isAuthenticated || !currentUser) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Submit a Complaint</h1>
      <ComplaintForm />
    </div>
  );
};

export default SubmitComplaint;