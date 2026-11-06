'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { api } from '../../../lib/api';
import { FacilityItem, FacilityType } from '../../../types';
import { Plus, Edit2, Trash2, HeartHandshake, X, Save, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

export default function AdminFacilitiesPage() {
  const { language } = useLanguage();
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const initialForm = {
    nameEn: '',
    nameTe: '',
    type: 'drinking_water' as FacilityType,
    descEn: '',
    descTe: '',
    address: '',
    lat: 17.0005,
    lng: 81.7778,
    phone: '',
    operatingHours: '24 Hours',
    isVerified: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const loadFacilities = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFacilities();
      if (res.success && res.data) {
        setFacilities(res.data);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load facilities' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac: FacilityItem) => {
    setEditingId(fac._id);
    setFormData({
      nameEn: fac.name.en,
      nameTe: fac.name.te || '',
      type: fac.type,
      descEn: fac.description?.en || '',
      descTe: fac.description?.te || '',
      address: fac.address,
      lat: fac.location.latitude,
      lng: fac.location.longitude,
      phone: fac.phone || '',
      operatingHours: fac.operatingHours || '24 Hours',
      isVerified: fac.isVerified,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      name: { en: formData.nameEn, te: formData.nameTe },
      type: formData.type,
      description: { en: formData.descEn, te: formData.descTe },
      address: formData.address,
      location: {
        latitude: Number(formData.lat),
        longitude: Number(formData.lng),
      },
      phone: formData.phone,
      operatingHours: formData.operatingHours,
      isVerified: formData.isVerified,
      isActive: true,
    };

    try {
      if (editingId) {
        await api.updateFacility(editingId, payload);
        setFeedback({ type: 'success', message: 'Facility updated successfully.' });
      } else {
        await api.createFacility(payload);
        setFeedback({ type: 'success', message: 'Facility created successfully.' });
      }
      setIsModalOpen(false);
      loadFacilities();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete facility "${name}"?`)) return;
    try {
      await api.deleteFacility(id);
      setFeedback({ type: 'success', message: 'Facility deleted.' });
      loadFacilities();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary-maroon">
              Pilgrim Facilities Management
            </h1>
            <p className="text-xs text-secondary-text">
              Manage drinking water points, ghat restrooms, medical aid posts, and parking.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-maroon px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Facility</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 text-center text-xs text-secondary-text">Loading facilities...</div>
        ) : facilities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-heritage bg-white p-12 text-center text-xs text-secondary-text">
            No facilities found. Click "+ Add New Facility" to register one.
          </div>
        ) : (
          <div className="rounded-xl border border-border-heritage bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-subtle border-b border-border-heritage text-secondary-text uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Facility Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Operating Hours</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-heritage">
                {facilities.map((fac) => (
                  <tr key={fac._id} className="hover:bg-ivory-subtle/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-charcoal">
                      <div>{fac.name.en}</div>
                      <div className="text-[11px] text-secondary-text">{fac.name.te}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{fac.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-secondary-text max-w-[200px] truncate">
                      {fac.address}
                    </td>
                    <td className="px-4 py-3 text-secondary-text">{fac.operatingHours}</td>
                    <td className="px-4 py-3">
                      {fac.isVerified ? (
                        <span className="flex items-center gap-1 text-[11px] text-green-700 font-semibold">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-secondary-text">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(fac)}
                        className="p-1 text-charcoal hover:text-primary-maroon"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fac._id, fac.name.en)}
                        className="p-1 text-charcoal hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-border-heritage">
              <div className="flex items-center justify-between pb-3 border-b border-border-heritage mb-4">
                <h3 className="font-serif text-lg font-bold text-primary-maroon">
                  {editingId ? 'Edit Facility' : 'Create Pilgrim Facility'}
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="h-5 w-5 text-secondary-text" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Name (EN) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Name (TE) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nameTe}
                      onChange={(e) => setFormData({ ...formData, nameTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Facility Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as FacilityType })
                      }
                      className="w-full rounded border border-border-heritage p-2 text-xs capitalize"
                    >
                      <option value="drinking_water">Drinking Water</option>
                      <option value="restroom">Restroom</option>
                      <option value="hospital">Hospital / Medical</option>
                      <option value="first_aid">First Aid</option>
                      <option value="food_prasadam">Food / Prasadam</option>
                      <option value="parking">Parking</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="ghat">Bathing Ghat</option>
                      <option value="information_center">Information Center</option>
                      <option value="police_assistance">Police Assistance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                      placeholder="1800-425-0001"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold">Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded border border-border-heritage p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Hours</label>
                    <input
                      type="text"
                      value={formData.operatingHours}
                      onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isVerified"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded text-primary-maroon"
                  />
                  <label htmlFor="isVerified" className="text-xs font-semibold cursor-pointer">
                    Mark as verified facility
                  </label>
                </div>

                <div className="pt-3 border-t border-border-heritage flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded border border-border-heritage px-3 py-1.5 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-primary-maroon px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-hover"
                  >
                    Save Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
