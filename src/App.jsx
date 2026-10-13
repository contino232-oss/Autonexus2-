import { useState, useEffect } from 'react';
import './App.css';
import { useCart } from './context/CartContext.jsx';
import CartWidget from './Componets/CartWidget.jsx';
import ItemListContainer from './Componets/ItemListContainer.jsx';

const API_KEY = 'c6d3627b83d6a27526f247fae1a7a65a';

export default function App() {
  const { carrito, quitar, total, formatter } = useCart();
  const { filtroCat, setFiltroCat } = useCart();
  const { busqueda, setBusqueda } = useCart();
  
  const [seccion, setSeccion] = useState('home');
  const [toast, setToast] = useState(null);
  const [clima, setClima] = useState("Cargando...");
  const [hora, setHora] = useState("");
  const [usuario, setUsuario] = useState(
    () => localStorage.getItem('usuarioLogueado')
  );

  const cats = [
   'todos','motor','carroceria',
   'suspension','filtros','electronica','frenos'
  ];

  useEffect(()=>{
    setHora(new Date().toLocaleTimeString());
    const id=setInterval(()=>{
      setHora(new Date().toLocaleTimeString())
    },1000);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=-34.72&lon=-58.26&appid=${API_KEY}&units=metric&lang=es`
    )
    .then(r=>r.json())
    .then(d=>setClima(`${d.name}, ${Math.round(d.main.temp)}°C`))
    .catch(()=>setClima("Quilmes, 10°C"));

    return ()=>clearInterval(id);
  },[]);

  const notify=(msg,color="#2e7d32")=>{
    setToast({msg,color});
    setTimeout(()=>setToast(null),3000);
  };

  return (<>
    <header className="navbar">
      <div className="logo" onClick={()=>setSeccion('home')}>
        AUTONEXUS
      </div>
      <div className="weather-box">{clima} | {hora}</div>
      <nav><ul>
        <li><a onClick={()=>setSeccion('home')}>Inicio</a></li>
        <li><a><CartWidget onClick={()=>setSeccion('carrito')} /></a></li>
        <li><a onClick={()=>{
          if(usuario){
            if(confirm("¿Cerrar sesión?")){
              localStorage.removeItem('usuarioLogueado');
              setUsuario(null);
            }
          } else {
            setSeccion('login');
          }
        }}>{usuario?`Hola, ${usuario.split('@')[0]}`:'Login'}</a></li>
        <li><a onClick={()=>setSeccion('contacto')}>Contacto</a></li>
      </ul></nav>
    </header>

    <main>
      {seccion==='home'&&<>
        <div className="filtros">
          <input className="input-busqueda" 
           placeholder="Buscar repuesto..." 
           value={busqueda} 
           onChange={e=>setBusqueda(e.target.value)} />
          <div className="categorias">
            {cats.map(c=><button key={c} 
             className={filtroCat===c?'active':''} 
             onClick={()=>setFiltroCat(c)}>
              {c.toUpperCase()}
            </button>)}
          </div>
        </div>
        <ItemListContainer onNotify={notify} />
      </>}

      {seccion==='carrito'&&<div className="auth-container">
        <h2>Carrito ({carrito.length})</h2>
        {carrito.length===0?<p>Vacio</p>:
         carrito.map((p,i)=><div key={i} className="cart-item">
          <span>{p.nombre} - {formatter.format(p.precio)}</span>
          <button className="btn-eliminar" onClick={()=>quitar(i)}>Quitar</button>
        </div>)}
        <h3>Total: {formatter.format(total)}</h3>
        <button className="btn-pagar" onClick={()=>window.open('https://www.mercadopago.com.ar')}>Pagar con Mercado Pago</button>
        <button className="btn-seguir" onClick={()=>setSeccion('home')}>Seguir comprando</button>
      </div>}

      {seccion==='login'&&<div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={(e)=>{
          e.preventDefault();
          const email=e.target.email.value;
          localStorage.setItem('usuarioLogueado',email);
          setUsuario(email);
          setSeccion('home');
          notify(`Bienvenido ${email}`);
        }}>
          <input name="email" type="email" placeholder="Email" required />
          <input type="password" placeholder="Contraseña" required />
          <button>Ingresar</button>
        </form>
      </div>}

      {seccion==='contacto'&&<div className="auth-container">
        <h2>Contacto</h2>
        <form onSubmit={(e)=>{
          e.preventDefault();
          notify("Mensaje enviado!");
          setSeccion('home');
        }}>
          <input placeholder="Nombre" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Mensaje" rows="4"></textarea>
          <button>Enviar</button>
        </form>
      </div>}
    </main>

    <footer className="footer">
      <div className="footer-content">
        <div><h4>MEDIOS DE PAGO</h4><p>Visa | Master | MP</p></div>
        <div><h4>AUTONEXUS</h4><p>Wilde - Quilmes</p></div>
      </div>
      <div className="footer-bottom">© 2026 AutoNexus</div>
    </footer>

    {toast&&<div className="notificacion-toast" style={{background:toast.color}}>{toast.msg}</div>}
  </>);
}