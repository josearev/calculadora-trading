describe('Cálculos de la Calculadora de Apalancamiento', () => {
    const calcularResultados = (fondosMargen, cantidadBTCInicial, precioEntradaInicial, posiciones = []) => {
        let cantidadTotalBTC = parseFloat(cantidadBTCInicial) || 0;
        let sumaPonderadaPrecios = cantidadTotalBTC * (parseFloat(precioEntradaInicial) || 0);

        posiciones.forEach((pos) => {
            cantidadTotalBTC += parseFloat(pos.cantidadBTC) || 0;
            sumaPonderadaPrecios += (parseFloat(pos.cantidadBTC) || 0) * (parseFloat(pos.precioEntrada) || 0);
        });

        const precioPromedio = cantidadTotalBTC > 0 ? sumaPonderadaPrecios / cantidadTotalBTC : 0;
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

    describe('Cálculo con valores iniciales', () => {
        test('Nivel de apalancamiento', () => {
            const resultados = calcularResultados(18000, 0.54, 99333);
            expect(resultados.nivelApalancamiento).toBeCloseTo(2.98, 2);
        });

        test('Precio de liquidación larga', () => {
            const resultados = calcularResultados(18000, 0.54, 99333);
            expect(resultados.precioLiquidacionLarga).toBeCloseTo(74374.90, 2);
        });

        test('Precio de liquidación corta', () => {
            const resultados = calcularResultados(18000, 0.54, 99333);
            expect(resultados.precioLiquidacionCorta).toBeCloseTo(124291.10, 2);
        });
    });

    describe('Cálculo con una posición adicional', () => {
        const posiciones = [{ cantidadBTC: 0.15, precioEntrada: 97425 }];

        test('Nivel de apalancamiento', () => {
            const resultados = calcularResultados(18000, 0.39, 99962, posiciones);
            expect(resultados.nivelApalancamiento).toBeCloseTo(2.98, 2);
        });

        test('Precio de liquidación larga', () => {
            const resultados = calcularResultados(18000, 0.39, 99962, posiciones);
            expect(resultados.precioLiquidacionLarga).toBeCloseTo(74303.96, 2);
        });

        test('Precio de liquidación corta', () => {
            const resultados = calcularResultados(18000, 0.39, 99962, posiciones);
            expect(resultados.precioLiquidacionCorta).toBeCloseTo(124210.60, 2);
        });
    });

    describe('Cálculo con posiciones adicionales múltiples', () => {
        const posiciones = [
            { cantidadBTC: 0.15, precioEntrada: 97425 },
            { cantidadBTC: 0.25, precioEntrada: 96550 },
        ];

        test('Nivel de apalancamiento', () => {
            const resultados = calcularResultados(18000, 0.39, 99962, posiciones);
            expect(resultados.nivelApalancamiento).toBeCloseTo(4.32, 2);
        });

        test('Precio de liquidación larga', () => {
            const resultados = calcularResultados(18000, 0.39, 99962, posiciones);
            expect(resultados.precioLiquidacionLarga).toBeCloseTo(79899.65, 2);
        });

        test('Precio de liquidación corta', () => {
            const resultados = calcularResultados(18000, 0.39, 99962, posiciones);
            expect(resultados.precioLiquidacionCorta).toBeCloseTo(116901.44, 2);
        });
    });

    describe('Casos de borde', () => {
        test('Sin margen devuelve resultados nulos', () => {
            const resultados = calcularResultados(0, 0.54, 99333);
            expect(resultados).toBeNull();
        });

        test('Cantidad BTC inicial o precio de entrada en cero devuelve resultados nulos', () => {
            const resultados = calcularResultados(18000, 0, 0);
            expect(resultados).toBeNull();
        });

        test('Cantidad BTC negativa devuelve resultados nulos', () => {
            const resultados = calcularResultados(18000, -0.5, 99333);
            expect(resultados).toBeNull();
        });

        test('Fondos de margen negativos devuelve resultados nulos', () => {
            const resultados = calcularResultados(-18000, 0.54, 99333);
            expect(resultados).toBeNull();
        });
    });
});
