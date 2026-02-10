import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// TEMP ROUTE FOR TESTING
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' });

    // Update profile to admin
    const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id);

    if (error) return NextResponse.json({ error: error.message });
    return NextResponse.json({ success: true, user: user.email, msg: 'You are now an admin' });
}
