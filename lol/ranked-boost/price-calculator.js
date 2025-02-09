// price-calculator.js
/*
const DIVISION_PRICES = {
    iron: 1500,
    bronze: 1800,
    silver: 2000,
    gold: 2500,
    platinum: 3250,
    emerald: 4500,
    diamond: 7500
};

const LEAGUE_COMPLETE_PRICES = {
    iron: 5500,
    bronze: 6000,
    silver: 6500,
    gold: 8000,
    platinum: 11000,
    emerald: 16000,
    diamond: 27500,
    master: 25000,
    grandmaster: 50000
};
*/
const DIVISION_PRICES = {
    iron: 2000,
    bronze: 2000,
    silver: 2500,
    gold: 3500,
    platinum: 4500,
    emerald: 6500,
    diamond: 8500
};

const LEAGUE_COMPLETE_PRICES = {
    iron: 7000,
    bronze: 7000,
    silver: 9000,
    gold: 12500,
    platinum: 15000,
    emerald: 24000,
    diamond: 32000,
    master: 32000,
    grandmaster: 60000
};

function convertCLPtoUSD(clpAmount) {
    // Aumentar el precio CLP en 5.4%
    const clpWithFee = clpAmount * 1.054;
    
    // Convertir a USD (usando tasa aproximada 1 USD = 1017.25 CLP)
    const usdAmount = clpWithFee / 1017.25;
    
    // Añadir 0.30 USD de fee
    const finalUSD = usdAmount + 0.30;
    
    // Redondear a la decena de centavos más cercana
    const roundedUSD = Math.round(finalUSD * 10) / 10;
    
    // Forzar dos decimales añadiendo un cero si es necesario
    return roundedUSD.toFixed(2);
}

const LP_DISCOUNTS = {
    '0-29': 0,
    '30-59': 0.05,
    '60-100': 0.1
};

const LP_GAIN_MODIFIERS = {
    '1-19': 1.2,
    '20-25': 1,
    '26+': 0.95
};

const RANK_ORDER = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond', 'master', 'grandmaster', 'challenger'];

const RANK_TRANSLATIONS = {
    'hierro': 'iron',
    'bronce': 'bronze',
    'plata': 'silver',
    'oro': 'gold',
    'platino': 'platinum',
    'esmeralda': 'emerald',
    'diamante': 'diamond',
    'maestro': 'master',
    'gran maestro': 'grandmaster',
    'retador': 'challenger'
};

let DEBUG_MODE = false;

function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log(...args);
    }
}

function getRankTier(rankName) {
    const spanishTier = rankName.toLowerCase().split(' ')[0];
    return RANK_TRANSLATIONS[spanishTier] || spanishTier;
}

function getRankDivision(rankName) {
    const parts = rankName.toLowerCase().split(' ');
    if (parts.length < 2) return 0;
    const division = parts[1];
    return parseInt(division.replace('iv', '4').replace('iii', '3').replace('ii', '2').replace('i', '1'));
}

