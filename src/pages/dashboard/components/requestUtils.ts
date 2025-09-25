// Utility function to convert time slot to hour
export const getTimeSlotHour = (timeSlot: string): string => {
  switch (timeSlot) {
    case 'morning':
      return '09';
    case 'afternoon':
      return '14';
    case 'evening':
      return '17';
    default:
      return '09';
  }
};

// Format date for display
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time for display
export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get relative time
export const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 0) {
    return `${Math.abs(diffInHours)} hours ago`;
  } else if (diffInHours < 24) {
    return `In ${diffInHours} hours`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `In ${diffInDays} days`;
  }
};
