import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const UserDashboard = () => {
  const { walletBalance, transactions, addTransaction, loading } = useApp();
  const [transactionForm, setTransactionForm] = useState({
    type: 'debit',
    amount: '',
    description: ''
  });

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!transactionForm.amount || !transactionForm.description) return;

    try {
      await addTransaction({
        type: transactionForm.type,
        amount: parseFloat(transactionForm.amount),
        description: transactionForm.description
      });
      
      setTransactionForm({
        type: 'debit',
        amount: '',
        description: ''
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md-grid-cols-3 mb-6">
        {/* Wallet Balance */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Wallet Balance</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{formatCurrency(walletBalance)}</div>
          <p className="stat-description">Available balance</p>
        </div>

        {/* Total Transactions */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Transactions</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{transactions.length}</div>
          <p className="stat-description">All time transactions</p>
        </div>

        {/* Recent Activity */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Recent Activity</span>
            <span className="stat-icon"></span>
          </div>
          <div className="stat-value">{transactions.slice(0, 3).length}</div>
          <p className="stat-description">Last 3 transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-2">
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Transactions</h2>
            <p className="card-subtitle">Your latest financial activities</p>
          </div>
          <div className="card-content">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  <div className={`transaction-icon ${transaction.type}`}>
                    {transaction.type === 'credit' ? '📈' : '📉'}
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.description}</h4>
                    <p>{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="transaction-right">
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className={`badge ${transaction.type === 'credit' ? 'badge-success' : 'badge-secondary'}`}>
                    {transaction.type}
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center" style={{ padding: '2rem', color: '#64748b' }}>
                No transactions yet
              </div>
            )}
          </div>
        </div>

        {/* New Transaction Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Initiate Transaction</h2>
            <p className="card-subtitle">Add a new transaction to your account</p>
          </div>
          <div className="card-content">
            <form onSubmit={handleTransactionSubmit}>
              <div className="form-group">
                <label htmlFor="type" className="form-label">Transaction Type</label>
                <input
                  id="type"
                  className="form-input"
                  value="debit"
                  readOnly
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount" className="form-label">Amount</label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                  value={transactionForm.amount}
                  onChange={(e) => 
                    setTransactionForm(prev => ({ ...prev, amount: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  placeholder="Enter transaction description"
                  value={transactionForm.description}
                  onChange={(e) => 
                    setTransactionForm(prev => ({ ...prev, description: e.target.value }))
                  }
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full" 
                disabled={loading}
              >
                {loading && <div className="spinner"></div>}
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

