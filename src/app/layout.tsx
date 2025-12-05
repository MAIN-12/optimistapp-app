import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PaintPulse',
  description: 'PaintPulse - Painting Project Management',
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return children;
}
