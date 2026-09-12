import React from 'react';
import { PortLocation, RegistrationType } from '../../types';
import { Building2, User, Container, Truck, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface TypeSelectionProps {
  location: PortLocation;
  selectedType: RegistrationType | null;
  onSelectType: (type: RegistrationType) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TypeSelection({
  location,
  selectedType,
  onSelectType,
  onBack,
  onNext,
}: TypeSelectionProps) {
  const isPortKlang = location === 'PORT_KLANG';

  const typesConfig: {
    type: RegistrationType;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    allowed: boolean;
  }[] = [
    {
      type: 'COMPANY',
      title: 'Company Registration',
      description: 'Register a new Forwarder, Haulier, or Transporter entity with port authorities.',
      icon: Building2,
      allowed: true,
    },
    {
      type: 'DRIVER',
      title: 'Driver Registration',
      description: 'Register commercial haulage drivers and operators for depot access gates.',
      icon: User,
      allowed: !isPortKlang,
    },
    {
      type: 'TRAILER',
      title: 'Trailer Registration',
      description: 'Register container chassis, flatbeds, skeletal frames, and gross BDM weights.',
      icon: Container,
      allowed: !isPortKlang,
    },
    {
      type: 'VEHICLE',
      title: 'Vehicle Registration',
      description: 'Register prime movers, lorries, unladen weights, and BGK capacity.',
      icon: Truck,
      allowed: !isPortKlang,
    },
  ];

  const availableTypes = isPortKlang ? typesConfig.filter((t) => t.type === 'COMPANY') : typesConfig;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="text-center mb-4">
        <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 mb-2">
          Port: <span className="ml-1 font-bold text-indigo-700">{location === 'PORT_KLANG' ? 'Port Klang' : 'Johor (Pasir Gudang)'}</span>
        </div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Select Registration Category</h2>
        <p className="text-slate-500 text-xs mt-0.5">
          {isPortKlang
            ? 'For Port Klang, company registration is required to establish EDI gate credentials.'
            : 'Select the operational asset or company entity you need to register for Johor port clearance.'}
        </p>
      </div>

      {isPortKlang && (
        <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#0090e7] mt-0.5 shrink-0" />
          <div className="text-xs text-sky-900">
            <strong className="font-semibold">Port Klang Protocol:</strong> Under Port Klang terminal gate rules, Driver, Trailer, and Vehicle credentials are managed via direct port haulier passes. Only <strong>Company Registration</strong> is required through this portal.
          </div>
        </div>
      )}

      <div className={`grid gap-3 ${isPortKlang ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {availableTypes.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.type;

          return (
            <div
              key={item.type}
              onClick={() => onSelectType(item.type)}
              className={`relative rounded-lg p-3.5 border transition-all cursor-pointer bg-white ${
                isSelected
                  ? 'border-[#0090e7] shadow-xs ring-2 ring-sky-100'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-[#0090e7]">
                  <CheckCircle2 className="w-4 h-4 fill-[#0090e7] text-white" />
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-sky-50 text-[#0090e7] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-0.5">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="mr-1.5 w-3.5 h-3.5" />
          Back to Port
        </button>

        <button
          type="button"
          disabled={!selectedType}
          onClick={onNext}
          className="inline-flex items-center px-4 py-2 rounded text-xs font-bold text-white bg-[#ea7a24] hover:bg-[#d96c1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          Continue to Form
          <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
