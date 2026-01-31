'use client';

import * as React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FiltersPanel } from './filters-panel';
import type { Category } from '@/types/product';

interface MobileFiltersDrawerProps {
    categories: Category[];
}

export function MobileFiltersDrawer({ categories }: MobileFiltersDrawerProps) {
    const [open, setOpen] = React.useState(false);

    // Close drawer when URL changes (implies navigation/filter applied)
    // We could check searchParams, but simplest is just auto-close on navigate?
    // Actually, users might want to apply multiple filters. 
    // Let's keep it manual close or close on "Show Results" if we had one.
    // For now, standard Sheet behavior (backdrop click / close button) is fine.

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                    <FiltersPanel categories={categories} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
