const slider = document.querySelector('.slider');
const thumb = document.getElementById('thumb');
const sliderRange = document.querySelector('.slider-range');
const rankText = document.getElementById('rankText');
const rankImages = document.querySelectorAll('.rank-image');

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Lista de campeones
window.selectedChampions = new Set();

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

function initializeChampionSelector() {
    const searchInput = document.getElementById('championSearch');
    const dropdown = document.getElementById('championDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
    
    function formatChampionName(name) {
        return name
            .replace(/%27/g, "'")
            .replace(/_/g, " ")
            .replace(/\./g, "");
    }

    function showAllChampions() {
        dropdown.innerHTML = '';
        champions.forEach(champ => {
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
            option.addEventListener('click', () => addChampion(champ, formatChampionName(champ)));
            dropdown.appendChild(option);
        });
    }

    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = dropdown.classList.contains('active');
        
        if (isActive) {
            dropdown.classList.remove('active');
            arrow.classList.remove('active');
        } else {
            showAllChampions();
            dropdown.classList.add('active');
            arrow.classList.add('active');
        }
    });

    searchInput.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!dropdown.classList.contains('active')) {
            showAllChampions();
            dropdown.classList.add('active');
            arrow.classList.add('active');
        }
    });

    searchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const filtered = champions.filter(champ => 
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
            option.addEventListener('click', () => addChampion(champ, formatChampionName(champ)));
            dropdown.appendChild(option);
        });
        
        dropdown.classList.add('active');
        arrow.classList.add('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.champion-search')) {
            dropdown.classList.remove('active');
            arrow.classList.remove('active');
        }
    });
}

function handleImageError(img) {
    img.onerror = null;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCI+PzwvdGV4dD48L3N2Zz4=';
}

function addChampion(championId, displayName) {
    if (selectedChampions.has(championId)) return;
    
    selectedChampions.add(championId);
    const container = document.getElementById('selectedChampions');
    const poolContainer = document.getElementById('poolChampContainer');
    
    poolContainer.style.display = 'block';
    
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
        championElement.remove();
        if (selectedChampions.size === 0) {
            poolContainer.style.display = 'none';
        }
        updateChampionWarning();
        updateButtonState();
    });
    championElement.appendChild(removeButton);
    
    container.appendChild(championElement);
    document.getElementById('championSearch').value = '';
    document.getElementById('championDropdown').classList.remove('active');
    document.querySelector('.dropdown-arrow').classList.remove('active');
    
    updateChampionWarning();
    updateButtonState();
}

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
    { name: 'Challenger', rankType: 'challenger', minValue: 97 }
];

let isDragging = false;
let value = 50; // Start at Silver

function updateUI() {
    const rank = getRankByValue(value);
    
    const position = (value / 100) * slider.offsetWidth;
    
    thumb.style.left = `${position}px`;
    thumb.dataset.rank = rank.rankType;
    
    sliderRange.style.width = `${position}px`;
    
    updateRankImages(rank.rankType);
    rankText.innerHTML = formatRankName(rank.name);
}

function getRankByValue(value) {
    return ranks.reduce((prev, curr) => {
        return (value >= curr.minValue) ? curr : prev;
    });
}

