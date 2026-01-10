import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname === "/login";
  const isOnRoot = req.nextUrl.pathname === "/";

  // Redirect root to collections if logged in, otherwise to login
  if (isOnRoot) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/collections", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If on login page and already logged in, redirect to collections
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/collections", req.nextUrl));
  }

  // If not on login page and not logged in, redirect to login
  if (!isOnLogin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
