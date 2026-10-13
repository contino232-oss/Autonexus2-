import { useCart } from '../context/CartContext.jsx';
export default function Item({ pieza, onNotify }) {
  const { agregar, formatter } = useCart();
  return (
    <div className="pieza-card">
      <img src={pieza.imagen} alt={pieza.nombre} />
      <h3>{pieza.nombre}</h3><p>ID: {pieza.id} | Stock: {pieza.stock}</p>
      <span className="price">{formatter.format(pieza.precio)}</span>
      <div className="comp-box">Aplica: {pieza.compatibilidad[0]?.marca} {pieza.compatibilidad[0]?.modelo}</div>
      <button onClick={()=>{const r=agregar(pieza.id); onNotify(r.msg,r.ok?"#2e7d32":"#d32f2f");}} disabled={pieza.stock===0}>{pieza.stock===0?'SIN STOCK':'Agregar al Carrito'}</button>
    </div>
  );
}