import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { servicesApi, Service } from '@/lib/api-client';
import { getImageSrc } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, X } from 'lucide-react';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const ServiceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [iconMode, setIconMode] = useState<'url' | 'upload'>('url');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [iconPreview, setIconPreview] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedIconFile, setUploadedIconFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    icon: '',
    featuredImage: '',
    isActive: true,
    showOnHome: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await servicesApi.getById(id!);
        if (cancelled) return;
        const service = res.data;
        setForm({
          title: service.title || '',
          slug: service.slug || '',
          shortDescription: service.shortDescription || '',
          description: service.description || '',
          icon: service.icon || '',
          featuredImage: service.featuredImage || '',
          isActive: service.isActive ?? true,
          showOnHome: service.showOnHome ?? true,
          seoTitle: service.seoTitle || '',
          seoDescription: service.seoDescription || '',
          seoKeywords: (service.seoKeywords || []).join(', '),
        });
        setImageMode(service.featuredImage?.startsWith('/uploads/services') ? 'upload' : 'url');
        setIconMode(service.icon?.startsWith('/uploads/services') ? 'upload' : 'url');
        setImagePreview(service.featuredImage ? getImageSrc(service.featuredImage) : '');
        setIconPreview(service.icon ? getImageSrc(service.icon) : '');
      } catch (e) {
        if (!cancelled) toast.error('Failed to load service');
        navigate('/services');
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
    if (!form.shortDescription.trim()) e.shortDescription = 'Short description is required';
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
      const keywords = form.seoKeywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        icon: form.icon.trim() || undefined,
        featuredImage: form.featuredImage.trim() || undefined,
        isActive: form.isActive,
        showOnHome: form.showOnHome,
        seoTitle: form.seoTitle.trim() || undefined,
        seoDescription: form.seoDescription.trim() || undefined,
        seoKeywords: keywords.length > 0 ? keywords : undefined,
      };
      if (isEdit) {
        await servicesApi.update(id!, payload);
        toast.success('Service updated successfully');
      } else {
        await servicesApi.create(payload);
        toast.success('Service created successfully');
      }
      navigate('/services');
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

  const handleImageModeChange = (mode: 'url' | 'upload') => {
    setImageMode(mode);
    if (mode === 'url') {
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setForm((f) => ({ ...f, featuredImage: '' }));
    }
    setImagePreview('');
    setErrors((e) => ({ ...e, featuredImage: '' }));
  };

  const handleIconModeChange = (mode: 'url' | 'upload') => {
    setIconMode(mode);
    if (mode === 'url') {
      setUploadedIconFile(null);
      if (iconFileInputRef.current) iconFileInputRef.current.value = '';
    } else {
      setForm((f) => ({ ...f, icon: '' }));
    }
    setIconPreview('');
    setErrors((e) => ({ ...e, icon: '' }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'icon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      setErrors((e) => ({ ...e, [type === 'image' ? 'featuredImage' : 'icon']: 'Only jpg, png, jpeg, and webp images are allowed' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, [type === 'image' ? 'featuredImage' : 'icon']: 'Image size must be less than 2MB' }));
      return;
    }

    if (type === 'image') {
      setUploadedFile(file);
    } else {
      setUploadedIconFile(file);
    }
    setErrors((e) => ({ ...e, [type === 'image' ? 'featuredImage' : 'icon']: '' }));

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'image') {
        setImagePreview(e.target?.result as string);
      } else {
        setIconPreview(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);

    if (type === 'image') {
      setUploadingImage(true);
    } else {
      setUploadingIcon(true);
    }
    try {
      const res = await servicesApi.uploadImage(file);
      if (type === 'image') {
        setForm((f) => ({ ...f, featuredImage: res.url }));
      } else {
        setForm((f) => ({ ...f, icon: res.url }));
      }
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to upload image';
      setErrors((e) => ({ ...e, [type === 'image' ? 'featuredImage' : 'icon']: errorMsg }));
      toast.error(errorMsg);
      if (type === 'image') {
        setImagePreview('');
        setUploadedFile(null);
      } else {
        setIconPreview('');
        setUploadedIconFile(null);
      }
    } finally {
      if (type === 'image') {
        setUploadingImage(false);
      } else {
        setUploadingIcon(false);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (iconFileInputRef.current) iconFileInputRef.current.value = '';
    }
  };

  const handleImageUrlChange = (url: string, type: 'image' | 'icon') => {
    if (type === 'image') {
      setForm((f) => ({ ...f, featuredImage: url }));
      if (url.trim()) {
        setImagePreview(getImageSrc(url));
      } else {
        setImagePreview('');
      }
    } else {
      setForm((f) => ({ ...f, icon: url }));
      if (url.trim()) {
        setIconPreview(getImageSrc(url));
      } else {
        setIconPreview('');
      }
    }
    setErrors((e) => ({ ...e, [type === 'image' ? 'featuredImage' : 'icon']: '' }));
  };

  const clearImage = (type: 'image' | 'icon') => {
    if (type === 'image') {
      setForm((f) => ({ ...f, featuredImage: '' }));
      setImagePreview('');
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setForm((f) => ({ ...f, icon: '' }));
      setIconPreview('');
      setUploadedIconFile(null);
      if (iconFileInputRef.current) iconFileInputRef.current.value = '';
    }
    setErrors((e) => ({ ...e, [type === 'image' ? 'featuredImage' : 'icon']: '' }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#666]">Loading service...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/services')}
          className="mb-2 inline-flex items-center gap-1 text-sm text-[#666] hover:text-[#111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </button>
        <h2 className="text-xl font-bold text-[#111]">{isEdit ? 'Edit service' : 'Add service'}</h2>
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
            placeholder="Service title"
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

        <div>
          <Label htmlFor="shortDescription">Short Description *</Label>
          <textarea
            id="shortDescription"
            value={form.shortDescription}
            onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Brief description for home page card"
            maxLength={500}
          />
          <p className="mt-0.5 text-xs text-[#999]">{form.shortDescription.length}/500</p>
          {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={8}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Full service description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <Label>Icon (Optional)</Label>
          
          {/* Mode Toggle */}
          <div className="mt-1 mb-3 flex gap-2 border-b border-[#e5e5e5]">
            <button
              type="button"
              onClick={() => handleIconModeChange('url')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                iconMode === 'url'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-[#666] hover:text-[#111]'
              }`}
            >
              Icon URL
            </button>
            <button
              type="button"
              onClick={() => handleIconModeChange('upload')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                iconMode === 'upload'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-[#666] hover:text-[#111]'
              }`}
            >
              Upload Icon
            </button>
          </div>

          {/* URL Mode */}
          {iconMode === 'url' && (
            <div>
              <Input
                value={form.icon}
                onChange={(e) => handleImageUrlChange(e.target.value, 'icon')}
                placeholder="Paste icon URL (e.g. https://... or /uploads/...)"
                className="mt-1"
                disabled={uploadingIcon}
              />
              {errors.icon && iconMode === 'url' && (
                <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
              )}
            </div>
          )}

          {/* Upload Mode */}
          {iconMode === 'upload' && (
            <div>
              <input
                ref={iconFileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileSelect(e, 'icon')}
                className="hidden"
                id="service-icon-upload"
                disabled={uploadingIcon}
              />
              <div className="mt-1 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => iconFileInputRef.current?.click()}
                  disabled={uploadingIcon}
                  className="inline-flex items-center gap-2"
                >
                  {uploadingIcon ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Choose Icon'
                  )}
                </Button>
                {form.icon && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => clearImage('icon')}
                    disabled={uploadingIcon}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="mt-1 text-xs text-[#999]">Max 2MB. Formats: JPG, PNG, WebP</p>
              {errors.icon && iconMode === 'upload' && (
                <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
              )}
            </div>
          )}

          {/* Icon Preview */}
          {iconPreview && (
            <div className="mt-4 relative inline-block">
              <img
                src={iconPreview}
                alt="Preview"
                className="h-24 w-24 rounded border border-[#e5e5e5] object-cover"
              />
              <button
                type="button"
                onClick={() => clearImage('icon')}
                className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white p-1 hover:bg-red-700"
                title="Remove icon"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        <div>
          <Label>Featured Image (Optional)</Label>
          
          {/* Mode Toggle */}
          <div className="mt-1 mb-3 flex gap-2 border-b border-[#e5e5e5]">
            <button
              type="button"
              onClick={() => handleImageModeChange('url')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                imageMode === 'url'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-[#666] hover:text-[#111]'
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => handleImageModeChange('upload')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                imageMode === 'upload'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-[#666] hover:text-[#111]'
              }`}
            >
              Upload Image
            </button>
          </div>

          {/* URL Mode */}
          {imageMode === 'url' && (
            <div>
              <Input
                value={form.featuredImage}
                onChange={(e) => handleImageUrlChange(e.target.value, 'image')}
                placeholder="Paste image URL (e.g. https://... or /uploads/...)"
                className="mt-1"
                disabled={uploadingImage}
              />
              {errors.featuredImage && imageMode === 'url' && (
                <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
              )}
            </div>
          )}

          {/* Upload Mode */}
          {imageMode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileSelect(e, 'image')}
                className="hidden"
                id="service-image-upload"
                disabled={uploadingImage}
              />
              <div className="mt-1 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="inline-flex items-center gap-2"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Choose Image'
                  )}
                </Button>
                {form.featuredImage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => clearImage('image')}
                    disabled={uploadingImage}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="mt-1 text-xs text-[#999]">Max 2MB. Formats: JPG, PNG, WebP</p>
              {errors.featuredImage && imageMode === 'upload' && (
                <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
              )}
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-48 w-auto rounded border border-[#e5e5e5] object-cover"
              />
              <button
                type="button"
                onClick={() => clearImage('image')}
                className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white p-1 hover:bg-red-700"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          <div>
            <Label>Display</Label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="showOnHome"
                checked={form.showOnHome}
                onChange={(e) => setForm((f) => ({ ...f, showOnHome: e.target.checked }))}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="showOnHome" className="text-sm text-[#666]">
                Show on Home
              </label>
            </div>
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
                placeholder="Comma-separated keywords (e.g. drone, survey, mapping)"
                className="mt-1"
              />
              <p className="mt-0.5 text-xs text-[#999]">Separate keywords with commas</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={saving || uploadingImage || uploadingIcon}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/services')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
