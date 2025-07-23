// Create Topic Page Component - HCS Topic Creation
// Allows users to create new topics on Hedera Consensus Service

import  { useState } from 'react';
import { ArrowLeft, MessageSquarePlus, CheckCircle, XCircle, AlertTriangle, MessageCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';

// Interface for component props
interface CreateTopicPageProps {
  onBack: () => void;  // Function to go back to overview
  onTopicCreated?: (topicInfo: {
    type: 'topic_create';
    topicId: string;
    topicMemo: string;
    transactionId: string;
  }) => void;  // Callback when topic is created successfully
}

// Create Topic page component
const CreateTopicPage = ({ onBack, onTopicCreated }: CreateTopicPageProps) => {
  
  // Form state management
  const [topicMemo, setTopicMemo] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Transaction state management
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle topic creation
  const handleCreateTopic = async () => {
    try {
      // Clear previous results
      setError('');
      setResult(null);
      setIsLoading(true);

      console.log('Creating new HCS topic...');
      
      // Execute topic creation using wallet service
      const topicResult = await walletService.createTopic({
        memo: topicMemo.trim(),
        isPrivate: isPrivate
      });

      if (topicResult.success) {
        setResult(topicResult);
        console.log('Topic creation successful!', topicResult);
        
        // Notify parent component about topic creation for transaction tracking
        if (onTopicCreated && topicResult.topicId) {
          onTopicCreated({
            type: 'topic_create',
            topicId: topicResult.topicId,
            topicMemo: topicMemo.trim(),
            transactionId: topicResult.transactionId || 'unknown'
          });
        }
        
        // Clear form on success
        setTopicMemo('');
        setIsPrivate(false);
        setShowConfirmation(false);
      } else {
        setError(topicResult.error || 'Topic creation failed');
        setShowConfirmation(false);
      }

    } catch (error) {
      console.error('Topic creation error:', error);
      setError('Failed to create topic. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation step
  const handleConfirmCreation = () => {
    // Validate inputs before showing confirmation
    if (!topicMemo.trim()) {
      setError('Please enter a topic memo/description');
      return;
    }

    if (topicMemo.trim().length > 100) {
      setError('Topic memo must be 100 characters or less');
      return;
    }

    // Clear errors and show confirmation
    setError('');
    setShowConfirmation(true);
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
            <MessageSquarePlus size={30} color="#ffffff" />
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            Create Topic
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Create a new topic on Hedera Consensus Service
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
              <h3 style={{ color: '#ffffff', margin: 0 }}>Confirm Topic Creation</h3>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Topic Memo:</strong> {topicMemo}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Topic Type:</strong> {isPrivate ? 'Private (Restricted)' : 'Public (Open)'}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Creation Fee:</strong> ~0.01 HBAR
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleCreateTopic} disabled={isLoading}>
                {isLoading ? 'Creating Topic...' : 'Confirm & Create'}
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
            
            {/* Topic Memo */}
            <Input
              label="Topic Memo/Description"
              type="text"
              value={topicMemo}
              onChange={(e) => setTopicMemo(e.target.value)}
              placeholder="My discussion topic"
            />

            {/* Private Topic Checkbox */}
            <div style={{
              marginBottom: '20px',
              backgroundColor: '#2c3e50',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #34495e'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#ffffff'
              }}>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Private Topic</span>
                  <p style={{ 
                    color: '#a0aec0', 
                    fontSize: '14px', 
                    margin: '5px 0 0 0' 
                  }}>
                    Only you can send messages to this topic
                  </p>
                </div>
              </label>
            </div>

            {/* Create button */}
            <Button
              onClick={handleConfirmCreation}
              disabled={!topicMemo}
            >
              Review Topic Creation
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
              <strong style={{ fontSize: '18px' }}>Topic Created Successfully!</strong>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Topic ID:</strong> {result.topicId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Transaction ID:</strong> {result.transactionId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Topic Memo:</strong> {topicMemo || 'No memo'}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Type:</strong> {isPrivate ? 'Private' : 'Public'}
            </p>
            
            {/* Additional info */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                🎉 Your topic is now live on Hedera Consensus Service!
              </p>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                💬 You can now send messages to this topic.
              </p>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                📨 Topic ID: Save this to share with others.
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

        {/* Topic Creation Details */}
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
              <MessageCircle size={20} />
              Topic Creation Details
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#a0aec0' }}>Creation Fee:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.01 HBAR</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Message Fee:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.0001 HBAR per message</span>
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
                <li>Topic memo helps identify your topic purpose</li>
                <li>Public topics: Anyone can send messages</li>
                <li>Private topics: Only you can send messages</li>
                <li>Messages are immutable once sent</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTopicPage;