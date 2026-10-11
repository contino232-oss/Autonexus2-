import { useState } from "react"
import data from "./data.json"

export default function App(){
  const [cart,setCart]=useState([])
    const piezas = data.piezas || []
      const total = cart.reduce((a,b)=>a+b.precio,0)

        return(
            <>
                <style>{`
                      *{margin:0;padding:0;box-sizing:border-box}
                            body{background:#09090b}
                                  .w{min-height:100vh;background:#09090b;color:#fff;font-family:system-ui;padding:16px}
                                        .top{font-size:28px;font-weight:900}.top span{color:red}
                                              .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
                                                    .card{background:#18181b;border:1px solid #27272a;border-radius:12px;padding:10px}
                                                          .card img{width:100%;height:100px;object-fit:contain;background:#fff;border-radius:8px}
                                                                .btn{width:100%;background:#fff;color:#000;border:0;padding:8px;border-radius:20px;font-weight:900;margin-top:8px}
                                                                    `}</style>
                                                                        <div className="w">
                                                                              <div className="top">AUTONEXUS<span>.</span></div>
                                                                                    <p style={{color:'#888',fontSize:12}}>WILDE - {piezas.length} productos - YA NO ESTA EN BLANCO</p>
                                                                                          
                                                                                                <div className="grid">
                                                                                                        {piezas.map(p=>(
                                                                                                                  <div key={p.id} className="card">
                                                                                                                              <img src={p.imagen} />
                                                                                                                                          <div style={{fontSize:12,marginTop:6}}>{p.nombre}</div>
                                                                                                                                                      <div style={{color:'#ef4444',fontWeight:900}}>${p.precio.toLocaleString()}</div>
                                                                                                                                                                  <button className="btn" onClick={()=>setCart([...cart,p])}>AGREGAR</button>
                                                                                                                                                                            </div>
                                                                                                                                                                                    ))}
                                                                                                                                                                                          </div>

                                                                                                                                                                                                <div style={{background:'#fff',color:'#000',padding:12,borderRadius:12,marginTop:20,fontWeight:900}}>
                                                                                                                                                                                                        CARRITO: {cart.length} - TOTAL: ${total.toLocaleString()}
                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                      </>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                        }
