import React, { useState, useEffect } from 'react';
import { notifySuccess } from '../common/notifications';
import {
  getHaulierGuideline,
  saveHaulierGuideline,
  resetHaulierGuideline,
} from '../../services/storage';
import { HaulierGuideline, GuidelineSection, GuidelineDownload } from '../../types';
import {
  BookOpen,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  Eye,
  ExternalLink,
  Shield,
  FileText,
  Phone,
  Mail,
  Clock,
  MapPin,
} from 'lucide-react';

interface GuidelineManagerProps {
  onPreviewCustomerView?: () => void;
}

export function GuidelineManager({ onPreviewCustomerView }: GuidelineManagerProps) {
  const [guideline, setGuideline] = useState<HaulierGuideline>(getHaulierGuideline());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setGuideline(getHaulierGuideline());
  }, []);

  const handleFieldChange = (field: keyof HaulierGuideline, value: string) => {
    setGuideline((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field: keyof HaulierGuideline['contact_info'], value: string) => {
    setGuideline((prev) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value,
      },
    }));
  };

  const handleSectionChange = (
    index: number,
    field: keyof GuidelineSection,
    value: any
  ) => {
    setGuideline((prev) => {
      const nextSections = [...prev.sections];
      nextSections[index] = {
        ...nextSections[index],
        [field]: value,
      };
      return { ...prev, sections: nextSections };
    });
  };

  const handleBulletPointsChange = (secIdx: number, rawText: string) => {
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    handleSectionChange(secIdx, 'bullet_points', lines);
  };

  const handleAddSection = () => {
    const newSec: GuidelineSection = {
      id: `sec-${Date.now()}`,
      heading: `${guideline.sections.length + 1}. New Policy Section`,
      content: 'Describe the requirements or rules for this section here.',
      bullet_points: ['Key requirement or step 1', 'Key requirement or step 2'],
    };
    setGuideline((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));
  };

  const handleDeleteSection = (index: number) => {
    if (guideline.sections.length <= 1) {
      alert('At least one policy section is required.');
      return;
    }
    setGuideline((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleDownloadChange = (
    index: number,
    field: keyof GuidelineDownload,
    value: string
  ) => {
    setGuideline((prev) => {
      const nextDl = [...prev.downloads];
      nextDl[index] = {
        ...nextDl[index],
        [field]: value,
      };
      return { ...prev, downloads: nextDl };
    });
  };

  const handleAddDownload = () => {
    const newDl: GuidelineDownload = {
      id: `dl-${Date.now()}`,
      title: 'New Application Document / Template (PDF)',
      description: 'Document details and purpose.',
      file_type: 'PDF Document',
      file_size: '1.5 MB',
    };
    setGuideline((prev) => ({
      ...prev,
      downloads: [...prev.downloads, newDl],
    }));
  };

  const handleDeleteDownload = (index: number) => {
    setGuideline((prev) => ({
      ...prev,
      downloads: prev.downloads.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const updated = saveHaulierGuideline(guideline);
    setGuideline(updated);
    notifySuccess('Haulier guidelines published successfully.');
  };

  const handleResetToDefault = () => {
    const def = resetHaulierGuideline();
    setGuideline(def);
    setShowResetConfirm(false);
    notifySuccess('Haulier guidelines reset successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Haulier Guidelines Content Editor</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit and publish customer-facing rules for container haulier registrations. Updates reflect immediately on the portal.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          {onPreviewCustomerView && (
            <button
              type="button"
              onClick={onPreviewCustomerView}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Customer View
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save & Publish Changes
          </button>
        </div>
      </div>

      {/* 1. Main Titles & Notice */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          Page Titles & Directive Notice
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2 space-y-1">
            <label className="block font-semibold text-slate-700">Guideline Page Title</label>
            <input
              type="text"
              value={guideline.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">Directive Badge Label</label>
            <input
              type="text"
              value={guideline.badge}
              onChange={(e) => handleFieldChange('badge', e.target.value)}
              placeholder="e.g. PORT TERMINAL DIRECTIVE"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold uppercase text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="block font-semibold text-slate-700">Subtitle / Overview Description</label>
            <textarea
              rows={2}
              value={guideline.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="block font-semibold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Prominent Notice Banner (Alert Box on Portal & Guideline Page)
            </label>
            <textarea
              rows={2}
              value={guideline.notice_banner}
              onChange={(e) => handleFieldChange('notice_banner', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/50 text-amber-950 focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
            />
            <p className="text-[11px] text-slate-500">
              This notice is also referenced on the customer Port Selection screen to guide container haulier applicants.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Policy Sections Editor */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Guideline Policy Sections ({guideline.sections.length})
          </h3>
          <button
            type="button"
            onClick={handleAddSection}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Section
          </button>
        </div>

        <div className="space-y-4">
          {guideline.sections.map((sec, idx) => (
            <div
              key={sec.id || idx}
              className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={sec.heading}
                    onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                    placeholder="Section Heading"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSection(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">Section Content Text</label>
                <textarea
                  rows={2}
                  value={sec.content}
                  onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Key Requirements / Checklist Bullet Points (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={(sec.bullet_points || []).join('\n')}
                  onChange={(e) => handleBulletPointsChange(idx, e.target.value)}
                  placeholder="Enter each checklist item on a new line..."
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono text-[11px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Official Downloads & Packages */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Downloadable Forms & Packages ({guideline.downloads.length})
          </h3>
          <button
            type="button"
            onClick={handleAddDownload}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Download Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guideline.downloads.map((dl, idx) => (
            <div
              key={dl.id || idx}
              className="rounded-lg border border-slate-200 p-3 bg-slate-50/60 space-y-2 text-xs relative"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={dl.file_type}
                  onChange={(e) => handleDownloadChange(idx, 'file_type', e.target.value)}
                  className="px-1.5 py-0.5 rounded border border-slate-300 bg-white text-[10px] font-bold text-blue-700 uppercase"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteDownload(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={dl.title}
                onChange={(e) => handleDownloadChange(idx, 'title', e.target.value)}
                placeholder="Document Title"
                className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs font-bold text-slate-900"
              />

              <textarea
                rows={2}
                value={dl.description}
                onChange={(e) => handleDownloadChange(idx, 'description', e.target.value)}
                placeholder="Description"
                className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-[11px] text-slate-700"
              />

              <input
                type="text"
                value={dl.file_size}
                onChange={(e) => handleDownloadChange(idx, 'file_size', e.target.value)}
                placeholder="File Size (e.g. 2.4 MB)"
                className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-[10px] font-mono text-slate-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Port Authority Contact Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-700" />
          Port Authority Contact & Pass Desk Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">Department Name</label>
            <input
              type="text"
              value={guideline.contact_info.department}
              onChange={(e) => handleContactChange('department', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">Enquiry Email</label>
            <input
              type="text"
              value={guideline.contact_info.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">Phone Number / Hotline</label>
            <input
              type="text"
              value={guideline.contact_info.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">Operating Hours</label>
            <input
              type="text"
              value={guideline.contact_info.operating_hours}
              onChange={(e) => handleContactChange('operating_hours', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="block font-semibold text-slate-700">Pass Desk Physical Location</label>
            <input
              type="text"
              value={guideline.contact_info.office_location}
              onChange={(e) => handleContactChange('office_location', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save & Publish Changes
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Reset Guidelines to Standard?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This will overwrite customized content with the standard Port Klang and Johor container haulier operating protocols.
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
                onClick={handleResetToDefault}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
