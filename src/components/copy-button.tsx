"use client"

import { useState } from "react"
import { Check, Clipboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy text: ", error)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={copy}>
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? "Copied!" : "Copy to clipboard"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
