// Simple test file to verify email service functionality
import { sendWelcomeEmail, sendPasswordResetEmail, sendAdminWelcomeEmail } from './emailService.js';

// Test data
const testUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890'
};

const testAdminData = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  department: 'IT',
  employeeId: 'EMP001'
};

// Test functions
export const testEmailService = async () => {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test welcome email
    console.log('Testing welcome email...');
    const welcomeResult = await sendWelcomeEmail(testUserData);
    console.log('Welcome email result:', welcomeResult);
    
    // Test password reset email
    console.log('Testing password reset email...');
    const resetResult = await sendPasswordResetEmail(
      'user@example.com', 
      'https://example.com/reset?token=abc123'
    );
    console.log('Password reset email result:', resetResult);
    
    // Test admin welcome email
    console.log('Testing admin welcome email...');
    const adminResult = await sendAdminWelcomeEmail(testAdminData);
    console.log('Admin welcome email result:', adminResult);
    
    console.log('✅ All email tests completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    return false;
  }
};

// Test error handling
export const testEmailServiceErrors = async () => {
  console.log('🧪 Testing Email Service Error Handling...');
  
  try {
    // Test with missing data
    const result1 = await sendWelcomeEmail(null);
    console.log('Missing data test:', result1);
    
    // Test with incomplete data
    const result2 = await sendWelcomeEmail({ firstName: 'John' }); // missing email
    console.log('Incomplete data test:', result2);
    
    console.log('✅ Error handling tests completed!');
    return true;
  } catch (error) {
    console.error('❌ Error handling test failed:', error);
    return false;
  }
};

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call these functions from console
  window.testEmailService = testEmailService;
  window.testEmailServiceErrors = testEmailServiceErrors;
}
