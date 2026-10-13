import { HashRouter, Routes, Route } from 'react-router-dom'
import { useCart } from './context/CartContext.jsx'
import { piezasData } from './data.js'

function Home() {
  const { addToCart, cartCount } = useCart()
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Autonexus2 - Carrito: {cartCount}</h1>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {piezasData.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '15px', textAlign: 'center', background: 'white' }}>
            <img src={p.imagen} alt={p.nombre} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
            <h3>{p.nombre}</h3>
            <p><b>${p.precio.toLocaleString('es-AR')}</b></p>
            <p style={{ fontSize: '12px', color: '#666' }}>Stock: {p.stock} | {p.categoria}</p>
            <button onClick={() => addToCart(p)} style={{ background: '#111', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none', marginTop: '10px' }}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}

export default App
