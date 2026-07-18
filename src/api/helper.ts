import { cookies } from "next/headers";
import qs from "querystring";

// fetch methods
export const get = async (path: string) =>
  await fetch(process.env.API + path, {
    headers: {
      Cookie: await getCookies(),
    },
  });

export const post = async (
  path: string,
  body: [] | {},
  setSession: boolean = false,
) => {
  const response = await fetch(process.env.API + path, {
    method: "POST",
    headers: { Cookie: await getCookies(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
export interface SessionData {
  username: string;
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
  }
}

export interface Comments {
  id: number;
  created_at: string;
  from: string; // username from users
  on: number; // id from posts
  message: string;
}
