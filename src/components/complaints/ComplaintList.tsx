import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../../types';
import { formatDate, getPriorityColor, formatCategory, getStatusBorderColor } from '../../utils/formatters';

interface ComplaintListProps {
  complaints: Complaint[];
  title?: string;
  showFilters?: boolean;
}

const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  title = 'Complaints',
  showFilters = true,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter((complaint) => {
      const matchesSearch = searchTerm === '' || 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.submittedAt).getTime();
        const dateB = new Date(b.submittedAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const priorityMap = { low: 1, medium: 2, high: 3, urgent: 4 };
        const priorityA = priorityMap[a.priority];
        const priorityB = priorityMap[b.priority];
        return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
      }
    });
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const handleComplaintClick = (id: string) => {
    navigate(`/complaints/${id}`);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      {showFilters && (
        <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-b bg-gray-50">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 mr-2">Filters:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'all')}
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ComplaintCategory | 'all')}
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
          
          <div className="flex items-center ml-auto">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Date</option>
              <option value="priority">Priority</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              className="ml-2 p-1"
              onClick={toggleSortOrder}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <CardBody className="p-0">
        {filteredComplaints.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No complaints found.
          </div>
        ) : (
          <div className="divide-y">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${getStatusBorderColor(complaint.status)} border-l-4`}
                onClick={() => handleComplaintClick(complaint.id)}
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <StatusBadge status={complaint.status} size="sm" />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatCategory(complaint.category)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:mt-0 text-right flex flex-col items-end">
                    <span className="text-sm text-gray-500">{formatDate(complaint.submittedAt)}</span>
                    <span className="text-xs text-gray-500 mt-1">{complaint.location}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {complaint.responses.length} {complaint.responses.length === 1 ? 'response' : 'responses'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ComplaintList;