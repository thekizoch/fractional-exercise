type UpdatePlayerInput = {
  id: number
  playerName: string
  position: string
  games: number
  atBat: number
  runs: number
  hits: number
  doubles: number
  thirdBaseman: number
  homeRun: number
  runBattedIn: number
  walks: number
  strikeouts: number
  stolenBase: number
  caughtStealing: string
  avg: number
  onBasePercentage: number
  sluggingPercentage: number
  onBasePlusSlugging: number
}

export const updatePlayer = async (args: UpdatePlayerInput, context: any) => {
  if (!context.entities) {
    throw new Error('No database context available')
  }

  const { id, ...updateData } = args

  await context.entities.BaseballPlayer.update({
    where: { id },
    data: updateData
  })
} 