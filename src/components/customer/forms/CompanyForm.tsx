import React, { useState } from 'react';
import { PortLocation, CompanyFormData } from '../../../types';
import { getAutoAssignedPorts } from '../../../services/storage';
import { Building2, Phone, Sparkles, CheckCircle2 } from 'lucide-react';

interface CompanyFormProps {
  initialLocation: PortLocation;
  initialPortId?: string;
  onSubmit: (data: CompanyFormData) => void;
  onBack: () => void;
}

export function CompanyForm({
  initialLocation,
  onSubmit,
  onBack,
}: CompanyFormProps) {
  const autoPorts = getAutoAssignedPorts(initialLocation);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    short_name: '',
    company_type: 'Forwarder',
    registration_number: '',
    registration_number_old: '',
    registration_number_new: '',
    port_id: autoPorts.backendIdsString,
    depot_id: '',
    block: '',
    address1: '',
    address2: '',
    city: initialLocation === 'PORT_KLANG' ? 'Pelabuhan Klang' : 'Pasir Gudang',
    state: initialLocation === 'PORT_KLANG' ? 'Selangor' : 'Johor',
    postcode: '',
    country: 'Malaysia',
    contact_name: '',
    contact_email: '',
    contact_designation: 'Operations Manager',
    contact_mobile: '',
    office_phone: '',
    fax: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CompanyFormData, val: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'registration_number_old') {
        next.registration_number = val.toUpperCase().trim();
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleFillDemo = () => {
    const isKlang = initialLocation === 'PORT_KLANG';
    setFormData({
      name: isKlang ? 'MALAYSIAN MARITIME LOGISTICS SDN BHD' : 'SOUTHERN GATEWAY TRANSLOG SDN BHD',
      short_name: isKlang ? 'MML LOGISTICS' : 'SOUTHERN TRANSLOG',
      company_type: 'Forwarder',
      registration_number: isKlang ? 'MML-88192-K' : 'SGT-44102-J',
      registration_number_old: isKlang ? 'MML-88192-K' : 'SGT-44102-J',
      registration_number_new: '202401019821',
      port_id: autoPorts.backendIdsString,
      depot_id: '',
      block: 'Level 4, Wisma Pelabuhan',
      address1: 'Plot 18, Commercial Maritime Zone',
      address2: 'Persiaran Pelabuhan Barat',
      city: isKlang ? 'Pelabuhan Klang' : 'Pasir Gudang',
      state: isKlang ? 'Selangor' : 'Johor',
      postcode: isKlang ? '42000' : '81700',
      country: 'Malaysia',
      contact_name: 'Daniel Lim',
      contact_email: 'daniel.lim@gatewaymaritime.com.my',
      contact_designation: 'General Manager',
      contact_mobile: '+60128833441',
      office_phone: '+60331889900',
      fax: '+60331889901',
    });
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Company Name is required.';
    if (!formData.short_name.trim()) errs.short_name = 'Company Short Name is required.';
    if (!formData.registration_number_old?.trim()) errs.registration_number_old = 'Old Registration Number is required.';
    if (!formData.address1?.trim()) errs.address1 = 'Address Line 1 is required.';
    if (!formData.city?.trim()) errs.city = 'City is required.';
    if (!formData.state?.trim()) errs.state = 'State is required.';
    if (!formData.postcode?.trim()) errs.postcode = 'Postcode is required.';
    if (!formData.contact_name?.trim()) errs.contact_name = 'Contact Person Name is required.';
    if (!formData.contact_email?.trim() || !formData.contact_email.includes('@')) {
      errs.contact_email = 'A valid email is required.';
    }
    if (!formData.contact_mobile?.trim()) errs.contact_mobile = 'Mobile Number is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Company Registration Form</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Fill in legal company profile and primary operational contact details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors"
        >
          <Sparkles className="w-3 h-3 mr-1 text-sky-600" />
          Auto-fill Sample
        </button>
      </div>

      {/* Section 1: Corporate Registration Details */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-[#0090e7]" />
          Corporate & Registration Details
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Company Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="LUMORA TECH SDN BHD"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:outline-none uppercase"
            />
            {errors.name && <p className="text-[10px] text-rose-600 mt-0.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Company Short Name (Trade Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.short_name}
              onChange={(e) => handleChange('short_name', e.target.value)}
              placeholder="LUMORA TECH"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none uppercase"
            />
            {errors.short_name && <p className="text-[10px] text-rose-600 mt-0.5">{errors.short_name}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Company Category / Type <span className="text-rose-500">*</span>
            </label>
            {initialLocation === 'PORT_KLANG' ? (
              <div>
                <select
                  value={formData.company_type === 'Transporter' ? 'Transporter' : 'Forwarder'}
                  onChange={(e) => handleChange('company_type', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white font-semibold text-slate-800"
                >
                  <option value="Forwarder">Forwarder (Forwarding Agent)</option>
                  <option value="Transporter">Transporter</option>
                </select>
                <p className="text-[10px] text-sky-700 mt-1 font-medium bg-sky-50 p-1.5 rounded border border-sky-100">
                  Port Klang Conventional registration allows <strong>Forwarder</strong> or <strong>Transporter</strong> only.
                </p>
              </div>
            ) : (
              <select
                value={formData.company_type}
                onChange={(e) => handleChange('company_type', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white font-medium text-slate-800"
              >
                <option value="Forwarder">Forwarder (Forwarding Agent)</option>
                <option value="Haulage">Haulage (Haulier Carrier)</option>
                <option value="Transporter">Transporter (Logistics)</option>
                <option value="Forwarding Agent">Forwarding Agent</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Old Company Reg. Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.registration_number_old}
              onChange={(e) => handleChange('registration_number_old', e.target.value)}
              placeholder="AAAAAA-2"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none uppercase font-mono"
            />
            {errors.registration_number_old && (
              <p className="text-[10px] text-rose-600 mt-0.5">{errors.registration_number_old}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              New Company Reg. Number (SSM 12-digit)
            </label>
            <input
              type="text"
              value={formData.registration_number_new}
              onChange={(e) => handleChange('registration_number_new', e.target.value)}
              placeholder="201901004521"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Registered Business Address */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-[#0090e7]" />
          Registered Business Address
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Building / Block / Floor / Lot
            </label>
            <input
              type="text"
              value={formData.block}
              onChange={(e) => handleChange('block', e.target.value)}
              placeholder="Wisma Logistik, Level 3"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address1}
              onChange={(e) => handleChange('address1', e.target.value)}
              placeholder="No. 12, Jalan Perindustrian 4"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {errors.address1 && <p className="text-[10px] text-rose-600 mt-0.5">{errors.address1}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.address2}
              onChange={(e) => handleChange('address2', e.target.value)}
              placeholder="Kawasan Perindustrian Pelabuhan"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Pasir Gudang"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {errors.city && <p className="text-[10px] text-rose-600 mt-0.5">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              State <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="Johor"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {errors.state && <p className="text-[10px] text-rose-600 mt-0.5">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Postcode <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => handleChange('postcode', e.target.value)}
              placeholder="81700"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {errors.postcode && <p className="text-[10px] text-rose-600 mt-0.5">{errors.postcode}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none bg-slate-50 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Primary Operational Contact */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
          <Phone className="w-4 h-4 text-[#0090e7]" />
          Primary Operational Contact
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Contact Person Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contact_name}
              onChange={(e) => handleChange('contact_name', e.target.value)}
              placeholder="Kevin Tan"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {errors.contact_name && <p className="text-[10px] text-rose-600 mt-0.5">{errors.contact_name}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Designation / Title
            </label>
            <input
              type="text"
              value={formData.contact_designation}
              onChange={(e) => handleChange('contact_designation', e.target.value)}
              placeholder="Logistics Manager"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Contact Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="kevin@company.com"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {errors.contact_email && <p className="text-[10px] text-rose-600 mt-0.5">{errors.contact_email}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Mobile Contact Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contact_mobile}
              onChange={(e) => handleChange('contact_mobile', e.target.value)}
              placeholder="+60123456789"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
            {errors.contact_mobile && (
              <p className="text-[10px] text-rose-600 mt-0.5">{errors.contact_mobile}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Office Landline
            </label>
            <input
              type="text"
              value={formData.office_phone}
              onChange={(e) => handleChange('office_phone', e.target.value)}
              placeholder="+6072518899"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Fax Number
            </label>
            <input
              type="text"
              value={formData.fax}
              onChange={(e) => handleChange('fax', e.target.value)}
              placeholder="+6072518898"
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          &larr; Back
        </button>

        <button
          type="submit"
          className="px-5 py-2 rounded text-xs font-bold text-white bg-[#ea7a24] hover:bg-[#d96c1a] transition-colors shadow-xs flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Review Registration &rarr;
        </button>
      </div>
    </form>
  );
}
