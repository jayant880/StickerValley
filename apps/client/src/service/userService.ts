import { api } from "@/lib/axios"

const userService = {
    getUser: async (userId: string) => {
        try {
            const res = await api.get(`/user/${userId}`)
            return res.data
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getMe: async () => {
        try {
            const res = await api.get(`/user/me`)
            return res.data.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export default userService
