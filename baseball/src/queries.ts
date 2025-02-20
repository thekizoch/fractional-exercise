import { type BaseballPlayer } from 'wasp/entities'
import { type GetBaseballPlayers } from 'wasp/server/operations'

export const getBaseballPlayers: GetBaseballPlayers<void, BaseballPlayer[]> = async (args, context) => {
  return context.entities.BaseballPlayer.findMany({
    orderBy: {
      playerName: 'asc'
    }
  })
} 