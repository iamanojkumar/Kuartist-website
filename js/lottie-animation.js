window.addEventListener('load', function() {
    // Load Lottie animation
    var animation = lottie.loadAnimation({
        container: document.getElementById('lottie-animation'), // ID of the container
        path: 'Assets/loading animation/preloader-animation.json', // Path to your JSON animation file
        renderer: 'svg',
        loop: true,
        autoplay: true,
    });

    // Hide preloader after the page is fully loaded
    const preloader = document.getElementById('preloader');
    
    // Use a timeout to ensure the animation plays for a moment before hiding
    setTimeout(() => {
        preloader.style.display = 'none'; // Hide preloader after loading
    }, 500); // Adjust time as needed (in milliseconds)
});