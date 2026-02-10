'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
    totalPages: number;
    className?: string;
}

export function Pagination({ totalPages, className }: PaginationProps) {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams?.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('page', pageNumber.toString());
        return `/products?${params.toString()}`;
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Complex pagination logic with ellipsis
            if (currentPage <= 3) {
                // Near start: 1, 2, 3, 4, ..., 10
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near end: 1, ..., 7, 8, 9, 10
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Middle: 1, ..., 4, 5, 6, ..., 10
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages.map((page, index) => {
            if (page === '...') {
                return (
                    <div key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                );
            }

            const isCurrent = page === currentPage;
            return (
                <Button
                    key={page}
                    variant={isCurrent ? "default" : "outline"}
                    size="icon"
                    asChild
                    className={cn(isCurrent && "pointer-events-none")}
                    aria-current={isCurrent ? "page" : undefined}
                >
                    <Link href={createPageURL(page)}>
                        {page}
                    </Link>
                </Button>
            );
        });
    };

    if (totalPages <= 1) return null;

    return (
        <nav
            role="navigation"
            aria-label="Pagination Navigation"
            className={cn("flex items-center justify-center gap-2", className)}
        >
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageURL(currentPage - 1)} aria-label="Previous page">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span aria-hidden="true">
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}
            </Button>

            {renderPageNumbers()}

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageURL(currentPage + 1)} aria-label="Next page">
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span aria-hidden="true">
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </Button>
        </nav>
    );
}
