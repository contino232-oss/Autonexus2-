import { HashRouter, Routes, Route } from 'react-router-dom'
import { useCart } from './context/CartContext.jsx'
import products from './data.js'

function Home() {
  const { addToCart, cartCount } = useCart()
  return (
    <div style={{ padding: '20px' }}>
      <h1>Autonexus2 - Carrito: {cartCount}</h1>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '15px' }}>
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)}>Agregar</button>
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
