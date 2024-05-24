import { createClientForServer } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const { email, password, name, confirmPassword } = await req.json(); // Parse values from the JSON body
        const url = new URL(req.url);
        const mode = url.searchParams.get('mode'); // Retrieve the mode from the search params

        if (!email || !password) {
            return new Response('Missing email or password', { status: 400 });
        }

        const supabase = createClientForServer();

        if (mode === 'signup') {
            if (!name || !confirmPassword) {
                return new Response('Missing name or confirmPassword', { status: 400 });
            }

            if (password !== confirmPassword) {
                return new Response('Passwords do not match', { status: 400 });
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    }
                }
            });

            if (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: error.status,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            return new Response(JSON.stringify({ message: 'User signed up successfully', user: data }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } else if (mode === 'signin') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: error.status,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            return new Response(JSON.stringify({ message: 'User signed in successfully', user: data }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } else {
            return new Response('Invalid mode', { status: 400 });
        }

    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Internal server error', details: e.toString() }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
