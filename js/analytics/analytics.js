/**
 * Analytics module for tracking visitor data and behavior
 */

import { ANALYTICS_CONFIG } from '../config.js';

/**
 * Tracks visitor data including device info, screen size, and location
 */
export function trackVisitorData() {
    const visitorData = {
        visitorId: generateVisitorId(),
        deviceInfo: getDeviceInfo(),
        screenSize: getScreenSize(),
        visitTime: new Date().toISOString(),
        referrer: document.referrer || '',
        location: ''
    };

    // Collect geographic data
    collectGeographicData(location => {
        visitorData.location = location;
        submitVisitorData(visitorData);
    });
}

/**
 * Generates a unique visitor ID
 * @returns {string} A unique visitor ID
 */
function generateVisitorId() {
    return 'v_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Gets device information
 * @returns {string} Device information string
 */
function getDeviceInfo() {
    const ua = navigator.userAgent;
    const browser = getBrowserInfo(ua);
    const os = getOSInfo(ua);
    return `${browser} on ${os}`;
}

/**
 * Gets browser information from user agent
 * @param {string} ua - User agent string
 * @returns {string} Browser name and version
 */
function getBrowserInfo(ua) {
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer';
    return 'Unknown Browser';
}

/**
 * Gets operating system information from user agent
 * @param {string} ua - User agent string
 * @returns {string} Operating system name
 */
function getOSInfo(ua) {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown OS';
}

/**
 * Gets screen size information
 * @returns {string} Screen size information
 */
function getScreenSize() {
    return `${window.innerWidth}x${window.innerHeight}`;
}

/**
 * Collects geographic data using the browser's geolocation API
 * @param {Function} callback - Callback function to handle the location data
 */
function collectGeographicData(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${ANALYTICS_CONFIG.GEOAPIFY_API_KEY}`;

                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error fetching geographic data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const location = data.features[0]?.properties || {};
                        callback(formatLocation(location));
                    })
                    .catch(error => {
                        console.error('Error fetching geographic data:', error);
                        callback('');
                    });
            },
            error => {
                console.error('Error getting geolocation:', error);
                callback('');
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        callback('');
    }
}

/**
 * Formats location data into a string
 * @param {Object} location - Location data object
 * @returns {string} Formatted location string
 */
function formatLocation(location) {
    const parts = [];
    if (location.country) parts.push(location.country);
    if (location.state) parts.push(location.state);
    if (location.city) parts.push(location.city);
    return parts.join(', ');
}

/**
 * Submits visitor data to the server
 * @param {Object} visitorData - Visitor data to submit
 */
function submitVisitorData(visitorData) {
    fetch('/api/track-visit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitorData)
    })
    .then(response => response.json())
    .then(data => console.log('Visitor data submitted:', data))
    .catch(error => console.error('Error submitting visitor data:', error));
}

/**
 * Tracks bounce rate and time on site
 */
export function trackBounceRateAndTimeOnSite() {
    const startTime = new Date().getTime();
    
    window.onbeforeunload = function() {
        const endTime = new Date().getTime();
        const timeOnSite = (endTime - startTime) / 1000; // in seconds

        fetch('/api/track-time-on-site', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timeOnSite })
        })
        .then(response => response.json())
        .then(data => console.log('Time on site data submitted:', data))
        .catch(error => console.error('Error:', error));
    };
}

// Initialize analytics when the page loads
document.addEventListener('DOMContentLoaded', () => {
    trackVisitorData();
    trackBounceRateAndTimeOnSite();
}); 