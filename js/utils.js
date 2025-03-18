/**
 * Utility functions for the application
 */

import { NOTION_COLORS } from './config.js';

/**
 * Maps Notion color names to CSS color values
 * @param {string} color - The Notion color name
 * @returns {string} The corresponding CSS color value
 */
export function getColorFromNotion(color) {
    return NOTION_COLORS[color] || "";
}

/**
 * Creates a text block with formatting based on Notion annotations
 * @param {Array} richTextArray - Array of rich text objects from Notion
 * @param {string} tagName - HTML tag name to create
 * @param {HTMLElement} container - Container element to append the block to
 * @param {string} additionalClassName - Optional additional CSS class
 */
export function createTextBlock(richTextArray, tagName, container, additionalClassName) {
    const element = document.createElement(tagName);
    
    richTextArray.forEach((textItem) => {
        const span = document.createElement('span');
        span.textContent = textItem.text.content;

        // Apply styles based on annotations
        if (textItem.annotations.bold) span.style.fontWeight = 'bold';
        if (textItem.annotations.italic) span.style.fontStyle = 'italic';
        if (textItem.annotations.strikethrough) span.style.textDecoration = 'line-through';
        
        // Handle links
        if (textItem.link) {
            const link = document.createElement('a');
            link.href = textItem.link.url;
            link.textContent = span.textContent;
            link.target = "_blank";
            span.replaceWith(link);
        }

        // Apply background color if specified
        if (textItem.annotations.background_color !== 'default') {
            span.style.backgroundColor = getColorFromNotion(textItem.annotations.background_color);
        }

        // Apply text color if specified
        if (textItem.annotations.color !== 'default') {
            span.style.color = getColorFromNotion(textItem.annotations.color);
        }

        element.appendChild(span);
    });

    if (additionalClassName) element.classList.add(additionalClassName);
    container.appendChild(element);
}

/**
 * Creates a list item from Notion rich text
 * @param {Array} richTextArray - Array of rich text objects from Notion
 * @param {string} listType - HTML list type ('ul' or 'ol')
 * @param {HTMLElement} container - Container element to append the list to
 */
export function createListItem(richTextArray, listType, container) {
    const listItem = document.createElement('li');
    richTextArray.forEach((textItem) => {
        listItem.appendChild(document.createTextNode(textItem.text.content));
    });

    let listContainer = container.querySelector(listType);
    if (!listContainer) {
        listContainer = document.createElement(listType);
        container.appendChild(listContainer);
    }
    
    listContainer.appendChild(listItem);
}

/**
 * Updates SEO meta tags for a page
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} imageUrl - Page image URL
 */
export function updateSEO(title, description, imageUrl) {
    // Set Open Graph tags
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-description').setAttribute('content', description);
    document.getElementById('og-image').setAttribute('content', imageUrl);
    
    // Set Search tags
    document.getElementById('search-title').setAttribute('content', title);
    document.getElementById('search-description').setAttribute('content', description);
    document.getElementById('search-image').setAttribute('content', imageUrl);
} 