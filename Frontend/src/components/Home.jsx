import { motion } from 'framer-motion';
import Feature from './Feature';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: "🧩",
      title: "Components",
      description: "Ready-to-use React components including Navbar, Buttons, Cards, and Forms. All professionally designed and fully responsive.",
      items: ["Navbar", "Buttons", "Cards", "Forms"]
    },
    {
      icon: "✨",
      title: "Animations",
      description: "Smooth and engaging animations using Framer Motion. From subtle transitions to eye-catching effects.",
      items: ["Slide Effects", "Flip Effects", "Fade Transitions"]
    },
    {
      icon: "📐",
      title: "Layouts",
      description: "Modern layout systems and responsive design patterns. Master CSS Grid, Flexbox, and responsive techniques.",
      items: ["Grid Systems", "Flexbox", "Responsive Design"]
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
        className="py-20 px-4 sm:px-6 lg:px-8"
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
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What You'll Find Here
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our comprehensive collection of development resources,
              each category carefully crafted to enhance your projects.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -10px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-indigo-200 transition-all duration-300"
              >
                <div className="text-5xl mb-6 text-center">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-6 text-center leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <motion.div
                      key={item}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: itemIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
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
            Join thousands of developers who trust CodeHub for their React development needs.
            Start exploring our components and take your projects to the next level.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200"
            >
              Browse Components
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Save Your First Code
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;