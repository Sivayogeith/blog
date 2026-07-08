"use server";

import { cookies } from "next/headers";
import qs from "querystring";

export interface SessionData {
  username: string;
  userId: string;
  isAdmin: boolean
}

export const getCookies = async (): Promise<string> =>
  (await cookies()).toString() || "";

export const login = async (
  username: string,
  password: string,
): Promise<{ message: string; status: number }> => {
  const response = await fetch(`${process.env.API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  const cookieStore = await cookies();
  const responseCookies = qs.parse(response.headers.getSetCookie()[0], "; ");

  if (responseCookies["connect.sid"]) {
    cookieStore.set("connect.sid", responseCookies["connect.sid"].toString());
  }

  return { message: await response.text(), status: response.status };
};

export const editProfile = async (username: string) => {
  const response = await fetch(`${process.env.API}/auth/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: await getCookies(),
    },
    body: JSON.stringify({ username }),
  });
  return { message: await response.text(), status: response.status };
};

export const getMe = async (): Promise<SessionData> => {
  const response = await fetch(`${process.env.API}/auth/me`, {
    headers: {
      Cookie: await getCookies(),
    },
  });
  if (response.status == 200) {
    return response.json();
  }
  console.log(response.text());
  return {} as SessionData;
};

export const logout = async (): Promise<string> => {
  const response = await fetch(`${process.env.API}/auth/logout`, {
    headers: {
      Cookie: await getCookies(),
    },
  });
  return response.text();
};
