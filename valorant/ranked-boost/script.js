import { calculatePrice, setDebugMode, convertCLPtoUSD } from './price-calculator.js';

// Lista de agentes de Valorant
const champions = [
    'Brimstone', 'Phoenix', 'Sage', 'Sova', 'Viper', 'Cypher', 'Reyna', 'KillJoy', 
    'Breach', 'Omen', 'Jett', 'Raze', 'Skye', 'Yoru', 'Astra', 'Kay-o', 'Chamber', 
    'Neon', 'Fade', 'Harbor', 'Gekko', 'Deadlock', 'Iso', 'Clove', 'Vyse', 'Tejo'
];

// Objeto con las URLs de los iconos
const agentIcons = {
    'Brimstone': 'https://static.wikia.nocookie.net/valorant/images/4/4d/Brimstone_icon.png',
    'Phoenix' : 'https://static.wikia.nocookie.net/valorant/images/1/14/Phoenix_icon.png',
    'Sage' : 'https://static.wikia.nocookie.net/valorant/images/7/74/Sage_icon.png',
    'Sova' : 'https://static.wikia.nocookie.net/valorant/images/4/49/Sova_icon.png',
    'Viper' : 'https://static.wikia.nocookie.net/valorant/images/5/5f/Viper_icon.png',
    'Cypher' : 'https://static.wikia.nocookie.net/valorant/images/8/88/Cypher_icon.png',
    'Reyna' : 'https://static.wikia.nocookie.net/valorant/images/b/b0/Reyna_icon.png',
    'KillJoy' : 'https://static.wikia.nocookie.net/valorant/images/1/15/Killjoy_icon.png',
    'Breach' : 'https://static.wikia.nocookie.net/valorant/images/5/53/Breach_icon.png',
    'Omen' : 'https://static.wikia.nocookie.net/valorant/images/f/f3/Harbor_icon.png',
    'Jett' : 'https://static.wikia.nocookie.net/valorant/images/3/35/Jett_icon.png',
    'Raze' : 'https://static.wikia.nocookie.net/valorant/images/9/9c/Raze_icon.png',
    'Skye' : 'https://static.wikia.nocookie.net/valorant/images/3/33/Skye_icon.png',
    'Yoru' : 'https://static.wikia.nocookie.net/valorant/images/d/d4/Yoru_icon.png',
    'Astra': 'https://static.wikia.nocookie.net/valorant/images/0/08/Astra_icon.png',
    'Kay-o' : 'https://static.wikia.nocookie.net/valorant/images/f/f0/KAYO_icon.png',
    'Chamber' : 'https://static.wikia.nocookie.net/valorant/images/0/09/Chamber_icon.png',
    'Neon' : 'https://static.wikia.nocookie.net/valorant/images/d/d0/Neon_icon.png',
    'Fade' : 'https://static.wikia.nocookie.net/valorant/images/a/a6/Fade_icon.png',
    'Harbor' : 'https://static.wikia.nocookie.net/valorant/images/f/f3/Harbor_icon.png',
    'Gekko' : 'https://static.wikia.nocookie.net/valorant/images/6/66/Gekko_icon.png',
    'Deadlock' : 'https://static.wikia.nocookie.net/valorant/images/e/eb/Deadlock_icon.png',
    'Iso' : 'https://static.wikia.nocookie.net/valorant/images/b/b7/Iso_icon.png',
    'Clove' : 'https://static.wikia.nocookie.net/valorant/images/1/14/Phoenix_icon.png',
    'Vyse' : 'https://static.wikia.nocookie.net/valorant/images/2/21/Vyse_icon.png',
    'Tejo' : 'https://static.wikia.nocookie.net/valorant/images/9/90/Tejo_icon.png',
};

window.selectedChampions = new Set();
window.availableChampions = new Set(champions);

function clearSelectedChampions() {
    selectedChampions.clear();
    window.availableChampions = new Set(champions);
    const container = document.getElementById('selectedChampions');
    container.innerHTML = '';
    updateChampionWarning();
    updatePoolChampVisibility();
    updatePrice(getRankByValue(fromValue).name, getRankByValue(toValue).name);
}


