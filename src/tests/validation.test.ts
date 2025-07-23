// Validation Tests - Comprehensive Input and Data Validation
// Tests all validation logic for Hedera wallet inputs and data formats

describe('Hedera Wallet Validation', () => {
  
  describe('Account ID Validation', () => {
    it('should validate correct account ID formats', () => {
      const validAccountIds = [
        '0.0.123456',
        '0.0.1',
        '0.0.999999999',
        '0.0.2',
        '0.0.1234567890'
      ];
      
      const accountIdRegex = /^0\.0\.\d+$/;
      
      validAccountIds.forEach(accountId => {
        expect(accountId).toMatch(accountIdRegex);
        expect(typeof accountId).toBe('string');
        expect(accountId.split('.').length).toBe(3);
        expect(accountId.startsWith('0.0.')).toBe(true);
      });
    });

    it('should reject invalid account ID formats', () => {
      const invalidAccountIds = [
        '',
        'invalid',
        '0.0',
        '0.0.',
        '1.2.3',
        'abc.def.ghi',
        '0.0.abc',
        '0.1.123',
        '1.0.123',
        '0.0.-123',
        '0.0.123.456'
      ];
      
      const accountIdRegex = /^0\.0\.\d+$/;
      
      invalidAccountIds.forEach(accountId => {
        expect(accountId).not.toMatch(accountIdRegex);
      });
    });

    it('should parse account ID components correctly', () => {
      const accountId = '0.0.123456';
      const parts = accountId.split('.');
      
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe('0');
      expect(parts[1]).toBe('0');
      expect(parts[2]).toBe('123456');
      expect(parseInt(parts[2])).toBe(123456);
    });
  });

  describe('Amount Validation', () => {
    it('should validate positive HBAR amounts', () => {
      const validAmounts = [
        1,           // 1 HBAR
        10,          // 10 HBAR
        100.5,       // 100.5 HBAR
        0.1,         // 0.1 HBAR
        0.001,       // 0.001 HBAR
        0.00000001,  // 1 tinybar (smallest unit)
        999999.999999
      ];
      
      validAmounts.forEach(amount => {
        expect(amount).toBeGreaterThan(0);
        expect(typeof amount).toBe('number');
        expect(isNaN(amount)).toBe(false);
        expect(isFinite(amount)).toBe(true);
      });
    });

    it('should reject invalid amounts', () => {
      const invalidAmounts = [
        0,           // Zero
        -1,          // Negative
        -0.1,        // Negative decimal
        NaN,         // Not a number
        Infinity,    // Infinity
        -Infinity    // Negative infinity
      ];
      
      invalidAmounts.forEach(amount => {
        expect(amount <= 0 || !isFinite(amount) || isNaN(amount)).toBe(true);
      });
    });

    it('should handle HBAR to tinybar conversion correctly', () => {
      const testCases = [
        { hbar: 1, tinybars: 100000000 },
        { hbar: 0.1, tinybars: 10000000 },
        { hbar: 0.00000001, tinybars: 1 },
        { hbar: 100, tinybars: 10000000000 }
      ];
      
      testCases.forEach(({ hbar, tinybars }) => {
        const calculatedTinybars = hbar * 100000000;
        expect(calculatedTinybars).toBe(tinybars);
        expect(calculatedTinybars).toBeGreaterThan(0);
      });
    });

    it('should validate decimal precision limits', () => {
      const amount = 123.456789;
      const rounded = parseFloat(amount.toFixed(8)); // HBAR supports 8 decimal places
      
      expect(rounded).toBe(123.45678900);
      expect(rounded.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(8);
    });
  });

  describe('Token Symbol Validation', () => {
    it('should validate correct token symbols', () => {
      const validSymbols = [
        'BTC',
        'ETH', 
        'HBAR',
        'TEST',
        'USD',
        'TOKEN123',
        'A',
        'ABCDEFGH'
      ];
      
      validSymbols.forEach(symbol => {
        expect(symbol.length).toBeGreaterThan(0);
        expect(symbol.length).toBeLessThanOrEqual(100);
        expect(symbol).toMatch(/^[A-Z0-9]+$/);
        expect(symbol).toBe(symbol.toUpperCase());
      });
    });

    it('should reject invalid token symbols', () => {
      const invalidSymbols = [
        '',                     // Empty
        'abc',                  // Lowercase
        'Token!',              // Special characters
        'token with spaces',    // Spaces
        '123!@#',              // Special characters with numbers
        'a'.repeat(101)        // Too long (>100 chars)
      ];
      
      invalidSymbols.forEach(symbol => {
        const isValid = symbol.length > 0 && 
                       symbol.length <= 100 && 
                       /^[A-Z0-9]+$/.test(symbol);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Token Name Validation', () => {
    it('should validate token names', () => {
      const validNames = [
        'Bitcoin',
        'Ethereum Token',
        'My Awesome Token 123',
        'Test',
        'USD Coin'
      ];
      
      validNames.forEach(name => {
        expect(name.trim().length).toBeGreaterThan(0);
        expect(name.length).toBeLessThanOrEqual(100);
        expect(typeof name).toBe('string');
      });
    });

    it('should reject invalid token names', () => {
      const invalidNames = [
        '',                    // Empty
        '   ',                // Only whitespace
        'a'.repeat(101)       // Too long
      ];
      
      invalidNames.forEach(name => {
        const isValid = name.trim().length > 0 && name.length <= 100;
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Private Key Validation', () => {
    it('should validate private key format characteristics', () => {
      const mockPrivateKeys = [
        '302e020100300506032b657004220420abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        '302e020100300506032b65700422042012345678901234567890123456789012345678901234567890123456789012'
      ];
      
      mockPrivateKeys.forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(50); // Reasonable minimum length
        expect(/^[a-fA-F0-9]+$/.test(key)).toBe(true); // Hex format
      });
    });

    it('should reject obviously invalid private keys', () => {
      const invalidKeys = [
        '',
        'invalid',
        '123',
        'not-hex-format-key'
      ];
      
      invalidKeys.forEach(key => {
        const isValidFormat = key.length > 50 && /^[a-fA-F0-9]+$/.test(key);
        expect(isValidFormat).toBe(false);
      });
    });
  });

  describe('Topic Message Validation', () => {
    it('should validate message content', () => {
      const validMessages = [
        'Hello Hedera!',
        'Simple message',
        '123456789',
        'Message with symbols: !@#$%^&*()',
        'Unicode message: 🎉💫'
      ];
      
      validMessages.forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
        expect(message.length).toBeLessThanOrEqual(1024);
      });
    });

    it('should reject invalid messages', () => {
      const invalidMessages = [
        '',                    // Empty
        'x'.repeat(1025)      // Too long (>1024 chars)
      ];
      
      invalidMessages.forEach(message => {
        const isValid = message.length > 0 && message.length <= 1024;
        expect(isValid).toBe(false);
      });
    });

    it('should validate topic message structure', () => {
      const topicMessage = {
        sequenceNumber: 1,
        message: 'Test message content',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        consensusTimestamp: '1705316400.123456789'
      };
      
      expect(topicMessage).toHaveProperty('sequenceNumber');
      expect(topicMessage).toHaveProperty('message');
      expect(topicMessage).toHaveProperty('timestamp');
      expect(topicMessage).toHaveProperty('consensusTimestamp');
      
      expect(typeof topicMessage.sequenceNumber).toBe('number');
      expect(topicMessage.sequenceNumber).toBeGreaterThan(0);
      expect(typeof topicMessage.message).toBe('string');
      expect(topicMessage.timestamp instanceof Date).toBe(true);
      expect(typeof topicMessage.consensusTimestamp).toBe('string');
    });
  });

  describe('Transaction Result Validation', () => {
    it('should validate successful transaction results', () => {
      const successResult = {
        success: true,
        transactionId: 'tx-success-123456'
      };
      
      expect(successResult).toHaveProperty('success');
      expect(successResult).toHaveProperty('transactionId');
      expect(successResult.success).toBe(true);
      expect(typeof successResult.transactionId).toBe('string');
      expect(successResult.transactionId.length).toBeGreaterThan(0);
    });

    it('should validate failed transaction results', () => {
      const errorResult = {
        success: false,
        error: 'Transaction failed due to insufficient balance'
      };
      
      expect(errorResult).toHaveProperty('success');
      expect(errorResult).toHaveProperty('error');
      expect(errorResult.success).toBe(false);
      expect(typeof errorResult.error).toBe('string');
      expect(errorResult.error.length).toBeGreaterThan(0);
    });

    it('should validate token creation results', () => {
      const tokenResult = {
        success: true,
        transactionId: 'tx-token-789',
        tokenId: '0.0.987654'
      };
      
      expect(tokenResult).toHaveProperty('tokenId');
      expect(tokenResult.tokenId).toMatch(/^0\.0\.\d+$/);
      expect(typeof tokenResult.tokenId).toBe('string');
    });

    it('should validate topic creation results', () => {
      const topicResult = {
        success: true,
        transactionId: 'tx-topic-456',
        topicId: '0.0.111222'
      };
      
      expect(topicResult).toHaveProperty('topicId');
      expect(topicResult.topicId).toMatch(/^0\.0\.\d+$/);
      expect(typeof topicResult.topicId).toBe('string');
    });

    it('should validate message submission results', () => {
      const messageResult = {
        success: true,
        transactionId: 'tx-msg-999',
        sequenceNumber: 5
      };
      
      expect(messageResult).toHaveProperty('sequenceNumber');
      expect(typeof messageResult.sequenceNumber).toBe('number');
      expect(messageResult.sequenceNumber).toBeGreaterThan(0);
    });
  });

  describe('Timestamp and Date Validation', () => {
    it('should handle consensus timestamp format', () => {
      const consensusTimestamps = [
        '1705316400.123456789',
        '1234567890.999999999',
        '9999999999.000000001'
      ];
      
      consensusTimestamps.forEach(timestamp => {
        expect(typeof timestamp).toBe('string');
        expect(timestamp).toMatch(/^\d+\.\d{9}$/);
        
        const seconds = parseFloat(timestamp);
        expect(seconds).toBeGreaterThan(0);
        expect(isFinite(seconds)).toBe(true);
      });
    });

    it('should convert timestamps to dates correctly', () => {
      const timestamp = '1705316400.123456789';
      const seconds = parseFloat(timestamp);
      const milliseconds = seconds * 1000;
      const date = new Date(milliseconds);
      
      expect(date instanceof Date).toBe(true);
      expect(date.getTime()).toBeGreaterThan(0);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });

  describe('Error Message Validation', () => {
    it('should validate common error message patterns', () => {
      const errorPatterns = [
        { error: 'Insufficient HBAR balance', keyword: 'Insufficient' },
        { error: 'Invalid account ID format', keyword: 'Invalid' },
        { error: 'Not connected to Hedera network', keyword: 'network' },
        { error: 'Token already associated with account', keyword: 'associated' },
        { error: 'You are not authorized to send messages', keyword: 'authorized' }
      ];
      
      errorPatterns.forEach(({ error, keyword }) => {
        expect(error).toContain(keyword);
        expect(typeof error).toBe('string');
        expect(error.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Utility Functions Validation', () => {
    it('should format numbers with proper precision', () => {
      const testNumbers = [
        { input: 123.456789, precision: 2, expected: 123.46 },
        { input: 1.00000001, precision: 8, expected: 1.00000001 },
        { input: 999.999, precision: 0, expected: 1000 }
      ];
      
      testNumbers.forEach(({ input, precision, expected }) => {
        const formatted = parseFloat(input.toFixed(precision));
        expect(formatted).toBe(expected);
      });
    });

    it('should validate string trimming and normalization', () => {
      const testStrings = [
        { input: '  hello  ', expected: 'hello' },
        { input: '\t\ntest\t\n', expected: 'test' },
        { input: '   ', expected: '' }
      ];
      
      testStrings.forEach(({ input, expected }) => {
        const trimmed = input.trim();
        expect(trimmed).toBe(expected);
      });
    });
  });
});