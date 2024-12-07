// Sample data for projects
const projectsData = [
    { title: "Project 1", category: "website" },
    { title: "Project 2", category: "graphic" },
    { title: "Project 3", category: "website" },
    { title: "Project 4", category: "graphic" },
];

// Function to render projects
function renderProjects() {
    const portfolio = document.getElementById('portfolio');
    
    // Clear existing projects
    portfolio.innerHTML = '';

    // Create project cards based on data
    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project';
        projectCard.setAttribute('data-category', project.category);
        projectCard.innerText = project.title;

        portfolio.appendChild(projectCard);
    });
}

// Function to filter projects
function filterProjects(filter) {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        if (filter === 'all' || project.getAttribute('data-category') === filter) {
            project.classList.remove('hidden');
        } else {
            project.classList.add('hidden');
        }
    });
}

// Event listeners for filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Filter projects based on selected category
        filterProjects(filter);
        
        // Highlight active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Initial rendering of projects
renderProjects();