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
import { getAutoAssignedPorts } from '../../services/storage';
import {
  CheckCircle2,
  Building2,
  User,
  Container,
  Truck,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
  Anchor,
} from 'lucide-react';

interface ReviewAndSubmitProps {
  location: PortLocation;
  port: PortConfig;
  type: RegistrationType;
  company: Company | null;
  formData: {
    company?: CompanyFormData;
    driver?: DriverData;
    drivers?: DriverData[];
    trailer?: TrailerData;
    trailers?: TrailerData[];
    vehicle?: VehicleData;
    vehicles?: VehicleData[];
  };
  onBack: () => void;
  onSubmitSuccess: (referenceNo: string) => void;
}

export function ReviewScreen({
  location,
  type,
  company,
  formData,
  onBack,
  onSubmitSuccess,
}: ReviewAndSubmitProps) {
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const autoPorts = getAutoAssignedPorts(location);

  const handleSubmit = async () => {
    if (!agreed) return;
    setSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const rand = Math.floor(1000 + Math.random() * 9000);
      const refNo = `REG-${yyyy}${mm}${dd}-${rand}`;

      onSubmitSuccess(refNo);
      setSubmitting(false);
    }, 350);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-center">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Review & Confirm Submission</h2>
        <p className="text-slate-500 text-xs mt-0.5">
          Please verify all entered details before queueing into the Port Master database.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Header Summary */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {type === 'COMPANY' && 'Company Master Onboarding'}
              {type === 'DRIVER' && 'Driver Gate Access'}
              {type === 'TRAILER' && 'Trailer / Chassis Registration'}
              {type === 'VEHICLE' && 'Prime Mover / Vehicle Registration'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Port Location</div>
            <div className="text-xs font-bold text-[#0090e7] mt-0.5">
              {location === 'PORT_KLANG' ? 'Port Klang' : 'Johor'}
            </div>
          </div>
        </div>

        {/* Auto Assigned Ports Banner */}
        <div className="p-2.5 bg-sky-50 border border-sky-100 rounded text-xs text-sky-900 flex items-center gap-1.5">
          <Anchor className="w-3.5 h-3.5 text-[#0090e7]" />
          <span>
            Port Assignment: <strong>{autoPorts.portNames.join(', ')}</strong>
          </span>
        </div>

        {/* Company context if driver/trailer/vehicle */}
        {company && type !== 'COMPANY' && (
          <div className="bg-slate-50 rounded p-2.5 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Registered Parent Haulier / Forwarder</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">{company.name}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Reg No: <span className="font-mono font-semibold">{company.registration_number}</span> &bull; Type: {company.company_type}
            </div>
          </div>
        )}

        {/* Company Registration Summary */}
        {type === 'COMPANY' && formData.company && (
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Legal Name</span>
              <span className="font-bold text-slate-900">{formData.company.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Short Name</span>
              <span className="font-bold text-slate-900">{formData.company.short_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Company Type</span>
              <span className="font-semibold text-slate-900">{formData.company.company_type}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Registration (Old / SSM)</span>
              <span className="font-semibold font-mono text-slate-900">
                {formData.company.registration_number_old} {formData.company.registration_number_new ? `/ ${formData.company.registration_number_new}` : ''}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-400 block font-semibold">Registered Address</span>
              <span className="text-slate-800 text-[11px]">
                {formData.company.block ? `${formData.company.block}, ` : ''}
                {formData.company.address1}, {formData.company.address2 ? `${formData.company.address2}, ` : ''}
                {formData.company.city}, {formData.company.state} {formData.company.postcode}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Contact Person</span>
              <span className="font-semibold text-slate-900">{formData.company.contact_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Contact Email & Mobile</span>
              <span className="text-slate-900">{formData.company.contact_email} &bull; {formData.company.contact_mobile}</span>
            </div>
          </div>
        )}

        {/* Driver Summary */}
        {type === 'DRIVER' && (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Registered Driver Assets ({formData.drivers?.length || (formData.driver ? 1 : 0)})
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                    <th className="py-2 px-2.5 w-8 text-center">#</th>
                    <th className="py-2 px-2.5">Driver Full Name</th>
                    <th className="py-2 px-2.5">Licence / NRIC</th>
                    <th className="py-2 px-2.5">Mobile Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(formData.drivers && formData.drivers.length > 0
                    ? formData.drivers
                    : formData.driver
                    ? [formData.driver]
                    : []
                  ).map((drv, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-2.5 text-center text-[10px] text-slate-400 font-bold font-mono">
                        {i + 1}
                      </td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900">{drv.name}</td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-700">{drv.driving_license}</td>
                      <td className="py-1.5 px-2.5 text-slate-700">{drv.mobile_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trailer Summary */}
        {type === 'TRAILER' && (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Registered Trailer Assets ({formData.trailers?.length || (formData.trailer ? 1 : 0)})
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                    <th className="py-2 px-2.5 w-8 text-center">#</th>
                    <th className="py-2 px-2.5">Plate Number</th>
                    <th className="py-2 px-2.5">Chassis Type</th>
                    <th className="py-2 px-2.5">Unladen Wt</th>
                    <th className="py-2 px-2.5">BDM Wt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(formData.trailers && formData.trailers.length > 0
                    ? formData.trailers
                    : formData.trailer
                    ? [formData.trailer]
                    : []
                  ).map((trl, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-2.5 text-center text-[10px] text-slate-400 font-bold font-mono">
                        {i + 1}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">
                        {trl.registration_number}
                      </td>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-800">
                        <span className="px-1.5 py-0.5 rounded bg-sky-50 text-[#0090e7] font-bold text-[10px] border border-sky-100">
                          {trl.trailer_type}
                        </span>
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-700">{trl.weight} KG</td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-700">{trl.bdm_weight} KG</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vehicle Summary */}
        {type === 'VEHICLE' && (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Registered Prime Mover Vehicles ({formData.vehicles?.length || (formData.vehicle ? 1 : 0)})
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                    <th className="py-2 px-2.5 w-8 text-center">#</th>
                    <th className="py-2 px-2.5">Plate Number</th>
                    <th className="py-2 px-2.5">Head Number</th>
                    <th className="py-2 px-2.5">Unladen Wt</th>
                    <th className="py-2 px-2.5">BGK Wt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(formData.vehicles && formData.vehicles.length > 0
                    ? formData.vehicles
                    : formData.vehicle
                    ? [formData.vehicle]
                    : []
                  ).map((veh, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-2.5 text-center text-[10px] text-slate-400 font-bold font-mono">
                        {i + 1}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">
                        {veh.registration_number}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono font-bold text-sky-700">
                        {veh.head}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-700">{veh.weight} KG</td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-700">{veh.bgk_weight} KG</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Declaration Checkbox */}
        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>
              I declare that the information submitted above is true, accurate, and authorized by company management.
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          &larr; Back to Edit
        </button>

        <button
          type="button"
          disabled={!agreed || submitting}
          onClick={handleSubmit}
          className="inline-flex items-center px-5 py-2 rounded text-xs font-bold text-white bg-[#ea7a24] hover:bg-[#d96c1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Confirm & Submit Registration
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface SuccessScreenProps {
  referenceNo: string;
  type: RegistrationType;
  onReset: () => void;
  onViewTracker: () => void;
}

export function SuccessScreen({
  referenceNo,
  type,
  onReset,
  onViewTracker,
}: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto text-center space-y-4 py-4">
      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Registration Submitted Successfully</h2>
        <p className="text-slate-500 text-xs mt-1">
          Your application has been received and queued for admin verification and backend EDI export.
        </p>
      </div>

      {/* Reference Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
          Registration Reference Number
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-base font-black text-slate-900 tracking-wider">
            {referenceNo}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-100 text-slate-500 transition-colors"
            title="Copy reference number"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Save this reference to track approval status or provide to port gate operators.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onViewTracker}
          className="px-4 py-1.5 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Check Status
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-1.5 rounded text-xs font-bold text-white bg-[#ea7a24] hover:bg-[#d96c1a] transition-colors shadow-xs"
        >
          Register Another Asset
        </button>
      </div>
    </div>
  );
}
