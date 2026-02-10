'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function ProfileForm({ profile }: { profile: any }) {
    const [loading, setLoading] = useState(false);
    const { supabase } = useAuth();

    const [fullName, setFullName] = useState(profile?.full_name || '');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                // @ts-ignore
                .update({ full_name: fullName, updated_at: new Date().toISOString() })
                .eq('id', profile.id);

            if (error) throw error;
            toast.success('Profile updated');
        } catch (error: any) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input value={profile?.email} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                />
            </div>
            <Button disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
            </Button>
        </form>
    );
}
