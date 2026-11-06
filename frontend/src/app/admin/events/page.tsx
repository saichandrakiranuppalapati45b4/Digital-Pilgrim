'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../hooks/useLanguage';
import { api } from '../../../lib/api';
import { EventItem } from '../../../types';
import { Plus, Edit2, Trash2, Calendar, X, Save, MapPin } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export default function AdminEventsPage() {
  const { language } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const initialForm = {
    titleEn: '',
    titleTe: '',
    descEn: '',
    descTe: '',
    venue: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    status: 'upcoming' as const,
  };

  const [formData, setFormData] = useState(initialForm);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const res = await api.getEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load events' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingId(event._id);
    setFormData({
      titleEn: event.title.en,
      titleTe: event.title.te || '',
      descEn: event.description.en,
      descTe: event.description.te || '',
      venue: event.venue,
      startDate: new Date(event.startDate).toISOString().slice(0, 10),
      endDate: new Date(event.endDate).toISOString().slice(0, 10),
      status: event.status as any,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      title: { en: formData.titleEn, te: formData.titleTe },
      description: { en: formData.descEn, te: formData.descTe },
      venue: formData.venue,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: formData.status,
    };

    try {
      if (editingId) {
        await api.updateEvent(editingId, payload);
        setFeedback({ type: 'success', message: 'Event updated successfully.' });
      } else {
        await api.createEvent(payload);
        setFeedback({ type: 'success', message: 'Event created successfully.' });
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete event "${title}"?`)) return;
    try {
      await api.deleteEvent(id);
      setFeedback({ type: 'success', message: 'Event deleted.' });
      loadEvents();
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
              Cultural Events & Rituals
            </h1>
            <p className="text-xs text-secondary-text">
              Manage Godavari Pushkaralu ceremonies, exhibitions, and harati rituals.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-maroon px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Event</span>
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
          <div className="py-16 text-center text-xs text-secondary-text">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-heritage bg-white p-12 text-center text-xs text-secondary-text">
            No events found. Click "+ Add New Event" to create one.
          </div>
        ) : (
          <div className="rounded-xl border border-border-heritage bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-subtle border-b border-border-heritage text-secondary-text uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Event Title</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-heritage">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-ivory-subtle/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-charcoal">
                      <div>{ev.title.en}</div>
                      <div className="text-[11px] text-secondary-text">{ev.title.te}</div>
                    </td>
                    <td className="px-4 py-3 text-secondary-text">{ev.venue}</td>
                    <td className="px-4 py-3 text-secondary-text font-mono text-[11px]">
                      {formatDate(ev.startDate, language)} – {formatDate(ev.endDate, language)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-saffron/10 px-2 py-0.5 text-[10px] font-bold text-saffron-dark uppercase border border-saffron/20">
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="p-1 text-charcoal hover:text-primary-maroon"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev._id, ev.title.en)}
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
                  {editingId ? 'Edit Event' : 'Create Cultural Event'}
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

                <div>
                  <label className="text-[11px] font-bold">Venue *</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full rounded border border-border-heritage p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">End Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold">Description (EN) *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.descEn}
                      onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold">Description (TE) *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.descTe}
                      onChange={(e) => setFormData({ ...formData, descTe: e.target.value })}
                      className="w-full rounded border border-border-heritage p-2 text-xs"
                    />
                  </div>
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
                    Save Event
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
