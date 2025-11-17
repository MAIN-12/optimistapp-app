import { NextRequest, NextResponse } from 'next/server';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { ApiErrorHandler } from '@/lib/api-utils';

/**
 * @swagger
 * /api/v1/journal-entries:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journal Entries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               mood:
 *                 type: string
 *               author:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *               gratefulFor:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: string
 *               dailyWins:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     win:
 *                       type: string
 *               reflectionPrompt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Journal entry created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, mood, author, isPrivate, gratefulFor, dailyWins, reflectionPrompt } = body;

    // Validation
    if (!content) {
      return ApiErrorHandler.badRequest('Content is required', [
        { field: 'content', message: 'Content cannot be empty' }
      ]);
    }

    if (!author) {
      return ApiErrorHandler.badRequest('Author is required', [
        { field: 'author', message: 'Author ID is required' }
      ]);
    }

    const payload = await getPayload({ config: configPromise });

    // Create the journal entry
    const entry = await payload.create({
      collection: 'journal-entries',
      data: {
        title,
        content,
        mood,
        author,
        isPrivate: isPrivate !== undefined ? isPrivate : true,
        gratefulFor,
        dailyWins,
        reflectionPrompt,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Journal entry created successfully',
        data: entry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return ApiErrorHandler.internalServerError(
      error instanceof Error ? error.message : 'Failed to create journal entry'
    );
  }
}

/**
 * @swagger
 * /api/v1/journal-entries:
 *   get:
 *     summary: Get journal entries for the authenticated user
 *     tags: [Journal Entries]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of journal entries
 *       401:
 *         description: Unauthorized
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    if (!userId) {
      return ApiErrorHandler.badRequest('User ID is required');
    }

    const payload = await getPayload({ config: configPromise });

    const entries = await payload.find({
      collection: 'journal-entries',
      where: {
        'author.id': {
          equals: userId,
        },
      },
      limit,
      page,
      sort: '-createdAt',
    });

    return NextResponse.json({
      success: true,
      data: entries.docs,
      pagination: {
        totalDocs: entries.totalDocs,
        limit: entries.limit,
        page: entries.page,
        totalPages: entries.totalPages,
        hasNextPage: entries.hasNextPage,
        hasPrevPage: entries.hasPrevPage,
      },
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return ApiErrorHandler.internalServerError(
      error instanceof Error ? error.message : 'Failed to fetch journal entries'
    );
  }
}
