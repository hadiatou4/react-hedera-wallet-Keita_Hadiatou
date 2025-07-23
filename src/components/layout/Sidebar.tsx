// Complete Sidebar with ALL 8 challenge functionalities
import { Home, Send, Coins, Plus, Link, MessageSquare, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ currentPage, onPageChange, onLogout }: SidebarProps) => {
  
  // Complete menu items covering ALL 8 functionalities
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },           // Functionality 1
    { id: 'send-hbar', label: 'Send HBAR', icon: Send },         // Functionality 2  
    { id: 'send-token', label: 'Send Token', icon: Coins },      // Functionality 5
    { id: 'create-token', label: 'Create Token', icon: Plus },   // Functionality 3
    { id: 'associate-token', label: 'Associate Token', icon: Link }, // Functionality 4
    { id: 'topics', label: 'Topics', icon: MessageSquare },     // Functionalities 6,7,8
  ];

  return (
    <div style={{
      width: '200px',
      height: '100vh',
      backgroundColor: '#2c3e50',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Logo */}
      <div style={{
        padding: '0 20px 30px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 8px auto'
        }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>H</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => onPageChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 20px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#00d4aa' : 'transparent',
                color: isActive ? '#1e2328' : '#ffffff',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <IconComponent size={18} style={{ marginRight: '10px' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <div
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 20px',
          cursor: 'pointer',
          color: '#ffffff',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '20px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <LogOut size={18} style={{ marginRight: '10px' }} />
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;