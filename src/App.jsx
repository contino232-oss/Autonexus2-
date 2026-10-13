import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './Componets/Header.jsx'
import { useCart } from './context/CartContext.jsx'
import { products } from './data.js'

function Home() {
  const { addToCart } = useCart()
  return (
    <div style={{ padding: '20px', display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
      {products.map(p => (
        <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '15px' }}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
          <button onClick={() => addToCart(p)} style={{ background: '#111', color: 'white', padding: '8px 12px', borderRadius: '8px' }}>
            Agregar
          </button>
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}

export default App




