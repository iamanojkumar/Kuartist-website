// analytics.js

// Function to generate a UUID for session management
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to handle session management
function handleSessionManagement() {
    const storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
        const newSessionId = generateUUID();
        localStorage.setItem('sessionId', newSessionId);
    }
}

// Function to handle security-related data
function handleSecurityData() {
    // Implement logic to handle security-related data (e.g., authentication tokens)
}

// Function to track page views
function trackPageViews() {
    const pageViewCount = localStorage.getItem('pageViewCount');
    if (pageViewCount) {
        localStorage.setItem('pageViewCount', parseInt(pageViewCount) + 1);
    } else {
        localStorage.setItem('pageViewCount', 1);
    }
}

// Function to track bounce rate and time on site
function trackBounceRateAndTimeOnSite() {
    const startTime = new Date().getTime();
    
    window.onbeforeunload = function() {
        const endTime = new Date().getTime();
        const timeOnSite = (endTime - startTime) / 1000; // in seconds

        // Send timeOnSite data to server or analytics service
        fetch('/api/track-time-on-site', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timeOnSite })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    };
}

// Function to collect device and browser information
function collectDeviceInfo() {
    return navigator.userAgent; // You can enhance this with UAParser.js for detailed info
}

// Function to collect referrer data
function collectReferrerData() {
    return document.referrer;
}

// Function to get screen size
function getScreenSize() {
    return `${window.screen.width}x${window.screen.height}`;
}

// Function to get or set visitor ID
function getVisitorId() {
    const storedId = localStorage.getItem('visitorId');
    if (!storedId) {
        const newId = generateUUID(); // Create a unique ID if not present
        localStorage.setItem('visitorId', newId);
        return newId;
    }
    return storedId;
}

// Function to collect geographic data
function collectGeographicData(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Use a reverse geocoding service to get country, region, and city
                const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=72979fb6107d4578a44b59d07bec11f4`;

                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            console.error('Error fetching geographic data:', response.status, response.statusText);
                            callback({ country: '', region: '', city: '', postcode: '', suburb: '', timezone: '' }); // Default values if API call fails
                        } else {
                            return response.json();
                        }
                    })
                    .then(data => {
                        console.log('Geoapify API Response:', data); // Log the API response for inspection

                        if (data && data.features && data.features.length > 0) {
                            const feature = data.features[0].properties;
                            const country = feature.country || '';
                            const region = feature.state || feature.state_code || '';
                            const city = feature.suburb || feature.address_line1 || '';
                            const postcode = feature.postcode || '';
                            const suburb = feature.suburb || '';
                            const timezone = feature.timezone?.name || '';

                            console.log('Extracted Location Data:', {
                                country,
                                region,
                                city,
                                postcode,
                                suburb,
                                timezone
                            }); // Log the extracted location data

                            callback({
                                country,
                                region,
                                city,
                                postcode,
                                suburb,
                                timezone
                            });
                        } else {
                            console.error('Invalid response from Geoapify API. Response details:', data);
                            callback({ country: '', region: '', city: '', postcode: '', suburb: '', timezone: '' }); // Default values if response is invalid
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching geographic data:', error.message);
                        callback({ country: '', region: '', city: '', postcode: '', suburb: '', timezone: '' }); // Default values if API call fails
                    });
            },
            error => {
                console.error('Error getting geolocation:', error.message);
                callback({ country: '', region: '', city: '', postcode: '', suburb: '', timezone: '' }); // Default values if geolocation fails
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        callback({ country: '', region: '', city: '', postcode: '', suburb: '', timezone: '' }); // Default values if geolocation is not supported
    }
}



// Function to send visitor info to backend
function sendVisitorInfo() {
    handleSessionManagement();
    handleSecurityData();
    trackPageViews();
    trackBounceRateAndTimeOnSite();

    const visitorId = getVisitorId(); // Use cookies or local storage to identify visitors
    const deviceInfo = collectDeviceInfo();
    const screenSize = getScreenSize();
    const visitTime = new Date().toISOString();
    
    collectGeographicData((geoData) => {
        const location = `Country: ${geoData.country || ''}, Region: ${geoData.region || ''}, City: ${geoData.city || ''}, Postcode: ${geoData.postcode || ''}, Suburb: ${geoData.suburb || ''}, Timezone: ${geoData.timezone || ''}`;

        console.log('Visitor info prepared:', {
            visitorId,
            deviceInfo,
            screenSize,
            visitTime,
            referrer: collectReferrerData(),
            location
        }); // Log the prepared visitor info

        console.log('Sending visitor info to backend:', {
            visitorId,
            deviceInfo,
            screenSize,
            visitTime,
            referrer: collectReferrerData(),
            location
        }); // Log the data being sent

        // Prepare visitor info object
        const visitorInfo = {
            visitorId,
            deviceInfo,
            screenSize,
            visitTime,
            referrer: collectReferrerData(),
            location
        };

        // Send visitor info to backend
        fetch('/api/track-visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visitorInfo)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });
}




// Call the main function to send visitor info
sendVisitorInfo();
