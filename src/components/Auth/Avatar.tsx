'use client';

import { useUser } from '@/providers/AuthProvider';
import { Avatar, Skeleton, AvatarProps } from "@heroui/react";
import { Media } from '@/payload-types';

import LoginBtn from './loginBtn';

const UserAvatar = (props: AvatarProps) => {
    const { user, error, isLoading } = useUser();

    if (error) return <div>{error.message}</div>;
    if (isLoading) return <Skeleton className="w-10 h-10 rounded-full" />;

    // Get picture URL from Payload media relation
    const pictureUrl = user?.picture 
        ? typeof user.picture === 'object' 
            ? (user.picture as Media)?.url 
            : undefined
        : undefined;

    return user ? (
        <Avatar
            showFallback
            src={pictureUrl ?? undefined}
            alt={`${user?.name}'s Profile picture` || "User Profile Picture"}
            {...props}
        />
    ) : <LoginBtn />;
};

export default UserAvatar;


