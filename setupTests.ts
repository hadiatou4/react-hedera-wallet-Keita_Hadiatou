// Setup file for Jest tests
import '@testing-library/jest-dom';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
(global as any).localStorage = localStorageMock;

// Mock fetch for API calls
(global as any).fetch = jest.fn();

// Mock crypto for Hedera SDK
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: jest.fn(() => new Uint32Array(10)),
    subtle: {
      digest: jest.fn(),
      importKey: jest.fn(),
      sign: jest.fn(),
    },
  },
});