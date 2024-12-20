import React from "react";

function ParametrosIniciales({
  fondosMargen,
  setFondosMargen,
  cantidadBTCInicial,
  setCantidadBTCInicial,
  precioEntradaInicial,
  setPrecioEntradaInicial,
}) {
  return (
    <div className="initial-params-container">
      <h2>Parámetros Iniciales</h2>
      <label>Fondos de Margen ($):</label>
      <input
        type="number"
        value={fondosMargen}
        placeholder=""
        onChange={(e) => setFondosMargen(e.target.value.replace(/,/g, '.'))}
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('cantidadBTCInicial').focus()}
      />

      <label>Cantidad de BTC Inicial:</label>
      <input
        id="cantidadBTCInicial"
        type="number"
        value={cantidadBTCInicial}
        placeholder=""
        onChange={(e) => setCantidadBTCInicial(e.target.value.replace(/,/g, '.'))}
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('precioEntradaInicial').focus()}
      />

      <label>Precio de Entrada Inicial ($):</label>
      <input
        id="precioEntradaInicial"
        type="number"
        value={precioEntradaInicial}
        placeholder=""
        onChange={(e) => setPrecioEntradaInicial(e.target.value.replace(/,/g, '.'))}
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('agregarPosicion').focus()}
      />
    </div>
  );
}

export default ParametrosIniciales;
