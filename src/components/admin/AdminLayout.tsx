import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  FileSpreadsheet,
  Settings,
  TableProperties,
  ArrowLeft,
  RotateCcw,
  Shield,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { CompanyMaster } from './CompanyMaster';
import { SubmissionsList } from './SubmissionsList';
import { ExcelExportCenter } from './ExcelExportCenter';
import { PortDepotConfig } from './PortDepotConfig';
import { SchemaMappingInspector } from './SchemaMappingInspector';
import { GuidelineManager } from './GuidelineManager';
import { resetToDemoData } from '../../services/storage';
import { Logo } from '../common/Logo';

interface AdminLayoutProps {
  onSwitchToCustomer: () => void;
}

export function AdminLayout({ onSwitchToCustomer }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetToDemoData();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => {
      setResetDone(false);
      window.location.reload();
    }, 800);
  };

  const navItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'companies', label: 'Company Master', icon: Building2 },
    { id: 'submissions', label: 'Registrations Queue', icon: Inbox },
    { id: 'guidelines', label: 'Haulier Guidelines', icon: BookOpen },
    { id: 'export', label: 'Excel Export Center', icon: FileSpreadsheet },
    { id: 'ports', label: 'Port & Depot Config', icon: Settings },
    { id: 'schema', label: 'Excel Schema & Mapping', icon: TableProperties },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-[#0b1220] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 select-none">
              <Logo size="sm" />
              <span className="text-[9px] font-bold text-white uppercase px-1.5 py-0.2 bg-[#ea7a24] rounded">
                Admin
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              Port Clearance & EDI Engine
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={onSwitchToCustomer}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Customer Portal View
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800/40 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo Mock Data
          </button>
        </div>
      </aside>

      {/* Main Administrative Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Portal</span>
            <span className="text-slate-300">/</span>
            <h1 className="text-sm font-bold text-slate-900">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium hidden sm:inline">Backend EDI Sync: Ready</span>
            </div>

            <button
              type="button"
              onClick={onSwitchToCustomer}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              Go to Customer Form &rarr;
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'companies' && <CompanyMaster />}
          {activeTab === 'submissions' && <SubmissionsList />}
          {activeTab === 'guidelines' && (
            <GuidelineManager onPreviewCustomerView={onSwitchToCustomer} />
          )}
          {activeTab === 'export' && <ExcelExportCenter />}
          {activeTab === 'ports' && <PortDepotConfig />}
          {activeTab === 'schema' && <SchemaMappingInspector />}
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Reset Demo Data?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This will re-initialize the mock database with standard companies (including missing ID cases for testing) and sample registration submissions.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {resetDone && (
        <div className="fixed bottom-5 right-5 z-50 p-3 bg-emerald-600 text-white rounded-xl shadow-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Mock database reset successfully!
        </div>
      )}
    </div>
  );
}
