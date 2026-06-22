import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 py-16 mt-20 border-t border-stone-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-sm font-bold tracking-widest text-white uppercase font-serif">MEZANINE</h3>
            <p className="mt-4 text-xs text-stone-400 leading-relaxed max-w-sm">
              Una experiencia gastronómica de alta cocina que fusiona ingredientes peruanos tradicionales con técnicas contemporáneas en un espacio distinguido.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700">Horarios</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-stone-400">
              <li>Lunes a Sábado: 12:00 - 23:00</li>
              <li>Domingos: Cerrado</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700">Ubicación y Contacto</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-stone-400">
              <li>Av. Camino Real 1250, San Isidro</li>
              <li>Lima, Perú</li>
              <li>Teléfono: +51 987 654 321</li>
              <li>Email: contacto@mezaninesanisidro.pe</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-stone-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Mezanine Gourmet. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
