"use server"

import { get, User } from "./helper"

export const getUser = async (username: string): Promise<User> => {
    const response = await get(`/user/${username}`)
    return response.ok ? await response.json() : {} as User
}