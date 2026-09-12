import React, { useState } from 'react';
import { RegistrationType, RegistrationSubmission, Company } from '../../types';
import { getSubmissions, getCompanies, getCompanyById } from '../../services/storage';
import { getCompanyExternalId, generateExcelFilename } from '../../services/companyHelper';
import { exportSubmissionsToExcel, EXCEL_TEMPLATES } from '../../services/excelExport';
import { TypeBadge } from '../common/Badge';
import {
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function ExcelExportCenter() {
  const [selectedType, setSelectedType] = useState<RegistrationType>('COMPANY');
  const [filterCompanyId, setFilterCompanyId] = useState<string>('ALL');
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submissions = getSubmissions();
  const companies = getCompanies();

  // Filter submissions by chosen type and company
  const filteredSubmissions = submissions.filter((s) => {
    const matchesType = s.registration_type === selectedType;
    const matchesComp = filterCompanyId === 'ALL' || s.company_id === filterCompanyId;
    return matchesType && matchesComp;
  });

  // Calculate validation stats
  const itemsMissingId = filteredSubmissions.filter((s) => {
    const comp = s.company_id ? getCompanyById(s.company_id) : undefined;
    const idInfo = getCompanyExternalId(comp || { company_type: s.company_type });
    return !idInfo.has_required_id;
  });

  const canExport = filteredSubmissions.length > 0 && itemsMissingId.length === 0;

  const currentTemplate = EXCEL_TEMPLATES[selectedType];

  const handleExport = () => {
    setExportMessage(null);
    if (filteredSubmissions.length === 0) {
      setExportMessage({ type: 'error', text: 'No submissions available to export in this category.' });
      return;
    }

    const res = exportSubmissionsToExcel(filteredSubmissions);
    if (!res.success) {
      setExportMessage({ type: 'error', text: res.error || 'Export failed.' });
    } else {
      setExportMessage({
        type: 'success',
        text: `Export Complete! ${res.count} records generated into ${res.filename}`,
      });
    }
  };

  // Sample projected filename
  const sampleComp = filterCompanyId !== 'ALL' ? companies.find((c) => c.id === filterCompanyId) : undefined;
  const projectedFilename = generateExcelFilename(sampleComp?.short_name || sampleComp?.name, selectedType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Excel Export Center</h2>
        <p className="text-xs text-slate-500 mt-1">
          Generate strict backend-compliant Excel spreadsheets for Port Operating Systems (TOS).
        </p>
      </div>

      {exportMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            exportMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {exportMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{exportMessage.text}</span>
          </div>
          <button
            onClick={() => setExportMessage(null)}
            className="text-xs underline font-semibold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Select Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['COMPANY', 'DRIVER', 'TRAILER', 'VEHICLE'] as RegistrationType[]).map((type) => {
          const isSelected = selectedType === type;
          const count = submissions.filter((s) => s.registration_type === type).length;

          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSelectedType(type);
                setExportMessage(null);
              }}
              className={`p-4 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet
                  className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}
                />
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {count} records
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-2">
                {type}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {EXCEL_TEMPLATES[type].length} headers defined
              </div>
            </button>
          );
        })}
      </div>

      {/* Config & Validation Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Target Excel Template</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              Admin_{selectedType}_Template.xlsx
            </div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">
              Output Filename Pattern: <span className="text-blue-700 font-semibold">{projectedFilename}</span>
            </div>
          </div>

          {/* Filter by Specific Company */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Filter Company:</label>
            <select
              value={filterCompanyId}
              onChange={(e) => setFilterCompanyId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.short_name || c.name} ({c.registration_number})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Status */}
        {itemsMissingId.length > 0 ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold">
                Export Blocked: {itemsMissingId.length} record(s) belong to companies missing mandatory Backend IDs!
              </div>
              <p className="mt-0.5 text-amber-800">
                To prevent corrupted uploads into the Port Operating System, our validation engine prevents exporting records until their parent company has either a HAULIERID or FORWARDING_AGENT_ID assigned in the Company Master.
              </p>
            </div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
            No submissions recorded for this category yet. Submit records via the Customer Portal to populate.
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <strong>All Validation Passed!</strong> All {filteredSubmissions.length} record(s) have valid parent IDs resolved and are ready for official export.
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            Selected for Export: <strong className="text-slate-800 font-mono">{filteredSubmissions.length}</strong> row(s)
          </div>

          <button
            type="button"
            disabled={!canExport}
            onClick={handleExport}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate & Download {selectedType} Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Strict Header Structure Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Verified Excel Column Sequence ({currentTemplate.length} Columns)
          </div>
          <span className="text-[11px] text-slate-400">Strict Header Compliance Active</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {currentTemplate.map((h, idx) => (
            <div
              key={h}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px]"
            >
              <span className="text-slate-400 font-bold text-[10px]">{idx + 1}.</span>
              <span className="font-bold text-blue-900">{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
