import React from "react";

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative h-3 w-full overflow-hidden rounded-full bg-gray-800 ${className}`}
    {...props}
  >
    <div
      className="h-full bg-gradient-to-l from-red-600 to-yellow-500 transition-all duration-700 ease-out shadow-lg shadow-red-500/50 origin-right"
      style={{ transform: `scaleX(${value / 100})` }}
    />
  </div>
));

export default Progress;
