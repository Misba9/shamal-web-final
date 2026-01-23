import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { blogsApi, Blog, BlogStatus } from '@/lib/api-client';
import { getImageSrc } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ArrowLeft, Plus } from 'lucide-react';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toDateInput(v: string | null | undefined): string {
  if (!v) return '';
  const d = new Date(v);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16);
}

export const BlogFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugCheck, setSlugCheck] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    featuredImage: '',
    status: 'draft' as BlogStatus,
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
    keywordInput: '',
    publishedAt: '' as string,
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await blogsApi.getById(id!);
        if (cancelled) return;
        const b: Blog = res.data;
        setForm({
          title: b.title || '',
          slug: b.slug || '',
          content: b.content || '',
          featuredImage: b.featuredImage || b.thumbnail || '',
          status: (b.status as BlogStatus) || 'draft',
          metaTitle: b.metaTitle || '',
          metaDescription: b.metaDescription || '',
          keywords: b.keywords || [],
          keywordInput: '',
          publishedAt: toDateInput(b.publishedAt),
        });
      } catch (e) {
        if (!cancelled) toast.error('Failed to load blog');
        navigate('/blogs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit, navigate]);

  const isContentEmpty = (html: string) =>
    !html || !html.replace(/<[^>]*>/g, '').trim();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (isContentEmpty(form.content)) e.content = 'Content is required';
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
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        content: (form.content || '').trim(),
        featuredImage: form.featuredImage.trim() || undefined,
        thumbnail: form.featuredImage.trim() || undefined,
        status: form.status,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        keywords: form.keywords,
      };
      if (form.publishedAt) {
        payload.publishedAt = new Date(form.publishedAt).toISOString();
      } else if (form.status === 'draft') {
        payload.publishedAt = null;
      }
      // When status is 'published' and no date, omit publishedAt so backend sets it to now.
      if (isEdit) {
        await blogsApi.update(id!, payload);
        toast.success('Blog updated successfully');
      } else {
        await blogsApi.create(payload);
        toast.success('Blog created successfully');
      }
      navigate('/blogs');
    } catch (err: unknown) {
      const ax = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string; field?: string; errors?: { message: string }[] } } }).response?.data
        : undefined;
      const msg = ax?.message || ax?.errors?.[0]?.message || 'Request failed';
      toast.error(String(msg));
      if (ax?.field === 'slug') setErrors((e) => ({ ...e, slug: String(msg) }));
    } finally {
      setSaving(false);
    }
  };

  const checkSlugAvailability = async () => {
    const s = form.slug.trim().toLowerCase();
    if (!s) {
      setErrors((e) => ({ ...e, slug: 'Enter a slug to check' }));
      return;
    }
    setSlugCheck('checking');
    setErrors((e) => ({ ...e, slug: '' }));
    try {
      const res = await blogsApi.checkSlug(s, isEdit ? id : undefined);
      setSlugCheck(res.available ? 'available' : 'taken');
      if (!res.available) setErrors((e) => ({ ...e, slug: 'This slug is already in use' }));
    } catch {
      setSlugCheck('idle');
      toast.error('Could not check slug');
    }
  };

  const addKeyword = () => {
    const k = form.keywordInput.trim();
    if (k && !form.keywords.includes(k) && form.keywords.length < 20) {
      setForm((f) => ({ ...f, keywords: [...f.keywords, k], keywordInput: '' }));
    }
  };

  const removeKeyword = (i: number) => {
    setForm((f) => ({ ...f, keywords: f.keywords.filter((_, j) => j !== i) }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#666]">Loading blog...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/blogs')}
          className="mb-2 inline-flex items-center gap-1 text-sm text-[#666] hover:text-[#111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </button>
        <h2 className="text-xl font-bold text-[#111]">{isEdit ? 'Edit blog' : 'Add blog'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => {
              const t = e.target.value;
              setForm((f) => ({ ...f, title: t, slug: f.slug || (isEdit ? f.slug : slugify(t)) }));
            }}
            className="mt-1"
            placeholder="Post title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setForm((f) => ({ ...f, slug: slugify(e.target.value) || e.target.value }));
                setSlugCheck('idle');
              }}
              placeholder="url-friendly-slug (auto from title if empty)"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={checkSlugAvailability} disabled={slugCheck === 'checking'}>
              {slugCheck === 'checking' ? '…' : 'Check'}
            </Button>
          </div>
          {slugCheck === 'available' && <p className="mt-1 text-sm text-green-600">Slug is available</p>}
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          <p className="mt-1 text-xs text-[#999]">Leave empty to auto-generate from title.</p>
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <div className="mt-1">
            <RichTextEditor
              id="content"
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              minHeight="320px"
            />
          </div>
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        <div>
          <Label>Featured image (URL)</Label>
          <Input
            value={form.featuredImage}
            onChange={(e) => setForm((f) => ({ ...f, featuredImage: e.target.value }))}
            placeholder="Paste image URL (e.g. https://...)"
            className="mt-1"
          />
          {form.featuredImage && (
            <img src={getImageSrc(form.featuredImage)} alt="" className="mt-2 h-24 w-24 rounded object-cover" />
          )}
        </div>

        <div className="rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-4">
          <h3 className="mb-3 text-sm font-medium text-[#111]">SEO (optional)</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                className="mt-1"
                placeholder="&lt; 70 chars"
              />
              <p className="mt-0.5 text-xs text-[#999]">{form.metaTitle.length}/70</p>
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description</Label>
              <textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                placeholder="&lt; 160 chars"
              />
              <p className="mt-0.5 text-xs text-[#999]">{form.metaDescription.length}/160</p>
            </div>
            <div>
              <Label>Keywords</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {form.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-[#e5e5e5] px-2.5 py-0.5 text-sm"
                  >
                    {k}
                    <button type="button" onClick={() => removeKeyword(i)} className="text-[#666] hover:text-red-600">×</button>
                  </span>
                ))}
                {form.keywords.length < 20 && (
                  <div className="flex gap-1">
                    <Input
                      value={form.keywordInput}
                      onChange={(e) => setForm((f) => ({ ...f, keywordInput: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      placeholder="Add keyword"
                      className="h-8 w-28"
                    />
                    <Button type="button" variant="outline" className="h-8 px-2" onClick={addKeyword}>
                      <Plus className="h-3.5 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as BlogStatus }))}
              className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <Label htmlFor="publishedAt">Schedule publish (optional)</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
              className="mt-1"
            />
            <p className="mt-0.5 text-xs text-[#999]">For published posts, set when it goes live.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/blogs')}>
            Cancel
          </Button>
        </div>
      </form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <h1 className="text-xl font-bold">{form.title || 'Untitled'}</h1>
            {form.featuredImage && (
              <img src={getImageSrc(form.featuredImage)} alt="" className="rounded-lg" />
            )}
            <div
              className="mt-4 text-[#333]"
              dangerouslySetInnerHTML={{ __html: form.content || '<p><em>No content yet.</em></p>' }}
            />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
