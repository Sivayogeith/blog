"use server"

import { cookies } from "next/headers";

export const createPost = async (title: string, body: string, slug: string): Promise<{ message: string; status: number }> => {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API}/admin/createPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ title, body, slug }),
  });

  return { message: await response.text(), status: response.status };
};

export const editPost = async (
  id: number,
  title?: string,
  body?: string,
  slug?: string,
) => {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API}/admin/editPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ id, title, body, slug }),
  });

  return { message: await response.text(), status: response.status };
};

export const deletePost = async (id: number) => {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API}/admin/deletePost`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ id }),
  });

  return response.text();
};
