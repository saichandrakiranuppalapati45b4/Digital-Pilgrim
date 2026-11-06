'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../hooks/useLanguage';
import { api } from '../../../lib/api';
import { HeritageLocation, HeritageCategory } from '../../../types';
import { QRCodeViewer } from '../../../components/qr/QRCodeViewer';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  QrCode,
  CheckCircle,
  Archive,
  Eye,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';

export default function AdminHeritagePage() {
  const { language } = useLanguage();
  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeQRLocation, setActiveQRLocation] = useState<HeritageLocation | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Form State
  const initialForm = {
    nameEn: '',
    nameTe: '',
    slug: '',
    category: 'temple' as HeritageCategory,
    descEn: '',
    descTe: '',
    histEn: '',
    histTe: '',
    sigEn: '',
    sigTe: '',
    address: '',
    lat: 17.0,
    lng: 81.78,
    imageUrl: '',
    audioUrl: '',
    audioTitleEn: '',
    audioTitleTe: '',
    audioLang: 'both' as 'en' | 'te' | 'both',
    status: 'published' as 'draft' | 'published' | 'archived',
    isFeatured: false,
  };

  const [formData, setFormData] = useState(initialForm);

  const loadHeritage = async () => {
    setIsLoading(true);
    try {
      const res = await api.getHeritage({ limit: 100 });
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load heritage' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHeritage();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc: HeritageLocation) => {
    setEditingId(loc._id);
    setFormData({
      nameEn: loc.name?.en || '',
      nameTe: loc.name?.te || '',
      slug: loc.slug || '',
      category: loc.category || 'temple',
      descEn: loc.description?.en || '',
      descTe: loc.description?.te || '',
      histEn: loc.history?.en || '',
      histTe: loc.history?.te || '',
      sigEn: loc.significance?.en || '',
      sigTe: loc.significance?.te || '',
      address: loc.address || '',
      lat: loc.location?.latitude || 17.0,
      lng: loc.location?.longitude || 81.78,
      imageUrl: loc.images?.[0]?.url || '',
      audioUrl: loc.audioGuides?.[0]?.url || '',
      audioTitleEn: loc.audioGuides?.[0]?.title?.en || '',
      audioTitleTe: loc.audioGuides?.[0]?.title?.te || '',
      audioLang: loc.audioGuides?.[0]?.language || 'both',
      status: loc.status || 'published',
      isFeatured: !!loc.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload: any = {
      name: { en: formData.nameEn, te: formData.nameTe },
      slug: formData.slug || undefined,
      category: formData.category,
      description: { en: formData.descEn, te: formData.descTe },
      history: { en: formData.histEn, te: formData.histTe },
      significance: { en: formData.sigEn, te: formData.sigTe },
      address: formData.address,
      location: {
        latitude: Number(formData.lat),
        longitude: Number(formData.lng),
      },
      status: formData.status,
      isFeatured: formData.isFeatured,
      images: formData.imageUrl
        ? [{ url: formData.imageUrl, isPrimary: true }]
        : [],
      audioGuides: formData.audioUrl
        ? [
            {
              url: formData.audioUrl,
              title: { en: formData.audioTitleEn || formData.nameEn, te: formData.audioTitleTe },
              language: formData.audioLang,
            },
          ]
        : [],
    };

    try {
      if (editingId) {
        await api.updateHeritage(editingId, payload);
        setFeedback({ type: 'success', message: 'Heritage location updated successfully.' });
      } else {
        await api.createHeritage(payload);
        setFeedback({ type: 'success', message: 'Heritage location created successfully.' });
      }
      setIsModalOpen(false);
      loadHeritage();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await api.deleteHeritage(id);
      setFeedback({ type: 'success', message: 'Heritage location removed.' });
      loadHeritage();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary-maroon">
              Heritage Locations Management
            </h1>
            <p className="text-xs text-secondary-text">
              Create, edit, publish, generate QR codes, and link audio guides.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-maroon px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Location</span>
          </button>
        </div>

        {/* Feedback Alert */}
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

        {/* Table / List */}
        {isLoading ? (
          <div className="py-16 text-center text-xs text-secondary-text">
            Loading heritage locations...
          </div>
        ) : locations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-heritage bg-white p-12 text-center text-xs text-secondary-text">
            No heritage locations found. Click "+ Add New Location" to create one.
          </div>
        ) : (
          <div className="rounded-xl border border-border-heritage bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-subtle border-b border-border-heritage text-secondary-text uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Site / Temple</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Audio / Media</th>
                    <th className="px-4 py-3">QR Code</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-heritage">
                  {locations.map((loc) => (
                    <tr key={loc._id} className="hover:bg-ivory-subtle/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-charcoal">{loc.name.en}</div>
                        <div className="text-[11px] text-secondary-text">{loc.name.te}</div>
                        <div className="text-[10px] font-mono text-secondary-text/80">{loc.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-ivory-subtle px-2 py-0.5 text-[11px] font-medium border border-border-heritage capitalize">
                          {loc.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            loc.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : loc.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {loc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[11px] space-y-0.5">
                          <div>🖼️ {loc.images?.length || 0} photo(s)</div>
                          <div>🎧 {loc.audioGuides?.length || 0} audio(s)</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setActiveQRLocation(loc)}
                          className="inline-flex items-center gap-1 rounded bg-ivory-subtle px-2 py-1 text-[11px] font-semibold text-primary-maroon border border-border-heritage hover:border-primary-maroon"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>View QR</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(loc)}
                          className="p-1 text-charcoal hover:text-primary-maroon transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(loc._id, loc.name.en)}
                          className="p-1 text-charcoal hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-border-heritage my-8">
              <div className="flex items-center justify-between pb-3 border-b border-border-heritage mb-4">
                <h3 className="font-serif text-lg font-bold text-primary-maroon">
                  {editingId ? 'Edit Heritage Location' : 'Create Heritage Location'}
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="h-5 w-5 text-secondary-text hover:text-charcoal" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                      placeholder="Kotilingeswara Swamy Temple"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Name (Telugu) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nameTe}
                      onChange={(e) => setFormData({ ...formData, nameTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                      placeholder="కోటిలింగేశ్వర స్వామి దేవాలయం"
                    />
                  </div>
                </div>

                {/* Slug & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Slug (Optional)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                      placeholder="kotilingeswara-temple"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as HeritageCategory })
                      }
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    >
                      <option value="temple">Temple</option>
                      <option value="ghat">River Ghat</option>
                      <option value="spiritual_site">Spiritual Site</option>
                      <option value="historical_monument">Historical Monument</option>
                      <option value="nature_cultural">Nature & Cultural</option>
                    </select>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Description (English) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.descEn}
                      onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Description (Telugu) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.descTe}
                      onChange={(e) => setFormData({ ...formData, descTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                {/* History */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">History (English) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.histEn}
                      onChange={(e) => setFormData({ ...formData, histEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">History (Telugu) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.histTe}
                      onChange={(e) => setFormData({ ...formData, histTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Significance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Significance (English) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.sigEn}
                      onChange={(e) => setFormData({ ...formData, sigEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Significance (Telugu) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.sigTe}
                      onChange={(e) => setFormData({ ...formData, sigTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Address & Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1 space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Godavari Main Road, Rajahmundry"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Primary Image & Audio URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Photo Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal">Audio Guide Stream URL</label>
                    <input
                      type="url"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Status & Featured */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-charcoal">Status:</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'draft' | 'published' | 'archived',
                        })
                      }
                      className="rounded border border-border-heritage p-1 text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-primary-maroon"
                    />
                    <span>Featured on Home Page</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border-heritage flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-border-heritage px-4 py-2 text-xs font-semibold text-charcoal hover:bg-ivory-subtle"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary-maroon px-5 py-2 text-xs font-bold text-white hover:bg-primary-hover flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Location</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {activeQRLocation && (
          <QRCodeViewer
            location={activeQRLocation}
            onClose={() => setActiveQRLocation(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
