import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../components/services/Api/Api.js';
const AppContext = createContext();

const appReducer = (state, action) => {
  // Reducer function to manage the state of the application
  // Handles actions related to users, transactions, wallet balance, loading state, and errors
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        )
      };
      // Handles user updates, such as toggling status (active/inactive) and adding/removing admins
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
      // Handles adding a new user (admin) to the application
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'SET_WALLET_BALANCE':
      return { ...state, walletBalance: action.payload };
    case 'UPDATE_WALLET_BALANCE':
      return { ...state, walletBalance: state.walletBalance + action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
// Reducer function to manage the state of the application
const initialState = {
  users: [],
  transactions: [],
  walletBalance: 0,
  loading: false,
  error: null
};
// Initial state for the application context
// Context to provide application-wide state and actions
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeData();
    }
  }, [isAuthenticated, user]);

// Effect to initialize data when the user is authenticated and has a valid user object
  const handleError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error.message });
  }
// Function to handle errors and update the state with the error message
  const initializeData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [users, transactions, walletData] = await Promise.all([
        api.getUsers(),
        api.getTransactions(user.id),
        api.getWalletBalance(user.id)
      ]);
      // Fetch initial data for users, transactions, and wallet balance using the API functions
      dispatch({ type: 'SET_USERS', payload: users });
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      dispatch({ type: 'SET_WALLET_BALANCE', payload: walletData.balance });
      
    } catch (error) { // Handle any errors that occur during data fetching
      handleError(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });// Set loading state to false after data fetching is complete
    }
  };
// Function to initialize data when the user is authenticated and has a valid user object
  const toggleUserStatus = async (userId) => {
    try {
      const { user } = await api.toggleUserStatus(userId);
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error) {
      handleError(error);
    }
  };
// Function to toggle the status of a user (activate/deactivate)
  const addTransaction = async (transactionData) => {
    try {
      const { transaction } = await api.addTransaction({ ...transactionData, userId: user.id });
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      const balanceChange = transaction.type === 'credit' ? transaction.amount : -transaction.amount;
      dispatch({ type: 'UPDATE_WALLET_BALANCE', payload: balanceChange });
    } catch (error) {
      handleError(error);
    }
  };
// Function to add a new transaction and update the wallet balance accordingly
  const addAdmin = async (userData) => {
    try {
      const { user } = await api.addAdmin(userData);
      dispatch({ type: 'ADD_USER', payload: user });
    } catch (error) {
      handleError(error);
    }
  };
// Function to add a new admin user
  const removeAdmin = async (userId) => {
    try {
      await api.removeAdmin(userId);
      dispatch({ type: 'REMOVE_USER', payload: userId });
    } catch (error) {
      handleError(error);
    }
  };
// Function to remove an admin user
  const value = {
    ...state,
    toggleUserStatus,
    addTransaction,
    addAdmin,
    removeAdmin
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
// Context provider component to wrap the application and provide state and actions
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
