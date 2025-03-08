// Function to generate a UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to get visitor information
function getVisitorInfo() {
    const visitorId = getVisitorId(); // Use cookies or local storage to identify visitors
    const deviceInfo = getDeviceInfo();
    const screenSize = getScreenSize();
    const visitTime = new Date().toISOString();

    return {
        visitorId,
        deviceInfo,
        screenSize,
        visitTime
    };
}

// Function to get device info
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    // Use a library like UAParser.js to parse userAgent for more detailed info
    return userAgent;
}

// Function to get screen size
function getScreenSize() {
    return `${window.screen.width}x${window.screen.height}`;
}

// Function to get or set visitor ID
function getVisitorId() {
    const storedId = localStorage.getItem('visitorId');
    if (!storedId) {
        const newId = generateUUID(); // Implement generateUUID() to create a unique ID
        localStorage.setItem('visitorId', newId);
        return newId;
    }
    return storedId;
}

// Send visitor info to backend
fetch('https://kuartist.com/api/track-visit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(getVisitorInfo())
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
