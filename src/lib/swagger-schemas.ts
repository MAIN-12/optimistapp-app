/**
 * @swagger
 * components:
 *   schemas:
 *     MessageType:
 *       type: string
 *       enum:
 *         - POSITIVE
 *         - PRAYER
 *         - ENCOURAGEMENT
 *         - GRATITUDE
 *         - MOTIVATION
 *         - SUPPORT
 *         - ANNOUNCEMENT
 *       description: Type of message/post
 *     
 *     PostAuthor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User ID
 *         name:
 *           type: string
 *           nullable: true
 *           description: User's full name
 *         nickname:
 *           type: string
 *           nullable: true
 *           description: User's nickname
 *         picture:
 *           type: string
 *           nullable: true
 *           description: User's profile picture URL
 *     
 *     PostCircle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Circle ID
 *         name:
 *           type: string
 *           description: Circle name
 *         description:
 *           type: string
 *           nullable: true
 *           description: Circle description
 *         icon:
 *           type: string
 *           nullable: true
 *           description: Circle icon/emoji
 *     
 *     PostCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           nullable: true
 *           description: Category description
 *         icon:
 *           type: string
 *           nullable: true
 *           description: Category icon/emoji
 *     
 *     PostCounts:
 *       type: object
 *       properties:
 *         comments:
 *           type: integer
 *           description: Number of comments on the post
 *         reacts:
 *           type: integer
 *           description: Number of reactions on the post
 *         favorites:
 *           type: integer
 *           description: Number of times the post has been favorited
 *     
 *     PostResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         type:
 *           $ref: '#/components/schemas/MessageType'
 *         authorId:
 *           type: string
 *           format: uuid
 *           description: ID of the post author
 *         circleId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the circle (if posted in a circle)
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the category
 *         isAnonymous:
 *           type: boolean
 *           description: Whether the post is anonymous
 *         isDaily:
 *           type: boolean
 *           description: Whether this is a daily inspirational message
 *         isPinned:
 *           type: boolean
 *           description: Whether the post is pinned
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the post was last updated
 *         author:
 *           $ref: '#/components/schemas/PostAuthor'
 *         circle:
 *           $ref: '#/components/schemas/PostCircle'
 *           nullable: true
 *         category:
 *           $ref: '#/components/schemas/PostCategory'
 *           nullable: true
 *         _count:
 *           $ref: '#/components/schemas/PostCounts'
 *       required:
 *         - id
 *         - content
 *         - type
 *         - authorId
 *         - isAnonymous
 *         - isDaily
 *         - isPinned
 *         - createdAt
 *         - updatedAt
 *     
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Current page number
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *         total:
 *           type: integer
 *           description: Total number of items
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *         hasNext:
 *           type: boolean
 *           description: Whether there are more pages
 *         hasPrev:
 *           type: boolean
 *           description: Whether there are previous pages
 *       required:
 *         - page
 *         - limit
 *         - total
 *         - totalPages
 *         - hasNext
 *         - hasPrev
 *     
 *     CreatePostRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the post
 *           maxLength: 2000
 *         type:
 *           $ref: '#/components/schemas/MessageType'
 *           default: POSITIVE
 *         circleId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the circle to post in (optional for global posts)
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the category to associate with
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *           description: Whether the post should be anonymous
 *         isPinned:
 *           type: boolean
 *           default: false
 *           description: Whether the post should be pinned
 *       required:
 *         - content
 *     
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The updated content of the post
 *           maxLength: 2000
 *         type:
 *           $ref: '#/components/schemas/MessageType'
 *         circleId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the circle to post in
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the category to associate with
 *         isAnonymous:
 *           type: boolean
 *           description: Whether the post should be anonymous
 *         isPinned:
 *           type: boolean
 *           description: Whether the post should be pinned
 *     
 *     ApiError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error type/category
 *         message:
 *           type: string
 *           description: Human-readable error message
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the error occurred
 *       required:
 *         - error
 *         - message
 *         - statusCode
 *         - timestamp
 *     
 *     ValidationError:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiError'
 *         - type: object
 *           properties:
 *             validationErrors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                     description: The field that failed validation
 *                   message:
 *                     type: string
 *                     description: Validation error message
 *                 required:
 *                   - field
 *                   - message
 *   
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Auth0 JWT token
 * 
 * security:
 *   - BearerAuth: []
 */

// This file contains only Swagger documentation schemas
// The actual interfaces are defined in /src/types/api.ts
export {};