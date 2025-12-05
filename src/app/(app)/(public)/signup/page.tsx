'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Checkbox,
} from "@heroui/react";
import { EyeIcon, EyeOffIcon, Mail, Lock, User } from 'lucide-react';

import { useAuth } from '@/providers/AuthProvider';
import AppLogoExpanded from '@/components/logo/AppLogoExpanded';

export default function SignupPage() {
  const t = useTranslations();
  const router = useRouter();
  
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    hasMinLength: boolean;
  }>({ 
    score: 0, 
    label: "Weak", 
    color: "#ef4444", 
    hasUppercase: false, 
    hasLowercase: false,
    hasNumber: false, 
    hasSpecial: false,
    hasMinLength: false
  });

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;
    
    if (hasMinLength) score++;
    if (password.length >= 12) score++;
    if (hasUppercase && hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    
    let label = "Weak";
    let color = "#ef4444"; // red
    
    if (score >= 4) {
      label = "Strong";
      color = "#22c55e"; // green
    } else if (score >= 3) {
      label = "Medium";
      color = "#f59e0b"; // orange
    }
    
    return { score, label, color, hasUppercase, hasLowercase, hasNumber, hasSpecial, hasMinLength };
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.password) {
      return 'Password is required';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!passwordStrength.hasUppercase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!passwordStrength.hasNumber) {
      return 'Password must contain at least one number';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!acceptTerms) {
      return 'You must accept the Terms of Service and Privacy Policy';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await register({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        // Redirect to email verification pending page
        router.push(`/verify-email-pending?email=${encodeURIComponent(result.email || formData.email)}`);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
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
          <h1 className="text-2xl font-bold text-center">Create an account</h1>
          <p className="text-gray-500 text-center text-sm">
            Join our community and spread positivity
          </p>
        </CardHeader>
        <CardBody className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                {error}
                {error.includes('logging in') && (
                  <Link href="/login" className="block mt-2 text-primary font-medium hover:underline">
                    Go to Login →
                  </Link>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                label="First Name"
                value={formData.name}
                onChange={handleChange('name')}
                isRequired
                autoComplete="given-name"
                isDisabled={isSubmitting || isLoading}
              />
              
              <Input
                type="text"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                autoComplete="family-name"
                isDisabled={isSubmitting || isLoading}
              />
            </div>
            
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              isRequired
              autoComplete="email"
              isDisabled={isSubmitting || isLoading}
            />
            
            <div className="flex flex-col gap-2">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={handleChange('password')}
                startContent={<Lock className="w-4 h-4 text-gray-400" />}
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
                autoComplete="new-password"
                isDisabled={isSubmitting || isLoading}
              />
              
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    <span
                      className="text-sm font-medium min-w-[60px]"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordStrength.hasMinLength ? "✓" : "○"}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.hasUppercase ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordStrength.hasUppercase ? "✓" : "○"}</span>
                      <span>Uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordStrength.hasNumber ? "✓" : "○"}</span>
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? "text-green-600" : "text-gray-500"}`}>
                      <span>{passwordStrength.hasSpecial ? "✓" : "○"}</span>
                      <span>Special character (!@#$%^&*...)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              startContent={<Lock className="w-4 h-4 text-gray-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              }
              isRequired
              autoComplete="new-password"
              isDisabled={isSubmitting || isLoading}
            />
            
            <Checkbox
              isSelected={acceptTerms}
              onValueChange={setAcceptTerms}
              size="sm"
              className="mt-2"
            >
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline" target="_blank">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </Checkbox>
            
            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold mt-4"
              size="lg"
              isLoading={isSubmitting || isLoading}
              isDisabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !acceptTerms}
            >
              Create Account
            </Button>
          </form>
          
          <Divider className="my-6" />
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
