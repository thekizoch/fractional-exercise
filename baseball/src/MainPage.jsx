import { seedBaseball } from 'wasp/client/operations'
import './Main.css'

export const MainPage = () => {
  const handleSeed = async () => {
    try {
      const result = await seedBaseball({})
      window.alert(result.message)
    } catch (error) {
      window.alert('Error seeding database: ' + error.message)
    }
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
            borderRadius: '4px'
          }}
        >
          Seed Baseball Data
        </button>
      </main>
    </div>
  )
}
