import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import ParametrosIniciales from "./ParametrosIniciales";
import PosicionesAdicionales from "./PosicionesAdicionales";
import Resultados from "./Resultados";
import GananciaPerdida from "./GananciaPerdida";

function App() {
  const [fondosMargen, setFondosMargen] = useState("");
  const [cantidadBTCInicial, setCantidadBTCInicial] = useState("");
  const [precioEntradaInicial, setPrecioEntradaInicial] = useState("");
  const [precioRecompra, setPrecioRecompra] = useState("");
  const [posiciones, setPosiciones] = useState([]);
  const [gananciaPerdida, setGananciaPerdida] = useState(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, posiciones.length);
  }, [posiciones]);

  const formatNumber = (value) => {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const agregarPosicion = () => {
    const newPosicion = { id: uuidv4(), cantidadBTC: "", precioEntrada: "" };
    setPosiciones([...posiciones, newPosicion]);
    nodeRefs.current.push(React.createRef());
  };

  const eliminarPosicion = (id) => {
    const nuevasPosiciones = posiciones.filter((pos) => pos.id !== id);
    setPosiciones(nuevasPosiciones);
    nodeRefs.current = nodeRefs.current.filter((_, i) => posiciones[i].id !== id);
  };

  const actualizarPosicion = (id, key, value) => {
    const nuevasPosiciones = posiciones.map((pos) =>
      pos.id === id ? { ...pos, [key]: value.replace(/,/g, '.') } : pos
    );
    setPosiciones(nuevasPosiciones);
  };

  const calcularPosicionPonderada = () => {
    let cantidadTotalBTC = parseFloat(cantidadBTCInicial) || 0;
    let sumaPonderadaPrecios = cantidadTotalBTC * (parseFloat(precioEntradaInicial) || 0);

    posiciones.forEach((pos) => {
      cantidadTotalBTC += parseFloat(pos.cantidadBTC) || 0;
      sumaPonderadaPrecios += (parseFloat(pos.cantidadBTC) || 0) * (parseFloat(pos.precioEntrada) || 0);
    });

    const precioPromedio = cantidadTotalBTC > 0 ? sumaPonderadaPrecios / cantidadTotalBTC : 0;
    return { cantidadTotalBTC, precioPromedio };
  };

  const calcularResultados = () => {
    const { cantidadTotalBTC, precioPromedio } = calcularPosicionPonderada();
    const margen = parseFloat(fondosMargen) || 0;

    // Validación de casos borde
    if (margen <= 0 || cantidadTotalBTC <= 0 || precioPromedio <= 0) {
      return null;
    }

    const nivelApalancamiento = (cantidadTotalBTC * precioPromedio) / margen;
    const precioLiquidacionLarga = precioPromedio * (1 - margen / (cantidadTotalBTC * precioPromedio + margen));
    const precioLiquidacionCorta = precioPromedio * (1 + margen / (cantidadTotalBTC * precioPromedio + margen));

    const fondosDisponiblesLarga = Math.max(
      precioLiquidacionLarga * cantidadTotalBTC - (cantidadTotalBTC * precioPromedio - margen),
      0
    );
    const fondosDisponiblesCorta = Math.max(
      margen + cantidadTotalBTC * precioPromedio - precioLiquidacionCorta * cantidadTotalBTC,
      0
    );

    return {
      nivelApalancamiento,
      precioLiquidacionLarga,
      precioLiquidacionCorta,
      fondosDisponiblesLarga,
      fondosDisponiblesCorta,
    };
  };

  const calcularPrestamo = () => {
    const { cantidadTotalBTC, precioPromedio } = calcularPosicionPonderada();
    const margen = parseFloat(fondosMargen) || 0;
    const prestamoBTC = precioPromedio > 0 ? cantidadTotalBTC - (margen / precioPromedio) : 0;
    const prestamoUSD = prestamoBTC * precioPromedio;
    return { prestamoBTC, prestamoUSD };
  };

  const calcularGananciaPerdida = () => {
    const { cantidadTotalBTC, precioPromedio } = calcularPosicionPonderada();
    const precioRecompraValor = parseFloat(precioRecompra) || precioPromedio;
    const margen = parseFloat(fondosMargen) || 0;

    if (precioRecompraValor <= 0 || cantidadTotalBTC <= 0 || precioPromedio <= 0) {
      return;
    }

    const saldoFinalLarga = (cantidadTotalBTC * precioRecompraValor) - (cantidadTotalBTC * precioPromedio - margen);
    const gananciaPerdidaLarga = saldoFinalLarga - margen;

    const saldoFinalCorta = margen + (cantidadTotalBTC * precioPromedio) - (cantidadTotalBTC * precioRecompraValor);
    const gananciaPerdidaCorta = saldoFinalCorta - margen;

    setGananciaPerdida({
      saldoFinalLarga,
      gananciaPerdidaLarga,
      saldoFinalCorta,
      gananciaPerdidaCorta,
    });
  };

  useEffect(() => {
    calcularGananciaPerdida();
  }, [fondosMargen, cantidadBTCInicial, precioEntradaInicial, precioRecompra, posiciones]);

  const resultados = calcularResultados() || {
    nivelApalancamiento: 0,
    precioLiquidacionLarga: 0,
    precioLiquidacionCorta: 0,
    fondosDisponiblesLarga: 0,
    fondosDisponiblesCorta: 0,
  };
  const prestamo = calcularPrestamo();
  const { precioPromedio } = calcularPosicionPonderada();

  useEffect(() => {
    if (precioRecompra === "") {
      setPrecioRecompra(precioPromedio.toString());
    }
  }, [precioPromedio, precioRecompra]);

  return (
    <div className="app-container">
      <h1>Calculadora de Trading</h1>
      <ParametrosIniciales
        fondosMargen={fondosMargen}
        setFondosMargen={setFondosMargen}
        cantidadBTCInicial={cantidadBTCInicial}
        setCantidadBTCInicial={setCantidadBTCInicial}
        precioEntradaInicial={precioEntradaInicial}
        setPrecioEntradaInicial={setPrecioEntradaInicial}
      />
      <PosicionesAdicionales
        posiciones={posiciones}
        actualizarPosicion={actualizarPosicion}
        eliminarPosicion={eliminarPosicion}
        nodeRefs={nodeRefs}
      />
      <button onClick={agregarPosicion}>Agregar Posición</button>
      <Resultados
        calcularPosicionPonderada={calcularPosicionPonderada}
        prestamo={prestamo}
        resultados={resultados}
        formatNumber={formatNumber}
      />
      <GananciaPerdida
        precioRecompra={precioRecompra}
        setPrecioRecompra={setPrecioRecompra}
        gananciaPerdida={gananciaPerdida}
        formatNumber={formatNumber}
        precioPromedio={precioPromedio}
      />
    </div>
  );
}

export default App;
