"use server";

import { processPost } from "../utils/postUtils";
import { Comment, get, post, Post, User } from "./helper";

export const getUser = async (username: string): Promise<User> => {
  const response = await get(`/user/${username}`);
  return response.ok ? await response.json() : ({} as User);
};

export const getUserStats = async (
  username: string,
): Promise<{ posts: number; comments: number }> => {
  const response = await get(`/user/${username}/stats`);
  return response.ok
    ? response.json()
    : ({} as ReturnType<typeof getUserStats>);
};

export const getUserComments = async (username: string): Promise<Comment[]> => {
  const response = await get(`/user/${username}/comments`);
  return response.ok ? response.json() : ({} as Comment[]);
};

export const getUserPosts = async (username: string): Promise<Post[]> => {
  const response = await get(`/user/${username}/posts`);
  return response.ok
    ? (await response.json()).map((post: Post) => processPost(post, true))
    : ({} as Post[]);
};

export const upload = async (formData: FormData) => {
  const response = await post("/user/upload", formData);
  if (response.status === 500) {
    return { error: response.text() };
  }
  return response.json();
};