function updateChampionSectionState(isEnabled) {
    const championSearch = document.getElementById('championSearch');
    const championDropdown = document.getElementById('championDropdown');
    const dropdownArrow = document.querySelector('.dropdown-arrow');

    // Configurar el estado del input de búsqueda
    championSearch.disabled = !isEnabled;
    championSearch.style.opacity = isEnabled ? '1' : '0.5';
    championSearch.style.cursor = isEnabled ? 'text' : 'not-allowed';
    championSearch.placeholder = isEnabled
        ? "Seleccionar agente..."
        : "Selecciona un rol primero";

    // Invertir la funcionalidad de la flecha (pero no la opacidad)
    dropdownArrow.style.opacity = !isEnabled ? '0.5' : '1'; // Aquí sigue la lógica normal
    dropdownArrow.style.cursor = !isEnabled ? 'pointer' : 'not-allowed';

    // Gestionar el evento de clic de la flecha (al revés)
    dropdownArrow.removeEventListener('click', handleArrowClick); // Limpia eventos previos
    if (!isEnabled) {
        dropdownArrow.addEventListener('click', handleArrowClick);
    } else {
        // Cierra el dropdown si se "desactiva" (realmente, activado)
        championDropdown.classList.remove('active');
        dropdownArrow.classList.remove('active');
    }
}





function handleArrowClick(e) {
    e.stopPropagation(); // Evitar que otros eventos interfieran
    const dropdown = document.getElementById('championDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
    const isActive = dropdown.classList.contains('active');

    if (isActive) {
        dropdown.classList.remove('active');
        arrow.classList.remove('active');
    } else {
        // Actualiza la lista de campeones y abre el dropdown
        showAllChampions();
        dropdown.classList.add('active');
        arrow.classList.add('active');
    }
}

document.querySelectorAll('input[name="lane-choice"]').forEach(input => {
    input.addEventListener('change', () => {
        const isLaneSelected = input.value !== 'none';
        
        updateChampionSectionState(isLaneSelected);
        
        if (!isLaneSelected) {
            clearSelectedChampions();
        }
        
        const fromRank = getRankByValue(fromValue);
        const toRank = getRankByValue(toValue);
        if (fromRank && toRank && fromRank.name && toRank.name) {
            updatePrice(fromRank.name, toRank.name);
        }
    });
});

function showAllChampions() {
    const dropdown = document.getElementById('championDropdown');
    dropdown.innerHTML = '';
    
    
    
    Array.from(window.availableChampions).sort().forEach(champ => {
        const option = document.createElement('div');
        option.className = 'champion-option';
        
        const img = document.createElement('img');
        img.src = agentIcons[champ] || handleImageError(img);
        img.alt = champ;
        img.className = 'agent-icon';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = champ;
        
        option.appendChild(img);
        option.appendChild(nameSpan);
        
        option.addEventListener('click', () => {
            addChampion(champ, champ);
        });
        dropdown.appendChild(option);
    });
}

function formatChampionName(name) {
    return name
        .replace(/%27/g, "'")
        .replace(/_/g, " ")
        .replace(/\./g, "");
}


function handleImageError(img) {
    img.onerror = null; // Prevenir bucle infinito
    img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCI+PzwvdGV4dD48L3N2Zz4=';
}

function initializeChampionSelector() {
    const searchInput = document.getElementById('championSearch');
    const dropdown = document.getElementById('championDropdown');
    const arrow = document.querySelector('.dropdown-arrow');

    function showAllChampions() {
        dropdown.innerHTML = '';
        const availableChampions = champions.filter(champ => !selectedChampions.has(champ));
        availableChampions.forEach(champ => {
            const option = document.createElement('div');
            option.className = 'champion-option';

            const img = document.createElement('img');
            img.src = agentIcons[champ] || handleImageError(img);
            img.alt = champ;
            img.className = 'agent-icon';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = champ;

            option.appendChild(img);
            option.appendChild(nameSpan);

            option.addEventListener('click', () => {
                addChampion(champ, champ);
            });
            dropdown.appendChild(option);
        });
    }

    function handleImageError(img) {
        img.onerror = null; // Prevenir bucle infinito
        img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCI+PzwvdGV4dD48L3N2Zz4=';
    }

    function toggleDropdown() {
        const isActive = dropdown.classList.contains('active');
        if (isActive) {
            dropdown.classList.remove('active');
            arrow.classList.remove('active');
        } else {
            showAllChampions();
            dropdown.classList.add('active');
            arrow.classList.add('active');
        }
    }

    // Mostrar todos los campeones al hacer clic en el input
    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
        showAllChampions(); // Actualizar lista antes de desplegar
        dropdown.classList.add('active');
        arrow.classList.add('active');
    });

    // Mostrar todos los campeones al hacer clic en la flecha
    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    // Filtrar campeones al escribir en el input
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const filtered = champions.filter(champ => 
            !selectedChampions.has(champ) &&
            champ.toLowerCase().includes(searchValue)
        );

        dropdown.innerHTML = '';
        filtered.forEach(champ => {
            const option = document.createElement('div');
            option.className = 'champion-option';

            const img = document.createElement('img');
            img.src = agentIcons[champ] || handleImageError(img);
            img.alt = champ;
            img.className = 'agent-icon';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = champ;

            option.appendChild(img);
            option.appendChild(nameSpan);

            option.addEventListener('click', () => {
                addChampion(champ, champ);
            });
            dropdown.appendChild(option);
        });

        dropdown.classList.add('active');
        arrow.classList.add('active');
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.champion-search')) {
            dropdown.classList.remove('active');
            arrow.classList.remove('active');
        }
    });
}


