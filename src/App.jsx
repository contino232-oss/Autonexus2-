import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext.jsx'
import { piezasData } from './data.js'
import { useState, useEffect } from 'react'
import './App.css'

function Navbar() {
  const { cartCount } = useCart()
  const [clima, setClima] = useState('Cargando clima...')

  useEffect(() => {
    const fetchClima = async (lat, lon) => {
      try {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`)
        const geoData = await geoRes.json()
        const ciudad = geoData.city || geoData.locality || 'Wilde'

        const climaRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
        const climaData = await climaRes.json()
        const temp = Math.round(climaData.current.temperature_2m)

        setClima(`${ciudad} | ${temp}°C`)
      } catch {
        setClima('Wilde | 22°C')
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchClima(pos.coords.latitude, pos.coords.longitude),
        () => fetchClima(-34.7033, -58.3221)
      )
    } else {
      fetchClima(-34.7033, -58.3221)
    }
  }, [])

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Autonexus2</Link>
      <div className="weather-box">{clima} ☀️</div>
      <ul>
        <li><Link to="/">Productos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/carrito">🛒 <span id="cart-counter">{cartCount}</span></Link></li>
      </ul>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h4>AUTONEXUS2</h4>
          <p style={{ fontSize: '13px', color: '#aaa' }}>Repuestos originales y alternativos. Más de 10 años en Wilde, Avellaneda.</p>
          <div className="medios-pago" style={{ marginTop: '12px' }}>
            <img src="https://logotipoz.com/wp-content/uploads/2021/10/logo-visa.png" alt="visa" />
            <img src="https://logotipoz.com/wp-content/uploads/2021/10/logo-mastercard.png" alt="master" />
          </div>
        </div>
        <div>
          <h4>CONTACTO</h4>
          <p style={{ fontSize: '13px' }}>📍 Av. Mitre 1234, Wilde<br/>📱 11 2345-6789<br/>✉️ ventas@autonexus2.com</p>
        </div>
        <div>
          <h4>REDES SOCIALES</h4>
          <div className="redes">
            <a href="https://wa.me/5491123456789" target="_blank">💬</a>
            <a href="https://instagram.com" target="_blank">📷</a>
            <a href="https://facebook.com" target="_blank">📘</a>
            <a href="mailto:ventas@autonexus2.com">✉️</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Autonexus2 - Todos los derechos reservados</div>
    </footer>
  )
}

function Home() {
  const { addToCart } = useCart()
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const categorias = ['todos',...new Set(piezasData.map(p => p.categoria))]

  const filtrados = piezasData.filter(p => {
    const matchCat = filtro === 'todos' || p.categoria === filtro
    const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchCat && matchBusq
  })

  return (
    <main>
      <div className="filtros">
        <input className="input-busqueda" placeholder="Buscar repuesto... ej: Bomba de Agua" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <div className="categorias">
          {categorias.map(cat => (
            <button key={cat} onClick={() => setFiltro(cat)} className={filtro === cat? 'active' : ''}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {filtrados.map(p => (
          <div key={p.id} className="pieza-card">
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p className="price">${p.precio.toLocaleString('es-AR')}</p>
            <div className="comp-box">
              Compatible: {p.compatibilidad[0]?.marca} {p.compatibilidad[0]?.modelo} - {p.compatibilidad[0]?.motivo}
            </div>
            <p style={{ fontSize: '11px', color: '#888' }}>Stock: {p.stock} | {p.categoria}</p>
            <button onClick={() => addToCart(p)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </main>
  )
}

function Carrito() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <>
        <main style={{ textAlign: 'center' }}>
          <h2>Carrito vacío</h2>
          <br/>
          <Link to="/" style={{ color: '#c62828', fontWeight: 'bold' }}>Volver a productos</Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main>
        <div className="auth-container">
          <h2>Tu Carrito</h2>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div><b>{item.nombre}</b><br/><small>Cant: {item.quantity}</small></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="price">${(item.precio * item.quantity).toLocaleString('es-AR')}</span>
                <button className="btn-eliminar" onClick={() => removeFromCart(item.id)}>X</button>
              </div>
            </div>
          ))}
          <h3 style={{ marginTop: '15px' }}>Total: ${cartTotal.toLocaleString('es-AR')}</h3>
          <button className="btn-pagar" style={{ width: '100%', padding: '12px', background: '#009ee3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }} onClick={() => { clearCart(); alert('¡Compra realizada!'); navigate('/') }}>PAGAR CON MERCADO PAGO</button>
          <button className="btn-seguir" style={{ width: '100%', padding: '12px', background: '#666', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }} onClick={() => navigate('/')}>Seguir comprando</button>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Login() {
  return (
    <>
      <main>
        <div className="auth-container">
          <h2>Iniciar Sesión</h2>
          <input placeholder="Email" />
          <input type="password" placeholder="Contraseña" />
          <button>Ingresar</button>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Contacto() {
  return (
    <>
      <main>
        <div className="auth-container">
          <h2>Contacto</h2>
          <input placeholder="Tu nombre" />
          <input placeholder="Tu email" />
          <textarea placeholder="Tu mensaje..." rows="4"></textarea>
          <button>Enviar Mensaje</button>
        </div>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Home /><Footer /></>} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </HashRouter>
  )
}

export default App
