"use server";

import { Cover } from "../components/PostCover";
import { calculateReadingTime, calculateWordCount } from "../utils/postUtils";
import { del, get, getCookies, post } from "./helper";

export const createPost = async (
  title: string,
  body: string,
  slug: string,
  cover: Cover,
): Promise<{ message: string; status: number }> => {
  const response = await post(`/admin/createPost`, {
    title,
    body,
    slug,
    stats: {
      readingTime: calculateReadingTime(body),
      words: calculateWordCount(body),
    },
    cover,
  });

  return { message: await response.text(), status: response.status };
};

export const editPost = async (
  id: number,
  title: string = "",
  body: string = "",
  slug: string = "",
  cover?: Cover,
) => {
  const response = await post(`/admin/editPost`, {
    id,
    title,
    body,
    slug,
    stats: {
      readingTime: calculateReadingTime(body),
      words: calculateWordCount(body),
    },
    cover,
  });

  return { message: await response.text(), status: response.status };
};

export const deletePost = async (id: number) =>
  (await del(`/admin/deletePost`, { id })).text();

export const getStats = async (): Promise<{
  readingTime: number;
  words: number;
} | null> => {
  const response = await get(`/admin/stats`);
  return response.ok ? response.json() : null;
};

export const upload = async (formData: FormData) => {
  const response = await post("/admin/upload", formData);
  if (response.status === 500) {
    return { error: response.text() };
  }
  return response.json();
};

export const respondInvite = async (accept: boolean) => {
  const response = await post("/admin/respondInvite", { accept }, true);
  return { message: response.text(), status: response.status };
};

export const checkInvite = async () => {
  const response = await get("/admin/checkInvite");
  if (!response.ok) return false;
  return await response.text() === "true";
};

export const setCdnAPIKey = async (cdnAPIKey: string) => {
  const response = await post("/admin/setCdnAPIKey", {cdnAPIKey})
  return { message: await response.text(), status: response.status}
}