'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/react';
import { Music } from 'lucide-react';
import WhiteNoiseModal from './WhiteNoiseModal';

interface WhiteNoiseButtonProps {
    className?: string;
}

const WhiteNoiseButton: React.FC<WhiteNoiseButtonProps> = ({ className }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <>
            <div className="relative inline-flex">
                {isPlaying && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></span>
                        <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping"></span>
                    </>
                )}
                <Button
                    startContent={<Music className={`w-5 h-5 transition-colors ${isPlaying ? 'text-primary' : 'text-gray-600'}`} />}
                    variant="light"
                    isIconOnly
                    radius="full"
                    onPress={onOpen}
                    aria-label="Open relaxing sounds"
                    className={`relative z-10 transition-all duration-300 ${className} ${isPlaying ? 'bg-primary/10 scale-105' : ''}`}
                />
            </div>
            <WhiteNoiseModal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                onPlayingChange={setIsPlaying}
            />
        </>
    );
};

export default WhiteNoiseButton;
