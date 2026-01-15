import { useState } from 'react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const validateAdminCode = (code) => {
    if (!code) return 'Admin code is required';
    if (code.length !== 6) return 'Admin code must be 6 characters';
    if (!/^[A-Z0-9]+$/.test(code)) return 'Admin code must contain only uppercase letters and numbers';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Auto-uppercase admin code
    if (name === 'adminCode') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));

    // Validate on change if field was touched
    if (touched[name]) {
      let error = '';
      switch (name) {
        case 'email':
          error = validateEmail(processedValue);
          break;
        case 'password':
          error = validatePassword(processedValue);
          break;
        case 'adminCode':
          error = validateAdminCode(processedValue);
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
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'adminCode':
        error = validateAdminCode(value);
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const adminCodeError = validateAdminCode(formData.adminCode);
    
    setErrors({
      email: emailError,
      password: passwordError,
      adminCode: adminCodeError
    });

    setTouched({
      email: true,
      password: true,
      adminCode: true
    });

    if (!emailError && !passwordError && !adminCodeError) {
      console.log('Admin login submitted:', formData);
      // Add your admin login API call here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-600 to-red-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/images/logo.svg" 
            alt="VirtNum Logo" 
            className="h-16 w-auto"
          />
        </div>

        <div className="text-center mb-8">
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
            🔐 ADMIN ACCESS
          </div>
          <h2 className="text-3xl font-bold text-secondary-800">Admin Login</h2>
          <p className="text-secondary-600 mt-2">Secure administrator access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
              Admin Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email && touched.email
                  ? 'border-red-500 focus:ring-red-500'
                  : formData.email && !errors.email && touched.email
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="Enter admin email"
            />
            {errors.email && touched.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="mr-1">✕</span> {errors.email}
              </p>
            )}
            {!errors.email && touched.email && formData.email && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <span className="mr-1">✓</span> Valid admin email
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.password && touched.password
                  ? 'border-red-500 focus:ring-red-500'
                  : formData.password && !errors.password && touched.password
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="Enter admin password"
            />
            {errors.password && touched.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="mr-1">✕</span> {errors.password}
              </p>
            )}
            {!errors.password && touched.password && formData.password && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <span className="mr-1">✓</span> Valid password
              </p>
            )}
          </div>

          {/* Admin Code Field */}
          <div>
            <label htmlFor="adminCode" className="block text-sm font-medium text-secondary-700 mb-2">
              Admin Access Code
            </label>
            <input
              id="adminCode"
              name="adminCode"
              type="text"
              value={formData.adminCode}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={6}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-mono text-center text-lg tracking-widest ${
                errors.adminCode && touched.adminCode
                  ? 'border-red-500 focus:ring-red-500'
                  : formData.adminCode && !errors.adminCode && touched.adminCode
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="ABC123"
            />
            {errors.adminCode && touched.adminCode && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="mr-1">✕</span> {errors.adminCode}
              </p>
            )}
            {!errors.adminCode && touched.adminCode && formData.adminCode && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <span className="mr-1">✓</span> Valid admin code
              </p>
            )}
            <p className="mt-1 text-xs text-secondary-500">
              6-character code provided by system administrator
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Access Admin Panel
          </button>
        </form>

        {/* Back to User Login */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm font-medium text-secondary-600 hover:text-secondary-700 flex items-center justify-center"
          >
            <span className="mr-2">←</span> Back to User Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
