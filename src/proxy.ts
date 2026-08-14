import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getMe } from "./api/authAPI";
import { checkInvite } from "./api/adminAPI";

const adminOnlyRoutes = [
  "/admin/dashboard",
  "/post/:slug/edit",
  "/post/create",
  "/admin/users",
];

const authenticatedRoutes = ["/profile", "/profile/edit", "/admin/invite"];

export const matchesRoute = (path: string, routes: string[]) => {
  return routes.some((route) =>
    new RegExp(`^${route.replace(/:[^/]+/g, "[^/]+")}$`).test(path),
  );
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const headers = new Headers(request.headers);
  headers.set("x-path", path);

  // Get session first
  const session = await getMe();

  // If logged in, check invite status for EVERY route
  if (session.username) {
    const isInvitedAdmin = await checkInvite();

    console.log(isInvitedAdmin)

    // Must be invited to access invite page
    if (path === "/admin/invite" && !isInvitedAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Invited users are forced to invite page from every other route
    if (isInvitedAdmin && path !== "/admin/invite") {
      return NextResponse.redirect(new URL("/admin/invite", request.url));
    }
  }

  const needsAuth =
    matchesRoute(path, authenticatedRoutes) ||
    matchesRoute(path, adminOnlyRoutes);

  if (!needsAuth) {
    return NextResponse.next({ request: { headers } });
  }

  // Protected route but not logged in
  if (!session.username) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin-only routes
  if (!session.isAdmin && matchesRoute(path, adminOnlyRoutes)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};