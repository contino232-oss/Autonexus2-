import Item from './Item.jsx';
import { useCart } from '../context/CartContext.jsx';
export default function ItemListContainer({ onNotify }) {
  const { piezasFiltradas } = useCart();
  return <div className="product-grid">{piezasFiltradas.length===0?<p style={{textAlign:'center',padding:'40px'}}>No hay resultados</p>:piezasFiltradas.map(p=><Item key={p.id} pieza={p} onNotify={onNotify} />)}</div>;
}