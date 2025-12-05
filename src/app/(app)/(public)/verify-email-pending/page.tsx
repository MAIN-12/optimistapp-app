'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@heroui/react";
import { Mail, CheckCircle2, RefreshCw } from 'lucide-react';

import AppLogoExpanded from '@/components/logo/AppLogoExpanded';

export default function VerifyEmailPendingPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendSuccess(true);
      } else {
        const data = await response.json();
        setResendError(data.message || 'Failed to resend verification email.');
      }
    } catch (error) {
      setResendError('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-primary">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-3 pt-8 pb-0">
          <Link href="/">
            <AppLogoExpanded />
          </Link>
        </CardHeader>
        <CardBody className="px-6 py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-success-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          
          <p className="text-gray-500 mb-6">
            We&apos;ve sent a verification link to{' '}
            <span className="font-semibold text-foreground">{email}</span>
          </p>
          
          <div className="bg-default-100 rounded-lg p-4 w-full mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-medium text-foreground mb-1">What&apos;s next?</p>
                <ol className="text-gray-500 space-y-1 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Find the email from Optimist App</li>
                  <li>Click the verification link</li>
                  <li>Start spreading positivity!</li>
                </ol>
              </div>
            </div>
          </div>

          {resendSuccess && (
            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm w-full mb-4">
              Verification email sent successfully!
            </div>
          )}

          {resendError && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm w-full mb-4">
              {resendError}
            </div>
          )}

          <div className="space-y-3 w-full">
            <Button
              variant="flat"
              color="primary"
              className="w-full"
              onPress={handleResendEmail}
              isLoading={isResending}
              startContent={!isResending && <RefreshCw className="w-4 h-4" />}
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </Button>
            
            <p className="text-gray-400 text-xs">
              Didn&apos;t receive the email? Check your spam folder or try resending.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-divider w-full">
            <p className="text-sm text-gray-500">
              Wrong email?{' '}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up again
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
