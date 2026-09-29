import { useEffect, useState } from 'react';
import { getStats } from '../api';

const EMPTY_STATS = {
  totalVehicles: 0,
  totalTransactions: 0,
  totalFuel: 0,
  todayTx: 0,
  blockedVehicles: 0,
};

export function useStats() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await getStats();
      const data = res?.data ?? {};

      setStats({
        totalVehicles: data.totalVehicles ?? 0,
        totalTransactions: data.totalTransactions ?? 0,
        totalFuel: data.totalFuel ?? 0,
        todayTx: data.todayTx ?? 0,
        blockedVehicles: data.blockedVehicles ?? 0,
      });
    } catch (err) {
      setError(err.message || 'স্ট্যাটস লোড করা যায়নি।');
      setStats(EMPTY_STATS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats,
  };
}