import { motion } from 'framer-motion'; 
import { useState } from 'react';
import { useToast } from '../ToastProvider';
const Signup = () => {
  const {showToast} = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name] && value.trim() !== '') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value.trim() === '') return; // Don't validate empty fields

    let newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
          showToast('Please enter a valid email address');
        } else {
          newErrors.email = '';
        }
        break;
      case 'password':
        if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
          showToast('Password must be at least 8 characters long');
        } else {
          newErrors.password = '';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
          showToast('Passwords do not match');
        } else {
          newErrors.confirmPassword = '';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear all errors on submit start
    setErrors({});

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords don't match";
      setErrors(prev => ({ ...prev, confirmPassword: msg }));
      showToast(msg);
      return;
    }

    if (!validateEmail(formData.email)) {
      const msg = 'Please enter a valid email address';
      setErrors(prev => ({ ...prev, email: msg }));
      showToast(msg);
      return;
    }

    if (formData.password.length < 8) {
      const msg = 'Password must be at least 8 characters long';
      setErrors(prev => ({ ...prev, password: msg }));
      showToast(msg);
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Signup failed';
        showToast(errorMessage);
        setErrors(prev => ({ ...prev, general: errorMessage }));
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      // backend returns: { userId, fullName, email, token }

      // Save token and userId to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id);

      showToast('Signup successful! Redirecting...');

      // Redirect to homepage
      window.location.href = '/';

    } catch (error) {
      showToast(error.message || 'Something went wrong');
      setErrors(prev => ({ ...prev, general: error.message || 'Something went wrong' }));
    } finally {
      setIsLoading(false);
    }
  };

  const floatingElements = [
    { icon: '💻', delay: 0, duration: 6, x: 10, y: 20 },
    { icon: '⚡', delay: 1, duration: 8, x: 80, y: 15 },
    { icon: '🚀', delay: 2, duration: 7, x: 15, y: 70 },
    { icon: '🔧', delay: 3, duration: 9, x: 85, y: 60 },
    { icon: '⭐', delay: 4, duration: 5, x: 5, y: 45 },
    { icon: '🎯', delay: 2.5, duration: 6.5, x: 90, y: 30 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-20 pointer-events-none"
          style={{ left: `${element.x}%`, top: `${element.y}%` }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <a
            href="/"
            className="
              fixed top-4 left-4 flex items-center space-x-2
              text-indigo-600 hover:text-blue-600
              font-semibold text-md
              underline decoration-indigo-400 decoration-2
              hover:decoration-blue-500
              transition duration-300
            "
          >
            {/* Back arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>

            <span>Back to Home</span>
          </a>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2 mt-4">
            Join CodeHub
          </h2>
          <p className="text-slate-600 text-m">
            Start your coding journey with us
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm
                  ${errors.email ? 'border-red-500' : 'border-slate-300'}
                `}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm
                  ${errors.password ? 'border-red-500' : 'border-slate-300'}
                `}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm
                  ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}
                `}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <p className="mt-2 text-center text-red-600 font-semibold">{errors.general}</p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}
              `}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
