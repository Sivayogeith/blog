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
  const data = await fetch(`${process.env.API}/auth/login`, {
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
  const responseCookies = qs.parse(data.headers.getSetCookie()[0], "; ");

  if (responseCookies["connect.sid"]) {
    cookieStore.set("connect.sid", responseCookies["connect.sid"].toString());
  }

  return { message: await data.text(), status: data.status };
};

export const getMe = async (): Promise<SessionData> => {
  const cookieStore = await cookies();
  const data = await fetch(`${process.env.API}/auth/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (data.status == 200) {
    return data.json();
  }
  console.error(data.text());
  return {} as SessionData;
};
