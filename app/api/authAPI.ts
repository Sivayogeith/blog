"use server";

import { cookies } from "next/headers";
import qs from "querystring";

export interface SessionData {
  username: string;
  adminId: string;
}

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

export const getMe = async (): Promise<SessionData> => {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API}/auth/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (response.status == 200) {
    return response.json();
  }
  console.error(response.text());
  return {} as SessionData;
};
