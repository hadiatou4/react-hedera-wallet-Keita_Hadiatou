// Topics Page Component - Main Topics Interface
// Shows list of topics and navigation to topic-related features

import { useState } from 'react';
import { ArrowLeft, MessageSquare, Plus, Send, Eye } from 'lucide-react';
import CreateTopicPage from './CreateTopicPage';
import SendMessagePage from './SendMessagePage';
import ViewMessagesPage from './ViewMessagePage';

// Interface for component props
interface TopicsPageProps {
  onBack: () => void;
  onTopicCreated?: (topicInfo: {
    type: 'topic_create';
    topicId: string;
    topicMemo: string;
    transactionId: string;
  }) => void;
  onMessageSent?: (messageInfo: {
    type: 'topic_message';
    topicId: string;
    message: string;
    sequenceNumber: number;
    transactionId: string;
  }) => void;
}

// Topics overview page component
const TopicsPage = ({ onBack, onTopicCreated, onMessageSent }: TopicsPageProps) => {
  
  // State for current view
  const [currentView, setCurrentView] = useState<'overview' | 'create' | 'send' | 'view'>('overview');

  // Handle navigation back to topics overview
  const handleBackToTopics = () => {
    setCurrentView('overview');
  };

  // Render create topic page
  if (currentView === 'create') {
    return (
      <CreateTopicPage 
        onBack={handleBackToTopics}
        onTopicCreated={(topicInfo: {
          type: 'topic_create';
          topicId: string;
          topicMemo: string;
          transactionId: string;
        }) => {
          // Add to topics list in real implementation
          if (onTopicCreated) {
            onTopicCreated(topicInfo);
          }
          setCurrentView('overview');
        }}
      />
    );
  }

  // Render send message page
  if (currentView === 'send') {
    return (
      <SendMessagePage 
        onBack={handleBackToTopics}
        onMessageSent={(messageInfo: {
          type: 'topic_message';
          topicId: string;
          message: string;
          sequenceNumber: number;
          transactionId: string;
        }) => {
          if (onMessageSent) {
            onMessageSent(messageInfo);
          }
          setCurrentView('overview');
        }}
      />
    );
  }

  // Render view messages page
  if (currentView === 'view') {
    return (
      <ViewMessagesPage 
        onBack={handleBackToTopics}
      />
    );
  }

  // Render topics overview
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
            <MessageSquare size={30} color="#ffffff" />
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            Topics
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Manage your Hedera Consensus Service topics
          </p>
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Create Topic */}
          <button
            onClick={() => setCurrentView('create')}
            style={{
              backgroundColor: '#2c3e50',
              border: '2px solid #00d4aa',
              borderRadius: '12px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00d4aa';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2c3e50';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={40} color="#ffffff" style={{ margin: '0 auto 15px auto' }} />
            <h3 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 10px 0' }}>
              Create Topic
            </h3>
            <p style={{ color: '#a0aec0', fontSize: '14px', margin: 0 }}>
              Create a new HCS topic
            </p>
          </button>

          {/* Send Message */}
          <button
            onClick={() => setCurrentView('send')}
            style={{
              backgroundColor: '#2c3e50',
              border: '2px solid #00d4aa',
              borderRadius: '12px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00d4aa';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2c3e50';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Send size={40} color="#ffffff" style={{ margin: '0 auto 15px auto' }} />
            <h3 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 10px 0' }}>
              Send Message
            </h3>
            <p style={{ color: '#a0aec0', fontSize: '14px', margin: 0 }}>
              Send message to a topic
            </p>
          </button>

          {/* View Messages */}
          <button
            onClick={() => setCurrentView('view')}
            style={{
              backgroundColor: '#2c3e50',
              border: '2px solid #00d4aa',
              borderRadius: '12px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00d4aa';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2c3e50';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Eye size={40} color="#ffffff" style={{ margin: '0 auto 15px auto' }} />
            <h3 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 10px 0' }}>
              View Messages
            </h3>
            <p style={{ color: '#a0aec0', fontSize: '14px', margin: 0 }}>
              Read topic messages
            </p>
          </button>
        </div>

        {/* Info section about HCS Topics */}
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
            Hedera Consensus Service (HCS)
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '10px',
            fontSize: '14px'
          }}>
            <div>
              <span style={{ color: '#a0aec0' }}>Network:</span>
              <span style={{ color: '#ffffff', marginLeft: '10px' }}>Hedera Testnet</span>
            </div>
            <div>
              <span style={{ color: '#a0aec0' }}>Message Fee:</span>
              <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.0001 HBAR per message</span>
            </div>
            <div>
              <span style={{ color: '#a0aec0' }}>Topic Creation:</span>
              <span style={{ color: '#ffffff', marginLeft: '10px' }}>~0.01 HBAR</span>
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
              <li>Create topics for organized message channels</li>
              <li>Use private topics for restricted access</li>
              <li>Messages are immutable and permanently stored</li>
              <li>Real-time message monitoring available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;