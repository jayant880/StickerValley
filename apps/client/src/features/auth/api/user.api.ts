import { api } from "@/lib/axios"
import type { User } from "@sticker-valley/shared-types"

export const getUserKey = (userId: string) => ['user', userId];
export const getMeKey = () => ['user', 'me'];

export const getUser = async (userId: string): Promise<User> => {
    const res = await api.get(`/user/${userId}`)
    return res.data
}

export const getMe = async (): Promise<User> => {
    const res = await api.get(`/user/me`)
    return res.data.data
}
