import { useCart } from '../context/CartContext.jsx';
export default function CartWidget({ onClick }) {
  const { cantidad } = useCart();
  return <div onClick={onClick} style={{cursor:'pointer'}}>🛒 {cantidad>0&&<span id="cart-counter">{cantidad}</span>}</div>;
}