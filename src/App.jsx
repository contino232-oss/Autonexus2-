import { useState, useEffect } from 'react';
import './App.css';
import { piezasData } from './data.js';

const API_KEY = 'c6d3627b83d6a27526f247fae1a7a65a';

export default function App() {
  const [piezas, setPiezas] = useState(piezasData);
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem('carrito')) || []);
  const [seccion, setSeccion] = useState('home');
  const [toast, setToast] = useState(null);
  const [clima, setClima] = useState("Cargando clima...");
  const [hora, setHora] = useState(new Date().toLocaleTimeString('es-AR', { hour12: false }));
  const [usuario, setUsuario] = useState(() => localStorage.getItem('usuarioLogueado'));
  const [filtroCat, setFiltroCat] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  
  const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

  useEffect(() => {
    const id = setInterval(() => setHora(new Date().toLocaleTimeString('es-AR', { hour12: false })), 1000);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-34.72&lon=-58.26&appid=${API_KEY}&units=metric&lang=es`)
      .then(r=>r.json()).then(d=>setClima(`${d.name}, ${Math.round(d.main.temp)}°C`))
      .catch(()=>setClima("Wilde, 19°C"));
    return () => clearInterval(id);
  }, []);

  useEffect(() => { localStorage.setItem('carrito', JSON.stringify(carrito)); }, [carrito]);

  const notify = (msg, color="#2e7d32") => { setToast({msg,color}); setTimeout(()=>setToast(null),3000); };

  const agregar = (id) => {
    const p = piezas.find(x=>x.id===id);
    if(p.stock<=0){ notify("Sin stock","#d32f2f"); return; }
    setCarrito([...carrito,p]);
    setPiezas(piezas.map(x=>x.id===id?{...x,stock:x.stock-1}:x));
    notify(`Agregado: ${p.nombre}`);
  };

  const piezasFiltradas = piezas.filter(p => {
    const coincideCat = filtroCat === 'todos' || p.categoria === filtroCat;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideBusqueda;
  });

  const categoriasReales = ['todos','motor','carroceria','suspension','filtros','electronica','frenos'];

  return (
    <>
      <header className="navbar">
        <div className="logo" onClick={()=>setSeccion('home')}>AUTONEXUS</div>
        <div className="weather-box">{clima} | {hora}</div>
        <nav><ul>
          <li><a onClick={()=>setSeccion('home')}>Inicio</a></li>
          <li><a className="cart-link" onClick={()=>setSeccion('carrito')}>🛒 <span id="cart-counter">{carrito.length}</span></a></li>
          <li><a onClick={()=> usuario ? (confirm("¿Cerrar sesión?") && (localStorage.removeItem('usuarioLogueado'), setUsuario(null))) : setSeccion('login')}>{usuario ? `Hola, ${usuario.split('@')[0]}` : 'Login'}</a></li>
          <li><a onClick={()=>setSeccion('contacto')}>Contacto</a></li>
        </ul></nav>
      </header>

      <main>
        {seccion==='home' && <>
          <div className="filtros">
            <input className="input-busqueda" placeholder="Buscar repuesto..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
            <div className="categorias">
              {categoriasReales.map(c=> <button key={c} className={filtroCat===c?'active':''} onClick={()=>setFiltroCat(c)}>{c.toUpperCase()}</button> )}
            </div>
          </div>
          <div className="product-grid">
            {piezasFiltradas.map(p=>(
              <div key={p.id} className="pieza-card">
                <img src={p.imagen} alt={p.nombre} />
                <h3>{p.nombre}</h3>
                <p>ID: {p.id} | Stock: {p.stock}</p>
                <span className="price">{formatter.format(p.precio)}</span>
                <div className="comp-box">
                  Aplica: {p.compatibilidad[0].marca} {p.compatibilidad[0].modelo} {p.compatibilidad[0].anio}
                </div>
                <button onClick={()=>agregar(p.id)}>Agregar al Carrito</button>
              </div>
            ))}
          </div>
          {piezasFiltradas.length===0 && <p style={{textAlign:'center', marginTop:'30px'}}>No se encontraron productos en esa categoría.</p>}
        </>}

        {seccion==='carrito' && <div className="auth-container">
          <h2>Carrito ({carrito.length})</h2>
          {carrito.length===0 ? <p>Vacío</p> : carrito.map((p,i)=><div key={i} className="cart-item"><span>{p.nombre} - {formatter.format(p.precio)}</span><button className="btn-eliminar" onClick={()=>setCarrito(carrito.filter((_,idx)=>idx!==i))}>Quitar</button></div>)}
          <h3 style={{marginTop:'20px'}}>Total: {formatter.format(carrito.reduce((a,b)=>a+b.precio,0))}</h3>
          <button className="btn-pagar" style={{marginTop:'10px'}} onClick={()=>window.open('https://www.mercadopago.com.ar')}>Pagar con Mercado Pago</button>
          <button style={{marginTop:'10px',background:'#666'}} onClick={()=>setSeccion('home')}>Seguir comprando</button>
        </div>}

        {seccion==='login' && <div className="auth-container">
          <h2>Login</h2>
          <form onSubmit={(e)=>{e.preventDefault(); const email=e.target.email.value; localStorage.setItem('usuarioLogueado',email); setUsuario(email); setSeccion('home'); notify(`Bienvenido ${email}`);}}>
            <input name="email" type="email" placeholder="Email" required />
            <input type="password" placeholder="Contraseña" required />
            <button>Ingresar</button>
          </form>
        </div>}

        {seccion==='contacto' && <div className="auth-container">
          <h2>Contacto</h2>
          <form onSubmit={(e)=>{e.preventDefault(); notify("Mensaje enviado!"); setSeccion('home');}}>
            <input placeholder="Nombre" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Mensaje" rows="4"></textarea>
            <button>Enviar</button>
          </form>
        </div>}
      </main>

      {toast && <div className="notificacion-toast" style={{background:toast.color}}>{toast.msg}</div>}
    </>
  );
      }
