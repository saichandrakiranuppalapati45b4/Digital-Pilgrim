'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { api } from '../../../lib/api';
import { AnnouncementItem, AnnouncementPriority, AnnouncementType } from '../../../types';
import { Plus, Edit2, Trash2, Bell, X, Save, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../hooks/useLanguage';

export default function AdminAnnouncementsPage() {
  const { language } = useLanguage();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const initialForm = {
    titleEn: '',
    titleTe: '',
    contentEn: '',
    contentTe: '',
    type: 'general' as AnnouncementType,
    priority: 'medium' as AnnouncementPriority,
    isPublished: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAnnouncements();
      if (res.success && res.data) {
        setAnnouncements(res.data);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load announcements' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: AnnouncementItem) => {
    setEditingId(ann._id);
    setFormData({
      titleEn: ann.title.en,
      titleTe: ann.title.te || '',
      contentEn: ann.content.en,
      contentTe: ann.content.te || '',
      type: ann.type,
      priority: ann.priority,
      isPublished: ann.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      title: { en: formData.titleEn, te: formData.titleTe },
      content: { en: formData.contentEn, te: formData.contentTe },
      type: formData.type,
      priority: formData.priority,
      isPublished: formData.isPublished,
    };

    try {
      if (editingId) {
        await api.updateAnnouncement(editingId, payload);
        setFeedback({ type: 'success', message: 'Announcement updated successfully.' });
      } else {
        await api.createAnnouncement(payload);
        setFeedback({ type: 'success', message: 'Announcement created successfully.' });
      }
      setIsModalOpen(false);
      loadAnnouncements();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete announcement "${title}"?`)) return;
    try {
      await api.deleteAnnouncement(id);
      setFeedback({ type: 'success', message: 'Announcement deleted.' });
      loadAnnouncements();
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
              Public Announcements & Advisories
            </h1>
            <p className="text-xs text-secondary-text">
              Broadcast urgent safety warnings, ghat guidelines, and cultural updates.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-maroon px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            <span>Create Announcement</span>
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
          <div className="py-16 text-center text-xs text-secondary-text">Loading notices...</div>
        ) : announcements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-heritage bg-white p-12 text-center text-xs text-secondary-text">
            No announcements found. Click "+ Create Announcement" to publish one.
          </div>
        ) : (
          <div className="rounded-xl border border-border-heritage bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-subtle border-b border-border-heritage text-secondary-text uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Announcement Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-heritage">
                {announcements.map((ann) => (
                  <tr key={ann._id} className="hover:bg-ivory-subtle/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-charcoal">
                      <div>{ann.title.en}</div>
                      <div className="text-[11px] text-secondary-text">{ann.title.te}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{ann.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          ann.priority === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : ann.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ann.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary-text">
                      {ann.isPublished ? '✅ Published' : 'Draft'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ann)}
                        className="p-1 text-charcoal hover:text-primary-maroon"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann._id, ann.title.en)}
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
                  {editingId ? 'Edit Announcement' : 'Create Public Notice'}
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="h-5 w-5 text-secondary-text" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Title (EN) *</label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Title (TE) *</label>
                    <input
                      type="text"
                      required
                      value={formData.titleTe}
                      onChange={(e) => setFormData({ ...formData, titleTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as AnnouncementType })
                      }
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    >
                      <option value="general">General</option>
                      <option value="alert">Alert</option>
                      <option value="pushkaralu">Pushkaralu</option>
                      <option value="schedule">Schedule</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as AnnouncementPriority,
                        })
                      }
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Content (EN) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.contentEn}
                      onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Content (TE) *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.contentTe}
                      onChange={(e) => setFormData({ ...formData, contentTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-primary-maroon"
                  />
                  <label htmlFor="isPublished" className="text-xs font-semibold cursor-pointer">
                    Publish immediately to visitor bulletin
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
                    Save Notice
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
