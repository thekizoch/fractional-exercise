import { seedBaseball, getBaseballPlayers, useQuery } from 'wasp/client/operations'
import { generatePlayerDescription } from 'wasp/client/operations'
import { useState, useMemo } from 'react'
import './Main.css'

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            border: 'none',
            background: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export const MainPage = () => {
  const { data: players, isLoading, error } = useQuery(getBaseballPlayers)
  const [sortField, setSortField] = useState('hitsPerSeason')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerDescription, setPlayerDescription] = useState('')
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

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

  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player)
    setIsGeneratingDescription(true)
    try {
      const description = await generatePlayerDescription({
        playerName: player.playerName,
        stats: {
          ...player,
          hitsPerSeason: parseFloat(calculateHitsPerSeason(player.hits, player.games))
        }
      })
      setPlayerDescription(description)
    } catch (error) {
      setPlayerDescription('Error generating player description. Please try again.')
    } finally {
      setIsGeneratingDescription(false)
    }
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
                  <tr 
                    key={player.id} 
                    style={{ 
                      borderBottom: '1px solid #ddd',
                      cursor: 'pointer',
                      backgroundColor: selectedPlayer?.id === player.id ? '#f0f0f0' : 'transparent'
                    }}
                    onClick={() => handlePlayerClick(player)}
                  >
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

        <Modal 
          isOpen={!!selectedPlayer} 
          onClose={() => {
            setSelectedPlayer(null)
            setPlayerDescription('')
          }}
        >
          {selectedPlayer && (
            <div>
              <h2 style={{ marginTop: 0 }}>{selectedPlayer.playerName}</h2>
              <p><strong>Position:</strong> {selectedPlayer.position}</p>
              <div style={{ marginTop: '1rem' }}>
                {isGeneratingDescription ? (
                  <div>Generating player description...</div>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{playerDescription}</div>
                )}
              </div>
            </div>
          )}
        </Modal>
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
