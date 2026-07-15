"use server";

import { calculateReadingTime, calculateWordCount } from "../utils/postUtils";
import { del, get, getCookies, post } from "./helper";

export const createPost = async (
  title: string,
  body: string,
  slug: string,
): Promise<{ message: string; status: number }> => {
  const response = await post(`/admin/createPost`, {
    title,
    body,
    slug,
    stats: {
      readingTime: calculateReadingTime(body),
      words: calculateWordCount(body),
    },
  });

  return { message: await response.text(), status: response.status };
};

export const editPost = async (
  id: number,
  title: string = "",
  body: string = "",
  slug: string = "",
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
  });

  return { message: await response.text(), status: response.status };
};

export const deletePost = async (id: number) =>
  (await del(`/admin/deletePost`, { id })).text();

export const getStats = async (): Promise<{ readingTime: number; words: number } | null> => {
  const response = await get(`/admin/stats`);
  return response.ok ? response.json() : null;
};
