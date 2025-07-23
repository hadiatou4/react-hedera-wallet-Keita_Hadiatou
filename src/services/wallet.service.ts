// Wallet Service - Bridge between UI and Hedera network
// This service manages the connection between the UI and Hedera network

import { hederaService } from './hedera.service';
import { storageService } from './storage.service';
import type { 
  AccountInfo, 
  TransactionResult, 
  CreateTokenData, 
  // Removed SendTokenTransaction from imports since it's not used in this file
  CreateTopicData, 
  TopicMessage 
} from '../types/hedera.types';

// This class manages the wallet state and operations
class WalletService {
  // Private variable to track if wallet is connected
  private isWalletConnected: boolean = false;
  
  // Private variable to store current account info
  private currentAccountInfo: AccountInfo | null = null;

  // Method to connect wallet with account ID and private key
  async connectWallet(accountId: string, privateKey: string): Promise<boolean> {
    try {
      console.log('Attempting to connect wallet...');
      
      // Step 1: Try to initialize the Hedera client
      const success = await hederaService.initializeClient(accountId, privateKey);
      
      if (!success) {
        console.error('Failed to initialize Hedera client');
        return false;
      }

      // Step 2: If successful, save credentials to localStorage
      storageService.saveCredentials(accountId, privateKey);
      
      // Step 3: Set wallet as connected
      this.isWalletConnected = true;
      
      // Step 4: Get and store account information
      await this.refreshAccountInfo();
      
      console.log('Wallet connected successfully!');
      return true;
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }

  // Method to disconnect wallet and clear all data
  disconnectWallet(): void {
    try {
      console.log('Disconnecting wallet...');
      
      // Step 1: Disconnect from Hedera network
      hederaService.disconnect();
      
      // Step 2: Clear stored credentials
      storageService.clearCredentials();
      
      // Step 3: Reset local variables
      this.isWalletConnected = false;
      this.currentAccountInfo = null;
      
      console.log('Wallet disconnected successfully');
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  // Method to check if wallet is currently connected
  isConnected(): boolean {
    return this.isWalletConnected && storageService.isConnected();
  }

  // Method to get current account information
  getCurrentAccountInfo(): AccountInfo | null {
    return this.currentAccountInfo;
  }

  // Method to refresh account information from Hedera network
  async refreshAccountInfo(): Promise<AccountInfo | null> {
    try {
      console.log('Refreshing account info...');
      
      // Get fresh account info from Hedera
      const accountInfo = await hederaService.getAccountInfo();
      
      if (accountInfo) {
        // Store the updated info
        this.currentAccountInfo = accountInfo;
        console.log('Account info refreshed:', accountInfo);
      }
      
      return accountInfo;
      
    } catch (error) {
      console.error('Error refreshing account info:', error);
      return null;
    }
  }

  // Method to send HBAR to another account
  async sendHbar(recipientId: string, amount: number): Promise<TransactionResult> {
    try {
      console.log(`Sending ${amount} HBAR to ${recipientId}...`);
      
      // Use Hedera service to send HBAR
      const result = await hederaService.sendHbar({ recipientId, amount });
      
      // If successful, refresh account info to show new balance
      if (result.success) {
        await this.refreshAccountInfo();
        console.log('HBAR sent successfully!');
      }
      
      return result;
      
    } catch (error) {
      console.error('Error sending HBAR:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Method to create a new fungible token using Hedera Token Service
  async createToken(tokenData: CreateTokenData): Promise<TransactionResult & { tokenId?: string }> {
    try {
      console.log(`Creating token ${tokenData.name} (${tokenData.symbol}) with supply ${tokenData.initialSupply}...`);
      
      // Use Hedera service to create the token
      const result = await hederaService.createToken(tokenData);
      
      // If successful, refresh account info to show updated balance (token creation costs HBAR)
      if (result.success) {
        await this.refreshAccountInfo();
        console.log('Token created successfully!', result.tokenId);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error creating token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during token creation'
      };
    }
  }

  // Associate account with an existing token
  async associateToken(tokenId: string): Promise<TransactionResult> {
    try {
      console.log(`Associating account with token ${tokenId}...`);
      
      const result = await hederaService.associateToken(tokenId);
      
      if (result.success) {
        await this.refreshAccountInfo();
        console.log('Token association successful!');
      }
      
      return result;
      
    } catch (error) {
      console.error('Error associating token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during token association'
      };
    }
  }

  // Method to send tokens to another account
  async sendToken(tokenId: string, recipientId: string, amount: number): Promise<TransactionResult> {
    try {
      console.log(`Sending ${amount} tokens (${tokenId}) to ${recipientId}...`);
      
      // Use Hedera service to send tokens
      const result = await hederaService.sendToken({ 
        tokenId, 
        recipientId, 
        amount 
      });
      
      // If successful, refresh account info to show new token balance
      if (result.success) {
        await this.refreshAccountInfo();
        console.log('Tokens sent successfully!');
      }
      
      return result;
      
    } catch (error) {
      console.error('Error sending tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during token transfer'
      };
    }
  }

  // Method to create a new topic
  async createTopic(topicData: CreateTopicData): Promise<TransactionResult & { topicId?: string }> {
    try {
      console.log(`Creating topic: ${topicData.memo}...`);
      
      // Use Hedera service to create the topic
      const result = await hederaService.createTopic(topicData);
      
      // If successful, refresh account info (topic creation costs HBAR)
      if (result.success) {
        await this.refreshAccountInfo();
        console.log('Topic created successfully!', result.topicId);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error creating topic:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during topic creation'
      };
    }
  }

  // Method to send message to a topic
  async sendMessageToTopic(topicId: string, message: string): Promise<TransactionResult & { sequenceNumber?: number }> {
    try {
      console.log(`Sending message to topic ${topicId}...`);
      
      // Use Hedera service to send the message
      const result = await hederaService.sendMessageToTopic(topicId, message);
      
      // If successful, refresh account info (message submission costs HBAR)
      if (result.success) {
        await this.refreshAccountInfo();
        console.log('Message sent successfully!', result.sequenceNumber);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error sending message to topic:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during message submission'
      };
    }
  }

  // Method to retrieve messages from a topic
  async getTopicMessages(topicId: string, onMessage?: (message: TopicMessage) => void): Promise<TopicMessage[]> {
    try {
      console.log(`Retrieving messages from topic ${topicId}...`);
      
      // Use Hedera service to get messages
      const messages = await hederaService.getTopicMessages(topicId, onMessage);
      
      console.log(`Retrieved ${messages.length} messages`);
      return messages;
      
    } catch (error) {
      console.error('Error retrieving topic messages:', error);
      return [];
    }
  }

  // Method to try auto-connecting if credentials are stored
  async autoConnect(): Promise<boolean> {
    try {
      console.log('Checking for stored credentials...');
      
      // Check if we have stored credentials
      const { accountId, privateKey } = storageService.getStoredCredentials();
      
      if (accountId && privateKey) {
        console.log('Found stored credentials, attempting auto-connect...');
        return await this.connectWallet(accountId, privateKey);
      }
      
      console.log('No stored credentials found');
      return false;
      
    } catch (error) {
      console.error('Error during auto-connect:', error);
      return false;
    }
  }
}

// Export a single instance (singleton pattern)
export const walletService = new WalletService();