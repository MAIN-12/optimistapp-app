import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import crypto from 'crypto';
import { generateVerificationEmailHTML, generateVerificationEmailSubject } from '@/utilities/email/templates/verificationEmail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Find the user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    });

    if (users.docs.length === 0) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification email has been sent.',
      });
    }

    const user = users.docs[0];

    // Check if already verified
    if (user._verified) {
      return NextResponse.json({
        success: true,
        message: 'This email is already verified. You can log in.',
      });
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Update user with new token
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        _verificationToken: verificationToken,
      },
    });

    // Send verification email
    const verificationURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${verificationToken}`;
    
    await payload.sendEmail({
      to: email,
      subject: generateVerificationEmailSubject(),
      html: generateVerificationEmailHTML({ 
        user: { name: user.name || 'there', email }, 
        token: verificationToken 
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while sending the verification email.' },
      { status: 500 }
    );
  }
}
