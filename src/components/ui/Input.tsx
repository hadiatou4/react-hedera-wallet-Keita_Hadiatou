// Simple Input component 
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  label: string;              
  type?: 'text' | 'password'; 
  value: string;              
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;       
}

const Input = ({ label, type = 'text', value, onChange, placeholder }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ marginBottom: '20px' }}> {/* Moins d'espace */}
      {/* Input label */}
      <label style={{
        display: 'block',
        marginBottom: '8px',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        {label}
      </label>
      
      {/* Input container */}
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '14px 16px', // Moins de padding
            backgroundColor: '#2a2e35',
            border: '2px solid transparent',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            paddingRight: type === 'password' ? '50px' : '16px',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#00d4aa';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'transparent';
          }}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#a0aec0',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;