import { seedBaseball, getBaseballPlayers, useQuery } from 'wasp/client/operations'
import { useState, useMemo } from 'react'
import './Main.css'

export const MainPage = () => {
  const { data: players, isLoading, error } = useQuery(getBaseballPlayers)
  const [sortField, setSortField] = useState('hitsPerSeason')
  const [sortDirection, setSortDirection] = useState('desc')

  const handleSeed = async () => {
    try {
      const result = await seedBaseball({})
      window.alert(result.message)
    } catch (error) {
      window.alert('Error seeding database: ' + error.message)
    }
  }

  const calculateHitsPerSeason = (hits, games) => {
    return (hits / (games / 162)).toFixed(1)
  }

  const sortedPlayers = useMemo(() => {
    if (!players) return []
    
    const enrichedPlayers = players.map(player => ({
      ...player,
      hitsPerSeason: parseFloat(calculateHitsPerSeason(player.hits, player.games))
    }))

    return [...enrichedPlayers].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue
    })
  }, [players, sortField, sortDirection])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null
    return <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
  }

  return (
    <div className="container">
      <main>
        <h1>Baseball Stats App</h1>
        <button 
          onClick={handleSeed}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          Seed Baseball Data
        </button>

        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {sortedPlayers.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginTop: '20px',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                  <th style={tableHeaderStyle}>Rank</th>
                  <th style={tableHeaderStyle}>Player Name</th>
                  <th style={tableHeaderStyle}>Position</th>
                  <th style={tableHeaderStyle}>Games</th>
                  <th style={tableHeaderStyle}>Hits</th>
                  <th 
                    style={{...tableHeaderStyle, cursor: 'pointer'}}
                    onClick={() => handleSort('hitsPerSeason')}
                  >
                    Hits/Season
                    <SortIndicator field="hitsPerSeason" />
                  </th>
                  <th style={tableHeaderStyle}>AVG</th>
                  <th style={tableHeaderStyle}>HR</th>
                  <th style={tableHeaderStyle}>RBI</th>
                  <th style={tableHeaderStyle}>SB</th>
                  <th style={tableHeaderStyle}>OBP</th>
                  <th style={tableHeaderStyle}>SLG</th>
                  <th style={tableHeaderStyle}>OPS</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => (
                  <tr key={player.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={tableCellStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>{player.playerName}</td>
                    <td style={tableCellStyle}>{player.position}</td>
                    <td style={tableCellStyle}>{player.games}</td>
                    <td style={tableCellStyle}>{player.hits}</td>
                    <td style={tableCellStyle}>{player.hitsPerSeason}</td>
                    <td style={tableCellStyle}>{player.avg.toFixed(3)}</td>
                    <td style={tableCellStyle}>{player.homeRun}</td>
                    <td style={tableCellStyle}>{player.runBattedIn}</td>
                    <td style={tableCellStyle}>{player.stolenBase}</td>
                    <td style={tableCellStyle}>{player.onBasePercentage.toFixed(3)}</td>
                    <td style={tableCellStyle}>{player.sluggingPercentage.toFixed(3)}</td>
                    <td style={tableCellStyle}>{player.onBasePlusSlugging.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontWeight: 'bold'
}

const tableCellStyle = {
  padding: '12px',
  textAlign: 'left'
}
