import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  Bike,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Fuel,
} from 'lucide-react';
import { checkEligibility, remainingDays } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function CheckPage() {
  const [form, setForm]     = useState({ vehicle_number: '', license_number: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { t, formatNumber, formatDate } = useLanguage();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const doCheck = async (customPayload) => {
    const payload = customPayload || form;
    if (!payload.vehicle_number && !payload.license_number) {
      setError(t('inputRequiredErr'));
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await checkEligibility(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleKey = e => { if (e.key === 'Enter') doCheck(); };

  // Sample quick test fill
  const handleQuickFill = (type) => {
    let sampleData;
    if (type === 'blocked') {
      sampleData = { vehicle_number: 'ঢাকা মেট্রো হ ১১-২২৩৩', license_number: '' };
    } else {
      sampleData = { vehicle_number: 'ঢাকা মেট্রো গ ৮৮-৯৯০০', license_number: '' };
    }
    setForm(sampleData);
    doCheck(sampleData);
  };

  const rem = result?.next_allowed_date ? remainingDays(result.next_allowed_date) : 0;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>

      <div className="page-header-text">
        <h1>🔍 {t('pageCheckTitle')}</h1>
        <p>{t('pageCheckSub')}</p>
      </div>

      <div className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={18} color="var(--info)" />
          <span>{t('searchCardTitle')}</span>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label className="form-label">{t('vehicleNumberLabel')}</label>
            <input
              className="form-control"
              name="vehicle_number"
              value={form.vehicle_number}
              onChange={handle}
              onKeyDown={handleKey}
              placeholder={t('vehicleNumberPlaceholder')}
              autoFocus
            />
          </div>

          <div className="or-divider">{t('orDivider')}</div>

          <div className="form-group">
            <label className="form-label">{t('licenseNumberLabel')}</label>
            <input
              className="form-control"
              name="license_number"
              value={form.license_number}
              onChange={handle}
              onKeyDown={handleKey}
              placeholder={t('licenseNumberPlaceholder')}
            />
          </div>

          {error && (
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn btn-info btn-full btn-lg"
            onClick={() => doCheck()}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 16, height: 16 }} />
                <span>{t('checking')}</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>{t('btnCheckNow')}</span>
              </>
            )}
          </button>

          {/* Quick Demo Pre-fill Links */}
          <div style={{
            marginTop: 10,
            padding: '10px 12px',
            background: 'var(--bg)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 6,
            fontSize: 12,
          }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('quickFillSample')}:</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handleQuickFill('eligible')}
                style={{ fontSize: 11, padding: '3px 8px', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none' }}
              >
                ✅ {t('statusEligible')}
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handleQuickFill('blocked')}
                style={{ fontSize: 11, padding: '3px 8px', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}
              >
                🚫 {t('statusBlocked')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="card fade-in">
          {/* Vehicle Info Box */}
          <div className="vehicle-info-box" style={{ marginBottom: 14 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Car size={16} />
              <span>{t('vehicleDetails')}</span>
            </h4>
            <div className="vi-grid">
              <span className="vi-lbl">{t('ownerName')}:</span>
              <span className="vi-val"><strong>{result.vehicle?.owner_name}</strong></span>

              <span className="vi-lbl">{t('vehicleNumber')}:</span>
              <span className="vi-val">
                <span className="badge badge-green">{result.vehicle?.vehicle_number}</span>
              </span>

              <span className="vi-lbl">{t('licenseNumber')}:</span>
              <span className="vi-val">{result.vehicle?.license_number}</span>

              <span className="vi-lbl">{t('vehicleType')}:</span>
              <span className="vi-val">
                {result.vehicle?.vehicle_type === 'bike' ? `🏍️ ${t('bike')}` : `🚗 ${t('car')}`}
              </span>
            </div>
          </div>

          {result.eligible ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="alert alert-success" style={{ fontSize: 14.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} color="#1a7f3c" />
                <span>{t('eligibleBanner')}</span>
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={() => navigate('/sell', { state: { vehicle: result.vehicle } })}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Fuel size={18} />
                <span>{t('btnSellFuel')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="alert alert-error" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={20} color="var(--danger)" />
                <span>{t('blockedBanner')}</span>
              </div>

              <div className="countdown-box" style={{ margin: '8px 0' }}>
                <div className="countdown-icon">⏳</div>
                <div>
                  <div className="countdown-label">{t('remainingWaitTime')}</div>
                  <div className="countdown-value">
                    {formatNumber(rem)} {t('daysRemaining')}
                  </div>
                </div>
              </div>

              <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} />
                <div>
                  <strong>{t('nextAllowedDate')}:</strong>{' '}
                  {formatDate(result.next_allowed_date)}
                </div>
              </div>

              {result.last_transaction && (
                <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
                  {t('lastPurchased')}: <strong>{formatNumber(result.last_transaction.fuel_amount)} {t('liters')}</strong>{' '}
                  ({formatDate(result.last_transaction.transaction_date, true)})
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
