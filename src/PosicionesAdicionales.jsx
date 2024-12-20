import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function PosicionesAdicionales({
  posiciones,
  actualizarPosicion,
  eliminarPosicion,
  nodeRefs,
}) {
  return (
    <TransitionGroup className="additional-positions-container">
      {posiciones.map((pos, index) => (
        <CSSTransition
          key={index}
          nodeRef={nodeRefs.current[index]}
          timeout={500}
          classNames="slide"
        >
          <div ref={nodeRefs.current[index]} id={`posicion-${index}`} className="form-container">
            <h2>Posición #{index + 2}</h2>
            <label>Cantidad de BTC:</label>
            <input
              type="number"
              value={pos.cantidadBTC}
              placeholder=""
              onChange={(e) => actualizarPosicion(index, "cantidadBTC", e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById(`precioEntrada-${index}`).focus()}
            />

            <label>Precio de Entrada ($):</label>
            <input
              id={`precioEntrada-${index}`}
              type="number"
              value={pos.precioEntrada}
              placeholder=""
              onChange={(e) => actualizarPosicion(index, "precioEntrada", e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('agregarPosicion').focus()}
            />

            <div className="button-container">
              <button onClick={() => actualizarPosicion(index)}>Agregar Posición</button>
              <button onClick={() => eliminarPosicion(index)}>Eliminar Posición</button>
            </div>
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

export default PosicionesAdicionales;
