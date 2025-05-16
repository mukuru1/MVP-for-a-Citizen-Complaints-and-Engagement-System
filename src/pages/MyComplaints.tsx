import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Button from '../components/common/Button';
import ComplaintList from '../components/complaints/ComplaintList';
import { useApp } from '../contexts/AppContext';
import { getComplaintsByUser } from '../utils/storage';

const MyComplaints: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useApp();
  
  if (!isAuthenticated || !currentUser) {
    navigate('/login');
    return null;
  }
  
  const complaints = getComplaintsByUser(currentUser.id);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Complaints</h1>
        <Button
          variant="primary"
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => navigate('/submit')}
          className="mt-4 sm:mt-0"
        >
          Submit New Complaint
        </Button>
      </div>
      
      {complaints.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
            <PlusCircle className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">No complaints yet</h2>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            You haven't submitted any complaints yet. Click the button above to submit your first complaint.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => navigate('/submit')}
              className="shadow-sm"
            >
              Submit Your First Complaint
            </Button>
          </div>
        </div>
      ) : (
        <ComplaintList complaints={complaints} title="Your Complaints" />
      )}
    </div>
  );
};

export default MyComplaints;