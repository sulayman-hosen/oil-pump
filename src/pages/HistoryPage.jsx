import React, { useEffect, useState } from 'react';
import {
  History,
  Search,
  Download,
  Printer,
  X,
  Clock,
  CheckCircle2,
  Ban,
} from 'lucide-react';
import { getTransactions, isBlocked, remainingDays } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function HistoryPage() {
  const [txs, setTxs]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all'); // all | blocked | free
  const { t, formatNumber, formatDate } = useLanguage();

  const loadData = () => {
    setLoading(true);
    getTransactions()
      .then(r => setTxs(r.data.transactions || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = txs.filter(tItem => {
    const matchSearch =
      (tItem.vehicle_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (tItem.license_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (tItem.owner_name && tItem.owner_name.toLowerCase().includes(search.toLowerCase())) ||
      (tItem.attendant_name && tItem.attendant_name.toLowerCase().includes(search.toLowerCase()));

    const blocked = isBlocked(tItem.next_allowed_date);
    if (filter === 'blocked') return matchSearch && blocked;
    if (filter === 'free')    return matchSearch && !blocked;
    return matchSearch;
  });

  const blockedCount = txs.filter(item => isBlocked(item.next_allowed_date)).length;
  const freeCount    = txs.length - blockedCount;

  const exportToCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['#', 'Vehicle Number', 'Owner Name', 'Type', 'Fuel (L)', 'Cooldown (Days)', 'Next Allowed Date', 'Status', 'Attendant', 'Transaction Date'];
    const rows = filtered.map((item, i) => {
      const blocked = isBlocked(item.next_allowed_date);
      return [
        i + 1,
        `"${item.vehicle_number}"`,
        `"${item.owner_name || ''}"`,
        item.vehicle_type,
        item.fuel_amount,
        item.cooldown_days,
        item.next_allowed_date ? item.next_allowed_date.slice(0, 10) : '',
        blocked ? 'Blocked' : 'Eligible',
        `"${item.attendant_name || ''}"`,
        item.transaction_date ? item.transaction_date.slice(0, 19).replace('T', ' ') : '',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fuel_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>📋 {t('historyTitle')}</h1>
          <p>{t('historySub')}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="badge badge-gray">{t('totalTxs', { count: formatNumber(txs.length) })}</span>
          <span className="badge badge-red">{t('blockedTxs', { count: formatNumber(blockedCount) })}</span>
          <span className="badge badge-green">{t('freeTxs', { count: formatNumber(freeCount) })}</span>
          <button
            className="btn btn-outline btn-sm"
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}
          >
            <Download size={14} />
            <span>{t('exportCsv')}</span>
          </button>
        </div>
      </div>

      <div className="card">
        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div className="search-box-wrap" style={{ flex: 1, minWidth: 260 }}>
            <span className="search-icon"><Search size={16} /></span>
            <input
              className="form-control"
              placeholder={t('searchHistoryPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all',     label: t('tabAll') },
              { id: 'blocked', label: t('tabBlocked') },
              { id: 'free',    label: t('tabFree') },
            ].map(f => (
              <button
                key={f.id}
                className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            {t('loading')}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>{t('noHistoryFound')}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('thIndex')}</th>
                  <th>{t('thVehicleNo')}</th>
                  <th>{t('thOwner')}</th>
                  <th>{t('thType')}</th>
                  <th>{t('thLiters')}</th>
                  <th>{t('thWait')}</th>
                  <th>{t('thNextAllowed')}</th>
                  <th>{t('thStatus')}</th>
                  <th>{t('thTxDate')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => {
                  const blocked = isBlocked(tx.next_allowed_date);
                  const rem     = blocked ? remainingDays(tx.next_allowed_date) : 0;
                  return (
                    <tr key={tx.id || i}>
                      <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                        {formatNumber(i + 1)}
                      </td>
                      <td>
                        <strong style={{ fontSize: 13 }}>{tx.vehicle_number}</strong>
                      </td>
                      <td style={{ fontSize: 13 }}>{tx.owner_name || '—'}</td>
                      <td>
                        <span className={`badge badge-${tx.vehicle_type === 'bike' ? 'orange' : 'blue'}`}>
                          {tx.vehicle_type === 'bike' ? '🏍️' : '🚗'}
                        </span>
                      </td>
                      <td>
                        <strong>{formatNumber(tx.fuel_amount)}L</strong>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {formatNumber(tx.cooldown_days)} {t('daysUnit')}
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {formatDate(tx.next_allowed_date)}
                      </td>
                      <td>
                        {blocked ? (
                          <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Ban size={12} />
                            <span>{t('statusBlocked')} ({formatNumber(rem)}{t('daysUnit')})</span>
                          </span>
                        ) : (
                          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={12} />
                            <span>{t('statusEligible')}</span>
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {formatDate(tx.transaction_date, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
            {t('showingResults', { count: formatNumber(filtered.length) })}
          </div>
        )}
      </div>

    </div>
  );
}
