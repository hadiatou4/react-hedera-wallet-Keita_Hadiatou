// Storage Service Tests
// Comprehensive tests for localStorage management

// Create a simple localStorage mock without Jest mocks to avoid recursion
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  // Helper method to reset the store
  _reset(): void {
    this.store = {};
  }
}

// Create the mock instance
const localStorageMock = new LocalStorageMock();

// Replace global localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock constants
jest.mock('../utils/constants', () => ({
  STORAGE_KEYS: {
    ACCOUNT_ID: 'hedera_account_id',
    PRIVATE_KEY: 'hedera_private_key',
    IS_CONNECTED: 'hedera_is_connected'
  }
}));

// Import the service after mocking
import { storageService } from '../services/storage.service';

describe('StorageService', () => {
  
  beforeEach(() => {
    // Reset localStorage completely
    localStorageMock._reset();
  });

  describe('Credential Management', () => {
    it('should save credentials successfully', () => {
      // Arrange
      const accountId = '0.0.123456';
      const privateKey = 'test-private-key-123';

      // Act
      storageService.saveCredentials(accountId, privateKey);

      // Assert
      expect(localStorageMock.getItem('hedera_account_id')).toBe(accountId);
      expect(localStorageMock.getItem('hedera_private_key')).toBe(privateKey);
      expect(localStorageMock.getItem('hedera_is_connected')).toBe('true');
    });

    it('should retrieve account ID correctly', () => {
      // Arrange
      const accountId = '0.0.789012';
      localStorageMock.setItem('hedera_account_id', accountId);

      // Act
      const retrievedAccountId = storageService.getAccountId();

      // Assert
      expect(retrievedAccountId).toBe(accountId);
    });

    it('should retrieve private key correctly', () => {
      // Arrange
      const privateKey = 'secure-private-key-456';
      localStorageMock.setItem('hedera_private_key', privateKey);

      // Act
      const retrievedPrivateKey = storageService.getPrivateKey();

      // Assert
      expect(retrievedPrivateKey).toBe(privateKey);
    });

    it('should return null for missing credentials', () => {
      // Act & Assert
      expect(storageService.getAccountId()).toBeNull();
      expect(storageService.getPrivateKey()).toBeNull();
    });

    it('should check connection status correctly', () => {
      // Test connected state
      localStorageMock.setItem('hedera_is_connected', 'true');
      expect(storageService.isConnected()).toBe(true);

      // Test disconnected state
      localStorageMock.setItem('hedera_is_connected', 'false');
      expect(storageService.isConnected()).toBe(false);

      // Test missing state
      localStorageMock.removeItem('hedera_is_connected');
      expect(storageService.isConnected()).toBe(false);
    });

    it('should get stored credentials as object', () => {
      // Arrange
      const accountId = '0.0.111222';
      const privateKey = 'test-key-789';
      localStorageMock.setItem('hedera_account_id', accountId);
      localStorageMock.setItem('hedera_private_key', privateKey);

      // Act
      const credentials = storageService.getStoredCredentials();

      // Assert
      expect(credentials).toEqual({
        accountId: accountId,
        privateKey: privateKey
      });
    });

    it('should clear all credentials', () => {
      // Arrange
      localStorageMock.setItem('hedera_account_id', '0.0.123456');
      localStorageMock.setItem('hedera_private_key', 'test-key');
      localStorageMock.setItem('hedera_is_connected', 'true');

      // Act
      storageService.clearCredentials();

      // Assert
      expect(localStorageMock.getItem('hedera_account_id')).toBeNull();
      expect(localStorageMock.getItem('hedera_private_key')).toBeNull();
      expect(localStorageMock.getItem('hedera_is_connected')).toBeNull();
    });
  });

  describe('Transaction Management', () => {
    beforeEach(() => {
      // Set up an account for transaction tests
      localStorageMock.setItem('hedera_account_id', '0.0.123456');
    });

    it('should save transactions for current account', () => {
      // Arrange
      const transactions = [
        {
          id: 'tx1',
          type: 'send' as const,
          amount: 10,
          date: '2024-01-01',
          transactionId: 'tx-123'
        },
        {
          id: 'tx2',
          type: 'receive' as const,
          amount: 5,
          date: '2024-01-02',
          transactionId: 'tx-456'
        }
      ];

      // Act
      storageService.saveTransactions(transactions);

      // Assert
      const stored = localStorageMock.getItem('transactions_0.0.123456');
      expect(stored).toBe(JSON.stringify(transactions));
    });

    it('should retrieve transactions for current account', () => {
      // Arrange
      const transactions = [
        {
          id: 'tx1',
          type: 'token_create' as const,
          tokenName: 'Test Token',
          tokenSymbol: 'TEST',
          date: '2024-01-01'
        }
      ];
      localStorageMock.setItem('transactions_0.0.123456', JSON.stringify(transactions));

      // Act
      const retrievedTransactions = storageService.getTransactions();

      // Assert
      expect(retrievedTransactions).toEqual(transactions);
      expect(retrievedTransactions).toHaveLength(1);
    });

    it('should return empty array when no transactions exist', () => {
      // Act
      const transactions = storageService.getTransactions();

      // Assert
      expect(transactions).toEqual([]);
      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should add new transaction to existing list', () => {
      // Arrange
      const existingTransactions = [
        { id: 'tx1', type: 'send' as const, amount: 10, date: '2024-01-01' }
      ];
      localStorageMock.setItem('transactions_0.0.123456', JSON.stringify(existingTransactions));

      const newTransaction = {
        id: 'tx2',
        type: 'topic_create' as const,
        topicId: '0.0.789',
        topicMemo: 'Test Topic',
        date: '2024-01-02'
      };

      // Act
      storageService.addTransaction(newTransaction);

      // Assert
      const allTransactions = storageService.getTransactions();
      expect(allTransactions).toHaveLength(2);
      expect(allTransactions[0]).toEqual(newTransaction); // New transaction first
      expect(allTransactions[1]).toEqual(existingTransactions[0]);
    });

    it('should clear transactions for current account', () => {
      // Arrange
      const transactions = [{ id: 'tx1', type: 'send' as const, date: '2024-01-01' }];
      localStorageMock.setItem('transactions_0.0.123456', JSON.stringify(transactions));

      // Act
      storageService.clearTransactions();

      // Assert
      expect(localStorageMock.getItem('transactions_0.0.123456')).toBeNull();
    });

    it('should get correct transaction count', () => {
      // Arrange
      const transactions = [
        { id: 'tx1', type: 'send' as const, date: '2024-01-01' },
        { id: 'tx2', type: 'receive' as const, date: '2024-01-02' },
        { id: 'tx3', type: 'token_create' as const, date: '2024-01-03' }
      ];
      localStorageMock.setItem('transactions_0.0.123456', JSON.stringify(transactions));

      // Act
      const count = storageService.getTransactionCount();

      // Assert
      expect(count).toBe(3);
    });

    it('should not save transactions without account ID', () => {
      // Arrange
      localStorageMock.removeItem('hedera_account_id');
      const transactions = [{ id: 'tx1', type: 'send' as const, date: '2024-01-01' }];

      // Act
      storageService.saveTransactions(transactions);

      // Assert - No transactions should be saved
      expect(localStorageMock.getItem('transactions_')).toBeNull();
      expect(localStorageMock.getItem('transactions_null')).toBeNull();
    });
  });

  describe('Balance Management', () => {
    beforeEach(() => {
      localStorageMock.setItem('hedera_account_id', '0.0.123456');
    });

    it('should save previous balance', () => {
      // Arrange
      const balance = 150.75;

      // Act
      storageService.savePreviousBalance(balance);

      // Assert
      expect(localStorageMock.getItem('balance_0.0.123456')).toBe('150.75');
    });

    it('should retrieve previous balance', () => {
      // Arrange
      localStorageMock.setItem('balance_0.0.123456', '99.25');

      // Act
      const balance = storageService.getPreviousBalance();

      // Assert
      expect(balance).toBe(99.25);
      expect(typeof balance).toBe('number');
    });

    it('should return null for missing balance', () => {
      // Act
      const balance = storageService.getPreviousBalance();

      // Assert
      expect(balance).toBeNull();
    });

    it('should clear previous balance', () => {
      // Arrange
      localStorageMock.setItem('balance_0.0.123456', '100.50');

      // Act
      storageService.clearPreviousBalance();

      // Assert
      expect(localStorageMock.getItem('balance_0.0.123456')).toBeNull();
    });

    it('should not save balance without account ID', () => {
      // Arrange
      localStorageMock.removeItem('hedera_account_id');

      // Act
      storageService.savePreviousBalance(100);

      // Assert - No balance should be saved
      expect(localStorageMock.getItem('balance_')).toBeNull();
      expect(localStorageMock.getItem('balance_null')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Arrange - temporarily override setItem to throw error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error('localStorage full');
      };

      // Act & Assert - should not throw
      expect(() => {
        storageService.saveCredentials('0.0.123456', 'key');
      }).not.toThrow();

      // Restore original implementation
      localStorageMock.setItem = originalSetItem;
    });

    it('should handle JSON parse errors in getTransactions', () => {
      // Arrange
      localStorageMock.setItem('hedera_account_id', '0.0.123456');
      localStorageMock.setItem('transactions_0.0.123456', 'invalid-json');

      // Act
      const transactions = storageService.getTransactions();

      // Assert
      expect(transactions).toEqual([]);
    });

    it('should handle invalid balance data', () => {
      // Arrange
      localStorageMock.setItem('hedera_account_id', '0.0.123456');
      localStorageMock.setItem('balance_0.0.123456', 'not-a-number');

      // Act
      const balance = storageService.getPreviousBalance();

      // Assert
      expect(balance).toBeNaN(); // parseFloat returns NaN for invalid strings
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data isolation between accounts', () => {
      // Arrange & Act for first account
      localStorageMock.setItem('hedera_account_id', '0.0.111111');
      storageService.saveTransactions([{ id: 'tx1', type: 'send' as const, date: '2024-01-01' }]);
      
      // Arrange & Act for second account  
      localStorageMock.setItem('hedera_account_id', '0.0.222222');
      storageService.saveTransactions([{ id: 'tx2', type: 'receive' as const, date: '2024-01-02' }]);

      // Assert - Check isolation
      localStorageMock.setItem('hedera_account_id', '0.0.111111');
      const account1Transactions = storageService.getTransactions();
      expect(account1Transactions).toHaveLength(1);
      expect(account1Transactions[0].id).toBe('tx1');

      localStorageMock.setItem('hedera_account_id', '0.0.222222');
      const account2Transactions = storageService.getTransactions();
      expect(account2Transactions).toHaveLength(1);
      expect(account2Transactions[0].id).toBe('tx2');
    });

    it('should handle transaction type validation', () => {
      // Arrange - Set up clean account
      localStorageMock.setItem('hedera_account_id', '0.0.567890');
      
      const topicTransaction = {
        id: 'topic-tx',
        type: 'topic_message' as const,
        topicId: '0.0.555666',
        message: 'Hello HCS!',
        sequenceNumber: 1,
        date: '2024-01-01'
      };

      // Act - Add transaction to clean account
      storageService.addTransaction(topicTransaction);
      const transactions = storageService.getTransactions();

      // Assert - Verify transaction was added correctly
      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toEqual(topicTransaction);
      expect(transactions[0].type).toBe('topic_message');
      expect(transactions[0].sequenceNumber).toBe(1);
    });
  });
});