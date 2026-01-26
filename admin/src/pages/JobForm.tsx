import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { jobsApi, Job, EmploymentType } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];

export const JobFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '',
    slug: '',
    department: '',
    location: '',
    employmentType: 'Full-Time' as EmploymentType,
    experience: '',
    description: '',
    requirements: '',
    responsibilities: '',
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await jobsApi.getById(id!);
        if (cancelled) return;
        const job = res.data;
        setForm({
          title: job.title || '',
          slug: job.slug || '',
          department: job.department || '',
          location: job.location || '',
          employmentType: job.employmentType || 'Full-Time',
          experience: job.experience || '',
          description: job.description || '',
          requirements: (job.requirements || []).join('\n'),
          responsibilities: (job.responsibilities || []).join('\n'),
          isActive: job.isActive ?? true,
          seoTitle: job.seoTitle || '',
          seoDescription: job.seoDescription || '',
          seoKeywords: (job.seoKeywords || []).join(', '),
        });
      } catch (e) {
        if (!cancelled) toast.error('Failed to load job');
        navigate('/jobs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setSaving(true);
    try {
      const requirements = form.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
      const responsibilities = form.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
      const keywords = form.seoKeywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        department: form.department.trim() || undefined,
        location: form.location.trim() || undefined,
        employmentType: form.employmentType,
        experience: form.experience.trim() || undefined,
        description: form.description.trim(),
        requirements: requirements.length > 0 ? requirements : undefined,
        responsibilities: responsibilities.length > 0 ? responsibilities : undefined,
        isActive: form.isActive,
        seoTitle: form.seoTitle.trim() || undefined,
        seoDescription: form.seoDescription.trim() || undefined,
        seoKeywords: keywords.length > 0 ? keywords : undefined,
      };
      if (isEdit) {
        await jobsApi.update(id!, payload);
        toast.success('Job updated successfully');
      } else {
        await jobsApi.create(payload);
        toast.success('Job created successfully');
      }
      navigate('/jobs');
    } catch (err: unknown) {
      const ax = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string; field?: string } } }).response?.data
        : undefined;
      const msg = ax?.message || 'Request failed';
      toast.error(String(msg));
      if (ax?.field === 'slug') setErrors((e) => ({ ...e, slug: String(msg) }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#666]">Loading job...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          className="mb-2 inline-flex items-center gap-1 text-sm text-[#666] hover:text-[#111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>
        <h2 className="text-xl font-bold text-[#111]">{isEdit ? 'Edit job' : 'Add job'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => {
              const n = e.target.value;
              setForm((f) => ({ ...f, title: n, slug: f.slug || (isEdit ? f.slug : slugify(n)) }));
            }}
            className="mt-1"
            placeholder="Job title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) || e.target.value }))}
            placeholder="url-friendly-slug (auto from title if empty)"
            className="mt-1"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          <p className="mt-1 text-xs text-[#999]">Leave empty to auto-generate from title.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="e.g. Engineering, Sales"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Riyadh, Remote"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <select
              id="employmentType"
              value={form.employmentType}
              onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value as EmploymentType }))}
              className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              value={form.experience}
              onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
              placeholder="e.g. 2-5 years"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={8}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Full job description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <Label htmlFor="requirements">Requirements (one per line)</Label>
          <textarea
            id="requirements"
            value={form.requirements}
            onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
            rows={6}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
          />
        </div>

        <div>
          <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
          <textarea
            id="responsibilities"
            value={form.responsibilities}
            onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))}
            rows={6}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Responsibility 1&#10;Responsibility 2&#10;Responsibility 3"
          />
        </div>

        <div>
          <Label>Status</Label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="isActive" className="text-sm text-[#666]">
              Active
            </label>
          </div>
        </div>

        <div className="border-t border-[#e5e5e5] pt-6">
          <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={form.seoTitle}
                onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                placeholder="SEO title (max 70 characters)"
                className="mt-1"
                maxLength={70}
              />
              <p className="mt-0.5 text-xs text-[#999]">{form.seoTitle.length}/70</p>
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <textarea
                id="seoDescription"
                value={form.seoDescription}
                onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                placeholder="SEO description (max 160 characters)"
                maxLength={160}
              />
              <p className="mt-0.5 text-xs text-[#999]">{form.seoDescription.length}/160</p>
            </div>

            <div>
              <Label htmlFor="seoKeywords">SEO Keywords</Label>
              <Input
                id="seoKeywords"
                value={form.seoKeywords}
                onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                placeholder="Comma-separated keywords (e.g. job, career, hiring)"
                className="mt-1"
              />
              <p className="mt-0.5 text-xs text-[#999]">Separate keywords with commas</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
