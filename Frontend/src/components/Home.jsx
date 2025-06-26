import { motion } from 'framer-motion';
import { Layers, Sparkles, LayoutDashboard } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const features = [
  {
    icon: <Layers className="w-10 h-10 text-blue-500" />,
    title: "Components",
    description: "Easily browse and customize pre-designed UI components with live code editing and preview."
  },
  {
    icon: <Sparkles className="w-10 h-10 text-pink-500" />,
    title: "Animations",
    description: "Enhance interactivity with smooth animations powered by Framer Motion, customizable in real-time."
  },
  {
    icon: <LayoutDashboard className="w-10 h-10 text-indigo-500" />,
    title: "Layouts",
    description: "Experiment with modern layouts built with CSS Grid and Flexbox, fully responsive and editable."
  }
];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-10 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">💻</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-6"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              DevPlay
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Your ultimate destination for high-quality React components, stunning animations,
            and modern layout solutions. Build beautiful web applications faster with our
            curated collection of code snippets and components.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => {
                window.dispatchEvent(new Event('openSidebar'));
              }}
            >
              Explore Components
            </motion.button>

             <motion.button
      whileHover={{
        scale: 1.05,
        backgroundColor: "#f1f5f9"
      }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-indigo-400 transition-all duration-200"
      onClick={() => navigate('/features')}
    >
      View Usage Guide
    </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
>
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <motion.div variants={itemVariants} className="text-center mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
        Discover What DevPlay Offers
      </h2>
      <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        A focused space to explore, experiment, and save your front-end components. Built for developers who value speed, clarity, and structure.
      </p>
    </motion.div>

    {/* Features Grid */}
   <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
  {features.map((feature, index) => (
    <motion.div
      key={feature.title}
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300"
    >
      <h3 className="text-base md:text-lg font-medium text-slate-900 mb-2 tracking-tight">
        {feature.title}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  ))}
</div>

  </div>
</motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-600"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-6"
          >
            Ready to Start Building?
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-blue-100 mb-8 leading-relaxed"
          >
          Join developers and designers who use DevPlay to explore, customize, and save beautiful UI snippets. Start building faster with live code editing and instant previews tailored to your projects.


          </motion.p>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;