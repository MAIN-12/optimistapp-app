"use client"

import React from "react"
import { Button, Input, Textarea, Spacer, RadioGroup, Radio } from "@heroui/react"
import { motion } from "framer-motion"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useTranslations } from "next-intl"
import { Disclaimer } from "./Disclaimer"

interface FeedbackFormData {
  user?: any
  title: string
  description: string
  location: string
  type: string
}

const ProvideFeedback: React.FC = () => {
  const { user } = useUser()
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isCurrentPage, setIsCurrentPage] = React.useState("yes")
  const [location, setLocation] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const t = useTranslations("ProvideFeedback")
  const type = "Feedback";

  React.useEffect(() => {
    setLocation(window.location.href)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData: FeedbackFormData = { title, user, description, location, type }

    try {
      const response = await fetch("/api/support/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccessMessage("Feedback submitted successfully.")
        setErrorMessage("");
        resetForm();
      } else {
        throw new Error(result.error || "Failed to submit feedback")
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`An error occurred: ${error.message}`)
      } else {
        setErrorMessage("An unknown error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLocation(window.location.href)
    setIsCurrentPage("yes")
  }

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
        <Input label={t("feedbackTitle")} value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
        <Spacer y={3} />
        <Textarea
          label={t("descriptionLabel")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
        />
        <Spacer y={3} />
        <RadioGroup
          label={t("currentPageQuestion")}
          value={isCurrentPage}
          onValueChange={setIsCurrentPage}
          orientation="horizontal"
        >
          <Radio value="yes">{t("yes")}</Radio>
          <Radio value="no">{t("no")}</Radio>
        </RadioGroup>
        <Spacer y={3} />
        {isCurrentPage === "no" && (
          <Input
            label={t("feedbackLocation")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            fullWidth
          />
        )}
        <Spacer y={3} />
        <Button type="submit" disabled={isSubmitting} fullWidth color="primary">
          {isSubmitting ? t("submitting") : t("submitButton")}
        </Button>
        <Disclaimer />
      </form>
      {successMessage && <p className="text-green-600 mt-4">{t("successMessage")}</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </motion.div>
  )
}

export default ProvideFeedback

