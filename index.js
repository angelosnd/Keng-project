// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling pour la navigation
    const navLinks = document.querySelectorAll('.header-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Ajouter classe active
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Modale pour les images des services
    const serviceImages = document.querySelectorAll('.service-img');
    let modal = null;
    let modalImg = null;
    let modalCaption = null;

    serviceImages.forEach(img => {
        img.addEventListener('click', function() {
            // Créer modale si inexistante
            if (!modal) {
                modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    cursor: pointer;
                `;
                
                modalImg = document.createElement('img');
                modalImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    border-radius: 10px;
                `;
                
                modalCaption = document.createElement('p');
                modalCaption.style.cssText = `
                    color: white;
                    position: absolute;
                    bottom: 20px;
                    text-align: center;
                    width: 100%;
                    font-size: 1.2em;
                `;
                
                modal.appendChild(modalImg);
                modal.appendChild(modalCaption);
                document.body.appendChild(modal);

                // Fermeture modale
                modal.addEventListener('click', closeModal);
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') closeModal();
                });
            }

            // Afficher image et légende
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalCaption.textContent = this.nextElementSibling.textContent; // Légende du service
            modal.style.display = 'flex';
        });
    });

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Animations de révélation au défilement
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Style pour .active (si pas déjà en CSS)
    if (!document.querySelector('style[data-active]')) {
        const style = document.createElement('style');
        style.setAttribute('data-active', 'true');
        style.textContent = `
            .header-nav a.active {
                color: #D32F2F !important;
                border-bottom: 2px solid #D32F2F;
            }
        `;
        document.head.appendChild(style);
    }
});

// Logique du Carrousel pour Références
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
const slideWidth = 320; // Largeur slide + gap (300px + 20px)
const totalSlides = slides.length;
let autoSlideInterval;

// Créer les dots
function createDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

// Aller à un slide spécifique
function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateDots();
}

// Mettre à jour les dots actifs
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Slide suivant
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
}

// Slide précédent
function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(currentIndex);
}

// Auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000); // 5 secondes
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Événements
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

const container = document.querySelector('.carousel-container');
if (container) {
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
}

// Initialiser
createDots();
startAutoSlide();

// Adapter pour responsive (optionnel : recalculer slideWidth sur resize)
window.addEventListener('resize', () => {
    // Recalcul si besoin, mais fixe pour simplicité
});
