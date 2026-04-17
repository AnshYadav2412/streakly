const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className={`${sizeClasses[size]} border-amber-500 border-t-transparent rounded-full animate-spin`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {spinner}
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