function updatePoolChampVisibility() {
    const container = document.getElementById('poolChampContainer');
    const hasChampions = selectedChampions.size > 0;
    container.style.display = hasChampions ? 'block' : 'none';
}

function updateButtonState() {
    const payButton = document.querySelector('.pay-button');
    const warningElement = document.getElementById('minChampionsWarning');
    
    if (selectedChampions.size > 0 && selectedChampions.size < 5) { // Cambiado de 3 a 5
        warningElement.style.display = 'block';
    } else {
        warningElement.style.display = 'none';
        payButton.disabled = false;
    }
}

function addChampion(championId, displayName) {
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    if (selectedLane === 'none') return; // No permitir añadir campeones si no hay línea seleccionada

    if (selectedChampions.has(championId)) return;
    
    selectedChampions.add(championId);
    window.availableChampions.delete(championId);
    showAllChampions(); // Actualizamos la lista inmediatamente

    if (selectedChampions.size >= 5) {
        document.getElementById('minChampionsWarning').style.display = 'none';
    }

    const container = document.getElementById('selectedChampions');
    const championElement = document.createElement('div');
    championElement.className = 'selected-champion';
    
    const img = document.createElement('img');
    img.src = agentIcons[championId] || handleImageError(img);
    img.alt = displayName;
    img.className = 'agent-icon';
    img.onerror = () => handleImageError(img);
    championElement.appendChild(img);

    const removeButton = document.createElement('span');
    removeButton.className = 'remove-champion';
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => {
        selectedChampions.delete(championId);
        window.availableChampions.add(championId);
        championElement.remove();
        updateChampionWarning();
        updatePoolChampVisibility();
        
        // Actualizar la lista desplegable
        const dropdown = document.getElementById('championDropdown');
        dropdown.classList.add('active'); // Aseguramos que el dropdown esté visible
        showAllChampions(); // Actualizamos la lista
        
        if (selectedChampions.size === 0 || selectedChampions.size >= 3) {
            document.getElementById('minChampionsWarning').style.display = 'none';
        }
        
        updatePrice(getRankByValue(fromValue).name, getRankByValue(toValue).name);
    });
    championElement.appendChild(removeButton);
    
    container.appendChild(championElement);
    document.getElementById('championSearch').value = '';
    document.getElementById('championDropdown').classList.remove('active');
    document.querySelector('.dropdown-arrow').classList.remove('active');
    
    updateChampionWarning();
    updatePoolChampVisibility();
    updateButtonState();
    updatePrice(getRankByValue(fromValue).name, getRankByValue(toValue).name);
}

