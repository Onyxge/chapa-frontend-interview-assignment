import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import AdminDashboard from './AdminDashboard';

// SuperAdminDashboard component for managing users and admins

const SuperAdminDashboard = () => {// Use the AppContext to access user data and actions
  const { users, toggleUserStatus, addAdmin, removeAdmin, loading } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: ''
  });
  const [userForm, setUserForm] = useState({ name: '', email: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
// Filter users into regular and admin categories
  const regularUsers = users.filter(user => user.role === 'user');
  const adminUsers = users.filter(user => user.role === 'admin');
  const activeUsers = users.filter(user => user.active).length;
  const totalPayments = users.reduce((sum, user) => sum + (user.totalPayments || 0), 0);

  // const handleAddAdmin = async (e) => {
  //   e.preventDefault();
    
  // };
// Function to handle adding a new admin
  const handleAddAdmin = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newAdmin = Object.fromEntries(formData.entries());
      await fetch('/api/admins', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({...newAdmin, password: 'password'})
      });
      alert('Admin added! (Refresh may be needed to see in list)');
      e.target.reset();
// Handle adding a new admin
  if (!adminForm.name || !adminForm.email) return;
// Reset the form after submission
    try {
      await addAdmin(adminForm);
      setAdminForm({ name: '', email: '' });
    } catch (error) {
      console.error('Failed to add admin:', error);
    }
  }// Function to handle removing an admin
  const handleRemoveAdmin = async (userId) => {
    if (window.confirm('Are you sure you want to remove this admin?')) {
      try {
        await removeAdmin(userId);
      } catch (error) {
        console.error('Failed to remove admin:', error);
      }
    }
  };
//
  const topUsers = users
    .filter(user => user.role === 'user')
    .sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0))
    .slice(0, 5);

  return (
    <div>
      <div className="grid grid-cols-1 md-grid-cols-4 mb-6">
        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Users</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{regularUsers.length}</div>
          <p className="stat-description">Regular users</p>
        </div>

        {/* Total Admins */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Admins</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{adminUsers.length}</div>
          <p className="stat-description">Admin users</p>
        </div>

        {/* Active Users */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Users</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{activeUsers}</div>
          <p className="stat-description">Currently active</p>
        </div>

        {/* Total Payments */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Payments</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{formatCurrency(totalPayments)}</div>
          <p className="stat-description">System-wide</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className="tab-list">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
             Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
             User Management
          </button>
          <button
            className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
             Admin Management
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Top User Payments</h2>
              <p className="card-subtitle">Users with highest payment amounts</p>
            </div>
            <div className="card-content">
              <div style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topUsers.map((user, index) => {
                  const maxPayment = Math.max(...topUsers.map(u => u.totalPayments || 0));
                  const percentage = maxPayment > 0 ? ((user.totalPayments || 0) / maxPayment) * 100 : 0;
                  
                  return (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ minWidth: '120px', fontSize: '0.875rem', fontWeight: '500' }}>
                        {user.name}
                      </div>
                      <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '0.375rem', height: '2rem', position: 'relative' }}>
                        <div 
                          style={{ 
                            background: '#3b82f6', 
                            height: '100%', 
                            borderRadius: '0.375rem',
                            width: `${percentage}%`,
                            transition: 'width 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '0.5rem',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}
                        >
                          {percentage > 20 && `${percentage.toFixed(0)}%`}
                        </div>
                      </div>
                      <div style={{ minWidth: '100px', fontSize: '0.875rem', textAlign: 'right', fontWeight: '600' }}>
                        {formatCurrency(user.totalPayments || 0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">User Management</h2>
              <p className="card-subtitle">Manage all user accounts</p>
            </div>
            <div className="card-content">
              
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Total Payments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td style={{ fontWeight: '500' }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.active ? 'badge-success' : 'badge-secondary'}`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatCurrency(user.totalPayments || 0)}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => toggleUserStatus(user.id)}
                            disabled={loading}
                          >
                            {loading && <div className="spinner"></div>}
                            {user.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === 'admins' && (
          <div>
            <div className="card mb-6">
              <div className="card-header">
                <h2 className="card-title">Admin Management</h2>
                <p className="card-subtitle">Add or remove admin users</p>
              </div>
              <div className="card-content">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const form = document.getElementById('admin-form');
                      form.style.display = form.style.display === 'none' ? 'block' : 'none';
                    }}
                  >
                     Add Admin
                  </button>
                </div>

                <div id="admin-form" style={{ display: 'none', marginBottom: '2rem' }}>
                  <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="admin-name" className="form-label">Name</label>
                      <input
                        id="admin-name"
                        type="text"
                        className="form-input"
                        placeholder="Admin name"
                        value={adminForm.name}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="admin-email" className="form-label">Email</label>
                      <input
                        id="admin-email"
                        type="email"
                        className="form-input"
                        placeholder="admin@example.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading && <div className="spinner"></div>}
                      Add
                    </button>
                  </form>
                </div>

                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user => user.role === 'super_admin' || user.role === 'admin')
                        .map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {user.role === 'super_admin' && ''}
                                <span style={{ fontWeight: '500' }}>{user.name}</span>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className="badge badge-primary">
                                {user.role === 'super_admin' ? 'super admin' : 'admin'}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-success">Active</span>
                            </td>
                            <td>
                              {user.role === 'admin' ? (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleRemoveAdmin(user.id)}
                                  disabled={loading}
                                >
                                  {loading && <div className="spinner"></div>}
                                   Remove
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Protected</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

