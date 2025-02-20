import { GoogleGenerativeAI } from '@google/generative-ai'
import { type GeneratePlayerDescription } from 'wasp/server/operations'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set')
}

const apiKey = process.env.GEMINI_API_KEY.trim()
console.log('API Key length:', apiKey.length)
console.log('API Key starts with:', apiKey.substring(0, 8))

const genAI = new GoogleGenerativeAI(apiKey)

export const generatePlayerDescription: GeneratePlayerDescription<{
  playerName: string,
  stats: {
    games: number,
    hits: number,
    hitsPerSeason: number,
    avg: number,
    homeRun: number,
    runBattedIn: number,
    stolenBase: number,
    onBasePercentage: number,
    sluggingPercentage: number,
    onBasePlusSlugging: number,
    position: string
  }
}, string> = async ({ playerName, stats }) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Generate a detailed baseball player description for ${playerName}. Here are their career statistics:
    - Position: ${stats.position}
    - Games Played: ${stats.games}
    - Total Hits: ${stats.hits}
    - Hits Per Season: ${stats.hitsPerSeason}
    - Batting Average: ${stats.avg}
    - Home Runs: ${stats.homeRun}
    - RBIs: ${stats.runBattedIn}
    - Stolen Bases: ${stats.stolenBase}
    - On-base Percentage: ${stats.onBasePercentage}
    - Slugging Percentage: ${stats.sluggingPercentage}
    - OPS: ${stats.onBasePlusSlugging}

    Please provide a comprehensive analysis of their career, highlighting their achievements, playing style, and how their statistics compare to other players. Focus on their most impressive stats and what made them stand out. Keep the tone professional but engaging, and aim for about 2-3 paragraphs.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error) {
    console.error('Error details:', {
      error: error.message,
      stack: error.stack,
      apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'not set'
    })
    throw new Error('Failed to generate player description. Please try again.')
  }
} 