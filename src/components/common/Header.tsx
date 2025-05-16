import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell, User, LogOut, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Button from './Button';
import { getNotifications, markNotificationAsRead } from '../../utils/storage';
import { getRelativeTime } from '../../utils/formatters';

const Header: React.FC = () => {
  const { currentUser, isAuthenticated, logout, refreshData } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const userNotifications = currentUser 
    ? getNotifications(currentUser.id) 
    : [];
  
  const unreadCount = userNotifications.filter(n => !n.read).length;
  
  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
    refreshData();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';
  };
  
  const navigation = [
    { name: 'Home', path: '/', roles: ['citizen', 'admin', 'agency'] },
    { name: 'Submit Complaint', path: '/submit', roles: ['citizen'] },
    { name: 'My Complaints', path: '/my-complaints', roles: ['citizen'] },
    { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'agency'] },
  ];
  
  const filteredNavigation = isAuthenticated && currentUser 
    ? navigation.filter(item => item.roles.includes(currentUser.role))
    : navigation.filter(item => item.path === '/');
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CiviConnect</span>
            </Link>
            
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    location.pathname === item.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-1 rounded-full text-gray-600 hover:text-blue-600 focus:outline-none"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {notificationsOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1 max-h-96 overflow-y-auto" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">
                          Notifications
                        </div>
                        {userNotifications.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          userNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer ${
                                notification.read ? 'text-gray-500' : 'text-gray-900 font-medium'
                              }`}
                              onClick={() => handleNotificationClick(notification.id)}
                            >
                              <p>{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {getRelativeTime(notification.createdAt)}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                    <div className="text-xs text-gray-500">{currentUser?.role}</div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {menuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 ${
                  location.pathname === item.path
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } text-base font-medium`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{currentUser?.email}</div>
                </div>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-14 right-14 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="mt-3 space-y-1">
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      {notificationsOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)}></div>
      )}
    </header>
  );
};

export default Header;