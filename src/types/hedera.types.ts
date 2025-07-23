// TypeScript types for Hedera Wallet
// These interfaces define the data structures used throughout the wallet application

// Basic account information interface
export interface AccountInfo {
  accountId: string;                    // Account ID like 0.0.123456
  balance: number;                      // HBAR balance as a number
  tokens: TokenBalance[];               // List of associated tokens
  transactions: number;                 // Number of transactions
     
  // Optional additional info
  accountMemo?: string;                 // Account memo/description
  publicKey?: string;                   // Account public key
}

// Token balance interface - for HTS tokens
export interface TokenBalance {
  tokenId: string;                      // Token ID like 0.0.789012
  balance: number;                      // How many tokens we have
  symbol?: string;                      // Token symbol like "USD"
  name?: string;                        // Token name like "US Dollar"
}

// Enhanced transaction interface - supports different transaction types
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'token_create' | 'token_associate' | 'token_send' | 'topic_create' | 'topic_message';  // All transaction types we support
  amount?: number;                      // Optional - not needed for some transaction types
  date: string;
  from?: string;
  to?: string;
  transactionId?: string;
  
  // Token creation specific fields - used when type is 'token_create'
  tokenName?: string;                   // Name of the created token
  tokenSymbol?: string;                 // Symbol of the created token  
  tokenId?: string;                     // ID of the created token or token being interacted with
  
  // Topic specific fields - used for topic operations
  topicId?: string;                     // Topic ID for topic_create or topic_message
  topicMemo?: string;                   // Topic memo/description
  sequenceNumber?: number;              // Message sequence number for topic_message
  message?: string;                     // Message content for topic_message
}

// Standard transaction result interface
export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  receipt?: any;
}

// HBAR sending transaction interface
export interface SendHbarTransaction {
  recipientId: string;
  amount: number;
}

// Token creation data interface
export interface CreateTokenData {
  name: string;
  symbol: string;
  initialSupply: number;
}

// Token sending transaction interface
export interface SendTokenTransaction {
  recipientId: string;
  tokenId: string;
  amount: number;
}

// Topic creation data interface
export interface CreateTopicData {
  memo: string;
  isPrivate: boolean;
}

// Topic message interface
export interface TopicMessage {
  sequenceNumber: number;
  message: string;
  timestamp: Date;
  consensusTimestamp: string;
}