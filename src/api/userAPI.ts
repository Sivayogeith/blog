"use server"

import { get, User } from "./helper"

export const getUser = async (username: string): Promise<User> => {
    const response = await get(`/user/${username}`)
    return response.ok ? await response.json() : {} as User
}

export const getUserStats = async (username: string): Promise<{posts: number, comments: number}> => {
    const response = await get(`/user/${username}/stats`)
    return response.ok ? response.json() : {} as ReturnType<typeof getUserStats>
}