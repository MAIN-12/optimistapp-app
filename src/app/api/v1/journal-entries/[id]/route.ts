import { NextRequest, NextResponse } from 'next/server';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { ApiErrorHandler } from '@/lib/api-utils';

/**
 * @swagger
 * /api/v1/journal-entries/{id}:
 *   get:
 *     summary: Get a specific journal entry by ID
 *     tags: [Journal Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journal entry details
 *       404:
 *         description: Entry not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({ config: configPromise });

    const entry = await payload.findByID({
      collection: 'journal-entries',
      id,
    });

    if (!entry) {
      return ApiErrorHandler.notFound('Journal entry not found');
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return ApiErrorHandler.internalServerError(
      error instanceof Error ? error.message : 'Failed to fetch journal entry'
    );
  }
}

/**
 * @swagger
 * /api/v1/journal-entries/{id}:
 *   patch:
 *     summary: Update a journal entry
 *     tags: [Journal Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               mood:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Journal entry updated successfully
 *       404:
 *         description: Entry not found
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = await getPayload({ config: configPromise });

    const entry = await payload.update({
      collection: 'journal-entries',
      id,
      data: body,
    });

    return NextResponse.json({
      success: true,
      message: 'Journal entry updated successfully',
      data: entry,
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return ApiErrorHandler.internalServerError(
      error instanceof Error ? error.message : 'Failed to update journal entry'
    );
  }
}

/**
 * @swagger
 * /api/v1/journal-entries/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journal Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journal entry deleted successfully
 *       404:
 *         description: Entry not found
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({ config: configPromise });

    await payload.delete({
      collection: 'journal-entries',
      id,
    });

    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return ApiErrorHandler.internalServerError(
      error instanceof Error ? error.message : 'Failed to delete journal entry'
    );
  }
}
