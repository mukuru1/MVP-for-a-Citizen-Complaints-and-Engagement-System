import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card, { CardBody, CardFooter } from '../common/Card';
import { useApp } from '../../contexts/AppContext';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('citizen');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const user = login(email, role);
      
      if (user) {
        navigate(role === 'citizen' ? '/' : '/dashboard');
      } else {
        setError('Invalid email or role. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardBody>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Demo accounts: citizen@example.com, admin@gov.example, water@gov.example, roads@gov.example
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
              <option value="agency">Agency</option>
            </select>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            className="transition-transform active:scale-95"
          >
            Login
          </Button>
        </form>
      </CardBody>
      
      <CardFooter className="text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Register
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;