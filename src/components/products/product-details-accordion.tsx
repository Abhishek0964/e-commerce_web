'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { DURATION, EASING } from '@/lib/animations';

interface AccordionSection {
    id: string;
    title: string;
    content: string | React.ReactNode;
    defaultOpen?: boolean;
}

interface ProductDetailsAccordionProps {
    description?: string;
}

export function ProductDetailsAccordion({ description }: ProductDetailsAccordionProps) {
    const sections: AccordionSection[] = [
        {
            id: 'description',
            title: 'Description',
            content: description || 'No description available.',
            defaultOpen: true,
        },
        {
            id: 'shipping',
            title: 'Shipping & Returns',
            content: (
                <div className="space-y-2">
                    <p>Free shipping on orders over ₹999.</p>
                    <p>Standard delivery: 5-7 business days.</p>
                    <p>Express delivery: 2-3 business days (additional charges apply).</p>
                    <p className="mt-4 font-semibold">Returns:</p>
                    <p>30-day return policy. Items must be unused and in original packaging.</p>
                </div>
            ),
        },
        {
            id: 'care',
            title: 'Care Instructions',
            content: (
                <div className="space-y-2">
                    <p>Please refer to the product label for specific care instructions.</p>
                    <p>Store in a cool, dry place away from direct sunlight.</p>
                </div>
            ),
        },
    ];

    const [openSections, setOpenSections] = useState<Set<string>>(
        new Set(sections.filter(s => s.defaultOpen).map(s => s.id))
    );

    const toggleSection = (id: string) => {
        setOpenSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="space-y-2 border-t pt-6">
            {sections.map(section => {
                const isOpen = openSections.has(section.id);
                return (
                    <div key={section.id} className="border-b">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            aria-expanded={isOpen}
                            aria-controls={`accordion-content-${section.id}`}
                            style={{ minHeight: '44px' }}
                        >
                            <span className="text-lg font-semibold">{section.title}</span>
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: DURATION.fast }}
                            >
                                <ChevronDown className="h-5 w-5" aria-hidden="true" />
                            </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    id={`accordion-content-${section.id}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        height: { duration: DURATION.normal, ease: EASING.easeInOut },
                                        opacity: { duration: DURATION.fast },
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="prose prose-sm max-w-none pb-4 text-muted-foreground">
                                        {section.content}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
