export async function GET(request: Request) {
    return new Response(JSON.stringify({ Message: "Admin Dashboard is UP!" }), {
      status: 200,
    });
  }