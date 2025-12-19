import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getUser, getMeKey, getUserKey, updateMe } from "../api/user.api";
import { useUser as useClerkUser } from "@clerk/clerk-react";

export const useMeQuery = () => {
    const { isLoaded, isSignedIn } = useClerkUser();

    return useQuery({
        queryKey: getMeKey(),
        queryFn: getMe,
        enabled: isLoaded && isSignedIn,
    });
};

export const useUserQuery = (userId: string) => {
    return useQuery({
        queryKey: getUserKey(userId),
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });
};

export const useUpdateMeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getMeKey() });
        },
        onError: (error) => {
            console.error("Failed to update profile", error);
        }
    });
};
