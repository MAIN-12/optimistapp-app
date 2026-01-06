'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
} from '@heroui/react';
import { Button } from '@heroui/button';
import { Slider } from '@heroui/slider';
import { 
    Play, 
    Pause, 
    Volume2, 
    CloudRain, 
    Wind, 
    Waves, 
    TreePine, 
    Flame, 
    Music,
    Coffee
} from 'lucide-react';

// Define the white noise options
// Add your audio files to public/audio/white-noise/ folder
// Supported formats: .mp3, .wav, .ogg
// Naming convention: rain.mp3, ocean.wav, forest.mp3, etc.
export const WHITE_NOISE_OPTIONS = [
    {
        id: 'rain',
        name: 'Rain',
        icon: CloudRain,
        file: '/audio/white-noise/rain.mp3', // Change extension to .wav if using WAV files
        color: 'bg-blue-500',
    },
    {
        id: 'ocean',
        name: 'Ocean Waves',
        icon: Waves,
        file: '/audio/white-noise/ocean.mp3',
        color: 'bg-cyan-500',
    },
    {
        id: 'forest',
        name: 'Forest',
        icon: TreePine,
        file: '/audio/white-noise/forest.mp3',
        color: 'bg-green-500',
    },
    {
        id: 'wind',
        name: 'Wind',
        icon: Wind,
        file: '/audio/white-noise/wind.mp3',
        color: 'bg-gray-500',
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: Flame,
        file: '/audio/white-noise/fireplace.mp3',
        color: 'bg-orange-500',
    },
    {
        id: 'cafe',
        name: 'Café Ambience',
        icon: Coffee,
        file: '/audio/white-noise/cafe.mp3',
        color: 'bg-amber-700',
    },
];

interface WhiteNoiseModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onPlayingChange?: (isPlaying: boolean) => void;
}

const WhiteNoiseModal: React.FC<WhiteNoiseModalProps> = ({ isOpen, onOpenChange, onPlayingChange }) => {
    const [currentSound, setCurrentSound] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = volume;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Update volume when slider changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleSoundSelect = async (soundId: string) => {
        const sound = WHITE_NOISE_OPTIONS.find(s => s.id === soundId);
        if (!sound || !audioRef.current) return;

        // If same sound is clicked, toggle play/pause
        if (currentSound === soundId) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
                onPlayingChange?.(false);
            } else {
                await audioRef.current.play();
                setIsPlaying(true);
                onPlayingChange?.(true);
            }
            return;
        }

        // New sound selected
        audioRef.current.pause();
        audioRef.current.src = sound.file;
        audioRef.current.load();
        
        try {
            await audioRef.current.play();
            setCurrentSound(soundId);
            setIsPlaying(true);
            onPlayingChange?.(true);
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        onPlayingChange?.(false);
        }
        setIsPlaying(false);
        setCurrentSound(null);
    };

    const handleVolumeChange = (value: number | number[]) => {
        const newVolume = Array.isArray(value) ? value[0] : value;
        if (newVolume !== undefined) {
            setVolume(newVolume);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            size="md"
            classNames={{
                body: "py-6",
                base: "bg-white dark:bg-gray-900",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Music className="w-5 h-5" />
                                <span>Relaxing Sounds</span>
                            </div>
                            <p className="text-sm font-normal text-gray-500">
                                Choose ambient sounds to help you relax
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            {/* Sound Options Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {WHITE_NOISE_OPTIONS.map((sound) => {
                                    const Icon = sound.icon;
                                    const isActive = currentSound === sound.id;
                                    const isCurrentlyPlaying = isActive && isPlaying;
                                    
                                    return (
                                        <Button
                                            key={sound.id}
                                            variant={isActive ? "solid" : "flat"}
                                            className={`
                                                h-20 flex flex-col gap-1 
                                                ${isActive ? sound.color + ' text-white' : 'bg-gray-100 dark:bg-gray-800'}
                                                ${isCurrentlyPlaying ? 'ring-2 ring-offset-2 ring-primary' : ''}
                                            `}
                                            onPress={() => handleSoundSelect(sound.id)}
                                        >
                                            <Icon className="w-6 h-6" />
                                            <span className="text-xs">{sound.name}</span>
                                            {isCurrentlyPlaying && (
                                                <span className="absolute top-1 right-1">
                                                    <span className="flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                    </span>
                                                </span>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Volume Control */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Volume2 className="w-5 h-5 text-gray-500" />
                                    <Slider
                                        aria-label="Volume"
                                        size="sm"
                                        step={0.01}
                                        maxValue={1}
                                        minValue={0}
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="flex-1"
                                        classNames={{
                                            track: "bg-gray-200 dark:bg-gray-700",
                                            filler: "bg-primary",
                                        }}
                                    />
                                    <span className="text-sm text-gray-500 w-10 text-right">
                                        {Math.round(volume * 100)}%
                                    </span>
                                </div>
                            </div>

                            {/* Playback Controls */}
                            {currentSound && (
                                <div className="flex justify-center gap-4 mt-4">
                                    <Button
                                        isIconOnly
                                        variant="flat"
                                        radius="full"
                                        size="lg"
                                        onPress={() => handleSoundSelect(currentSound)}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6" />
                                        ) : (
                                            <Play className="w-6 h-6" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="flat"
                                        radius="full"
                                        size="lg"
                                        color="danger"
                                        onPress={handleStop}
                                    >
                                        Stop
                                    </Button>
                                </div>
                            )}

                            {/* Info Text */}
                            <p className="text-xs text-gray-400 text-center mt-4">
                                Audio will continue playing when you close this modal
                            </p>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default WhiteNoiseModal;
