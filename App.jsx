import React, { useState, useEffect } from 'react';
import dataJson from './data.json';

const API_KEY = 'c6d3627b83d6a27526f247fae1a7a65a';

export default function App() {
  const [piezas, setPiezas] = useState([]);
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito')) || []);
  const [clima, setClima] = useState("Cargando clima...");
  const [hora, setHora] = useState("");
  const [usuario, setUsuario] = useState(localStorage.getItem('usuarioLogueado') || null);
  const [filtro, setFiltro] = useState(null);
  const [vista, setVista] = useState('home');

  useEffect(() => {
    let stockPiezas = [...dataJson.piezas];
    carrito.forEach(item=>{
      const p = stockPiezas.find(x=>x.id===item.id);
      if(p && p.stock>0) p.stock--;
    });
    setPiezas(stockPiezas);
    const t = setInterval(()=> setHora(new Date().toLocaleTimeString('es-AR',{hour12:false})), 1000);
    obtenerClima();
    return ()=> clearInterval(t);
  }, []);

  useEffect(()=>{ localStorage.setItem('carrito', JSON.stringify(carrito)) }, [carrito]);

  async function obtenerClima(){
    try{
      const ip = await fetch('https://ip-api.com/json/').then(r=>r.json());
      const lat = ip.lat || -34.72; const lon = ip.lon || -58.26;
      const w = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`).then(r=>r.json());
      if(w.main) setClima(`${w.name}, ${Math.round(w.main.temp)}°C`);
    }catch{ setClima("Wilde, 18°C") }
  }

  const agregar = (id)=>{
    const prod = piezas.find(p=>p.id===id);
    if(!prod.stock){ alert("Sin stock"); return; }
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

  return (
    <div className="bg-zinc-
