import { NextRequest, NextResponse } from 'next/server';
import { createClientForServer } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    console.log('API route hit for updating password');
    try {
        const { email, newPassword } = await req.json();
        console.log('Request Body:', { email, newPassword });
        
        if (!email || !newPassword) {
            console.log('Missing email or newPassword');
            return NextResponse.json({ error: 'Missing email or newPassword' }, { status: 400 });
        }

        const supabase = createClientForServer();
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.log('Supabase update password error:', error);
            return NextResponse.json({ error: error.message }, { status: error.status ?? 500 });
        }

        return NextResponse.json({ message: 'Password updated successfully', user: data }, { status: 200 });
    } catch (e: any) {
        console.log('Internal server error:', e);
        return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
    }
}
