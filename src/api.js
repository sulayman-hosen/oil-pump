import axios from 'axios';
import {
  localRegisterVehicle,
  localCheckEligibility,
  localRecordPurchase,
  getLocalVehicles,
  getLocalTransactions,
  localGetStats,
  getCooldownDays as localCooldownDays,
  resetToSeedData as resetStore,
} from './mockStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 4000,
});

export const resetToDemoData = () => {
  resetStore();
};

export const registerVehicle = async (data) => {
  try {
    const res = await api.post('/vehicles/register', data);
    return res;
  } catch {
    // Fallback to local storage
    const res = localRegisterVehicle(data);
    return { data: res };
  }
};

export const checkEligibility = async (data) => {
  try {
    const res = await api.post('/fuel/check', data);
    return res;
  } catch {
    const res = localCheckEligibility(data);
    return { data: res };
  }
};

export const recordPurchase = async (data) => {
  try {
    const res = await api.post('/fuel/purchase', data);
    return res;
  } catch {
    const res = localRecordPurchase(data);
    return { data: res };
  }
};

export const getVehicles = async () => {
  try {
    const res = await api.get('/vehicles');
    return res;
  } catch {
    const vehicles = getLocalVehicles();
    return { data: { vehicles } };
  }
};

export const getTransactions = async () => {
  try {
    const res = await api.get('/transactions');
    return res;
  } catch {
    const transactions = getLocalTransactions();
    return { data: { transactions } };
  }
};

export const getStats = async () => {
  try {
    const res = await api.get('/stats');
    return res;
  } catch {
    const stats = localGetStats();
    return { data: stats };
  }
};

export const getCooldownRules = async () => {
  try {
    return await api.get('/cooldown-rules');
  } catch {
    return {
      data: [
        { min: 1, max: 2, days: 2 },
        { min: 3, max: 4, days: 3 },
        { min: 5, max: 7, days: 5 },
        { min: 8, max: 9, days: 7 },
        { min: 10, max: 14, days: 10 },
        { min: 15, max: 999, days: 12 },
      ],
    };
  }
};

// Local calculation
export function getCooldownDays(liters) {
  return localCooldownDays(liters);
}

export function formatDateBn(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTimeBn(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function remainingDays(nextDateStr) {
  if (!nextDateStr) return 0;
  const diff = new Date(nextDateStr) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function isBlocked(nextDateStr) {
  if (!nextDateStr) return false;
  return new Date(nextDateStr) > new Date();
}