function calculatePrice(fromRank, toRank, lpRange, selectedLane, lpGain = '20-25') {
    const fromTier = getRankTier(fromRank);
    const toTier = getRankTier(toRank);
    const fromDiv = getRankDivision(fromRank);
    const toDiv = getRankDivision(toRank);
    
    debugLog('\n=== INICIO CÁLCULO DE PRECIO ===');
    debugLog('Desde:', fromTier, fromDiv);
    debugLog('Hasta:', toTier, toDiv);
    debugLog('LP Range:', lpRange);
    debugLog('Lane:', selectedLane);
    debugLog('LP Gain:', lpGain);

    let totalPrice = 0;
    const fromIndex = RANK_ORDER.indexOf(fromTier);
    const toIndex = RANK_ORDER.indexOf(toTier);

    if (fromRank === toRank) {
        debugLog('Mismo rango y división - Precio: 0');
        return 0;
    }

    if (fromTier === 'master' || fromTier === 'grandmaster' || toTier === 'master' || toTier === 'grandmaster' || toTier === 'challenger') {
        if (fromTier === 'master' && toTier === 'grandmaster') {
            debugLog('Precio fijo Master a Grandmaster: 25000');
            totalPrice = 25000;
        } else if (fromTier === 'master' && toTier === 'challenger') {
            debugLog('Precio Master a Challenger: 75000');
            totalPrice = 75000;
        } else if (fromTier === 'grandmaster' && toTier === 'challenger') {
            debugLog('Precio fijo Grandmaster a Challenger: 50000');
            totalPrice = 50000;
        } else {
            if (fromDiv !== 4) {
                const divisionsNeeded = fromDiv;
                const divisionPrice = divisionsNeeded * DIVISION_PRICES[fromTier];
                debugLog(`Divisiones en ${fromTier}: ${divisionsNeeded} x ${DIVISION_PRICES[fromTier]} = ${divisionPrice}`);
                totalPrice += divisionPrice;
            } else {
                debugLog(`Liga completa ${fromTier}: ${LEAGUE_COMPLETE_PRICES[fromTier]}`);
                totalPrice += LEAGUE_COMPLETE_PRICES[fromTier];
            }

            for (let i = fromIndex + 1; i < RANK_ORDER.indexOf('diamond') + 1; i++) {
                const leaguePrice = LEAGUE_COMPLETE_PRICES[RANK_ORDER[i]];
                debugLog(`Liga intermedia ${RANK_ORDER[i]}: ${leaguePrice}`);
                totalPrice += leaguePrice;
            }

            if (toTier === 'master') {
                debugLog('Precio final hasta Master: 27500');
                totalPrice += 0;
            } else if (toTier === 'grandmaster') {
                debugLog('Precio final hasta Grandmaster: 25000');
                totalPrice += 25000;
            } else if (toTier === 'challenger') {
                debugLog('Precio final hasta Challenger: 102500');
                totalPrice += 75000;
            }
        }
    } else {
        if (fromIndex === toIndex) {
            const divisions = fromDiv - toDiv;
            if (divisions > 0) {
                const divisionPrice = divisions * DIVISION_PRICES[fromTier];
                debugLog(`Divisiones en ${fromTier}: ${divisions} x ${DIVISION_PRICES[fromTier]} = ${divisionPrice}`);
                totalPrice += divisionPrice;
            }
        } else {
            if (fromDiv === 4) {
                debugLog(`Liga completa ${fromTier}: ${LEAGUE_COMPLETE_PRICES[fromTier]}`);
                totalPrice += LEAGUE_COMPLETE_PRICES[fromTier];
            } else {
                const divisionsNeeded = fromDiv;
                const divisionPrice = divisionsNeeded * DIVISION_PRICES[fromTier];
                debugLog(`Divisiones en ${fromTier}: ${divisionsNeeded} x ${DIVISION_PRICES[fromTier]} = ${divisionPrice}`);
                totalPrice += divisionPrice;
            }

            for (let i = fromIndex + 1; i < toIndex; i++) {
                const leaguePrice = LEAGUE_COMPLETE_PRICES[RANK_ORDER[i]];
                debugLog(`Liga intermedia ${RANK_ORDER[i]}: ${leaguePrice}`);
                totalPrice += leaguePrice;
            }

            if (toDiv < 4) {
                const remainingDivs = 4 - toDiv;
                const divisionPrice = remainingDivs * DIVISION_PRICES[toTier];
                debugLog(`Divisiones en liga final ${toTier}: ${remainingDivs} x ${DIVISION_PRICES[toTier]} = ${divisionPrice}`);
                totalPrice += divisionPrice;
            }
        }
    }

    debugLog('Subtotal antes de modificadores:', totalPrice);

    // Aplicar descuento por LP actuales si corresponde
    const lpDiscount = LP_DISCOUNTS[lpRange];
    if (lpDiscount > 0) {
        const firstDivisionPrice = DIVISION_PRICES[fromTier];
        const discount = firstDivisionPrice * lpDiscount;
        debugLog(`Descuento LP actuales (${lpRange}): -${discount}`);
        totalPrice -= discount;
    }

    // Aplicar modificador por LP gain
    const lpGainModifier = LP_GAIN_MODIFIERS[lpGain];
    if (lpGainModifier !== 1) {
        const originalPrice = totalPrice;
        totalPrice *= lpGainModifier;
        const difference = totalPrice - originalPrice;
        debugLog(`Modificador LP Gain (${lpGain}): ${difference > 0 ? '+' : ''}${Math.round(difference)}`);
    }

    // Aplicar aumento por línea preferida
    if (selectedLane !== 'none') {
        let laneMultiplier = 1.1; // Default 10% para todas las líneas excepto support
        
        if (selectedLane === 'support') {
            // Si es support, verificar el tipo de cola
            const queueType = document.querySelector('input[name="queue-choice"]:checked').value;
            laneMultiplier = queueType === 'soloq' ? 1.25 : 1.15; // 25% para SoloQ, 15% para FlexQ
        }
        
        const laneBonus = totalPrice * (laneMultiplier - 1);
        debugLog(`Bonus por línea preferida (${(laneMultiplier - 1) * 100}%):`, laneBonus);
        totalPrice *= laneMultiplier;
    }

    // Aplicar aumento por campeones específicos si hay campeones seleccionados
    const championSet = window.selectedChampions;
    if (championSet && championSet.size >= 5) { // Cambiado de 3 a 5
        const championMultiplier = 1.25; // Cambiado de 1.3 (30%) a 1.25 (25%)
        const championBonus = totalPrice * (championMultiplier - 1);
        debugLog(`Bonus por campeones específicos (25%):`, championBonus); // Actualizado el mensaje
        totalPrice *= championMultiplier;
    }

    debugLog('PRECIO FINAL:', Math.round(totalPrice));
    debugLog('=== FIN CÁLCULO DE PRECIO ===\n');

    return Math.round(totalPrice);
}

function setDebugMode(enabled) {
    DEBUG_MODE = enabled;
}

export { calculatePrice, setDebugMode, convertCLPtoUSD };
