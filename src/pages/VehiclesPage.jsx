import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Car,
  Search,
  Download,
  Fuel,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import { getVehicles } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | bike | car
  const { t, formatNumber, formatDate } = useLanguage();
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    getVehicles()
      .then(r => setVehicles(r.data.vehicles || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = vehicles.filter(v => {
    const matchSearch =
      v.vehicle_number.toLowerCase().includes(search.toLowerCase()) ||
      v.license_number.toLowerCase().includes(search.toLowerCase()) ||
      v.owner_name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || v.vehicle_type === typeFilter;
    return matchSearch && matchType;
  });

  const exportToCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['#', 'Owner Name', 'Vehicle Number', 'License Number', 'Type', 'Registration Date'];
    const rows = filtered.map((v, i) => [
      i + 1,
      `"${v.owner_name}"`,
      `"${v.vehicle_number}"`,
      `"${v.license_number}"`,
      v.vehicle_type,
      v.created_at ? v.created_at.slice(0, 10) : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vehicles_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>🚗 {t('vehiclesTitle')}</h1>
          <p>{t('vehiclesSub', { count: formatNumber(vehicles.length) })}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} />
            <span>{t('exportCsv')}</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/register')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={15} />
            <span>{t('navRegister')}</span>
          </button>
        </div>
      </div>

      <div className="card">
        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Search box */}
          <div className="search-box-wrap" style={{ flex: 1, minWidth: 260 }}>
            <span className="search-icon"><Search size={16} /></span>
            <input
              className="form-control"
              placeholder={t('searchVehiclesPlaceholder')}
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

          {/* Type Filter Pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all',  label: t('allVehicles') },
              { id: 'bike', label: t('filterBike') },
              { id: 'car',  label: t('filterCar') },
            ].map(f => (
              <button
                key={f.id}
                className={`btn btn-sm ${typeFilter === f.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTypeFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            {t('loading')}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚗</div>
            <p>{t('noVehiclesFound')}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('thIndex')}</th>
                  <th>{t('thOwner')}</th>
                  <th>{t('thVehicleNo')}</th>
                  <th>{t('thLicense')}</th>
                  <th>{t('thType')}</th>
                  <th>{t('thRegDate')}</th>
                  <th style={{ textAlign: 'right' }}>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr key={v.id || i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {formatNumber(i + 1)}
                    </td>
                    <td><strong>{v.owner_name}</strong></td>
                    <td>
                      <span className="badge badge-green">{v.vehicle_number}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {v.license_number}
                    </td>
                    <td>
                      <span className={`badge badge-${v.vehicle_type === 'bike' ? 'orange' : 'blue'}`}>
                        {v.vehicle_type === 'bike' ? `🏍️ ${t('bike')}` : `🚗 ${t('car')}`}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {formatDate(v.created_at)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate('/sell', { state: { vehicle: v } })}
                        title={t('btnSellFuel')}
                        style={{ padding: '3px 8px', fontSize: 11 }}
                      >
                        <Fuel size={13} style={{ marginRight: 4 }} />
                        <span>{t('navSell')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
            {t('showingResults', { count: formatNumber(filtered.length) })}
          </div>
        )}
      </div>

    </div>
  );
}
