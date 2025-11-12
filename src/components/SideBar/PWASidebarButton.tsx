'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PWASidebarButtonProps {
  isExpanded: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWASidebarButton({ isExpanded }: PWASidebarButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const t = useTranslations('PWAInstall');

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      if (window.navigator && (window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      showInstallInstructions();
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
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

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Always show the button for mobile devices even without beforeinstallprompt
  const shouldShowButton = showInstallButton || (!isInstalled && typeof window !== 'undefined');

  if (!shouldShowButton) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center w-full mx-3 text-base py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:font-semibold cursor-pointer select-none transition-colors"
    >
      <div className="flex items-center justify-center w-10 h-10">
        <Download className="w-5 h-5 text-blue-600" />
      </div>
      {isExpanded && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="ml-3 whitespace-nowrap text-blue-600 font-medium"
        >
          {t('installApp', { default: 'Install App' })}
        </motion.span>
      )}
    </button>
  );
}