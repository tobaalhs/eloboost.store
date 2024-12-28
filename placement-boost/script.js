const slider = document.querySelector('.slider');
const thumb = document.getElementById('thumb');
const sliderRange = document.querySelector('.slider-range');
const rankText = document.getElementById('rankText');
const rankImages = document.querySelectorAll('.rank-image');

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

// Add functionality to the confirm button
const payButton = document.querySelector('.pay-button');
payButton.addEventListener('click', () => {
    const selectedRank = getRankByValue(value);
    const selectedQueue = document.querySelector('input[name="queue-choice"]:checked').value;
    const selectedFlash = document.querySelector('input[name="flash-choice"]:checked').value;
    const selectedLane = document.querySelector('input[name="lane-choice"]:checked').value;
    const placementMatches = placementMatchesSlider.value;
    const queueText = selectedQueue === 'soloq' ? 'SoloQ' : 'FlexQ';

    // Calculate extras and their costs
    let extras = [];
    if (selectedLane !== 'none') extras.push('Línea personalizada (+10%)');
    const extrasText = extras.length > 0 ? `Extras:%0A- ${extras.join('%0A- ')}` : 'Sin extras seleccionados';
    
    // Create the WhatsApp message
    const mensaje = `¡Hola! Me gustaría solicitar un Boost de Colocación:%0A%0A` +
    `Rango Anterior: ${selectedRank.name}%0A` +
    `Cola de Emparejamiento: ${queueText}%0A` +
    `Número de placement: ${placementMatches}%0A` +
    `Línea Preferida: ${formatLaneName(selectedLane)}%0A` +
    `Flash: ${formatFlashOption(selectedFlash)}%0A%0A` +
    `${extrasText}%0A%0A` +
    `Por favor, ¿podrían indicarme el precio?`;

    // WhatsApp number to send the message
    const numeroWhatsApp = '+56991991705';
    
    // Create the WhatsApp link and open it in a new tab
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
});

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

updateUI();
