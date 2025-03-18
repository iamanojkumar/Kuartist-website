/**
 * Configuration file for the application
 * Contains all constants and configuration values
 */

// Get environment variables in browser context
const getEnvVariable = (name, defaultValue) => {
    // Check if we're in a Node.js environment
    if (typeof process !== 'undefined' && process.env) {
        return process.env[name] || defaultValue;
    }
    // If in browser, use hardcoded values
    return defaultValue;
};

// Notion API Configuration
const NOTION_CONFIG = {
    API_VERSION: getEnvVariable('NOTION_API_VERSION', '2022-06-28'),
    API_TOKEN: getEnvVariable('NOTION_API_TOKEN', 'secret_EU6lsUCuIMro9cCy0NE54BJLuE7nkKamQoNUIh3Bgfj'),
    DATABASES: {
        PROJECTS: getEnvVariable('NOTION_DATABASE_PROJECTS', 'cb577993a053443d9515f077a3a9f876'),
        ANALYTICS: getEnvVariable('NOTION_DATABASE_ANALYTICS', '1b06229e914080ed8de4db37e1673ef6'),
        CONTACT: getEnvVariable('NOTION_DATABASE_CONTACT', 'e40af1dba4be4b40b93a95a5eb662f45')
    }
};

// API Endpoints
const API_ENDPOINTS = {
    NOTION: {
        BASE_URL: 'https://api.notion.com/v1',
        PAGES: '/pages',
        BLOCKS: '/blocks',
        DATABASES: '/databases'
    }
};

// Analytics Configuration
const ANALYTICS_CONFIG = {
    GOOGLE_ANALYTICS_ID: getEnvVariable('GOOGLE_ANALYTICS_ID', 'G-5P0RBVR15S'),
    GEOAPIFY_API_KEY: getEnvVariable('GEOAPIFY_API_KEY', '72979fb6107d4578a44b59d07bec11f4')
};

// Color Mapping for Notion
const NOTION_COLORS = {
    yellow: "#DA8C1F",
    blue: "#1F2BDA",
    green: "#09C363",
    pink: "#C309C0",
    red: "#CC3134",
    gray: "#575757"
};

// Export configurations
export {
    NOTION_CONFIG,
    API_ENDPOINTS,
    ANALYTICS_CONFIG,
    NOTION_COLORS
}; 