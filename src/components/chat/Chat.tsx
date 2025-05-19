"use client"
import React from "react";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";

import { FormattedText } from "./formatted-text";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-text-area"

import UserAvatar from "@/components/Auth/Avatar"
import { Button } from "@heroui/button";
import { Plus, TvIcon } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    agentKey?: string;
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

export const agents = [
    {
        key: "eagle",
        label: "Eagle",
        icon_url: "/assets/pictures/eagle.png",
        chat_url: "https://n8n.main12.com/webhook/4ff22a73-1d19-4c85-9e02-abc5ede8660a",
    },
    {
        key: "capybara",
        label: "Capybara",
        icon_url: "/assets/pictures/capivara.jpg",
        chat_url: "https://n8n.main12.com/webhook/c2763337-5186-420d-8068-9f0e7563d0be",
    },
    {
        key: "gpt",
        label: "Chat GPT 4o",
        icon_url: "https://cdn-icons-png.flaticon.com/512/11865/11865313.png",
        chat_url: "https://n8n.main12.com/webhook/3134e9ea-57c4-4c21-905b-21900ec13bef",
    },
    {
        key: "gemini",
        label: "Gemini",
        icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s",
        chat_url: "https://n8n.main12.com/webhook/3134e9ea-57c4-4c21-905b-21900ec13bef",
    },
    {
        key: "ollama  ",
        label: "Ollama  ",
        icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXeShWylhBDyM2zXYUZeB_qWE_G3Ehi4_WfQ&s",
        chat_url: "https://n8n.main12.com/webhook/3134e9ea-57c4-4c21-905b-21900ec13bef",
    },
    {
        key: "deepseek ",
        label: "Deepseek ",
        icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1FtoIs7pLGQzDJTbB33U9DaXZj3Pn-6c6uA&s",
        chat_url: "https://n8n.main12.com/webhook/3134e9ea-57c4-4c21-905b-21900ec13bef",
    },
];


export default function ChatInterface() {
    const [messages, setMessages] = React.useState<Message[]>([
        { role: "assistant", content: "Hello! How can I help you today?" },
    ]);
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
    const [currentThinkingIndex, setCurrentThinkingIndex] = React.useState(0);

    const [currentChatModel, setCurrentChatModel] = React.useState(agents[0]);

    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const randomNumber = Math.floor(Math.random() * thinkingMessages.length);
    const randomThinkingMessage = thinkingMessages[randomNumber];

    const [sessionId] = React.useState(() =>
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2) + Date.now().toString(36)
    );

    React.useEffect(() => {
        if (!isLoading) {
            setCurrentThinkingIndex(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentThinkingIndex((prev) => (prev + 1) % thinkingMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isLoading, thinkingMessages.length]);



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
    const placeholder = ["Ask something", "Ask something"];

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

                const response = await fetch(currentChatModel.chat_url,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: input,
                            sessionId: sessionId
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
                    content: messageContent || "I received your message but there was no response content.",
                    agentKey: currentChatModel.key
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } catch (error) {
                console.error("Error details:", error);
                const errorMessage: Message = {
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                    agentKey: currentChatModel.key
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
        <div className="flex items-center justify-center min-h-screen sm:px-4 w-full max-w-3xl mx-auto">
            <div
                className={`w-full ${!isFirstMessage && "h-screen"
                    } transition-all duration-500 flex flex-col overflow-hidden ${chatWithBackground &&
                    "sm:shadow-lg sm:rounded-lg bg-content1 dark:bg-content1"
                    }`}
            >
                <div id="main-chat" className={`${!isFirstMessage && "flex-grow"} overflow-y-auto p-4 scrollbar-hide`}>
                    {messages.map((message, index) => {

                        const agent = message.role === "assistant"
                            ? agents.find(a => a.key === message.agentKey) || agents[0]
                            : null;
                        return (
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
                                        <Avatar
                                            showFallback
                                            src={agent?.icon_url || "/assets/pictures/eagle.png"}
                                            className="mx-2 min-w-10"
                                        />)}
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
                        );
                    })}
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
                                    <Avatar showFallback src={currentChatModel.icon_url} className="mx-2 min-w-10" />

                                    <motion.h2
                                        className="text-default-500 flex items-center h-10"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    >
                                        {thinkingMessages[currentThinkingIndex]}
                                    </motion.h2>
                                </div>
                            </div>
                        )}
                        <div className="pb-3">
                            <PlaceholdersAndVanishInput
                                placeholders={isFirstMessage ? placeholders : placeholder}
                                onChange={handleChange}
                                onSubmit={onSubmit}
                                delay={isFirstMessage ? 3000 : 15000}
                            >
                                <div className="p-2">
                                    <Select
                                        className={`transition-all duration-200 ${isOpen ? "w-[200px]" : "w-[80px]"}`}
                                        items={agents}
                                        // label="Favorite Animal"
                                        variant="flat"
                                        onOpenChange={setIsOpen}
                                        selectedKeys={[currentChatModel.key]}
                                        selectionMode="single"
                                        defaultSelectedKeys={agents[0].key}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0];
                                            const selectedAgent = agents.find(agent => agent.key === selectedKey);
                                            if (selectedAgent) setCurrentChatModel(selectedAgent);
                                        }}
                                        renderValue={(items) => {
                                            const item = items[0];
                                            return item ? (
                                                <div className="flex items-center py-2">
                                                    <Avatar
                                                        showFallback
                                                        src={item.data?.icon_url}
                                                        size="sm"
                                                        className="shrink-0"
                                                    />
                                                </div>
                                            ) : null;
                                        }}
                                    >
                                        {(agent) =>
                                            <SelectItem key={agent.key} textValue={agent.label} >
                                                <div className="flex flex-row gap-3">
                                                    <Avatar showFallback src={agent.icon_url} size="sm" />
                                                    {agent.label}
                                                </div>
                                            </SelectItem>
                                        }
                                    </Select>
                                </div>
                            </PlaceholdersAndVanishInput>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}