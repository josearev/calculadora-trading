import React, { useEffect } from "react";

function GananciaPerdida({ precioRecompra, setPrecioRecompra, gananciaPerdida, formatNumber, precioPromedio }) {
  useEffect(() => {
    if (precioRecompra === "") {
      setPrecioRecompra(precioPromedio.toString());
    }
  }, [precioPromedio, precioRecompra, setPrecioRecompra]);

  return (
    <div className="form-container">
      <h2>Ganancia / Pérdida</h2>
      <label>Precio de Recompra ($):</label>
      <input
        type="number"
        value={precioRecompra}
        placeholder="Ingrese el precio de recompra"
        onChange={(e) => setPrecioRecompra(e.target.value.replace(/,/g, "."))}
      />
      <table>
        <tbody>
          <tr>
            <td>Saldo Final (Larga):</td>
            <td>${formatNumber(gananciaPerdida?.saldoFinalLarga || 0)}</td>
          </tr>
          <tr>
            <td>Ganancia/Pérdida (Larga):</td>
            <td>${formatNumber(gananciaPerdida?.gananciaPerdidaLarga || 0)}</td>
          </tr>
          <tr>
            <td>Saldo Final (Corta):</td>
            <td>${formatNumber(gananciaPerdida?.saldoFinalCorta || 0)}</td>
          </tr>
          <tr>
            <td>Ganancia/Pérdida (Corta):</td>
            <td>${formatNumber(gananciaPerdida?.gananciaPerdidaCorta || 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default GananciaPerdida;
