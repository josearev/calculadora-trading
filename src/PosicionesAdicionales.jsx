import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function PosicionesAdicionales({ posiciones, actualizarPosicion, eliminarPosicion, nodeRefs }) {
  return (
    <div className="additional-positions-container">
      <h2>Posiciones Adicionales</h2>
      <TransitionGroup>
        {posiciones.map((pos, index) => (
          <CSSTransition
            key={pos.id}
            nodeRef={nodeRefs.current[index]}
            timeout={500}
            classNames="slide"
          >
            <div ref={nodeRefs.current[index]} className="position-item">
              <label>Cantidad de BTC:</label>
              <input
                type="number"
                value={pos.cantidadBTC}
                onChange={(e) => actualizarPosicion(pos.id, "cantidadBTC", e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && nodeRefs.current[index + 1]?.current?.focus()}
              />
              <label>Precio de Entrada ($):</label>
              <input
                type="number"
                value={pos.precioEntrada}
                onChange={(e) => actualizarPosicion(pos.id, "precioEntrada", e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && nodeRefs.current[index + 1]?.current?.focus()}
              />
              <button onClick={() => eliminarPosicion(pos.id)}>Eliminar</button>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default PosicionesAdicionales;
