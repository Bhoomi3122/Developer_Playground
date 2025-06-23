import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuth(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsAuth(false);
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-7xl mx-4">
          <div className="flex justify-between items-center h-16">
            {/* Website Name */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <a href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                DevPlay
              </a>
            </motion.div>

            {/* Auth Buttons */}
            {!isAuth ? (
              <div className="flex items-center space-x-5">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#e2e8f0' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 py-2 text-slate-700  hover:text-indigo-600 font-medium rounded-lg transition-colors duration-200"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            ) : (
              <motion.button
                onClick={() => setShowModal(true)}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="ml-48 px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[9999] 
                         bg-gradient-to-r from-indigo-600 to-blue-600 
                         text-white font-medium rounded-lg shadow-md 
                         px-6 py-4 w-full max-w-md text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base mb-4">Are you sure you want to logout?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowModal(false);
                  }}
                  className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-transparent border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-indigo-600 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
