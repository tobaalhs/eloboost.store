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
    { name: 'Inmortal 1', rankType: 'immortal_1', minValue: 94, maxValue: 100 }
];

let slider, thumb, sliderRange, rankText;
let value = 50; // Start at Silver 1

function getRankByValue(percentage) {
    // Encuentra el rango adecuado basado en el porcentaje
    let currentRank = ranks[0]; // Por defecto el primer rango

    for (let rank of ranks) {
        if (percentage >= rank.minValue) {
            currentRank = rank;
        } else {
            break;
        }
    }
    return currentRank;
}

let payButton;

window.selectedChampions = new Set();
window.availableChampions = new Set(champions);

function clearSelectedChampions() {
    selectedChampions.clear();
    window.availableChampions = new Set(champions);
    const container = document.getElementById('selectedChampions');
    container.innerHTML = '';
    updateChampionWarning();
    updatePoolChampVisibility();
    // updatePrice(getRankByValue(value).name);
}

function updateChampionSectionState(isEnabled) {
    const championSearch = document.getElementById('championSearch');
    const championDropdown = document.getElementById('championDropdown');
    const dropdownArrow = document.querySelector('.dropdown-arrow');

    championSearch.disabled = !isEnabled;
    championSearch.style.opacity = isEnabled ? '1' : '0.5';
    championSearch.style.cursor = isEnabled ? 'text' : 'not-allowed';
    championSearch.placeholder = isEnabled
        ? "Seleccionar agente..."
        : "Selecciona un rol primero";

    dropdownArrow.style.opacity = !isEnabled ? '0.5' : '1';
    dropdownArrow.style.cursor = isEnabled ? 'pointer' : 'not-allowed';

    dropdownArrow.removeEventListener('click', handleArrowClick);
    // Aquí invertimos la condición
    if (!isEnabled) {
        dropdownArrow.addEventListener('click', handleArrowClick);
    } else {
        championDropdown.classList.remove('active');
        dropdownArrow.classList.remove('active');
    }
}

