// Create Token Page Component - HTS Token Creation
// Allows users to create new fungible tokens using Hedera Token Service

import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle, XCircle, AlertTriangle, Coins } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';
import type { CreateTokenData } from '../types/hedera.types';

// Interface for component props
interface CreateTokenPageProps {
  onBack: () => void;  // Function to go back to overview
  onTokenCreated?: (tokenInfo: {
    type: 'token_create';
    tokenName: string;
    tokenSymbol: string;
    tokenId: string;
    transactionId: string;
  }) => void;  // Callback when token is created successfully
}

// Create Token page component
const CreateTokenPage = ({ onBack, onTokenCreated }: CreateTokenPageProps) => {
  
  // Form state management
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  
  // Transaction state management
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle token creation
  const handleCreateToken = async () => {
    try {
      // Clear previous results
      setError('');
      setResult(null);
      setIsLoading(true);

      console.log('Creating new HTS token...');
      
      // Prepare token data
      const tokenData: CreateTokenData = {
        name: tokenName.trim(),
        symbol: tokenSymbol.trim().toUpperCase(),
        initialSupply: parseInt(initialSupply)
      };
      
      // Execute token creation using wallet service
      const tokenResult = await walletService.createToken(tokenData);

      if (tokenResult.success) {
        setResult(tokenResult);
        console.log('Token creation successful!', tokenResult);
        
        // Notify parent component about token creation for transaction tracking
        if (onTokenCreated && tokenResult.tokenId) {
          onTokenCreated({
            type: 'token_create',
            tokenName: tokenData.name,
            tokenSymbol: tokenData.symbol,
            tokenId: tokenResult.tokenId,
            transactionId: tokenResult.transactionId || 'unknown'
          });
        }
        
        // Clear form on success
        setTokenName('');
        setTokenSymbol('');
        setInitialSupply('');
        setShowConfirmation(false);
      } else {
        setError(tokenResult.error || 'Token creation failed');
        setShowConfirmation(false);
      }

    } catch (error) {
      console.error('Token creation error:', error);
      setError('Failed to create token. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation step
  const handleConfirmCreation = () => {
    // Validate inputs before showing confirmation
    if (!tokenName.trim()) {
      setError('Please enter a token name');
      return;
    }

    if (!tokenSymbol.trim()) {
      setError('Please enter a token symbol');
      return;
    }

    if (!initialSupply || parseInt(initialSupply) <= 0) {
      setError('Please enter a valid initial supply');
      return;
    }

    // Validate token symbol format (basic check)
    if (tokenSymbol.trim().length > 100) {
      setError('Token symbol must be 100 characters or less');
      return;
    }

    // Validate token name length
    if (tokenName.trim().length > 100) {
      setError('Token name must be 100 characters or less');
      return;
    }

    // Clear errors and show confirmation
    setError('');
    setShowConfirmation(true);
  };

  // Handle supply input to only allow positive integers
  const handleSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setInitialSupply(value);
    }
  };

  // Handle symbol input to convert to uppercase and limit length
  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 10) { // Limit symbol length for readability
      setTokenSymbol(value);
    }
  };

  // Reset confirmation dialog
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      
      {/* Header with back button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#a0aec0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px'
          }}
        >
          <ArrowLeft size={20} />
          Back to Overview
        </button>
      </div>

      {/* Main card */}
      <div style={{
        backgroundColor: '#34495e',
        borderRadius: '16px',
        padding: '40px'
      }}>
        
        {/* Page title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
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
            <Plus size={30} color="#ffffff" />
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            Create Token
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Create a new fungible token using Hedera Token Service
          </p>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div style={{
            backgroundColor: '#2c3e50',
            border: '2px solid #f39c12',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <AlertTriangle size={24} color="#f39c12" />
              <h3 style={{ color: '#ffffff', margin: 0 }}>Confirm Token Creation</h3>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Token Name:</strong> {tokenName}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Token Symbol:</strong> {tokenSymbol.toUpperCase()}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Initial Supply:</strong> {parseInt(initialSupply).toLocaleString()} tokens
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Creation Fee:</strong> ~1-2 HBAR
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleCreateToken} disabled={isLoading}>
                {isLoading ? 'Creating Token...' : 'Confirm & Create'}
              </Button>
              <button
                onClick={handleCancelConfirmation}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: 'transparent',
                  border: '2px solid #a0aec0',
                  color: '#a0aec0',
                  borderRadius: '8px',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {!showConfirmation && (
          <div style={{ marginBottom: '30px' }}>
            
            {/* Token Name */}
            <Input
              label="Token Name"
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="My Awesome Token"
            />

            {/* Token Symbol */}
            <Input
              label="Token Symbol"
              type="text"
              value={tokenSymbol}
              onChange={handleSymbolChange}
              placeholder="MAT"
            />

            {/* Initial Supply */}
            <Input
              label="Initial Supply"
              type="text"
              value={initialSupply}
              onChange={handleSupplyChange}
              placeholder="1000000"
            />

            {/* Create button */}
            <Button
              onClick={handleConfirmCreation}
              disabled={!tokenName || !tokenSymbol || !initialSupply}
            >
              Review Token Creation
            </Button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#e74c3c',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <XCircle size={20} />
            {error}
          </div>
        )}

        {/* Success message */}
        {result && result.success && (
          <div style={{
            backgroundColor: '#00d4aa',
            color: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <CheckCircle size={24} />
              <strong style={{ fontSize: '18px' }}>Token Created Successfully!</strong>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Token ID:</strong> {result.tokenId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Transaction ID:</strong> {result.transactionId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Token Name:</strong> {tokenName}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Symbol:</strong> {tokenSymbol.toUpperCase()}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Initial Supply:</strong> {parseInt(initialSupply).toLocaleString()} tokens
            </p>
            
            {/* Additional info */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                🎉 Your token is now live on Hedera testnet!
              </p>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                🔗 View on HashScan: hashscan.io/testnet/token/{result.tokenId}
              </p>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                💡 You can now associate accounts and transfer this token.
              </p>
            </div>
            
            <button
              onClick={onBack}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#ffffff',
                color: '#00d4aa',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Token creation info */}
        {!showConfirmation && !result && (
          <div style={{
            backgroundColor: '#2c3e50',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #34495e'
          }}>
            <h4 style={{
              color: '#ffffff',
              fontSize: '16px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Coins size={20} />
              Token Creation Details
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#a0aec0' }}>Creation Fee:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>~1-2 HBAR</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Token Type:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>Fungible (HTS)</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Decimals:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>2 (like cents)</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Network:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>Hedera Testnet</span>
              </div>
            </div>
            
            {/* Tips */}
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: 'rgba(0, 212, 170, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(0, 212, 170, 0.3)'
            }}>
              <p style={{ color: '#9b59b6', fontSize: '13px', fontWeight: '600', margin: '0 0 5px 0' }}>
                💡 Tips:
              </p>
              <ul style={{ color: '#a0aec0', fontSize: '12px', margin: 0, paddingLeft: '15px' }}>
                <li>Choose a memorable symbol (1-10 characters)</li>
                <li>Token name can be up to 100 characters</li>
                <li>Initial supply can be increased later</li>
                <li>You'll be the treasury account for this token</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTokenPage;