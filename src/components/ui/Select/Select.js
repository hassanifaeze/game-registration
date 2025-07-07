import React from "react";

// Select Component (Exact Input style)
const Select = React.forwardRef(({ children, value, onValueChange, className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

export default Select;
