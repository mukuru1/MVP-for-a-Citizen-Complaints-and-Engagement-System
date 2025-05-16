import { v4 as uuidv4 } from 'uuid';
import { AppState, User, Complaint, Response, Notification } from '../types';

const LOCAL_STORAGE_KEY = 'citizenEngagementSystem';

// Initial data setup
const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    const initialState: AppState = {
      users: [
        {
          id: '1',
          name: 'John Citizen',
          email: 'citizen@example.com',
          role: 'citizen',
        },
        {
          id: '2',
          name: 'Admin User',
          email: 'admin@gov.example',
          role: 'admin',
        },
        {
          id: '3',
          name: 'Water Department',
          email: 'water@gov.example',
          role: 'agency',
          department: 'water',
        },
        {
          id: '4',
          name: 'Roads Department',
          email: 'roads@gov.example',
          role: 'agency',
          department: 'roads',
        },
      ],
      complaints: [
        {
          id: '1',
          title: 'Pothole on Main Street',
          description: 'Large pothole causing traffic hazards near the intersection of Main and 1st Ave.',
          category: 'roads',
          location: 'Main Street & 1st Avenue',
          status: 'in-progress',
          priority: 'high',
          submittedBy: '1',
          submittedAt: '2025-04-01T10:30:00Z',
          assignedTo: '4',
          responses: [
            {
              id: '1',
              complaintId: '1',
              text: 'We have dispatched a team to assess the damage. Repairs will be scheduled within 48 hours.',
              respondedBy: '4',
              respondedAt: '2025-04-02T09:15:00Z',
            },
          ],
        },
        {
          id: '2',
          title: 'Water outage in Riverside neighborhood',
          description: 'No water supply since yesterday evening in the entire Riverside area.',
          category: 'water',
          location: 'Riverside neighborhood',
          status: 'resolved',
          priority: 'high',
          submittedBy: '1',
          submittedAt: '2025-04-02T18:45:00Z',
          assignedTo: '3',
          responses: [
            {
              id: '2',
              complaintId: '2',
              text: 'A main water pipe burst has been identified. Emergency repair crews are on site.',
              respondedBy: '3',
              respondedAt: '2025-04-02T20:30:00Z',
            },
            {
              id: '3',
              complaintId: '2',
              text: 'Repairs have been completed and water service has been restored to all affected areas.',
              respondedBy: '3',
              respondedAt: '2025-04-03T08:45:00Z',
            },
          ],
        },
      ],
      notifications: [
        {
          id: '1',
          userId: '1',
          message: 'Your complaint about the pothole has been updated with a new response.',
          read: false,
          createdAt: '2025-04-02T09:15:00Z',
          relatedTo: {
            type: 'complaint',
            id: '1',
          },
        },
        {
          id: '2',
          userId: '1',
          message: 'Your water outage complaint has been marked as resolved.',
          read: false,
          createdAt: '2025-04-03T08:45:00Z',
          relatedTo: {
            type: 'complaint',
            id: '2',
          },
        },
      ],
      isAuthenticated: false,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialState));
  }
};

// Retrieve the application state from local storage
const getAppState = (): AppState => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    initializeLocalStorage();
    return getAppState();
  }
  return JSON.parse(data);
};

// Save the application state to local storage
const saveAppState = (state: AppState): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

// User-related functions
const getUsers = (): User[] => {
  return getAppState().users;
};

const getUserById = (id: string): User | undefined => {
  return getUsers().find(user => user.id === id);
};

const authenticateUser = (email: string, role: string = 'citizen'): User | null => {
  const appState = getAppState();
  const user = appState.users.find(user => user.email === email && user.role === role);
  
  if (user) {
    const updatedState = {
      ...appState,
      currentUser: user,
      isAuthenticated: true
    };
    saveAppState(updatedState);
    return user;
  }
  
  return null;
};

const logoutUser = (): void => {
  const appState = getAppState();
  const updatedState = {
    ...appState,
    currentUser: null,
    isAuthenticated: false
  };
  saveAppState(updatedState);
};

// Complaint-related functions
const getComplaints = (): Complaint[] => {
  return getAppState().complaints;
};

const getComplaintById = (id: string): Complaint | undefined => {
  return getComplaints().find(complaint => complaint.id === id);
};

const getComplaintsByUser = (userId: string): Complaint[] => {
  return getComplaints().filter(complaint => complaint.submittedBy === userId);
};

const getComplaintsByAgency = (agencyId: string): Complaint[] => {
  return getComplaints().filter(complaint => complaint.assignedTo === agencyId);
};

