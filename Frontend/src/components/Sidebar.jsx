import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Bookmark, Menu, ChevronRight } from 'lucide-react';

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
    open: { x: 0, width: "260px", transition: { type: "spring", stiffness: 400, damping: 30 } },
    closed: { x: -280, width: "0px", transition: { type: "spring", stiffness: 400, damping: 30 } }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, x: -20 }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const openSidebar = () => setIsOpen(true);
    window.addEventListener('openSidebar', openSidebar);
    return () => window.removeEventListener('openSidebar', openSidebar);
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-100 border-r border-slate-200 shadow-lg z-40 overflow-y-auto scrollbar-hide"
      >
        <div className="flex flex-col h-full px-5 py-6 space-y-6">
          {/* Saved Codes */}
          <motion.a
            href="/saved-codes"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-md border border-indigo-200 shadow-sm hover:bg-indigo-200 transition"
          >
            <Bookmark className="w-4 h-4" />
            Saved Codes
          </motion.a>

          {/* Navigation Links */}
          {sidebarData.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              variants={itemVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-3"
            >
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide px-1">
                {section.category}
              </h3>
              <div className="space-y-1">
                {section.subcategories.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.component}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-2 h-0.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-600 transition" />
                    {item.name}
                    <ChevronRight className="ml-auto w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-opacity opacity-0 group-hover:opacity-100" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Overlay (for mobile) */}
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
