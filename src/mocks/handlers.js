import { http, HttpResponse } from 'msw';
import { DEFAULT_TEST_PASSWORD, defaultUsers, defaultTransactions, defaultWalletBalances } from './db';

// Initialize data from localStorage or use defaults
const getStoredData = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    // A simple migration check: if stored data doesn't have an 'active' prop, use default.
    if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].active === undefined) {
            return defaultData;
        }
        return parsed;
    }
    return defaultData;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultData;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error)
  {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Get data from localStorage or initialize with defaults
let mockUsers = getStoredData('mockUsers', defaultUsers);
let mockTransactions = getStoredData('mockTransactions', defaultTransactions);
let walletBalances = getStoredData('walletBalances', defaultWalletBalances);

export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email);
// Check if user exists and password matches    
    if (!user || password !== user.password) {
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.active) {
      return HttpResponse.json(
        { error: 'Your account has been deactivated. Please contact an administrator.' },
        { status: 403 }
      );
    }

    const token = 'mock-jwt-token-' + Date.now();
    const { password: _, ...userWithoutPassword } = user;
    
    return HttpResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });
  }),

  // User management endpoints
  http.get('/api/users', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return HttpResponse.json(mockUsers);
  }),

  // CORRECTED: This handler now correctly toggles the user's status (Corrected by Copilot)
  // without needing a request body, matching the client-side implementation.
  http.patch('/api/users/:id/status', async ({ params }) => {
    const userId = parseInt(params.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Find the user by ID
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
  // Toggle the user's active status
    mockUsers[userIndex].active = !mockUsers[userIndex].active;
    setStoredData('mockUsers', mockUsers);
    
    return HttpResponse.json({
      user: mockUsers[userIndex],
      message: 'User status updated'
    });
  }),

  http.post('/api/users', async ({ request }) => {
    const userData = await request.json();
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = {
      id: Date.now(),
      ...userData,
      password: DEFAULT_TEST_PASSWORD,
      active: true,
      totalPayments: 0
    };
    mockUsers.push(newUser);
    setStoredData('mockUsers', mockUsers);
    
    walletBalances[newUser.id] = userData.role === 'admin' ? 5000 : 1000;
    setStoredData('walletBalances', walletBalances);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return HttpResponse.json({
      user: userWithoutPassword,
      message: 'User created successfully'
    });
  }),
// Update user endpoint
  http.delete('/api/users/:id', async ({ params }) => {
    const userId = parseInt(params.id);
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }
// Remove the user from the mockUsers array and update localStorage    
    mockUsers.splice(userIndex, 1);
    setStoredData('mockUsers', mockUsers);
    
    delete walletBalances[userId];
    setStoredData('walletBalances', walletBalances);
    // Remove the user's transactions
    return HttpResponse.json({ message: 'User deleted successfully' });
  }),

  // Transaction endpoints
  http.get('/api/transactions', async ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
// Simulate a delay for the request    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let transactions = mockTransactions;
    if (userId) {
      transactions = mockTransactions.filter(t => t.userId === parseInt(userId));
    }

    return HttpResponse.json(transactions);
  }),
// Create a new transaction
  http.post('/api/transactions', async ({ request }) => {
    const transactionData = await request.json();
    await new Promise(resolve => setTimeout(resolve, 500));
    //
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      date: new Date().toISOString()
    };
  // Add the new transaction to the mockTransactions array and update localStorage  
    mockTransactions.unshift(newTransaction);
    setStoredData('mockTransactions', mockTransactions);
    
    const userId = transactionData.userId;
    if (walletBalances[userId] !== undefined) {
      const balanceChange = transactionData.type === 'credit' 
        ? transactionData.amount 
        : -transactionData.amount;
      walletBalances[userId] += balanceChange;
      setStoredData('walletBalances', walletBalances);
    }// Update the user's total payments
    
    return HttpResponse.json({
      transaction: newTransaction,
      message: 'Transaction created successfully'
    });
  }),

  // Wallet endpoints
  http.get('/api/wallet/:userId', async ({ params }) => {
    const userId = parseInt(params.userId);
    await new Promise(resolve => setTimeout(resolve, 300));
  
    const balance = walletBalances[userId] || 0;
    
    return HttpResponse.json({ balance, userId });
  }),

  // Statistics endpoints
  http.get('/api/stats', async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalUsers = mockUsers.filter(u => u.role === 'user').length;
    const activeUsers = mockUsers.filter(u => u.role === 'user' && u.active).length;
    const totalAdmins = mockUsers.filter(u => u.role === 'admin').length;
    const totalPayments = mockUsers.reduce((sum, user) => sum + (user.totalPayments || 0), 0);
    
    return HttpResponse.json({
      totalUsers,
      activeUsers,
      totalAdmins,
      totalPayments,
      totalTransactions: mockTransactions.length
    });
  })
];
