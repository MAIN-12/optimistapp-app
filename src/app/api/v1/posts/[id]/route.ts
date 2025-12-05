import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { UpdatePostRequest, MessageType } from '@/types/api';

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get a specific post
 *     description: Retrieve a single post by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await prisma.message.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nickname: true,
            picture: true
          }
        },
        circle: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true
          }
        },
        _count: {
          select: {
            comments: true,
            reacts: true,
            favorites: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Post not found' },
        { status: 404 }
      );
    }

    const response = {
      id: post.id,
      content: post.content,
      type: post.type as MessageType,
      authorId: post.authorId,
      circleId: post.circleId || undefined,
      categoryId: post.categoryId || undefined,
      isAnonymous: post.isAnonymous,
      isDaily: post.isDaily,
      isPinned: post.isPinned,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: post.author,
      circle: post.circle || undefined,
      category: post.category || undefined,
      _count: post._count
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Update a specific post
 *     description: Update a post by its ID (only the author can update their own posts)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the post
 *                 maxLength: 2000
 *               type:
 *                 type: string
 *                 enum: [POSITIVE, PRAYER, ENCOURAGEMENT, GRATITUDE, MOTIVATION, SUPPORT, ANNOUNCEMENT]
 *                 description: Type of the message
 *               circleId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the circle to post in
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the category to associate with
 *               isAnonymous:
 *                 type: boolean
 *                 description: Whether the post should be anonymous
 *               isPinned:
 *                 type: boolean
 *                 description: Whether the post should be pinned
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions (not the post author)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: postId } = await params;
    const body: UpdatePostRequest = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Validate content length if provided
    if (body.content && body.content.length > 2000) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Content must be 2000 characters or less' },
        { status: 400 }
      );
    }

    // Check if post exists and user is the author
    const existingPost = await prisma.message.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You can only update your own posts' },
        { status: 403 }
      );
    }

    // Build update data (only include fields that are provided)
    const updateData: any = {};
    if (body.content !== undefined) updateData.content = body.content.trim();
    if (body.type !== undefined) updateData.type = body.type;
    if (body.circleId !== undefined) updateData.circleId = body.circleId;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.isAnonymous !== undefined) updateData.isAnonymous = body.isAnonymous;
    if (body.isPinned !== undefined) updateData.isPinned = body.isPinned;

    // Update the post
    const updatedPost = await prisma.message.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nickname: true,
            picture: true
          }
        },
        circle: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true
          }
        },
        _count: {
          select: {
            comments: true,
            reacts: true,
            favorites: true
          }
        }
      }
    });

    const response = {
      id: updatedPost.id,
      content: updatedPost.content,
      type: updatedPost.type as MessageType,
      authorId: updatedPost.authorId,
      circleId: updatedPost.circleId || undefined,
      categoryId: updatedPost.categoryId || undefined,
      isAnonymous: updatedPost.isAnonymous,
      isDaily: updatedPost.isDaily,
      isPinned: updatedPost.isPinned,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
      author: updatedPost.author,
      circle: updatedPost.circle || undefined,
      category: updatedPost.category || undefined,
      _count: updatedPost._count
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete a specific post
 *     description: Delete a post by its ID (only the author can delete their own posts)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The post ID
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions (not the post author)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // User is already authenticated via getAuthenticatedUser

    // Check if post exists and user is the author
    const existingPost = await prisma.message.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You can only delete your own posts' },
        { status: 403 }
      );
    }

    // Delete the post (this will cascade to related records like comments, reacts, etc.)
    await prisma.message.delete({
      where: { id: postId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to delete post' },
      { status: 500 }
    );
  }
}