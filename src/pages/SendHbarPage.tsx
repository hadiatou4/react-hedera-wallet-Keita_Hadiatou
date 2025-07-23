// Send HBAR Page Component - Dynamic Version with Transaction Callback
// Updates parent component when transaction is successful

import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';

// Interface for component props
interface SendHbarPageProps {
  onBack: () => void;  // Function to go back to overview
  onTransactionSuccess: (transaction: {
    type: 'send' | 'receive';
    amount: number;
    to?: string;
    from?: string;
    transactionId?: string;
  }) => void;  // Callback when transaction succeeds
}

// Send HBAR page component with dynamic updates
const SendHbarPage = ({ onBack, onTransactionSuccess }: SendHbarPageProps) => {
  
  // Form state management
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  
  // Transaction state management
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle form submission
  const handleSendHbar = async () => {
    try {
      // Clear previous results
      setError('');
      setResult(null);
      setIsLoading(true);

      console.log('Executing HBAR transfer...');
      
      // Execute transaction using wallet service
      const transactionResult = await walletService.sendHbar(
        recipientId.trim(), 
        parseFloat(amount)
      );

      if (transactionResult.success) {
        setResult(transactionResult);
        console.log('Transaction successful!', transactionResult);
        
        // Add new transaction to the parent component's list
        onTransactionSuccess({
          type: 'send',
          amount: parseFloat(amount),
          to: recipientId.trim(),
          transactionId: transactionResult.transactionId
        });
        
        // Clear form on success
        setRecipientId('');
        setAmount('');
        setMemo('');
        setShowConfirmation(false);
      } else {
        setError(transactionResult.error || 'Transaction failed');
        setShowConfirmation(false);
      }

    } catch (error) {
      console.error('Send HBAR error:', error);
      setError('Failed to send transaction. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation step
  const handleConfirmTransaction = () => {
    // Validate inputs before showing confirmation
    if (!recipientId.trim()) {
      setError('Please enter recipient Account ID');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Validate account ID format (basic check)
    if (!recipientId.match(/^0\.0\.\d+$/)) {
      setError('Account ID must be in format 0.0.123456');
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
            Send HBAR
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Transfer HBAR to another Hedera account
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
              <h3 style={{ color: '#ffffff', margin: 0 }}>Confirm Transaction</h3>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>To:</strong> {recipientId}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Amount:</strong> {amount} HBAR
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Network Fee:</strong> ~0.0001 HBAR
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleSendHbar} disabled={isLoading}>
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
              label="Amount (HBAR)"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="10.0000"
            />

            {/* Optional memo */}
            <Input
              label="Memo (Optional)"
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment description"
            />

            {/* Confirm button */}
            <Button
              onClick={handleConfirmTransaction}
              disabled={!recipientId || !amount}
            >
              Review Transaction
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
              <strong style={{ fontSize: '18px' }}>Transaction Successful!</strong>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Transaction ID:</strong> {result.transactionId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Amount Sent:</strong> {amount} HBAR
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>To:</strong> {recipientId}
            </p>
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

        {/* Transaction info */}
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
              marginBottom: '10px'
            }}>
              Transaction Details
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#a0aec0' }}>Network Fee:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.0001 HBAR</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Network:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>Hedera Testnet</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendHbarPage;