// app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Your API base URL
const API_BASE_URL = "http://localhost:8000";

const getAuthToken = () => {
  // Localstorage only works on client side, this makes sure the token is only looked for on client side
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

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

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`API request failed: ${error}`);
    return NextResponse.json(
      { error: "Failed to fetch data from API" },
      { status: 500 }
    );
  }
}
