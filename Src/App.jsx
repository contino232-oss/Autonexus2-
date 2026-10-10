import React, { useState, useEffect } from 'react';
import dataJson from './data.json';

export default function App() {
  const [piezas] = useState(dataJson.piezas || []);
  const [carrito, setCarrito] = useState([]);
  const [filtro, setFiltro] = useState(null);
  const [vista, setVista] = useState('home');

  const fmt = new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'});
  const lista = filtro? piezas.filter(p=>p.categoria===filtro) : piezas;

  return (
    <div style={{background:'#09090b', color:'white', minHeight:'100vh', fontFamily:'Arial'}}>
      <header style={{padding:20, display:'flex', justifyContent:'space-between', borderBottom:'1px solid #333', flexWrap:'wrap'}}>
        <h1 style={{fontWeight:900, fontSize:24, cursor:'pointer'}} onClick={()=>{setVista('home'); setFiltro(null)}}>AUTONEXUS<span style={{color:'red'}}>.</span></h1>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button onClick={()=>setFiltro(null)} style={{padding:'8px 12px', borderRadius:20, border:'1px solid #555', background:'#222', color:'white'}}>TODOS</button>
          <button onClick={()=>setFiltro('motor')} style={{padding:'8px 12px', borderRadius:20, border:'1px solid #555', background:'#222', color:'white'}}>MOTOR</button>
          <button onClick={()=>setFiltro('frenos')} style={{padding:'8px 12px', borderRadius:20, border:'1px solid #555', background:'#222', color:'white'}}>FRENOS</button>
          <button onClick={()=>setVista('carrito')} style={{padding:'8px 16px', borderRadius:20, background:'white', color:'black', fontWeight:900}}>CARRITO ({carrito.length})</button>
        </div>
      </header>

      {vista==='home' && (
        <div style={{padding:20, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20}}>
          {lista.map(p=>(
            <div key={p.id} style={{background:'#18181b', border:'1px solid #27272a', borderRadius:24, padding:16}}>
              <img src={p.imagen} alt={p.nombre} style={{width:'100%', height:180, objectFit:'contain', background:'white', borderRadius:12}}/>
              <h3 style={{fontWeight:'bold', marginTop:10}}>{p.nombre}</h3>
              <p style={{fontSize:12, color:'#aaa'}}>Stock: {p.stock} - {p.categoria}</p>
              <p style={{fontWeight:900, fontSize:20, color:'#ef4444', marginTop:5}}>{fmt.format(p.precio)}</p>
              <button onClick={()=>setCarrito([...carrito, p])} style={{marginTop:12, width:'100%', background:'white', color:'black', padding:12, borderRadius:30, fontWeight:900}}>AGREGAR</button>
            </div>
          ))}
        </div>
      )}

      {vista==='carrito' && (
        <div style={{padding:20, maxWidth:600, margin:'0 auto'}}>
          <h2 style={{fontSize:30, fontWeight:900}}>CARRITO</h2>
          {carrito.length===0? <p>Vacio</p> : carrito.map((p,i)=><div key={i} style={{background:'#18181b', padding:12, borderRadius:12, marginTop:8, display:'flex', justifyContent:'space-between'}}><span>{p.nombre}</span><span>{fmt.format(p.precio)}</span></div>)}
          <p style={{textAlign:'right', fontWeight:900, fontSize:22, marginTop:10}}>Total: {fmt.format(carrito.reduce((a,b)=>a+b.precio,0))}</p>
          <button onClick={()=>setVista('home')} style={{marginTop:20, color:'#888'}}>← Seguir comprando</button>
        </div>
      )}
    </div>
  );
}
