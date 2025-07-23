// Login Page Component for Hedera Wallet
// Updated with real connection logic

import { useState } from 'react';
import { Wallet } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';

// Interface for component props
interface LoginPageProps {
  onLoginSuccess: () => void; // Function to call when login is successful
}

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  // State for form inputs
  const [accountId, setAccountId] = useState('0.0.123456');
  const [privateKey, setPrivateKey] = useState('');
  
  // State for connection process
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle connect button click
  const handleConnect = async () => {
    try {
      console.log('Attempting to connect wallet...');
      
      // Clear any previous errors
      setErrorMessage('');
      setIsConnecting(true);

      // Validate inputs
      if (!accountId.trim()) {
        setErrorMessage('Please enter your Account ID');
        return;
      }

      if (!privateKey.trim()) {
        setErrorMessage('Please enter your Private Key');
        return;
      }

      // Try to connect using wallet service
      const success = await walletService.connectWallet(accountId.trim(), privateKey.trim());

      if (success) {
        console.log('Connection successful!');
        // Call parent function to show dashboard
        onLoginSuccess();
      } else {
        setErrorMessage('Failed to connect. Please check your credentials.');
      }

    } catch (error) {
      console.error('Connection error:', error);
      setErrorMessage('Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#2c3e50',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Main Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#34495e',
        borderRadius: '16px',
        padding: '35px 40px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        
        {/* Wallet Icon */}
        <div style={{
          width: '70px',
          height: '70px',
          backgroundColor: '#00d4aa',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 25px auto',
          boxShadow: '0 6px 15px rgba(0, 212, 170, 0.3)'
        }}>
          <Wallet size={35} color="#ffffff" />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          Hedera Wallet
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.1rem',
          color: '#a0aec0',
          marginBottom: '35px',
          fontWeight: '400'
        }}>
          Connect to your Hedera account
        </p>

        {/* Error Message */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <div style={{ textAlign: 'left' }}>
          <Input
            label="Account ID"
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="0.0.123456"
          />

          <Input
            label="Private Key"
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter your private key"
          />

          <Button
            onClick={handleConnect}
            disabled={!accountId || !privateKey || isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;