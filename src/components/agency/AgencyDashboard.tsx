import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../common/Card';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';
import { getComplaintsByAgency, getUserById, updateComplaintStatus } from '../../utils/storage';
import { ComplaintStatus } from '../../types';
import ComplaintList from '../complaints/ComplaintList';

const AgencyDashboard: React.FC = () => {
  const { currentUser, refreshData } = useApp();
  const [selectedView, setSelectedView] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  
  if (!currentUser || currentUser.role !== 'agency') {
    return <div>Unauthorized access</div>;
  }
  
  const allComplaints = getComplaintsByAgency(currentUser.id);
  
  const filteredComplaints = selectedView === 'all'
    ? allComplaints
    : allComplaints.filter(c => 
        selectedView === 'pending' 
          ? (c.status === 'pending' || c.status === 'in-review')
          : c.status === selectedView
      );
  
  const pendingCount = allComplaints.filter(c => c.status === 'pending' || c.status === 'in-review').length;
  const inProgressCount = allComplaints.filter(c => c.status === 'in-progress').length;
  const resolvedCount = allComplaints.filter(c => c.status === 'resolved').length;
  const totalResponses = allComplaints.reduce((sum, complaint) => sum + complaint.responses.length, 0);
  
  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    updateComplaintStatus(id, status);
    refreshData();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentUser.department?.charAt(0).toUpperCase() + currentUser.department?.slice(1)} Department Dashboard
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex items-center p-4">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold">{pendingCount}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold">{inProgressCount}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold">{resolvedCount}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <div className="rounded-full bg-violet-100 p-3 mr-4">
              <MessageSquare className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Responses</p>
              <p className="text-2xl font-semibold">{totalResponses}</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedView === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('all')}
        >
          All Complaints
        </Button>
        <Button
          variant={selectedView === 'pending' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('pending')}
        >
          Pending & In Review
        </Button>
        <Button
          variant={selectedView === 'in-progress' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('in-progress')}
        >
          In Progress
        </Button>
        <Button
          variant={selectedView === 'resolved' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('resolved')}
        >
          Resolved
        </Button>
      </div>
      
      <ComplaintList 
        complaints={filteredComplaints} 
        title={`${selectedView === 'all' ? 'All' : selectedView === 'pending' ? 'Pending & In Review' : selectedView === 'in-progress' ? 'In Progress' : 'Resolved'} Complaints`}
        showFilters={false}
      />
      
      {pendingCount === 0 && inProgressCount === 0 && (
        <Card>
          <CardBody className="p-6">
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You've addressed all assigned complaints. Great job! Check back later for new assigned complaints.
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default AgencyDashboard;