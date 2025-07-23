// Hedera Service for managing blockchain operations
// This service handles all interactions with the Hedera network including
// account management, balance queries, transactions, and token creation

import {
  Client,
  AccountId,
  PrivateKey,
  AccountBalanceQuery,
  TransferTransaction,
  TokenCreateTransaction,
  TokenAssociateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  // Removed TopicId import since it's not used anywhere in the code
} from '@hashgraph/sdk';

import type { 
  AccountInfo, 
  TransactionResult, 
  SendHbarTransaction,
  CreateTokenData,
  SendTokenTransaction,
  CreateTopicData,
  TopicMessage
} from '../types/hedera.types';

class HederaService {
  private client: Client | null = null;
  private accountId: AccountId | null = null;
  private privateKey: PrivateKey | null = null;

  // Initialize connection to Hedera network with user credentials
  async initializeClient(accountIdString: string, privateKeyString: string): Promise<boolean> {
    try {
      console.log('Connecting to Hedera network...');
      
      // Parse user-provided credentials into Hedera objects
      this.accountId = AccountId.fromString(accountIdString);
      this.privateKey = PrivateKey.fromString(privateKeyString);

      // Create client connection to Hedera testnet
      this.client = Client.forTestnet();

      // Set the user account as the transaction operator
      this.client.setOperator(this.accountId, this.privateKey);

      console.log('Successfully connected to Hedera!');
      return true;
      
    } catch (error) {
      console.error('Failed to connect to Hedera:', error);
      return false;
    }
  }

  // Retrieve account information from Hedera network
  async getAccountInfo(): Promise<AccountInfo | null> {
    try {
      console.log('Fetching account information from Hedera...');
      
      // Ensure we have an active connection
      if (!this.client || !this.accountId) {
        throw new Error('Not connected to Hedera network');
      }

      // Query account balance from the network
      const balanceQuery = new AccountBalanceQuery().setAccountId(this.accountId);
      const balance = await balanceQuery.execute(this.client);

      // Convert balance from tinybars to HBAR (1 HBAR = 100,000,000 tinybars)
      const hbarBalance = balance.hbars.toTinybars().toNumber() / 100000000;
      console.log('Current HBAR Balance:', hbarBalance);

      // Process associated tokens - Simple approach
      const tokensList: any[] = [];
      
      // Check if account has any associated tokens
      if (balance.tokens) {
        console.log('Account has associated tokens - will implement token processing later');
        // TODO: Implement proper token processing when needed
      } else {
        console.log('No associated tokens found');
      }

      // Build account information object
      const accountInfo: AccountInfo = {
        // Core account details
        accountId: this.accountId.toString(),
        balance: hbarBalance,
        tokens: tokensList,  
        transactions: 0,     // Will be managed by localStorage and balance detection
        
        // Additional metadata (to be implemented later if needed)
        accountMemo: '',  
        publicKey: ''     
      };

      console.log('Account information retrieved successfully:', accountInfo);
      return accountInfo;
      
    } catch (error) {
      console.error('Error retrieving account information:', error);
      return null;
    }
  }

