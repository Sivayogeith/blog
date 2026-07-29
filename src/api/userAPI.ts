"use server";

import { processPost } from "../utils/postUtils";
import { Comment, get, Post, User } from "./helper";

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
