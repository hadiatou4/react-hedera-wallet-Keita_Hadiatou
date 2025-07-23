// Send Message Page Component - HCS Message Submission
// Allows users to send messages to Hedera Consensus Service topics

import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';

// Interface for component props
interface SendMessagePageProps {
  onBack: () => void;  // Function to go back to topics
  onMessageSent?: (messageInfo: {
    type: 'topic_message';
    topicId: string;
    message: string;
    sequenceNumber: number;
    transactionId: string;
  }) => void;  // Callback when message is sent successfully
}

// Send Message page component
const SendMessagePage = ({ onBack, onMessageSent }: SendMessagePageProps) => {
  
  // Form state management
  const [topicId, setTopicId] = useState('');
  const [message, setMessage] = useState('');
  
  // Transaction state management
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle message send
  const handleSendMessage = async () => {
    try {
      // Clear previous results
      setError('');
      setResult(null);
      setIsLoading(true);

      console.log('Sending message to topic...');
      
      // Execute message submission using wallet service
      const messageResult = await walletService.sendMessageToTopic(
        topicId.trim(),
        message.trim()
      );

      if (messageResult.success) {
        setResult(messageResult);
        console.log('Message sent successfully!', messageResult);
        
        // Notify parent component about message submission
        if (onMessageSent && messageResult.sequenceNumber !== undefined) {
          onMessageSent({
            type: 'topic_message',
            topicId: topicId.trim(),
            message: message.trim(),
            sequenceNumber: messageResult.sequenceNumber,
            transactionId: messageResult.transactionId || 'unknown'
          });
        }
        
        // Clear form on success
        setTopicId('');
        setMessage('');
        setShowConfirmation(false);
      } else {
        setError(messageResult.error || 'Message submission failed');
        setShowConfirmation(false);
      }

    } catch (error) {
      console.error('Send message error:', error);
      setError('Failed to send message. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation step
  const handleConfirmSend = () => {
    // Validate inputs before showing confirmation
    if (!topicId.trim()) {
      setError('Please enter a Topic ID');
      return;
    }

    if (!topicId.match(/^0\.0\.\d+$/)) {
      setError('Topic ID must be in format 0.0.123456');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (message.length > 1024) {
      setError('Message must be 1024 characters or less');
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

  // Character count for message
  const characterCount = message.length;
  const maxCharacters = 1024;

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
          Back to Topics
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
            Send Message
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Send a message to a Hedera Consensus Service topic
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
              <h3 style={{ color: '#ffffff', margin: 0 }}>Confirm Message</h3>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Topic ID:</strong> {topicId}
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Message Length:</strong> {characterCount} characters
              </p>
              <p style={{ color: '#a0aec0', margin: '5px 0' }}>
                <strong>Fee:</strong> ~0.0001 HBAR
              </p>
            </div>
            <div style={{
              backgroundColor: '#34495e',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              maxHeight: '100px',
              overflow: 'auto'
            }}>
              <p style={{ color: '#ffffff', fontSize: '14px', margin: 0, wordBreak: 'break-word' }}>
                {message}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleSendMessage} disabled={isLoading}>
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
            
            {/* Topic ID */}
            <Input
              label="Topic ID"
              type="text"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              placeholder="0.0.123456"
            />

            {/* Message */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  backgroundColor: '#2c3e50',
                  border: '2px solid #34495e',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                <span style={{
                  color: characterCount > maxCharacters ? '#e74c3c' : '#a0aec0',
                  fontSize: '14px'
                }}>
                  {characterCount} / {maxCharacters} characters
                </span>
              </div>
            </div>

            {/* Send button */}
            <Button
              onClick={handleConfirmSend}
              disabled={!topicId || !message || characterCount > maxCharacters}
            >
              Review Message
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
              <strong style={{ fontSize: '18px' }}>Message Sent Successfully!</strong>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Transaction ID:</strong> {result.transactionId}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Sequence Number:</strong> #{result.sequenceNumber}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Topic ID:</strong> {topicId}
            </p>
            
            {/* Additional info */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                ✅ Message added to the topic's immutable history
              </p>
              <p style={{ margin: '5px 0', fontSize: '13px', opacity: 0.9 }}>
                🔢 Sequence number confirms message order
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
              Back to Topics
            </button>
          </div>
        )}

        {/* Message Details */}
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
              <MessageSquare size={20} />
              Message Details
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#a0aec0' }}>Message Fee:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.0001 HBAR</span>
              </div>
              <div>
                <span style={{ color: '#a0aec0' }}>Max Size:</span>
                <span style={{ color: '#ffffff', marginLeft: '10px' }}>1024 characters</span>
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
                <li>Messages are permanently stored on-chain</li>
                <li>Each message gets a unique sequence number</li>
                <li>Private topics require submit key authorization</li>
                <li>Messages cannot be edited or deleted</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMessagePage;