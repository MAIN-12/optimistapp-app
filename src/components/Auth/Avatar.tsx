'use client';

import { useUser } from '@/providers/auth';
import { Avatar, Skeleton, AvatarProps } from "@heroui/react";
import { Media, ProfilePicture } from '@/payload-types';

import LoginBtn from './loginBtn';

const UserAvatar = (props: AvatarProps) => {
    const { user, error, isLoading } = useUser();

    if (error) return <div>{error.message}</div>;
    if (isLoading) return <Skeleton className="w-10 h-10 rounded-full" />;

    // Get picture URL from Payload media relation
    // Check profilePicture first (from onboarding), then fall back to picture
    const getPictureUrl = (): string | undefined => {
        if (user?.profilePicture && typeof user.profilePicture === 'object') {
            return (user.profilePicture as ProfilePicture)?.url ?? undefined;
        }
        if (user?.picture && typeof user.picture === 'object') {
            return (user.picture as Media)?.url ?? undefined;
        }
        return undefined;
    };

    const pictureUrl = getPictureUrl();

    return user ? (
        <Avatar
            showFallback
            src={pictureUrl}
            name={user.name?.charAt(0) || 'U'}
            alt={`${user?.name}'s Profile picture` || "User Profile Picture"}
            {...props}
        />
    ) : <LoginBtn />;
};

export default UserAvatar;


