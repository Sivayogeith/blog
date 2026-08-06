import { del, post } from "./helper"

export const addAdmin = async (username: string) => {
    const response = await post("/owner/addAdmin", { username })
    return { message: await response.text(), status: response.status }
} 

export const removeAdmin = async (username: string) => {
    const response = await del("/owner/removeAdmin", { username })
    return { message: await response.text(), status: response.status }
}