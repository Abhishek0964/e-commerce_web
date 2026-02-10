
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile/profile-form';

export const metadata: Metadata = {
    title: 'Profile | ShopHub',
    description: 'Manage your account',
};

export default async function ProfilePage() {
    const supabase = await createClient(); // Await the promise

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <ProfileForm profile={profile} />
            </div>
        </div>
    );
}
