import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
// const API_BASE_URL = process.env.BACKEND_URL;


export async function GET(request) {
  return handleRequest(request, "GET");
}

export async function POST(request) {
  return handleRequest(request, "POST");
}

export async function PUT(request) {
  return handleRequest(request, "PUT");
}

export async function DELETE(request) {
  return handleRequest(request, "DELETE");
}

async function handleRequest(request, method) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace("/api", "");
  const endpoint = pathname.startsWith("/") ? pathname.substring(1) : pathname;

  const apiUrl = `${API_BASE_URL}/${endpoint}${url.search}`;

  const headers = {};

  const token = request.headers.get("Authorization");
  if (token) {
    headers["Authorization"] = token;
  }

  let body = null;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.json().catch(() => null);
    headers["Content-Type"] = "application/x-www-form-urlencoded"
  } else {
    headers["Content-Type"] = "application/json"
  }

  try {
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    return NextResponse.json(
      { error: `Failed to fetch data from API: ${error.message}` },
      { status: 500 }
    );
  }
  
}

// export async function GET(request, { params }) {
//   const path = params.path || [];
//   const pathString = Array.isArray(path) ? path.join('/') : path;
//   const searchParams = request.nextUrl.searchParams.toString();
//   const queryString = searchParams ? `?${searchParams}` : '';
  
//   try {
//     // Use the Docker service name to communicate between containers
//     const response = await fetch(`http://terapeut-backend:8000/${pathString}${queryString}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (!response.ok) {
//       console.error(`Backend error ${response.status}: ${response.statusText}`);
//       return Response.json(
//         { error: `Backend returned status ${response.status}` },
//         { status: response.status }
//       );
//     }
    
//     const data = await response.json();
//     return Response.json(data);
//   } catch (error) {
//     console.error('API proxy error:', error);
//     return Response.json(
//       { error: 'Failed to fetch data from backend' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request, { params }) {
//   const path = params.path || [];
//   const pathString = Array.isArray(path) ? path.join('/') : path;
  
//   try {
//     const body = await request.json();
    
//     const response = await fetch(`http://terapeut-backend:8000/${pathString}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });
    
//     if (!response.ok) {
//       return Response.json(
//         { error: `Backend returned status ${response.status}` },
//         { status: response.status }
//       );
//     }
    
//     const data = await response.json();
//     return Response.json(data);
//   } catch (error) {
//     console.error('API proxy error:', error);
//     return Response.json(
//       { error: 'Failed to fetch data from backend' },
//       { status: 500 }
//     );
//   }
// }

// // Implement PUT method
// export async function PUT(request, { params }) {
//   const path = params.path || [];
//   const pathString = Array.isArray(path) ? path.join('/') : path;
  
//   try {
//     const body = await request.json();
    
//     const response = await fetch(`http://terapeut-backend:8000/${pathString}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });
    
//     if (!response.ok) {
//       return Response.json(
//         { error: `Backend returned status ${response.status}` },
//         { status: response.status }
//       );
//     }
    
//     const data = await response.json();
//     return Response.json(data);
//   } catch (error) {
//     console.error('API proxy error:', error);
//     return Response.json(
//       { error: 'Failed to fetch data from backend' },
//       { status: 500 }
//     );
//   }
// }

// // Implement DELETE method
// export async function DELETE(request, { params }) {
//   const path = params.path || [];
//   const pathString = Array.isArray(path) ? path.join('/') : path;
  
//   try {
//     const response = await fetch(`http://terapeut-backend:8000/${pathString}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (!response.ok) {
//       return Response.json(
//         { error: `Backend returned status ${response.status}` },
//         { status: response.status }
//       );
//     }
    
//     const data = await response.json();
//     return Response.json(data);
//   } catch (error) {
//     console.error('API proxy error:', error);
//     return Response.json(
//       { error: 'Failed to fetch data from backend' },
//       { status: 500 }
//     );
//   }
// }