function updateRankImages(rankType) {
    rankImages.forEach(img => {
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

function handleStart(e) {
    isDragging = true;
    e.preventDefault();
}

function handleMove(e) {
    if (!isDragging) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    value = getValueFromPosition(clientX);
    
    updateUI();
}

function handleEnd() {
    isDragging = false;
}

// Function to update price tag
function updatePriceTag() {
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    const selectedQueue = document.querySelector('input[name="queue-choice"]:checked').value;
    const lanePriceTag = document.getElementById('lane-price-tag');
    
    if (selectedLane === 'none') {
        return;
    }
    
    if (selectedLane === 'support') {
        lanePriceTag.textContent = selectedQueue === 'soloq' ? '+25%' : '+15%';
    } else {
        lanePriceTag.textContent = '+10%';
    }
}

// Add event listeners for both lane and queue selection changes
document.querySelectorAll('input[name="lane-choice"], input[name="queue-choice"]').forEach(radio => {
    radio.addEventListener('change', updatePriceTag);
});

thumb.addEventListener('mousedown', handleStart);
thumb.addEventListener('touchstart', handleStart);

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove, { passive: false });

document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);

slider.addEventListener('click', (e) => {
    value = getValueFromPosition(e.clientX);
    updateUI();
});

slider.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

const placementMatchesSlider = document.getElementById('placementMatchesSlider');
const placementMatchesValue = document.getElementById('placementMatchesValue');

placementMatchesSlider.addEventListener('input', function() {
    placementMatchesValue.textContent = this.value;
});

placementMatchesSlider.addEventListener('change', function() {
    this.value = Math.round(this.value);
    placementMatchesValue.textContent = this.value;
});

function formatRankName(name) {
    return name;
}

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

// Add functionality to the confirm button
const payButton = document.querySelector('.pay-button');
payButton.addEventListener('click', () => {
    // Verificar cantidad de campeones seleccionados
    if (selectedChampions.size > 0 && selectedChampions.size < 3) {
        // Deshabilitar el botón
        payButton.disabled = true;
        
        const warningElement = document.getElementById('championWarning');
        warningElement.textContent = 'Debes seleccionar al menos 3 campeones para continuar';
        warningElement.style.color = '#ff4444'; // Color rojo
        warningElement.style.display = 'block';
        warningElement.style.fontStyle = 'normal';
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            // Volver al mensaje amarillo si aún hay 1 o 2 campeones
            if (selectedChampions.size > 0 && selectedChampions.size < 3) {
                updateChampionWarning();
            } else {
                warningElement.style.display = 'none';
            }
            payButton.disabled = false; // Rehabilitar el botón
        }, 3000);
        
        return; // Detener la ejecución si no hay suficientes campeones
    }

    // Si llegamos aquí, o no hay campeones seleccionados o hay 3 o más
    const selectedRank = getRankByValue(value);
    const selectedQueue = document.querySelector('input[name="queue-choice"]:checked').value;
    const selectedFlash = document.querySelector('input[name="flash-choice"]:checked').value;
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    const placementMatches = placementMatchesSlider.value;
    const queueText = selectedQueue === 'soloq' ? 'SoloQ' : 'FlexQ';

    // Calculate extras
    let extras = [];
    if (selectedLane !== 'none') {
        let extraPercentage = '10';
        if (selectedLane === 'support') {
            extraPercentage = selectedQueue === 'soloq' ? '25' : '15';
        }
        extras.push(`Línea personalizada (+${extraPercentage}%)`);
    }
    const extrasText = extras.length > 0 ? `Extras:%0A- ${extras.join('%0A- ')}` : 'Sin extras seleccionados';

    // Preparar texto de campeones seleccionados
    let championsList = '';
    if (selectedChampions.size > 0) {
        championsList = `Campeones Seleccionados:%0A- ${Array.from(selectedChampions).join('%0A- ')}%0A%0A`;
    }
    
    // Create the WhatsApp message
    const mensaje = `¡Hola! Me gustaría solicitar un Boost de Colocación:%0A%0A` +
    `Rango Anterior: ${selectedRank.name}%0A` +
    `Cola de Emparejamiento: ${queueText}%0A` +
    `Número de placement: ${placementMatches}%0A` +
    `Línea Preferida: ${formatLaneName(selectedLane)}%0A` +
    `Flash: ${formatFlashOption(selectedFlash)}%0A` +
    `${championsList}` +
    `${extrasText}%0A%0A` +
    `Por favor, ¿podrían indicarme el precio?`;

    // WhatsApp number
    const numeroWhatsApp = '+56991991705';
    
    // Create and open WhatsApp link
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
});

function updateChampionWarning() {
    const warningElement = document.getElementById('championWarning');
    const count = selectedChampions.size;
    
    if (count > 0 && count < 3) {
        const remaining = 3 - count;
        warningElement.textContent = `Selecciona ${remaining} campeón${remaining !== 1 ? 'es' : ''} más como mínimo`;
        warningElement.style.color = '#FFD700'; // Color amarillo
        warningElement.style.display = 'block';
        warningElement.style.fontStyle = 'italic';
    } else {
        warningElement.style.display = 'none';
    }
}

function updateButtonState() {
    const payButton = document.querySelector('.pay-button');
    const warningElement = document.getElementById('minChampionsWarning');
    
    // Solo actualizar el mensaje de advertencia
    if (selectedChampions.size > 0 && selectedChampions.size < 3) {
        warningElement.style.display = 'block';
    } else {
        warningElement.style.display = 'none';
        payButton.disabled = false; // Asegurarse de que el botón esté habilitado
    }
}

updateUI();
initializeChampionSelector();