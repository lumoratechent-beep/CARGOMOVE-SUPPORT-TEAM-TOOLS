import React, { useState, useEffect } from 'react';
import { RegistrationWizard } from './components/customer/RegistrationWizard';
import { AdminLayout } from './components/admin/AdminLayout';
import { initStorage } from './services/storage';

export default function App() {
  const [viewMode, setViewMode] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');

  useEffect(() => {
    // Ensure initial master records are primed
    initStorage();
  }, []);

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans">
      {viewMode === 'CUSTOMER' ? (
        <RegistrationWizard onSwitchToAdmin={() => setViewMode('ADMIN')} />
      ) : (
        <AdminLayout onSwitchToCustomer={() => setViewMode('CUSTOMER')} />
      )}
    </div>
  );
}
