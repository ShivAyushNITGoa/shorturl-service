// ===== MAIL1S.NET PROXY API ROUTE =====
// Server-side proxy to avoid CORS issues

const API_KEY = '33c9b99b-26d6-4127-9e50-83940f7c7876';
const API_BASE_URL = 'https://mail1s.net/api';

export async function POST(request: Request) {
  try {
    const { endpoint, method = 'POST', body } = await request.json();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      return Response.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Mail1s API Proxy Error:', error);
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return Response.json(
        { error: 'Missing endpoint parameter' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return Response.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Mail1s API Proxy Error:', error);
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
