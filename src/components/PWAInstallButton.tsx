'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const t = useTranslations('PWAInstall');

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check for standalone mode (PWA is installed)
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Check for iOS PWA
      if (window.navigator && (window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For iOS or when prompt is not available, show instructions
      showInstallInstructions();
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Reset the deferred prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const showInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
      instructions = t('iosInstructions', {
        default: 'To install this app on your iOS device:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm'
      });
    } else if (isAndroid) {
      instructions = t('androidInstructions', {
        default: 'To install this app on your Android device:\n1. Tap the menu button (⋮)\n2. Tap "Add to Home screen" or "Install app"\n3. Follow the prompts to install'
      });
    } else {
      instructions = t('desktopInstructions', {
        default: 'To install this app:\n1. Look for an install icon in your browser address bar\n2. Or go to browser menu > "Install Optimist"\n3. Follow the prompts to install'
      });
    }
    
    alert(instructions);
  };

  // Don't show the button if the app is already installed
  if (isInstalled) {
    return null;
  }

  // Always show the button, even if beforeinstallprompt isn't available
  // This helps with iOS devices where the event isn't triggered
  const shouldShowButton = showInstallButton || (!isInstalled && typeof window !== 'undefined');

  if (!shouldShowButton) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      startContent={<Download className="w-4 h-4" />}
      className="bg-blue-600 text-white hover:bg-blue-700"
      size="sm"
      radius="full"
    >
      {t('installApp', { default: 'Install App' })}
    </Button>
  );
}