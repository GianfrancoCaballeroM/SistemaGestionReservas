import React from 'react';

const MenuCard = ({ plato }) => {
  const { nombre_plato, descripcion, precio } = plato;

  return (
    <div className="bg-white border border-stone-100 rounded shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4">
          <h4 className="text-xs font-bold text-stone-900 tracking-tight font-serif uppercase">{nombre_plato}</h4>
          <span className="text-xs font-semibold text-amber-900 shrink-0">
            S/. {precio.toFixed(2)}
          </span>
        </div>
        <p className="mt-3 text-[11px] text-stone-500 leading-relaxed">
          {descripcion}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-stone-50 flex justify-between items-center">
        <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">
          Disponible
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-700" />
      </div>
    </div>
  );
};

export default MenuCard;
