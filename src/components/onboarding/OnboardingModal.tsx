'use client';

import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Progress,
  Select,
  SelectItem,
  Avatar,
  Autocomplete,
  AutocompleteItem,
} from '@heroui/react';
import { useOnboarding, INTRO_SLIDES_COUNT } from '@/providers/OnboardingProvider';
import { useTranslations } from 'next-intl';

// Icons
const WelcomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const JournalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export function OnboardingModal() {
  const t = useTranslations('Onboarding');
  const {
    isOnboardingOpen,
    currentStep,
    totalSteps,
    onboardingData,
    dismissForToday,
    nextStep,
    prevStep,
    updateOnboardingData,
    completeOnboarding,
    isLoading,
  } = useOnboarding();

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Birthday state - parse from onboardingData if exists
  const [birthDay, setBirthDay] = useState<string>('');
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [birthYear, setBirthYear] = useState<string>('');

  // Update onboardingData when birthday parts change
  const updateBirthday = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      updateOnboardingData({ birthday: formattedDate });
    }
  };

  const handleDayChange = (value: string) => {
    setBirthDay(value);
    updateBirthday(value, birthMonth, birthYear);
  };

  const handleMonthChange = (value: string) => {
    setBirthMonth(value);
    updateBirthday(birthDay, value, birthYear);
  };

  const handleYearChange = (value: string) => {
    setBirthYear(value);
    updateBirthday(birthDay, birthMonth, value);
  };

  // Generate options for day, month, year
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const months = [
    { value: '1', label: t('birthday.months.january') },
    { value: '2', label: t('birthday.months.february') },
    { value: '3', label: t('birthday.months.march') },
    { value: '4', label: t('birthday.months.april') },
    { value: '5', label: t('birthday.months.may') },
    { value: '6', label: t('birthday.months.june') },
    { value: '7', label: t('birthday.months.july') },
    { value: '8', label: t('birthday.months.august') },
    { value: '9', label: t('birthday.months.september') },
    { value: '10', label: t('birthday.months.october') },
    { value: '11', label: t('birthday.months.november') },
    { value: '12', label: t('birthday.months.december') },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i - 10),
    label: String(currentYear - i - 10),
  }));

  const isIntroSlide = currentStep < INTRO_SLIDES_COUNT;
  const formStepIndex = currentStep - INTRO_SLIDES_COUNT;
  const isLastStep = currentStep === totalSteps - 1;

  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', 'Profile picture');

      const response = await fetch('/api/profile-pictures', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateOnboardingData({ profilePictureId: data.doc.id });
      } else {
        console.error('Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const fireConfetti = () => {
    // Fire confetti from both sides with vibrant celebration colors
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Also fire a burst from the center
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        // colors: colors,
      });
    }, 200);

    // Extra burst for more celebration
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.5, x: 0.3 },
        // colors: colors,
      });
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.5, x: 0.7 },
        // colors: colors,
      });
    }, 400);
  };

  const handleComplete = async () => {
    fireConfetti();
    setShowSuccess(true);
    
    // Wait 1.5 seconds to show success message, then complete
    setTimeout(async () => {
      await completeOnboarding();
      setShowSuccess(false);
    }, 1500);
  };

  const handleDismiss = () => {
    dismissForToday();
  };

  const genderOptions = [
    { value: 'male', label: t('genderOptions.male') },
    { value: 'female', label: t('genderOptions.female') },
    { value: 'non-binary', label: t('genderOptions.nonBinary') },
    { value: 'prefer-not-to-say', label: t('genderOptions.preferNotToSay') },
    { value: 'other', label: t('genderOptions.other') },
  ];

  const heardAboutUsOptions = [
    { value: 'social-media', label: t('heardAboutOptions.socialMedia') },
    { value: 'friend-family', label: t('heardAboutOptions.friendFamily') },
    { value: 'search-engine', label: t('heardAboutOptions.searchEngine') },
    { value: 'app-store', label: t('heardAboutOptions.appStore') },
    { value: 'advertisement', label: t('heardAboutOptions.advertisement') },
    { value: 'blog-article', label: t('heardAboutOptions.blogArticle') },
    { value: 'other', label: t('heardAboutOptions.other') },
  ];

  const renderSuccessScreen = () => (
    <div className="flex flex-col items-center justify-center text-center px-4 py-8 animate-appearance-in">
      <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">{t('success.title')}</h2>
      <p className="text-default-600 max-w-md">{t('success.description')}</p>
    </div>
  );

  const renderIntroSlide = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            <WelcomeIcon />
            <h2 className="text-2xl font-bold mt-6 mb-4">{t('slide1.title')}</h2>
            <p className="text-default-600 max-w-md">{t('slide1.description')}</p>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            <JournalIcon />
            <h2 className="text-2xl font-bold mt-6 mb-4">{t('slide2.title')}</h2>
            <p className="text-default-600 max-w-md">{t('slide2.description')}</p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            <CommunityIcon />
            <h2 className="text-2xl font-bold mt-6 mb-4">{t('slide3.title')}</h2>
            <p className="text-default-600 max-w-md">{t('slide3.description')}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFormStep = () => {
    switch (formStepIndex) {
      case 0: // Birthday
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            <CalendarIcon />
            <h2 className="text-2xl font-bold mt-6 mb-2">{t('birthday.title')}</h2>
            <p className="text-default-600 mb-6">{t('birthday.description')}</p>
            <div className="flex gap-3 w-full max-w-md">
              <Autocomplete
                label={t('birthday.day')}
                selectedKey={birthDay || null}
                onSelectionChange={(key) => {
                  handleDayChange(key as string);
                }}
                className="w-24"
                size="lg"
                allowsCustomValue={false}
              >
                {days.map((day) => (
                  <AutocompleteItem key={day.value}>{day.label}</AutocompleteItem>
                ))}
              </Autocomplete>
              <Autocomplete
                label={t('birthday.month')}
                selectedKey={birthMonth || null}
                onSelectionChange={(key) => {
                  handleMonthChange(key as string);
                }}
                className="flex-1"
                size="lg"
                allowsCustomValue={false}
              >
                {months.map((month) => (
                  <AutocompleteItem key={month.value}>{month.label}</AutocompleteItem>
                ))}
              </Autocomplete>
              <Autocomplete
                label={t('birthday.year')}
                selectedKey={birthYear || null}
                onSelectionChange={(key) => {
                  handleYearChange(key as string);
                }}
                className="w-32"
                size="lg"
                allowsCustomValue={false}
              >
                {years.map((year) => (
                  <AutocompleteItem key={year.value}>{year.label}</AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>
        );
      case 1: // Gender
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            <UserIcon />
            <h2 className="text-2xl font-bold mt-6 mb-2">{t('gender.title')}</h2>
            <p className="text-default-600 mb-6">{t('gender.description')}</p>
            <Select
              label={t('gender.label')}
              selectedKeys={onboardingData.gender ? [onboardingData.gender] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                updateOnboardingData({ gender: value });
              }}
              className="max-w-xs"
              size="lg"
            >
              {genderOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        );
      case 2: // How did you hear about us
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            <MegaphoneIcon />
            <h2 className="text-2xl font-bold mt-6 mb-2">{t('heardAbout.title')}</h2>
            <p className="text-default-600 mb-6">{t('heardAbout.description')}</p>
            <Select
              label={t('heardAbout.label')}
              selectedKeys={onboardingData.heardAboutUs ? [onboardingData.heardAboutUs] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                updateOnboardingData({ heardAboutUs: value });
              }}
              className="max-w-xs"
              size="lg"
            >
              {heardAboutUsOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        );
      case 3: // Profile Picture
        return (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            <CameraIcon />
            <h2 className="text-2xl font-bold mt-6 mb-2">{t('profilePicture.title')}</h2>
            <p className="text-default-600 mb-6">{t('profilePicture.description')}</p>
            
            <div className="flex flex-col items-center gap-4">
              <Avatar
                src={previewUrl || undefined}
                className="w-32 h-32"
                showFallback
                fallback={
                  <UserIcon />
                }
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Button
                color="primary"
                variant="bordered"
                onPress={() => fileInputRef.current?.click()}
                isLoading={isUploading}
              >
                {previewUrl ? t('profilePicture.changePhoto') : t('profilePicture.uploadPhoto')}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onOpenChange={(open) => {
        if (!open) handleDismiss();
      }}
      size="4xl"
      backdrop="blur"
      scrollBehavior="inside"
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        {() => (
          <>
            {!showSuccess && (
              <ModalHeader className="flex flex-col gap-1">
                <Progress
                  aria-label="Onboarding progress"
                  value={progressValue}
                  className="w-full"
                  color="primary"
                  size="sm"
                />
              </ModalHeader>
            )}
            
            <ModalBody className="flex items-center justify-center min-h-[60vh]">
              {showSuccess 
                ? renderSuccessScreen() 
                : isIntroSlide 
                  ? renderIntroSlide() 
                  : renderFormStep()}
            </ModalBody>
            
            {!showSuccess && (
              <ModalFooter className="flex flex-col gap-4">
              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-primary w-6'
                        : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-default-300'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between w-full gap-4">
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button variant="light" onPress={prevStep}>
                      {t('buttons.back')}
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* Skip button only for profile picture step */}
                  {isLastStep && (
                    <Button variant="light" color="default" onPress={handleComplete}>
                      {t('buttons.skip')}
                    </Button>
                  )}

                  {isLastStep ? (
                    <Button
                      color="primary"
                      onPress={handleComplete}
                      isLoading={isLoading}
                    >
                      {t('buttons.complete')}
                    </Button>
                  ) : (
                    <Button color="primary" onPress={nextStep}>
                      {t('buttons.next')}
                    </Button>
                  )}
                </div>
              </div>
            </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default OnboardingModal;