function updateChampionWarning() {
    const warningElement = document.getElementById('championWarning');
    const count = selectedChampions.size;
    
    if (count > 0 && count < 3) {
        warningElement.textContent = `Selecciona ${3 - count} agente${3 - count !== 1 ? 's' : ''} más como mínimo`;
        warningElement.style.color = '#FFD700';
        warningElement.style.display = 'block';
        warningElement.style.fontStyle = 'italic';
    } else {
        warningElement.style.display = 'none';
    }
}

let DEBUG_MODE = false;

function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log(...args);
    }
}

setDebugMode(false);

const slider = document.querySelector('.slider');
const thumbFrom = document.getElementById('thumbFrom');
const thumbTo = document.getElementById('thumbTo');
const sliderRange = document.querySelector('.slider-range');
const rankTextFrom = document.getElementById('rankTextFrom');
const rankTextTo = document.getElementById('rankTextTo');
const rankImagesFrom = document.querySelector('.rank-display.from').querySelectorAll('.rank-image');
const rankImagesTo = document.querySelector('.rank-display.to').querySelectorAll('.rank-image');

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Ranks definidos
const ranks = [
    // Hierro (0-13.43%)
    { name: 'Hierro 1', rankType: 'iron_1', minValue: 0 },
    { name: 'Hierro 2', rankType: 'iron_2', minValue: 4.5 },
    { name: 'Hierro 3', rankType: 'iron_3', minValue: 9 },

    // Bronce (13.43-26.86%)
    { name: 'Bronce 1', rankType: 'bronze_1', minValue: 13.43 },
    { name: 'Bronce 2', rankType: 'bronze_2', minValue: 17.93 },
    { name: 'Bronce 3', rankType: 'bronze_3', minValue: 22.43 },

    // Plata (26.86-40.29%)
    { name: 'Plata 1', rankType: 'silver_1', minValue: 26.86 },
    { name: 'Plata 2', rankType: 'silver_2', minValue: 31.36 },
    { name: 'Plata 3', rankType: 'silver_3', minValue: 35.86 },

    // Oro (40.29-53.72%)
    { name: 'Oro 1', rankType: 'gold_1', minValue: 40.29 },
    { name: 'Oro 2', rankType: 'gold_2', minValue: 44.79 },
    { name: 'Oro 3', rankType: 'gold_3', minValue: 49.29 },

    // Platino (53.72-67.15%)
    { name: 'Platino 1', rankType: 'platinum_1', minValue: 53.72 },
    { name: 'Platino 2', rankType: 'platinum_2', minValue: 58.22 },
    { name: 'Platino 3', rankType: 'platinum_3', minValue: 62.72 },

    // Diamante (67.15-80.58%)
    { name: 'Diamante 1', rankType: 'diamond_1', minValue: 67.15 },
    { name: 'Diamante 2', rankType: 'diamond_2', minValue: 71.65 },
    { name: 'Diamante 3', rankType: 'diamond_3', minValue: 76.15 },

    // Ascendente (80.58-94%)
    { name: 'Ascendente 1', rankType: 'ascendant_1', minValue: 80.58 },
    { name: 'Ascendente 2', rankType: 'ascendant_2', minValue: 85.08 },
    { name: 'Ascendente 3', rankType: 'ascendant_3', minValue: 89.58 },

    // Inmortal (94-100%)
    { name: 'Inmortal', rankType: 'immortal_1', minValue: 94, maxValue: 100 }
];

let isDragging = false;
let currentThumb = null;
let fromValue = 27;
let toValue = 81;

