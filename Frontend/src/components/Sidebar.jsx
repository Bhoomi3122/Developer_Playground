import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import SavedCodes from './SavedCodes';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.location.pathname === "/");
  const sidebarRef = useRef();

  const sidebarData = [
    {
      category: "Components",
      subcategories: [
        { name: "Navbar", component: "/navbar-codes" },
        { name: "Buttons", component: "/button-codes" },
        { name: "Cards", component: "/card-codes" },
        { name: "Forms", component: "/form-codes" },
        { name: "Modals", component: "/modal-codes" }
      ]
    },
    {
      category: "Animations",
      subcategories: [
        { name: "Books Effects", component: "/book-codes" },
        { name: "Flip Effects", component: "/flip-codes" },
        { name: "Fade Transitions", component: "/fade-transitions" }
      ]
    },
    {
      category: "Layouts",
      subcategories: [
        { name: "Grid Systems", component: "/grid-systems" },
        { name: "Flexbox", component: "/flexbox" },
        { name: "Responsive", component: "/responsive" }
      ]
    }
  ];

  const sidebarVariants = {
    open: { x: 0, width: "280px", transition: { damping: 40, stiffness: 400 } },
    closed: { x: -280, width: "0px", transition: { damping: 40, stiffness: 400 } }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, x: -20 }
  };

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed left-0 top-16 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 shadow-lg z-40 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Saved Codes Link */}
          <motion.div variants={itemVariants} className="p-4 border-b border-slate-200">
            <motion.a
              href="/saved-codes"
              whileHover={{ scale: 1, backgroundColor: "#f8fafc" }}
              className="flex items-center justify-center w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-sm text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved Codes
            </motion.a>
          </motion.div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {sidebarData.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                variants={itemVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                transition={{ delay: sectionIndex * 0.1 }}
                className="mb-6"
              >
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                  {section.category}
                </h3>

                <div>
                  {section.subcategories.map((item) => (
                    <motion.a
                      key={item.name}
                      href={item.component}
                      whileHover={{ scale: 1, x: 3, backgroundColor: "#f1f5f9", transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center w-full p-0.5 text-slate-700 hover:text-indigo-600 rounded-lg transition-all duration-200 group"
                    >
                      <div className="w-2 h-0.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-600 transition-colors duration-200"></div>
                      <span className="font-medium">{item.name}</span>
                      <motion.svg
                        className="w-4 h-2 ml-auto opacity-0 group-hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ x: 2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
