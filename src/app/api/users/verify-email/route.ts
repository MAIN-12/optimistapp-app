import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required.' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Find the user with this verification token
    const users = await payload.find({
      collection: 'users',
      where: {
        _verificationToken: {
          equals: token,
        },
      },
      limit: 1,
    });

    if (users.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token.' },
        { status: 400 }
      );
    }

    const user = users.docs[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token.' },
        { status: 400 }
      );
    }

    // Update user to mark as verified
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        _verified: true,
        _verificationToken: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during verification.' },
      { status: 500 }
    );
  }
}
