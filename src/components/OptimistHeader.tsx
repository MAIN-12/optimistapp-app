'use client';

import { Bell, Settings } from 'lucide-react';
import UserDropdown from './UserDropdown';
import PWAInstallButton from './PWAInstallButton';
import { Button } from '@heroui/button';
import LogoCompact from '@/components/logo/AppLogoCompact';
import Logo from '@/components/logo/AppLogoExpanded';
import { Link } from '@heroui/link';
import { WhiteNoiseButton } from './white-noise';

export default function OptimistHeader() {

    return (
        <div className="flex items-center justify-between mb-6">
            {/* Left side - Title and User */}
            <Link href='/' aria-label="Home">
                <Logo />
            </Link>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-4">
                {/* <PWAInstallButton /> */}
                <WhiteNoiseButton />
                {/* <Button
                    startContent={<Bell className="w-5 h-5 text-gray-600" />}
                    variant='light'
                    isIconOnly
                    radius='full'
                /> */}
                <UserDropdown />
            </div>
        </div>
    );
}