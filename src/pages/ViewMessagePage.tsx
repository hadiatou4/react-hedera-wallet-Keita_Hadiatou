// View Messages Page Component - HCS Message Retrieval with Real-time Updates
// Allows users to view messages from Hedera Consensus Service topics with auto-refresh

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, Loader2, RefreshCw, MessageSquare, Pause, Play } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { walletService } from '../services/wallet.service';
import type { TopicMessage } from '../types/hedera.types';

// Interface for component props
interface ViewMessagesPageProps {
  onBack: () => void;  // Function to go back to topics
}

// View Messages page component
const ViewMessagesPage = ({ onBack }: ViewMessagesPageProps) => {
  
  // Form state
  const [topicId, setTopicId] = useState('');
  
  // Messages state
  const [messages, setMessages] = useState<TopicMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Real-time polling state
  const [isPolling, setIsPolling] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle retrieving messages
  const handleRetrieveMessages = async (showLoading = true) => {
    // Validate topic ID
    if (!topicId.trim()) {
      setError('Please enter a Topic ID');
      return;
    }

    if (!topicId.match(/^0\.0\.\d+$/)) {
      setError('Topic ID must be in format 0.0.123456');
      return;
    }

    try {
      setError('');
      if (showLoading) {
        setIsLoading(true);
      }
      setHasSearched(true);

      console.log('Retrieving messages from topic...');
      
      // Retrieve messages using wallet service
      const topicMessages = await walletService.getTopicMessages(
        topicId.trim(),
        (newMessage) => {
          // Real-time update callback (not used with polling, but kept for compatibility)
          console.log('New message received via callback:', newMessage);
        }
      );

      // Check if we got new messages (for real-time updates)
      if (topicMessages.length > lastMessageCount) {
        console.log(`🔥 NEW MESSAGES DETECTED! ${topicMessages.length - lastMessageCount} new message(s)`);
        
        // Show a brief notification for new messages (optional)
        if (lastMessageCount > 0 && !showLoading) {
          console.log('📬 Auto-updated with new messages!');
        }
      }

      // Set all messages at once
      setMessages(topicMessages);
      setLastMessageCount(topicMessages.length);
      
      if (topicMessages.length === 0) {
        console.log('No messages found for this topic');
      } else {
        console.log(`Retrieved ${topicMessages.length} messages`);
      }

    } catch (error) {
      console.error('Error retrieving messages:', error);
      setError('Failed to retrieve messages. Please check the topic ID and try again.');
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // Start real-time polling
  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPolling(true);
    console.log('🔄 Started real-time polling for new messages...');

    // Poll every 5 seconds for new messages
    intervalRef.current = setInterval(() => {
      console.log('🔍 Checking for new messages...');
      handleRetrieveMessages(false); // Don't show loading spinner for background polls
    }, 5000); // 5 seconds interval
  };

  // Stop real-time polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    console.log('⏹️ Stopped real-time polling');
  };

  // Handle initial retrieve with auto-polling
  const handleRetrieveWithPolling = async () => {
    await handleRetrieveMessages(true);
    
    // Start polling after initial load
    if (topicId.trim() && topicId.match(/^0\.0\.\d+$/)) {
      startPolling();
    }
  };

  // Cleanup polling on component unmount or topic change
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Stop polling when topic ID changes
  useEffect(() => {
    stopPolling();
    setMessages([]);
    setLastMessageCount(0);
    setHasSearched(false);
  }, [topicId]);

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '800px',
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
            <Eye size={30} color="#ffffff" />
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            View Messages
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Read messages from a Hedera Consensus Service topic with real-time updates
          </p>
        </div>

        {/* Search Form */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Topic ID"
                type="text"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                placeholder="0.0.123456"
              />
            </div>
            {/* Retrieve button */}
            <div style={{ minWidth: '150px' }}>
              <Button
                onClick={handleRetrieveWithPolling}
                disabled={!topicId || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} style={{ marginRight: '8px' }} />
                    Retrieve & Watch
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Controls */}
        {hasSearched && !isLoading && (
          <div style={{
            backgroundColor: '#2c3e50',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isPolling ? '#00d4aa' : '#a0aec0',
                animation: isPolling ? 'pulse 2s infinite' : 'none'
              }} />
              <span style={{ color: '#ffffff', fontSize: '14px' }}>
                {isPolling ? 'Live updates enabled • Checking every 5 seconds' : 'Real-time updates paused'}
              </span>
            </div>
            <button
              onClick={isPolling ? stopPolling : startPolling}
              style={{
                backgroundColor: isPolling ? '#e74c3c' : '#00d4aa',
                border: 'none',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px'
              }}
            >
              {isPolling ? (
                <>
                  <Pause size={14} />
                  Pause Live Updates
                </>
              ) : (
                <>
                  <Play size={14} />
                  Start Live Updates
                </>
              )}
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#e74c3c',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Messages Display */}
        {hasSearched && !isLoading && (
          <div>
            <h3 style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <MessageSquare size={20} />
              Messages ({messages.length})
              {isPolling && (
                <span style={{
                  backgroundColor: '#00d4aa',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  LIVE
                </span>
              )}
            </h3>

            {messages.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                maxHeight: '500px',
                overflow: 'auto',
                padding: '5px'
              }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#2c3e50',
                      borderRadius: '8px',
                      padding: '20px',
                      border: '1px solid #34495e'
                    }}
                  >
                    {/* Message Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px'
                    }}>
                      <div>
                        <span style={{
                          color: '#00d4aa',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          Sequence #{msg.sequenceNumber}
                        </span>
                      </div>
                      <span style={{
                        color: '#a0aec0',
                        fontSize: '12px'
                      }}>
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>

                    {/* Message Content */}
                    <div style={{
                      backgroundColor: '#34495e',
                      padding: '15px',
                      borderRadius: '6px',
                      marginBottom: '10px'
                    }}>
                      <p style={{
                        color: '#ffffff',
                        fontSize: '15px',
                        margin: 0,
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.message}
                      </p>
                    </div>

                    {/* Consensus Timestamp */}
                    <div style={{
                      fontSize: '11px',
                      color: '#a0aec0',
                      opacity: 0.7
                    }}>
                      Consensus: {msg.consensusTimestamp}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                backgroundColor: '#2c3e50',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#a0aec0',
                  fontSize: '16px'
                }}>
                  No messages found in this topic.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        {!hasSearched && !isLoading && (
          <div style={{
            backgroundColor: '#2c3e50',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #34495e'
          }}>
            <h4 style={{
              color: '#ffffff',
              fontSize: '16px',
              marginBottom: '15px'
            }}>
              Real-time Message Viewing
            </h4>
            <ul style={{
              color: '#a0aec0',
              fontSize: '14px',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li style={{ marginBottom: '8px' }}>
                Enter a topic ID to view all existing messages
              </li>
              <li style={{ marginBottom: '8px' }}>
                Automatically polls for new messages every 5 seconds
              </li>
              <li style={{ marginBottom: '8px' }}>
                New messages appear instantly without refreshing
              </li>
              <li>
                Use pause/play controls to manage real-time updates
              </li>
            </ul>
          </div>
        )}

        {/* Loading Animation */}
        {isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '40px'
          }}>
            <Loader2 
              size={40} 
              color="#00d4aa" 
              style={{ 
                margin: '0 auto 20px auto',
                animation: 'spin 1s linear infinite' 
              }} 
            />
            <p style={{
              color: '#a0aec0',
              fontSize: '16px'
            }}>
              Retrieving messages from topic...
            </p>
            <p style={{
              color: '#a0aec0',
              fontSize: '14px',
              marginTop: '10px'
            }}>
              Setting up real-time monitoring...
            </p>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ViewMessagesPage;