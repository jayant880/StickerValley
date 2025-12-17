import { useQuery } from "@tanstack/react-query";
import { getMe, getUser, getMeKey, getUserKey } from "../api/user.api";
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
