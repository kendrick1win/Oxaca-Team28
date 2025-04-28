import React from "react";

// Define props for the Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

// Select component renders a styled <select> element
export const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <select className="border border-gray-300 p-2 rounded-md w-full" {...props}>
      {children}
    </select>
  );
};

// Define props for individual option items
interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
  children: React.ReactNode;
}

// SelectItem component renders a single <option>s
export const SelectItem: React.FC<SelectItemProps> = ({ children, ...props }) => {
  return <option {...props}>{children}</option>;
};
