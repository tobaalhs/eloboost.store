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