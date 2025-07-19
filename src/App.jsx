import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
import UserDashboard from './components/dashboards/UserDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();
// Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
    // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'user':
      default:
        return <UserDashboard />;
    }
  };
  // Main content of the app
  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};
  // Main app component
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

