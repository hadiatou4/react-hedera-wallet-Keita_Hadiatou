// Hedera Network Constants - Complete Configuration
// This file contains all configuration constants for connecting to Hedera network
// and managing localStorage keys for data persistence

// ===== NETWORK CONFIGURATION =====

// Specify which Hedera network to use (testnet for development, mainnet for production)
export const HEDERA_NETWORK = 'testnet';

// Network endpoint configurations for different Hedera environments
export const NETWORK_CONFIG = {
  // Testnet configuration - used for development and testing
  testnet: {
    nodeAccountId: '0.0.3',                                    // Default Hedera testnet node
    nodeAddress: '35.237.200.180:50211',                     // Testnet node IP and port
    mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com'   // Mirror Node API for transaction history
  },
  
  // Mainnet configuration - used for production applications
  mainnet: {
    nodeAccountId: '0.0.3',                                    // Default Hedera mainnet node
    nodeAddress: '35.237.200.180:50211',                     // Mainnet node IP and port  
    mirrorNodeUrl: 'https://mainnet.mirrornode.hedera.com'   // Mirror Node API for mainnet
  }
};

// ===== LOCAL STORAGE KEYS =====

// Keys used for storing data in browser localStorage
// Using consistent naming convention with prefix to avoid conflicts
export const STORAGE_KEYS = {
  ACCOUNT_ID: 'hedera_account_id',        // User's Hedera account ID (e.g., "0.0.123456")
  PRIVATE_KEY: 'hedera_private_key',      // User's private key for signing transactions
  IS_CONNECTED: 'hedera_is_connected',    // Boolean flag for connection status
  TRANSACTIONS: 'hedera_transactions'     // Transaction history data (account-specific)
};

// ===== TRANSACTION CONFIGURATION =====

// Default transaction fee in HBAR (Hedera charges small fees for all transactions)
export const DEFAULT_TRANSACTION_FEE = 0.1;

// Transaction limits and validation constants
export const TRANSACTION_LIMITS = {
  MIN_HBAR_TRANSFER: 0.00000001,    // Minimum HBAR amount that can be transferred (1 tinybar)
  MAX_HBAR_TRANSFER: 50000000,      // Maximum HBAR amount for safety (50 million HBAR)
  MAX_MEMO_LENGTH: 100              // Maximum length for transaction memos
};

// ===== UI CONFIGURATION =====

// Display settings for the wallet interface
export const UI_CONFIG = {
  TRANSACTIONS_PER_PAGE: 10,        // Number of transactions to show per page
  RECENT_TRANSACTIONS_LIMIT: 3,    // Number of recent transactions on dashboard
  REFRESH_INTERVAL: 30000,         // Auto-refresh interval in milliseconds (30 seconds)
  DECIMAL_PLACES: 8                // Number of decimal places to show for HBAR amounts
};

// ===== API CONFIGURATION =====

// Configuration for external API calls
export const API_CONFIG = {
  MIRROR_NODE_TIMEOUT: 10000,      // Timeout for Mirror Node API calls (10 seconds)
  MAX_TRANSACTIONS_FETCH: 100,     // Maximum number of transactions to fetch at once
  RETRY_ATTEMPTS: 3                // Number of retry attempts for failed API calls
};

// ===== ERROR MESSAGES =====

// Standardized error messages for consistent user experience
export const ERROR_MESSAGES = {
  NETWORK_CONNECTION: 'Unable to connect to Hedera network. Please check your internet connection.',
  INVALID_ACCOUNT_ID: 'Invalid account ID format. Please use format: 0.0.123456',
  INVALID_PRIVATE_KEY: 'Invalid private key format. Please check your private key.',
  INSUFFICIENT_BALANCE: 'Insufficient HBAR balance for this transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  STORAGE_ERROR: 'Unable to save data locally. Please check your browser settings.'
};

// ===== SUCCESS MESSAGES =====

// Standardized success messages for user feedback
export const SUCCESS_MESSAGES = {
  CONNECTION_ESTABLISHED: 'Successfully connected to Hedera network!',
  TRANSACTION_SUBMITTED: 'Transaction submitted successfully!',
  ACCOUNT_INFO_LOADED: 'Account information loaded successfully.',
  TRANSACTIONS_SYNCED: 'Transaction history synchronized with network.'
};