import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetail from './pages/ComplaintDetail';
import Dashboard from './pages/Dashboard';
import { AppProvider } from './contexts/AppContext';
import { initializeLocalStorage } from './utils/storage';

// Initialize data
initializeLocalStorage();

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-1 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/submit" element={<SubmitComplaint />} />
                <Route path="/my-complaints" element={<MyComplaints />} />
                <Route path="/complaints/:id" element={<ComplaintDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
          
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;