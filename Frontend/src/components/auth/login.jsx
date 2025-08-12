import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '../ToastProvider';

const Login = () => {
  const {showToast} = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch( `${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setErrors({ general: errData.message || 'Login failed' });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id);

      setIsLoading(false);
      window.location.href = "/";

    } catch (error) {
      setErrors({ general: 'Something went wrong. Try again.' });
      setIsLoading(false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value.trim() === '') return;

    let newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        }
        break;
    }

    setErrors(newErrors);
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

          <h2 className="text-3xl font-bold text-white mb-2 my-4">
            Welcome Back
          </h2>
          <p className="text-rose-300 text-m">
            Sign in to your DevPlay account
          </p>
        </motion.div>

        {/* Form - AI Header Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-neutral-700 to-neutral-800 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-neutral-600"
        >
           <form onSubmit={handleSubmit} noValidate>
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
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 ${errors.email ? 'border-rose-500' : 'border-white/30'
                  }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-rose-300 flex items-center"
                >
                  <span className="mr-2"></span>
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 ${errors.password ? 'border-rose-500' : 'border-white/30'
                  }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-rose-300 flex items-center"
                >
                  <span className="mr-2"></span>
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between my-6">
              <div className="flex items-center">
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-white/40 rounded bg-white/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>

              <motion.a
                href="/forgot-password"
                whileHover={{ scale: 1.05 }}
                className="text-sm text-rose-400 hover:text-rose-300 transition-colors duration-200"
              >
                Forgot password?
              </motion.a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(244, 63, 94, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold bg-gradient-to-r from-rose-500 to-rose-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span className="mr-2"></span>
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Signup Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-white">
              Don't have an account?{' '}
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                className="font-medium text-rose-400 hover:text-rose-300 transition-colors duration-200"
              >
                Sign up here
              </motion.a>
            </p>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
