'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
} from "@heroui/react";
import { CheckCircle2, XCircle, Mail } from 'lucide-react';

import AppLogoExpanded from '@/components/logo/AppLogoExpanded';
import { useAuth } from '@/providers/AuthProvider';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { refreshUser } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('No verification token provided.');
        return;
      }

      try {
        const response = await fetch(`/api/users/verify-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          // Refresh user state after verification
          await refreshUser();
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'Verification failed. The link may have expired.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [token, refreshUser]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-primary">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center gap-3 pt-8 pb-0">
            <Link href="/">
              <AppLogoExpanded />
            </Link>
          </CardHeader>
          <CardBody className="px-6 py-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <Spinner size="lg" color="primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
            <p className="text-gray-500">Please wait while we verify your email address.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-primary">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center gap-3 pt-8 pb-0">
            <Link href="/">
              <AppLogoExpanded />
            </Link>
          </CardHeader>
          <CardBody className="px-6 py-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-danger-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-gray-500 mb-6">{errorMessage}</p>
            
            <div className="space-y-3 w-full">
              <Button
                color="primary"
                className="w-full"
                onPress={() => router.push('/login')}
              >
                Go to Login
              </Button>
              
              <p className="text-gray-400 text-sm">
                Need help?{' '}
                <Link href="/contact" className="text-primary font-medium hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Success state
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
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
          <p className="text-gray-500 mb-6">
            Your email has been successfully verified. You can now log in to your account and start spreading positivity!
          </p>
          
          <div className="bg-success-50 rounded-lg p-4 w-full mb-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-success-600 flex-shrink-0" />
              <p className="text-success-700 text-sm text-left">
                Welcome to Optimist App! Your account is now active.
              </p>
            </div>
          </div>

          <Button
            color="primary"
            className="w-full"
            size="lg"
            onPress={() => router.push('/login')}
          >
            Log in to your account
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-primary">
        <Card className="w-full max-w-md">
          <CardBody className="px-6 py-8 flex flex-col items-center text-center">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-500 mt-4">Loading...</p>
          </CardBody>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
