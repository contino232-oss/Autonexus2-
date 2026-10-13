import { createContext, useState, useEffect, useContext } from 'react';
import { piezasData } from '../data.js';
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [piezas, setPiezas] = useState(piezasData);
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem('carrito')) || []);
  const [filtroCat, setFiltroCat] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
  useEffect(() => { localStorage.setItem('carrito', JSON.stringify(carrito)); }, [carrito]);
  const agregar = (id) => {
    const p = piezas.find(x => x.id === id);
    if (!p || p.stock <= 0) return { ok: false, msg: "Sin stock" };
    setCarrito(prev => [...prev, p]);
    setPiezas(prev => prev.map(x => x.id === id? {...x, stock: x.stock - 1} : x));
    return { ok: true, msg: `Agregado: ${p.nombre}` };
  };
  const quitar = (index) => {
    const item = carrito[index];
    setCarrito(prev => prev.filter((_, i) => i!== index));
    if (item) setPiezas(prev => prev.map(x => x.id === item.id? {...x, stock: x.stock + 1} : x));
  };
  const piezasFiltradas = piezas.filter(p => (filtroCat === 'todos' || p.categoria === filtroCat) && p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  return (
    <CartContext.Provider value={{ piezas, carrito, agregar, quitar, total: carrito.reduce((a,b)=>a+b.precio,0), cantidad: carrito.length, formatter, piezasFiltradas, filtroCat, setFiltroCat, busqueda, setBusqueda }}>
      {children}
    </CartContext.Provider>
  );
};