// Centralized dummy/mock data for MSW handlers
export const DEFAULT_TEST_PASSWORD = 'testpassword';
//dfault password for all test users
// This password is used for all test users to ensure consistency in tests
export const defaultUsers = [
  { id: 1, email: 'superadmin@bestfin.com', role: 'super_admin', name: 'Mavrick', active: true, totalPayments: 0, password: DEFAULT_TEST_PASSWORD },
  { id: 2, email: 'admin@bestfin.com', role: 'admin', name: 'Admin User', active: true, totalPayments: 2500, password: DEFAULT_TEST_PASSWORD },
  { id: 3, email: 'jimi@bestfin.com', role: 'user', name: 'Jimi', active: true, totalPayments: 1200, password: DEFAULT_TEST_PASSWORD },
  { id: 4, email: 'dani@bestfin.com', role: 'user', name: 'Dani Smith', active: false, totalPayments: 800, password: DEFAULT_TEST_PASSWORD },
  { id: 5, email: 'yoni@bestfin.com', role: 'user', name: 'Yoni Smith', active: true, totalPayments: 3200, password: DEFAULT_TEST_PASSWORD },
  { id: 6, email: 'lili@bestfin.com', role: 'user', name: 'Lili Smith', active: true, totalPayments: 7000, password: DEFAULT_TEST_PASSWORD },
  { id: 7, email: 'elu@bestfin.com' , role: 'user', name: 'ELiyana Smith', active: true, totalPayments: 9000, password: DEFAULT_TEST_PASSWORD },
  { id: 8, email: 'nati@bestfin.com', role: 'user', name: 'Nati Smith', active: true, totalPayments: 2500, password: DEFAULT_TEST_PASSWORD },
  { id: 9, email: 'dave@bestfin.com', role: 'user', name: 'Dave Smith', active: true, totalPayments: 50, password: DEFAULT_TEST_PASSWORD }
];
// Mock data for transactions and wallet balances
// These can be used to simulate API responses in tests or development environments
export const defaultTransactions = [
  { id: 1, type: 'credit', amount: 500, description: 'Salary deposit', date: new Date().toISOString(), userId: 3 },
  { id: 2, type: 'debit', amount: 50, description: 'Coffee purchase', date: new Date(Date.now() - 86400000).toISOString(), userId: 3 },
  { id: 3, type: 'credit', amount: 200, description: 'Freelance payment', date: new Date(Date.now() - 172800000).toISOString(), userId: 3 },
  { id: 4, type: 'debit', amount: 100, description: 'Grocery shopping', date: new Date(Date.now() - 259200000).toISOString(), userId: 3 },
  { id: 5, type: 'credit', amount: 1000, description: 'Bonus payment', date: new Date(Date.now() - 345600000).toISOString(), userId: 3 },
  { id: 6, type: 'credit', amount: 500, description: 'Salary deposit', date: new Date().toISOString(), userId: 3 },
  { id: 7, type: 'credit', amount: 500, description: 'Salary deposit', date: new Date().toISOString(), userId: 3 },
  { id: 8, type: 'credit', amount: 500, description: 'Salary deposit', date: new Date().toISOString(), userId: 3 },
  { id: 9, type: 'credit', amount: 500, description: 'Salary deposit', date: new Date().toISOString(), userId: 3 }

];
// Default wallet balances for each user
export const defaultWalletBalances = {
  1: 1550,  // Regular User
  2: 800,   // John Doe
  3: 3200   // Jane Smith
};