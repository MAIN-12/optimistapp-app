/* eslint-disable no-console */
export const maxDuration = 60;

export class LangflowClient {
    private baseURL: string
    private applicationToken: string

    constructor(baseURL: string, applicationToken: string) {
        this.baseURL = baseURL
        this.applicationToken = applicationToken
    }

    async post(endpoint: string, body: any, headers: Record<string, string> = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`
        headers["Content-Type"] = "application/json"
        const url = `${this.baseURL}${endpoint}`
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            })

            const responseMessage = await response.json()
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`)
            }
            return responseMessage
        } catch (error: any) {
            console.error("Request Error:", error.message)
            throw error
        }
    }

    async initiateSession(
        flowId: string,
        langflowId: string,
        inputValue: string,
        inputType = "chat",
        outputType = "chat",
        stream = false,
        tweaks = {},
    ) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`
        return this.post(endpoint, {
            input_value: inputValue,
            input_type: inputType,
            output_type: outputType,
            tweaks: tweaks,
        })
    }

    async runFlow(
        flowIdOrName: string,
        langflowId: string,
        inputValue: string,
        inputType = "chat",
        outputType = "chat",
        tweaks = {},
        stream = false,
    ) {
        try {
            const initResponse = await this.initiateSession(
                flowIdOrName,
                langflowId,
                inputValue,
                inputType,
                outputType,
                stream,
                tweaks,
            )
            console.log("Init Response:", initResponse)
            return initResponse
        } catch (error) {
            console.error("Error running flow:", error)
            throw error
        }
    }
}

