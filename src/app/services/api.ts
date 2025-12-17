// API Service để gọi Backend qua API Gateway
const API_BASE_URL = 'http://localhost:3000';

// Token management
export const TokenManager = {
  getToken: () => localStorage.getItem('auth_token'),
  setToken: (token: string) => localStorage.setItem('auth_token', token),
  removeToken: () => localStorage.removeItem('auth_token'),
  getUserId: () => localStorage.getItem('user_id'),
  setUserId: (userId: string) => localStorage.setItem('user_id', userId),
};

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  skipAuth = false
): Promise<T> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (!skipAuth) {
      const token = TokenManager.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      
      // Handle unauthorized
      if (response.status === 401) {
        TokenManager.removeToken();
        window.location.href = '/';
      }
      
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    // Some DELETE endpoints may return empty string; try to parse JSON, fallback undefined
    try {
      const text = await response.text();
      if (!text) return undefined as T;
      return JSON.parse(text) as T;
    } catch (parseErr) {
      return undefined as T;
    }
  } catch (error: any) {
    console.error('API call error:', error);
    throw new Error(error.message || 'Failed to connect to server');
  }
}

// ============== AUTH SERVICE ==============

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string | number;
    email: string;
    name?: string;
    role: string;
  };
}

export const authApi = {
  register: (data: RegisterDto) => 
    apiCall<any>('/auth/register', 'POST', data, true),
  login: (data: LoginDto) => 
    apiCall<AuthResponse>('/auth/login', 'POST', data, true),
  getProfile: () => 
    apiCall<AuthResponse['user']>('/auth/profile', 'GET'),
};

// ============== TRANSACTION SERVICE ==============

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  balance: number;
  currency: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  categoryId: string;
  amount: number;
  transactionDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  wallet?: Wallet;
  category?: Category;
}

export interface CreateTransactionDto {
  walletId: string;
  // gửi categoryId (UUID) hoặc categoryName + categoryType
  categoryId?: string;
  categoryName?: string;
  categoryType?: 'income' | 'expense';
  amount: number;
  transactionDate: string;
  description?: string;
}

export interface CreateWalletDto {
  name: string;
  balance?: number;
  type?: string;
  currency?: string;
}

export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
}

// Wallet APIs
export const walletApi = {
  getAll: () => apiCall<Wallet[]>('/transaction/wallets'),
  create: (data: CreateWalletDto) => apiCall<Wallet>('/transaction/wallets', 'POST', data),
};

// Category APIs (Transaction Service)
export const categoryApi = {
  getAll: () => apiCall<Category[]>('/transaction/categories'),
  create: (data: CreateCategoryDto) => apiCall<Category>('/transaction/categories', 'POST', data),
};

// Transaction APIs
export const transactionApi = {
  getAll: () => apiCall<Transaction[]>('/transaction/transactions'),
  getById: (id: string) => apiCall<Transaction>(`/transaction/transactions/${id}`),
  create: (data: CreateTransactionDto) => apiCall<Transaction>('/transaction/transactions', 'POST', data),
  update: (id: string, data: Partial<CreateTransactionDto>) => 
    apiCall<Transaction>(`/transaction/transactions/${id}`, 'PUT', data),
  delete: (id: string) => apiCall<void>(`/transaction/transactions/${id}`, 'DELETE'),
};

// ============== BUDGET SERVICE ==============

export interface BudgetCategory {
  id: number;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  createdAt: string;
}

export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  limitAmount: number;
  spentAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
  category?: BudgetCategory;
}

export interface CreateBudgetDto {
  categoryId: number;
  limitAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

// Budget APIs
export const budgetApi = {
  getAll: () => apiCall<Budget[]>('/budget/budgets'),
  getById: (id: number) => apiCall<Budget>(`/budget/budgets/${id}`),
  create: (data: CreateBudgetDto) => apiCall<Budget>('/budget/budgets', 'POST', data),
  update: (id: number, data: Partial<CreateBudgetDto>) => 
    apiCall<Budget>(`/budget/budgets/${id}`, 'PUT', data),
  delete: (id: number) => apiCall<void>(`/budget/budgets/${id}`, 'DELETE'),
};

// Budget Category APIs
export const budgetCategoryApi = {
  getAll: () => apiCall<BudgetCategory[]>('/budget/categories'),
};

