import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { productsApi } from '@/lib/api-client';
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

export const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [_uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    image: '',
    price: '' as string,
    isActive: true,
    showOnHome: true,
    order: '0' as string,
  });

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        // For edit, get by ID
        const res = await productsApi.getById(id!);
        if (cancelled) return;
        const product = res.data;
        const imageUrl = product.image || '';
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          image: imageUrl,
          price: product.price != null ? String(product.price) : '',
          isActive: product.isActive ?? true,
          showOnHome: product.showOnHome ?? true,
          order: product.order != null ? String(product.order) : '0',
        });
        setImageMode(imageUrl.startsWith('/uploads/products') ? 'upload' : 'url');
        setImagePreview(imageUrl ? getImageSrc(imageUrl) : '');
      } catch (e) {
        if (!cancelled) toast.error('Failed to load product');
        navigate('/products');
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
    if (!form.name.trim()) e.name = 'Name is required';
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
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        shortDescription: form.shortDescription.trim() || undefined,
        description: form.description.trim() || undefined,
        image: form.image.trim() || undefined,
        price: form.price.trim() ? Number(form.price) : null,
        isActive: form.isActive,
        showOnHome: form.showOnHome,
        order: Number(form.order) || 0,
      };
      if (isEdit) {
        await productsApi.update(id!, payload);
        toast.success('Product updated successfully');
      } else {
        await productsApi.create(payload);
        toast.success('Product created successfully');
      }
      navigate('/products');
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
      setForm((f) => ({ ...f, image: '' }));
    }
    setImagePreview('');
    setErrors((e) => ({ ...e, image: '' }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      setErrors((e) => ({ ...e, image: 'Only jpg, png, jpeg, and webp images are allowed' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: 'Image size must be less than 2MB' }));
      return;
    }

    setUploadedFile(file);
    setErrors((e) => ({ ...e, image: '' }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const res = await productsApi.uploadImage(file);
      setForm((f) => ({ ...f, image: res.url }));
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to upload image';
      setErrors((e) => ({ ...e, image: errorMsg }));
      toast.error(errorMsg);
      setImagePreview('');
      setUploadedFile(null);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageUrlChange = (url: string) => {
    setForm((f) => ({ ...f, image: url }));
    setErrors((e) => ({ ...e, image: '' }));
    if (url.trim()) {
      setImagePreview(getImageSrc(url));
    } else {
      setImagePreview('');
    }
  };

  const clearImage = () => {
    setForm((f) => ({ ...f, image: '' }));
    setImagePreview('');
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrors((e) => ({ ...e, image: '' }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#666]">Loading product...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mb-2 inline-flex items-center gap-1 text-sm text-[#666] hover:text-[#111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </button>
        <h2 className="text-xl font-bold text-[#111]">{isEdit ? 'Edit product' : 'Add product'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => {
              const n = e.target.value;
              setForm((f) => ({ ...f, name: n, slug: f.slug || (isEdit ? f.slug : slugify(n)) }));
            }}
            className="mt-1"
            placeholder="Product name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) || e.target.value }))}
            placeholder="url-friendly-slug (auto from name if empty)"
            className="mt-1"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          <p className="mt-1 text-xs text-[#999]">Leave empty to auto-generate from name.</p>
        </div>

        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <textarea
            id="shortDescription"
            value={form.shortDescription}
            onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Brief description (optional)"
            maxLength={500}
          />
          <p className="mt-0.5 text-xs text-[#999]">{form.shortDescription.length}/500</p>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={5}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            placeholder="Full product description (optional)"
            maxLength={5000}
          />
          <p className="mt-0.5 text-xs text-[#999]">{form.description.length}/5000</p>
        </div>

        <div>
          <Label>Image</Label>
          
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
                value={form.image}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="Paste image URL (e.g. https://... or /uploads/...)"
                className="mt-1"
                disabled={uploadingImage}
              />
              {errors.image && imageMode === 'url' && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
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
                onChange={handleFileSelect}
                className="hidden"
                id="product-image-upload"
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
                {form.image && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearImage}
                    disabled={uploadingImage}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="mt-1 text-xs text-[#999]">Max 2MB. Formats: JPG, PNG, WebP</p>
              {errors.image && imageMode === 'upload' && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
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
                onClick={clearImage}
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
            <Label htmlFor="price">Price (optional)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min="0"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              placeholder="0"
              className="mt-1"
            />
            <p className="mt-0.5 text-xs text-[#999]">Lower numbers appear first</p>
          </div>
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

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={saving || uploadingImage}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
