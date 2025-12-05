'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
} from "@heroui/react";
import { EyeIcon, EyeOffIcon, Mail, Lock } from 'lucide-react';

import { useAuth } from '@/providers/AuthProvider';
import AppLogoExpanded from '@/components/logo/AppLogoExpanded';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/messages';
  
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.push(returnTo);
        router.refresh();
      } else {
        // Check if the error is about unverified email
        const errorLower = (result.error || '').toLowerCase();
        if (errorLower.includes('verify') || errorLower.includes('verification') || errorLower.includes('verified')) {
          // Redirect to verification pending page
          router.push(`/verify-email-pending?email=${encodeURIComponent(email)}`);
          return;
        }
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-primary">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-3 pt-8 pb-0">
          <Link href="/">
            <AppLogoExpanded />
          </Link>
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-gray-500 text-center text-sm">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardBody className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // startContent={<Mail className="w-4 h-4 text-gray-400" />}
              isRequired
              autoComplete="email"
              isDisabled={isSubmitting || isLoading}
            />
            
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              // placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // startContent={<Lock className="w-4 h-4 text-gray-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              }
              isRequired
              autoComplete="current-password"
              isDisabled={isSubmitting || isLoading}
            />
            
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold"
              size="lg"
              isLoading={isSubmitting || isLoading}
              isDisabled={!email || !password}
            >
              Sign In
            </Button>
          </form>
          
          <Divider className="my-6" />
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
