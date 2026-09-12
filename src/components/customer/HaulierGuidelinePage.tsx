import React, { useState, useEffect } from 'react';
import { getHaulierGuideline } from '../../services/storage';
import { HaulierGuideline } from '../../types';
import { Logo } from '../common/Logo';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Download,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';

interface HaulierGuidelinePageProps {
  onBack: () => void;
  onSelectPortKlang?: () => void;
}

export function HaulierGuidelinePage({ onBack, onSelectPortKlang }: HaulierGuidelinePageProps) {
  const [guideline, setGuideline] = useState<HaulierGuideline>(getHaulierGuideline());
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Reload latest from storage
    setGuideline(getHaulierGuideline());
  }, []);

  const handleDownload = (filename: string) => {
    setDownloadSuccess(filename);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#0b1220] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-700/70">
              <span className="text-white text-xs font-semibold tracking-wide">
                CUSTOMER REGISTRATION PORTAL
              </span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-400/30">
                Official Guideline
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Registration
          </button>
        </div>
      </header>

      {/* Main Guideline Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center text-xs font-semibold text-[#0090e7] hover:text-[#007cc7] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Port Selection
          </button>

          <span className="text-[11px] text-slate-400">
            Last Updated: {new Date(guideline.last_updated).toLocaleDateString()}
          </span>
        </div>

        {/* Hero Title Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-100/50 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-[#0090e7]" />
              {guideline.badge || 'PORT TERMINAL DIRECTIVE'}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {guideline.title}
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
              {guideline.subtitle}
            </p>
          </div>
        </div>

        {/* Notice Banner */}
        {guideline.notice_banner && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
            <div className="p-1 rounded-md bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold block mb-0.5">Important Haulier Notice:</strong>
              {guideline.notice_banner}
            </div>
          </div>
        )}

        {/* Guideline Sections */}
        <div className="space-y-5">
          {guideline.sections.map((section, idx) => (
            <div
              key={section.id || idx}
              className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3"
            >
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-sky-50 text-[#0090e7] flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                {section.heading}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                {section.content}
              </p>

              {section.bullet_points && section.bullet_points.length > 0 && (
                <div className="pl-8 pt-1">
                  <ul className="space-y-2">
                    {section.bullet_points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Downloads / Forms Package */}
        {guideline.downloads && guideline.downloads.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-[#0090e7]" />
              <h3 className="text-sm font-bold text-slate-900">
                Official Forms & Application Downloads
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {guideline.downloads.map((dl) => (
                <div
                  key={dl.id}
                  className="rounded-lg border border-slate-200 p-3.5 hover:border-sky-300 hover:shadow-xs transition-all flex flex-col justify-between bg-slate-50/50"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                        {dl.file_type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{dl.file_size}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{dl.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">{dl.description}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => handleDownload(dl.title)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-white bg-[#0090e7] hover:bg-[#007cc7] transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Form
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Downloaded: <strong>{downloadSuccess}</strong> (Standard template ready for submission)</span>
              </div>
            )}
          </div>
        )}

        {/* Terminal Contacts Box */}
        {guideline.contact_info && (
          <div className="bg-slate-900 text-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#0090e7]" />
              <h3 className="text-sm font-bold text-white">
                Port Authority Security & Haulier Desk Contacts
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
                  <Info className="w-3 h-3" />
                  Department
                </div>
                <div className="font-semibold text-white">{guideline.contact_info.department}</div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
                  <Mail className="w-3 h-3" />
                  Email Enquiry
                </div>
                <div className="font-semibold text-sky-400">{guideline.contact_info.email}</div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
                  <Phone className="w-3 h-3" />
                  Phone Line
                </div>
                <div className="font-semibold text-white">{guideline.contact_info.phone}</div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
                  <Clock className="w-3 h-3" />
                  Operating Hours
                </div>
                <div className="font-semibold text-white">{guideline.contact_info.operating_hours}</div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800">
              <MapPin className="w-3 h-3 text-[#ea7a24] shrink-0" />
              <span>Location: {guideline.contact_info.office_location}</span>
            </div>
          </div>
        )}

        {/* Bottom CTA bar */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider">
              Registering Conventional Forwarder or Transporter?
            </h4>
            <p className="text-xs text-sky-800 mt-0.5">
              Proceed directly with online registration for Port Klang or Johor depots.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Back to Port Selection
            </button>
            {onSelectPortKlang && (
              <button
                type="button"
                onClick={onSelectPortKlang}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0090e7] hover:bg-[#007cc7] transition-colors shadow-xs"
              >
                Open Port Klang Form &rarr;
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
