'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProfileForm } from '@/components/profile/profile-form';
import { AddressList } from '@/components/profile/address-list';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';
import { cn } from '@/lib/utils';
import { User, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(data);
            setLoading(false);
        };

        fetchProfile();
    }, [supabase, router]);

    if (loading) {
        return <div className="container py-10">Loading...</div>;
    }

    return (
        <div className="container py-8 md:py-12">
            <ScrollFrameAnimation>
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="flex flex-row md:flex-col gap-2 p-1 bg-muted rounded-lg md:bg-transparent md:p-0">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={cn(
                                    "flex-1 md:flex-none flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                                    activeTab === 'profile'
                                        ? "bg-background text-foreground shadow-sm md:bg-accent md:text-accent-foreground"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <User className="h-4 w-4" />
                                Profile Details
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={cn(
                                    "flex-1 md:flex-none flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                                    activeTab === 'addresses'
                                        ? "bg-background text-foreground shadow-sm md:bg-accent md:text-accent-foreground"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <MapPin className="h-4 w-4" />
                                Addresses
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Update your personal details.</p>
                                    <ProfileForm profile={profile} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <AddressList />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollFrameAnimation>
        </div>
    );
}
