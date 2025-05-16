import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Login to CiviConnect</h1>
      <LoginForm />
    </div>
  );
};

export default Login;