import { STORAGE_KEYS } from '../utils/constants';
import type { Transaction } from '../types/hedera.types';

class StorageService {
  
  saveCredentials(accountId: string, privateKey: string): void {
    try {
      console.log('Saving user credentials to localStorage...');
      localStorage.setItem(STORAGE_KEYS.ACCOUNT_ID, accountId);
      localStorage.setItem(STORAGE_KEYS.PRIVATE_KEY, privateKey);
      localStorage.setItem(STORAGE_KEYS.IS_CONNECTED, 'true');
      console.log('Credentials saved successfully');
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  }

  getAccountId(): string | null {
    try {
      const accountId = localStorage.getItem(STORAGE_KEYS.ACCOUNT_ID);
      return accountId;
    } catch (error) {
      console.error('Error getting account ID:', error);
      return null;
    }
  }

  getPrivateKey(): string | null {
    try {
      const privateKey = localStorage.getItem(STORAGE_KEYS.PRIVATE_KEY);
      return privateKey;
    } catch (error) {
      console.error('Error getting private key:', error);
      return null;
    }
  }

  isConnected(): boolean {
    try {
      const connected = localStorage.getItem(STORAGE_KEYS.IS_CONNECTED) === 'true';
      return connected;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  }

  clearCredentials(): void {
    try {
      console.log('Clearing all user data...');
      localStorage.removeItem(STORAGE_KEYS.ACCOUNT_ID);
      localStorage.removeItem(STORAGE_KEYS.PRIVATE_KEY);
      localStorage.removeItem(STORAGE_KEYS.IS_CONNECTED);
      this.clearTransactions();
      this.clearPreviousBalance();
      console.log('All user data cleared successfully');
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  }

  getStoredCredentials(): { accountId: string | null; privateKey: string | null } {
    return {
      accountId: this.getAccountId(),
      privateKey: this.getPrivateKey()
    };
  }

  saveTransactions(transactions: Transaction[]): void {
    try {
      const accountId = this.getAccountId();
      if (!accountId) {
        console.error('Cannot save transactions: No account ID found');
        return;
      }
      
      const storageKey = `transactions_${accountId}`;
      localStorage.setItem(storageKey, JSON.stringify(transactions));
      console.log(`Saved ${transactions.length} transactions for account ${accountId}`);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  getTransactions(): Transaction[] {
    try {
      const accountId = this.getAccountId();
      if (!accountId) {
        return [];
      }
      
      const storageKey = `transactions_${accountId}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const transactions = JSON.parse(stored);
        return transactions;
      } else {
        return [];
      }
      
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  addTransaction(transaction: Transaction): void {
    try {
      const existingTransactions = this.getTransactions();
      const updatedTransactions = [transaction, ...existingTransactions];
      this.saveTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }

  clearTransactions(): void {
    try {
      const accountId = this.getAccountId();
      if (accountId) {
        const storageKey = `transactions_${accountId}`;
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  }

  getTransactionCount(): number {
    return this.getTransactions().length;
  }

  savePreviousBalance(balance: number): void {
    try {
      const accountId = this.getAccountId();
      if (!accountId) {
        return;
      }
      
      const balanceKey = `balance_${accountId}`;
      localStorage.setItem(balanceKey, balance.toString());
    } catch (error) {
      console.error('Error saving previous balance:', error);
    }
  }

  getPreviousBalance(): number | null {
    try {
      const accountId = this.getAccountId();
      if (!accountId) {
        return null;
      }
      
      const balanceKey = `balance_${accountId}`;
      const stored = localStorage.getItem(balanceKey);
      
      if (stored) {
        return parseFloat(stored);
      } else {
        return null;
      }
      
    } catch (error) {
      console.error('Error getting previous balance:', error);
      return null;
    }
  }

  clearPreviousBalance(): void {
    try {
      const accountId = this.getAccountId();
      if (accountId) {
        const balanceKey = `balance_${accountId}`;
        localStorage.removeItem(balanceKey);
      }
    } catch (error) {
      console.error('Error clearing previous balance:', error);
    }
  }
}

export const storageService = new StorageService();