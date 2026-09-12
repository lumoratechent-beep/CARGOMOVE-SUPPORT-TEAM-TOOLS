import React, { useState } from 'react';
import { Company, PortConfig } from '../../types';
import {
  getCompanies,
  saveCompany,
  toggleCompanyStatus,
  checkDuplicateRegNo,
  getPorts,
} from '../../services/storage';
import { getCompanyExternalId, normalizeRegNo } from '../../services/companyHelper';
import { StatusBadge } from '../common/Badge';
import { AssignIdModal } from './AssignIdModal';
import {
  Search,
  Plus,
  Key,
  Filter,
  CheckCircle,
  AlertTriangle,
  Building2,
  Edit2,
  Power,
  X,
  Sparkles,
  MoreVertical,
} from 'lucide-react';

export function CompanyMaster() {
  const [companies, setCompanies] = useState<Company[]>(getCompanies());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [portFilter, setPortFilter] = useState('ALL');
  const [missingIdOnly, setMissingIdOnly] = useState(false);

  // Modals
  const [selectedCompanyForId, setSelectedCompanyForId] = useState<Company | null>(null);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  const ports = getPorts();

  const refreshList = () => {
    setCompanies(getCompanies());
  };

  const handleToggleStatus = (id: string) => {
    toggleCompanyStatus(id);
    refreshList();
  };

  const filteredCompanies = companies.filter((comp) => {
    // Search query
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      comp.name.toLowerCase().includes(term) ||
      comp.short_name?.toLowerCase().includes(term) ||
      comp.registration_number.toLowerCase().includes(term) ||
      comp.registration_number_old?.toLowerCase().includes(term) ||
      comp.registration_number_new?.toLowerCase().includes(term);

    // Type filter
    const matchesType = typeFilter === 'ALL' || comp.company_type.toLowerCase() === typeFilter.toLowerCase();

    // Port filter
    const matchesPort = portFilter === 'ALL' || comp.port_id === portFilter;

    // Missing ID filter
    const idInfo = getCompanyExternalId(comp);
    const matchesMissingId = !missingIdOnly || !idInfo.has_required_id;

    return matchesSearch && matchesType && matchesPort && matchesMissingId;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Company Master Database</h2>
          <p className="text-xs text-slate-500 mt-1">
            Permanent mapping registry for automated HAULIERID and FORWARDING_AGENT_ID resolution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCompany(null);
            setIsNewCompanyModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Master Company
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Registration No (AAAAAA-2) or Company Name..."
            className="w-full px-3.5 py-2 pl-9 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Company Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="Forwarder">Forwarder</option>
            <option value="Haulage">Haulage</option>
            <option value="Transporter">Transporter</option>
            <option value="Forwarding Agent">Forwarding Agent</option>
          </select>

          {/* Port Filter */}
          <select
            value={portFilter}
            onChange={(e) => setPortFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Ports</option>
            {ports.map((p) => (
              <option key={p.id} value={p.id}>
                {p.display_name}
              </option>
            ))}
          </select>

          {/* Missing ID Toggle */}
          <button
            type="button"
            onClick={() => setMissingIdOnly(!missingIdOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
              missingIdOnly
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            ⚠ Missing IDs Only
          </button>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Registration No</th>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-4">Assigned ID</th>
                <th className="py-3 px-3">Facility</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No company master records matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((comp) => {
                  const idInfo = getCompanyExternalId(comp);
                  const isMissing = !idInfo.has_required_id;
                  const isHaulier = comp.company_type.toLowerCase() === 'haulage' || comp.company_type.toLowerCase() === 'transporter' || idInfo.category === 'HAULIER';
                  const isForwarder = comp.company_type.toLowerCase() === 'forwarder' || idInfo.category === 'FORWARDING';

                  return (
                    <tr
                      key={comp.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isMissing ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {comp.registration_number}
                        {comp.registration_number_new && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            SSM: {comp.registration_number_new}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{comp.name}</div>
                        <div className="text-[11px] text-slate-500">{comp.short_name}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {comp.company_type}
                        </span>
                      </td>

                      {/* Merged Assigned ID Column: IF HAULIER GREEN, IF FORWARDER = BLUE */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Haulier ID (GREEN) */}
                          {(isHaulier || comp.haulier_id) && (
                            comp.haulier_id ? (
                              <span
                                className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300"
                                title="Haulier ID"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>{comp.haulier_id}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedCompanyForId(comp)}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                                title="Assign Haulier ID"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1 text-amber-700" />
                                Haulier ID Required
                              </button>
                            )
                          )}

                          {/* Forwarder ID (BLUE) */}
                          {(isForwarder || comp.forwarding_agent_id) && (
                            comp.forwarding_agent_id ? (
                              <span
                                className="inline-flex items-center gap-1 font-bold text-[11px] text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-300"
                                title="Forwarding Agent ID"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span>{comp.forwarding_agent_id}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedCompanyForId(comp)}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                                title="Assign Forwarder ID"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1 text-amber-700" />
                                Forwarder ID Required
                              </button>
                            )
                          )}

                          {/* Fallback if neither */}
                          {!comp.haulier_id && !comp.forwarding_agent_id && !isHaulier && !isForwarder && (
                            <button
                              type="button"
                              onClick={() => setSelectedCompanyForId(comp)}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                            >
                              <AlertTriangle className="w-3 h-3 mr-1 text-amber-700" />
                              ID Required
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        {ports.find((p) => p.id === comp.port_id)?.display_name || 'General'}
                      </td>

                      <td className="py-3 px-3">
                        <StatusBadge status={comp.status} />
                      </td>

                      <td className="py-3 px-3 text-[11px] text-slate-400">
                        {new Date(comp.updated_at).toLocaleDateString()}
                      </td>

                      {/* 3-Dot Action Button & Dropdown Menu */}
                      <td className="py-3 px-4 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenuId(activeActionMenuId === comp.id ? null : comp.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                              activeActionMenuId === comp.id
                                ? 'bg-slate-200 text-slate-900'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                            title="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeActionMenuId === comp.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveActionMenuId(null)}
                              />

                              <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white border border-slate-200 shadow-xl py-1 z-50 text-left">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    setSelectedCompanyForId(comp);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                >
                                  <Key className="w-3.5 h-3.5 text-blue-600" />
                                  Assign / Edit ID
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    setEditingCompany(comp);
                                    setIsNewCompanyModalOpen(true);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                  Edit Company Details
                                </button>

                                <div className="border-t border-slate-100 my-1"></div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    handleToggleStatus(comp.id);
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors ${
                                    comp.status === 'ACTIVE'
                                      ? 'text-rose-600 hover:bg-rose-50'
                                      : 'text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                  {comp.status === 'ACTIVE' ? 'Deactivate Company' : 'Activate Company'}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign ID Modal */}
      <AssignIdModal
        company={selectedCompanyForId}
        isOpen={!!selectedCompanyForId}
        onClose={() => setSelectedCompanyForId(null)}
        onSuccess={refreshList}
      />

      {/* Add / Edit Company Modal */}
      {isNewCompanyModalOpen && (
        <CompanyEditModal
          company={editingCompany}
          onClose={() => setIsNewCompanyModalOpen(false)}
          onSuccess={() => {
            setIsNewCompanyModalOpen(false);
            refreshList();
          }}
        />
      )}
    </div>
  );
}

function CompanyEditModal({
  company,
  onClose,
  onSuccess,
}: {
  company: Company | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const ports = getPorts();

  const [form, setForm] = useState({
    name: company?.name || '',
    short_name: company?.short_name || '',
    company_type: company?.company_type || 'Forwarder',
    registration_number: company?.registration_number || '',
    registration_number_new: company?.registration_number_new || '',
    haulier_id: company?.haulier_id || '',
    forwarding_agent_id: company?.forwarding_agent_id || '',
    port_id: company?.port_id || ports[0]?.id || '',
    city: company?.city || 'Pasir Gudang',
    state: company?.state || 'Johor',
    contact_name: company?.contact_name || '',
    contact_email: company?.contact_email || '',
    contact_mobile: company?.contact_mobile || '',
  });

  const [error, setError] = useState('');

  const isEditing = !!company;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.registration_number.trim()) {
      setError('Company Name and Registration Number are required.');
      return;
    }

    // Duplicate check if new or changed
    if (checkDuplicateRegNo(form.registration_number, company?.id)) {
      setError(`A company with registration number "${form.registration_number}" already exists in Master!`);
      return;
    }

    saveCompany({
      id: company?.id,
      name: form.name.trim().toUpperCase(),
      short_name: form.short_name.trim().toUpperCase(),
      company_type: form.company_type,
      registration_number: form.registration_number.trim().toUpperCase(),
      registration_number_old: form.registration_number.trim().toUpperCase(),
      registration_number_new: form.registration_number_new.trim(),
      haulier_id: form.haulier_id.trim(),
      forwarding_agent_id: form.forwarding_agent_id.trim(),
      port_id: form.port_id,
      city: form.city,
      state: form.state,
      contact_name: form.contact_name,
      contact_email: form.contact_email,
      contact_mobile: form.contact_mobile,
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {isEditing ? 'Edit Master Company' : 'Add New Master Company'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Company Legal Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="LUMORA TECH SDN BHD"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Short Name *</label>
              <input
                type="text"
                value={form.short_name}
                onChange={(e) => setForm({ ...form, short_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="LUMORA"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Category *</label>
              <select
                value={form.company_type}
                onChange={(e) => setForm({ ...form, company_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Forwarder">Forwarder (Uses Forwarding Agent ID)</option>
                <option value="Haulage">Haulage (Uses HAULIERID)</option>
                <option value="Transporter">Transporter (Uses Forwarding Agent ID)</option>
                <option value="Forwarding Agent">Forwarding Agent</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Old Registration No (Unique Primary Key) *
              </label>
              <input
                type="text"
                value={form.registration_number}
                onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                placeholder="AAAAAA-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">SSM New 12-Digit Reg No</label>
              <input
                type="text"
                value={form.registration_number_new}
                onChange={(e) => setForm({ ...form, registration_number_new: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="201901004521"
              />
            </div>

            <div>
              <label className="block font-semibold text-emerald-800 mb-1">
                HAULIERID (for Haulage entities)
              </label>
              <input
                type="text"
                value={form.haulier_id}
                onChange={(e) => setForm({ ...form, haulier_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono"
                placeholder="xyz456"
              />
            </div>

            <div>
              <label className="block font-semibold text-blue-800 mb-1">
                FORWARDING_AGENT_ID (for Forwarders)
              </label>
              <input
                type="text"
                value={form.forwarding_agent_id}
                onChange={(e) => setForm({ ...form, forwarding_agent_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="64abc123xyz"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Port</label>
              <select
                value={form.port_id}
                onChange={(e) => setForm({ ...form, port_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                {ports.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.display_name} ({p.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Mobile</label>
              <input
                type="text"
                value={form.contact_mobile}
                onChange={(e) => setForm({ ...form, contact_mobile: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
            >
              {isEditing ? 'Save Changes' : 'Create Master Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
