/**
 * Main file for handling Notion content rendering
 */

import { fetchProject, fetchPageContent } from './services/notionService.js';
import { createTextBlock, createListItem, updateSEO } from './utils.js';
import { ANALYTICS_CONFIG } from './config.js';

/**
 * Inserts Google Analytics tracking code
 */
function insertGoogleAnalytics() {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID}`;
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID}');
    `;
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);
}

/**
 * Renders a block of content based on its type
 * @param {Object} block - The Notion block to render
 * @param {HTMLElement} contentContainer - Container to render the block in
 */
function renderBlock(block, contentContainer) {
    switch (block.type) {
        case "paragraph":
            createTextBlock(block.paragraph.rich_text, 'p', contentContainer);
            break;
        case "heading_1":
            createTextBlock(block.heading_1.rich_text, 'h1', contentContainer);
            break;
        case "heading_2":
            createTextBlock(block.heading_2.rich_text, 'h2', contentContainer);
            break;
        case "heading_3":
            createTextBlock(block.heading_3.rich_text, 'h3', contentContainer);
            break;
        case "bulleted_list_item":
            createListItem(block.bulleted_list_item.rich_text, 'ul', contentContainer);
            break;
        case "numbered_list_item":
            createListItem(block.numbered_list_item.rich_text, 'ol', contentContainer);
            break;
        case "quote":
            createTextBlock(block.quote.rich_text, 'blockquote', contentContainer);
            break;
        case "divider":
            const dividerLine = document.createElement("hr");
            contentContainer.appendChild(dividerLine);
            break;
        case "callout":
            createTextBlock(block.callout.rich_text, 'div', contentContainer, 'callout');
            break;
        case "image":
            renderImageBlock(block, contentContainer);
            break;
        case "video":
            renderVideoBlock(block, contentContainer);
            break;
        default:
            console.log(`Unsupported block type: ${block.type}`);
            break;
    }
}

/**
 * Renders an image block with caption
 * @param {Object} block - The image block to render
 * @param {HTMLElement} contentContainer - Container to render the image in
 */
function renderImageBlock(block, contentContainer) {
    const img = document.createElement("img");
    img.src = block.image.file.url || block.image.external.url;
    img.alt = block.image.caption?.[0]?.text.content || "";
    img.className = "project-image";
    contentContainer.appendChild(img);
    
    if (block.image.caption && block.image.caption.length > 0) {
        const caption = document.createElement("p");
        caption.textContent = block.image.caption.map(c => c.text.content).join("");
        caption.className = "image-caption";
        contentContainer.appendChild(caption);
    }
}

/**
 * Renders a video block with error handling
 * @param {Object} block - The video block to render
 * @param {HTMLElement} contentContainer - Container to render the video in
 */
function renderVideoBlock(block, contentContainer) {
    const video = document.createElement("video");
    video.src = block.video.external.url;
    video.controls = true;
    video.className = "project-video";
    video.style.width = "100%";
    video.style.height = "auto";

    video.onerror = function() {
        console.error("Failed to load video:", block.video.external.url);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error loading video.";
        contentContainer.appendChild(errorMessage);
    };

    contentContainer.appendChild(video);
}

/**
 * Main function to load and display project content
 */
async function loadProject() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");
    
    try {
        // Fetch project data
        const project = await fetchProject(projectId);
        
        // Update page title and description
        document.getElementById("project-title").textContent = project.properties.title.title[0]?.text.content || "Untitled";
        const projectDescription = project.properties.description.rich_text[0]?.text.content || "No description available.";
        document.getElementById("meta-description").setAttribute("content", projectDescription);
        
        // Update project image
        const projectImageUrl = project.properties.thumbnail.url || "/Assets/Image/boy_in_vr.jpeg";
        document.getElementById("project-image").src = projectImageUrl;
        document.getElementById("project-description").textContent = projectDescription;

        // Update SEO tags
        updateSEO(
            project.properties.title.title[0]?.text.content || "Untitled",
            projectDescription,
            projectImageUrl
        );

        // Apply background color if specified
        const backgroundColor = project.properties.background_color;
        if (backgroundColor && backgroundColor.rich_text.length > 0) {
            document.querySelector('.project-template-bg-clr').style.backgroundColor = backgroundColor.rich_text[0].plain_text;
        }

        // Insert Google Analytics
        insertGoogleAnalytics();

        // Fetch and render page content
        const pageId = project.id;
        const blocks = await fetchPageContent(pageId);
        const contentContainer = document.getElementById("project-content");

        if (blocks && Array.isArray(blocks)) {
            blocks.forEach(block => renderBlock(block, contentContainer));
        } else {
            console.error("No blocks found or blocks are not in an array format.");
        }
        
    } catch (error) {
        console.error("Error loading project:", error);
        document.getElementById("project-description").textContent = "Error loading project data.";
    }
}

// Initialize when the page loads
window.onload = loadProject;