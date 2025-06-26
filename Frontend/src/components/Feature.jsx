import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Code, Edit3, Eye, Save, Sparkles, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Explore Components Sidebar",
      description: "Browse our library of pre-built UI components organized by category for fast access.",
      icon: <FolderOpen className="w-10 h-10 text-sky-500" />,
      color: "from-sky-100 to-blue-100",
      steps: [
        "Click the sidebar toggle on the top left.",
        "Navigate through categorized UI components."
      ]
    },
    {
      id: 2,
      title: "Edit Code with Monaco",
      description: "Use our modern editor for syntax highlighting, suggestions, and instant feedback.",
      icon: <Code className="w-10 h-10 text-green-500" />,
      color: "from-green-100 to-emerald-100",
      steps: [
        "Pick any component design.",
        "Edit it live with smart assistance."
      ]
    },
    {
      id: 3,
      title: "Live Preview",
      description: "Watch your changes reflected live as you type. No need to reload.",
      icon: <Eye className="w-10 h-10 text-purple-500" />,
      color: "from-purple-100 to-violet-100",
      steps: [
        "Type or paste your code.",
        "Hit 'Run' to preview updates."
      ]
    },
    {
      id: 4,
      title: "Save with JWT Authentication",
      description: "Save your code snippets securely. Retrieve them anytime after login.",
      icon: <Save className="w-10 h-10 text-orange-500" />,
      color: "from-orange-100 to-yellow-100",
      steps: [
        "Sign in to your account.",
        "Click 'Save' to store your code."
      ]
    },
    {
      id: 5,
      title: "Access Saved Codes",
      description: "Quickly access, copy or manage your saved snippets from the dashboard.",
      icon: <Edit3 className="w-10 h-10 text-indigo-500" />,
      color: "from-indigo-100 to-blue-100",
      steps: [
        "Go to Saved Codes section.",
        "Manage or reuse your stored snippets."
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeWalkthrough = () => setIsVisible(false);
  const goHome = () => navigate("/");

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md text-center relative"
        >
          <button onClick={goHome} className="absolute top-4 right-4 hover:bg-gray-100 p-1.5 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div className="w-12 h-12 bg-green-100 text-green-600 mx-auto rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Walkthrough Complete</h2>
          <p className="text-sm text-gray-500 mb-6">You're ready to build with DevPlay!</p>
          <button
            onClick={() => setIsVisible(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Restart Tour
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Feature Walkthrough</h2>
              <p className="text-sm text-gray-500">Explore tools and features tailored for you</p>
            </div>
            <button onClick={closeWalkthrough} className="p-2 rounded-full hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {currentStep + 1} of {features.length}</span>
            <span>{Math.round(((currentStep + 1) / features.length) * 100)}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-2 bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / features.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={features[currentStep].id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-xl mb-6 bg-gradient-to-br ${features[currentStep].color} flex items-center justify-center`}>
                {features[currentStep].icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{features[currentStep].title}</h3>
              <p className="text-sm text-gray-600 mb-6">{features[currentStep].description}</p>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-left max-w-md mx-auto">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">How to use:</h4>
                <ul className="space-y-3">
                  {features[currentStep].steps.map((step, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <span className="w-5 h-5 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-700">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              currentStep === 0
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-white hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                } transition`}
              />
            ))}
          </div>

          <button
            onClick={currentStep === features.length - 1 ? closeWalkthrough : nextStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition text-white ${
              currentStep === features.length - 1
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {currentStep === features.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureWalkthrough;
