import { del, post } from "./helper";

export const editComment = async (commentId: number, message: string) => {
  const response = await post(`/comments/${commentId}/edit`, { message });
  return { message: await response.text(), status: response.status };
};

export const deleteComment = async (commentId: number) => {
  const response = await del(`/comments/${commentId}/delete`);
  return { message: await response.text(), status: response.status };
};
