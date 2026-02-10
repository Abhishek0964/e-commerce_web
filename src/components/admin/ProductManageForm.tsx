'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Upload } from 'lucide-react';

const productFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/),
    description: z.string().min(10).max(5000),
    price: z.number().positive(),
    compare_price: z.number().positive().optional(),
    stock: z.number().int().min(0),
    category_id: z.string().uuid(),
    sku: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductManageFormProps {
    productId?: string;
    initialData?: Partial<ProductFormData>;
    onSuccess?: () => void;
}

export function ProductManageForm({ productId, initialData, onSuccess }: ProductManageFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.image_url ? [initialData.image_url] : []);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);

        try {
            const endpoint = productId
                ? `/api/admin/products/${productId}`
                : '/api/admin/products';

            const method = productId ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, tags }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save product');
            }

            const result = await response.json();

            // Upload images if any
            if (imageUrls.length > 0 && result.data.id) {
                for (const [index, url] of imageUrls.entries()) {
                    await fetch(`/api/admin/products/${result.data.id}/images`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image_url: url,
                            display_order: index,
                        }),
                    });
                }
            }

            toast({
                title: productId ? 'Product updated' : 'Product created',
                description: 'Your changes have been saved successfully',
            });

            onSuccess?.();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            const newTags = [...tags, tagInput];
            setTags(newTags);
            setValue('tags', newTags);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        const newTags = tags.filter(t => t !== tag);
        setTags(newTags);
        setValue('tags', newTags);
    };

    const addImageUrl = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            setImageUrls([...imageUrls, url]);
        }
    };

    const removeImageUrl = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" {...register('name')} placeholder="e.g. Premium Laptop" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" {...register('slug')} placeholder="e.g. premium-laptop" />
                    {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Detailed product description..."
                    rows={4}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register('price', { valueAsNumber: true })}
                        placeholder="0.00"
                    />
                    {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="compare_price">Compare Price</Label>
                    <Input
                        id="compare_price"
                        type="number"
                        step="0.01"
                        {...register('compare_price', { valueAsNumber: true })}
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                        id="stock"
                        type="number"
                        {...register('stock', { valueAsNumber: true })}
                        placeholder="0"
                    />
                    {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category_id">Category ID *</Label>
                    <Input id="category_id" {...register('category_id')} placeholder="UUID" />
                    {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" {...register('sku')} placeholder="e.g. LAP-001" />
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                    />
                    <Button type="button" onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-secondary rounded"
                        >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Image URLs */}
            <div className="space-y-2">
                <Label>Product Images</Label>
                <Button type="button" onClick={addImageUrl} variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Add Image URL
                </Button>
                <div className="grid grid-cols-4 gap-4 mt-2">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                            <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                            <button
                                type="button"
                                onClick={() => removeImageUrl(index)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {productId ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
