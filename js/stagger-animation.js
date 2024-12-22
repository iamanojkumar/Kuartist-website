gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Split the text into characters
    const staggerText = new SplitType('.stagger-text', { types: 'chars' });
    const chars = document.querySelectorAll('.stagger-text .char');

    // Animate each character with slide-in effect
    chars.forEach((char, index) => {
        gsap.fromTo(char, 
            { opacity: 0, y: 13 }, // Start values (hidden and slightly below)
            { 
                opacity: 1, 
                y: 0, // Slide to original position
                duration: 0.36,
                delay: index * 0.036, // Adjust delay for faster stagger
                scrollTrigger: {
                    trigger: '.stagger-text', // Trigger on the parent element
                    start: "top bottom", 
                    end: "top center",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
});
