import { motion } from 'framer-motion';
import { Layers, Sparkles, LayoutDashboard ,Code, TerminalSquare} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Layers className="w-10 h-10 text-amber-600" />,
      title: "Components",
      description: "Easily browse and customize pre-designed UI components with live code editing and preview."
    },
    {
      icon: <Sparkles className="w-10 h-10 text-rose-500" />,
      title: "Animations",
      description: "Enhance interactivity with smooth animations powered by Framer Motion, customizable in real-time."
    },
    {
      icon: <LayoutDashboard className="w-10 h-10 text-stone-600" />,
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
    <div className=" min-h-screen bg-gradient-to-br from-neutral-950 to-stone-950 pt-10 ">
  {/* Hero Section */}
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="py-10 mb-10 px-4 sm:px-6 lg:px-8"
  >
    <div className="w-full text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-800 rounded-3xl mb-6 shadow-lg shadow-black/30">
          <Code className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-2xl md:text-3xl font-bold text-white mb-6"
      >
        Welcome to{' '}
        <span className="bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
          DevPlay
        </span>
      </motion.h3>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed"
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
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(244, 63, 94, 0.25)",
          }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-4 bg-rose-600 text-white font-medium rounded-2xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 hover:cursor-pointer transition-all duration-300"
          onClick={() => {
            window.dispatchEvent(new Event('openSidebar'));
          }}
        >
          Explore Components
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.02,
            backgroundColor: "#1e1e1e",
            borderColor: "#444"
          }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-4 border border-neutral-600 hover:cursor-pointer bg-neutral-800 text-neutral-100 rounded-2xl shadow-sm hover:border-neutral-500 transition duration-300"
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
    className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900 border-y border-neutral-800"
  >
    <div className="w-full">
      <motion.div variants={itemVariants} className="text-center mb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
          Discover What DevPlay Offers
        </h2>
        <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          A focused space to explore, experiment, and save your front-end components. Built for developers who value speed, clarity, and structure.
        </p>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group rounded-3xl border border-neutral-800 bg-neutral-800 p-8 shadow-sm hover:shadow-lg hover:border-neutral-700 transition-all duration-500 ease-out"
          >
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-base md:text-lg font-semibold text-white mb-3 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
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
    className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-neutral-950 to-stone-900"
  >
    <div className="w-full text-center">
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-white mb-6"
      >
        Ready to Start Building?
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-lg text-neutral-400 mb-8 leading-relaxed"
      >
        Join developers and designers who use DevPlay to explore, customize, and save beautiful UI snippets. Start building faster with live code editing and instant previews tailored to your projects.
      </motion.p>
    </div>
  </motion.section>
</div>

  );
};

export default Home;