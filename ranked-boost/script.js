import { calculatePrice, setDebugMode, convertCLPtoUSD } from './price-calculator.js';

// Lista de campeones de League of Legends
const champions = [
    'Aatrox', 'Ahri', 'Akali', 'Akshan', 'Alistar', 'Ambessa', 'Amumu', 'Anivia', 'Annie', 'Aphelios', 'Ashe', 'Aurelion_Sol', 'Aurora',
    'Azir', 'Bard', 'Bel%27Veth', 'Blitzcrank', 'Brand', 'Braum', 'Briar', 'Caitlyn', 'Camille', 'Cassiopeia', 'Cho%27Gath', 
    'Corki', 'Darius', 'Diana', 'Draven', 'Dr._Mundo', 'Ekko', 'Elise', 'Evelynn', 'Ezreal', 'Fiddlesticks', 'Fiora', 
    'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Gwen', 'Hecarim', 'Heimerdinger', 'Hwei', 'Illaoi', 
    'Irelia', 'Ivern', 'Janna', 'Jarvan_IV', 'Jax', 'Jayce', 'Jhin', 'Jinx', 'K%27Sante', 'Kai%27Sa', 'Kalista', 'Karma', 
    'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kayn', 'Kennen', 'Kha%27Zix', 'Kindred', 'Kled', 'Kog%27Maw', 'LeBlanc', 
    'Lee_Sin', 'Leona', 'Lillia', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'Master_Yi', 
    'Milio', 'Miss_Fortune', 'Mordekaiser', 'Morgana', 'Naafiri', 'Nami', 'Nasus', 'Nautilus', 'Neeko', 'Nidalee', 
    'Nilah', 'Nocturne', 'Nunu', 'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy', 'Pyke', 'Qiyana', 'Quinn', 'Rakan', 
    'Rammus', 'Rek%27Sai', 'Rell', 'Renata_Glasc', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze', 'Samira', 'Sejuani', 
    'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Sona', 'Soraka', 
    'Swain', 'Sylas', 'Syndra', 'Tahm_Kench', 'Taliyah', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana', 'Trundle', 
    'Tryndamere', 'Twisted_Fate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar', 'Vel%27Koz', 'Vex', 'Vi', 'Viego', 
    'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xayah', 'Xerath', 'Xin_Zhao', 'Yasuo', 'Yone', 'Yorick', 
    'Yuumi', 'Zac', 'Zed', 'Zeri', 'Ziggs', 'Zilean', 'Zoe', 'Zyra'
];

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
        ? "Seleccionar campeón..."
        : "Selecciona una línea primero";

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
        
        updateLanePriceTag();
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
        img.src = `https://wiki.leagueoflegends.com/en-us/images/${champ}_OriginalSquare.png?62007`;
        img.alt = formatChampionName(champ);
        img.onerror = () => handleImageError(img);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = formatChampionName(champ);
        
        option.appendChild(img);
        option.appendChild(nameSpan);
        
        option.addEventListener('click', () => {
            addChampion(champ, formatChampionName(champ));
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
            img.src = `https://wiki.leagueoflegends.com/en-us/images/${champ}_OriginalSquare.png?62007`;
            img.alt = formatChampionName(champ);
            img.onerror = () => handleImageError(img);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = formatChampionName(champ);

            option.appendChild(img);
            option.appendChild(nameSpan);

            option.addEventListener('click', () => {
                addChampion(champ, formatChampionName(champ));
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
            formatChampionName(champ).toLowerCase().includes(searchValue)
        );

        dropdown.innerHTML = '';
        filtered.forEach(champ => {
            const option = document.createElement('div');
            option.className = 'champion-option';

            const img = document.createElement('img');
            img.src = `https://wiki.leagueoflegends.com/en-us/images/${champ}_OriginalSquare.png?62007`;
            img.alt = formatChampionName(champ);
            img.onerror = () => handleImageError(img);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = formatChampionName(champ);

            option.appendChild(img);
            option.appendChild(nameSpan);

            option.addEventListener('click', () => {
                addChampion(champ, formatChampionName(champ));
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
    img.src = `https://wiki.leagueoflegends.com/en-us/images/${championId}_OriginalSquare.png?62007`;
    img.alt = displayName;
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
    
    if (count > 0 && count < 5) { // Cambiado de 3 a 5
        warningElement.textContent = `Selecciona ${5 - count} campeón${5 - count !== 1 ? 'es' : ''} más como mínimo`;
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
    // Hierro
    { name: 'Hierro IV', rankType: 'iron', minValue: 0 },
    { name: 'Hierro III', rankType: 'iron', minValue: 3.25 },
    { name: 'Hierro II', rankType: 'iron', minValue: 6.5 },
    { name: 'Hierro I', rankType: 'iron', minValue: 9.75 },

    // Bronce
    { name: 'Bronce IV', rankType: 'bronze', minValue: 13 },
    { name: 'Bronce III', rankType: 'bronze', minValue: 16.25 },
    { name: 'Bronce II', rankType: 'bronze', minValue: 19.5 },
    { name: 'Bronce I', rankType: 'bronze', minValue: 22.75 },

    // Plata
    { name: 'Plata IV', rankType: 'silver', minValue: 26 },
    { name: 'Plata III', rankType: 'silver', minValue: 29.25 },
    { name: 'Plata II', rankType: 'silver', minValue: 32.5 },
    { name: 'Plata I', rankType: 'silver', minValue: 35.75 },

    // Oro
    { name: 'Oro IV', rankType: 'gold', minValue: 39 },
    { name: 'Oro III', rankType: 'gold', minValue: 42.25 },
    { name: 'Oro II', rankType: 'gold', minValue: 45.5 },
    { name: 'Oro I', rankType: 'gold', minValue: 48.75 },

    // Platino
    { name: 'Platino IV', rankType: 'platinum', minValue: 52 },
    { name: 'Platino III', rankType: 'platinum', minValue: 55.25 },
    { name: 'Platino II', rankType: 'platinum', minValue: 58.5 },
    { name: 'Platino I', rankType: 'platinum', minValue: 61.75 },

    // Esmeralda
    { name: 'Esmeralda IV', rankType: 'emerald', minValue: 65 },
    { name: 'Esmeralda III', rankType: 'emerald', minValue: 68.25 },
    { name: 'Esmeralda II', rankType: 'emerald', minValue: 71.5 },
    { name: 'Esmeralda I', rankType: 'emerald', minValue: 74.75 },

    // Diamante
    { name: 'Diamante IV', rankType: 'diamond', minValue: 78 },
    { name: 'Diamante III', rankType: 'diamond', minValue: 81.25 },
    { name: 'Diamante II', rankType: 'diamond', minValue: 84.5 },
    { name: 'Diamante I', rankType: 'diamond', minValue: 87.75 },

    // Master, Grandmaster y Challenger
    { name: 'Master', rankType: 'master', minValue: 91 },
    { name: 'Grandmaster', rankType: 'grandmaster', minValue: 94 },
    { name: 'Challenger', rankType: 'challenger', minValue: 97, maxValue: 100 } 
];

let isDragging = false;
let currentThumb = null;
let fromValue = 26;
let toValue = 78;

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

    // Manejar el caso de Master o Grandmaster
    const isHighElo = fromRank.rankType === 'master' || fromRank.rankType === 'grandmaster';
    const lpInputs = document.querySelectorAll('input[name="lp-range"]');
    const highEloMessage = document.getElementById('highelo-message');
    const priceDisclaimer = document.getElementById('price-disclaimer');
    const priceApprox = document.getElementById('price-approx');

    if (isHighElo) {
        // Mostrar mensaje, disclaimer y APROX
        highEloMessage.style.display = 'block';
        priceDisclaimer.style.display = 'block';
        priceApprox.style.display = 'inline';  // o 'block' dependiendo del layout
        
        // Seleccionar y bloquear solo las opciones de LP
        lpInputs.forEach(input => {
            const option = input.closest('.range-option');
            if (input.value === '0-29') {
                input.checked = true;
            }
            input.disabled = true;
            option.classList.add('disabled');
        });
    } else {
        // Ocultar mensaje, disclaimer y APROX
        highEloMessage.style.display = 'none';
        priceDisclaimer.style.display = 'none';
        priceApprox.style.display = 'none';
        
        // Habilitar opciones de LP
        lpInputs.forEach(input => {
            const option = input.closest('.range-option');
            input.disabled = false;
            option.classList.remove('disabled');
        });
    }

    if (fromRank && toRank && fromRank.name && toRank.name) {
        updatePrice(fromRank.name, toRank.name);
    }
}

let currentCurrency = 'CLP'; // Variable global para tracking de la moneda actual

function updatePrice(fromRankName, toRankName) {
    debugLog('UpdatePrice llamado con:', { fromRankName, toRankName });
    
    const selectedLPRange = document.querySelector('input[name="lp-range"]:checked').value;
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    const selectedLPGain = document.querySelector('input[name="lp-gain"]:checked').value;
    
    try {
        const priceInCLP = calculatePrice(fromRankName, toRankName, selectedLPRange, selectedLane, selectedLPGain);
        debugLog('Precio calculado en CLP:', priceInCLP);
        
        const priceElement = document.getElementById('totalPrice');
        if (currentCurrency === 'CLP') {
            priceElement.textContent = priceInCLP.toLocaleString('es-CL') + ' CLP';
        } else {
            const priceInUSD = convertCLPtoUSD(priceInCLP);
            // Cambiamos esta línea para mostrar USD después del número
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
    // Si el valor está cerca de Challenger (97 o más), siempre ir al final
    if (value >= 97) {
        return 100;
    }

    // Para valores que podrían estar cerca de Challenger pero no lo suficiente,
    // forzar a que vaya al valor anterior más cercano
    const challengerStartValue = 97;
    if (Math.abs(value - challengerStartValue) <= 1.5) {
        // Encontrar el valor anterior más cercano
        for (let i = ranks.length - 2; i >= 0; i--) {
            if (value > ranks[i].minValue) {
                return ranks[i].minValue;
            }
        }
    }
    
    // Para todos los demás casos, encuentra el valor más cercano normalmente
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

document.querySelectorAll('input[name="lp-range"], input[name="lane-choice"], input[name="lp-gain"], input[name="queue-choice"]').forEach(input => {
    input.addEventListener('change', () => {
        if (input.name === 'lane-choice' || input.name === 'queue-choice') {
            updateLanePriceTag();
        }
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
    const laneNames = {
        'top': 'Top',
        'jungle': 'Jungla',
        'mid': 'Mid',
        'adc': 'ADC',
        'support': 'Support'
    };
    return laneNames[lane] || lane;
}

function formatFlashOption(flash) {
    if (flash === 'none') return 'Sin preferencia';
    if (flash === 'flash-d') return 'Flash en D';
    if (flash === 'flash-f') return 'Flash en F';
    return flash;
}

function updateLanePriceTag() {
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    const queueType = document.querySelector('input[name="queue-choice"]:checked').value;
    const lanePriceTag = document.getElementById('lane-price-tag');
    
    if (lanePriceTag) {
        if (selectedLane === 'support') {
            lanePriceTag.textContent = queueType === 'soloq' ? '+25%' : '+15%';
        } else {
            lanePriceTag.textContent = '+10%';
        }
    }
}

const payButton = document.querySelector('.pay-button');
payButton.addEventListener('click', () => {
    if (selectedChampions.size > 0 && selectedChampions.size < 5) { // Cambiado de 3 a 5
        payButton.disabled = true;
        
        const warningElement = document.getElementById('championWarning');
        warningElement.textContent = 'Debes seleccionar al menos 5 campeones para continuar';
        warningElement.style.color = '#ff4444';
        warningElement.style.display = 'block';
        warningElement.style.fontStyle = 'normal';
        
        setTimeout(() => {
            if (selectedChampions.size > 0 && selectedChampions.size < 5) { // Cambiado de 3 a 5
                updateChampionWarning();
            } else {
                warningElement.style.display = 'none';
                payButton.disabled = false;
            }
        }, 3000);
        
        return;
    }

    // Si llegamos aquí, o no hay campeones seleccionados o hay 3 o más
    const fromRank = getRankByValue(fromValue);
    const toRank = getRankByValue(toValue);
    const selectedLPRange = document.querySelector('input[name="lp-range"]:checked').value;
    const selectedLPGain = document.querySelector('input[name="lp-gain"]:checked').value;
    const selectedFlash = document.querySelector('input[name="flash-choice"]:checked').value;
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    const selectedQueue = document.querySelector('input[name="queue-choice"]:checked').value;
    const queueText = selectedQueue === 'soloq' ? 'SoloQ' : 'FlexQ';

    let extras = [];
    if (selectedLane !== 'none') {
        let extraPercent;
        if (selectedLane === 'support') {
            extraPercent = selectedQueue === 'soloq' ? '25%' : '15%';
        } else {
            extraPercent = '10%';
        }
        extras.push(`Línea personalizada (+${extraPercent})`);
    }
    const extrasText = extras.length > 0 ? `Extras:%0A- ${extras.join('%0A- ')}` : 'Sin extras seleccionados';
    
    let championsList = '';
    if (selectedChampions.size > 0) {
        championsList = `Campeones Seleccionados:%0A- ${Array.from(selectedChampions).join('%0A- ')}%0A%0A`;
        if (!extras.includes('Campeones específicos (+30%)')) {
            extras.push('Campeones específicos (+30%)');
        }
    }

    const precioTexto = document.getElementById('totalPrice').textContent;
    const mensaje = `¡Hola! Me gustaría solicitar un Boost:%0A%0A` +
    `Rango Actual: ${fromRank.name}%0A` +
    `Rango Objetivo: ${toRank.name}%0A` +
    `Cola de Emparejamiento: ${queueText}%0A` +
    `LP Actuales: ${selectedLPRange}%0A` +
    `LP por Victoria: ${selectedLPGain}%0A` +
    `Línea Preferida: ${formatLaneName(selectedLane)}%0A` +
    `Flash: ${formatFlashOption(selectedFlash)}%0A` +
    `${championsList}` +
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
    
    const formData = {
        nombre: document.getElementById('nombre').value,
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
                background: '#3a056a', // Fondo morado
                color: '#fff', // Color del texto en blanco para contraste
            });
            e.target.reset();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al enviar la reseña. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                background: '#3a056a', // Fondo morado
                color: '#fff', // Color del texto en blanco
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al enviar la reseña. Por favor, intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            background: '#3a056a', // Fondo morado
            color: '#fff', // Color del texto en blanco
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


updateLanePriceTag();
updateUI();
initializeChampionSelector();
updateChampionWarning();
