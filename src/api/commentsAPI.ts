"use server"

import { del, post, Comment } from "./helper";
export type { Comment } from "./helper";

export const editComment = async (commentId: number, message: string) => {
  const response = await post(`/comments/${commentId}/edit`, { message });
  return { message: await response.text(), status: response.status };
};

export const deleteComment = async (commentId: number) => {
  const response = await del(`/comments/${commentId}/delete`);
  return { message: await response.text(), status: response.status };
};

export const likeComment = async (commentId: number) => {
  const response = await post(`/comments/${commentId}/like`, {})
  return { message: await response.text(), status: response.status}
}

export const dislikeComment = async (commentId: number) => {
  const response = await post(`/comments/${commentId}/dislike`, {})
  return { message: await response.text(), status: response.status}
}

export const reportComment = async (commentId: number) => {
  const response = await post(`/comments/${commentId}/report`, {})
  return { message: await response.text(), status: response.status }
}

export const removeOpinion = async (commentId: number) => {
  const response = await post(`/comments/${commentId}/removeOpinion`, {})
  return { message: await response.text(), status: response.status }
}