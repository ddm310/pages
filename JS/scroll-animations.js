// scroll-animations.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Scroll animations loaded');
    
    // Функция для анимации навигации (только при загрузке)
    function animateNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.classList.add('visible');
            }, 300 + (index * 100)); // Задержка для каждого элемента
        });
    }
    
    // Функция для проверки видимости остальных элементов
    function checkVisibility() {
        const elements = document.querySelectorAll('.fade-in:not(.nav-link), .fade-in-up, .fade-in-left, .fade-in-right');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            } else {
                element.classList.remove('visible');
            }
        });
    }
    
    // Анимация логотипа
    setTimeout(() => {
        const logo = document.querySelector('.logo.fade-in');
        if (logo) logo.classList.add('visible');
    }, 200);
    
    // Запускаем анимации
    animateNavigation();
    checkVisibility();
    
    // События
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
});