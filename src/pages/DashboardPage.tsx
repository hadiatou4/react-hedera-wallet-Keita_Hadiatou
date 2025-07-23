// Dashboard Page Component - Main wallet interface after login
// This component manages the entire wallet dashboard including navigation,
// transaction history, and all wallet features

import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import BalanceCard from '../components/wallet/BalanceCard';
import TransactionList from '../components/wallet/TransactionList';
import AllTransactionsPage from './AllTransactionsPage';
import SendHbarPage from './SendHbarPage';
import CreateTokenPage from './CreateTokenPage';
import AssociateTokenPage from './AssociateTokenPage';
import SendTokenPage from './SendTokenPage';
import TopicsPage from './TopicsPage';
import { walletService } from '../services/wallet.service';
import { storageService } from '../services/storage.service';
import type { AccountInfo, Transaction } from '../types/hedera.types';

// Interface for component props
interface DashboardPageProps {
  onLogout: () => void;  // Function to handle logout action
}

// Main Dashboard component
const DashboardPage = ({ onLogout }: DashboardPageProps) => {
  
  // State for current page/view being displayed
  const [currentPage, setCurrentPage] = useState('overview');
  
  // State for account information from Hedera
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(true);
  
  // State for transaction history
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load account info and transactions when component mounts
  useEffect(() => {
    loadAccountInfo();
    loadStoredTransactions();
  }, []);

  // Load transaction history from localStorage
  const loadStoredTransactions = () => {
    const storedTransactions = storageService.getTransactions();
    setTransactions(storedTransactions);
  };

  // Check if balance increased (incoming transaction detection)
  const checkForIncomingTransactions = async (newBalance: number) => {
    try {
      // Get previous balance from storage
      const previousBalance = storageService.getPreviousBalance();
      
      // If balance increased, we received HBAR
      if (previousBalance !== null && newBalance > previousBalance) {
        const receivedAmount = parseFloat((newBalance - previousBalance).toFixed(8));
        
        // Create automatic receive transaction record
        const receiveTransaction: Transaction = {
          id: `receive_${Date.now()}`,
          type: 'receive',
          amount: receivedAmount,
          date: new Date().toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }).replace(',', ''),
          from: 'Unknown Account',
          to: accountInfo?.accountId,
          transactionId: `auto_receive_${Date.now()}`
        };
        
        // Save the new transaction
        storageService.addTransaction(receiveTransaction);
        const updatedTransactions = storageService.getTransactions();
        setTransactions(updatedTransactions);
        
        // Update transaction count in account info
        if (accountInfo) {
          setAccountInfo({
            ...accountInfo,
            transactions: updatedTransactions.length
          });
        }
        
        // Alert user about incoming transaction
        alert(`Incoming Transaction Detected!\n\nYou received ${receivedAmount} HBAR\n\nTransaction added to your history.`);
      }
      
      // Save current balance for next comparison
      storageService.savePreviousBalance(newBalance);
      
    } catch (error) {
      console.error('Error checking for incoming transactions:', error);
    }
  };

  // Load account information from Hedera network
  const loadAccountInfo = async () => {
    try {
      setIsLoading(true);
      
      // Get fresh account info from Hedera
      const info = await walletService.refreshAccountInfo();
      
      if (info) {
        // Check for incoming transactions by comparing balances
        await checkForIncomingTransactions(info.balance);
        
        // Get transaction count from localStorage
        const transactionCount = storageService.getTransactionCount();
        
        // Update account info with transaction count
        const updatedInfo = {
          ...info,
          transactions: transactionCount
        };
        setAccountInfo(updatedInfo);
      }
      
    } catch (error) {
      console.error('Error loading account info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new HBAR send/receive transactions
  const handleNewTransaction = (newTransaction: {
    type: 'send' | 'receive';
    amount: number;
    to?: string;
    from?: string;
    transactionId?: string;
  }) => {
    // Create transaction record
    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: newTransaction.type,
      amount: newTransaction.amount,
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ''),
      to: newTransaction.to,
      from: newTransaction.from,
      transactionId: newTransaction.transactionId
    };

    // Save transaction and update state
    storageService.addTransaction(transaction);
    const updatedTransactions = storageService.getTransactions();
    setTransactions(updatedTransactions);
    
    // Update transaction count in account info
    if (accountInfo) {
      const updatedAccountInfo = {
        ...accountInfo,
        transactions: updatedTransactions.length
      };
      setAccountInfo(updatedAccountInfo);
    }
  };

  // Handle token creation transaction
  const handleTokenCreated = (tokenInfo: {
    type: 'token_create';
    tokenName: string;
    tokenSymbol: string;
    tokenId: string;
    transactionId: string;
  }) => {
    // Create token creation transaction record
    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: 'token_create',
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ''),
      tokenName: tokenInfo.tokenName,
      tokenSymbol: tokenInfo.tokenSymbol,
      tokenId: tokenInfo.tokenId,
      transactionId: tokenInfo.transactionId
    };

    // Save transaction and update state
    storageService.addTransaction(transaction);
    const updatedTransactions = storageService.getTransactions();
    setTransactions(updatedTransactions);
    
    // Update transaction count in account info
    if (accountInfo) {
      const updatedAccountInfo = {
        ...accountInfo,
        transactions: updatedTransactions.length
      };
      setAccountInfo(updatedAccountInfo);
    }
    
    // Refresh account info to get updated token list
    loadAccountInfo();
  };

  // Handle token association transaction (NEW)
  const handleTokenAssociated = (tokenInfo: {
    type: 'token_associate';
    tokenId: string;
    transactionId: string;
  }) => {
    // Create token association transaction record
    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: 'token_associate',
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ''),
      tokenId: tokenInfo.tokenId,
      transactionId: tokenInfo.transactionId
    };

    // Save transaction and update state
    storageService.addTransaction(transaction);
    const updatedTransactions = storageService.getTransactions();
    setTransactions(updatedTransactions);
    
    // Update transaction count in account info
    if (accountInfo) {
      const updatedAccountInfo = {
        ...accountInfo,
        transactions: updatedTransactions.length
      };
      setAccountInfo(updatedAccountInfo);
    }
    
    // Refresh account info to get updated token associations
    loadAccountInfo();
  };

  // Handle token send transaction (NEW)
  const handleTokenSent = (tokenTransaction: {
    type: 'token_send';
    amount: number;
    to: string;
    from?: string;
    transactionId?: string;
    tokenId: string;
    tokenSymbol?: string;
  }) => {
    // Create token send transaction record
    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: 'token_send',
      amount: tokenTransaction.amount,
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ''),
      to: tokenTransaction.to,
      from: accountInfo?.accountId,
      tokenId: tokenTransaction.tokenId,
      tokenSymbol: tokenTransaction.tokenSymbol,
      transactionId: tokenTransaction.transactionId
    };

    // Save transaction and update state
    storageService.addTransaction(transaction);
    const updatedTransactions = storageService.getTransactions();
    setTransactions(updatedTransactions);
    
    // Update transaction count in account info
    if (accountInfo) {
      const updatedAccountInfo = {
        ...accountInfo,
        transactions: updatedTransactions.length
      };
      setAccountInfo(updatedAccountInfo);
    }
  };

  // Handle topic creation transaction (NEW)
  const handleTopicCreated = (topicInfo: {
    type: 'topic_create';
    topicId: string;
    topicMemo: string;
    transactionId: string;
  }) => {
    // Create topic creation transaction record
    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: 'topic_create',
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ''),
      topicId: topicInfo.topicId,
      topicMemo: topicInfo.topicMemo,
      transactionId: topicInfo.transactionId
    };

    // Save transaction and update state
    storageService.addTransaction(transaction);
    const updatedTransactions = storageService.getTransactions();
    setTransactions(updatedTransactions);
    
    // Update transaction count in account info
    if (accountInfo) {
      const updatedAccountInfo = {
        ...accountInfo,
        transactions: updatedTransactions.length
      };
      setAccountInfo(updatedAccountInfo);
    }
  };

  // Handle topic message transaction (NEW)
  const handleTopicMessage = (messageInfo: {
    type: 'topic_message';
    topicId: string;
    message: string;
    sequenceNumber: number;
    transactionId: string;
  }) => {
    // Create topic message transaction record
    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: 'topic_message',
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ''),
      topicId: messageInfo.topicId,
      message: messageInfo.message.substring(0, 50) + (messageInfo.message.length > 50 ? '...' : ''), // Truncate for display
      sequenceNumber: messageInfo.sequenceNumber,
      transactionId: messageInfo.transactionId
    };

    // Save transaction and update state
    storageService.addTransaction(transaction);
    const updatedTransactions = storageService.getTransactions();
    setTransactions(updatedTransactions);
    
    // Update transaction count in account info
    if (accountInfo) {
      const updatedAccountInfo = {
        ...accountInfo,
        transactions: updatedTransactions.length
      };
      setAccountInfo(updatedAccountInfo);
    }
  };

  // Handle navigation between different pages
  const handlePageChange = (page: string) => {
    switch (page) {
      case 'overview':
      case 'send-hbar':
      case 'create-token':
      case 'associate-token':
      case 'send-token':
      case 'topics':
        setCurrentPage(page);
        break;
      default:
        setCurrentPage('overview');
    }
  };

  // Handle logout action
  const handleLogout = () => {
    walletService.disconnectWallet();
    onLogout();
  };

  // Navigate to all transactions page
  const handleViewAllTransactions = () => {
    setCurrentPage('all-transactions');
  };

  // Navigate back to overview and refresh data
  const handleBackToOverview = () => {
    setCurrentPage('overview');
    loadAccountInfo();
  };

  // Render the overview page content
  const renderOverviewContent = () => {
    return (
      <div style={{ padding: '20px' }}>
        
        {/* Balance and account info card */}
        <BalanceCard 
          accountInfo={accountInfo} 
          isLoading={isLoading} 
        />
        


        {/* Transaction list or empty state */}
        {transactions.length > 0 ? (
          <TransactionList 
            transactions={transactions}
            onViewAll={handleViewAllTransactions} 
          />
        ) : (
          // Empty state when no transactions
          <div style={{
            backgroundColor: '#34495e',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              NO TRANSACTIONS YET
            </h3>
            <p style={{
              color: '#a0aec0',
              fontSize: '16px',
              marginBottom: '20px'
            }}>
              Your transaction history will appear here after you make your first transaction.
            </p>
            {/* Quick action buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage('send-hbar')}
                style={{
                  backgroundColor: '#00d4aa',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Send HBAR
              </button>
              <button
                onClick={() => setCurrentPage('create-token')}
                style={{
                  backgroundColor: '#00d4aa',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Token
              </button>
              <button
                onClick={() => setCurrentPage('associate-token')}
                style={{
                  backgroundColor: '#00d4aa',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Associate Token
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render all transactions page
  const renderAllTransactionsContent = () => {
    return (
      <AllTransactionsPage 
        transactions={transactions}
        onBack={handleBackToOverview} 
      />
    );
  };

  // Render send HBAR page
  const renderSendHbarContent = () => {
    return (
      <SendHbarPage 
        onBack={handleBackToOverview}
        onTransactionSuccess={handleNewTransaction}
      />
    );
  };

  // Render create token page
  const renderCreateTokenContent = () => {
    return (
      <CreateTokenPage 
        onBack={handleBackToOverview}
        onTokenCreated={handleTokenCreated}
      />
    );
  };

  // Render associate token page with new callback
  const renderAssociateTokenContent = () => {
    return (
      <AssociateTokenPage 
        onBack={handleBackToOverview}
        onAssociationSuccess={handleTokenAssociated}
      />
    );
  };

  // Render send token page
  const renderSendTokenContent = () => {
    return (
      <SendTokenPage 
        onBack={handleBackToOverview}
        onTransactionSuccess={handleTokenSent}
      />
    );
  };

  // Render topics page
  const renderTopicsContent = () => {
    return (
      <TopicsPage 
        onBack={handleBackToOverview}
        onTopicCreated={handleTopicCreated}
        onMessageSent={handleTopicMessage}
      />
    );
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#2c3e50'
    }}>
      
      {/* Sidebar navigation */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <div style={{
        flex: 1,
        backgroundColor: '#2c3e50',
        overflow: 'auto'
      }}>
        {/* Render current page based on state */}
        {currentPage === 'overview' && renderOverviewContent()}
        {currentPage === 'all-transactions' && renderAllTransactionsContent()}
        {currentPage === 'send-hbar' && renderSendHbarContent()}
        {currentPage === 'create-token' && renderCreateTokenContent()}
        {currentPage === 'associate-token' && renderAssociateTokenContent()}
        {currentPage === 'send-token' && renderSendTokenContent()}
        {currentPage === 'topics' && renderTopicsContent()}
      </div>
    </div>
  );
};

export default DashboardPage;