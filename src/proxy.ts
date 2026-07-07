import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getMe } from "./api/authAPI";

export async function proxy(request: NextRequest) {
  const session = await getMe(); 
  if (session.username) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/dashboard", "/post/:slug/edit", "/post/create", "/profile", "/profile/edit"],
};
