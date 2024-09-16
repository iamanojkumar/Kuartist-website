// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Show the cookie popup after page load
    document.getElementById('cookie-popup').style.display = 'block';
});

function closePopup() {
    document.getElementById('cookie-popup').style.display = 'none';
}

function acceptCookies() {
    // Logic for accepting cookies (e.g., set a cookie or local storage)
    console.log("Cookies accepted");
    closePopup();
}

function rejectCookies() {
    // Logic for rejecting cookies (if necessary)
    console.log("Cookies rejected");
}