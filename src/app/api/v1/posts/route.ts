import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { CreatePostRequest, PostsQueryParams, PostsListResponse, MessageType } from '@/types/api';

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     description: Retrieve a paginated list of posts with optional filtering and sorting
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of posts per page
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter posts by author ID
 *       - in: query
 *         name: circleId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter posts by circle ID
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter posts by category ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [POSITIVE, PRAYER, ENCOURAGEMENT, GRATITUDE, MOTIVATION, SUPPORT, ANNOUNCEMENT]
 *         description: Filter posts by message type
 *       - in: query
 *         name: isAnonymous
 *         schema:
 *           type: boolean
 *         description: Filter anonymous posts
 *       - in: query
 *         name: isPinned
 *         schema:
 *           type: boolean
 *         description: Filter pinned posts
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search posts by content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, reacts, comments]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PostResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params: PostsQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      authorId: searchParams.get('authorId') || undefined,
      circleId: searchParams.get('circleId') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      type: (searchParams.get('type') as MessageType) || undefined,
      isAnonymous: searchParams.get('isAnonymous') ? searchParams.get('isAnonymous') === 'true' : undefined,
      isPinned: searchParams.get('isPinned') ? searchParams.get('isPinned') === 'true' : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'reacts' | 'comments') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };

    // Build where clause
    const where: any = {};
    
    if (params.authorId) where.authorId = params.authorId;
    if (params.circleId) where.circleId = params.circleId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.type) where.type = params.type;
    if (params.isAnonymous !== undefined) where.isAnonymous = params.isAnonymous;
    if (params.isPinned !== undefined) where.isPinned = params.isPinned;
    if (params.search) {
      where.content = {
        contains: params.search,
        mode: 'insensitive'
      };
    }

    // Build sort clause
    const orderBy: any = {};
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';
    
    if (sortBy === 'reacts') {
      orderBy.reacts = { _count: sortOrder };
    } else if (sortBy === 'comments') {
      orderBy.comments = { _count: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.message.count({ where });

    // Fetch posts
    const posts = await prisma.message.findMany({
      where,
      orderBy,
      skip,
      take: params.limit,
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

    const totalPages = Math.ceil(total / limit);

    const response: PostsListResponse = {
      posts: posts.map((post: any) => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     description: Create a new post in the feed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post
 *                 maxLength: 2000
 *               type:
 *                 type: string
 *                 enum: [POSITIVE, PRAYER, ENCOURAGEMENT, GRATITUDE, MOTIVATION, SUPPORT, ANNOUNCEMENT]
 *                 default: POSITIVE
 *                 description: Type of the message
 *               circleId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the circle to post in (optional for global posts)
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the category to associate with
 *               isAnonymous:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the post should be anonymous
 *               isPinned:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the post should be pinned
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: CreatePostRequest = await request.json();

    // Validate required fields
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Content is required' },
        { status: 400 }
      );
    }

    if (body.content.length > 2000) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Content must be 2000 characters or less' },
        { status: 400 }
      );
    }

    // Create the post
    const newPost = await prisma.message.create({
      data: {
        content: body.content.trim(),
        type: body.type || 'POSITIVE',
        authorId: user.id,
        circleId: body.circleId || null,
        categoryId: body.categoryId || null,
        isAnonymous: body.isAnonymous || false,
        isPinned: body.isPinned || false
      },
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
      id: newPost.id,
      content: newPost.content,
      type: newPost.type as MessageType,
      authorId: newPost.authorId,
      circleId: newPost.circleId || undefined,
      categoryId: newPost.categoryId || undefined,
      isAnonymous: newPost.isAnonymous,
      isDaily: newPost.isDaily,
      isPinned: newPost.isPinned,
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString(),
      author: newPost.author,
      circle: newPost.circle || undefined,
      category: newPost.category || undefined,
      _count: newPost._count
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create post' },
      { status: 500 }
    );
  }
}