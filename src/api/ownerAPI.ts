"use server";

import { del, post, get, User } from "./helper";

export const getUsers = async (): Promise<
  (User & { id: number; isInvitedAdmin: boolean })[]
> => {
  const response = await get("/owner/getUsers");
  return response.json();
};

export const inviteAdmin = async (username: string) => {
  const response = await post("/owner/inviteAdmin", { username });
  return { message: await response.text(), status: response.status };
};

export const removeAdmin = async (username: string) => {
  const response = await del("/owner/removeAdmin", { username });
  return { message: await response.text(), status: response.status };
};
