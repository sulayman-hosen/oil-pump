import React from 'react';
import { Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard    from './pages/Dashboard';
import CheckPage    from './pages/CheckPage';
import SellPage     from './pages/SellPage';
import RegisterPage from './pages/RegisterPage';
import VehiclesPage from './pages/VehiclesPage';
import HistoryPage  from './pages/HistoryPage';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'inherit',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            padding: '12px 16px',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: '#1a7f3c',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#c0392b',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/check"     element={<CheckPage />} />
          <Route path="/sell"      element={<SellPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/vehicles"  element={<VehiclesPage />} />
          <Route path="/history"   element={<HistoryPage />} />
        </Routes>
      </Layout>
    </>
  );
}
