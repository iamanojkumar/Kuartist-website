/**
 * Service for handling Notion API interactions
 */

import { API_ENDPOINTS } from '../config.js';

/**
 * Fetches a specific project by ID from Notion
 * @param {string} projectId - The Notion page ID of the project
 * @returns {Promise<Object>} The project data
 */
export async function fetchProject(projectId) {
    try {
        const response = await fetch(`/fetch-project/${projectId}`);
        
        if (!response.ok) {
            throw new Error(`Error fetching project: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching project from Notion:', error);
        throw error;
    }
}

/**
 * Fetches all blocks (content) for a specific page
 * @param {string} pageId - The Notion page ID
 * @returns {Promise<Array>} Array of block objects
 */
export async function fetchPageContent(pageId) {
    try {
        const response = await fetch(`/fetch-page/${pageId}`);
        
        if (!response.ok) {
            throw new Error(`Error fetching page content: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching page content from Notion:', error);
        throw error;
    }
}

/**
 * Fetches all projects from the projects database
 * @returns {Promise<Array>} Array of project objects
 */
export async function fetchProjects() {
    try {
        const response = await fetch('/fetch-projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error fetching projects: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching projects from Notion:', error);
        throw error;
    }
}

/**
 * Submits contact form data to Notion
 * @param {Object} formData - The form data to submit
 * @returns {Promise<Object>} The response from Notion
 */
export async function submitContactForm(formData) {
    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error submitting form: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting contact form to Notion:', error);
        throw error;
    }
} 