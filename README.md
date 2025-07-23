# React Hedera Wallet

A minimalist Hedera wallet application built with React and TypeScript. This project provides a simple, intuitive interface for managing Hedera accounts and performing blockchain transactions using the Hedera network.

## 🎯 Project Overview

This wallet application allows users to:
- Connect to the Hedera testnet with their credentials
- View account information and balance
- Perform HBAR transfers between accounts
- Create and manage HTS (Hedera Token Service) tokens
- Create topics and exchange messages using HCS (Hedera Consensus Service)
- Real-time message monitoring for topics

## 🛠 Technology Stack

- *Frontend Framework:* React 18 with TypeScript
- *Package Manager:* pnpm
- *Blockchain Integration:* @hashgraph/sdk
- *Testing:* Jest with TypeScript support
- *Storage:* Browser localStorage
- *Styling:* CSS-in-JS with inline styles
- *Network:* Hedera Testnet

## ✨ Features

### Core Functionalities

1. *📊 Check Account Information*
   - View account balance in HBAR
   - Display associated tokens
   - Show transaction history

2. *💸 Send HBAR*
   - Transfer HBAR between accounts
   - Real-time balance updates
   - Transaction confirmation

3. *🪙 Token Management*
   - Create new fungible tokens (HTS)
   - Associate accounts with tokens
   - Transfer tokens between accounts

4. *💬 Consensus Service (HCS)*
   - Create public/private topics
   - Send messages to topics
   - Retrieve topic messages with real-time updates

### Advanced Features

