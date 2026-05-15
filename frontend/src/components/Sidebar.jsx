export default function Sidebar({ open }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <h2>FX Dashboard</h2>

      <nav>
        <a href="/">Home</a>
        <a href="/signals">Signals</a>
        <a href="/charts">Charts</a>
      </nav>
    </aside>
  )
}
