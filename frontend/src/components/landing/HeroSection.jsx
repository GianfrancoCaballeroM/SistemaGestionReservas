import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-[#faf9f6] py-28 overflow-hidden border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest text-amber-800 uppercase bg-amber-50 px-2.5 py-1 border border-amber-100/30 rounded">
            Experiencia Gastronómica
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-950 font-serif leading-tight">
            Sabores contemporáneos en un entorno exclusivo.
          </h1>
          <p className="mt-6 text-sm text-stone-500 leading-relaxed">
            Te invitamos a descubrir la propuesta de Mezanine. Reserva tu mesa de forma ágil y segura hoy mismo.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href="#reserva"
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-wider rounded text-white bg-stone-900 hover:bg-stone-800 hover:border-amber-900/20 border border-transparent shadow transition-all outline-none"
            >
              Hacer una Reserva
            </a>
            <a
              href="#menu"
              className="ml-4 inline-flex items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-wider rounded border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 transition-all outline-none"
            >
              Ver la Carta
            </a>
          </div>
        </div>
      </div>
      {/* Círculo decorativo de fondo con un tono crema cálido */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-50/40 rounded-full blur-3xl opacity-80 -z-10" />
    </div>
  );
};

export default HeroSection;
