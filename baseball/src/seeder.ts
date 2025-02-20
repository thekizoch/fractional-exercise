import { prisma } from 'wasp/server'

interface BaseballPlayerData {
  'Player name': string;
  position: string;
  Games: number;
  'At-bat': number;
  Runs: number;
  Hits: number;
  'Double (2B)': number;
  'third baseman': number;
  'home run': number;
  'run batted in': number;
  'a walk': number;
  Strikeouts: number;
  'stolen base': number;
  'Caught stealing': string | number;
  AVG: number;
  'On-base Percentage': number;
  'Slugging Percentage': number;
  'On-base Plus Slugging': number;
}

export const seedBaseballData = async () => {
  try {
    // First, clear existing data
    await prisma.baseballPlayer.deleteMany();

    // Fetch data from API
    const response = await fetch('https://api.hirefraction.com/api/test/baseball');
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const players: BaseballPlayerData[] = await response.json();

    // Transform and insert data
    const transformedPlayers = players.map(player => ({
      playerName: player['Player name'],
      position: player.position,
      games: player.Games,
      atBat: player['At-bat'],
      runs: player.Runs,
      hits: player.Hits,
      doubles: player['Double (2B)'],
      thirdBaseman: player['third baseman'],
      homeRun: player['home run'],
      runBattedIn: player['run batted in'],
      walks: player['a walk'],
      strikeouts: player.Strikeouts,
      stolenBase: player['stolen base'],
      caughtStealing: String(player['Caught stealing']),
      avg: player.AVG,
      onBasePercentage: player['On-base Percentage'],
      sluggingPercentage: player['Slugging Percentage'],
      onBasePlusSlugging: player['On-base Plus Slugging']
    }));

    // Insert all players
    await prisma.baseballPlayer.createMany({
      data: transformedPlayers
    });

    return { success: true, message: `Successfully seeded ${transformedPlayers.length} players` };
  } catch (error) {
    console.error('Error seeding baseball data:', error);
    return { success: false, message: error.message };
  }
}; 