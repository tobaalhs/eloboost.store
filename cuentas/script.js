const accounts = [
    /*
    {
        id: "ACC001", // ID único para cada cuenta
        images: [
            '/img/accounts/account1.png',
            '/img/accounts/account1-2.png',
            '/img/accounts/account1-3.png'
        ],
        rank: 'Diamante II',
        level: 89,
        champions: 95,
        skins: 45,
        blueEssence: '150,000',
        price: '45,000 CLP',
        region: 'LAS',
        additionalInfo: 'Email full acces'
    },*/
    // Más cuentas...
];

// Modifica la función showAccountDetails
function showAccountDetails(account) {
    const modal = document.getElementById('accountModal');
    const details = document.getElementById('accountDetails');

    document.body.classList.add('modal-open');
    
    details.innerHTML = `
        <h2 style="color: #FFD700; margin-bottom: 30px; font-size: 2.5em; text-align: center;">
            Detalles de la Cuenta
        </h2>
        <div class="modal-details">
            <div class="carousel-container">
                <div class="carousel-slide">
                    ${account.images.map(img => `
                        <img src="${img}" alt="Cuenta ${account.rank}">
                    `).join('')}
                </div>
                <button class="carousel-button prev">❮</button>
                <button class="carousel-button next">❯</button>
                <div class="carousel-buttons">
                    ${account.images.map((_, i) => `
                        <div class="carousel-dot${i === 0 ? ' active' : ''}"></div>
                    `).join('')}
                </div>
            </div>
            <div class="account-details-info" style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px;">
                <h3 style="color: #FFD700; font-size: 2em; margin-bottom: 20px;">
                    Rango: ${account.rank}
                </h3>
                <div style="font-size: 1.2em; line-height: 1.8; color: white;">
                    <p>ID: ${account.id}</p>
                    <p>Nivel: ${account.level}</p>
                    <p>Campeones Disponibles: ${account.champions}</p>
                    <p>Skins Totales: ${account.skins}</p>
                    <p>Esencia Azul: ${account.blueEssence}</p>
                    <p>Región: ${account.region}</p>
                    <p>Información Adicional: ${account.additionalInfo}</p>
                </div>
                <div style="margin-top: 30px; text-align: center;">
                    <h3 style="color: #FFD700; font-size: 1.8em; margin-bottom: 20px;">Precio: ${account.price}</h3>
                    <a href="https://wa.me/56991991705?text=Hola,%20me%20interesa%20la%20cuenta%20con%20ID:%20${account.id}%20(${account.rank}%20de%20nivel%20${account.level})" 
                       class="pay-button" 
                       target="_blank" 
                       style="text-decoration: none; display: inline-block;">
                        Comprar
                    </a>
                </div>
            </div>
        </div>
    `;
    
    initCarousel(account.images);
    modal.style.display = 'block';
}

// Función para inicializar el carrusel
function initCarousel(images) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide img');
    const dots = document.querySelectorAll('.carousel-dot');
    
    function showSlide(n) {
        slides.forEach(slide => slide.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[n].style.display = 'block';
        dots[n].classList.add('active');
        currentSlide = n;
    }
    
    // Mostrar primera imagen
    showSlide(0);
    
    // Event listeners para los botones
    document.querySelector('.carousel-button.prev').onclick = () => {
        showSlide((currentSlide - 1 + images.length) % images.length);
    };
    
    document.querySelector('.carousel-button.next').onclick = () => {
        showSlide((currentSlide + 1) % images.length);
    };
    
    // Event listeners para los dots
    dots.forEach((dot, i) => {
        dot.onclick = () => showSlide(i);
    });
}

// Función para crear las tarjetas de cuentas
function createAccountCards() {
    const container = document.getElementById('accountsContainer');
    
    if (accounts.length === 0) {
        container.innerHTML = `
            <div class="no-accounts-message">
                <h3>No hay cuentas disponibles en este momento</h3>
                <p>¡Pronto agregaremos nuevo stock! Te invitamos a volver más tarde.</p>
            </div>
        `;
        return;
    }
    
    accounts.forEach(account => {
        const card = document.createElement('div');
        card.className = 'account-card';
        card.innerHTML = `
            <img src="${account.images[0]}" alt="Cuenta ${account.rank}" class="account-image">
            <div class="account-info">
                <div class="account-rank">${account.rank}</div>
                <div class="account-details">ID: ${account.id}</div>
                <div class="account-details">Nivel: ${account.level}</div>
                <div class="account-details">Campeones: ${account.champions}</div>
                <div class="account-price">${account.price}</div>
            </div>
        `;
        
        card.onclick = () => showAccountDetails(account);
        container.appendChild(card);
    });
}

// Actualizar la función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('accountModal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Actualizar los event listeners para cerrar
document.querySelector('.close-modal').onclick = closeModal;

window.onclick = function(event) {
    const modal = document.getElementById('accountModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Cerrar el modal con la X
document.querySelector('.close-modal').onclick = function() {
    document.getElementById('accountModal').style.display = 'none';
    closeModal();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', createAccountCards);
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    console.log('Menu toggle:', menuToggle);
    console.log('Nav links:', navLinks);
    
    if (!menuToggle || !navLinks) {
        console.error('No se encontró el botón o los enlaces de navegación');
        return;
    }
    
    menuToggle.addEventListener('click', (event) => {
        console.log('Menu toggle clicked');
        event.stopPropagation();
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        console.log('Nav links active:', navLinks.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        console.log('Click outside menu', {
            isClickInsideMenu,
            isClickOnToggle,
            isMenuActive: navLinks.classList.contains('active')
        });
        
        if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }, true); 
});
