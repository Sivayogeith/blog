import { cookies } from "next/headers";

export const createPost = async (
  id: string,
  title: string,
  body: string,
  slug: string,
) => {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API}/admin/createPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ id, title, body, slug }),
  });

  return response.text();
};

export const editPost = async (
  id: string,
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

  return response.text();
};

export const deletePost = async (id: string) => {
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
