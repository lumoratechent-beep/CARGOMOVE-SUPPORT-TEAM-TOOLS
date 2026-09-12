import React from 'react';
import { PortLocation, PortConfig } from '../../types';
import { getAutoAssignedPorts, getHaulierGuideline } from '../../services/storage';
import { Anchor, Ship, Truck, CheckCircle2, ArrowRight, BookOpen, AlertCircle, Info } from 'lucide-react';

interface PortSelectionProps {
  selectedLocation: PortLocation | null;
  onSelectLocation: (loc: PortLocation) => void;
  ports: PortConfig[];
  onNext: () => void;
  onSelectPortKlangDirect: () => void;
  onOpenGuideline?: () => void;
}

export function PortSelection({
  selectedLocation,
  onSelectLocation,
  onNext,
  onSelectPortKlangDirect,
  onOpenGuideline,
}: PortSelectionProps) {
  const pkInfo = getAutoAssignedPorts('PORT_KLANG');
  const jhInfo = getAutoAssignedPorts('JOHOR');
  const guideline = getHaulierGuideline();

  const handlePortKlangClick = () => {
    onSelectLocation('PORT_KLANG');
    onSelectPortKlangDirect();
  };

  const handleJohorClick = () => {
    onSelectLocation('JOHOR');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Customer-Oriented Guidance Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Select Port Location</h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Please select which port to register. For Northport and Westport, select{' '}
          <span className="font-bold text-[#0090e7]">PORT KLANG - CONVENTIONAL USER REGISTRATION</span> (Forwarder &amp; Transporter). For ICS and Infinity Pasir Gudang, select{' '}
          <span className="font-bold text-indigo-700">JOHOR DEPOT - CONTAINER AND CONVENTIONAL REGISTRATION</span>.
        </p>
      </div>

      {/* Mandatory Haulier Notice Banner with Guideline Navigation */}
      <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-950">
              For haulier (container) registration, please refer this guideline.
            </p>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              Container haulage gate passes and chassis permits follow specialized port authority security clearances.
            </p>
          </div>
        </div>

        {onOpenGuideline && (
          <button
            type="button"
            onClick={onOpenGuideline}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-200/90 hover:bg-amber-200 border border-amber-300 transition-all shrink-0 shadow-2xs cursor-pointer active:scale-98"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-900" />
            Refer This Guideline &rarr;
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Port Klang Card: PORT KLANG - CONVENTIONAL USER REGISTRATION */}
        <div
          onClick={handlePortKlangClick}
          className={`relative rounded-xl p-5 border transition-all cursor-pointer bg-white flex flex-col justify-between ${
            selectedLocation === 'PORT_KLANG'
              ? 'border-[#0090e7] shadow-md ring-2 ring-sky-100'
              : 'border-slate-200 hover:border-[#0090e7] hover:shadow-sm'
          }`}
        >
          {selectedLocation === 'PORT_KLANG' && (
            <div className="absolute top-4 right-4 text-[#0090e7]">
              <CheckCircle2 className="w-5 h-5 fill-[#0090e7] text-white" />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#0090e7] flex items-center justify-center">
                <Anchor className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-[#0090e7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200 uppercase">
                Forwarder / Transporter
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug tracking-tight">
              PORT KLANG - CONVENTIONAL USER REGISTRATION
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Westport and Northport conventional terminal operations in Selangor. Strictly for Forwarder and Transporter entities.
            </p>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Assigned Terminals
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pkInfo.portNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-800 border border-sky-100"
                  >
                    <Ship className="w-3.5 h-3.5 mr-1.5 text-[#0090e7]" />
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Forwarder &amp; Transporter types only. For container haulier registration,{' '}
                {onOpenGuideline ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGuideline();
                    }}
                    className="text-[#0090e7] underline font-semibold hover:text-[#007cc7]"
                  >
                    refer to guideline
                  </button>
                ) : (
                  'refer to guideline'
                )}
                .
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePortKlangClick();
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0090e7] hover:bg-[#007cc7] transition-colors shadow-xs"
            >
              Open Company Form (Forwarder / Transporter)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Johor Card: JOHOR DEPOT - CONTAINER AND CONVENTIONAL REGISTRATION */}
        <div
          onClick={handleJohorClick}
          className={`relative rounded-xl p-5 border transition-all cursor-pointer bg-white flex flex-col justify-between ${
            selectedLocation === 'JOHOR'
              ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100'
              : 'border-slate-200 hover:border-indigo-500 hover:shadow-sm'
          }`}
        >
          {selectedLocation === 'JOHOR' && (
            <div className="absolute top-4 right-4 text-indigo-600">
              <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white" />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase">
                Container &amp; Conventional
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug tracking-tight">
              JOHOR DEPOT - CONTAINER AND CONVENTIONAL REGISTRATION
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Pasir Gudang facilities, ICS depot, and Infinity logistics hubs. Register company, drivers, trailers, and prime movers.
            </p>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Assigned Facilities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jhInfo.portNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                  >
                    <Ship className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/80 text-[11px] text-indigo-900 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Full registration suite: Company Master, Driver Smart ID, Trailer Chassis, and Prime Mover vehicles.</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleJohorClick();
                onNext();
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Choose Category (Company, Driver, Trailer, Vehicle)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

