"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input, Spinner } from "@heroui/react"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchTerm) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`
        )
        const data = await response.json()
        setResults(data.query.search)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch search results");
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchResults, 500) // Debounce API call
    return () => clearTimeout(timeoutId) // Cleanup
  }, [searchTerm])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative">
          <Input
            className="max-w-3xl mx-auto"
            type="text"
            label="Search Wikipedia..."
            variant="bordered"
            endContent={<Search className="h-6 w-6 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading && <p className="text-center text-gray-500"><Spinner size="lg" /></p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="max-w-3xl mx-auto mt-4">
        {results.length > 0 && (
          <ul className="space-y-4">
            {results.map((result) => (
              <li key={result.pageid} className="border-b pb-2">
                <a
                  href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.title}
                </a>
                <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: result.snippet }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
