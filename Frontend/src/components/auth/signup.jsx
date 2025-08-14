import { motion } from 'framer-motion'; 
import { useState } from 'react';
import { useToast } from '../ToastProvider';

const Signup = () => {
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
        } else {
          newErrors.email = '';
        }
        break;
      case 'password':
        if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
        } else {
          newErrors.password = '';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
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

      return;
    }

    if (!validateEmail(formData.email)) {
      const msg = 'Please enter a valid email address';
      setErrors(prev => ({ ...prev, email: msg }));

      return;
    }

    if (formData.password.length < 8) {
      const msg = 'Password must be at least 8 characters long';
      setErrors(prev => ({ ...prev, password: msg }));
 
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
  
        setErrors(prev => ({ ...prev, general: errorMessage }));
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      // backend returns: { userId, fullName, email, token }

      // Save token and userId to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id);


      // Redirect to homepage
      window.location.href = '/';

    } catch (error) {

      setErrors(prev => ({ ...prev, general: error.message || 'Something went wrong' }));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
     

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-neutral-600 to-neutral-700 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-rose-400 to-rose-500 rounded-full opacity-10 blur-3xl"></div>

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
              text-rose-400 hover:text-rose-300
              font-semibold text-md
              underline decoration-rose-400 decoration-2
              hover:decoration-rose-300
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

          <h2 className="text-3xl font-bold text-white mb-2 mt-4">
            Join DevPlay
          </h2>
          <p className="text-rose-300 text-m">
            Start your coding journey with us
          </p>
        </motion.div>

        {/* Form - AI Header Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-neutral-700 to-neutral-800 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-neutral-600"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
                <p className="mt-1 text-md font-semibold bg-neutral-700 text-center text-rose-300">{errors.general}</p>
              )}
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
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
                className="w-full px-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60
                  ${errors.email ? 'border-rose-500' : 'border-white/30'}
                `}
                placeholder="Enter your email"
              />
              
            </div>
            {formData.email && errors.email && (
  <p className="mt-1 text-sm text-rose-300">{errors.email}</p>
)}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60
                  ${errors.password ? 'border-rose-500' : 'border-white/30'}
                `}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-rose-300">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60
                  ${errors.confirmPassword ? 'border-rose-500' : 'border-white/30'}
                `}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-300">{errors.confirmPassword}</p>
              )}
            </div>


            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(244, 63, 94, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}
              `}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-white">
              Already have an account?{' '}
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                className="font-medium text-rose-400 hover:text-rose-300 transition-colors duration-200"
              >
                Login here
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
