'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Skeleton } from "@heroui/react";


const UserName = () => {
    const { user, error, isLoading } = useUser();

    if (error) return <div>{error.message}</div>;

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-1">
                <Skeleton className="w-36 h-5 rounded-md" />
                <Skeleton className="w-28 h-4 rounded-md" />
            </div>
        );
    }

    return user ? (
        <>
            <p className='max-w-[15ch]'>{user.name}</p>
            <p className="text-gray-500 text-sm truncate max-w-[20ch]">{user.email}</p>
        </>

    ) : null;
};

export default UserName;


