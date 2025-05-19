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
      const trimmed = paragraph.trim();

      // Check if the paragraph is a subtitle
      if (trimmed.startsWith("#")) {
        return formatSubtitle(paragraph, index)
      }

      // Check if the paragraph is a bullet list
      if (trimmed.startsWith("- ")) {
        const listItems = paragraph.split("- ").filter((item) => item.trim() !== "")
        return (
          <ul key={index} className="list-disc list-inside mb-4">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{formatInlineBold(item.trim())}</li>
            ))}
          </ul>
        )
      }

      // Check if the paragraph is a numbered list (e.g., 1. ...)
      if (/^\d+\.\s/.test(trimmed)) {
        // Split into lines, filter out empty, and only lines that start with number-dot-space
        const listItems = paragraph
          .split("\n")
          .map(line => line.trim())
          .filter(line => /^\d+\.\s/.test(line));
        return (
          <ol key={index} className="list-decimal list-inside mb-4">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>
                {formatInlineBold(item.replace(/^\d+\.\s/, ""))}
              </li>
            ))}
          </ol>
        )
      }

      // Regular paragraph
      return (
        <p key={index} className={hasMultipleParagraphs ? "mb-4" : ""}>
          {formatInlineBold(paragraph)}
        </p>
      )
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
    // First, split by bold (**...**)
    const boldParts = text.split(/(\*\*.*?\*\*)/g)
    return boldParts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      // Now, handle links inside non-bold parts
      // Markdown link: [text](url)
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
      const segments: React.ReactNode[] = []
      let lastIndex = 0
      let match: RegExpExecArray | null
      let segIndex = 0
      while ((match = linkRegex.exec(part)) !== null) {
        // Text before the link
        if (match.index > lastIndex) {
          segments.push(part.slice(lastIndex, match.index))
        }
        // The link itself
        segments.push(
          <a
            key={`link-${index}-${segIndex++}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {match[1]}
          </a>
        )
        lastIndex = match.index + match[0].length
      }
      // Any remaining text after the last link
      if (lastIndex < part.length) {
        segments.push(part.slice(lastIndex))
      }
      // If no links, just return the part as is
      return segments.length > 0 ? segments : part
    })
  }

  return <div>{formatText(text)}</div>
}


