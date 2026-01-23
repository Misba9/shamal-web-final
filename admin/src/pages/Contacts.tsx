import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { leadsApi, Lead, LeadStatus } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Eye, Download, Loader2, Bell, BellOff } from 'lucide-react';

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'converted'];

export const ContactsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    status: 'new' as LeadStatus,
  });
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [detailNotes, setDetailNotes] = useState('');

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => { if (searchRef.current) clearTimeout(searchRef.current); };
  }, [search]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leadsApi.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      });
      setLeads(res.data);
      setError('');
    } catch (e) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (viewLead) {
      setDetailNotes(viewLead.internalNotes ?? '');
    }
  }, [viewLead]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.message.trim()) return;
    setAddSaving(true);
    try {
      await leadsApi.create({
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim() || undefined,
        subject: addForm.subject.trim() || undefined,
        message: addForm.message.trim(),
        status: addForm.status,
        source: 'admin',
      });
      setAddForm({ name: '', email: '', phone: '', subject: '', message: '', status: 'new' });
      setAddOpen(false);
      await fetchLeads();
      toast.success('Lead added');
    } catch (err) {
      toast.error('Failed to add lead');
    } finally {
      setAddSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    setUpdatingId(id);
    try {
      const res = await leadsApi.update(id, { status });
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, ...res.data } : l)));
      if (viewLead?._id === id) setViewLead((l) => (l ? { ...l, status } : null));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!viewLead) return;
    setNotesSaving(true);
    try {
      const res = await leadsApi.update(viewLead._id, { internalNotes: detailNotes });
      setLeads((prev) => prev.map((l) => (l._id === viewLead._id ? { ...l, internalNotes: detailNotes } : l)));
      setViewLead((l) => (l?._id === viewLead._id ? { ...l, internalNotes: detailNotes } : l));
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    } finally {
      setNotesSaving(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await leadsApi.update(id, { read: true });
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, read: true } : l)));
      if (viewLead?._id === id) setViewLead((l) => (l ? { ...l, read: true } : null));
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleEmailNotifyToggle = async (id: string, next: boolean) => {
    try {
      const res = await leadsApi.update(id, { emailNotify: next });
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, emailNotify: next } : l)));
      if (viewLead?._id === id) setViewLead((l) => (l ? { ...l, emailNotify: next } : null));
      toast.success(next ? 'Email notifications on' : 'Email notifications off');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await leadsApi.exportCsv({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      });
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await leadsApi.delete(deleteTarget._id);
      setLeads((prev) => prev.filter((l) => l._id !== deleteTarget._id));
      if (viewLead?._id === deleteTarget._id) setViewLead(null);
      setDeleteTarget(null);
      toast.success('Lead deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111]">Leads</h2>
            <p className="text-[#666]">Manage contact submissions. Total: {leads.length}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setAddOpen(true)} className="inline-flex gap-2">
              <Plus className="h-4 w-4" />
              Add lead
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting || leads.length === 0}
              className="inline-flex gap-2"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[240px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="h-10 rounded-md border border-input bg-white px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#666]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading leads...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : leads.length === 0 ? (
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center text-[#666]">
          No leads found. Add one or wait for contact form submissions.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#e5e5e5] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                <th className="px-4 py-3 font-medium text-[#111]">Name</th>
                <th className="px-4 py-3 font-medium text-[#111]">Email</th>
                <th className="px-4 py-3 font-medium text-[#111]">Message</th>
                <th className="px-4 py-3 font-medium text-[#111]">Status</th>
                <th className="px-4 py-3 font-medium text-[#111]">Read</th>
                <th className="px-4 py-3 font-medium text-[#111]">Date</th>
                <th className="px-4 py-3 font-medium text-[#111] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l._id} className="border-b border-[#e5e5e5] hover:bg-[#fafafa]">
                  <td className="px-4 py-3 font-medium text-[#111]">{l.name}</td>
                  <td className="px-4 py-3 text-[#666]">
                    <a href={`mailto:${l.email}`} className="text-blue-600 hover:underline">
                      {l.email}
                    </a>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-[#666]" title={l.message}>
                    {l.message}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.status}
                      onChange={(e) => handleStatusChange(l._id, e.target.value as LeadStatus)}
                      disabled={updatingId === l._id}
                      className="h-8 rounded border border-input bg-white px-2 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {updatingId === l._id && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                  </td>
                  <td className="px-4 py-3 text-[#999]">{l.read ? '✓' : '—'}</td>
                  <td className="px-4 py-3 text-[#999]">{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setViewLead(l)}>
                      <Eye className="h-3.5 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-1 h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setDeleteTarget(l)}
                    >
                      <Trash2 className="h-3.5 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail / Edit dialog: notes, status, email toggle */}
      <Dialog open={!!viewLead} onOpenChange={(o) => !o && setViewLead(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead details</DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <p><strong>Name:</strong> {viewLead.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${viewLead.email}`} className="text-blue-600 hover:underline">{viewLead.email}</a></p>
                {viewLead.phone && <p><strong>Phone:</strong> {viewLead.phone}</p>}
                {viewLead.subject && <p><strong>Subject:</strong> {viewLead.subject}</p>}
                <p><strong>Status:</strong>{' '}
                  <select
                    value={viewLead.status}
                    onChange={(e) => handleStatusChange(viewLead._id, e.target.value as LeadStatus)}
                    disabled={updatingId === viewLead._id}
                    className="h-8 rounded border border-input bg-white px-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </p>
                <p><strong>Message:</strong></p>
                <p className="whitespace-pre-wrap rounded border border-[#e5e5e5] bg-[#fafafa] p-3">{viewLead.message}</p>
                <p className="text-xs text-[#999]">Received: {new Date(viewLead.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <Label>Internal notes</Label>
                <textarea
                  value={detailNotes}
                  onChange={(e) => setDetailNotes(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                  placeholder="Private notes about this lead..."
                />
                <Button size="sm" className="mt-2" onClick={handleSaveNotes} disabled={notesSaving}>
                  {notesSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  {notesSaving ? ' Saving...' : 'Save notes'}
                </Button>
              </div>

              {!viewLead.read && (
                <Button size="sm" variant="outline" onClick={() => handleMarkRead(viewLead._id)}>
                  Mark as read
                </Button>
              )}
              <div className="flex items-center justify-between rounded border border-[#e5e5e5] bg-[#fafafa] px-3 py-2">
                <span className="text-sm">Email notifications</span>
                <button
                  type="button"
                  onClick={() => handleEmailNotifyToggle(viewLead._id, !(viewLead.emailNotify !== false))}
                  className="flex items-center gap-1.5 text-sm text-[#666] hover:text-[#111]"
                >
                  {viewLead.emailNotify !== false ? (
                    <><Bell className="h-4 w-4" /> On</>
                  ) : (
                    <><BellOff className="h-4 w-4" /> Off</>
                  )}
                </button>
              </div>

              <DialogFooter>
                <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => { setViewLead(null); setDeleteTarget(viewLead); }}>
                  Delete
                </Button>
                <Button onClick={() => setViewLead(null)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add lead dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLead} className="space-y-4">
            <div>
              <Label htmlFor="add-name">Name *</Label>
              <Input id="add-name" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="add-email">Email *</Label>
              <Input id="add-email" type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="add-phone">Phone</Label>
              <Input id="add-phone" value={addForm.phone} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="add-subject">Subject</Label>
              <Input id="add-subject" value={addForm.subject} onChange={(e) => setAddForm((f) => ({ ...f, subject: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="add-message">Message *</Label>
              <textarea id="add-message" value={addForm.message} onChange={(e) => setAddForm((f) => ({ ...f, message: e.target.value }))} required rows={3} className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
            <div>
              <Label htmlFor="add-status">Status</Label>
              <select id="add-status" value={addForm.status} onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value as LeadStatus }))} className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addSaving}>{addSaving ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lead</AlertDialogTitle>
            <AlertDialogDescription>
              Delete lead from {deleteTarget?.name}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
