import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Helper to verify JWT
async function verifyJWT(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await jwtVerify(token, secret);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let token: string | undefined;

    token = request.cookies.get("DashboardToken")?.value;
  

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifyJWT(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/makepost/:path*"],
};