const addComplaint = (complaint: Omit<Complaint, 'id' | 'responses' | 'submittedAt' | 'status'>): Complaint => {
  const appState = getAppState();
  const newComplaint: Complaint = {
    ...complaint,
    id: uuidv4(),
    responses: [],
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  
  const updatedState = {
    ...appState,
    complaints: [...appState.complaints, newComplaint]
  };
  
  saveAppState(updatedState);
  return newComplaint;
};

const updateComplaintStatus = (id: string, status: ComplaintStatus): void => {
  const appState = getAppState();
  const updatedComplaints = appState.complaints.map(complaint => 
    complaint.id === id ? { ...complaint, status } : complaint
  );
  
  const updatedState = {
    ...appState,
    complaints: updatedComplaints
  };
  
  saveAppState(updatedState);
};

const assignComplaint = (id: string, agencyId: string): void => {
  const appState = getAppState();
  const updatedComplaints = appState.complaints.map(complaint => 
    complaint.id === id ? { ...complaint, assignedTo: agencyId, status: 'in-review' } : complaint
  );
  
  const updatedState = {
    ...appState,
    complaints: updatedComplaints
  };
  
  saveAppState(updatedState);
};

// Response-related functions
const addResponse = (complaintId: string, text: string, respondedBy: string): Response => {
  const appState = getAppState();
  const newResponse: Response = {
    id: uuidv4(),
    complaintId,
    text,
    respondedBy,
    respondedAt: new Date().toISOString(),
  };
  
  const updatedComplaints = appState.complaints.map(complaint => {
    if (complaint.id === complaintId) {
      return {
        ...complaint,
        responses: [...complaint.responses, newResponse]
      };
    }
    return complaint;
  });
  
  const updatedState = {
    ...appState,
    complaints: updatedComplaints
  };
  
  saveAppState(updatedState);
  
  // Add notification for the complaint owner
  const complaint = appState.complaints.find(c => c.id === complaintId);
  if (complaint) {
    addNotification(
      complaint.submittedBy,
      `Your complaint "${complaint.title}" has received a new response.`,
      { type: 'response', id: newResponse.id }
    );
  }
  
  return newResponse;
};

// Notification-related functions
const getNotifications = (userId: string): Notification[] => {
  const appState = getAppState();
  return appState.notifications.filter(notification => notification.userId === userId);
};

const addNotification = (
  userId: string, 
  message: string, 
  relatedTo?: { type: 'complaint' | 'response'; id: string }
): Notification => {
  const appState = getAppState();
  const newNotification: Notification = {
    id: uuidv4(),
    userId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    relatedTo,
  };
  
  const updatedState = {
    ...appState,
    notifications: [...appState.notifications, newNotification]
  };
  
  saveAppState(updatedState);
  return newNotification;
};

const markNotificationAsRead = (id: string): void => {
  const appState = getAppState();
  const updatedNotifications = appState.notifications.map(notification => 
    notification.id === id ? { ...notification, read: true } : notification
  );
  
  const updatedState = {
    ...appState,
    notifications: updatedNotifications
  };
  
  saveAppState(updatedState);
};

// Analytics functions
const getComplaintStatistics = () => {
  const complaints = getComplaints();
  
  return {
    total: complaints.length,
    byStatus: {
      pending: complaints.filter(c => c.status === 'pending').length,
      inReview: complaints.filter(c => c.status === 'in-review').length,
      inProgress: complaints.filter(c => c.status === 'in-progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      rejected: complaints.filter(c => c.status === 'rejected').length,
    },
    byCategory: {
      water: complaints.filter(c => c.category === 'water').length,
      electricity: complaints.filter(c => c.category === 'electricity').length,
      roads: complaints.filter(c => c.category === 'roads').length,
      sanitation: complaints.filter(c => c.category === 'sanitation').length,
      publicSafety: complaints.filter(c => c.category === 'public-safety').length,
      other: complaints.filter(c => c.category === 'other').length,
    },
    byPriority: {
      low: complaints.filter(c => c.priority === 'low').length,
      medium: complaints.filter(c => c.priority === 'medium').length,
      high: complaints.filter(c => c.priority === 'high').length,
      urgent: complaints.filter(c => c.priority === 'urgent').length,
    },
    averageResponseTime: calculateAverageResponseTime(complaints),
  };
};

const calculateAverageResponseTime = (complaints: Complaint[]) => {
  const complaintsWithResponses = complaints.filter(c => c.responses.length > 0);
  
  if (complaintsWithResponses.length === 0) {
    return 0;
  }
  
  const totalResponseTime = complaintsWithResponses.reduce((total, complaint) => {
    const submittedAt = new Date(complaint.submittedAt).getTime();
    const firstResponseAt = new Date(complaint.responses[0].respondedAt).getTime();
    return total + (firstResponseAt - submittedAt);
  }, 0);
  
  // Return average in hours
  return Math.round(totalResponseTime / complaintsWithResponses.length / (1000 * 60 * 60));
};

export {
  initializeLocalStorage,
  getAppState,
  saveAppState,
  getUsers,
  getUserById,
  authenticateUser,
  logoutUser,
  getComplaints,
  getComplaintById,
  getComplaintsByUser,
  getComplaintsByAgency,
  addComplaint,
  updateComplaintStatus,
  assignComplaint,
  addResponse,
  getNotifications,
  addNotification,
  markNotificationAsRead,
  getComplaintStatistics,
};