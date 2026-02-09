// Session Manager - Handles automatic logout after 2 hours of inactivity
// This improves security by ensuring users must re-login after being inactive

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
let timeoutId = null;
let lastActivityTime = Date.now();

// Events that count as user activity
const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

// Clear the session (logout)
const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to homepage instead of login
  window.location.href = '/';
};

// Reset the inactivity timer
const resetTimer = () => {
  lastActivityTime = Date.now();
  
  // Clear existing timeout
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  // Set new timeout
  timeoutId = setTimeout(() => {
    const inactiveTime = Date.now() - lastActivityTime;
    
    if (inactiveTime >= SESSION_TIMEOUT) {
      console.log('Session expired due to inactivity');
      clearSession();
    }
  }, SESSION_TIMEOUT);
};

// Initialize session manager
export const initSessionManager = () => {
  // Only run if user is logged in
  const token = localStorage.getItem('token');
  if (!token) return;

  // Set up activity listeners
  activityEvents.forEach(event => {
    window.addEventListener(event, resetTimer, true);
  });

  // Start the timer
  resetTimer();

  // Check session validity on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
      }
    }
  });
};

// Clean up session manager
export const cleanupSessionManager = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  activityEvents.forEach(event => {
    window.removeEventListener(event, resetTimer, true);
  });
};

// Manually clear session (for logout button)
export const logout = () => {
  cleanupSessionManager();
  clearSession();
};

export default {
  initSessionManager,
  cleanupSessionManager,
  logout
};
