import React, { useState } from 'react';
import {
  PortLocation,
  RegistrationType,
  Company,
  CompanyFormData,
  DriverData,
  TrailerData,
  VehicleData,
  PortConfig,
} from '../../types';
import { getPorts, getCompanyById, saveSubmission, saveCompany, getAutoAssignedPorts } from '../../services/storage';
import { PortSelection } from './PortSelection';
import { TypeSelection } from './TypeSelection';
import { CompanyLookup } from './CompanyLookup';
import { CompanyForm } from './forms/CompanyForm';
import { DriverForm } from './forms/DriverForm';
import { TrailerForm } from './forms/TrailerForm';
import { VehicleForm } from './forms/VehicleForm';
import { ReviewScreen, SuccessScreen } from './ConfirmationScreen';
import { StatusTrackerModal } from './StatusTrackerModal';
import { Logo } from '../common/Logo';
import { Anchor, Check, ArrowRight, Shield, Search } from 'lucide-react';

interface RegistrationWizardProps {
  onSwitchToAdmin: () => void;
}

export function RegistrationWizard({ onSwitchToAdmin }: RegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedLocation, setSelectedLocation] = useState<PortLocation | null>('JOHOR');
  const [selectedType, setSelectedType] = useState<RegistrationType | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Form State
  const [companyFormData, setCompanyFormData] = useState<CompanyFormData | undefined>();
  const [driverFormDataList, setDriverFormDataList] = useState<DriverData[]>([]);
  const [trailerFormDataList, setTrailerFormDataList] = useState<TrailerData[]>([]);
  const [vehicleFormDataList, setVehicleFormDataList] = useState<VehicleData[]>([]);

  const [submittedRefNo, setSubmittedRefNo] = useState<string>('');
  const [showTrackerModal, setShowTrackerModal] = useState<boolean>(false);

  const ports = getPorts();
  const currentPort = ports.find((p) => p.location === selectedLocation) || ports[0];

  // Steps definition
  // 1: Port
  // 2: Type
  // 3: Company Lookup (if not Company registration)
  // 4: Fill Details Form
  // 5: Review
  // 6: Success

  const handlePortSelect = (loc: PortLocation) => {
    setSelectedLocation(loc);
    // If switching to Port Klang, force type to COMPANY as other types are forbidden
    if (loc === 'PORT_KLANG') {
      setSelectedType('COMPANY');
    } else {
      setSelectedType(null);
    }
  };

  const handleAutoOpenPortKlang = () => {
    setSelectedLocation('PORT_KLANG');
    setSelectedType('COMPANY');
    setCurrentStep(4);
  };

  const handleTypeSelect = (type: RegistrationType) => {
    setSelectedType(type);
  };

  const handleCompanySubmit = (data: CompanyFormData) => {
    setCompanyFormData(data);
    setCurrentStep(5); // Review
  };

  const handleDriverSubmit = (data: DriverData[]) => {
    setDriverFormDataList(data);
    setCurrentStep(5); // Review
  };

  const handleTrailerSubmit = (data: TrailerData[]) => {
    setTrailerFormDataList(data);
    setCurrentStep(5); // Review
  };

  const handleVehicleSubmit = (data: VehicleData[]) => {
    setVehicleFormDataList(data);
    setCurrentStep(5); // Review
  };

  const handleFinalConfirm = (refNo: string) => {
    if (!selectedLocation || !selectedType) return;

    // Build submission record
    let compId = selectedCompany?.id || '';
    let compName = selectedCompany?.name || '';
    let compReg = selectedCompany?.registration_number || '';
    let compType = selectedCompany?.company_type || '';

    let subByName = '';
    let subByEmail = '';
    let subByMobile = '';

    if (selectedType === 'COMPANY' && companyFormData) {
      compName = companyFormData.name;
      compReg = companyFormData.registration_number_old || companyFormData.registration_number;
      compType = companyFormData.company_type;
      subByName = companyFormData.contact_name || '';
      subByEmail = companyFormData.contact_email || '';
      subByMobile = companyFormData.contact_mobile || '';

      // Also create a company record in Company Master so future asset registrations can immediately find it!
      const newComp = saveCompany({
        name: companyFormData.name,
        short_name: companyFormData.short_name,
        company_type: companyFormData.company_type,
        registration_number: compReg,
        registration_number_old: companyFormData.registration_number_old,
        registration_number_new: companyFormData.registration_number_new,
        port_id: companyFormData.port_id,
        depot_id: companyFormData.depot_id,
        block: companyFormData.block,
        address1: companyFormData.address1,
        address2: companyFormData.address2,
        city: companyFormData.city,
        state: companyFormData.state,
        postcode: companyFormData.postcode,
        country: companyFormData.country,
        contact_name: companyFormData.contact_name,
        contact_email: companyFormData.contact_email,
        contact_designation: companyFormData.contact_designation,
        contact_mobile: companyFormData.contact_mobile,
        office_phone: companyFormData.office_phone,
        fax: companyFormData.fax,
        status: 'ACTIVE',
      });
      compId = newComp.id;
    } else {
      subByName = selectedCompany?.contact_name || 'Fleet Operator';
      subByEmail = selectedCompany?.contact_email || '';
      subByMobile = selectedCompany?.contact_mobile || '';
    }

    // Auto-assigned ports resolution
    const autoPorts = getAutoAssignedPorts(selectedLocation);

    // Save into central database
    saveSubmission({
      registration_type: selectedType,
      company_id: compId,
      company_reg_no: compReg,
      company_name: compName,
      company_type: compType,
      port_location: selectedLocation,
      port_id: autoPorts.backendIdsString,
      depot_id: selectedCompany?.depot_id,
      status: 'PENDING',
      submitted_by_name: subByName,
      submitted_by_email: subByEmail,
      submitted_by_mobile: subByMobile,
      data: {
        company: companyFormData,
        driver: driverFormDataList[0],
        drivers: driverFormDataList,
        trailer: trailerFormDataList[0],
        trailers: trailerFormDataList,
        vehicle: vehicleFormDataList[0],
        vehicles: vehicleFormDataList,
      },
    });

    setSubmittedRefNo(refNo);
    setCurrentStep(6); // Success
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedLocation('JOHOR');
    setSelectedType(null);
    setSelectedCompany(null);
    setCompanyFormData(undefined);
    setDriverFormDataList([]);
    setTrailerFormDataList([]);
    setVehicleFormDataList([]);
    setSubmittedRefNo('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#0b1220] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-700/70">
              <span className="text-white text-xs font-semibold tracking-wide">CUSTOMER REGISTRATION PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTrackerModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Search className="w-3 h-3 text-slate-400" />
              Track Registration
            </button>

            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded bg-[#ea7a24] hover:bg-[#d96c1a] text-white transition-colors shadow-xs"
            >
              <Shield className="w-3 h-3" />
              Admin Portal
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar (visible during steps 1-5) */}
      {currentStep <= 5 && (
        <div className="bg-white border-b border-slate-200 py-2.5 px-4 shadow-2xs">
          <div className="max-w-2xl mx-auto flex items-center justify-between text-xs font-semibold">
            {(selectedLocation === 'PORT_KLANG'
              ? [
                  { num: 1, label: 'Port' },
                  { num: 4, label: 'Company Details' },
                  { num: 5, label: 'Review' },
                ]
              : [
                  { num: 1, label: 'Port' },
                  { num: 2, label: 'Category' },
                  { num: 3, label: selectedType === 'COMPANY' ? 'Skip' : 'Company' },
                  { num: 4, label: 'Details' },
                  { num: 5, label: 'Review' },
                ]
            ).map((s, idx) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              const displayNum = idx + 1;

              return (
                <div key={s.num} className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#0090e7] text-white ring-2 ring-sky-100'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : displayNum}
                  </div>
                  <span className={`text-[11px] hidden sm:inline ${isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Port Selection */}
        {currentStep === 1 && (
          <PortSelection
            selectedLocation={selectedLocation}
            onSelectLocation={handlePortSelect}
            ports={ports}
            onNext={() => setCurrentStep(2)}
            onSelectPortKlangDirect={handleAutoOpenPortKlang}
          />
        )}

        {/* Step 2: Registration Type Selection */}
        {currentStep === 2 && selectedLocation && (
          <TypeSelection
            location={selectedLocation}
            selectedType={selectedType}
            onSelectType={handleTypeSelect}
            onBack={() => setCurrentStep(1)}
            onNext={() => {
              if (selectedType === 'COMPANY') {
                setCurrentStep(4); // Skip company lookup
              } else {
                setCurrentStep(3); // Go to company lookup
              }
            }}
          />
        )}

        {/* Step 3: Company Lookup (for Driver / Trailer / Vehicle) */}
        {currentStep === 3 && selectedType && selectedType !== 'COMPANY' && (
          <CompanyLookup
            selectedCompany={selectedCompany}
            onSelectCompany={(comp) => setSelectedCompany(comp)}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
            onRegisterNewCompany={() => {
              setSelectedType('COMPANY');
              setCurrentStep(4);
            }}
          />
        )}

        {/* Step 4: Asset Forms */}
        {currentStep === 4 && selectedType === 'COMPANY' && selectedLocation && (
          <CompanyForm
            initialLocation={selectedLocation}
            initialPortId={currentPort?.id}
            onSubmit={handleCompanySubmit}
            onBack={() => {
              if (selectedLocation === 'PORT_KLANG') {
                setCurrentStep(1);
              } else {
                setCurrentStep(2);
              }
            }}
          />
        )}

        {currentStep === 4 && selectedType === 'DRIVER' && selectedCompany && currentPort && (
          <DriverForm
            company={selectedCompany}
            port={currentPort}
            onSubmit={handleDriverSubmit}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 4 && selectedType === 'TRAILER' && selectedCompany && currentPort && (
          <TrailerForm
            company={selectedCompany}
            port={currentPort}
            onSubmit={handleTrailerSubmit}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 4 && selectedType === 'VEHICLE' && selectedCompany && currentPort && (
          <VehicleForm
            company={selectedCompany}
            port={currentPort}
            onSubmit={handleVehicleSubmit}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && selectedLocation && selectedType && (
          <ReviewScreen
            location={selectedLocation}
            port={currentPort}
            type={selectedType}
            company={selectedCompany}
            formData={{
              company: companyFormData,
              driver: driverFormDataList[0],
              drivers: driverFormDataList,
              trailer: trailerFormDataList[0],
              trailers: trailerFormDataList,
              vehicle: vehicleFormDataList[0],
              vehicles: vehicleFormDataList,
            }}
            onBack={() => setCurrentStep(4)}
            onSubmitSuccess={handleFinalConfirm}
          />
        )}

        {/* Step 6: Confirmation Screen */}
        {currentStep === 6 && selectedType && (
          <SuccessScreen
            referenceNo={submittedRefNo}
            type={selectedType}
            onReset={handleReset}
            onViewTracker={() => setShowTrackerModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            &copy; 2026 Port Logistics Authority &bull; Pasir Gudang, Port Klang Maritime Corridors.
          </div>
          <div className="flex items-center gap-4">
            <span>Automated Excel EDI Engine</span>
            <span>&bull;</span>
            <span>Support: support@portgate.gov.my</span>
          </div>
        </div>
      </footer>

      {/* Tracker Modal */}
      <StatusTrackerModal
        isOpen={showTrackerModal}
        onClose={() => setShowTrackerModal(false)}
        initialRef={submittedRefNo}
      />
    </div>
  );
}
