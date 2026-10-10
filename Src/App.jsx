import React, { useState } from 'react';
import dataJson from './data.json';

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const piezas = dataJson.piezas || [];

  return (
    <div style={{background:'#09090b', color:'white', minHeight:'100vh', padding:20, fontFamily:'system-ui'}}>
      <h1 style={{fontWeight:900, fontSize:28}}>AUTONEXUS<span style={{color:'red'}}>.</span> - FUNCIONA!</h1>
      <p style={{color:'#888', marginBottom:20}}>{piezas.length} productos - Wilde</p>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px,1fr))', gap:16}}>
        {piezas.map(p=>(
          <div key={p.id} style={{background:'#18181b', padding:16, borderRadius:16, border:'1px solid #333'}}>
            <img src={p.imagen} alt={p.nombre} style={{width:'100%', height:140, objectFit:'contain', background:'white', borderRadius:8}}/>
            <h3 style={{fontWeight:700, marginTop:8}}>{p.nombre}</h3>
            <p style={{color:'#ef4444', fontWeight:900}}>${p.precio}</p>
            <button onClick={()=>setCarrito([...carrito,p])} style={{marginTop:8, width:'100%', padding:10, borderRadius:20, background:'white', color:'black', fontWeight:900}}>AGREGAR</button>
          </div>
        ))}
      </div>

      <div style={{marginTop:30, background:'#111', padding:16, borderRadius:12}}>
        <h2>CARRITO ({carrito.length}) - Total: ${carrito.reduce((a,b)=>a+b.precio,0)}</h2>
      </div>
    </div>
  );
}
