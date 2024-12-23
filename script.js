
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelector('.nav-links');
    
    logo.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            navLinks.classList.toggle('active');
        }
    });
});