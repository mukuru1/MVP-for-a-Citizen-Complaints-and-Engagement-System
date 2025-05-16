import React, { useState } from 'react';
import { 
  PieChart, 
  BarChart, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  List, 
  Filter 
} from 'lucide-react';
import Card, { CardBody, CardHeader } from '../common/Card';
import Button from '../common/Button';
import ComplaintList from '../complaints/ComplaintList';
import { useApp } from '../../contexts/AppContext';
import { 
  getComplaints, 
  getComplaintStatistics, 
  getUserById, 
  assignComplaint, 
  updateComplaintStatus 
} from '../../utils/storage';
import { ComplaintStatus, ComplaintCategory, Complaint } from '../../types';

const AdminDashboard: React.FC = () => {
  const { refreshData } = useApp();
  const complaints = getComplaints();
  const statistics = getComplaintStatistics();
  
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'all'>('all');
  
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || complaint.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });
  
  const pendingComplaints = complaints.filter(c => c.status === 'pending');
  
  const handleAssignComplaint = (id: string, agencyId: string) => {
    assignComplaint(id, agencyId);
    refreshData();
  };
  
  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    updateComplaintStatus(id, status);
    refreshData();
  };
  
  // Chart data
  const statusChartData = [
    { label: 'Pending', value: statistics.byStatus.pending, color: 'bg-amber-500' },
    { label: 'In Review', value: statistics.byStatus.inReview, color: 'bg-blue-500' },
    { label: 'In Progress', value: statistics.byStatus.inProgress, color: 'bg-violet-500' },
    { label: 'Resolved', value: statistics.byStatus.resolved, color: 'bg-green-500' },
    { label: 'Rejected', value: statistics.byStatus.rejected, color: 'bg-red-500' },
  ];
  
  const categoryChartData = [
    { label: 'Water', value: statistics.byCategory.water, color: 'bg-blue-500' },
    { label: 'Electricity', value: statistics.byCategory.electricity, color: 'bg-yellow-500' },
    { label: 'Roads', value: statistics.byCategory.roads, color: 'bg-gray-500' },
    { label: 'Sanitation', value: statistics.byCategory.sanitation, color: 'bg-green-500' },
    { label: 'Public Safety', value: statistics.byCategory.publicSafety, color: 'bg-red-500' },
    { label: 'Other', value: statistics.byCategory.other, color: 'bg-gray-300' },
  ];
  
  // Find the max value for scaling the bars
  const maxStatusValue = Math.max(...statusChartData.map(d => d.value));
  const maxCategoryValue = Math.max(...categoryChartData.map(d => d.value));
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex items-center p-4">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <List className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Complaints</p>
              <p className="text-2xl font-semibold">{statistics.total}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold">{statistics.byStatus.pending}</p>
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
              <p className="text-2xl font-semibold">{statistics.byStatus.resolved}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <div className="rounded-full bg-violet-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-semibold">{statistics.averageResponseTime}h</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <PieChart className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium">Complaints by Status</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {statusChartData.map((item) => (
                <div key={item.label} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{item.label}</div>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${(item.value / maxStatusValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-sm font-medium ml-2">{item.value}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium">Complaints by Category</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {categoryChartData.map((item) => (
                <div key={item.label} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{item.label}</div>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${(item.value / maxCategoryValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-sm font-medium ml-2">{item.value}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-medium flex items-center">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            Pending Complaints
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 mr-2">Filter:</span>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus | 'all')}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ComplaintCategory | 'all')}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="roads">Roads</option>
              <option value="sanitation">Sanitation</option>
              <option value="public-safety">Public Safety</option>
              <option value="other">Other</option>
            </select>
          </div>
        </CardHeader>
        
        <CardBody className="p-0">
          {filteredComplaints.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No complaints found matching the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complaint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => {
                    const submitter = getUserById(complaint.submittedBy);
                    const assignee = complaint.assignedTo ? getUserById(complaint.assignedTo) : null;
                    
                    return (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{complaint.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            complaint.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            complaint.status === 'in-review' ? 'bg-blue-100 text-blue-800' :
                            complaint.status === 'in-progress' ? 'bg-violet-100 text-violet-800' :
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {complaint.status.replace('-', ' ').charAt(0).toUpperCase() + complaint.status.replace('-', ' ').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{submitter?.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {assignee ? assignee.name : 'Not assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {complaint.status === 'pending' && (
                            <div className="flex justify-end space-x-2">
                              <select
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAssignComplaint(complaint.id, e.target.value);
                                  }
                                }}
                              >
                                <option value="" disabled>Assign to...</option>
                                <option value="3">Water Department</option>
                                <option value="4">Roads Department</option>
                              </select>
                            </div>
                          )}
                          
                          {complaint.status !== 'pending' && complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="success"
                                size="sm"
                                className="text-xs px-2 py-1"
                                onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                              >
                                Resolve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                className="text-xs px-2 py-1"
                                onClick={() => handleUpdateStatus(complaint.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {(complaint.status === 'resolved' || complaint.status === 'rejected') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs px-2 py-1"
                              onClick={() => handleUpdateStatus(complaint.id, 'in-progress')}
                            >
                              Reopen
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminDashboard;