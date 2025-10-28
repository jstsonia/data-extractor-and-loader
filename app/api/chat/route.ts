import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()

    const systemPrompt = `You are a helpful Data Consumption Assistant for a data extraction and ETL platform. 
You have access to the user's current data consumption metrics:
- Total Storage: ${context.totalStorage} GB
- Monthly Cost: $${context.totalCost}
- Total API Calls: ${context.totalApiCalls.toLocaleString()}
- Growth Rate: ${context.growthRate}%

Data Sources Usage:
${context.dataSourcesUsage.map((ds: any) => `- ${ds.source}: ${ds.storage}GB storage, ${ds.calls.toLocaleString()} API calls, $${ds.cost} cost`).join("\n")}

Provide helpful, concise answers about data usage, costs, trends, and optimization recommendations. 
Be specific with numbers and percentages when relevant. Keep responses to 2-3 sentences unless more detail is needed.`

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 200,
    })

    return Response.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
