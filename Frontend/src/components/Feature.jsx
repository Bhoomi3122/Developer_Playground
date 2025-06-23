import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Code, Edit3, Eye, Save, Sparkles, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // assuming you're using react-router-dom

const FeatureWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Explore Components Sidebar",
      description: "Browse through our extensive library of pre-built components. Easily find and select the components you need for your project with our intuitive sidebar navigation.",
      icon: <FolderOpen className="w-12 h-12 text-blue-500" />,
      color: "from-blue-500 to-blue-600",
      steps: [
        "Look for the sidebar panel on the left side of your screen",
        "Click on any category to expand and view available components"
      ]
    },
    {
      id: 2,
      title: "Live Code Editor with Monaco",
      description: "Write and edit your code with our powerful Monaco editor. Enjoy syntax highlighting, auto-completion, and real-time error detection for a seamless coding experience.",
      icon: <Code className="w-12 h-12 text-green-500" />,
      color: "from-green-500 to-green-600",
      steps: [
        "Choose a design snippet from the available component designs",
    
    "Edit the code directly inside the editor as per your needs."
      ]
    },
    {
      
  id: 3,
  title: "Real-Time Preview Panel",
  description: "View the live output of your code directly in the Live Preview Panel and instantly visualize your changes.",
  icon: <Eye className="w-12 h-12 text-purple-500" />,
  color: "from-purple-500 to-purple-600",
  steps: [
    "Edit the code directly inside the code editor.",
    "Click on the Run button to see the updated preview."
  ]


    },
    {
  id: 4,
  title: "Save Code with JWT Authentication",
  description: "Save your code snippets to view and access them later anytime.",
  icon: <Save className="w-12 h-12 text-orange-500" />,
  color: "from-orange-500 to-orange-600",
  steps: [
    "Login or signup if not done already.",
    "Click on the Save button to save the current code."
  ]
}
,
   
    {
  id: 5,
  title: "Access Saved Codes",
  description: "Quickly view all your saved codes for easy reuse and management.",
  icon: <Edit3 className="w-12 h-12 text-indigo-500" />,
  color: "from-indigo-500 to-indigo-600",
  steps: [
    "Go to Saved Codes section from the sidebar.",
    "View your saved codes.",
    "Copy the code to use anywhere.",
    "Unsave the codes if no longer needed."
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

  const closeWalkthrough = () => {
    setIsVisible(false);
  };

  const goHome = () => {
    navigate("/");
  };

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 relative"
        >
          <button
            onClick={goHome}
            className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Walkthrough Complete!</h3>
            <p className="text-gray-600 mb-6">You're all set to start building amazing components.</p>
            <button
              onClick={() => setIsVisible(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Restart Tour
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Feature Walkthrough</h2>
              <p className="text-gray-600 mt-1">Discover powerful tools to enhance your workflow</p>
            </div>
            <button
              onClick={closeWalkthrough}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {features.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / features.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / features.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-center"
            >
              <div className="mb-8">
                <div className={`w-22 h-22 mx-auto rounded-2xl bg-gradient-to-br ${features[currentStep].color} flex items-center justify-center shadow-lg`}>
                  {features[currentStep].icon}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {features[currentStep].title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto mb-2">
                  {features[currentStep].description}
                </p>
                
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 max-w-md mx-auto">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    How to Access:
                  </h4>
                  <div className="space-y-3">
                    {features[currentStep].steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons fixed at bottom */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
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
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-blue-500 scale-125'
                      : index < currentStep
                      ? 'bg-blue-300'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={currentStep === features.length - 1 ? closeWalkthrough : nextStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === features.length - 1
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
              }`}
            >
              {currentStep === features.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default FeatureWalkthrough;
