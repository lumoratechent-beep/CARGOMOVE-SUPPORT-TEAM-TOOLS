import React, { useState } from 'react';
import { PortConfig, DepotConfig } from '../../types';
import { getPorts, getDepots, updatePortConfig, updateDepotConfig } from '../../services/storage';
import { PortBadge } from '../common/Badge';
import { Anchor, Building, Edit2, Check, X, ShieldAlert } from 'lucide-react';

export function PortDepotConfig() {
  const [ports, setPorts] = useState<PortConfig[]>(getPorts());
  const [depots, setDepots] = useState<DepotConfig[]>(getDepots());
  const [editingPortId, setEditingPortId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    display_name: string;
    backend_port_id: string;
    depotIds: Record<string, string>;
  }>({
    display_name: '',
    backend_port_id: '',
    depotIds: {},
  });

  const handleStartEdit = (port: PortConfig) => {
    setEditingPortId(port.id);
    const relatedDepots = depots.filter((d) => d.port_id === port.id);
    const depotMap: Record<string, string> = {};
    relatedDepots.forEach((d) => {
      depotMap[d.id] = d.backend_depot_id;
    });

    setEditForm({
      display_name: port.display_name,
      backend_port_id: port.backend_port_id,
      depotIds: depotMap,
    });
  };

  const handleSave = (portId: string) => {
    updatePortConfig(portId, {
      display_name: editForm.display_name,
      backend_port_id: editForm.backend_port_id,
    });

    // Update depots
    Object.entries(editForm.depotIds).forEach(([depotId, backendId]) => {
      updateDepotConfig(depotId, { backend_depot_id: String(backendId) });
    });

    setPorts(getPorts());
    setDepots(getDepots());
    setEditingPortId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Port & Depot Master Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">
          Maintain backend IDs (e.g. MongoDB ObjectIDs or TOS IDs) mapped into the PORTS and DEPOTS Excel export columns.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Backend Integration Notice:</strong> Customers only ever see human-friendly terminal names (e.g. "PG-ICS" or "PG-DEPOT"). When exporting to Excel, the application automatically substitutes the corresponding <code className="bg-blue-100 font-mono px-1 py-0.5 rounded">backend_port_id</code> (e.g. 5cad3ffb4fe26b4cf4ca563c) and <code className="bg-blue-100 font-mono px-1 py-0.5 rounded">backend_depot_id</code>.
        </div>
      </div>

      <div className="space-y-6">
        {ports.map((port) => {
          const isEditing = editingPortId === port.id;
          const portDepots = depots.filter((d) => d.port_id === port.id);

          return (
            <div
              key={port.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{port.display_name}</h3>
                      <PortBadge location={port.location} />
                    </div>
                    <div className="text-xs text-slate-500">
                      Internal Key: <span className="font-mono text-slate-700">{port.id}</span> &bull; Location: {port.location}
                    </div>
                  </div>
                </div>

                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingPortId(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(port.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                      >
                        Save Config
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(port)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      Edit IDs
                    </button>
                  )}
                </div>
              </div>

              {/* Port Backend ID Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Display Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  ) : (
                    <div className="font-bold text-slate-900">{port.display_name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">
                    Export Value for PORTS Column (Backend ID)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.backend_port_id}
                      onChange={(e) => setEditForm({ ...editForm, backend_port_id: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white font-mono text-blue-700 font-bold"
                    />
                  ) : (
                    <div className="font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block">
                      {port.backend_port_id}
                    </div>
                  )}
                </div>
              </div>

              {/* Depots Sub-list */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-500" />
                  Associated Depots / Staging Yards (DEPOTS Column)
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Depot Name</th>
                        <th className="py-2.5 px-3 font-mono">Internal Key</th>
                        <th className="py-2.5 px-3 font-mono text-emerald-800">Backend Export ID (DEPOTS)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {portDepots.map((depot) => (
                        <tr key={depot.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-900">
                            {depot.display_name}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-500">
                            {depot.id}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-700">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.depotIds[depot.id] || ''}
                                onChange={(e) => {
                                  setEditForm({
                                    ...editForm,
                                    depotIds: {
                                      ...editForm.depotIds,
                                      [depot.id]: e.target.value,
                                    },
                                  });
                                }}
                                className="px-2 py-1 rounded border border-slate-300 bg-white text-xs w-full max-w-xs font-mono"
                              />
                            ) : (
                              depot.backend_depot_id
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
