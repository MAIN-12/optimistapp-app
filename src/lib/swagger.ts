import { createSwaggerSpec } from "next-swagger-doc";

import { siteConfig } from "@/config/site";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "src/app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: `${siteConfig.name} API docs`,
                version: "1.0",
                description: `Welcome to the **${siteConfig.name} API documentation**. This is a development build based on the **Main 12 app template V1.1**. Here, you can find some available endpoints, request formats, and responses. If you have any issues or questions, feel free to reach out to our support team at **info@main12.com**.`,
                contact: {
                    name: "Main 12",
                    email: "info@main12.com",
                    url: "http://main12.com",
                },
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
                schemas: {
                    MessageType: {
                        type: "string",
                        enum: [
                            "POSITIVE",
                            "PRAYER", 
                            "ENCOURAGEMENT",
                            "GRATITUDE",
                            "MOTIVATION",
                            "SUPPORT",
                            "ANNOUNCEMENT"
                        ],
                        description: "Type of message/post"
                    },
                    PostAuthor: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid",
                                description: "User ID"
                            },
                            name: {
                                type: "string",
                                nullable: true,
                                description: "User's full name"
                            },
                            nickname: {
                                type: "string", 
                                nullable: true,
                                description: "User's nickname"
                            },
                            picture: {
                                type: "string",
                                nullable: true,
                                description: "User's profile picture URL"
                            }
                        }
                    },
                    PostCircle: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid",
                                description: "Circle ID"
                            },
                            name: {
                                type: "string",
                                description: "Circle name"
                            },
                            description: {
                                type: "string",
                                nullable: true,
                                description: "Circle description"
                            },
                            icon: {
                                type: "string",
                                nullable: true,
                                description: "Circle icon/emoji"
                            }
                        }
                    },
                    PostCategory: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid",
                                description: "Category ID"
                            },
                            name: {
                                type: "string",
                                description: "Category name"
                            },
                            description: {
                                type: "string",
                                nullable: true,
                                description: "Category description"
                            },
                            icon: {
                                type: "string",
                                nullable: true,
                                description: "Category icon/emoji"
                            }
                        }
                    },
                    PostCounts: {
                        type: "object",
                        properties: {
                            comments: {
                                type: "integer",
                                description: "Number of comments on the post"
                            },
                            reacts: {
                                type: "integer", 
                                description: "Number of reactions on the post"
                            },
                            favorites: {
                                type: "integer",
                                description: "Number of times the post has been favorited"
                            }
                        }
                    },
                    PostResponse: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                format: "uuid",
                                description: "Unique identifier for the post"
                            },
                            content: {
                                type: "string",
                                description: "The content of the post"
                            },
                            type: {
                                $ref: "#/components/schemas/MessageType"
                            },
                            authorId: {
                                type: "string",
                                format: "uuid", 
                                description: "ID of the post author"
                            },
                            circleId: {
                                type: "string",
                                format: "uuid",
                                nullable: true,
                                description: "ID of the circle (if posted in a circle)"
                            },
                            categoryId: {
                                type: "string",
                                format: "uuid",
                                nullable: true,
                                description: "ID of the category"
                            },
                            isAnonymous: {
                                type: "boolean",
                                description: "Whether the post is anonymous"
                            },
                            isDaily: {
                                type: "boolean",
                                description: "Whether this is a daily inspirational message"
                            },
                            isPinned: {
                                type: "boolean",
                                description: "Whether the post is pinned"
                            },
                            createdAt: {
                                type: "string",
                                format: "date-time",
                                description: "When the post was created"
                            },
                            updatedAt: {
                                type: "string",
                                format: "date-time", 
                                description: "When the post was last updated"
                            },
                            author: {
                                $ref: "#/components/schemas/PostAuthor"
                            },
                            circle: {
                                allOf: [
                                    { $ref: "#/components/schemas/PostCircle" }
                                ],
                                nullable: true
                            },
                            category: {
                                allOf: [
                                    { $ref: "#/components/schemas/PostCategory" }
                                ],
                                nullable: true
                            },
                            _count: {
                                $ref: "#/components/schemas/PostCounts"
                            }
                        },
                        required: [
                            "id",
                            "content", 
                            "type",
                            "authorId",
                            "isAnonymous",
                            "isDaily",
                            "isPinned",
                            "createdAt",
                            "updatedAt"
                        ]
                    },
                    Pagination: {
                        type: "object",
                        properties: {
                            page: {
                                type: "integer",
                                description: "Current page number"
                            },
                            limit: {
                                type: "integer",
                                description: "Number of items per page"
                            },
                            total: {
                                type: "integer",
                                description: "Total number of items"
                            },
                            totalPages: {
                                type: "integer",
                                description: "Total number of pages"
                            },
                            hasNext: {
                                type: "boolean",
                                description: "Whether there are more pages"
                            },
                            hasPrev: {
                                type: "boolean", 
                                description: "Whether there are previous pages"
                            }
                        },
                        required: [
                            "page",
                            "limit", 
                            "total",
                            "totalPages",
                            "hasNext",
                            "hasPrev"
                        ]
                    }
                }
            },
            security: [],
        },
    });
    return spec;
};
