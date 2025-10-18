'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar, Skeleton, AvatarProps } from "@heroui/react";

import LoginBtn from './loginBtn';

const UserAvatar = (props: AvatarProps) => {
    const { user, error, isLoading } = useUser();

    if (error) return <div>{error.message}</div>;
    if (isLoading) return <Skeleton className="w-10 h-10 rounded-full" />;

    return user ? (
        <Avatar
            showFallback
            src={user.picture ?? undefined}
            alt={`${user?.name}'s Profile picture` || "User Profile Picture"}
            {...props}
        />
    ) : <LoginBtn />;
};

export default UserAvatar;


