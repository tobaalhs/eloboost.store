// price-calculator.js
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

const LP_DISCOUNTS = {
    '0-29': 0,
    '30-59': 0.05,
    '60-100': 0.1
};

const LP_GAIN_MODIFIERS = {
    '1-19': 1.1,    // +10% para LP gain bajo
    '20-25': 1,     // sin cambio para LP gain normal
    '26+': 0.95      // -10% para LP gain alto
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
        const laneBonus = totalPrice * 0.1;
        debugLog('Bonus por línea preferida (+10%):', laneBonus);
        totalPrice *= 1.1;
    }

    debugLog('PRECIO FINAL:', Math.round(totalPrice));
    debugLog('=== FIN CÁLCULO DE PRECIO ===\n');

    return Math.round(totalPrice);
}

function setDebugMode(enabled) {
    DEBUG_MODE = enabled;
}

export { calculatePrice, setDebugMode };
