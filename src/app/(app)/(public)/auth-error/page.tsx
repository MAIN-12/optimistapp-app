"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@heroui/react"
import { AlertCircle, Home, RotateCcw, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Get Auth0 error parameters from URL (official Auth0 documentation parameters)
  const urlError = searchParams?.get("error")
  const urlErrorDescription = searchParams?.get("error_description")
  const clientId = searchParams?.get("client_id")
  const connection = searchParams?.get("connection")
  const lang = searchParams?.get("lang")
  const tracking = searchParams?.get("tracking")
  
  // Legacy/additional parameters for backward compatibility
  const urlErrorMessage = searchParams?.get("message")
  const errorReason = searchParams?.get("error_reason")
  const errorCode = searchParams?.get("error_code")
  const description = searchParams?.get("description")

  useEffect(() => {
    // Log the error to an error reporting service
    if (urlError) {
      console.error("Auth0 Error:", { 
        error: urlError, 
        error_description: urlErrorDescription,
        client_id: clientId,
        connection: connection,
        lang: lang,
        tracking: tracking,
        // Legacy parameters
        message: urlErrorMessage,
        error_reason: errorReason,
        error_code: errorCode,
        description: description
      })
    }
  }, [urlError, urlErrorDescription, clientId, connection, lang, tracking, urlErrorMessage, errorReason, errorCode, description])

  // Map Auth0 errors to user-friendly messages
  const getDisplayMessage = () => {
    if (urlError) {
      switch (urlError) {
        case "access_denied":
          return "Access Denied"
        case "unauthorized":
          return "Authentication Failed"
        case "login_required":
          return "Login Required"
        case "consent_required":
          return "Consent Required"
        case "invalid_request":
          return "Invalid Request"
        case "server_error":
          return "Server Error"
        case "temporarily_unavailable":
          return "Service Temporarily Unavailable"
        default:
          return urlErrorDescription || urlErrorMessage || "Authentication Error"
      }
    }
    return urlErrorDescription || urlErrorMessage || "Oops! Something unexpected happened"
  }

  const getDisplayDescription = () => {
    if (urlError) {
      switch (urlError) {
        case "access_denied":
          return "You don't have permission to access this resource. Please contact your administrator if you believe this is an error."
        case "unauthorized":
          return "Your authentication credentials are invalid or have expired. Please try logging in again."
        case "login_required":
          return "You need to log in to access this resource."
        case "consent_required":
          return "Additional consent is required to access this resource."
        case "invalid_request":
          return "The authentication request was invalid. Please try again."
        case "server_error":
          return "Our authentication service is experiencing issues. Please try again in a few moments."
        case "temporarily_unavailable":
          return "The authentication service is temporarily unavailable. Please try again later."
        default:
          return urlErrorDescription || urlErrorMessage || description || "An authentication error occurred."
      }
    }
    return urlErrorDescription || description || urlErrorMessage || "Don't worry, this happens sometimes. Let's try to get you back on track."
  }

  const displayMessage = getDisplayMessage()
  const displayDescription = getDisplayDescription()

  const handleGoHome = () => {
    router.push("/")
  }

  const handleTryAgain = () => {
    // If there's a URL error (Auth0 error), redirect to login
    if (urlError || urlErrorDescription || urlErrorMessage) {
      router.push("/api/auth/login")
    } else {
      // Redirect to login as fallback
      router.push("/api/auth/login")
    }
  }

  return (
    <div className="mt-10 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center space-y-6"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        >
          <AlertCircle className="h-10 w-10 text-danger" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-bold">{displayMessage}</h2>
          <div className="space-y-2">
            <p className="text-medium opacity-80">{displayDescription}</p>
            {urlError && (
              <div className="text-center">
                <button
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className="text-sm opacity-60 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center gap-1 mx-auto"
                >
                  <span>View technical details</span>
                  <motion.div
                    animate={{ rotate: isDetailsOpen ? 180 : 0 }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeInOut",
                      type: "spring",
                      stiffness: 200,
                      damping: 10
                    }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isDetailsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="text-xs opacity-60 p-3 rounded-lg bg-default-100 font-mono space-y-1 text-left">
                        {/* Official Auth0 parameters */}
                        {urlError && <div><strong>Error:</strong> {urlError}</div>}
                        {urlErrorDescription && <div><strong>Description:</strong> {urlErrorDescription}</div>}
                        {clientId && <div><strong>Client ID:</strong> {clientId}</div>}
                        {connection && <div><strong>Connection:</strong> {connection}</div>}
                        {lang && <div><strong>Language:</strong> {lang}</div>}
                        {tracking && <div><strong>Tracking ID:</strong> {tracking}</div>}
                        
                        {/* Legacy/additional parameters */}
                        {errorCode && <div><strong>Error Code:</strong> {errorCode}</div>}
                        {errorReason && <div><strong>Reason:</strong> {errorReason}</div>}
                        {urlErrorMessage && urlErrorMessage !== urlErrorDescription && (
                          <div><strong>Message:</strong> {urlErrorMessage}</div>
                        )}
                        {description && description !== urlErrorDescription && (
                          <div><strong>Additional Details:</strong> {description}</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center gap-3 pt-4"
        >
          <Button
            onPress={handleTryAgain}
            color="primary"
            startContent={<RotateCcw size={16} />}
          >
            {urlError || urlErrorDescription || urlErrorMessage ? "Try Logging In Again" : "Try Again"}
          </Button>
          {/* <Button onClick={handleGoHome} variant="bordered" className="w-full" startContent={<Home size={16} />}>
            Go to Home Page
          </Button> */}
        </motion.div>
      </motion.div>
    </div>
  )
}
