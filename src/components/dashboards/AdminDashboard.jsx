import { useApp } from '../../contexts/AppContext';
// This component is for the admin dashboard, which includes user management and payment summaries.
const AdminDashboard = () => {
  const { users, toggleUserStatus, loading } = useApp();
//
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
    
  const totalUsers = users.filter(user => user.role === 'user').length;
  const activeUsers = users.filter(user => user.role === 'user' && user.active).length;
  const totalPayments = users.reduce((sum, user) => sum + (user.totalPayments || 0), 0);

  // Prepare chart data (simplified without actual chart library)
  const topUsers = users
    .filter(user => user.role === 'user')
    .sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0))
    .slice(0, 5);
// This component displays the admin dashboard with user statistics and management features.
  return (
    <div>
      <div className="grid grid-cols-1 md-grid-cols-3 mb-6">
        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Users</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{totalUsers}</div>
          <p className="stat-description">Registered users</p>
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
          <p className="stat-description">All user payments</p>
        </div>
      </div>

      {/*User Management and Payment Summary*/}
      <div className="grid grid-cols-1 lg-grid-cols-2">
        {/* User Management */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">User Management</h2>
            <p className="card-subtitle">Manage user accounts and their status</p>
          </div>
          
      
          <div className="card-content">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Payments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users 
                    .filter(user => user.role === 'user')
                    .map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>{user.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{user.email}</div>
                          </div>
                        </td>
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
                            {user.active ? '❌ Deactivate' : '✅ Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Payment Summary</h2>
            <p className="card-subtitle">Top users by payment amount</p>
          </div>
          <div className="card-content">
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {topUsers.map((user, index) => {
                const maxPayment = Math.max(...topUsers.map(u => u.totalPayments || 0));
                const percentage = maxPayment > 0 ? ((user.totalPayments || 0) / maxPayment) * 100 : 0;

                
                // This is a simple bar representation of user payments
                // In a real application, you might use a chart library for better visualization

                //this part is made with AI
                return (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ minWidth: '100px', fontSize: '0.875rem' }}>{user.name}</div>
                    <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '0.25rem', height: '1.5rem', position: 'relative' }}>
                      <div 
                        style={{ 
                          background: '#3b82f6', 
                          height: '100%', 
                          borderRadius: '0.25rem',
                          width: `${percentage}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    <div style={{ minWidth: '80px', fontSize: '0.875rem', textAlign: 'right' }}>
                      {formatCurrency(user.totalPayments || 0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed User Table */}
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">All Users Overview</h2>
          <p className="card-subtitle">Complete list of all users with detailed information</p>
        </div>
        <div className="card-content">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Total Payments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td style={{ fontWeight: '500' }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-primary">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.active ? 'badge-success' : 'badge-secondary'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatCurrency(user.totalPayments || 0)}</td>
                    <td>
                      {user.role === 'user' && (
                        <button
                          className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleUserStatus(user.id)}
                          disabled={loading}
                        >
                          {loading && <div className="spinner"></div>}
                          {user.active ? 'Deactivate' : 'Activate'}
                        </button>
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
  );
};

export default AdminDashboard;

