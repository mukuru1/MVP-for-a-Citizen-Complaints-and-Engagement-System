import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Clock, Activity, BarChart2 } from 'lucide-react';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import { useApp } from '../contexts/AppContext';
import { getComplaints } from '../utils/storage';

const Home: React.FC = () => {
  const { isAuthenticated, currentUser } = useApp();
  const complaints = getComplaints();
  
  const featuredCategories = [
    { name: 'Water Issues', icon: 'droplet', color: 'bg-blue-100 text-blue-700' },
    { name: 'Road Problems', icon: 'map', color: 'bg-amber-100 text-amber-700' },
    { name: 'Electricity', icon: 'zap', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Sanitation', icon: 'trash-2', color: 'bg-green-100 text-green-700' },
    { name: 'Public Safety', icon: 'shield', color: 'bg-red-100 text-red-700' },
  ];

  const stepItems = [
    { 
      icon: AlertTriangle, 
      title: 'Submit a Complaint', 
      description: 'Fill out the simple complaint form with details about the issue you\'re experiencing.'
    },
    { 
      icon: Clock, 
      title: 'Track Progress', 
      description: 'Follow the status of your complaint through our real-time tracking system.'
    },
    { 
      icon: Check, 
      title: 'Get Resolution', 
      description: 'Receive updates and resolution from the assigned government agency.'
    },
    { 
      icon: Activity, 
      title: 'Provide Feedback', 
      description: 'Rate the service and help us improve the system for all citizens.'
    },
  ];
  
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="relative bg-blue-700 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Your Voice Matters in Building Better Communities
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Submit, track, and resolve public service complaints through a single unified platform.
              Connect directly with the right government agencies.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/submit">
                <Button size="lg" className="shadow-lg transition-transform hover:scale-105">
                  Submit a Complaint
                </Button>
              </Link>
              <Link to="/my-complaints">
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-transform hover:scale-105">
                  Track Your Complaints
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-4 mr-5">
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">{complaints.length}</p>
              <p className="text-gray-600">Total Complaints</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-4 mr-5">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">{complaints.filter(c => c.status === 'resolved').length}</p>
              <p className="text-gray-600">Resolved Issues</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="rounded-full bg-violet-100 p-4 mr-5">
              <BarChart2 className="h-8 w-8 text-violet-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* How it works section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes it easy to report issues, track progress, and get resolutions from the appropriate government departments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stepItems.map((item, i) => (
            <Card key={i}>
              <CardBody className="p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Categories section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Report Issues In Any Category</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            From water supply problems to road maintenance, our platform connects you with the right department.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {featuredCategories.map((category, i) => (
            <Link key={i} to="/submit">
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardBody className="p-6 text-center flex flex-col items-center justify-center">
                  <div className={`rounded-full ${category.color} p-4 mb-4`}>
                    <i className={`lucide lucide-${category.icon} h-6 w-6`}></i>
                  </div>
                  <h3 className="text-lg font-medium">{category.name}</h3>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <h2 className="text-3xl font-bold text-white">Ready to make your voice heard?</h2>
              <p className="mt-4 text-lg text-gray-300">
                Join thousands of citizens who have successfully resolved issues in their communities through our platform.
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:ml-8">
              <Link to={isAuthenticated ? '/submit' : '/register'}>
                <Button size="lg" className="w-full md:w-auto shadow-lg transition-transform hover:scale-105">
                  {isAuthenticated ? 'Submit a Complaint' : 'Create an Account'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from citizens who have successfully resolved issues in their communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Robert Chen</h3>
                  <p className="text-gray-600">Riverside Resident</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I reported a pothole that had been causing problems for months. Within a week, the roads department had assessed and fixed it. I'm impressed with how quickly they addressed the issue!"
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Sarah Johnson</h3>
                  <p className="text-gray-600">Downtown Resident</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Our neighborhood had inconsistent water supply for weeks. I submitted a complaint through the platform, and the water department responded within days. They fixed the underlying issue and kept us informed throughout."
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Michael Rodriguez</h3>
                  <p className="text-gray-600">Hillside Resident</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I was skeptical at first, but after reporting street lights that had been out for months, I was surprised when a maintenance crew showed up the very next day. This platform really works!"
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5" fill={star <= 4 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                    {star <= 4 ? (
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    )}
                  </svg>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;