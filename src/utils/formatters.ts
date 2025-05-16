import { format, formatDistance } from 'date-fns';
import { ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../types';

// Format date to readable format
export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

// Format date and time to readable format
export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};

// Get relative time (e.g., "2 hours ago", "yesterday")
export const getRelativeTime = (dateString: string): string => {
  return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
};

// Get color for complaint status
export const getStatusColor = (status: ComplaintStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-500';
    case 'in-review':
      return 'bg-blue-500';
    case 'in-progress':
      return 'bg-violet-500';
    case 'resolved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Get text color for complaint status
export const getStatusTextColor = (status: ComplaintStatus): string => {
  switch (status) {
    case 'pending':
      return 'text-amber-600';
    case 'in-review':
      return 'text-blue-600';
    case 'in-progress':
      return 'text-violet-600';
    case 'resolved':
      return 'text-green-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Get border color for complaint status
export const getStatusBorderColor = (status: ComplaintStatus): string => {
  switch (status) {
    case 'pending':
      return 'border-amber-500';
    case 'in-review':
      return 'border-blue-500';
    case 'in-progress':
      return 'border-violet-500';
    case 'resolved':
      return 'border-green-500';
    case 'rejected':
      return 'border-red-500';
    default:
      return 'border-gray-500';
  }
};

// Format complaint status for display
export const formatStatus = (status: ComplaintStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in-review':
      return 'In Review';
    case 'in-progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

// Get color for complaint priority
export const getPriorityColor = (priority: ComplaintPriority): string => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format complaint priority for display
export const formatPriority = (priority: ComplaintPriority): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

// Format complaint category for display
export const formatCategory = (category: ComplaintCategory): string => {
  switch (category) {
    case 'water':
      return 'Water';
    case 'electricity':
      return 'Electricity';
    case 'roads':
      return 'Roads';
    case 'sanitation':
      return 'Sanitation';
    case 'public-safety':
      return 'Public Safety';
    case 'other':
      return 'Other';
    default:
      return 'Unknown';
  }
};

// Get icon name for complaint category
export const getCategoryIcon = (category: ComplaintCategory): string => {
  switch (category) {
    case 'water':
      return 'droplet';
    case 'electricity':
      return 'zap';
    case 'roads':
      return 'road';
    case 'sanitation':
      return 'trash-2';
    case 'public-safety':
      return 'shield';
    case 'other':
      return 'help-circle';
    default:
      return 'file';
  }
};