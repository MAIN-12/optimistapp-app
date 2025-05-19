"use client"
import React from "react";
import { Avatar } from "@heroui/react";
import { motion } from "framer-motion";

import { FormattedText } from "./formatted-text";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-text-area"

import UserAvatar from "@/components/Auth/Avatar"

type Message = {
    role: "user" | "assistant";
    content: string;
};

const thinkingMessages = [
    "Thinking...",
    "Processing your request...",
    "Analyzing your message...",
    "Considering the best response...",
    "Working on it...",
    "Generating a response...",
    "Just a moment...",
    "Almost there...",
    "Preparing an answer...",
];

export default function ChatInterface() {
    const [messages, setMessages] = React.useState<Message[]>([
        { role: "assistant", content: "Hello! How can I help you today?" },
    ]);
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    const randomNumber = Math.floor(Math.random() * thinkingMessages.length);
    const randomThinkingMessage = thinkingMessages[randomNumber];
    const isFirstMessage = messages.length === 1;
    const chatWithBackground = false;
    const controllWithBackground = false;

    const placeholders = [
        "How can I improve my product's user experience?",
        "What are the latest trends in my industry?",
        "Generate a compelling marketing copy for my brand.",
        "How can I optimize my logistics operations?",
        "What are some strategies to increase customer engagement?",
        "Can you create a detailed buyer persona for my target audience?",
    ];

    React.useEffect(() => {
        const handleResize = () => {
            if (typeof window !== "undefined" && window.innerWidth <= 640) {
                const isKeyboardOpen = window.innerHeight < window.outerHeight;
                setIsKeyboardVisible(isKeyboardOpen);
            } else {
                setIsKeyboardVisible(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesEndRef]);

    React.useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() && !isLoading) {
            setIsLoading(true);
            const userMessage: Message = { role: "user", content: input };
            setMessages((prev) => [...prev, userMessage]);
            setInput("");

            try {
                // Using the n8n webhook endpoint
                console.log("Sending request to webhook:", {
                    message: input,
                    sessionId: "123"
                });

                const response = await fetch(
                    "https://n8n.main12.com/webhook/4ff22a73-1d19-4c85-9e02-abc5ede8660a",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: input,
                            sessionId: "123" // Fixed sessionId as requested
                        }),
                    }
                );

                console.log("Response status:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Server error:", errorText);
                    throw new Error(`Server responded with ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                console.log("Raw webhook response:", data);

                // Enhanced response extraction specifically looking for the "output" field
                let messageContent;

                // Check if response has the expected format with "output" field
                if (data && typeof data === 'object') {
                    if (data.output) {
                        // Extract the message from the output field
                        messageContent = data.output;
                    } else if (data.result && typeof data.result === 'object') {
                        // For responses where the actual result is nested in a "result" property
                        messageContent = data.result.message || data.result.content ||
                            data.result.response || data.result.text ||
                            data.result.output || JSON.stringify(data.result);
                    } else if (data.data && typeof data.data === 'object') {
                        // For responses where the actual data is nested in a "data" property
                        messageContent = data.data.message || data.data.content ||
                            data.data.response || data.data.text ||
                            data.data.output || JSON.stringify(data.data);
                    } else if (data.message || data.content || data.response || data.text) {
                        // For direct response properties
                        messageContent = data.message || data.content || data.response || data.text;
                    } else if (data.payload && typeof data.payload === 'object') {
                        // For responses where the actual payload is nested in a "payload" property
                        messageContent = data.payload.message || data.payload.content ||
                            data.payload.response || data.payload.text ||
                            data.payload.output || JSON.stringify(data.payload);
                    } else {
                        // If we can't find a specific message field, show the full response
                        messageContent = JSON.stringify(data, null, 2);
                    }
                } else if (typeof data === 'string') {
                    messageContent = data;
                } else {
                    messageContent = "Received a response, but couldn't extract a message.";
                }

                console.log("Extracted message content:", messageContent);

                const assistantMessage: Message = {
                    role: "assistant",
                    content: messageContent || "I received your message but there was no response content."
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } catch (error) {
                console.error("Error details:", error);
                const errorMessage: Message = {
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSend();
    };

    return (
        <div className="flex items-center justify-center min-h-screen sm:p-4 w-full max-w-3xl mx-auto">
            <div
                className={`w-full ${!isFirstMessage && "sm:h-[700px] h-screen"
                    } transition-all duration-500 flex flex-col overflow-hidden ${chatWithBackground &&
                    "sm:shadow-lg sm:rounded-lg bg-content1 dark:bg-content1"
                    }`}
            >
                <div id="main-chat" className={`${!isFirstMessage && "flex-grow"} overflow-y-auto p-4 scrollbar-hide`}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                } mb-4`}
                        >
                            <div
                                className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                                    } items-start`}
                            >
                                {message.role === "user" ? (
                                    <UserAvatar className="mx-2 min-w-10" />
                                ) : (
                                    <Avatar showFallback src="/assets/pictures/capivara.jpg" className="mx-2 min-w-10" />
                                )}
                                <div
                                    className={`px-4 py-2 rounded-lg ${message.role === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                        }`}
                                >
                                    <FormattedText text={message.content} />
                                </div>
                                <div className="w-[150px]" />
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div
                    id="control-panel"
                    className={`p-4 ${isKeyboardVisible ? "sm:mb-0 mb-4" : "mb-0"
                        } ${controllWithBackground &&
                        "sm:rounded-lg bg-content1 dark:bg-content1"
                        }`}
                >
                    <div className="w-full relative">
                        {isLoading && (
                            <div className="absolute bottom-full left-0 w-full flex p-4">
                                <div className="flex flex-row items-start">
                                    <Avatar showFallback src="/assets/pictures/capivara.jpg" className="mx-2 min-w-10" />

                                    <motion.h2
                                        className="text-default-500 flex items-center h-10"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    >
                                        {randomThinkingMessage}
                                    </motion.h2>
                                </div>
                            </div>
                        )}
                        <div className="pb-3">
                            <PlaceholdersAndVanishInput
                                placeholders={placeholders}
                                onChange={handleChange}
                                onSubmit={onSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}