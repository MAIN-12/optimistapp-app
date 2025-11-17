"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button, Card, CardBody, CardHeader } from "@heroui/react"
import { AlertCircle, Home, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get error message from URL parameters (for Auth0 or other external errors)
  const urlErrorMessage = searchParams?.get("message")
  const urlErrorDescription = searchParams?.get("description")

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  // Determine which error message to display with friendly messages
  const displayMessage = urlErrorMessage || "Oops! Something unexpected happened"
  const displayDescription =
    urlErrorDescription || error?.message || "Don't worry, this happens sometimes. Let's try to get you back on track."

  const handleGoHome = () => {
    router.push("/")
  }

  const handleTryAgain = () => {
    // If there's a URL error message, refresh the page instead of using reset
    if (urlErrorMessage) {
      window.location.reload()
    } else {
      reset()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">

          <div className="space-y-3 mx-auto">
            <div className="flex items-center space-x-3 justify-between">
              <AlertCircle className="h-10 w-10 text-danger" />
              <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
            </div>
            <div className="space-y-2">
              <p className="text-medium opacity-80">We encountered an unexpected error</p>
              {displayDescription && (
                <details className="text-left">
                  <summary className="text-sm opacity-60 cursor-pointer hover:opacity-80 transition-opacity">
                    View technical details
                  </summary>
                  <p className="text-xs opacity-60 mt-2 p-3 rounded-lg bg-default-100 font-mono">
                    {displayDescription}
                  </p>
                </details>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="space-y-3">
            <Button onPress={handleTryAgain} color="primary" className="w-full" startContent={<RotateCcw size={16} />}>
              Try Again
            </Button>
            <Button onPress={handleGoHome} variant="bordered" className="w-full" startContent={<Home size={16} />}>
              Go to Home Page
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
