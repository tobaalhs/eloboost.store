document.addEventListener('DOMContentLoaded', () => {
    const lolSection = document.getElementById('lol-section');
    const valorantSection = document.getElementById('valorant-section');
    const sections = document.querySelectorAll('.section');

    // Efecto de resplandor que sigue al mouse
    sections.forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            section.querySelector('.glow-effect').style.setProperty('--x', `${x}%`);
            section.querySelector('.glow-effect').style.setProperty('--y', `${y}%`);
        });
    });

    // Animación de partículas
    sections.forEach(section => {
        const particles = section.querySelector('.particles');
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = Math.random() * 3 + 2 + 's';
            particle.style.animation = `particleAnimation ${particle.style.animationDuration} infinite ${particle.style.animationDelay}`;
            particles.appendChild(particle);
        }
    });

    // Enlaces de navegación con efecto de pulsación
    const navigateWithPulse = (element, url) => {
        element.style.transform = 'scale(0.98)';
        element.style.boxShadow = '0 0 0 rgba(255,255,255,0.4)';
        element.style.transition = 'all 0.2s ease';

        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 0 20px rgba(255,255,255,0.2)';
        }, 200);

        setTimeout(() => {
            window.location.href = url;
        }, 400);
    };

    lolSection.addEventListener('click', () => navigateWithPulse(lolSection, '/lol/ranked-boost/'));
    valorantSection.addEventListener('click', () => navigateWithPulse(valorantSection, '/valorant/ranked-boost/'));
});

