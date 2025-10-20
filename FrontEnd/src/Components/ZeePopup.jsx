import { useState, useEffect } from 'react';
import { X, Sparkles, Zap, MessageCircle } from 'lucide-react';
import Highlights from './Highlights';
import PlugIn from './PlugIn';
import ZeeClash from './ZeeClash';
import ZeePrediction from './ZeePrediction';
import LiveComments from './LiveComments';
// Mock components - replace with your actual imports

const ZeePopup = ({ isOpen = true, onClose = () => {}, contestId = "123" }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedOption === 'liveComments' && isMobile) {
      setShowSnackbar(true);
      const timer = setTimeout(() => setShowSnackbar(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedOption, isMobile]);

  if (!isOpen && !isClosing) return null;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const getOptionTitle = (option) => {
    switch (option) {
      case 'highlights': return 'Highlights';
      case 'plugin': return 'Plug In';
      case 'zeeClash': return 'Zee Clash';
      case 'aiPrediction': return 'AI-generated prediction';
      case 'liveComments': return 'Live Comments';
      default: return '';
    }
  };

  const getOptionDescription = (option) => {
    switch (option) {
      case 'highlights': return 'Highlights update every 20 minutes';
      case 'plugin': return 'Plug in to enhance your experience';
      case 'zeeClash': return 'Compare contestants head-to-head';
      case 'aiPrediction': return 'Zee’s predictions for the contest';
      case 'liveComments': return 'Real-time comment feed from contestants';
      default: return '';
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 px-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className={`relative w-full max-w-2xl transition-all duration-500 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        } ${
          selectedOption ? 'translate-x-0' : 'translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          borderRadius: '24px'
        }}
      >
        {/* Decorative gradient overlay */}
        <div
          className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            mixBlendMode: 'overlay'
          }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-10 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:rotate-90 hover:scale-110"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <X size={22} />
        </button>

        <div className="relative p-8">
          {!selectedOption ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <Sparkles className="text-white" size={28} />
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                    }}
                  />
                </div>

                <h2
                  className="text-3xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Hey, I’m Zee!
                </h2>
                <p className="text-gray-600 text-sm font-medium">Where should we dive in first?</p>
              </div>

              {/* Option buttons - Grid Layout */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleOptionSelect('highlights')}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #034045 0%, #045a5f 100%)',
                    padding: '24px 20px',
                    boxShadow: '0 10px 25px rgba(3, 64, 69, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"
                    style={{ transition: 'transform 0.8s' }}
                  />
                  <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Sparkles className="text-teal-300" size={24} />
                    </div>
                    <span className="text-white font-bold text-base">Contest Highlights</span>
                  </div>
                </button>

                <button
                  onClick={() => handleOptionSelect('aiPrediction')}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                    padding: '24px 20px',
                    boxShadow: '0 10px 25px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"
                    style={{ transition: 'transform 0.8s' }}
                  />
                  <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Sparkles className="text-cyan-100" size={24} />
                    </div>
                    <span className="text-white font-bold text-base">Zee Prediction</span>
                  </div>
                </button>

                <button
                  onClick={() => handleOptionSelect('zeeClash')}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                    padding: '24px 20px',
                    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"
                    style={{ transition: 'transform 0.8s' }}
                  />
                  <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Zap className="text-purple-100" size={24} />
                    </div>
                    <span className="text-white font-bold text-base">Zee Clash</span>
                  </div>
                </button>

                <button
                  onClick={() => handleOptionSelect('liveComments')}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    padding: '24px 20px',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"
                    style={{ transition: 'transform 0.8s' }}
                  />
                  <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <MessageCircle className="text-green-100" size={24} />
                    </div>
                    <span className="text-white font-bold text-base">Live Comments</span>
                  </div>
                </button>
              </div>

              {/* Second row for AI Prediction */}
              <div className="grid grid-cols-1 gap-4 max-w-xs mx-auto">
                <button
                  onClick={() => handleOptionSelect('plugin')}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #E67347 0%, #f59563 100%)',
                    padding: '24px 20px',
                    boxShadow: '0 10px 25px rgba(230, 115, 71, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"
                    style={{ transition: 'transform 0.8s' }}
                  />
                  <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Zap className="text-orange-100" size={24} />
                    </div>
                    <span className="text-white font-bold text-base">Plug In</span>
                  </div>
                </button>
              </div>



              {/* Footer badge */}
              <div className="text-center pt-4">
                <span className="inline-block text-xs font-semibold px-4 py-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    color: '#667eea',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}
                >
                  Powered by ZeeContest AI
                </span>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <button
                onClick={handleBack}
                className="group flex items-center space-x-2 font-semibold transition-all duration-200 hover:translate-x-1"
                style={{ color: '#034045' }}
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back to Menu</span>
              </button>

              {/* Dynamic Header */}
              <div className="text-center py-6">
                <h3 className="text-xl font-bold">
                  {getOptionTitle(selectedOption)}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {getOptionDescription(selectedOption)}
                </p>
              </div>

              <div className="rounded-xl p-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {selectedOption === 'highlights' && <Highlights contestId={contestId} />}
                {selectedOption === 'plugin' && <PlugIn contestId={contestId} />}
                {selectedOption === 'zeeClash' && <ZeeClash contestId={contestId} />}
                {selectedOption === 'liveComments' && <LiveComments contestId={contestId} />}
                {selectedOption === 'liveComments' && !isMobile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <p className="font-bold text-gray-800">Want to drop your comment?</p>
                    <p className="text-gray-600">Visit  the profile of your favorite contestant and click on the comment button</p>
                  </div>
                )}
                {selectedOption === 'aiPrediction' && <ZeePrediction contestId={contestId} />}
              </div>
            </div>
          )}
        </div>

        {/* Bottom glow effect */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 rounded-full opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
            filter: 'blur(8px)'
          }}
        />
      </div>

      {/* Snackbar for mobile */}
      {showSnackbar && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-60 px-4 py-3 rounded-lg shadow-lg transition-all duration-600"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            borderRadius: '12px'
          }}
        >
          <p className="font-bold text-sm">Want to drop your comment?</p>
          <p className="text-xs opacity-90">Visit  the profile of your favorite contestant and click on the comment button</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ZeePopup;