- *🔐 Secure Credential Storage* - localStorage with proper cleanup
- *⚡ Real-time Updates* - Auto-polling for new messages every 5 seconds
- *🎨 Modern UI* - Clean, intuitive interface with hover effects
- *📱 Responsive Design* - Works on desktop and mobile devices
- *🔄 Auto-reconnection* - Remembers credentials for seamless experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm package manager
- Hedera testnet account (create at [Hedera Portal](https://portal.hedera.com))

### Installation

1. *Clone the repository*
   bash
   git clone <repository-url>
   cd react-hedera-wallet-keita-hadiatou
   

2. *Install dependencies*
   bash
   pnpm install
   

3. *Start the development server*
   bash
   pnpm dev
   

4. *Open your browser*
   Navigate to http://localhost:5173

### Building for Production

bash
# Build the application
pnpm build

# Preview the production build
pnpm preview


## 🧪 Testing

The project includes comprehensive test coverage with Jest:

bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm test --coverage

# Run specific test file
pnpm test validation.test.ts


### Test Coverage

Total Tests: 99+ unit and integration tests
Coverage Areas:

✅ All 8 Hedera functionalities
✅ Input validation and sanitization
✅ Error handling scenarios
✅ Data structure validation
✅ Utility functions and conversions

## Test Structure
src/tests/
├── ✅ storage.service.test.ts              (24 tests)
├── ✅ hedera.types.test.ts                 (22 tests)  
├── ✅ wallet.service.test.ts               (22 tests) - Unit tests
├── ✅ wallet.service.integration.test.ts   (18 tests) - Integration tests
└── ✅ validation.test.ts                   (15 tests)

## Running Tests
bash# Run all tests
pnpm test

# Run specific test suite
pnpm test wallet.service.test.ts

# Run with coverage
pnpm run test:coverage

# Run integration tests only
pnpm test wallet.service.integration.test.ts

## 🎮 Usage Guide

### Initial Setup

1. *Connect Your Wallet*
   - Enter your Hedera testnet Account ID (format: 0.0.123456)
   - Enter your private key
   - Click "Connect Wallet"

2. *View Dashboard*
   - See your HBAR balance
   - Access all available features
   - Monitor transaction history

### Sending HBAR

1. Navigate to "Send HBAR"
2. Enter recipient Account ID
3. Enter amount to send
4. Confirm transaction
5. View transaction details

### Token Operations

1. *Create Token:*
   - Go to "Create Token"
   - Enter token name, symbol, and initial supply
   - Confirm creation

2. *Associate Token:*
   - Navigate to "Associate Token"
   - Enter the token ID
   - Confirm association

3. *Send Tokens:*
   - Go to "Send Token"
   - Enter recipient, token ID, and amount
   - Confirm transfer

### Topics & Messaging

1. *Create Topic:*
   - Navigate to "Topics" → "Create Topic"
   - Enter topic description
   - Choose public/private setting
   - Create topic

2. *Send Message:*
   - Go to "Send Message"
   - Enter topic ID and message
   - Send message

3. *View Messages:*
   - Navigate to "View Messages"
   - Enter topic ID
   - Enable live updates for real-time monitoring

## 🏗 Project Structure


src/
├── components/
│   ├── layout/          # Sidebar components
│   ├── ui/              # Reusable UI components
│   └── wallet/          # Wallet-specific components
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── SendHbarPage.tsx
│   ├── CreateTokenPage.tsx
│   ├── SendTokenPage.tsx
│   ├── AssociateTokenPage.tsx
│   ├── TopicsPage.tsx
│   ├── CreateTopicPage.tsx
│   ├── SendMessagePage.tsx
│   └── ViewMessagesPage.tsx
├── services/            # Business logic services
│   ├── hedera.service.ts    # Hedera SDK integration
│   ├── wallet.service.ts    # Wallet management
│   └── storage.service.ts   # Local storage management
├── types/               # TypeScript type definitions
│   └── hedera.types.ts
├── tests/               # Test files
│   ├── validation.test.ts
│   ├── hedera-functions.test.ts
│   └── wallet.service.test.ts
└── utils/               # Utility functions


## 🔧 Configuration

The application uses the following configuration:

- *Network:* Hedera Testnet
- *Node:* Default testnet nodes
- *Storage:* Browser localStorage
- *Auto-reconnect:* Enabled
- *Real-time polling:* 5-second intervals

## 🛡 Security Considerations

- Private keys are stored in localStorage (development only)
- All transactions require explicit user confirmation
- Input validation for all user inputs
- Secure communication with Hedera network
- Automatic session cleanup on disconnect

## 🚨 Error Handling

The application handles various error scenarios:

- *Network Errors:* Connection issues with Hedera network
- *Invalid Inputs:* Account ID format validation
- *Insufficient Balance:* Transaction amount validation
- *Token Errors:* Association and transfer validations
- *Topic Errors:* Invalid topic IDs and permissions

## 📈 Performance Features

- *Efficient State Management:* Minimal re-renders
- *Optimized API Calls:* Batched requests where possible
- *Memory Management:* Proper cleanup of subscriptions
- *Fast Loading:* Optimized bundle size

## 🔮 Future Enhancements

- [ ] NFT support (HTS Non-Fungible Tokens)
- [ ] Smart contract integration
- [ ] Multi-signature transactions
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Hardware wallet integration

## 🐛 Known Issues

- Real-time message updates have a 5-second delay
- Private keys stored in localStorage (not production-ready)
- Limited error messages for network failures

## 🤝 Contributing

This project was developed as part of the Deep Tech Academy Hedera Challenge. For contributions or questions, please contact the development team.

## 📄 License

This project is developed for educational purposes as part of the Deep Tech Academy program.

## 🙏 Acknowledgments

- *Hedera Team* - For providing excellent documentation and SDK
- *Deep Tech Academy* - For organizing this challenge
- *React Community* - For the amazing ecosystem and tools

## 📞 Support

For technical support or questions about this implementation:

1. Check the Hedera documentation
2. Review the test files for usage examples
3. Examine the service layer for API integration details

## 🎯 Challenge Requirements Met

- ✅ *Programming Language:* TypeScript
- ✅ *Package Manager:* pnpm
- ✅ *Framework:* React
- ✅ *Hedera Integration:* @hashgraph/sdk
- ✅ *Testing:* Jest with comprehensive coverage
- ✅ *Storage:* Browser localStorage
- ✅ *UI:* Well-structured web interface
- ✅ *All 8 Functionalities:* Fully implemented
- ✅ *Real-time Updates:* HCS message polling
- ✅ *Code Quality:* TypeScript, clear organization
- ✅ *Test Coverage:* 35+ unit tests

---

*Built with ❤ for the Hedera ecosystem*