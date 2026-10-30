import { 
  DEMO_USERS, 
  INITIAL_LISTINGS, 
  INITIAL_REQUESTS, 
  INITIAL_STATUS_HISTORY, 
  INITIAL_REPORTS 
} from '../data/demoData';
import { 
  FoodListing, 
  DonationRequest, 
  StatusHistoryItem, 
  Report, 
  User, 
  AdminAuditLog 
} from '../types';

const STORAGE_KEYS = {
  USERS: 'sharebite_users',
  CURRENT_USER: 'sharebite_current_user',
  LISTINGS: 'sharebite_listings',
  REQUESTS: 'sharebite_requests',
  STATUS_HISTORY: 'sharebite_status_history',
  REPORTS: 'sharebite_reports',
  ADMIN_LOGS: 'sharebite_admin_logs',
  SETTINGS: 'sharebite_settings',
  INITIALIZED: 'sharebite_initialized_v1',
};

export interface AppSettings {
  gramsPerMeal: number; // default 400g
  demoMode: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  gramsPerMeal: 400,
  demoMode: true,
};

// Safe localStorage access
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
  }
}

export const storageService = {
  initialize() {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      this.resetToDefault();
    }
  },

  resetToDefault() {
    safeSet(STORAGE_KEYS.USERS, DEMO_USERS);
    safeSet(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    safeSet(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    safeSet(STORAGE_KEYS.STATUS_HISTORY, INITIAL_STATUS_HISTORY);
    safeSet(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    safeSet(STORAGE_KEYS.ADMIN_LOGS, [
      {
        id: 'log_init',
        adminId: 'user_admin_1',
        adminName: 'ShareBite Operations Team',
        action: 'System Initialized',
        targetType: 'system',
        targetId: 'sys_root',
        details: 'Seeded initial verified restaurants, food banks, and sample food listings.',
        timestamp: new Date().toISOString(),
      } as AdminAuditLog
    ]);
    safeSet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    // Keep or set default current user to donor
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      safeSet(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  getUsers(): User[] {
    return safeGet<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  },

  saveUsers(users: User[]) {
    safeSet(STORAGE_KEYS.USERS, users);
  },

  getCurrentUser(): User | null {
    return safeGet<User | null>(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  },

  setCurrentUser(user: User | null) {
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
  },

  getListings(): FoodListing[] {
    return safeGet<FoodListing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  },

  saveListings(listings: FoodListing[]) {
    safeSet(STORAGE_KEYS.LISTINGS, listings);
  },

  getRequests(): DonationRequest[] {
    return safeGet<DonationRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },

  saveRequests(requests: DonationRequest[]) {
    safeSet(STORAGE_KEYS.REQUESTS, requests);
  },

  getStatusHistory(): StatusHistoryItem[] {
    return safeGet<StatusHistoryItem[]>(STORAGE_KEYS.STATUS_HISTORY, INITIAL_STATUS_HISTORY);
  },

  saveStatusHistory(history: StatusHistoryItem[]) {
    safeSet(STORAGE_KEYS.STATUS_HISTORY, history);
  },

  addStatusHistory(item: Omit<StatusHistoryItem, 'id' | 'timestamp'>) {
    const list = this.getStatusHistory();
    const newItem: StatusHistoryItem = {
      ...item,
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
    };
    this.saveStatusHistory([newItem, ...list]);
    return newItem;
  },

  getReports(): Report[] {
    return safeGet<Report[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  },

  saveReports(reports: Report[]) {
    safeSet(STORAGE_KEYS.REPORTS, reports);
  },

  getAdminLogs(): AdminAuditLog[] {
    return safeGet<AdminAuditLog[]>(STORAGE_KEYS.ADMIN_LOGS, []);
  },

  saveAdminLogs(logs: AdminAuditLog[]) {
    safeSet(STORAGE_KEYS.ADMIN_LOGS, logs);
  },

  addAdminLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>) {
    const list = this.getAdminLogs();
    const newLog: AdminAuditLog = {
      ...log,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
    };
    this.saveAdminLogs([newLog, ...list]);
    return newLog;
  },

  getSettings(): AppSettings {
    return safeGet<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  saveSettings(settings: AppSettings) {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  }
};

// Auto initialize on import
storageService.initialize();
