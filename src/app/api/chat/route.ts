/* eslint-disable no-console */

import { type NextRequest, NextResponse } from "next/server"

import { LangflowClient } from "@/utils/LangflowClient";

export const maxDuration = 60;


export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const flowIdOrName = "c61a5270-8dbe-49d3-b225-6d77d277919f"
  const langflowId = "717b0268-ad43-438e-a0dc-27a5a0739987"
  const applicationToken = process.env.ASTRA_DB_KEY

  if (!applicationToken) {
    return NextResponse.json({ error: "ASTRA_DB_KEY is not set" }, { status: 500 })
  }

  const langflowClient = new LangflowClient("https://api.langflow.astra.datastax.com", applicationToken)

  try {
    const tweaks = {
      "ChatInput-KFhyC": {},
      "ParseData-Hp4rY": {},
      "Prompt-RNGaq": {},
      "SplitText-TbcX4": {},
      "OpenAIModel-o6EeY": {},
      "ChatOutput-JTwnB": {},
      "AstraDB-40bXB": {},
      "OpenAIEmbeddings-btDKE": {},
      "AstraDB-z67uc": {},
      "OpenAIEmbeddings-Q1iP0": {},
      "File-H9GTN": {},
    }

    const response = await langflowClient.runFlow(flowIdOrName, langflowId, message, "chat", "chat", tweaks, false)

    if (response && response.outputs) {
      const flowOutputs = response.outputs[0]
      const firstComponentOutputs = flowOutputs.outputs[0]
      const output = firstComponentOutputs.outputs.message

      return NextResponse.json({ message: output.message.text })
    } else {
      return NextResponse.json({ error: "Unexpected response format" }, { status: 500 })
    }
  } catch (error) {
    console.error("Chat API Error", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

