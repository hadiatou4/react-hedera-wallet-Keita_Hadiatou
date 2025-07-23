// Main App Component - Student Version
// This is the main component that manages the entire application state

import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { walletService } from './services/wallet.service';

// Main App component
function App() {
  
  // State to track if user is connected to wallet
  const [isConnected, setIsConnected] = useState(false);
  
  // State to track if app is checking for existing connection
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Effect that runs when app starts - checks for existing connection
  useEffect(() => {
    checkExistingConnection();
  }, []);

  // Function to check if user was previously connected
  const checkExistingConnection = async () => {
    try {
      console.log('Checking for existing connection...');
      
      // Try to auto-connect using stored credentials
      const connected = await walletService.autoConnect();
      
      if (connected) {
        console.log('Auto-connection successful!');
        setIsConnected(true);
      } else {
        console.log('No existing connection found');
        setIsConnected(false);
      }
      
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    } finally {
      // Stop showing loading state
      setIsCheckingConnection(false);
    }
  };

  // Function to handle successful login
  const handleLoginSuccess = () => {
    console.log('Login successful, showing dashboard...');
    setIsConnected(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log('Logout successful, showing login page...');
    setIsConnected(false);
  };

  // Show loading screen while checking connection
  if (isCheckingConnection) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#2c3e50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#00d4aa',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ffffff' 
            }}>
              H
            </span>
          </div>
          <h2 style={{ 
            color: '#ffffff', 
            fontSize: '24px', 
            marginBottom: '10px' 
          }}>
            Hedera Wallet
          </h2>
          <p style={{ color: '#a0aec0', fontSize: '16px' }}>
            Checking connection...
          </p>
        </div>
      </div>
    );
  }

  // Main app render - show LoginPage or DashboardPage based on connection status
  return (
    <div>
      {isConnected ? (
        // User is connected - show dashboard
        <DashboardPage onLogout={handleLogout} />
      ) : (
        // User is not connected - show login page
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;