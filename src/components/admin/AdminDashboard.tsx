import React, { useState } from 'react';
import {
  getCompanies,
  getSubmissions,
  getCompanyById,
} from '../../services/storage';
import { getCompanyExternalId } from '../../services/companyHelper';
import { Company, RegistrationSubmission, RegistrationType } from '../../types';
import { StatusBadge, TypeBadge, PortBadge } from '../common/Badge';
import { AssignIdModal } from './AssignIdModal';
import { SubmissionDetailModal } from './SubmissionDetailModal';
import {
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Container,
  Truck,
  ArrowUpRight,
  Key,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [companies, setCompanies] = useState(getCompanies());
  const [submissions, setSubmissions] = useState(getSubmissions());

  // Modals
  const [selectedCompanyForId, setSelectedCompanyForId] = useState<Company | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<RegistrationSubmission | null>(null);

  const refresh = () => {
    setCompanies(getCompanies());
    setSubmissions(getSubmissions());
  };

  // Metrics
  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'PENDING').length;
  const reviewedCount = submissions.filter((s) => s.status === 'REVIEWED' || s.status === 'READY_TO_EXPORT').length;
  const exportedCount = submissions.filter((s) => s.status === 'EXPORTED').length;

  // Companies missing ID
  const companiesMissingId = companies.filter((c) => {
    const idInfo = getCompanyExternalId(c);
    return !idInfo.has_required_id;
  });

  // Type counts
  const companySubs = submissions.filter((s) => s.registration_type === 'COMPANY').length;
  const driverSubs = submissions.filter((s) => s.registration_type === 'DRIVER').length;
  const trailerSubs = submissions.filter((s) => s.registration_type === 'TRAILER').length;
  const vehicleSubs = submissions.filter((s) => s.registration_type === 'VEHICLE').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Operations Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring of port registrations, master ID resolution, and EDI exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('export')}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5" />
            Go to Excel Export
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Submissions</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalSubmissions}</div>
            <span className="text-[11px] text-slate-400">All categories</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Review</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
            <span className="text-[11px] text-slate-400">Awaiting support action</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Exported into TOS</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{exportedCount}</div>
            <span className="text-[11px] text-slate-400">Backend files delivered</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Missing ID Alert Card */}
        <div
          onClick={() => onNavigate('companies')}
          className={`p-4 rounded-xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
            companiesMissingId.length > 0
              ? 'bg-rose-50 border-rose-200 hover:bg-rose-100/70'
              : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <span
              className={`text-xs font-semibold uppercase ${
                companiesMissingId.length > 0 ? 'text-rose-700 font-bold' : 'text-slate-500'
              }`}
            >
              Missing Backend IDs
            </span>
            <div
              className={`text-2xl font-black mt-1 ${
                companiesMissingId.length > 0 ? 'text-rose-700' : 'text-slate-900'
              }`}
            >
              {companiesMissingId.length}
            </div>
            <span className="text-[11px] text-rose-600 font-medium">
              {companiesMissingId.length > 0 ? 'Requires HAULIER/AGENT ID' : 'All companies mapped'}
            </span>
          </div>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
              companiesMissingId.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Asset Type Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigate('submissions')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">{companySubs}</div>
            <div className="text-[11px] text-slate-500 font-medium">Companies</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('submissions')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">{driverSubs}</div>
            <div className="text-[11px] text-slate-500 font-medium">Drivers</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('submissions')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Container className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">{trailerSubs}</div>
            <div className="text-[11px] text-slate-500 font-medium">Trailers</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('submissions')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 cursor-pointer transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">{vehicleSubs}</div>
            <div className="text-[11px] text-slate-500 font-medium">Vehicles</div>
          </div>
        </div>
      </div>

      {/* Actionable Missing ID Resolution Queue */}
      {companiesMissingId.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Action Required: Companies Missing Backend ID ({companiesMissingId.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-800">
              Assign once &bull; Automatically resolves all linked Driver, Trailer & Vehicle exports
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {companiesMissingId.map((comp) => {
              const idInfo = getCompanyExternalId(comp);
              const targetId = idInfo.required_id_type;

              return (
                <div
                  key={comp.id}
                  className="bg-white border border-amber-200 rounded-lg p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{comp.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Reg: <span className="font-mono">{comp.registration_number}</span> &bull; Type: {comp.company_type}
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                      Needs: {targetId} ({idInfo.category})
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCompanyForId(comp)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Key className="w-3.5 h-3.5 mr-1" />
                    Assign ID
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Submissions Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Recent Registrations Queue</h3>
          <button
            onClick={() => onNavigate('submissions')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All Submissions <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-3">Facility</th>
                <th className="py-3 px-3">ID Linkage</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.slice(0, 6).map((sub) => {
                const comp = sub.company_id ? getCompanyById(sub.company_id) : undefined;
                const idInfo = getCompanyExternalId(comp || { company_type: sub.company_type });

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {sub.reference_no}
                    </td>
                    <td className="py-3 px-3">
                      <TypeBadge type={sub.registration_type} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sub.company_name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{sub.company_reg_no}</div>
                    </td>
                    <td className="py-3 px-3">
                      <PortBadge location={sub.port_location} />
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {idInfo.has_required_id ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-bold">
                          {idInfo.active_id_value}
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 text-[10px] font-bold">
                          ID Required
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveSubmission(sub)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign ID Modal */}
      <AssignIdModal
        company={selectedCompanyForId}
        isOpen={!!selectedCompanyForId}
        onClose={() => setSelectedCompanyForId(null)}
        onSuccess={refresh}
      />

      {/* Submission Detail Modal */}
      <SubmissionDetailModal
        submission={activeSubmission}
        isOpen={!!activeSubmission}
        onClose={() => setActiveSubmission(null)}
        onOpenAssignId={(compId) => {
          const c = getCompanyById(compId);
          if (c) setSelectedCompanyForId(c);
        }}
        onStatusChange={() => {
          refresh();
          if (activeSubmission) {
            const updated = getSubmissions().find((s) => s.id === activeSubmission.id);
            setActiveSubmission(updated || null);
          }
        }}
      />
    </div>
  );
}
