import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('autonexus_cart')
      return saved? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('autonexus_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === product.id)
      if (exist) {
        return prev.map(p => p.id === product.id? {...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, {...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id!== id))
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((acc, p) => acc + p.quantity, 0)
  const cartTotal = cart.reduce((acc, p) => acc + p.precio * p.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
