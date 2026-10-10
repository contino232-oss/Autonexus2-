import React, { useState } from 'react';

export default function App() {
  const [wppMsg, setWppMsg] = useState("");

  const servicios = [
    { t: "Detailing Premium", d: "Corrección de pintura, cerámico y limpieza interior profunda." },
    { t: "Ploteo y Vinilo", d: "Cambio de color, PPF y protección de ópticas." },
    { t: "Mecánica Ligera", d: "Service, frenos, suspensión y diagnóstico computarizado." },
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      {/* NAV */}
      <header className="p-5 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-black tracking-widest">AUTONEXUS<span className="text-red-600">.</span></h1>
        <a href="https://wa.me/5491123456789" className="bg-red-600 px-5 py-2 rounded-full font-bold text-sm">WHATSAPP</a>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-red-600 font-bold tracking-widest mb-3">WILDE - AVELLANEDA</p>
          <h2 className="text-5xl md:text-7xl font-black leading-none mb-6">LLEVAMOS TU AUTO A OTRO NIVEL</h2>
          <p className="text-zinc-400 text-lg mb-8">Taller estético y mecánico. Más de 5 años dejando autos 0km en zona sur.</p>
          <div className="flex gap-3">
            <a href="#contacto" className="bg-white text-black px-8 py-3 rounded-full font-bold">COTIZAR AHORA</a>
            <a href="#servicios" className="border border-zinc-700 px-8 py-3 rounded-full font-bold">SERVICIOS</a>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-[2rem] h-[400px] flex items-center justify-center border border-zinc-800">
          <p className="text-zinc-600">FOTO DE TU TALLER / AUTO AQUÍ</p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="max-w-6xl mx-auto px-5 py-20">
        <h3 className="text-3xl font-black mb-10">SERVICIOS</h3>
        <div className="grid md:grid-cols-3 gap-5">
          {servicios.map(s => (
            <div key={s.t} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
              <h4 className="font-black text-xl mb-3">{s.t}</h4>
              <p className="text-zinc-400 text-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="max-w-6xl mx-auto px-5 py-20">
        <div className="bg-white text-black rounded-[2rem] p-8 md:p-12">
          <h3 className="text-4xl font-black mb-6">PEDÍ TU TURNO</h3>
          <input
            value={wppMsg}
            onChange={e => setWppMsg(e.target.value)}
            placeholder="Ej: Hola, quiero cotizar detailing para un Golf..."
            className="w-full bg-zinc-100 p-4 rounded-xl mb-4 outline-none"
          />
          <a
            href={`https://wa.me/5491123456789?text=${encodeURIComponent(wppMsg)}`}
            className="bg-black text-white w-full block text-center py-4 rounded-xl font-black"
          >
            ENVIAR POR WHATSAPP
          </a>
          <p className="text-xs text-zinc-500 mt-4 text-center">Wilde, Buenos Aires - Lunes a Sábado 9 a 18hs</p>
        </div>
      </section>

      <footer className="text-center text-zinc-600 text-xs py-10">© 2026 AutoNexus Wilde. Todos los derechos reservados.</footer>
    </div>
  );
            }
