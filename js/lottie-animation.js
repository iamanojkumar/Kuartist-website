window.addEventListener('load', function() {
    // Load Lottie animation
    var animation = lottie.loadAnimation({
        container: document.getElementById('lottie-animation'), // ID of the container
        path: 'Assets/loading animation/preloader-animation.json', // Path to your JSON animation file
        renderer: 'svg',
        loop: true, // Loop indefinitely
        autoplay: true,
    });

    // Hide preloader after the page is fully loaded
    const preloader = document.getElementById('preloader');
    
    // Immediately hide the preloader once the page is loaded
    preloader.style.display = 'none'; // Hide preloader after loading
});