function updateUI() {
    const fromRank = getRankByValue(fromValue);
    const toRank = getRankByValue(toValue);
    
    const fromPosition = (fromValue / 100) * slider.offsetWidth;
    const toPosition = (toValue / 100) * slider.offsetWidth;
    
    thumbFrom.style.left = `${fromPosition}px`;
    thumbTo.style.left = `${toPosition}px`;
    
    thumbFrom.dataset.rank = fromRank.rankType;
    thumbTo.dataset.rank = toRank.rankType;
    
    sliderRange.style.left = `${fromPosition}px`;
    sliderRange.style.width = `${toPosition - fromPosition}px`;
    
    updateRankImages(rankImagesFrom, fromRank.rankType);
    updateRankImages(rankImagesTo, toRank.rankType);
    rankTextFrom.innerHTML = formatRankName(fromRank.name);
    rankTextTo.innerHTML = formatRankName(toRank.name);

    if (fromRank && toRank && fromRank.name && toRank.name) {
        updatePrice(fromRank.name, toRank.name);
    }
}

let currentCurrency = 'CLP'; // Variable global para tracking de la moneda actual

function updatePrice(fromRankName, toRankName) {
    debugLog('UpdatePrice llamado con:', { fromRankName, toRankName });
    
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    
    try {
        const priceInCLP = calculatePrice(fromRankName, toRankName, selectedLane);
        debugLog('Precio calculado en CLP:', priceInCLP);
        
        const priceElement = document.getElementById('totalPrice');
        if (currentCurrency === 'CLP') {
            priceElement.textContent = priceInCLP.toLocaleString('es-CL') + ' CLP';
        } else {
            const priceInUSD = convertCLPtoUSD(priceInCLP);
            priceElement.textContent = priceInUSD.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + ' USD';
        }
    } catch (error) {
        console.error('Error calculando precio:', error);
    }
}

function getRankByValue(value) {
    debugLog('Obteniendo rango para valor:', value);
    
    const rank = ranks.reduce((prev, curr) => {
        if (value >= curr.minValue) {
            return curr;
        }
        return prev;
    }, ranks[0]);

    debugLog('Rango encontrado:', rank);
    return rank;
}

function updateRankImages(images, rankType) {
    images.forEach(img => {
        img.classList.remove('active');
        if (img.dataset.rank === rankType) {
            img.classList.add('active');
        }
    });
}

function getValueFromPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    const position = clientX - rect.left;
    let value = (position / rect.width) * 100;
    value = Math.max(0, Math.min(100, value)); 
    return value;
}

function getClosestRankValue(value) {
    // Para todos los casos, encuentra el valor más cercano
    let closestValue = ranks[0].minValue;
    let minDiff = Math.abs(value - ranks[0].minValue);
    
    for (const rank of ranks) {
        const diff = Math.abs(value - rank.minValue);
        if (diff < minDiff) {
            minDiff = diff;
            closestValue = rank.minValue;
        }
    }
    
    return closestValue;
}

function handleStart(e) {
    isDragging = true;
    currentThumb = e.target.id === 'thumbFrom' ? 'from' : 'to';
    e.preventDefault();
}

function handleMove(e) {
    if (!isDragging) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    let value = getValueFromPosition(clientX);
    const divisionDistance = 3;

    value = getClosestRankValue(value);

    let needsUpdate = false;

    if (currentThumb === 'from') {
        if (value <= (toValue - divisionDistance)) {
            fromValue = value;
            needsUpdate = true;
        }
    } else if (currentThumb === 'to') {
        if (value >= (fromValue + divisionDistance)) {
            toValue = value;
            needsUpdate = true;
        }
    }
    
    if (needsUpdate) {
        const fromRank = getRankByValue(fromValue);
        const toRank = getRankByValue(toValue);
        debugLog('Valores del slider actualizados:', {
            fromValue,
            toValue,
            fromRank: fromRank.name,
            toRank: toRank.name
        });
        updateUI();
        updatePrice(fromRank.name, toRank.name);
    }
}

function handleEnd() {
    isDragging = false;
    currentThumb = null;
}

// Event Listeners
menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    const isClickInsideMenu = navLinks.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

document.querySelectorAll('input[name="lane-choice"]').forEach(input => {
    input.addEventListener('change', () => {
        const fromRank = getRankByValue(fromValue);
        const toRank = getRankByValue(toValue);
        if (fromRank && toRank && fromRank.name && toRank.name) {
            updatePrice(fromRank.name, toRank.name);
        }
    });
});

