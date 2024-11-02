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
    
    // Set the correct path based on the current page
    const isHomePage = window.location.pathname === '/'; // Check if we are on the home page
    const templatePath = isHomePage ? `pages/project-template.html?id=${project.id}` : `project-template.html?id=${project.id}`;

    console.log('Current Path:', window.location.pathname);
    console.log('Is Home Page:', isHomePage);
    console.log('Template Path:', templatePath);

    card.onclick = () => {
        console.log('Redirecting to:', templatePath); // Log the path
        window.location.href = templatePath; // Use the determined path
    };

    const img = document.createElement('img');
    img.src = project.properties.thumbnail.url || '/Assets/Image/404-img.png'; // Fallback image if URL is not available
    img.alt = project.properties.title.title[0]?.text.content || 'No Title'; // Safe access

    const title = document.createElement('h3');
    title.textContent = project.properties.title.title[0]?.text.content || 'Untitled'; // Safe access

    const tagsContainer = document.createElement('p'); // Create a container for tags

    // Accessing the tag property
    const tagValue = project.properties.tag; // Accessing the tag property
    
    // Check if tagValue exists and contains rich_text
    if (tagValue && tagValue.rich_text && tagValue.rich_text.length > 0) {
        // Extract the content from rich_text
        const tagsText = tagValue.rich_text.map(tag => tag.plain_text).join(', ');
        tagsContainer.textContent = tagsText; // Use the joined string
    } else {
        tagsContainer.textContent = 'No Tags'; // Fallback text
    }

   // Create hover text element
   const hoverText = document.createElement('div');
   hoverText.className = 'hover-text';
   hoverText.textContent = 'Read Case Study';
   
   // Append elements to card
   card.appendChild(img);
   card.appendChild(title);
   card.appendChild(tagsContainer); // Append tags container
   card.appendChild(hoverText); // Append hover text

   // Positioning logic for hover text
   card.addEventListener('mousemove', (e) => {
      const offsetX = 0; // Reduced offset X to bring text closer to cursor
      const offsetY = 0; // Reduced offset Y to bring text closer to cursor
      hoverText.style.left = `${e.pageX + offsetX}px`; // Update left position
      hoverText.style.top = `${e.pageY + offsetY}px`; // Update top position
      
   });

   card.addEventListener('mouseenter', () => {
      hoverText.style.display = 'block'; // Show text on hover
      hoverText.classList.add('scale-up'); // Add class for scaling effect
      
   });

   card.addEventListener('mouseleave', () => {
      hoverText.classList.remove('scale-up'); // Remove class for scaling effect
      
      setTimeout(() => {
          hoverText.style.display = 'none'; // Hide text after scaling out
        
      }, 300); // Match this timeout with your CSS transition duration
      
      
   });

return card;}


async function loadProjects() {
    const projects = await fetchProjects();

    console.log('Fetched Projects:', projects); // Log the entire array of project objects

    // Check for featured projects on the home page
    const featuredPortfolio = document.getElementById('featured-projects');
    if (featuredPortfolio) {
        featuredPortfolio.innerHTML = ''; // Clear existing projects

        projects.forEach(project => {
            console.log('Project:', project);
            if (project.properties.feature.checkbox) { // Only create cards for featured projects
                const card = createProjectCard(project);
                featuredPortfolio.appendChild(card); // Append the card to the featured projects container
            }
        });
    } 

    // Check for all projects on the projects page
    const portfolio = document.getElementById('portfolio');
    if (portfolio) {
        portfolio.innerHTML = ''; // Clear existing projects

        projects.forEach(project => {
            console.log('Project:', project);
            const card = createProjectCard(project); // Create a card for each project
            portfolio.appendChild(card); // Append the card to the portfolio
        });
    }
}

// Call this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadProjects);
