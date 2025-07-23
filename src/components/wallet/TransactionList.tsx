// Transaction List Component 
// Shows recent transactions with support for different transaction types

import { ArrowDownLeft, ArrowUpRight, ExternalLink, Plus, Link, Send, MessageSquarePlus, MessageSquare } from 'lucide-react';
import type { Transaction } from '../../types/hedera.types';

// Interface for component props
interface TransactionListProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

const TransactionList = ({ transactions, onViewAll }: TransactionListProps) => {
  
  // Show only the 3 most recent transactions for the dashboard
  const recentTransactions = transactions.slice(0, 3);

  // Helper function to get transaction label
  const getTransactionLabel = (transaction: Transaction): string => {
    switch (transaction.type) {
      case 'receive':
        return 'Receive HBAR';
      case 'send':
        return 'Send HBAR';
      case 'token_create':
        return 'Create Token';
      case 'token_associate':
        return 'Associate Token';
      case 'token_send':
        return 'Send Token';
      case 'topic_create':
        return 'Create Topic';
      case 'topic_message':
        return 'Send Message';
      default:
        return 'Transaction';
    }
  };

  // Helper function to get transaction icon
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'receive':
        return <ArrowDownLeft size={20} color="#ffffff" />;
      case 'send':
        return <ArrowUpRight size={20} color="#ffffff" />;
      case 'token_create':
        return <Plus size={20} color="#ffffff" />;
      case 'token_associate':
        return <Link size={20} color="#ffffff" />;
      case 'token_send':
        return <Send size={20} color="#ffffff" />;
      case 'topic_create':
        return <MessageSquarePlus size={20} color="#ffffff" />;
      case 'topic_message':
        return <MessageSquare size={20} color="#ffffff" />;
      default:
        return <ArrowUpRight size={20} color="#ffffff" />;
    }
  };

  return (
    <div style={{
      backgroundColor: '#34495e',
      borderRadius: '16px',
      padding: '30px'
    }}>
      
      {/* Header section with title and View All button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '600',
          letterSpacing: '0.1em',
          margin: 0
        }}>
          RECENT TRANSACTIONS
        </h3>
        
        {/* View All button */}
        <button
          onClick={onViewAll}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #00d4aa',
            color: '#00d4aa',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00d4aa';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#00d4aa';
          }}
        >
          View All
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Transaction items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 0',
              borderBottom: '1px solid #2a2e35'
            }}
          >
            
            {/* Left side - Icon and transaction details */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              
              {/* Transaction icon */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#00d4aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                {getTransactionIcon(transaction.type)}
              </div>

              {/* Transaction description and date */}
              <div>
                <p style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {getTransactionLabel(transaction)}
                </p>
                <p style={{
                  color: '#a0aec0',
                  fontSize: '14px'
                }}>
                  {transaction.date}
                </p>
              </div>
            </div>

            {/* Right side - Amount or token details */}
            <div style={{ textAlign: 'right' }}>
              
              {/* Display different info based on transaction type */}
              {transaction.type === 'token_create' ? (
                // For token creation - show symbol and token ID
                <div>
                  <p style={{
                    color: '#00d4aa',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {transaction.tokenSymbol}
                  </p>
                  <p style={{
                    color: '#a0aec0',
                    fontSize: '14px'
                  }}>
                    Token: {transaction.tokenId}
                  </p>
                </div>
              ) : transaction.type === 'token_associate' ? (
                // For token association - show token ID
                <div>
                  <p style={{
                    color: '#00d4aa',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    Associated
                  </p>
                  <p style={{
                    color: '#a0aec0',
                    fontSize: '14px'
                  }}>
                    Token: {transaction.tokenId}
                  </p>
                </div>
              ) : transaction.type === 'token_send' ? (
                // For token send - show amount and token ID
                <div>
                  <p style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    - {transaction.amount?.toLocaleString()}
                  </p>
                  <p style={{
                    color: '#a0aec0',
                    fontSize: '14px'
                  }}>
                    To: {transaction.to}<br />
                    Token: {transaction.tokenId}
                  </p>
                </div>
              ) : transaction.type === 'topic_create' ? (
                // For topic creation - show topic memo and ID
                <div>
                  <p style={{
                    color: '#00d4aa',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {transaction.topicMemo || 'New Topic'}
                  </p>
                  <p style={{
                    color: '#a0aec0',
                    fontSize: '14px'
                  }}>
                    Topic: {transaction.topicId}
                  </p>
                </div>
              ) : transaction.type === 'topic_message' ? (
                // For topic message - show message preview
                <div>
                  <p style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginBottom: '4px'
                  }}>
                    "{transaction.message}"
                  </p>
                  <p style={{
                    color: '#a0aec0',
                    fontSize: '14px'
                  }}>
                    Topic: {transaction.topicId}
                  </p>
                </div>
              ) : (
                // For HBAR transfers - show amount and account
                <div>
                  <p style={{
                    color: transaction.type === 'receive' ? '#00d4aa' : '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {transaction.type === 'receive' ? '+' : '-'} {transaction.amount?.toLocaleString()}
                  </p>
                  
                  {/* Show sender or recipient account */}
                  <p style={{
                    color: '#a0aec0',
                    fontSize: '14px'
                  }}>
                    {transaction.type === 'receive' ? 'From:' : 'To:'}<br />
                    {transaction.type === 'receive' ? transaction.from : transaction.to}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer showing transaction count */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        padding: '10px',
        color: '#a0aec0',
        fontSize: '14px'
      }}>
        Showing {recentTransactions.length} of {transactions.length} recent transactions
      </div>
    </div>
  );
};

export default TransactionList;