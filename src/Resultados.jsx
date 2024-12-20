import React from "react";

function Resultados({ calcularPosicionPonderada, prestamo, resultados, formatNumber }) {
  return (
    <>
      <div className="result-container">
        <h2>Posición Ponderada</h2>
        <table>
          <tbody>
            <tr>
              <td>Cantidad Total de BTC:</td>
              <td>{formatNumber(calcularPosicionPonderada().cantidadTotalBTC)}</td>
            </tr>
            <tr>
              <td>Precio Promedio Ponderado ($):</td>
              <td>${formatNumber(calcularPosicionPonderada().precioPromedio)}</td>
            </tr>
            <tr>
              <td>Préstamo en BTC:</td>
              <td>{formatNumber(prestamo.prestamoBTC)}</td>
            </tr>
            <tr>
              <td>Préstamo en USD:</td>
              <td>${formatNumber(prestamo.prestamoUSD)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="result-container">
        <h2>Información de Liquidación</h2>
        <table>
          <tbody>
            <tr><td>Nivel de Apalancamiento:</td><td>{formatNumber(resultados.nivelApalancamiento)}x</td></tr>
            <tr><td>Precio de Liquidación (Larga):</td><td>${formatNumber(resultados.precioLiquidacionLarga)}</td></tr>
            <tr><td>Fondos Disponibles (Larga):</td><td>${formatNumber(resultados.fondosDisponiblesLarga)}</td></tr>
            <tr><td>Precio de Liquidación (Corta):</td><td>${formatNumber(resultados.precioLiquidacionCorta)}</td></tr>
            <tr><td>Fondos Disponibles (Corta):</td><td>${formatNumber(resultados.fondosDisponiblesCorta)}</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Resultados;
