// All Transactions Page Component
// Shows complete transaction history with enhanced support for all transaction types

import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Plus, Link, Send, MessageSquarePlus, MessageSquare } from 'lucide-react';
import type { Transaction } from '../types/hedera.types';

// Interface for component props
interface AllTransactionsPageProps {
  transactions: Transaction[];
  onBack: () => void;
}

// All Transactions page component
const AllTransactionsPage = ({ transactions, onBack }: AllTransactionsPageProps) => {
  
  // Helper function to get transaction label
  const getTransactionLabel = (transaction: Transaction): string => {
    switch (transaction.type) {
      case 'receive':
        return 'Received HBAR';
      case 'send':
        return 'Sent HBAR';
      case 'token_create':
        return 'Created Token';
      case 'token_associate':
        return 'Associated Token';
      case 'token_send':
        return 'Sent Token';
      case 'topic_create':
        return 'Created Topic';
      case 'topic_message':
        return 'Sent Message';
      default:
        return 'Transaction';
    }
  };

  // Helper function to get transaction icon
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'receive':
        return <ArrowDownLeft size={24} color="#ffffff" />;
      case 'send':
        return <ArrowUpRight size={24} color="#ffffff" />;
      case 'token_create':
        return <Plus size={24} color="#ffffff" />;
      case 'token_associate':
        return <Link size={24} color="#ffffff" />;
      case 'token_send':
        return <Send size={24} color="#ffffff" />;
      case 'topic_create':
        return <MessageSquarePlus size={24} color="#ffffff" />;
      case 'topic_message':
        return <MessageSquare size={24} color="#ffffff" />;
      default:
        return <ArrowUpRight size={24} color="#ffffff" />;
    }
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
          marginBottom: '40px'
        }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            All Transactions
          </h1>
          <p style={{
            color: '#a0aec0',
            fontSize: '1.1rem'
          }}>
            Complete history of your HBAR and token transactions
          </p>
        </div>

        {/* Transaction list */}
        {transactions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  backgroundColor: '#2c3e50',
                  borderRadius: '12px',
                  border: '1px solid #34495e'
                }}
              >
                
                {/* Left side - Icon and details */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  
                  {/* Transaction icon */}
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    backgroundColor: '#00d4aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '20px'
                  }}>
                    {getTransactionIcon(transaction.type)}
                  </div>

                  {/* Transaction details */}
                  <div>
                    <p style={{
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>
                      {getTransactionLabel(transaction)}
                    </p>
                    <p style={{
                      color: '#a0aec0',
                      fontSize: '14px',
                      marginBottom: '5px'
                    }}>
                      {transaction.date}
                    </p>
                    {transaction.transactionId && (
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '12px'
                      }}>
                        TX: {transaction.transactionId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side - Amount or token info */}
                <div style={{ textAlign: 'right' }}>
                  
                  {transaction.type === 'token_create' ? (
                    // For token creation - show token details
                    <div>
                      <p style={{
                        color: '#00d4aa',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '5px'
                      }}>
                        {transaction.tokenSymbol}
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '14px',
                        marginBottom: '5px'
                      }}>
                        {transaction.tokenName}
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '12px'
                      }}>
                        Token ID: {transaction.tokenId}
                      </p>
                    </div>
                  ) : transaction.type === 'token_associate' ? (
                    // For token association - show token ID and status
                    <div>
                      <p style={{
                        color: '#00d4aa',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '5px'
                      }}>
                        Association Complete
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '14px'
                      }}>
                        Token ID: {transaction.tokenId}
                      </p>
                    </div>
                  ) : transaction.type === 'token_send' ? (
                    // For token send - show amount and details
                    <div>
                      <p style={{
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '5px'
                      }}>
                        - {transaction.amount?.toLocaleString()} tokens
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '14px',
                        marginBottom: '2px'
                      }}>
                        To: {transaction.to}
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '12px'
                      }}>
                        Token: {transaction.tokenId}
                      </p>
                    </div>
                  ) : transaction.type === 'topic_create' ? (
                    // For topic creation - show topic details
                    <div>
                      <p style={{
                        color: '#00d4aa',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '5px'
                      }}>
                        {transaction.topicMemo || 'New Topic'}
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '14px'
                      }}>
                        Topic ID: {transaction.topicId}
                      </p>
                    </div>
                  ) : transaction.type === 'topic_message' ? (
                    // For topic message - show message and sequence
                    <div>
                      <p style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontStyle: 'italic',
                        marginBottom: '5px'
                      }}>
                        "{transaction.message}"
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '14px',
                        marginBottom: '2px'
                      }}>
                        Topic: {transaction.topicId}
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '12px'
                      }}>
                        Sequence: #{transaction.sequenceNumber}
                      </p>
                    </div>
                  ) : (
                    // For HBAR transactions - show amount and account
                    <div>
                      <p style={{
                        color: transaction.type === 'receive' ? '#00d4aa' : '#ffffff',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '5px'
                      }}>
                        {transaction.type === 'receive' ? '+' : '-'} {transaction.amount?.toLocaleString()} HBAR
                      </p>
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '14px'
                      }}>
                        {transaction.type === 'receive' ? 'From:' : 'To:'} {transaction.type === 'receive' ? transaction.from : transaction.to}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#a0aec0'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              No Transactions Yet
            </h3>
            <p style={{
              fontSize: '16px'
            }}>
              Your transaction history will appear here once you start using your wallet.
            </p>
          </div>
        )}

        {/* Footer with transaction count */}
        {transactions.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#2c3e50',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#a0aec0',
              fontSize: '14px',
              margin: 0
            }}>
              Total: {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactionsPage;