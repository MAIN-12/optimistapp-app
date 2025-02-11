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
            },
            security: [],
        },
    });
    return spec;
};
