"use server";

import { processPost } from "../utils/postUtils";
import { get, post, Post, Comments } from "./helper";
export type { Post } from "./helper";

export const getPosts = async (truncate: boolean = true): Promise<Post[]> => {
  const response = await get(`/posts`);
  !response.ok && console.log(response.text());
  return response.ok ? (await response.json()).map((post: Post) => processPost(post, truncate)): [];
};

export const getPost = async (slug: string): Promise<Post> => {
  const response = await get(`/posts/${slug}`);
  !response.ok && console.log(await response.text());
  return response.ok ? processPost(await response.json()): {} as Post;
};

// Comments

export const getComments = async (postId: number): Promise<Comments> => {
  const response = await get(`/posts/${postId}/comments`);
  return response.ok ? response.json() : {} as Comments;
};

export const addComment = async (postId: number, message: string) => {
  const response = await post(`/posts/${postId}/comment`, { message });
  return { message: await response.text(), status: response.status }
};
