import { NextRequest, NextResponse } from 'next/server';
import { createClientForServer } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    console.log('API route hit');
    try {
        const { email, password, name, confirmPassword } = await req.json();
        console.log('Request Body:', { email, password, name, confirmPassword });

        const mode = req.nextUrl.searchParams.get('mode');
        console.log('Mode:', mode);

        const supabase = createClientForServer();

        if (mode === 'signup') {
            if (!email || !password || !name || !confirmPassword) {
                console.log('Missing fields for signup');
                return NextResponse.json({ error: 'Missing fields for signup' }, { status: 400 });
            }

            if (password !== confirmPassword) {
                console.log('Passwords do not match');
                return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    }
                }
            });

            if (error) {
                console.log('Supabase signup error:', error);
                return NextResponse.json({ error: error.message }, { status: error.status || 500 });
            }

            return NextResponse.json({ message: 'User signed up successfully', user: data }, { status: 200 });
        } else if (mode === 'signin') {
            if (!email || !password) {
                console.log('Missing email or password for signin');
                return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.log('Supabase signin error:', error);
                return NextResponse.json({ error: error.message }, { status: error.status || 500 });
            }

            return NextResponse.json({ message: 'User signed in successfully', user: data }, { status: 200 });
        } else if (mode === 'reset-password') {
            if (!email) {
                console.log('Missing email for reset-password');
                return NextResponse.json({ error: 'Missing email' }, { status: 400 });
            }

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `http://localhost:3000/update-password?email=${email}`,
            });

            if (error) {
                console.log('Supabase reset password error:', error);
                return NextResponse.json({ error: error.message }, { status: error.status || 500 });
            }

            return NextResponse.json({ message: 'Password reset email sent successfully', user: data }, { status: 200 });
        } else {
            console.log('Invalid mode');
            return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
        }

    } catch (e: any) {
        console.log('Internal server error:', e);
        return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
    }
}
