export const ConnectionAnimation = ({ status = 'connecting', size = 'lg' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const statusColors = {
    connecting: 'text-purple-600',
    success: 'text-green-500',
    error: 'text-red-500',
    idle: 'text-gray-400',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Main Orbital Animation */}
      <div className={`relative ${sizeClasses[size]} mb-6`}>
        {/* Central Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-1/4 h-1/4 bg-current rounded-full animate-pulse ${statusColors[status]}`}
          >
            <div className="w-full h-full bg-current rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Orbiting Nodes */}
        <div className="absolute inset-0">
          {/* Fast orbit */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-3 h-3 bg-current rounded-full animate-orbit-fast ${statusColors[status]}`}
            ></div>
          </div>

          {/* Medium orbit */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-4 h-4 bg-current rounded-full animate-orbit-medium ${statusColors[status]}`}
            ></div>
          </div>

          {/* Slow orbit */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div
              className={`w-5 h-5 bg-current rounded-full animate-orbit-slow ${statusColors[status]}`}
            ></div>
          </div>

          {/* Very slow orbit */}
          <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-6 h-6 bg-current rounded-full animate-orbit-very-slow ${statusColors[status]}`}
            ></div>
          </div>
        </div>

        {/* Connection Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-current border-dashed rounded-full opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-current border-dashed rounded-full opacity-15"></div>
        </div>

        {/* Pulsing Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full border-4 border-current rounded-full animate-ping-slow opacity-0"></div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <div
          className={`text-sm font-semibold uppercase tracking-widest mb-2 ${statusColors[status]}`}
        >
          {status}
        </div>
        <div className="flex space-x-1 justify-center">
          <div
            className="w-2 h-2 bg-current rounded-full animate-pulse"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-2 h-2 bg-current rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-2 h-2 bg-current rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="w-48 h-2 mt-6 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 animate-pulse"></div>

      {/* CSS Styles (add to your global CSS) */}
      <style jsx>{`
        @keyframes orbit-fast {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }
        @keyframes orbit-medium {
          0% {
            transform: rotate(0deg) translateX(32px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(32px) rotate(-360deg);
          }
        }
        @keyframes orbit-slow {
          0% {
            transform: rotate(0deg) translateX(24px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(24px) rotate(-360deg);
          }
        }
        @keyframes orbit-very-slow {
          0% {
            transform: rotate(0deg) translateX(16px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(16px) rotate(-360deg);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-orbit-fast {
          animation: orbit-fast 1.5s linear infinite;
        }
        .animate-orbit-medium {
          animation: orbit-medium 2s linear infinite;
        }
        .animate-orbit-slow {
          animation: orbit-slow 2.5s linear infinite;
        }
        .animate-orbit-very-slow {
          animation: orbit-very-slow 3s linear infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};