thumbFrom.addEventListener('mousedown', handleStart);
thumbFrom.addEventListener('touchstart', handleStart);

thumbTo.addEventListener('mousedown', handleStart);
thumbTo.addEventListener('touchstart', handleStart);

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove, { passive: false });

document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);

slider.addEventListener('click', (e) => {
    const rawValue = getValueFromPosition(e.clientX);
    const value = getClosestRankValue(rawValue);
    const fromDist = Math.abs(value - fromValue);
    const toDist = Math.abs(value - toValue);
    
    const divisionDistance = 3;

    if (fromDist < toDist) {
        if (value <= (toValue - divisionDistance)) {
            fromValue = value;
        }
    } else {
        if (value >= (fromValue + divisionDistance)) {
            toValue = value;
        }
    }
    
    const fromRank = getRankByValue(fromValue);
    const toRank = getRankByValue(toValue);
    updateUI();
    updatePrice(fromRank.name, toRank.name);
});

slider.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

function formatLaneName(lane) {
    if (lane === 'none') return 'Sin preferencia';
    const roleNames = {
        'sentinel': 'Centinela',
        'duelist': 'Duelista',
        'initiator': 'Iniciador',
        'controller': 'Controlador'
    };
    return roleNames[lane] || lane;
}

function formatFlashOption(flash) {
    if (flash === 'none') return 'Sin preferencia';
    if (flash === 'flash-d') return 'Flash en D';
    if (flash === 'flash-f') return 'Flash en F';
    return flash;
}


const payButton = document.querySelector('.pay-button');
payButton.addEventListener('click', () => {
if (selectedChampions.size > 0 && selectedChampions.size < 3) {
    payButton.disabled = true;
    
    const warningElement = document.getElementById('championWarning');
    warningElement.textContent = 'Debes seleccionar al menos 3 agentes para continuar';
        warningElement.style.color = '#ff4444';
        warningElement.style.display = 'block';
        warningElement.style.fontStyle = 'normal';
        
        setTimeout(() => {
            if (selectedChampions.size > 0 && selectedChampions.size < 3) { // Cambiado de 3 a 5
                updateChampionWarning();
            } else {
                warningElement.style.display = 'none';
                payButton.disabled = false;
            }
        }, 3000);
        
        return;
    }

    // Si llegamos aquí, o no hay agentes seleccionados o hay 5 o más
const fromRank = getRankByValue(fromValue);
const toRank = getRankByValue(toValue);
const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;

let extras = [];
if (selectedLane !== 'none') {
    const extraPercent = '10%';
    extras.push(`Rol personalizado (+${extraPercent})`);
}
const extrasText = extras.length > 0 ? `Extras:%0A- ${extras.join('%0A- ')}` : 'Sin extras seleccionados';

let agentsList = '';
if (selectedChampions.size > 0) {
    agentsList = `Agentes Seleccionados:%0A- ${Array.from(selectedChampions).join('%0A- ')}%0A%0A`;
    if (!extras.includes('Agentes específicos (+25%)')) {
        extras.push('Agentes específicos (+25%)');
    }
}

const precioTexto = document.getElementById('totalPrice').textContent;
const mensaje = `¡Hola! Me gustaría solicitar un Boost:%0A%0A` +
`Rango Actual: ${fromRank.name}%0A` +
`Rango Objetivo: ${toRank.name}%0A` +
`Rol Preferido: ${formatLaneName(selectedLane)}%0A` +
`${agentsList}` +
`${extrasText}%0A%0A` +
`El precio calculado es: ${precioTexto}%0A%0A` +
`Por favor, confirma si este es el precio correcto.`;

const numeroWhatsApp = '+56929169240';
const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
window.open(urlWhatsApp, '_blank');
});

