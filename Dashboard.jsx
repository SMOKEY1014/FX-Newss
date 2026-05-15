import { useEffect, useState } from 'react'
import axios from 'axios'
import EventCard from '../components/EventCard'
import Sidebar from '../components/Sidebar'
import TradingChart from '../components/TradingChart'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [theme, setTheme] = useState('dark')
  const [filter, setFilter] = useState('ALL')
  const [sidebar, setSidebar] = useState(false)

  useEffect(() => {
    fetchEvents()

    const interval = setInterval(() => {
      fetchEvents()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events')

      setEvents(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = events.filter((event) => {
    if (filter === 'ALL') return true

    return event.event === filter
  })

  return (
    <div className={`app ${theme}`}>
      <Sidebar open={sidebar} setOpen={setSidebar} />

      <div className="content">
        <header className="header">
          <button onClick={() => setSidebar(!sidebar)}>
            Menu
          </button>

          <h1>FX Macro Dashboard</h1>

          <button
            onClick={() =>
              setTheme(theme === 'dark' ? 'light' : 'dark')
            }
          >
            Toggle Theme
          </button>
        </header>

        <div className="filters">
          <button onClick={() => setFilter('ALL')}>All</button>
          <button onClick={() => setFilter('CPI')}>CPI</button>
          <button onClick={() => setFilter('NFP')}>NFP</button>
        </div>

        <div className="charts">
          <TradingChart symbol="TVC:DXY" />
          <TradingChart symbol="OANDA:XAUUSD" />
        </div>

        <div className="grid">
          {filtered.slice(0, 3).map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}