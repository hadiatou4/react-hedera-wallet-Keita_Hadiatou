// Balance Card Component - COMPLETE VERSION with Associated Tokens
// Shows account balance, transaction count, address AND associated tokens

import type { AccountInfo } from '../../types/hedera.types';

interface BalanceCardProps {
  accountInfo: AccountInfo | null;
  isLoading: boolean;
}

const BalanceCard = ({ accountInfo, isLoading }: BalanceCardProps) => {
  
  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#34495e',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '16px' }}>
          WALLET OVERVIEW
        </h2>
        <p style={{ color: '#a0aec0', fontSize: '14px' }}>
          Loading account information...
        </p>
      </div>
    );
  }

  if (!accountInfo) {
    return (
      <div style={{
        backgroundColor: '#34495e',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '16px' }}>
          WALLET OVERVIEW
        </h2>
        <p style={{ color: '#ff6b6b', fontSize: '14px' }}>
          Failed to load account information
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#34495e',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      
      {/* Header */}
      <h2 style={{ 
        color: '#ffffff', 
        marginBottom: '15px',
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: '0.1em'
      }}>
        WALLET OVERVIEW
      </h2>

      {/* Balance Section */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ 
          color: '#a0aec0', 
          fontSize: '12px',
          marginBottom: '6px' 
        }}>
          BALANCE
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ 
            color: '#ffffff', 
            fontSize: '28px',
            fontWeight: '600',
            marginRight: '8px'
          }}>
            {accountInfo.balance.toFixed(4)}
          </span>
          <span style={{ 
            color: '#00d4aa', 
            fontSize: '16px',
            fontWeight: '600' 
          }}>
            HBAR
          </span>
        </div>
        <p style={{ 
          color: '#a0aec0', 
          fontSize: '12px',
          marginTop: '4px' 
        }}>
          Unconfirmed: 0.0000
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        marginBottom: '20px'
      }}>
        <div>
          <p style={{ 
            color: '#a0aec0', 
            fontSize: '12px',
            marginBottom: '6px' 
          }}>
            TRANSACTIONS
          </p>
          <p style={{ 
            color: '#ffffff', 
            fontSize: '20px',
            fontWeight: '600' 
          }}>
            {accountInfo.transactions.toLocaleString()}
          </p>
        </div>

        <div>
          <p style={{ 
            color: '#a0aec0', 
            fontSize: '12px',
            marginBottom: '6px' 
          }}>
            ACCOUNT ID
          </p>
          <p style={{ 
            color: '#ffffff', 
            fontSize: '20px',
            fontWeight: '600' 
          }}>
            {accountInfo.accountId}
          </p>
        </div>
      </div>

      {/* NEW: Associated Tokens Section */}
      <div>
        <p style={{ 
          color: '#a0aec0', 
          fontSize: '12px',
          marginBottom: '10px' 
        }}>
          ASSOCIATED TOKENS
        </p>
        
        {accountInfo.tokens.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gap: '8px' 
          }}>
            {accountInfo.tokens.map((token, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: '#2c3e50',
                  padding: '10px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ 
                    color: '#ffffff', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    margin: 0 
                  }}>
                    {token.symbol || token.tokenId}
                  </p>
                  <p style={{ 
                    color: '#a0aec0', 
                    fontSize: '12px',
                    margin: 0
                  }}>
                    {token.tokenId}
                  </p>
                </div>
                <p style={{ 
                  color: '#00d4aa', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  {token.balance.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ 
            color: '#a0aec0', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            No associated tokens
          </p>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;