function formatRankName(name) {
    const parts = name.split(' ');
    if (parts.length > 2) {
        return `${parts[0]} ${parts[1]}<br>${parts.slice(2).join(' ')}`;
    } else if (parts.length > 1) {
        return `${parts[0]}<br>${parts.slice(1).join(' ')}`;
    }
    return name;
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultLaneInput = document.querySelector('input[name="lane-choice"]:checked');
    const isLaneSelected = defaultLaneInput && defaultLaneInput.value !== 'none';

    // Sincroniza el estado inicial del selector y la flecha
    updateChampionSectionState(isLaneSelected);

    // Limpia la selección de campeones si no hay línea seleccionada
    if (!isLaneSelected) {
        clearSelectedChampions();
    }
});

// Agregar el event listener para el botón de cambio de moneda
document.getElementById('currencyToggle').addEventListener('click', function() {
    currentCurrency = currentCurrency === 'CLP' ? 'USD' : 'CLP';
    this.textContent = currentCurrency === 'CLP' ? 'Cambiar a USD' : 'Cambiar a CLP';
    
    // Actualizar el precio con la nueva moneda
    const fromRank = getRankByValue(fromValue);
    const toRank = getRankByValue(toValue);
    if (fromRank && toRank && fromRank.name && toRank.name) {
        updatePrice(fromRank.name, toRank.name);
    }
});


// Constantes
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzk_d73SeB6nWEKF8xTqptWy1E7fQ9OwCSm-Zr1F0j96xVq3oinA6EqM02NCO5ZBHoCgw/exec';

async function cargarReseñas() {
    const reviewsContainer = document.querySelector('.reviews-container');
    const loadingMessage = document.getElementById('loadingMessage');

    // Mostrar el mensaje de carga
    loadingMessage.style.display = 'block';

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        
        if (data.reviews && data.reviews.length > 0) {
            reviewsContainer.innerHTML = data.reviews
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map(review => {
                    const estrellas = '★'.repeat(parseInt(review.puntuacion)) + '☆'.repeat(5 - parseInt(review.puntuacion));
                    return `
                        <div class="review-card">
                            <div class="review-header">
                                <h4 class="review-name">${review.nombre}</h4>
                                <div class="review-date">${new Date(review.fecha).toLocaleDateString()}</div>
                            </div>
                            <p class="review-comment">${review.comentario}</p>
                            <div class="review-stars">${estrellas}</div>
                        </div>
                    `;
                }).join('');
        } else {
            reviewsContainer.innerHTML = '<p class="no-reviews">¡Sé el primero en dejar una reseña!</p>';
        }
    } catch (error) {
        console.error('Error al cargar reseñas:', error);
        reviewsContainer.innerHTML = '<p class="error-message">Error al cargar las reseñas. Por favor, intenta más tarde.</p>';
    } finally {
        // Ocultar el mensaje de carga
        loadingMessage.style.display = 'none';
    }
}


// Manejar el envío del formulario
document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    
    const isAnonimo = document.getElementById('anonimo').checked;
    
    const formData = {
        nombre: isAnonimo ? 'Anónimo' : (document.getElementById('nombre').value || 'Anónimo'),
        puntuacion: document.querySelector('input[name="puntuacion"]:checked').value,
        comentario: document.getElementById('comentario').value
    };

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            Swal.fire({
                title: '¡Gracias por tu reseña!',
                text: 'Será publicada pronto.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                background: '#3a056a',
                color: '#fff',
            });
            e.target.reset();
            // Asegurarse de que el input de nombre se habilite después de resetear
            document.getElementById('nombre').disabled = false;
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al enviar la reseña. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                background: '#3a056a',
                color: '#fff',
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al enviar la reseña. Por favor, intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            background: '#3a056a',
            color: '#fff',
        });
    } finally {
        submitButton.disabled = false;
    }
});


// Cargar reseñas cuando la página se cargue
// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarReseñas();
});

// Recargar reseñas cada 5 minutos
setInterval(cargarReseñas, 300000);

document.getElementById('anonimo').addEventListener('change', function(e) {
    const nombreInput = document.getElementById('nombre');
    nombreInput.disabled = e.target.checked;
    if (e.target.checked) {
        nombreInput.value = '';
    }
});


updateUI();
initializeChampionSelector();
updateChampionWarning();

