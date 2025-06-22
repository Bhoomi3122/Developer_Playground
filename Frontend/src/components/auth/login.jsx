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

    // Optional: add your own validation here, set errors if invalid

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
        // You can customize error handling here based on response status
        const errData = await response.json();
        setErrors({ general: errData.message || 'Login failed' });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      // data: { token, user: { id, fullName, email } }

      // Save token and user id to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id);

      setIsLoading(false);
      // Redirect to home page
      window.location.href = "/";

    } catch (error) {
      setErrors({ general: 'Something went wrong. Try again.' });
      setIsLoading(false);
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

  const floatingElements = [
    { icon: '💻', delay: 0, duration: 6, x: 8, y: 15 },
    { icon: '⚡', delay: 1.5, duration: 8, x: 85, y: 20 },
    { icon: '🚀', delay: 2, duration: 7, x: 12, y: 75 },
    { icon: '🔧', delay: 3.5, duration: 9, x: 88, y: 65 },
    { icon: '⭐', delay: 4, duration: 5, x: 6, y: 50 },
    { icon: '🎯', delay: 2.5, duration: 6.5, x: 92, y: 35 },
    { icon: '🔥', delay: 1, duration: 7.5, x: 15, y: 30 },
    { icon: '💡', delay: 0.5, duration: 6, x: 80, y: 80 },
    { icon: '⚙️', delay: 3, duration: 8.5, x: 5, y: 25 },
    { icon: '🎨', delay: 4.5, duration: 5.5, x: 90, y: 50 }
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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-10 blur-3xl"></div>

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

          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2 my-4">
            Welcome Back
          </h2>
          <p className="text-slate-600 text-m">
            Sign in to your CodeHub account
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
        >
           <form onSubmit={handleSubmit} noValidate>
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
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.email ? 'border-red-400' : 'border-slate-300'
                  }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <span className="mr-2"></span>
                  {errors.email}
                </motion.p>
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.password ? 'border-red-400' : 'border-slate-300'
                  }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <span className="mr-2"></span>
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between my-4">
              <div className="flex items-center">
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <motion.a
                href="/forgot-password"
                whileHover={{ scale: 1.05 }}
                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Forgot password?
              </motion.a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70"
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
            <p className="text-slate-600">
              Don't have an account?{' '}
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign up here
              </motion.a>
            </p>
          </motion.div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white/70 text-sm font-medium text-slate-700 hover:bg-white/90 transition-all duration-200"
              >
                <span className="mr-2">🐙</span>
                GitHub
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white/70 text-sm font-medium text-slate-700 hover:bg-white/90 transition-all duration-200"
              >
                <span className="mr-2">🔗</span>
                Google
              </motion.button>
            </div>
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