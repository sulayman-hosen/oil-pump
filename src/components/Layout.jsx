import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Search,
  Fuel,
  UserPlus,
  Car,
  History,
  Languages,
  Menu,
  X,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Layout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);
  const { lang, toggleLanguage, t, formatDate } = useLanguage();

  const currentPath = location.pathname;

  // Nav Items with icons & keys
  const NAV_ITEMS = [
    { path: '/',          icon: LayoutDashboard, labelKey: 'navDashboard', sectionKey: 'secMain' },
    { path: '/check',     icon: Search,          labelKey: 'navCheck',     sectionKey: 'secFuel' },
    { path: '/sell',      icon: Fuel,            labelKey: 'navSell',      sectionKey: 'secFuel' },
    { path: '/register',  icon: UserPlus,        labelKey: 'navRegister',  sectionKey: 'secManage' },
    { path: '/vehicles',  icon: Car,             labelKey: 'navVehicles',  sectionKey: 'secManage' },
    { path: '/history',   icon: History,         labelKey: 'navHistory',   sectionKey: 'secManage' },
  ];

  const PAGE_INFO = {
    '/':         { titleKey: 'pageDashboardTitle', subKey: 'pageDashboardSub' },
    '/check':    { titleKey: 'pageCheckTitle',     subKey: 'pageCheckSub' },
    '/sell':     { titleKey: 'pageSellTitle',      subKey: 'pageSellSub' },
    '/register': { titleKey: 'pageRegisterTitle',  subKey: 'pageRegisterSub' },
    '/vehicles': { titleKey: 'pageVehiclesTitle',  subKey: 'pageVehiclesSub' },
    '/history':  { titleKey: 'pageHistoryTitle',   subKey: 'pageHistorySub' },
  };

  const pageInfo = PAGE_INFO[currentPath] || { titleKey: 'brandName', subKey: 'brandSub' };

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false); }, [currentPath]);

  const sections = [
    { key: 'secMain', label: t('secMain') },
    { key: 'secFuel', label: t('secFuel') },
    { key: 'secManage', label: t('secManage') },
  ];

  const todayStr = formatDate(new Date().toISOString());

  return (
    <div className="app-shell">
      {/* Mobile Drawer Overlay */}
      <div
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #27ae60 0%, #1a7f3c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(26,127,60,0.3)',
              color: '#fff',
            }}>
              <Fuel size={22} />
            </div>
            <div>
              <div className="sidebar-logo-title" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.2px' }}>
                {t('brandName')}
              </div>
              <div className="sidebar-logo-sub" style={{ fontSize: 11, opacity: 0.75 }}>
                {t('brandSub')}
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => {
            const items = NAV_ITEMS.filter(n => n.sectionKey === section.key);
            return (
              <div key={section.key} style={{ marginBottom: 6 }}>
                <div className="nav-section-label">{section.label}</div>
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => navigate(item.path)}
                    >
                      <span className="nav-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon size={18} />
                      </span>
                      <span>{t(item.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer" style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)' }}>
            <ShieldCheck size={14} color="#2ecc71" />
            <span>{t('liveDb')}</span>
          </div>
          <div>{t('brandName')} © {new Date().getFullYear()}</div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="main-area">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button
              className="hamburger"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle Navigation Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <div className="header-page-title">{t(pageInfo.titleKey)}</div>
              <div className="header-breadcrumb">{t(pageInfo.subKey)}</div>
            </div>
          </div>

          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Language Switcher Pill */}
            <div className="lang-switcher-wrap" style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '3px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <button
                type="button"
                onClick={() => lang !== 'bn' && toggleLanguage()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: lang === 'bn' ? 700 : 500,
                  background: lang === 'bn' ? 'var(--primary)' : 'transparent',
                  color: lang === 'bn' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span>🇧🇩</span> বাংলা
              </button>
              <button
                type="button"
                onClick={() => lang !== 'en' && toggleLanguage()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: lang === 'en' ? 700 : 500,
                  background: lang === 'en' ? 'var(--primary)' : 'transparent',
                  color: lang === 'en' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span>🇬🇧</span> English
              </button>
            </div>

            {/* Date Badge */}
            <div className="header-badge" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
              fontWeight: 500,
            }}>
              <Calendar size={14} />
              <span>{todayStr}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
