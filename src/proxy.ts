import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getMe } from "./api/authAPI";

const adminOnlyRoutes = ["/dashboard", "/post/:slug/edit", "/post/create"];
const authenticatedRoutes = ["/profile", "/profile/edit"];

// uses regex to convert :<anything> to <anything> and tests if given path matches each regex route from given list,
const matchesRoute = (path: string, routes: string[]) => {
  return routes.some((route) =>
    new RegExp(`^${route.replace(/:[^/]+/g, "[^/]+")}$`).test(path),
  );
};

export async function proxy(request: NextRequest) {
  const session = await getMe();
  const path = request.nextUrl.pathname;

  // If user is not authenticated and they are trying to access authenticated routes
  if (!session.username) {
    if (matchesRoute(path, authenticatedRoutes) || matchesRoute(path, adminOnlyRoutes)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // If user is not an admin and they are trying to access admin routes
  if (!session.isAdmin && matchesRoute(path, adminOnlyRoutes)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/post/:slug/edit",
    "/post/create",
    "/profile",
    "/profile/edit",
  ],
};
