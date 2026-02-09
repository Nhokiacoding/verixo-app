import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '../icons/SimpleIcons';
import apiService from '../../utils/api';

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters`;
    if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} should only contain letters`;
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      let error = '';
      switch (name) {
        case 'firstName':
          error = validateName(value, 'First name');
          break;
        case 'lastName':
          error = validateName(value, 'Last name');
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          // Also revalidate confirm password if it exists
          if (formData.confirmPassword) {
            const confirmError = validateConfirmPassword(formData.confirmPassword, value);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
          }
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(value, formData.password);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
      }
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let error = '';
    switch (name) {
      case 'firstName':
        error = validateName(value, 'First name');
        break;
      case 'lastName':
        error = validateName(value, 'Last name');
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      firstName: validateName(formData.firstName, 'First name'),
      lastName: validateName(formData.lastName, 'Last name'),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      phone: validatePhone(formData.phone)
    };
    
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true
    });

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (!hasErrors) {
      setIsLoading(true);
      try {
        // Prepare data for API call (exclude confirmPassword)
        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        };

        const response = await apiService.register(registrationData);
        console.log('Registration successful:', response);
        
        setIsSuccess(true);
      } catch (error) {
        console.error('Registration failed:', error);
        setErrors({
          email: error.message || 'Registration failed. Please try again.',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
          phone: ''
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderField = (name, label, type = 'text', placeholder) => {
    const isPasswordField = name === 'password' || name === 'confirmPassword';
    const showPasswordState = name === 'password' ? showPassword : showConfirmPassword;
    const setShowPasswordState = name === 'password' ? setShowPassword : setShowConfirmPassword;
    
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className={isPasswordField ? 'relative' : ''}>
          <input
            id={name}
            name={name}
            type={isPasswordField ? (showPasswordState ? 'text' : 'password') : type}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 ${isPasswordField ? 'pr-12' : ''} border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
              errors[name] && touched[name]
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : formData[name] && !errors[name] && touched[name]
                ? 'border-green-500 focus:ring-green-500 bg-green-50'
                : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
            }`}
            placeholder={placeholder}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPasswordState(!showPasswordState)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPasswordState ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {errors[name] && touched[name] && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">✕</span> {errors[name]}
          </p>
        )}
        {!errors[name] && touched[name] && formData[name] && (
          <p className="mt-2 text-sm text-green-600 flex items-center">
            <span className="mr-1">✓</span> Valid {label.toLowerCase()}
          </p>
        )}
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center animate-bounce-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/images/logo.svg" 
              alt="Verixo Logo" 
              className="h-12 sm:h-16 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="text-4xl font-bold text-primary-600" style={{display: 'none'}}>
              Verixo
            </div>
          </div>

          <div className="text-green-600 text-5xl sm:text-6xl mb-6">✓</div>
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-800 mb-4">Account Created Successfully!</h2>
          <p className="text-secondary-600 mb-6 text-sm sm:text-base">
            Welcome to VirtNum! We've sent a welcome email to <strong>{formData.email}</strong>
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verixo
            </span>
          </Link>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Join Verixo Marketplace today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderField('firstName', 'First Name', 'text', 'John')}
            {renderField('lastName', 'Last Name', 'text', 'Doe')}
          </div>

          {/* Email Field */}
          {renderField('email', 'Email Address', 'email', 'john@example.com')}

          {/* Phone Field */}
          {renderField('phone', 'Phone Number', 'tel', '+234 800 000 0000')}

          {/* Password Fields */}
          {renderField('password', 'Password', 'password', 'Enter your password')}
          {renderField('confirmPassword', 'Confirm Password', 'password', 'Confirm your password')}

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              disabled={isLoading}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-secondary-700">
              I agree to the{' '}
              <button onClick={() => navigate('/terms')} className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                Terms and Conditions
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="spinner mr-2"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
