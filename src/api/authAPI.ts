"use server";
import { SessionData, post, get } from "./helper";
export type { SessionData } from "./helper";

export const register = async (
  username: string,
  name: string,
  password: string,
  image?: string,
) => {
  const response = await post("/auth/register", { username, name, password, image }, true);
  return { message: await response.text(), status: response.status };
};

export const login = async (username: string, password: string) => {
  const response = await post("/auth/login", { username, password }, true);
  return { message: await response.text(), status: response.status };
};

export const editProfile = async (username: string, name: string, image: string) => {
  const response = await post("/auth/edit", { username, name, image }, true);
  return { message: await response.text(), status: response.status };
};

export const getMe = async (): Promise<SessionData> => {
  const response = await get("/auth/me");
  !response.ok && console.log(await response.text());
  return response.ok ? response.json() : ({} as SessionData);
};

export const logout = async (): Promise<string> =>
  (await get(`/auth/logout`)).text();

export const setSlackId = async (code: string) => {
  const response = await post("/auth/setSlackId", { code })
  return { message: await response.text(), status: response.status }
}