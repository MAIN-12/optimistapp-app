import { useAuth } from "@/providers/AuthProvider";

interface User {
    id: string;
    name: string;
    email: string;
    isAnonymous: boolean;
}

export function useUser() {
    try {
        const { user, isLoading, error } = useAuth();
        if (user) {
            return {
                user: {
                    id: String(user.id) || "unknown",
                    name: user.name || "Guest User",
                    email: user.email || "guest@example.com",
                    isAnonymous: false,
                },
            };
        }
    } catch (error) {
        console.error("Auth error:", error);
    }

    // Return an object with an anonymous user
    return {
        user: {
            id: "anonymous",
            name: "Anonymous",
            email: "anonymous@example.com",
            isAnonymous: true,
        },
    };
}