function handleArrowClick(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('championDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
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

function updateUI() {
    if (!slider || !thumb || !sliderRange || !rankText) return;

    const rank = getRankByValue(value);
    
    // Usar el valor directamente como porcentaje
    thumb.style.left = `${value}%`;
    thumb.dataset.rank = rank.rankType;
    sliderRange.style.width = `${value}%`;
    
    updateRankImages(rank.rankType);
    rankText.innerHTML = formatRankName(rank.name);
}

function updatePoolChampVisibility() {
    const container = document.getElementById('poolChampContainer');
    const hasChampions = selectedChampions.size > 0;
    container.style.display = hasChampions ? 'block' : 'none';
}

function updateButtonState() {
    const payButton = document.querySelector('.pay-button');
    const warningElement = document.getElementById('minChampionsWarning');
    
    if (selectedChampions.size > 0 && selectedChampions.size < 3) {
        warningElement.style.display = 'block';
    } else {
        warningElement.style.display = 'none';
        payButton.disabled = false;
    }
}

function formatRankName(name) {
    const parts = name.split(' ');
    if (parts.length > 2) {
        return `${parts[0]} ${parts[1]}<br>${parts.slice(2).join(' ')}`;
    } else if (parts.length > 1) {
        return `${parts[0]}<br>${parts.slice(1).join(' ')}`;
    }
    return name;
}

function addChampion(championId, displayName) {
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    if (selectedLane === 'none') return;

    if (selectedChampions.has(championId)) return;
    
    selectedChampions.add(championId);
    window.availableChampions.delete(championId);
    showAllChampions();

    if (selectedChampions.size >= 3) {
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
        
        const dropdown = document.getElementById('championDropdown');
        dropdown.classList.add('active');
        showAllChampions();
        
        if (selectedChampions.size === 0 || selectedChampions.size >= 3) {
            document.getElementById('minChampionsWarning').style.display = 'none';
        }
        
        // updatePrice(getRankByValue(value).name);
    });
    championElement.appendChild(removeButton);
    
    container.appendChild(championElement);
    document.getElementById('championSearch').value = '';
    document.getElementById('championDropdown').classList.remove('active');
    document.querySelector('.dropdown-arrow').classList.remove('active');
    
    updateChampionWarning();
    updatePoolChampVisibility();
    updateButtonState();
    // updatePrice(getRankByValue(value).name);
}

function updateChampionWarning() {
    const warningElement = document.getElementById('championWarning');
    if (!warningElement) return;

    if (selectedChampions.size === 0) {
        warningElement.style.display = 'none';
    } else if (selectedChampions.size < 3) {
        warningElement.textContent = `Selecciona ${3 - selectedChampions.size} agente${selectedChampions.size === 2 ? '' : 's'} más`;
        warningElement.style.display = 'block';
        warningElement.style.color = '#ff9900';
        warningElement.style.fontStyle = 'italic';
    } else {
        warningElement.style.display = 'none';
    }

    updateButtonState();
}

// Removed updatePrice function

document.querySelectorAll('input[name="lane-choice"]').forEach(input => {
    input.addEventListener('change', () => {
        const isLaneSelected = input.value !== 'none';
        
        updateChampionSectionState(isLaneSelected);
        
        if (!isLaneSelected) {
            clearSelectedChampions();
        }
        
        // updatePrice(getRankByValue(value).name);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    payButton = document.querySelector('.pay-button');
    if (payButton) {
        payButton.addEventListener('click', handlePayButtonClick);
    }
});

function handlePayButtonClick() {
    if (selectedChampions.size > 0 && selectedChampions.size < 3) {
        payButton.disabled = true;
        
        const warningElement = document.getElementById('championWarning');
        warningElement.textContent = 'Debes seleccionar al menos 3 agentes para continuar';
        warningElement.style.color = '#ff4444';
        warningElement.style.display = 'block';
        warningElement.style.fontStyle = 'normal';
        
        setTimeout(() => {
            if (selectedChampions.size > 0 && selectedChampions.size < 3) {
                updateChampionWarning();
            } else {
                warningElement.style.display = 'none';
                payButton.disabled = false;
            }
        }, 3000);
        
        return;
    }

    const rank = getRankByValue(value);
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;

    let extras = [];
    if (selectedLane !== 'none') {
        extras.push(`Rol personalizado`);
    }
    const extrasText = extras.length > 0 ? `Extras:%0A- ${extras.join('%0A- ')}` : 'Sin extras seleccionados';

    let agentsList = '';
    if (selectedChampions.size > 0) {
        agentsList = `Agentes Seleccionados:%0A- ${Array.from(selectedChampions).join('%0A- ')}%0A%0A`;
        if (!extras.includes('Agentes específicos')) {
            extras.push('Agentes específicos');
        }
    }

    const mensaje = `¡Hola! Me gustaría solicitar un Placement Boost:%0A%0A` +
    `Rango Pasado: ${rank.name}%0A` +
    `Rol Preferido: ${formatLaneName(selectedLane)}%0A` +
    `${agentsList}` +
    `${extrasText}%0A%0A` +
    `Por favor, ¿podrías indicarme el precio?`;

    const numeroWhatsApp = '+56929169240';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
}

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

function initializeSlider() {
    slider = document.querySelector('.slider');
    thumb = document.getElementById('thumb');
    sliderRange = document.querySelector('.slider-range');
    rankText = document.getElementById('rankText');

    if (!slider || !thumb || !sliderRange || !rankText) {
        console.error('One or more slider elements not found');
        return;
    }

    // Establecer valor inicial en 0%
    value = 55;
    updateUI();

    slider.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    slider.addEventListener('touchstart', startDragging, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDragging);
}

let isDragging = false;

function startDragging(e) {
    isDragging = true;
    drag(e);
}

function stopDragging() {
    isDragging = false;
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const rect = slider.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!clientX) return;
    
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    // Calcular directamente el porcentaje (0-100)
    let percentage = (x / rect.width) * 100;
    
    // Limitar a 100%
    percentage = Math.min(percentage, 100);
    
    // Asignar el porcentaje directamente a value
    value = percentage;
    
    updateUI();
}

function updateRankImages(rankType) {
    // Hide all rank images first
    document.querySelectorAll('.rank-image').forEach(img => {
        img.classList.remove('active');
    });

    // Get the current rank and determine the image to show
    const currentRank = getRankByValue(value);
    const rankName = currentRank.name.toLowerCase();
    
    // Create the correct rank identifier based on the rank name
    let rankIdentifier;
    if (rankName.includes('hierro')) {
        rankIdentifier = `iron_${rankName.slice(-1)}`;
    } else if (rankName.includes('bronce')) {
        rankIdentifier = `bronze_${rankName.slice(-1)}`;
    } else if (rankName.includes('plata')) {
        rankIdentifier = `silver_${rankName.slice(-1)}`;
    } else if (rankName.includes('oro')) {
        rankIdentifier = `gold_${rankName.slice(-1)}`;
    } else if (rankName.includes('platino')) {
        rankIdentifier = `platinum_${rankName.slice(-1)}`;
    } else if (rankName.includes('diamante')) {
        rankIdentifier = `diamond_${rankName.slice(-1)}`;
    } else if (rankName.includes('ascendente')) {
        rankIdentifier = `ascendant_${rankName.slice(-1)}`;
    } else if (rankName.includes('inmortal')) {
        rankIdentifier = `immortal_1`;
    }
    
    // Show the current rank image
    const currentRankImage = document.querySelector(`.rank-image[data-rank="${rankIdentifier}"]`);
    if (currentRankImage) {
        currentRankImage.classList.add('active');
    }
}

function initializeChampionSelector() {
    const searchInput = document.getElementById('championSearch');
    const dropdown = document.getElementById('championDropdown');
    const arrow = document.querySelector('.dropdown-arrow');

    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
        showAllChampions();
        dropdown.classList.add('active');
        arrow.classList.add('active');
    });

    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    searchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const filtered = Array.from(window.availableChampions).filter(champ => 
            champ.toLowerCase().includes(searchValue)
        );

        showFilteredChampions(filtered);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.champion-search')) {
            dropdown.classList.remove('active');
            arrow.classList.remove('active');
        }
    });
}

function toggleDropdown() {
    const dropdown = document.getElementById('championDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
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

function showFilteredChampions(champions) {
    const dropdown = document.getElementById('championDropdown');
    dropdown.innerHTML = '';
    
    champions.forEach(champ => {
        const option = createChampionOption(champ);
        dropdown.appendChild(option);
    });

    dropdown.classList.add('active');
    document.querySelector('.dropdown-arrow').classList.add('active');
}

function createChampionOption(champ) {
    const option = document.createElement('div');
    option.className = 'champion-option';
    
    const img = document.createElement('img');
    img.src = agentIcons[champ];
    img.alt = champ;
    img.className = 'agent-icon';
    img.onerror = () => handleImageError(img);
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = champ;
    
    option.appendChild(img);
    option.appendChild(nameSpan);
    
    option.addEventListener('click', () => {
        addChampion(champ, champ);
    });

    return option;
}

function init() {
    initializeSlider();
    initializeChampionSelector();
    updateChampionWarning();
    updateChampionSectionState(false);
    
    payButton = document.querySelector('.pay-button');
    if (payButton) {
        payButton.addEventListener('click', handlePayButtonClick);
    }

    // Initial UI update
    updateUI();
}


document.addEventListener('DOMContentLoaded', init);

function handleImageError(img) {
    img.onerror = null; // Prevent infinite loop
    img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgaG9zdD0iNDAiIHdpZHRoPSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCI+PzwvdGV4dD48L3N2Zz4=';
}

function showAllChampions() {
    const dropdown = document.getElementById('championDropdown');
    dropdown.innerHTML = '';
    
    Array.from(window.availableChampions).sort().forEach(champ => {
        const option = document.createElement('div');
        option.className = 'champion-option';
        
        const img = document.createElement('img');
        img.src = agentIcons[champ];
        img.alt = champ;
        img.className = 'agent-icon';
        img.onerror = () => handleImageError(img);
        
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

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownTriggers = document.querySelectorAll('.dropdown-navbar-trigger');
    
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Manejo mejorado de dropdowns en móvil
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = trigger.parentElement;
                
                // Cerrar otros dropdowns abiertos
                dropdownTriggers.forEach(otherTrigger => {
                    const otherDropdown = otherTrigger.parentElement;
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle del dropdown actual
                dropdown.classList.toggle('active');
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            
            // Cerrar todos los dropdowns
            dropdownTriggers.forEach(trigger => {
                trigger.parentElement.classList.remove('active');
            });
        }
    });
});