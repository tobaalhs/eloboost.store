// Precios por división en Valorant
const DIVISION_PRICES = {
    'Hierro 1': 1500,
    'Hierro 2': 1500,
    'Hierro 3': 2000,
    'Bronce 1': 2000,
    'Bronce 2': 2000,
    'Bronce 3': 2500,
    'Plata 1': 3000,
    'Plata 2': 3000,
    'Plata 3': 3500,
    'Oro 1': 4000,
    'Oro 2': 4000,
    'Oro 3': 4500,
    'Platino 1': 5000,
    'Platino 2': 5500,
    'Platino 3': 6000,
    'Diamante 1': 6500,
    'Diamante 2': 7000,
    'Diamante 3': 7500,
    'Ascendente 1': 8000,
    'Ascendente 2': 8500,
    'Ascendente 3': 9000
};

function convertCLPtoUSD(clpAmount) {
    // Aumentar el precio CLP en 5.4%
    const clpWithFee = clpAmount * 1.054;
    
    // Convertir a USD (usando tasa aproximada 1 USD = 1017.25 CLP)
    const usdAmount = clpWithFee / 1017.25;
    
    // Añadir 0.30 USD de fee
    const finalUSD = usdAmount + 0.30;
    
    // Redondear a dos decimales
    return Number(finalUSD.toFixed(2));
}

let DEBUG_MODE = false;

function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log(...args);
    }
}

function calculatePrice(fromRank, toRank, selectedLane) {
    debugLog('Calculando precio de:', fromRank, 'a', toRank);
    let totalPrice = 0;
    
    // Orden de rangos en Valorant
    const ranks = [
        'Hierro 1', 'Hierro 2', 'Hierro 3',
        'Bronce 1', 'Bronce 2', 'Bronce 3',
        'Plata 1', 'Plata 2', 'Plata 3',
        'Oro 1', 'Oro 2', 'Oro 3',
        'Platino 1', 'Platino 2', 'Platino 3',
        'Diamante 1', 'Diamante 2', 'Diamante 3',
        'Ascendente 1', 'Ascendente 2', 'Ascendente 3',
        'Inmortal'
    ];

    const fromIndex = ranks.indexOf(fromRank);
    const toIndex = ranks.indexOf(toRank);

    debugLog('Índices:', { fromIndex, toIndex });

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
        debugLog('Rango inválido o igual');
        return 0;
    }

    // Calcular precio sumando cada división entre el rango actual y el objetivo
    for (let i = fromIndex; i < toIndex; i++) {
        if (ranks[i] !== 'Inmortal') {
            const divisionPrice = DIVISION_PRICES[ranks[i]];
            debugLog(`Precio para ${ranks[i]}: ${divisionPrice}`);
            totalPrice += divisionPrice;
        }
    }

    debugLog('Precio base:', totalPrice);

    // Aplicar multiplicador por rol seleccionado (10%)
    if (selectedLane !== 'none') {
        totalPrice *= 1.1;
        debugLog('Precio después de rol preferido (+10%):', totalPrice);
    }

    // Aplicar multiplicador por agentes específicos (25%)
    if (window.selectedChampions && window.selectedChampions.size >= 3) {
        totalPrice *= 1.25;
        debugLog('Precio después de agentes específicos (+25%):', totalPrice);
    }

    return Math.round(totalPrice);
}

function setDebugMode(enabled) {
    DEBUG_MODE = enabled;
}

export { calculatePrice, setDebugMode, convertCLPtoUSD };