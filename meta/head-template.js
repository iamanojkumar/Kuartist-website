// Function to load the head template
function loadHead() {
    fetch('head-template.html')
        .then(response => response.text())
        .then(data => {
            document.head.innerHTML += data; // Append the head content
        })
        .catch(error => console.error('Error loading head template:', error));
}

// Call the function to load the head template
loadHead();