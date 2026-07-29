import { cookies } from "next/headers";
import qs from "querystring";

// fetch methods
export const get = async (path: string) => {
  const response = await fetch(process.env.API + path, {
    headers: {
      Cookie: await getCookies(),
    },
  });

  return response
}

export const post = async (
  path: string,
  body: [] | {} | FormData,
  setSession: boolean = false,
) => {
  const headers: HeadersInit = { Cookie: await getCookies() };
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";

  const response = await fetch(process.env.API + path, {
    method: "POST",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });


  if (setSession) {
    const sessionCookie = await parseSessionCookies(response);

    if (sessionCookie) {
      (await cookies()).set("connect.sid", sessionCookie);
    }
  }

  return response;
};

export const del = async (path: string, body: [] | {} = {}) =>
  await fetch(process.env.API + path, {
    method: "DELETE",
    headers: { Cookie: await getCookies(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// helper functions
export const getCookies = async (): Promise<string> =>
  (await cookies()).toString() || "";

export const parseSessionCookies = async (res: Response): Promise<string> =>
  (qs.parse(res.headers.getSetCookie()[0], "; ") as any)["connect.sid"];

// Types
export interface User {
  username: string;
  name: string;
  isAdmin: string;
  image: string;
}

export interface SessionData {
  username: string;
  name: string;
  userId: string;
  isAdmin: boolean;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  slug: string;
  stats: {
    readingTime: number;
    words: number;
  };
  cover?: {
    type: "image" | "video";
    src: string;
    caption: string;
  };
  author: string;
}

export interface Comment {
  id: number;
  created_at: string;
  from: string; // username from users
  on: number; // id from posts
  message: string;
}
