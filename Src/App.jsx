import React, { useState } from 'react';
import dataJson from './data.json';

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const piezas = dataJson.piezas || [];
  const total = carrito.reduce((a,b)=>a+b.precio,0);

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#09090b}
        .wrap{font-family:system-ui;background:#09090b;color:white;min-height:100vh;padding:20px}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-top:20px}
        .card{background:#18181b;border:1px solid #27272a;border-radius:16px;padding:14px}
        .card img{width:100%;height:150px;object-fit:contain;background:white;border-radius:10px}
        .btn{width:100%;padding:10px;border-radius:20px;border:0;background:white;color:black;font-weight:900;margin-top:10px;cursor:pointer}
        .header{font-size:32px;font-weight:900;letter-spacing:-1px}
        .header span{color:#ef4444}
      `}</style>

      <div className="wrap">
        <div className="header">AUTONEXUS<span>.</span></div>
        <div style={{color:'#888'}}>WILDE - {piezas.length} PRODUCTOS CARGADOS - ESTO YA NO ESTA EN BLANCO</div>

        <div className="grid">
          {piezas.map(p=>(
            <div key={p.id} className="card">
              <img src={p.imagen} alt={p.nombre} />
              <h3 style={{marginTop:10, fontSize:14}}>{p.nombre}</h3>
              <p style={{color:'#ef4444', fontWeight:900, marginTop:4}}>${p.precio.toLocaleString()}</p>
              <button className="btn" onClick={()=>setCarrito([...carrito,p])}>AGREGAR AL CARRITO</button>
            </div>
          ))}
        </div>

        <div style={{marginTop:30, background:'white', color:'black', padding:16, borderRadius:16, fontWeight:900}}>
          CARRITO: {carrito.length} productos | TOTAL: ${total.toLocaleString()}
        </div>
      </div>
    </>
  );
      }
