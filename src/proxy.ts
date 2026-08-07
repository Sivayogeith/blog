import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getMe } from "./api/authAPI";

const adminOnlyRoutes = ["/admin/dashboard", "/post/:slug/edit", "/post/create"];
const authenticatedRoutes = ["/profile", "/profile/edit"];

// uses regex to convert :<anything> to <anything> and tests if given path matches each regex route from given list,
export const matchesRoute = (path: string, routes: string[]) => {
  return routes.some((route) =>
    new RegExp(`^${route.replace(/:[^/]+/g, "[^/]+")}$`).test(path),
  );
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.set("x-path", path);

  const needsAuth =
    matchesRoute(path, authenticatedRoutes) ||
    matchesRoute(path, adminOnlyRoutes);

  if (!needsAuth) {
    return NextResponse.next({
      request: { headers },
    });
  }

  const session = await getMe();

  // If user is not authenticated
  if (!session.username) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is not an admin and they are trying to access admin routes
  if (!session.isAdmin && matchesRoute(path, adminOnlyRoutes)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
