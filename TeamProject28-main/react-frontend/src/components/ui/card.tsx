// ui/card.tsx
import React from "react";

// Interface for the Card component's props
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Card wrapper component with optional className and children
export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

// Interface for the CardHeader component
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

// CardHeader renders a styled header section inside the card
export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={`border-b p-4 ${className}`}>
      {children}
    </div>
  );
};

// Interface for the CardTitle component
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}


// CardTitle renders a stylized heading inside the header
export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
};

// Interface for the CardContent component
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// CardContent provides a padded content area for the card
export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};