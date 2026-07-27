"use server"

import { cookies } from "next/headers";
import qs from "querystring";

const toast = async (
  message: string,
  type: "success" | "error" | "info" | "warning" | "message",
) => {
  const cookieStore = await cookies();
  console.log(message, type)
  cookieStore.set("toast", JSON.stringify({ message, type }), {
    maxAge: 10,
    path: "/",
  });
};

const errorHandling = async (response: Response, allErrors: boolean) => {
  console.log(response.status)
  if (allErrors) {
    if (!response.ok) {
      await toast(await response.text(), "error");
    }
  }

  if (response.status === 500) {
    await toast("Something went wrong, try again or ping Sage!", "error");
  }

  if (response.status == 429) {
    await toast("Please slow down, try again in a few mins!", "error");
  }

  return response;
};

// fetch methods
export const get = async (path: string, allErrors: boolean = false) => {
  const response = await fetch(process.env.API + path, {
    headers: {
      Cookie: await getCookies(),
    },
  });

  await errorHandling(response, allErrors)

  return response;
};

export const post = async (
  path: string,
  body: [] | {} | FormData,
  setSession: boolean = false,
  allErrors: boolean = false,
) => {
  const headers: HeadersInit = { Cookie: await getCookies() };
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";

  const response = await fetch(process.env.API + path, {
    method: "POST",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  await errorHandling(response, allErrors);

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

export interface Comments {
  id: number;
  created_at: string;
  from: string; // username from users
  on: number; // id from posts
  message: string;
}
