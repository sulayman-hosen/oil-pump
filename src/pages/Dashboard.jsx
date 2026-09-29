import React from 'react';
import { useNavigate } from 'react-router';
import {
  Car,
  ClipboardList,
  Fuel,
  Calendar,
  Ban,
  Search,
  UserPlus,
  RefreshCw,
  Clock,
  Info,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { useLanguage } from '../context/LanguageContext';
import { resetToDemoData } from '../api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { stats, loading, refreshStats } = useStats();
  const navigate = useNavigate();
  const { t, formatNumber } = useLanguage();

  const RULES = [
    { labelKey: 'fuelRange1', days: 2 },
    { labelKey: 'fuelRange2', days: 3 },
    { labelKey: 'fuelRange3', days: 5 },
    { labelKey: 'fuelRange4', days: 7 },
    { labelKey: 'fuelRange5', days: 10 },
    { labelKey: 'fuelRange6', days: 12 },
  ];

  const handleResetData = () => {
    resetToDemoData();
    refreshStats();
    toast.success(t('demoNotice'));
  };

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>{t('welcome')}</h1>
          <p>{t('welcomeSub')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-outline"
            onClick={refreshStats}
            title="Refresh Data"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={15} />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/sell')}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Fuel size={17} />
            <span>{t('btnSellFuel')}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Car size={22} />
          </div>
          <div className="stat-number">{formatNumber(stats?.totalVehicles ?? 0)}</div>
          <div className="stat-label">{t('statTotalVehicles')}</div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
            <ClipboardList size={22} />
          </div>
          <div className="stat-number accent">{formatNumber(stats?.totalTransactions ?? 0)}</div>
          <div className="stat-label">{t('statTotalTransactions')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Fuel size={22} />
          </div>
          <div className="stat-number">
            {formatNumber(Number(stats?.totalFuel ?? 0).toFixed(0))}L
          </div>
          <div className="stat-label">{t('statTotalFuel')}</div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <Calendar size={22} />
          </div>
          <div className="stat-number info">{formatNumber(stats?.todayTx ?? 0)}</div>
          <div className="stat-label">{t('statTodayTx')}</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            <Ban size={22} />
          </div>
          <div className="stat-number danger">{formatNumber(stats?.blockedVehicles ?? 0)}</div>
          <div className="stat-label">{t('statBlockedVehicles')}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{t('quickActions')}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { icon: Search, label: t('navCheck'), path: '/check', style: 'btn-info' },
            { icon: Fuel, label: t('navSell'), path: '/sell', style: 'btn-primary' },
            { icon: UserPlus, label: t('navRegister'), path: '/register', style: 'btn-outline' },
            { icon: ClipboardList, label: t('navHistory'), path: '/history', style: 'btn-outline' },
          ].map(a => {
            const Icon = a.icon;
            return (
              <button
                key={a.path}
                className={`btn ${a.style}`}
                onClick={() => navigate(a.path)}
                style={{
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={18} />
                  <span>{a.label}</span>
                </span>
                <ArrowRight size={15} style={{ opacity: 0.7 }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Cooldown Rules Table/Cards */}
      <div className="card">
        <div style={{ marginBottom: 12 }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Clock size={18} color="var(--accent-dark)" />
            <span>{t('cooldownTitle')}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('cooldownSub')}</p>
        </div>

        <div className="rules-grid">
          {RULES.map((r, i) => (
            <div className="rule-card" key={i} style={{ transition: 'transform 0.2s ease' }}>
              <div className="rule-fuel" style={{ fontWeight: 700 }}>{t(r.labelKey)}</div>
              <div className="rule-days" style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                <Clock size={14} color="var(--warning)" />
                <span>{formatNumber(r.days)} {t('waitDays')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info & Demo Notice */}
      <div className="card" style={{
        background: 'var(--primary-pale)',
        borderColor: 'var(--success-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div className="card-title" style={{ color: 'var(--primary-mid)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={18} />
          <span>{t('systemIntroTitle')}</span>
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          {t('systemIntroDesc')}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px dashed var(--success-border)',
          paddingTop: 10,
          marginTop: 4,
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--primary-mid)' }}>
            <ShieldCheck size={16} />
            <span>{t('demoNotice')}</span>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleResetData}
            style={{ fontSize: 12, padding: '4px 10px', background: '#fff' }}
          >
            🔄 {t('resetDemoData')}
          </button>
        </div>
      </div>

    </div>
  );
}
