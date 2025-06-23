import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          
          {/* Left Side - Copyright */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-semibold">DevPlay</span>
            </div>
            <div className="text-slate-400 text-sm">
              © {currentYear} All rights reserved.
            </div>
          </motion.div>

          {/* Center - Quick Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex items-center space-x-6"
          >
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05, color: "#6366f1" }}
              className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 text-sm font-medium"
            >
              About
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05, color: "#6366f1" }}
              className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 text-sm font-medium"
            >
              Contact
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom Border Animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-6 pt-6 border-t border-slate-700"
        >
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-slate-400 text-xs"
            >
              Made with ❤️ for developers, by developers
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;