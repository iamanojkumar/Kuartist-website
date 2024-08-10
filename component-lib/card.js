class CardComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                <div class="crd-head">
                    <div class="crd-title-wrp">
                        <span class="material-symbols-outlined">
                            ${this.getAttribute('icon')}
                        </span>
                        <p class="crd-ttl">${this.getAttribute('title')}</p>
                    </div>
                </div>
                <p class="crd-des">${this.getAttribute('description')}</p>
                <a href="${this.getAttribute('link')}" class="crd-link">${this.getAttribute('link-text')}</a>
        `;
    }
}

customElements.define('card-component', CardComponent);



// component-lib/JS/card.js

// Notion API configuration
const NOTION_API_URL = 'https://api.notion.com/v1/databases/cb577993a053443d9515f077a3a9f876/query';
const NOTION_API_TOKEN = 'secret_EU6lsUCuIMro9cCy0NE54BJLuE7nkKamQoNUIh3Bgfj';

// Function to fetch projects from Notion
async function fetchProjects() {
    try {
        const response = await fetch('/fetch-projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching projects: ${response.statusText}`);
        }

        const data = await response.json();
        return data.results; // Return the array of project objects
    } catch (error) {
        console.error('Error fetching projects:', error);
        return []; // Return an empty array on error
    }
}

// Function to create a project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => {
        window.location.href = `pages/project-template.html?id=${project.id}`;
    };

    const img = document.createElement('img');
    img.src = project.cover ? project.cover.external.url : '/Assets/Image/404-img.png'; // Fallback image
    img.alt = project.properties.title.title[0]?.text.content || 'No Title'; // Safe access

    const title = document.createElement('h3');
    title.textContent = project.properties.title.title[0]?.text.content || 'Untitled'; // Safe access

    const tags = document.createElement('p');
    tags.textContent = project.properties.tag.relation.map(tag => tag.name).join(', ') || 'No Tags'; // Safe access

    const description = document.createElement('p');
    description.textContent = project.properties.description.rich_text[0]?.text.content || 'No Description'; // Safe access

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(tags);
    card.appendChild(description);

    return card;
}


// Function to load projects on page load
async function loadProjects() {
    const projects = await fetchProjects();

    // Log the fetched projects to check their structure
    console.log('Fetched Projects:', projects); // This will log the entire array of project objects

    const portfolio = document.getElementById('portfolio');

    // Check if projects were fetched successfully
    if (projects.length === 0) {
        console.log('No projects found.');
        return; // Exit the function if no projects are found
    }

    projects.forEach(project => {
        console.log('Project:', project); // Log each project object
        const card = createProjectCard(project);
        portfolio.appendChild(card);
    });
    
}

// Load projects when the window is loaded
window.onload = loadProjects;
