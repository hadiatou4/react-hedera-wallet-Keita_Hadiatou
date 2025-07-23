// Hedera Types Tests
// Tests for TypeScript interfaces and type validation

import type {
  AccountInfo,
  TokenBalance,
  Transaction,
  TransactionResult,
  SendHbarTransaction,
  CreateTokenData,
  SendTokenTransaction,
  CreateTopicData,
  TopicMessage
} from '../types/hedera.types';

describe('Hedera Types Validation', () => {

  describe('AccountInfo Interface', () => {
    it('should validate complete AccountInfo structure', () => {
      const accountInfo: AccountInfo = {
        accountId: '0.0.123456',
        balance: 150.75,
        tokens: [
          {
            tokenId: '0.0.789012',
            balance: 100,
            symbol: 'TEST',
            name: 'Test Token'
          }
        ],
        transactions: 25,
        accountMemo: 'Test Account Memo',
        publicKey: 'test-public-key-string'
      };

      // Validate required fields
      expect(accountInfo.accountId).toBeDefined();
      expect(typeof accountInfo.accountId).toBe('string');
      expect(accountInfo.accountId).toMatch(/^0\.0\.\d+$/);

      expect(accountInfo.balance).toBeDefined();
      expect(typeof accountInfo.balance).toBe('number');
      expect(accountInfo.balance).toBeGreaterThanOrEqual(0);

      expect(Array.isArray(accountInfo.tokens)).toBe(true);
      expect(typeof accountInfo.transactions).toBe('number');

      // Validate optional fields
      expect(typeof accountInfo.accountMemo).toBe('string');
      expect(typeof accountInfo.publicKey).toBe('string');
    });

    it('should validate minimal AccountInfo structure', () => {
      const minimalAccountInfo: AccountInfo = {
        accountId: '0.0.999999',
        balance: 0,
        tokens: [],
        transactions: 0
      };

      expect(minimalAccountInfo.accountId).toBeDefined();
      expect(minimalAccountInfo.balance).toBe(0);
      expect(minimalAccountInfo.tokens).toHaveLength(0);
      expect(minimalAccountInfo.transactions).toBe(0);
    });
  });

  describe('TokenBalance Interface', () => {
    it('should validate complete TokenBalance structure', () => {
      const tokenBalance: TokenBalance = {
        tokenId: '0.0.456789',
        balance: 250.50,
        symbol: 'USDC',
        name: 'USD Coin'
      };

      expect(tokenBalance.tokenId).toMatch(/^0\.0\.\d+$/);
      expect(typeof tokenBalance.balance).toBe('number');
      expect(tokenBalance.balance).toBeGreaterThanOrEqual(0);
      expect(typeof tokenBalance.symbol).toBe('string');
      expect(typeof tokenBalance.name).toBe('string');
    });

    it('should validate minimal TokenBalance structure', () => {
      const minimalTokenBalance: TokenBalance = {
        tokenId: '0.0.123456',
        balance: 0
      };

      expect(minimalTokenBalance.tokenId).toBeDefined();
      expect(minimalTokenBalance.balance).toBeDefined();
      expect(minimalTokenBalance.symbol).toBeUndefined();
      expect(minimalTokenBalance.name).toBeUndefined();
    });
  });

  describe('Transaction Interface', () => {
    it('should validate HBAR send transaction', () => {
      const hbarTransaction: Transaction = {
        id: 'tx-hbar-001',
        type: 'send',
        amount: 10.5,
        date: '2024-01-15T10:30:00Z',
        from: '0.0.123456',
        to: '0.0.654321',
        transactionId: 'tx-abc123def456'
      };

      expect(hbarTransaction.type).toBe('send');
      expect(typeof hbarTransaction.amount).toBe('number');
      expect(hbarTransaction.amount).toBeGreaterThan(0);
      expect(hbarTransaction.from).toMatch(/^0\.0\.\d+$/);
      expect(hbarTransaction.to).toMatch(/^0\.0\.\d+$/);
    });

    it('should validate token creation transaction', () => {
      const tokenCreateTransaction: Transaction = {
        id: 'tx-token-create-001',
        type: 'token_create',
        date: '2024-01-15T11:00:00Z',
        transactionId: 'tx-token-123',
        tokenName: 'My Awesome Token',
        tokenSymbol: 'MAT',
        tokenId: '0.0.789012'
      };

      expect(tokenCreateTransaction.type).toBe('token_create');
      expect(typeof tokenCreateTransaction.tokenName).toBe('string');
      expect(typeof tokenCreateTransaction.tokenSymbol).toBe('string');
      expect(tokenCreateTransaction.tokenId).toMatch(/^0\.0\.\d+$/);
      expect(tokenCreateTransaction.amount).toBeUndefined();
    });

    it('should validate topic message transaction', () => {
      const topicMessageTransaction: Transaction = {
        id: 'tx-topic-msg-001',
        type: 'topic_message',
        date: '2024-01-15T12:00:00Z',
        transactionId: 'tx-msg-456',
        topicId: '0.0.111222',
        message: 'Hello Hedera Consensus Service!',
        sequenceNumber: 5
      };

      expect(topicMessageTransaction.type).toBe('topic_message');
      expect(topicMessageTransaction.topicId).toMatch(/^0\.0\.\d+$/);
      expect(typeof topicMessageTransaction.message).toBe('string');
      expect(typeof topicMessageTransaction.sequenceNumber).toBe('number');
      expect(topicMessageTransaction.sequenceNumber).toBeGreaterThan(0);
    });

    it('should validate all supported transaction types', () => {
      const transactionTypes: Transaction['type'][] = [
        'send',
        'receive',
        'token_create',
        'token_associate',
        'token_send',
        'topic_create',
        'topic_message'
      ];

      transactionTypes.forEach(type => {
        const transaction: Transaction = {
          id: `tx-${type}-001`,
          type: type,
          date: '2024-01-15T10:00:00Z'
        };

        expect(transaction.type).toBe(type);
        expect(typeof transaction.id).toBe('string');
        expect(typeof transaction.date).toBe('string');
      });
    });
  });

  describe('TransactionResult Interface', () => {
    it('should validate successful transaction result', () => {
      const successResult: TransactionResult = {
        success: true,
        transactionId: 'tx-success-123',
        receipt: {
          status: 'SUCCESS',
          transactionHash: 'hash-abc123'
        }
      };

      expect(successResult.success).toBe(true);
      expect(typeof successResult.transactionId).toBe('string');
      expect(successResult.receipt).toBeDefined();
      expect(successResult.error).toBeUndefined();
    });

    it('should validate failed transaction result', () => {
      const failureResult: TransactionResult = {
        success: false,
        error: 'Insufficient account balance'
      };

      expect(failureResult.success).toBe(false);
      expect(typeof failureResult.error).toBe('string');
      expect(failureResult.transactionId).toBeUndefined();
      expect(failureResult.receipt).toBeUndefined();
    });
  });

  describe('SendHbarTransaction Interface', () => {
    it('should validate HBAR transfer data', () => {
      const hbarTransfer: SendHbarTransaction = {
        recipientId: '0.0.987654',
        amount: 25.75
      };

      expect(hbarTransfer.recipientId).toMatch(/^0\.0\.\d+$/);
      expect(typeof hbarTransfer.amount).toBe('number');
      expect(hbarTransfer.amount).toBeGreaterThan(0);
    });

    it('should validate decimal amounts', () => {
      const decimalTransfer: SendHbarTransaction = {
        recipientId: '0.0.123456',
        amount: 0.001
      };

      expect(decimalTransfer.amount).toBe(0.001);
      expect(decimalTransfer.amount).toBeGreaterThan(0);
    });
  });

  describe('CreateTokenData Interface', () => {
    it('should validate token creation data', () => {
      const tokenData: CreateTokenData = {
        name: 'Hedera Test Token',
        symbol: 'HTT',
        initialSupply: 1000000
      };

      expect(typeof tokenData.name).toBe('string');
      expect(tokenData.name.length).toBeGreaterThan(0);
      
      expect(typeof tokenData.symbol).toBe('string');
      expect(tokenData.symbol.length).toBeGreaterThan(0);
      expect(tokenData.symbol).toMatch(/^[A-Z0-9]+$/);
      
      expect(typeof tokenData.initialSupply).toBe('number');
      expect(tokenData.initialSupply).toBeGreaterThan(0);
    });

    it('should validate various token symbols', () => {
      const validSymbols = ['BTC', 'ETH', 'HBAR', 'USDC', 'TEST123'];
      
      validSymbols.forEach(symbol => {
        const tokenData: CreateTokenData = {
          name: `${symbol} Token`,
          symbol: symbol,
          initialSupply: 1000
        };

        expect(tokenData.symbol).toBe(symbol);
        expect(tokenData.symbol).toMatch(/^[A-Z0-9]+$/);
      });
    });
  });

  describe('SendTokenTransaction Interface', () => {
    it('should validate token transfer data', () => {
      const tokenTransfer: SendTokenTransaction = {
        recipientId: '0.0.555666',
        tokenId: '0.0.777888',
        amount: 50
      };

      expect(tokenTransfer.recipientId).toMatch(/^0\.0\.\d+$/);
      expect(tokenTransfer.tokenId).toMatch(/^0\.0\.\d+$/);
      expect(typeof tokenTransfer.amount).toBe('number');
      expect(tokenTransfer.amount).toBeGreaterThan(0);
    });
  });

  describe('CreateTopicData Interface', () => {
    it('should validate public topic creation', () => {
      const publicTopic: CreateTopicData = {
        memo: 'Public Discussion Topic',
        isPrivate: false
      };

      expect(typeof publicTopic.memo).toBe('string');
      expect(publicTopic.memo.length).toBeGreaterThan(0);
      expect(publicTopic.isPrivate).toBe(false);
    });

    it('should validate private topic creation', () => {
      const privateTopic: CreateTopicData = {
        memo: 'Private Company Internal Topic',
        isPrivate: true
      };

      expect(typeof privateTopic.memo).toBe('string');
      expect(privateTopic.isPrivate).toBe(true);
    });
  });

  describe('TopicMessage Interface', () => {
    it('should validate topic message structure', () => {
      const topicMessage: TopicMessage = {
        sequenceNumber: 42,
        message: 'This is a test message for the topic',
        timestamp: new Date('2024-01-15T15:30:45Z'),
        consensusTimestamp: '1705329045.123456789'
      };

      expect(typeof topicMessage.sequenceNumber).toBe('number');
      expect(topicMessage.sequenceNumber).toBeGreaterThan(0);
      
      expect(typeof topicMessage.message).toBe('string');
      expect(topicMessage.message.length).toBeGreaterThan(0);
      
      expect(topicMessage.timestamp instanceof Date).toBe(true);
      expect(topicMessage.timestamp.getTime()).toBeGreaterThan(0);
      
      expect(typeof topicMessage.consensusTimestamp).toBe('string');
      expect(topicMessage.consensusTimestamp).toMatch(/^\d+\.\d+$/);
    });

    it('should validate message length constraints', () => {
      const shortMessage: TopicMessage = {
        sequenceNumber: 1,
        message: 'Hi',
        timestamp: new Date(),
        consensusTimestamp: '1234567890.123456789'
      };

      const longMessage: TopicMessage = {
        sequenceNumber: 2,
        message: 'A'.repeat(1024), // Maximum length
        timestamp: new Date(),
        consensusTimestamp: '1234567890.987654321'
      };

      expect(shortMessage.message.length).toBeLessThanOrEqual(1024);
      expect(longMessage.message.length).toBe(1024);
      expect(longMessage.message.length).toBeLessThanOrEqual(1024);
    });
  });

  describe('Type Compatibility and Edge Cases', () => {
    it('should handle optional fields correctly', () => {
      // Transaction with minimal required fields
      const minimalTransaction: Transaction = {
        id: 'min-tx',
        type: 'topic_create',
        date: '2024-01-01'
      };

      expect(minimalTransaction.amount).toBeUndefined();
      expect(minimalTransaction.from).toBeUndefined();
      expect(minimalTransaction.to).toBeUndefined();
    });

    it('should validate date string formats', () => {
      const dateFormats = [
        '2024-01-15T10:30:00Z',
        '2024-01-15T10:30:00.000Z',
        '2024-01-15 10:30:00',
        new Date().toISOString()
      ];

      dateFormats.forEach(dateStr => {
        const transaction: Transaction = {
          id: 'date-test',
          type: 'send',
          date: dateStr
        };

        expect(typeof transaction.date).toBe('string');
        expect(transaction.date.length).toBeGreaterThan(0);
      });
    });

    it('should validate numeric precision', () => {
      const precisionTests = [
        { amount: 0.001, description: 'small decimal' },
        { amount: 999999.999999, description: 'large decimal' },
        { amount: 1, description: 'integer' },
        { amount: 0, description: 'zero' }
      ];

      precisionTests.forEach(test => {
        const transaction: Transaction = {
          id: `precision-${test.description}`,
          type: 'send',
          amount: test.amount,
          date: '2024-01-15'
        };

        expect(typeof transaction.amount).toBe('number');
        expect(transaction.amount).toBeGreaterThanOrEqual(0);
      });
    });
  });
});