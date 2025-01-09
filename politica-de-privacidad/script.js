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