  // Execute HBAR transfer to another account
  async sendHbar(transaction: SendHbarTransaction): Promise<TransactionResult> {
    try {
      console.log(`Initiating transfer of ${transaction.amount} HBAR to ${transaction.recipientId}...`);
      
      // Verify connection before attempting transaction
      if (!this.client || !this.accountId || !this.privateKey) {
        throw new Error('Not connected to Hedera network');
      }

      // Convert HBAR to tinybars for precise calculations
      const amountInTinybars = transaction.amount * 100000000;

      // Create transfer transaction with sender and receiver
      const transferTransaction = new TransferTransaction()
        .addHbarTransfer(this.accountId, Hbar.fromTinybars(-amountInTinybars)) // Deduct from sender
        .addHbarTransfer(transaction.recipientId, Hbar.fromTinybars(amountInTinybars)) // Add to receiver
        .freezeWith(this.client);

      // Sign transaction with private key and submit to network
      const signedTransaction = await transferTransaction.sign(this.privateKey);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      console.log('HBAR transfer completed successfully!');
      return {
        success: true,
        transactionId: response.transactionId.toString(),
        receipt: receipt
      };
      
    } catch (error) {
      console.error('Error during HBAR transfer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Create a new fungible token using Hedera Token Service (HTS)
  async createToken(tokenData: CreateTokenData): Promise<TransactionResult & { tokenId?: string }> {
    try {
      console.log(`Creating new token: ${tokenData.name} (${tokenData.symbol}) with supply ${tokenData.initialSupply}...`);
      
      // Verify connection before attempting transaction
      if (!this.client || !this.accountId || !this.privateKey) {
        throw new Error('Not connected to Hedera network');
      }

      // Create token creation transaction
      const tokenCreateTransaction = new TokenCreateTransaction()
        .setTokenName(tokenData.name)                    // Token name (e.g., "My Awesome Token")
        .setTokenSymbol(tokenData.symbol)                // Token symbol (e.g., "MAT")
        .setTokenType(TokenType.FungibleCommon)          // Fungible token type
        .setDecimals(2)                                  // Number of decimal places (2 = like cents)
        .setInitialSupply(tokenData.initialSupply * 100) // Convert to smallest unit (multiply by decimals)
        .setSupplyType(TokenSupplyType.Infinite)         // Allow supply changes later
        .setTreasuryAccountId(this.accountId)            // Set creator as treasury account
        .setAdminKey(this.privateKey)                    // Admin key for token management
        .setSupplyKey(this.privateKey)                   // Supply key for minting/burning
        .setFreezeDefault(false)                         // Tokens are not frozen by default
        .setMaxTransactionFee(Hbar.fromTinybars(1000000000)) // Set max fee (10 HBAR)
        .freezeWith(this.client);

      // Sign transaction with private key and submit to network
      console.log('Signing token creation transaction...');
      const signedTransaction = await tokenCreateTransaction.sign(this.privateKey);
      
      console.log('Submitting token creation transaction to network...');
      const response = await signedTransaction.execute(this.client);
      
      console.log('Waiting for transaction receipt...');
      const receipt = await response.getReceipt(this.client);
      
      // Get the new token ID from the receipt
      const tokenId = receipt.tokenId?.toString();
      
      if (!tokenId) {
        throw new Error('Token creation succeeded but no token ID returned');
      }

      console.log(`Token created successfully! Token ID: ${tokenId}`);
      return {
        success: true,
        transactionId: response.transactionId.toString(),
        tokenId: tokenId,
        receipt: receipt
      };
      
    } catch (error) {
      console.error('Error during token creation:', error);
      
      // Provide more specific error messages for common issues
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('INSUFFICIENT_ACCOUNT_BALANCE')) {
          errorMessage = 'Insufficient HBAR balance. Token creation requires approximately 1-2 HBAR.';
        } else if (error.message.includes('INVALID_TOKEN_SYMBOL')) {
          errorMessage = 'Invalid token symbol. Use 1-100 alphanumeric characters.';
        } else if (error.message.includes('INVALID_TOKEN_NAME')) {
          errorMessage = 'Invalid token name. Use 1-100 characters.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Associate account with an existing token
  async associateToken(tokenId: string): Promise<TransactionResult> {
    try {
      console.log(`Associating account with token ${tokenId}...`);
      
      if (!this.client || !this.accountId || !this.privateKey) {
        throw new Error('Not connected to Hedera network');
      }

      // Create token association transaction
      const associateTransaction = new TokenAssociateTransaction()
        .setAccountId(this.accountId)
        .setTokenIds([tokenId])
        .freezeWith(this.client);

      // Sign and submit transaction
      const signedTransaction = await associateTransaction.sign(this.privateKey);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      console.log(`Token association completed successfully!`);
      return {
        success: true,
        transactionId: response.transactionId.toString(),
        receipt: receipt
      };
      
    } catch (error) {
      console.error('Error during token association:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT')) {
          errorMessage = 'This token is already associated with your account.';
        } else if (error.message.includes('INVALID_TOKEN_ID')) {
          errorMessage = 'Invalid token ID. Please check the token ID format.';
        } else if (error.message.includes('TOKEN_NOT_FOUND')) {
          errorMessage = 'Token not found. Please verify the token ID exists.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Send tokens to another account (NEW METHOD)
  async sendToken(transaction: SendTokenTransaction): Promise<TransactionResult> {
    try {
      console.log(`Initiating transfer of ${transaction.amount} tokens (${transaction.tokenId}) to ${transaction.recipientId}...`);
      
      // Verify connection before attempting transaction
      if (!this.client || !this.accountId || !this.privateKey) {
        throw new Error('Not connected to Hedera network');
      }

      // Convert amount to smallest unit (assuming 2 decimals)
      const amountInSmallestUnit = transaction.amount * 100;

      // Create token transfer transaction
      const tokenTransferTransaction = new TransferTransaction()
        .addTokenTransfer(transaction.tokenId, this.accountId, -amountInSmallestUnit) // Deduct from sender
        .addTokenTransfer(transaction.tokenId, transaction.recipientId, amountInSmallestUnit) // Add to receiver
        .freezeWith(this.client);

      // Sign transaction with private key and submit to network
      const signedTransaction = await tokenTransferTransaction.sign(this.privateKey);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      console.log('Token transfer completed successfully!');
      return {
        success: true,
        transactionId: response.transactionId.toString(),
        receipt: receipt
      };
      
    } catch (error) {
      console.error('Error during token transfer:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('INSUFFICIENT_TOKEN_BALANCE')) {
          errorMessage = 'Insufficient token balance for this transfer.';
        } else if (error.message.includes('TOKEN_NOT_ASSOCIATED_TO_ACCOUNT')) {
          errorMessage = 'Recipient has not associated with this token. They must associate first.';
        } else if (error.message.includes('INVALID_ACCOUNT_ID')) {
          errorMessage = 'Invalid recipient account ID.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Create a new topic on Hedera Consensus Service
  async createTopic(topicData: CreateTopicData): Promise<TransactionResult & { topicId?: string }> {
    try {
      console.log(`Creating new topic with memo: ${topicData.memo}...`);
      
      // Verify connection before attempting transaction
      if (!this.client || !this.accountId || !this.privateKey) {
        throw new Error('Not connected to Hedera network');
      }

      // Create topic creation transaction
      const topicCreateTransaction = new TopicCreateTransaction()
        .setTopicMemo(topicData.memo);  // Set topic description/memo

      // If topic is private, set admin and submit keys
      if (topicData.isPrivate) {
        topicCreateTransaction
          .setAdminKey(this.privateKey)   // Admin key for topic management
          .setSubmitKey(this.privateKey); // Submit key restricts who can send messages
      }

      // Freeze and sign transaction
      const frozenTransaction = topicCreateTransaction.freezeWith(this.client);
      const signedTransaction = await frozenTransaction.sign(this.privateKey);
      
      console.log('Submitting topic creation transaction to network...');
      const response = await signedTransaction.execute(this.client);
      
      console.log('Waiting for transaction receipt...');
      const receipt = await response.getReceipt(this.client);
      
      // Get the new topic ID from the receipt
      const topicId = receipt.topicId?.toString();
      
      if (!topicId) {
        throw new Error('Topic creation succeeded but no topic ID returned');
      }

      console.log(`Topic created successfully! Topic ID: ${topicId}`);
      return {
        success: true,
        transactionId: response.transactionId.toString(),
        topicId: topicId,
        receipt: receipt
      };
      
    } catch (error) {
      console.error('Error during topic creation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during topic creation'
      };
    }
  }

  // Send message to a topic
  async sendMessageToTopic(topicId: string, message: string): Promise<TransactionResult & { sequenceNumber?: number }> {
    try {
      console.log(`Sending message to topic ${topicId}...`);
      
      // Verify connection before attempting transaction
      if (!this.client || !this.accountId || !this.privateKey) {
        throw new Error('Not connected to Hedera network');
      }

      // Create message submit transaction
      const messageTransaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message)
        .freezeWith(this.client);

      // Sign and submit transaction
      const signedTransaction = await messageTransaction.sign(this.privateKey);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      // Get sequence number from receipt
      const sequenceNumber = receipt.topicSequenceNumber?.toNumber();

      console.log(`Message sent successfully! Sequence number: ${sequenceNumber}`);
      return {
        success: true,
        transactionId: response.transactionId.toString(),
        sequenceNumber: sequenceNumber,
        receipt: receipt
      };
      
    } catch (error) {
      console.error('Error sending message to topic:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('INVALID_TOPIC_ID')) {
          errorMessage = 'Invalid topic ID. Please check the topic ID format.';
        } else if (error.message.includes('UNAUTHORIZED')) {
          errorMessage = 'You are not authorized to send messages to this topic.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

// Retrieve messages from a topic using Mirror Node API 
  async getTopicMessages(topicId: string, onMessage?: (message: TopicMessage) => void): Promise<TopicMessage[]> {
    try {
      console.log(`Retrieving messages from topic ${topicId} using Mirror Node API...`);
      
      const messages: TopicMessage[] = [];
      
      // Use Hedera Mirror Node REST API to get topic messages
      const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
      
      console.log(`Fetching from: ${mirrorNodeUrl}`);
      
      try {
        const response = await fetch(mirrorNodeUrl);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Topic not found or has no messages');
            return messages;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Mirror Node response:', data);
        
        if (data.messages && Array.isArray(data.messages)) {
          // Process each message from the API response
          for (const msg of data.messages) {
            try {
              // Decode the base64 message content
              let messageContent = '';
              if (msg.message) {
                try {
                  // The message is base64 encoded in the API response
                  messageContent = atob(msg.message);
                } catch (decodeError) {
                  console.warn('Failed to decode message content:', decodeError);
                  messageContent = msg.message; // Use as-is if decode fails
                }
              }
              
              const topicMessage: TopicMessage = {
                sequenceNumber: parseInt(msg.sequence_number),
                message: messageContent,
                timestamp: new Date(parseFloat(msg.consensus_timestamp) * 1000),
                consensusTimestamp: msg.consensus_timestamp
              };
              
              console.log(`Retrieved message #${topicMessage.sequenceNumber}: "${topicMessage.message}"`);
              messages.push(topicMessage);
              
              // Call callback if provided (for real-time updates)
              if (onMessage) {
                onMessage(topicMessage);
              }
              
            } catch (msgError) {
              console.error('Error processing message:', msgError, msg);
            }
          }
          
          // Sort messages by sequence number to ensure correct order
          messages.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          
          console.log(`Successfully retrieved ${messages.length} messages from topic`);
        } else {
          console.log('No messages found in API response');
        }
        
      } catch (fetchError) {
        console.error('Error fetching from Mirror Node API:', fetchError);
        
        // If Mirror Node fails, return empty array but don't throw
        if (fetchError instanceof Error && fetchError.message.includes('fetch')) {
          throw new Error('Unable to connect to Hedera Mirror Node. Please check your internet connection.');
        }
        throw fetchError;
      }
      
      return messages;
      
    } catch (error) {
      console.error('Error retrieving topic messages:', error);
      
      // Return more specific error information
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          console.log('Topic has no messages or does not exist');
          return []; // Return empty array for topics with no messages
        }
      }
      
      // For other errors, still return empty array but log the error
      return [];
    }
  }
  // Clean up connection and reset state
  disconnect(): void {
    try {
      console.log('Disconnecting from Hedera network...');
      
      if (this.client) {
        this.client.close();
      }
      
      // Clear all connection data for security
      this.client = null;
      this.accountId = null;
      this.privateKey = null;
      
      console.log('Disconnected successfully');
      
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }

  // Check current connection status
  isConnected(): boolean {
    return this.client !== null && this.accountId !== null;
  }
}

// Export singleton instance for application use
export const hederaService = new HederaService();