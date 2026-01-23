import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { projectsApi, categoriesApi, Project, Category } from '@/lib/api-client';
import { getImageSrc } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from 'lucide-react';

const ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 50;

function toDateInput(v: string | null | undefined): string {
  if (!v) return '';
  const d = new Date(v);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function getCategoryId(c: Project['category']): string {
  if (!c) return '';
  return typeof c === 'string' ? c : (c as Category)._id || '';
}

export const ProjectFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    tagInput: '',
    category: '',
    projectUrl: '',
    startDate: '' as string,
    endDate: '' as string,
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await projectsApi.getById(id!);
        if (cancelled) return;
        const p: Project = res.data;
        setForm({
          title: p.title || '',
          description: p.description || '',
          tags: p.tags || [],
          tagInput: '',
          category: getCategoryId(p.category),
          projectUrl: p.projectUrl || '',
          startDate: toDateInput(p.startDate),
          endDate: toDateInput(p.endDate),
          images: p.images || [],
        });
      } catch (e) {
        if (!cancelled) toast.error('Failed to load project');
        navigate('/projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit, navigate]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
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
      // Get category ID from form state (category._id from dropdown)
      const category = form.category && form.category.trim() ? form.category.trim() : '';
      
      // Build FormData
      const formData = new FormData();
      
      // Append required fields
      formData.append('title', form.title.trim());
      
      // Append optional fields
      if (form.description.trim()) {
        formData.append('description', form.description.trim());
      }
      
      // Append arrays as JSON strings
      if (form.tags.length > 0) {
        formData.append('tags', JSON.stringify(form.tags));
      }
      
      if (form.images.length > 0) {
        formData.append('images', JSON.stringify(form.images));
      }
      
      // CRITICAL: Always append category (ObjectId string or empty string)
      // This MUST be included for backend to receive req.body.category
      formData.append('category', category);
      
      if (form.projectUrl.trim()) {
        formData.append('projectUrl', form.projectUrl.trim());
      }
      
      if (form.startDate) {
        formData.append('startDate', form.startDate);
      }
      
      if (form.endDate) {
        formData.append('endDate', form.endDate);
      }
      
      // Log to verify category is included
      console.log('[ProjectForm] FormData category:', category);
      console.log('[ProjectForm] FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      if (isEdit) {
        await projectsApi.update(id!, formData);
        toast.success('Project updated successfully');
      } else {
        await projectsApi.create(formData);
        toast.success('Project created successfully');
      }
      navigate('/projects');
    } catch (err: unknown) {
      const ax = err && typeof err === 'object' && 'response' in err ? (err as { response?: { data?: { message?: string; errors?: { message: string; field?: string }[] } } }).response?.data : undefined;
      const msg = ax?.message || ax?.errors?.[0]?.message || 'Request failed';
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const t = form.tagInput.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 50) {
      setForm((f) => ({ ...f, tags: [...f.tags, t], tagInput: '' }));
    }
  };

  const removeTag = (i: number) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }));
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error('Enter a category name');
      return;
    }
    setAddingCategory(true);
    try {
      const res = await categoriesApi.create({ name });
      await fetchCategories();
      setForm((f) => ({ ...f, category: res.data._id }));
      setNewCategoryName('');
      setAddCategoryOpen(false);
      toast.success('Category added');
    } catch (err: unknown) {
      const ax = err && typeof err === 'object' && 'response' in err ? (err as { response?: { data?: { message?: string } } }).response?.data : undefined;
      toast.error(ax?.message || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const filterFiles = (files: FileList | File[]): File[] => {
    const list = Array.from(files);
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return list.filter((f) => {
      if (!allowed.includes(f.type)) return false;
      if (f.size > MAX_SIZE) return false;
      return true;
    });
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const valid = filterFiles(files);
      const rejected = Array.from(files).length - valid.length;
      if (rejected > 0) toast.error(`Some files were skipped. Use jpg, png, jpeg or webp; max 5MB each.`);
      if (valid.length === 0) return;
      const space = MAX_IMAGES - form.images.length;
      const toUpload = valid.slice(0, space);
      if (toUpload.length < valid.length) toast.warning(`Only ${space} slot(s) left. Max ${MAX_IMAGES} images.`);
      if (toUpload.length === 0) return;
      setUploading(true);
      try {
        const res = await projectsApi.uploadImages(toUpload);
        setForm((f) => ({ ...f, images: [...f.images, ...res.data.paths] }));
        toast.success(`Uploaded ${res.data.paths.length} image(s)`);
      } catch {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [form.images.length]
  );

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (f?.length) handleFiles(f);
    e.target.value = '';
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (uploading || !e.dataTransfer.files?.length) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, uploading]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (i: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#999]" />
        <p className="text-[#666]">Loading project...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="mb-2 inline-flex items-center gap-1 text-sm text-[#666] hover:text-[#111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </button>
        <h2 className="text-xl font-bold text-[#111]">{isEdit ? 'Edit project' : 'Add project'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-1"
            placeholder="Project title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="desc">Description</Label>
          <textarea
            id="desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Project description"
          />
        </div>

        <div>
          <Label>Category</Label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="h-10 min-w-[180px] rounded-md border border-input bg-white px-3 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" onClick={() => setAddCategoryOpen(true)}>
              + Add Category
            </Button>
            {addCategoryOpen && (
              <div className="flex gap-2 items-center">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  placeholder="New category name"
                  className="h-10 w-48"
                  autoFocus
                />
                <Button type="button" onClick={handleAddCategory} disabled={addingCategory}>
                  {addingCategory ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setAddCategoryOpen(false); setNewCategoryName(''); }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {categoriesLoading && <p className="mt-1 text-xs text-[#999]">Loading categories…</p>}
        </div>

        <div>
          <Label>Tags</Label>
          <div className="mt-1 flex flex-wrap gap-2">
            {form.tags.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-[#e5e5e5] px-2.5 py-0.5 text-sm"
              >
                {t}
                <button type="button" onClick={() => removeTag(i)} className="text-[#666] hover:text-red-600">×</button>
              </span>
            ))}
            {form.tags.length < 50 && (
              <div className="flex gap-1">
                <Input
                  value={form.tagInput}
                  onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag"
                  className="h-8 w-32"
                />
                <Button type="button" variant="outline" className="h-8 px-2" onClick={addTag}>
                  <Plus className="h-3.5 w-3" />
                </Button>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-[#999]">Press Enter or click + to add. Max 50 tags.</p>
        </div>

        <div>
          <Label>Upload Images</Label>
          <p className="mt-0.5 text-xs text-[#999]">JPG, PNG, JPEG, WebP. Max 5MB per image. Max 50 images.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            onChange={onFileInputChange}
          />
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !uploading && form.images.length < MAX_IMAGES && fileInputRef.current?.click()}
            className={`mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors ${
              dragOver ? 'border-[#111] bg-[#f5f5f5]' : 'border-[#e5e5e5] bg-[#fafafa] hover:border-[#ccc] hover:bg-[#f5f5f5]'
            } ${uploading || form.images.length >= MAX_IMAGES ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
          >
            {uploading ? (
              <Loader2 className="h-10 w-10 animate-spin text-[#999]" />
            ) : (
              <Upload className="h-10 w-10 text-[#999]" />
            )}
            <p className="mt-2 text-sm text-[#666]">
              {uploading ? 'Uploading…' : form.images.length >= MAX_IMAGES ? 'Maximum images reached' : 'Drag & drop or click to upload'}
            </p>
          </div>
          {form.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.images.map((path, i) => (
                <div key={i} className="relative group">
                  <img src={getImageSrc(path)} alt="" className="h-20 w-20 rounded object-cover border border-[#e5e5e5]" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="projectUrl">Project URL</Label>
          <Input
            id="projectUrl"
            type="url"
            value={form.projectUrl}
            onChange={(e) => setForm((f) => ({ ...f, projectUrl: e.target.value }))}
            className="mt-1"
            placeholder="https://..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="startDate">Start date</Label>
            <Input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="endDate">End date</Label>
            <Input
              id="endDate"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Update project' : 'Create project'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
