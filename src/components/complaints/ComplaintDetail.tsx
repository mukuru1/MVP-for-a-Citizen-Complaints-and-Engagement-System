import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, MapPin, Tag, BarChart2, MessageSquare, PlusCircle,
  ChevronLeft, Droplet, Zap, Map, Trash2, Shield, HelpCircle
} from 'lucide-react';
import Button from '../common/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../contexts/AppContext';
import { getComplaintById, getUserById, addResponse } from '../../utils/storage';
import { 
  formatDateTime, 
  formatCategory, 
  formatPriority,
  getPriorityColor,
  getRelativeTime
} from '../../utils/formatters';
import { ComplaintCategory } from '../../types';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, refreshData } = useApp();
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!id) {
    navigate('/my-complaints');
    return null;
  }
  
  const complaint = getComplaintById(id);
  if (!complaint) {
    navigate('/my-complaints');
    return null;
  }
  
  const submitter = getUserById(complaint.submittedBy);
  const assignedTo = complaint.assignedTo ? getUserById(complaint.assignedTo) : null;
  
  const canRespond = currentUser && (
    currentUser.role === 'admin' || 
    (currentUser.role === 'agency' && complaint.assignedTo === currentUser.id)
  );
  
  const getCategoryIcon = (category: ComplaintCategory) => {
    switch (category) {
      case 'water':
        return <Droplet className="h-5 w-5 text-blue-500" />;
      case 'electricity':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'roads':
        return <Map className="h-5 w-5 text-gray-500" />;
      case 'sanitation':
        return <Trash2 className="h-5 w-5 text-green-500" />;
      case 'public-safety':
        return <Shield className="h-5 w-5 text-red-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !canRespond || !newResponse.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addResponse(complaint.id, newResponse, currentUser.id);
      setNewResponse('');
      refreshData();
    } catch (err) {
      console.error('Error submitting response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 ml-4">Complaint Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{complaint.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={complaint.status} />
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(complaint.priority)}`}>
                    {formatPriority(complaint.priority)}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                ID: {complaint.id.slice(0, 8)}
              </div>
            </CardHeader>
            
            <CardBody>
              <div className="space-y-4">
                <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="text-sm font-medium">{formatDateTime(complaint.submittedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-sm font-medium">{complaint.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-sm font-medium flex items-center">
                        {getCategoryIcon(complaint.category)}
                        <span className="ml-1">{formatCategory(complaint.category)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Priority</p>
                      <p className="text-sm font-medium">{formatPriority(complaint.priority)}</p>
                    </div>
                  </div>
                </div>
                
                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {complaint.attachments.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block border rounded p-2 hover:bg-gray-50"
                        >
                          <div className="bg-gray-100 h-20 flex items-center justify-center rounded">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-xs text-center mt-1 truncate">Attachment {index + 1}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">
                Responses ({complaint.responses.length})
              </h3>
            </div>
            
            {complaint.responses.length === 0 ? (
              <Card>
                <CardBody className="text-center py-8">
                  <p className="text-gray-500">No responses yet.</p>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                {complaint.responses.map((response) => {
                  const responder = getUserById(response.respondedBy);
                  return (
                    <Card key={response.id}>
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                              {responder?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{responder?.name}</p>
                              <p className="text-sm text-gray-500">{responder?.role}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {getRelativeTime(response.respondedAt)}
                          </div>
                        </div>
                        <div className="mt-4 text-gray-700 whitespace-pre-line">
                          {response.text}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {canRespond && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2 text-blue-500" />
                    Add Response
                  </h3>
                </CardHeader>
                <form onSubmit={handleSubmitResponse}>
                  <CardBody>
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your response here..."
                      required
                    />
                  </CardBody>
                  <CardFooter className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      disabled={!newResponse.trim()}
                      className="transition-transform active:scale-95"
                    >
                      Submit Response
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Tracking Information</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Submitted by</p>
                  <p className="font-medium">{submitter?.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Assigned to</p>
                  <p className="font-medium">
                    {assignedTo ? assignedTo.name : 'Not yet assigned'}
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-3">Status Timeline</p>
                  <div className="relative">
                    <div className="absolute h-full w-0.5 bg-gray-200 left-1.5 top-1"></div>
                    
                    <div className="relative flex items-start mb-4">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mt-1.5 mr-3"></div>
                      <div>
                        <p className="font-medium">Complaint Submitted</p>
                        <p className="text-sm text-gray-500">{formatDateTime(complaint.submittedAt)}</p>
                      </div>
                    </div>
                    
                    {complaint.responses.map((response, index) => (
                      <div key={index} className="relative flex items-start mb-4">
                        <div className="h-3 w-3 rounded-full bg-green-500 mt-1.5 mr-3"></div>
                        <div>
                          <p className="font-medium">Response Added</p>
                          <p className="text-sm text-gray-500">{formatDateTime(response.respondedAt)}</p>
                        </div>
                      </div>
                    ))}
                    
                    {complaint.status === 'resolved' && (
                      <div className="relative flex items-start mb-4">
                        <div className="h-3 w-3 rounded-full bg-green-600 mt-1.5 mr-3"></div>
                        <div>
                          <p className="font-medium">Complaint Resolved</p>
                          <p className="text-sm text-gray-500">
                            {complaint.responses.length > 0 
                              ? formatDateTime(complaint.responses[complaint.responses.length - 1].respondedAt)
                              : 'Date not available'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <h3 className="text-lg font-medium mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you need further assistance with this complaint, please contact the relevant department directly.
              </p>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Emergency Contact</h4>
                <p className="text-sm text-blue-700">
                  For urgent matters requiring immediate attention, please call: <br />
                  <span className="font-bold">911</span>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;