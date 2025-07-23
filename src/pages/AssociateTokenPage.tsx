// Associate Token Page Component - HTS Token Association
// Allows users to associate their account with existing tokens

import { useState } from 'react';
import { ArrowLeft, Link, CheckCircle, XCircle, AlertTriangle, Coins } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';

// Interface defining the props for this component
interface AssociateTokenPageProps {
  onBack: () => void; // Function to navigate back to dashboard
  onAssociationSuccess: (tokenInfo: {
    type: 'token_associate';
    tokenId: string;
    transactionId: string;
  }) => void; // Callback when association is successful to update transaction history
}

// Associate Token page component
const AssociateTokenPage = ({ onBack, onAssociationSuccess }: AssociateTokenPageProps) => {
  
  // State for form input
  const [tokenId, setTokenId] = useState('');
  
  // State for loading and results
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle token association
  const handleAssociateToken = async () => {
    try {
      // Clear previous state
      setError('');
      setResult(null);
      setIsLoading(true);

      console.log('Associating with token...');
      
      // Call wallet service to associate token
      const associationResult = await walletService.associateToken(tokenId.trim());

      if (associationResult.success) {
        setResult(associationResult);
        console.log('Token association successful!', associationResult);
        
        // Notify parent component to add transaction to history
        if (onAssociationSuccess && associationResult.transactionId) {
          onAssociationSuccess({
            type: 'token_associate',
            tokenId: tokenId.trim(),
            transactionId: associationResult.transactionId
          });
        }
        
        // Clear form
        setTokenId('');
        setShowConfirmation(false);
      } else {
        setError(associationResult.error || 'Token association failed');
        setShowConfirmation(false);
      }

    } catch (error) {
      console.error('Token association error:', error);
      setError('Failed to associate token. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show confirmation dialog before association
  const handleConfirmAssociation = () => {
    // Validate token ID format
    if (!tokenId.trim()) {
      setError('Please enter a token ID');
      return;
    }

    if (!tokenId.match(/^0\.0\.\d+$/)) {
      setError('Token ID must be in format 0.0.123456');
      return;
    }

    // Clear errors and show confirmation
    setError('');
    setShowConfirmation(true);
  };

  // Cancel confirmation dialog
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
            <Link size={30} color="#ffffff" />
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            Associate Token
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Associate your account with an existing token to enable transactions
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
              <h3 style={{ color: '#ffffff', margin: 0 }}>Confirm Token Association</h3>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Token ID:</strong> {tokenId}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Association Fee:</strong> ~0.05 HBAR
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0', fontSize: '13px' }}>
                This will enable your account to receive and hold this token.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleAssociateToken} disabled={isLoading}>
                {isLoading ? 'Associating...' : 'Confirm & Associate'}
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

        {/* Form - shown when not confirming */}
        {!showConfirmation && (
          <div style={{ marginBottom: '30px' }}>
            
            {/* Token ID input */}
            <Input
              label="Token ID"
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="0.0.123456"
            />

            {/* Review button */}
            <Button
              onClick={handleConfirmAssociation}
              disabled={!tokenId}
            >
              Review Association
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
              <strong style={{ fontSize: '18px' }}>Token Associated Successfully!</strong>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Transaction ID:</strong> {result.transactionId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Token ID:</strong> {tokenId || result.tokenId}
            </p>
            
            {/* Additional info box */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                ✅ Your account can now receive and hold this token!
              </p>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                🔄 You can now use "Send Token" to transfer these tokens.
              </p>
            </div>
            
            {/* Back to dashboard button */}
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

        {/* Token Association Details - shown when not confirming and no result */}
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
              Token Association Details
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#a0aec0' }}>Association Fee:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.05 HBAR</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Purpose:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>Enable token transactions</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Network:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>Hedera Testnet</span>
              </div>
            </div>
            
            {/* Tips section */}
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
                <li>Use your own token ID: 0.0.6412824</li>
                <li>Token ID format must be: 0.0.123456</li>
                <li>Association is required before receiving tokens</li>
                <li>One-time setup per token</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociateTokenPage;