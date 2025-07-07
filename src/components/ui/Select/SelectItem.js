import React from "react";

const SelectItem = React.forwardRef(
  ({ className, children, value, ...props }, ref) => (
    <option
      ref={ref}
      value={value}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none
         focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </option>
  )
);

export default SelectItem;