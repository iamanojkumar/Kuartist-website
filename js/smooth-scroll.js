// script.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Use GSAP to animate the scroll
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: targetElement.offsetTop,
                autoKill: false // Prevents killing the animation if the user scrolls
            },
            ease: "power2.inOut"
        });
    });
});