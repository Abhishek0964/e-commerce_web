import { createClient } from '@/lib/supabase/server';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Note: using formatDate from utils if exists, else inline. Assuming standard utils.

export async function ProductList() {
    const supabase = await createClient();
    const { data: products } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name),
            inventory(quantity)
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products?.map((product: any) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                                    {(product.images && Array.isArray(product.images) && product.images[0]) ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                                            No Img
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                            <TableCell>₹{product.price}</TableCell>
                            <TableCell>{product.inventory?.quantity || 0}</TableCell>
                            <TableCell>
                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                    {product.is_active ? 'Active' : 'Draft'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!products?.length && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                No products found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
