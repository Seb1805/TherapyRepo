import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL;


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

  const headers = {
    "Content-Type": "application/json",
  };
  
  const token = request.headers.get("Authorization");
  if (token) {
    headers["Authorization"] = token;
  }

  let body = null;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.json().catch(() => null);
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
