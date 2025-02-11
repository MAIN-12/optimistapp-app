"use client";

import React from "react";
import { Button, Input, Textarea, Spacer } from "@heroui/react";
import { motion } from "framer-motion";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useTranslations } from "next-intl";

interface HelpRequestData {
    user?: any;
    title: string;
    description: string;
    location: string;
    type: string;
}

const RequestHelp: React.FC = () => {
    const { user } = useUser();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("")
    const t = useTranslations("RequestHelp");
    const type = "Support Request";

    React.useEffect(() => {
        setLocation(window.location.href);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        const formData: HelpRequestData = { title, user, description, location, type };

        try {
            const response = await fetch("/api/support/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage(t("successMessage"));
                setErrorMessage("");
                resetForm();
            } else {
                throw new Error(result.error || "Failed to submit feature request");
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`An error occurred: ${error.message}`)
            } else {
                setErrorMessage("An unknown error occurred. Please try again.")
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setLocation(window.location.href);
    };

    return (
        <motion.div
            className="container mx-auto px-2"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="mb-3">{t("description")}</p>
            <form onSubmit={handleSubmit}>
                <Input label={t("helpTitle")} value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
                <Spacer y={3} />
                <Textarea
                    label={t("descriptionLabel")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                />

                <Spacer y={3} />
                <Button type="submit" disabled={isSubmitting} fullWidth color="primary" className="text-black">
                    {isSubmitting ? t("submitting") : t("submitButton")}
                </Button>
            </form>
            {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        </motion.div>
    );
};

export default RequestHelp;