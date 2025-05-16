export type UserRole = 'citizen' | 'admin' | 'agency';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export type ComplaintStatus = 'pending' | 'in-review' | 'in-progress' | 'resolved' | 'rejected';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ComplaintCategory = 'water' | 'electricity' | 'roads' | 'sanitation' | 'public-safety' | 'other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submittedBy: string; // User ID
  submittedAt: string; // ISO string
  assignedTo?: string; // Agency ID
  responses: Response[];
  attachments?: string[]; // URLs to images or documents
}

export interface Response {
  id: string;
  complaintId: string;
  text: string;
  respondedBy: string; // User ID
  respondedAt: string; // ISO string
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
  relatedTo?: {
    type: 'complaint' | 'response';
    id: string;
  };
}

export interface AppState {
  users: User[];
  complaints: Complaint[];
  notifications: Notification[];
  currentUser?: User | null;
  isAuthenticated: boolean;
}