import { useState } from 'react';
import { navigateTo } from '../../utils/router';
import apiService from '../../utils/api';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = name === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });

    setTouched({
      email: true,
      password: true
    });

    if (!emailError && !passwordError) {
      setIsLoading(true);
      try {
        const response = await apiService.login(formData.email, formData.password);

        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Navigate to dashboard
        navigateTo('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        setErrors({
          email: error.message || 'Login failed. Please check your credentials.',
          password: ''
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
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

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-800">Welcome Back</h2>
          <p className="text-secondary-600 mt-2 text-sm sm:text-base">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                errors.email && touched.email
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : formData.email && !errors.email && touched.email
                  ? 'border-green-500 focus:ring-green-500 bg-green-50'
                  : 'border-gray-300 focus:ring-primary-500 hover:border-gray-400'
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && touched.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-up">
                <span className="mr-1">✕</span> {errors.email}
              </p>
            )}
            {!errors.email && touched.email && formData.email && (
              <p className="mt-2 text-sm text-green-600 flex items-center animate-slide-up">
                <span className="mr-1">✓</span> Valid email address
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                errors.password && touched.password
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : formData.password && !errors.password && touched.password
                  ? 'border-green-500 focus:ring-green-500 bg-green-50'
                  : 'border-gray-300 focus:ring-primary-500 hover:border-gray-400'
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && touched.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-up">
                <span className="mr-1">✕</span> {errors.password}
              </p>
            )}
            {!errors.password && touched.password && formData.password && (
              <p className="mt-2 text-sm text-green-600 flex items-center animate-slide-up">
                <span className="mr-1">✓</span> Valid password
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700">
                Remember me
              </label>
            </div>
            <button 
              onClick={() => navigateTo('/forgot-password')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              Forgot password?
            </button>
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-secondary-600">
          Don't have an account?{' '}
          <button onClick={() => navigateTo('/register')} className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
