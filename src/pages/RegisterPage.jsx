import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import {
  UserPlus,
  Car,
  Bike,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Fuel,
  Sparkles,
} from 'lucide-react';
import { registerVehicle } from '../api';
import { useLanguage } from '../context/LanguageContext';

const INITIAL = { owner_name: '', license_number: '', vehicle_number: '', vehicle_type: 'bike' };

export default function RegisterPage() {
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handle = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.owner_name.trim())    e.owner_name    = t('ownerNameReq');
    if (!form.license_number.trim()) e.license_number = t('licenseReq');
    if (!form.vehicle_number.trim()) e.vehicle_number = t('vehicleNumReq');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerVehicle({
        ...form,
        vehicle_number: form.vehicle_number.toUpperCase().trim(),
        license_number: form.license_number.toUpperCase().trim(),
      });
      setSuccess(true);
      toast.success(t('regSuccessTitle'));
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const reset = () => {
    setForm(INITIAL);
    setSuccess(false);
    setErrors({});
  };

  if (success) {
    return (
      <div className="fade-in" style={{ maxWidth: 540 }}>
        <div className="card">
          <div className="success-center">
            <div className="success-checkmark">
              <CheckCircle2 size={50} color="#1a7f3c" />
            </div>
            <div className="success-title">{t('regSuccessTitle')}</div>
            <div className="success-sub">
              <strong>{form.owner_name}</strong> {t('regSuccessSub')}
            </div>
          </div>

          <div style={{
            background: 'var(--bg)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            marginBottom: 16,
          }}>
            {[
              { label: t('ownerName'),     value: form.owner_name },
              { label: t('vehicleNumber'), value: form.vehicle_number.toUpperCase() },
              { label: t('licenseNumber'), value: form.license_number.toUpperCase() },
              { label: t('vehicleType'),   value: form.vehicle_type === 'bike' ? `🏍️ ${t('bike')}` : `🚗 ${t('car')}` },
            ].map((r, i) => (
              <div className="info-row" key={i}>
                <span className="info-row-label">{r.label}:</span>
                <span className="info-row-value">{r.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/sell', { state: { vehicle: { ...form, vehicle_number: form.vehicle_number.toUpperCase() } } })}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Fuel size={18} />
              <span>{t('goToSell')}</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="btn btn-outline"
              onClick={reset}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <UserPlus size={16} />
              <span>{t('registerAnother')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>

      <div className="page-header-text">
        <h1>📝 {t('registerHeaderTitle')}</h1>
        <p>{t('registerHeaderSub')}</p>
      </div>

      <div className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={18} color="var(--primary)" />
          <span>{t('registerFormTitle')}</span>
        </div>

        <div className="form-section">
          {/* Owner Name */}
          <div className="form-group">
            <label className="form-label">
              {t('ownerName')} <span className="required">*</span>
            </label>
            <input
              className="form-control"
              name="owner_name"
              value={form.owner_name}
              onChange={handle}
              placeholder={t('ownerNamePlaceholder')}
              autoFocus
            />
            {errors.owner_name && (
              <div className="form-hint" style={{ color: 'var(--danger)' }}>
                {errors.owner_name}
              </div>
            )}
          </div>

          {/* Driving License */}
          <div className="form-group">
            <label className="form-label">
              {t('licenseNumber')} <span className="required">*</span>
            </label>
            <input
              className="form-control"
              name="license_number"
              value={form.license_number}
              onChange={handle}
              placeholder={t('licenseNumberPlaceholder')}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.license_number && (
              <div className="form-hint" style={{ color: 'var(--danger)' }}>
                {errors.license_number}
              </div>
            )}
          </div>

          {/* Vehicle Number & Type */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                {t('vehicleNumber')} <span className="required">*</span>
              </label>
              <input
                className="form-control"
                name="vehicle_number"
                value={form.vehicle_number}
                onChange={handle}
                placeholder={t('vehicleNumberPlaceholder')}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.vehicle_number && (
                <div className="form-hint" style={{ color: 'var(--danger)' }}>
                  {errors.vehicle_number}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('vehicleType')} <span className="required">*</span>
              </label>
              <select
                className="form-control"
                name="vehicle_type"
                value={form.vehicle_type}
                onChange={handle}
              >
                <option value="bike">🏍️ {t('bike')}</option>
                <option value="car">🚗 {t('car')}</option>
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={submit}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                <span>{t('registering')}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>{t('registerBtn')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning Alert */}
      <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertTriangle size={18} />
        <span>{t('duplicateWarn')}</span>
      </div>

    </div>
  );
}
