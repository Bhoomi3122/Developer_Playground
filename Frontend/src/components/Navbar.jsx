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
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-neutral-800 border-b border-neutral-700 shadow-md"
      >
        <div className="max-w-7xl mx-4">
          <div className="flex justify-between items-center h-16">
            {/* Website Name */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <a
                href="/"
                className="text-2xl font-semibold bg-gradient-to-r from-stone-200 to-neutral-300 bg-clip-text text-transparent"
              >
                DevPlay
              </a>
            </motion.div>

            {/* Auth Buttons */}
            {!isAuth ? (
              <div className="flex items-center space-x-5">
                <Link to="/login">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: '#353535ff',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 bg-#353535ff py-2 text-neutral-300 hover:text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            ) : (
               <div className="flex space-x-5">
              <Link to="/contribute">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rose-600',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 bg-rose-500 hover:cursor-pointer py-2 text-white hover:text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Contribute
                  </motion.button>
                </Link>
              <motion.button
                onClick={() => setShowModal(true)}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className=" px-6 py-2  bg-neutral-700 text-white hover:cursor-pointer font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Logout
              </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-neutral-900 bg-opacity-60 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[9999] 
                         bg-neutral-800 text-white font-medium rounded-lg 
                         shadow-lg px-6 py-4 w-full max-w-md text-center border border-neutral-700"
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
                  className="bg-white text-stone-800 font-semibold px-4 py-2 rounded hover:bg-neutral-100 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-stone-800 transition"
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
