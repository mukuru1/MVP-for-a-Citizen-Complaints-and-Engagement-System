import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Droplet, Zap, Map, Trash2, Shield, HelpCircle } from 'lucide-react';
import Button from '../common/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../common/Card';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { addComplaint } from '../../utils/storage';
import { formatCategory } from '../../utils/formatters';

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, refreshData } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('water');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addComplaint({
        title,
        description,
        category,
        location,
        priority,
        submittedBy: currentUser.id,
      });
      
      refreshData();
      navigate('/my-complaints');
    } catch (err) {
      console.error('Error submitting complaint:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const getCategoryIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'water':
        return <Droplet className="h-6 w-6" />;
      case 'electricity':
        return <Zap className="h-6 w-6" />;
      case 'roads':
        return <Map className="h-6 w-6" />;
      case 'sanitation':
        return <Trash2 className="h-6 w-6" />;
      case 'public-safety':
        return <Shield className="h-6 w-6" />;
      case 'other':
        return <HelpCircle className="h-6 w-6" />;
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8 w-full max-w-md">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center relative">
            <div
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                currentStep === step
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : currentStep > step
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > step ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className="text-xs font-medium mt-2 text-gray-600">
              {step === 1 ? 'Details' : step === 2 ? 'Category' : 'Location'}
            </span>
            
            {step < 3 && (
              <div
                className={`absolute top-5 left-full w-16 h-0.5 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                }`}
                style={{ width: 'calc(100% - 2.5rem)' }}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="border-b">
        <h2 className="text-xl font-bold text-gray-800">Submit a Complaint</h2>
      </CardHeader>
      
      <CardBody>
        {renderStepIndicator()}
        
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Complaint Details</h3>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief title of your complaint"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of the issue..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Category</h3>
              <p className="text-sm text-gray-600">Choose the category that best describes your complaint:</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {(['water', 'electricity', 'roads', 'sanitation', 'public-safety', 'other'] as ComplaintCategory[]).map((cat) => (
                  <div
                    key={cat}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      category === cat
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => setCategory(cat)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`text-${category === cat ? 'blue' : 'gray'}-600`}>
                        {getCategoryIcon(cat)}
                      </div>
                      <span className="font-medium">{formatCategory(cat)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location Details</h3>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location or address"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h4 className="font-medium text-blue-800 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Location Tips
                </h4>
                <p className="mt-1 text-sm text-blue-700">
                  Provide specific details like street names, landmarks, or building numbers to help
                  us locate and address the issue more efficiently.
                </p>
              </div>
            </div>
          )}
        </form>
      </CardBody>
      
      <CardFooter className="flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 3 ? (
          <Button variant="primary" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="transition-transform active:scale-95"
          >
            Submit Complaint
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ComplaintForm;