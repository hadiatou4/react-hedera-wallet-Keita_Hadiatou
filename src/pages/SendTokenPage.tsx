// Send Token Page Component - HTS Token Transfer
// Allows users to send fungible tokens to another account

import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, XCircle, AlertTriangle, Coins } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';

// Interface for component props
interface SendTokenPageProps {
  onBack: () => void;  // Function to go back to overview
  onTransactionSuccess: (transaction: {
    type: 'token_send';
    amount: number;
    to: string;
    from?: string;
    transactionId?: string;
    tokenId: string;
    tokenSymbol?: string;
  }) => void;  // Callback when transaction succeeds
}

// Send Token page component
const SendTokenPage = ({ onBack, onTransactionSuccess }: SendTokenPageProps) => {
  
  // Form state management
  const [tokenId, setTokenId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  
  // Transaction state management
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle token send
  const handleSendToken = async () => {
    try {
      // Clear previous results
      setError('');
      setResult(null);
      setIsLoading(true);

      console.log('Executing token transfer...');
      
      // Execute transaction using wallet service
      const transactionResult = await walletService.sendToken(
        tokenId.trim(),
        recipientId.trim(), 
        parseFloat(amount)
      );

      if (transactionResult.success) {
        setResult(transactionResult);
        console.log('Token transfer successful!', transactionResult);
        
        // Add new transaction to the parent component's list
        onTransactionSuccess({
          type: 'token_send',
          amount: parseFloat(amount),
          to: recipientId.trim(),
          transactionId: transactionResult.transactionId,
          tokenId: tokenId.trim(),
          tokenSymbol: '' // Could be enhanced to fetch token symbol
        });
        
        // Clear form on success
        setTokenId('');
        setRecipientId('');
        setAmount('');
        setShowConfirmation(false);
      } else {
        setError(transactionResult.error || 'Token transfer failed');
        setShowConfirmation(false);
      }

    } catch (error) {
      console.error('Send token error:', error);
      setError('Failed to send tokens. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation step
  const handleConfirmTransaction = () => {
    // Validate inputs before showing confirmation
    if (!tokenId.trim()) {
      setError('Please enter a Token ID');
      return;
    }

    if (!tokenId.match(/^0\.0\.\d+$/)) {
      setError('Token ID must be in format 0.0.123456');
      return;
    }

    if (!recipientId.trim()) {
      setError('Please enter recipient Account ID');
      return;
    }

    if (!recipientId.match(/^0\.0\.\d+$/)) {
      setError('Account ID must be in format 0.0.123456');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Clear errors and show confirmation
    setError('');
    setShowConfirmation(true);
  };

  // Handle amount input to only allow numbers and decimals
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
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
            <Send size={30} color="#ffffff" />
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            Send Token
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Transfer HTS tokens to another Hedera account
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
              <h3 style={{ color: '#ffffff', margin: 0 }}>Confirm Token Transfer</h3>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Token ID:</strong> {tokenId}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>To:</strong> {recipientId}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Amount:</strong> {amount} tokens
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Network Fee:</strong> ~0.001 HBAR
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleSendToken} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Confirm & Send'}
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
            
            {/* Token ID */}
            <Input
              label="Token ID"
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="0.0.123456"
            />

            {/* Recipient Account ID */}
            <Input
              label="Recipient Account ID"
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="0.0.123456"
            />

            {/* Amount */}
            <Input
              label="Amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="100"
            />

            {/* Confirm button */}
            <Button
              onClick={handleConfirmTransaction}
              disabled={!tokenId || !recipientId || !amount}
            >
              Review Transfer
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
              <strong style={{ fontSize: '18px' }}>Token Transfer Successful!</strong>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Transaction ID:</strong> {result.transactionId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Amount Sent:</strong> {amount} tokens
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>To:</strong> {recipientId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Token ID:</strong> {tokenId}
            </p>
            
            {/* Additional info */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                ✅ Tokens transferred successfully!
              </p>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                🔄 Transaction confirmed on Hedera network.
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

        {/* Token Transfer Details */}
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
              Token Transfer Details
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#a0aec0' }}>Transaction Fee:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.001 HBAR</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Token Decimals:</span>
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
              <p style={{ color: '#00d4aa', fontSize: '13px', fontWeight: '600', margin: '0 0 5px 0' }}>
                💡 Tips:
              </p>
              <ul style={{ color: '#a0aec0', fontSize: '12px', margin: 0, paddingLeft: '15px' }}>
                <li>Use your token ID: 0.0.6412824 (MTT)</li>
                <li>Recipient must have the token associated first</li>
                <li>Check your token balance before sending</li>
                <li>Transaction cannot be reversed once sent</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendTokenPage;