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

// Redefined ranks without prices
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
}

function getRankByValue(value) {
    return ranks.reduce((prev, curr) => {
        return (value >= curr.minValue) ? curr : prev;
    });
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

function handleStart(e) {
    isDragging = true;
    currentThumb = e.target.id === 'thumbFrom' ? 'from' : 'to';
    e.preventDefault();
}

function handleMove(e) {
    if (!isDragging) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const value = getValueFromPosition(clientX);
    const divisionDistance = 3;

    if (currentThumb === 'from') {
        if (value <= (toValue - divisionDistance)) {
            fromValue = value;
        }
    } else if (currentThumb === 'to') {
        if (value >= (fromValue + divisionDistance)) {
            toValue = value;
        }
    }
    
    updateUI();
}

function handleEnd() {
    isDragging = false;
    currentThumb = null;
}

thumbFrom.addEventListener('mousedown', handleStart);
thumbFrom.addEventListener('touchstart', handleStart);

thumbTo.addEventListener('mousedown', handleStart);
thumbTo.addEventListener('touchstart', handleStart);

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove, { passive: false });

document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);

slider.addEventListener('click', (e) => {
    const value = getValueFromPosition(e.clientX);
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
    
    updateUI();
});

// Prevent default touch behavior to avoid scrolling while using the slider
slider.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });


// Función para formatear el nombre de la línea
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

// Función para formatear el nombre del flash
function formatFlashOption(flash) {
    if (flash === 'none') return 'Sin preferencia';
    if (flash === 'flash-d') return 'Flash en D';
    if (flash === 'flash-f') return 'Flash en F';
    return flash;
}

// Agregar funcionalidad al botón de confirmar
const payButton = document.querySelector('.pay-button');
payButton.addEventListener('click', () => {
    const selectedRankFrom = getRankByValue(fromValue);
    const selectedRankTo = getRankByValue(toValue);
    const selectedLPRange = document.querySelector('input[name="lp-range"]:checked').value;
    const selectedLPGain = document.querySelector('input[name="lp-gain"]:checked').value;
    const selectedFlash = document.querySelector('input[name="flash-choice"]:checked').value;
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    const selectedQueue = document.querySelector('input[name="queue-choice"]:checked').value;
    const queueText = selectedQueue === 'soloq' ? 'SoloQ' : 'FlexQ';

    // Calcular extras y sus costos
    let extras = [];
    if (selectedLane !== 'none') extras.push('Línea personalizada (+10%)');
    const extrasText = extras.length > 0 ? `Extras:%0A- ${extras.join('%0A- ')}` : 'Sin extras seleccionados';
    
    // Crear el mensaje para WhatsApp
    const mensaje = `¡Hola! Me gustaría solicitar un Boost:%0A%0A` +
    `Rango Actual: ${selectedRankFrom.name}%0A` +
    `Rango Objetivo: ${selectedRankTo.name}%0A` +
    `Cola de Emparejamiento: ${queueText}%0A` +
    `LP Actuales: ${selectedLPRange}%0A` +
    `LP por Victoria: ${selectedLPGain}%0A` +
    `Línea Preferida: ${formatLaneName(selectedLane)}%0A` +
    `Flash: ${formatFlashOption(selectedFlash)}%0A%0A` +
    `${extrasText}%0A%0A` +
    `Por favor, ¿podrían indicarme el precio?`;

    // Número de WhatsApp al que se enviará el mensaje
    const numeroWhatsApp = '991991705';
    
    // Crear el enlace de WhatsApp y abrirlo en una nueva pestaña
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
});

updateUI();

function formatRankName(name) {
    const parts = name.split(' ');
    if (parts.length > 2) {
        return `${parts[0]} ${parts[1]}<br>${parts.slice(2).join(' ')}`;
    } else if (parts.length > 1) {
        return `${parts[0]}<br>${parts.slice(1).join(' ')}`;
    }
    return name;
}

