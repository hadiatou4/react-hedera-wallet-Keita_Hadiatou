// Simple Button component for Hedera Wallet

import React from 'react';

// Define props interface for the Button component
interface ButtonProps {
  children: React.ReactNode;  // Text or content inside button
  onClick?: () => void;       // Function to call when clicked
  disabled?: boolean;         // Whether button is disabled
}

// Button component definition
const Button = ({ children, onClick, disabled = false }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px',
        backgroundColor: disabled ? '#6b7280' : '#00d4aa',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
};

// Export the component as default
export default Button;