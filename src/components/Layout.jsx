import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return '';
      case 'admin':
        return '';
      default:
        return '';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Best Fintech</h1>
          {/* User info section */}
          
          <div className="header-user">
            <div className="user-info">
              <span>{getRoleIcon(user?.role)}</span>
              <span>{user?.name}</span>
              <span className="user-role">
                {getRoleLabel(user?.role)}
              </span>
            </div>
            
            <button
              className="btn btn-secondary btn-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

