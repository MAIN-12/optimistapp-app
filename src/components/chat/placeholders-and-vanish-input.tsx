import React from "react";
import { Textarea, Button } from "@heroui/react";
import { Send } from "lucide-react";

interface PlaceholdersAndVanishInputProps {
    placeholders: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    value: string;
    isLoading: boolean;
    onSend: () => void;
}

export function PlaceholdersAndVanishInput({
    placeholders,
    onChange,
    onSubmit,
    value,
    isLoading,
    onSend,
}: PlaceholdersAndVanishInputProps) {
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = React.useState(0);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [placeholders.length]);

    const handleKeyDown = (e: React.KeyboardEvent<any>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <form onSubmit={onSubmit} className="w-full">
            <Textarea
                ref={inputRef}
                value={value}
                onChange={onChange}
                placeholder={placeholders[currentPlaceholderIndex]}
                onKeyDown={handleKeyDown}
                minRows={1}
                maxRows={4}
                radius="full"
                className="w-full"
                endContent={
                    <Button
                        isIconOnly
                        radius="full"
                        color="primary"
                        variant="light"
                        onPress={onSend}
                        isLoading={isLoading}
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        <Send size={18} />
                    </Button>
                }
            />
        </form>
    );
}