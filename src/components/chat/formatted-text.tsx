import type React from "react"

interface FormattedTextProps {
  text: string
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  const formatText = (input: string) => {
    // Split the text into paragraphs
    const paragraphs = input.split("\n\n")
    const hasMultipleParagraphs = paragraphs.length > 1;

    return paragraphs.map((paragraph, index) => {
      // Check if the paragraph is a subtitle
      if (paragraph.trim().startsWith("#")) {
        return formatSubtitle(paragraph, index)
      }
      // Check if the paragraph is a list
      else if (paragraph.trim().startsWith("- ")) {
        const listItems = paragraph.split("- ").filter((item) => item.trim() !== "")
        return (
          <ul key={index} className="list-disc list-inside mb-4">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{formatInlineBold(item.trim())}</li>
            ))}
          </ul>
        )
      } else {
        // Regular paragraph
        return (
          <p key={index} className={hasMultipleParagraphs ? "mb-4" : ""}>
            {formatInlineBold(paragraph)}
          </p>
        )
      }
    })
  }

  const formatSubtitle = (text: string, key: number) => {
    const trimmedText = text.trim()
    if (trimmedText.startsWith("### ")) {
      return (
        <h3 key={key} className="text-xl font-bold mb-2">
          {trimmedText.slice(4)}
        </h3>
      )
    } else if (trimmedText.startsWith("## ")) {
      return (
        <h2 key={key} className="text-2xl font-bold mb-3">
          {trimmedText.slice(3)}
        </h2>
      )
    } else if (trimmedText.startsWith("# ")) {
      return (
        <h1 key={key} className="text-3xl font-bold mb-4">
          {trimmedText.slice(2)}
        </h1>
      )
    }
    // If it doesn't match any heading format, treat it as a regular paragraph
    return (
      <p key={key} className="mb-4">
        {formatInlineBold(text)}
      </p>
    )
  }

  const formatInlineBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return <div>{formatText(text)}</div>
}


