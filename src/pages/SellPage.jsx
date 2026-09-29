import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import toast from 'react-hot-toast';
import {
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  PlusCircle,
  Car,
  User,
  ArrowLeft,
  ArrowRight,
  Receipt,
  Check,
} from 'lucide-react';
import { checkEligibility, recordPurchase, getCooldownDays, remainingDays } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function SellPage() {
  const location = useLocation();
  const { t, formatNumber, formatDate } = useLanguage();

  const [step, setStep]       = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [query, setQuery]     = useState({ vehicle_number: '', license_number: '' });
  const [fuel, setFuel]       = useState('');
  const [attendant, setAttendant] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // If redirected from CheckPage with verified vehicle
  useEffect(() => {
    if (location.state?.vehicle) {
      setVehicle(location.state.vehicle);
      setStep(1);
    }
  }, [location.state]);

  const handleQuery = e => setQuery({ ...query, [e.target.name]: e.target.value });

  // ── Step 0: Verify Vehicle ──
  const verifyVehicle = async () => {
    if (!query.vehicle_number && !query.license_number) {
      setError(t('inputRequiredErr'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await checkEligibility(query);
      if (res.data.eligible) {
        setVehicle(res.data.vehicle);
        setStep(1);
        toast.success(t('step1Title') + ' — ' + res.data.vehicle.owner_name);
      } else {
        const rem = remainingDays(res.data.next_allowed_date);
        setError(t('blockedAlertSell', { days: formatNumber(rem) }));
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ── Step 1: Confirm Sale ──
  const confirmSell = async () => {
    const liters = Number(fuel);
    if (!liters || liters <= 0) {
      setError(t('fuelAmountErr'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await recordPurchase({
        vehicle_number: vehicle.vehicle_number,
        license_number: vehicle.license_number,
        fuel_amount: liters,
        attendant_name: attendant || 'কর্মী',
      });
      setReceipt(res.data);
      setStep(2);
      toast.success(t('step3Title'));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(0);
    setVehicle(null);
    setFuel('');
    setAttendant('');
    setQuery({ vehicle_number: '', license_number: '' });
    setReceipt(null);
    setError('');
  };

  const liters    = Number(fuel);
  const cooldown  = liters > 0 ? getCooldownDays(liters) : 0;
  const nextDateRaw = liters > 0 ? new Date(Date.now() + cooldown * 86400000).toISOString() : null;

  const STEPS = [
    { label: t('step1'), index: 0 },
    { label: t('step2'), index: 1 },
    { label: t('step3'), index: 2 },
  ];

  const presets = [2, 5, 8, 10, 15, 20];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 580 }}>

      <div className="page-header-text">
        <h1>⛽ {t('pageSellTitle')}</h1>
        <p>{t('pageSellSub')}</p>
      </div>

      {/* Step Bar */}
      <div className="step-bar">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`step-item ${i < step ? 'done' : i === step ? 'active' : ''}`}
          >
            <div className="step-circle">
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ── STEP 0: Verify ── */}
      {step === 0 && (
        <div className="card">
          <div className="card-title">{t('step1Title')}</div>
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">{t('vehicleNumberLabel')}</label>
              <input
                className="form-control"
                name="vehicle_number"
                value={query.vehicle_number}
                onChange={handleQuery}
                onKeyDown={e => e.key === 'Enter' && verifyVehicle()}
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
                value={query.license_number}
                onChange={handleQuery}
                onKeyDown={e => e.key === 'Enter' && verifyVehicle()}
                placeholder={t('licenseNumberPlaceholder')}
              />
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={verifyVehicle}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  <span>{t('checking')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>{t('verifyAndNext')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Fuel Amount ── */}
      {step === 1 && vehicle && (
        <div className="card">
          <div className="card-title">{t('step2Title')}</div>
          <div className="form-section">

            {/* Vehicle Info Summary Box */}
            <div className="vehicle-info-box">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>{t('verifiedVehicle')}</span>
              </h4>
              <div className="vi-grid">
                <span className="vi-lbl">{t('ownerName')}:</span>
                <span className="vi-val"><strong>{vehicle.owner_name}</strong></span>

                <span className="vi-lbl">{t('vehicleNumber')}:</span>
                <span className="vi-val">
                  <span className="badge badge-green">{vehicle.vehicle_number}</span>
                </span>

                <span className="vi-lbl">{t('vehicleType')}:</span>
                <span className="vi-val">
                  {vehicle.vehicle_type === 'bike' ? `🏍️ ${t('bike')}` : `🚗 ${t('car')}`}
                </span>
              </div>
            </div>

            {/* Fuel Quantity Input */}
            <div className="form-group">
              <label className="form-label">
                {t('fuelAmountLabel')} <span className="required">*</span>
              </label>
              <input
                className="form-control"
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={fuel}
                onChange={e => { setFuel(e.target.value); setError(''); }}
                placeholder={t('fuelAmountPlaceholder')}
                style={{ fontSize: 20, fontWeight: 700 }}
                autoFocus
              />
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                {t('quickPresets')}
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {presets.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`btn btn-sm ${Number(fuel) === p ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => { setFuel(String(p)); setError(''); }}
                    style={{ minWidth: 50, fontWeight: 600 }}
                  >
                    {formatNumber(p)}L
                  </button>
                ))}
              </div>
            </div>

            {/* Live Cooldown Preview */}
            {liters > 0 && (
              <div className="fuel-preview fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Clock size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{formatNumber(liters)} {t('liters')}</strong> {t('fuelPreviewText')}{' '}
                  <strong style={{ textDecoration: 'underline' }}>{formatNumber(cooldown)} {t('daysUnit')}</strong>{' '}
                  {t('fuelPreviewSub')}
                  <div style={{ fontSize: 12, marginTop: 4, opacity: 0.85 }}>
                    {t('nextAllowedDate')}: <strong>{formatDate(nextDateRaw)}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Attendant Name */}
            <div className="form-group">
              <label className="form-label">{t('attendantLabel')}</label>
              <input
                className="form-control"
                value={attendant}
                onChange={e => setAttendant(e.target.value)}
                placeholder={t('attendantPlaceholder')}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                className="btn btn-outline"
                onClick={() => { setStep(0); setError(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={16} />
                <span>{t('back')}</span>
              </button>
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={confirmSell}
                disabled={loading || !fuel}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                    <span>{t('processing')}</span>
                  </>
                ) : (
                  <>
                    <Fuel size={18} />
                    <span>{t('confirmSale')}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── STEP 2: Success Receipt ── */}
      {step === 2 && receipt && (
        <div className="card fade-in">
          <div className="success-center">
            <div className="success-checkmark">
              <CheckCircle2 size={48} color="#1a7f3c" />
            </div>
            <div className="success-title">{t('step3Title')}</div>
            <div className="success-sub">{t('saleSuccessMsg')}</div>
          </div>

          {/* Printable Receipt Box */}
          <div
            id="printable-receipt"
            style={{
              background: '#f9fbf9',
              border: '2px dashed var(--border-dark)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: 16,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              paddingBottom: 10,
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Receipt size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: 14 }}>{t('receiptTitle')}</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {receipt.transaction?.id || 'TX-REC'}
              </span>
            </div>

            {[
              { label: t('vehicleNumber'), value: vehicle?.vehicle_number },
              { label: t('ownerName'), value: vehicle?.owner_name },
              { label: t('fuelAmountLabel'), value: `${formatNumber(fuel)} ${t('liters')}` },
              { label: t('attendantLabel'), value: attendant || t('attendantPlaceholder') },
              { label: t('cooldownPeriod'), value: `${formatNumber(receipt.cooldown_days)} ${t('daysUnit')}` },
              { label: t('nextAllowedDate'), value: formatDate(receipt.next_allowed_date) },
              { label: t('thTxDate'), value: formatDate(receipt.transaction?.transaction_date || new Date().toISOString(), true) },
            ].map((row, i) => (
              <div className="info-row" key={i}>
                <span className="info-row-label">{row.label}:</span>
                <span className="info-row-value">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="alert alert-info" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} />
            <div>
              <strong>{t('nextAllowedDate')}:</strong> {formatDate(receipt.next_allowed_date)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-outline"
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Printer size={16} />
              <span>{t('receiptPrint')}</span>
            </button>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={reset}
            >
              <PlusCircle size={18} />
              <span>{t('newSaleBtn')}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
