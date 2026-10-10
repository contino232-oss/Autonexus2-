import React, { useState, useEffect } from 'react';
import dataJson from './data.json';

const API_KEY = 'c6d3627b83d6a27526f247fae1a7a65a';

export default function App() {
  const [piezas, setPiezas] = useState(dataJson.piezas || []);
  const [carrito, setCarrito] = useState([]);
  const [clima, setClima] = useState("Wilde, 18°C");
  const [hora, setHora] = useState("");
  const [filtro, setFiltro] = useState(null);
  const [vista, setVista] = useState('home');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(saved);
    let copia = [...dataJson.piezas];
    saved.forEach(item=>{
      const p = copia.find(x=>x.id===item.id);
      if(p) p.stock = Math.max(0, p.stock - 1);
    });
    setPiezas(copia);
    const t = setInterval(()=> setHora(new Date().toLocaleTimeString('es-AR',{hour12:false})), 1000);
    fetch('https://ip-api.com/json/').then(r=>r.json()).then(ip=>{
      return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${ip.lat||-34.72}&lon=${ip.lon||-58.26}&appid=${API_KEY}&units=metric&lang=es`).then(r=>r.json())
    }).then(w=>{ if(w.main) setClima(`${w.name}, ${Math.round(w.main.temp)}°C`) }).catch(()=>{});
    return ()=> clearInterval(t);
  }, []);

  useEffect(()=>{ localStorage.setItem('carrito', JSON.stringify(carrito)) }, [carrito]);

  const agregar = (id)=>{
    const prod = piezas.find(p=>p.id===id);
    if(prod.stock<=0){ alert("Sin stock"); return; }
    setCarrito([...carrito, prod]);
    setPiezas(piezas.map(p=>p.id===id?{...p, stock:p.stock-1}:p));
  }
  const quitar = (i)=>{
    const item = carrito[i];
    setCarrito(carrito.filter((_,idx)=>idx!==i));
    setPiezas(piezas.map(p=>p.id===item.id?{...p, stock:p.stock+1}:p));
  }

  const fmt = new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'});
  const lista = filtro? piezas.filter(p=>p.categoria===filtro) : piezas;
  const total = carrito.reduce((a,b)=>a+b.precio,0);

  if(!piezas.length) return <div className="p-10 bg-white text-black">ERROR data.json no tiene piezas</div>

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <header className="max-w-7xl mx-auto p-5 flex justify-between items-center border-b border-zinc-800 flex-wrap gap-3">
        <h1 className="font-black text-2xl cursor-pointer" onClick={()=>{setVista('home'); setFiltro(null)}}>AUTONEXUS<span className="text-red-600">.</span></h1>
        <nav className="flex gap-2 text-[11px] font-bold flex-wrap">
          <button onClick={()=>setFiltro(null)} className="px-3 py-2 border border-zinc-700 rounded-full">TODOS</button>
          <button onClick={()=>setFiltro('motor')} className="px-3 py-2 border border-zinc-700 rounded-full">MOTOR</button>
          <button onClick={()=>setFiltro('frenos')} className="px-3 py-2 border border-zinc-700 rounded-full">FRENOS</button>
          <button onClick={()=>setFiltro('carroceria')} className="px-3 py-2 border border-zinc-700 rounded-full">CARROCERIA</button>
          <button onClick={()=>setVista('carrito')} className="bg-white text-black px-5 py-2 rounded-full">CARRITO ({carrito.length})</button>
        </nav>
      </header>
      <div className="max-w-7xl mx-auto px-5 py-2 text-[10px] text-zinc-500">{clima} | {hora} | {piezas.length} PRODUCTOS</div>

      {vista==='home' && (
        <section className="max-w-7xl mx-auto p-5 grid md:grid-cols-3 gap-5">
          {lista.map(p=>(
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-[1.5rem] p-4 flex flex-col">
              <img src={p.imagen} alt={p.nombre} className="w-full h-48 object-contain bg-white rounded-xl mb-3"/>
              <h3 className="font-bold">{p.nombre}</h3>
              <p className={`text-xs ${p.stock<=3?'text-yellow-400':'text-zinc-400'}`}>{p.stock<=3 && p.stock>0?`⚠️ Últimas ${p.stock}!`:`Stock: ${p.stock}`}</p>
              <p className="font-black text-xl text-red-500 mt-1">{fmt.format(p.precio)}</p>
              <div className="bg-zinc-800 rounded-xl p-3 mt-3 text-[11px] text-zinc-300">
                {p.compatibilidad.map((c,i)=><div key={i}>• {c.marca} {c.modelo} ({c.anio})</div>)}
              </div>
              <button onClick={()=>agregar(p.id)} disabled={p.stock<=0} className="mt-4 bg-white text-black py-3 rounded-full font-black disabled:bg-zinc-700">AGREGAR</button>
            </div>
          ))}
        </section>
      )}

      {vista==='carrito' && (
        <section className="max-w-2xl mx-auto p-5">
          <h2 className="text-3xl font-black mb-5">CARRITO</h2>
          {carrito.length===0? <p>Vacío</p> : <>
            {carrito.map((p,i)=><div key={i} className="flex justify-between bg-zinc-900 p-4 rounded-xl mb-2"><span>{p.nombre} {fmt.format(p.precio)}</span><button onClick={()=>quitar(i)} className="bg-red-600 px-3 rounded-full">X</button></div>)}
            <p className="text-right font-black text-2xl mt-4">Total: {fmt.format(total)}</p>
          </>}
          <button onClick={()=>setVista('home')} className="mt-6 text-zinc-400">← Seguir comprando</button>
        </section>
      )}
    </div>
  );
    }
