"use server";

import { calculateReadingTime, calculateWordCount } from "../utils/postUtils";
import { getCookies } from "./authAPI";

export const createPost = async (
  title: string,
  body: string,
  slug: string,
): Promise<{ message: string; status: number }> => {
  const response = await fetch(`${process.env.API}/admin/createPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: await getCookies(),
    },
    body: JSON.stringify({
      title,
      body,
      slug,
      stats: {
        readingTime: calculateReadingTime(body),
        words: calculateWordCount(body),
      },
    }),
  });

  return { message: await response.text(), status: response.status };
};

export const editPost = async (
  id: number,
  title: string = "",
  body: string = "",
  slug: string = "",
) => {
  const response = await fetch(`${process.env.API}/admin/editPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: await getCookies(),
    },
    body: JSON.stringify({
      id,
      title,
      body,
      slug,
      stats: {
        readingTime: calculateReadingTime(body),
        words: calculateWordCount(body),
      },
    }),
  });

  return { message: await response.text(), status: response.status };
};

export const deletePost = async (id: number) => {
  const response = await fetch(`${process.env.API}/admin/deletePost`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: await getCookies(),
    },
    body: JSON.stringify({ id }),
  });

  return response.text();
};

export const getStats = async (): Promise<{
  readingTime: number;
  words: number;
} | null> => {
  const response = await fetch(`${process.env.API}/admin/stats`, {
    headers: { Cookie: await getCookies() },
  });
  if (response.status == 200) {
    return response.json();
  }
  return null;
};
