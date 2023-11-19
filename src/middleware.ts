// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage

import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;
    const token = request.nextauth.token;
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    // Protecting Dashboard routes
    if (pathname.startsWith("/dashboard") && token.type !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Must be looged to access user routes
    if (!pathname.startsWith(`/user/${token.id}`) && token.type !== "admin") {
      return NextResponse.redirect(new URL(`/user/${token.id}`, request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/user/:path*"] };
