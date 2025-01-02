
async function fetchPageContent(pageId) {
    const response = await fetch(`/fetch-page/${pageId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error(`Error fetching page content: ${response.statusText}`);
    }
    return await response.json(); // Return an array of block objects
}

async function loadProject() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");
    
    try {
        const response = await fetch(`/fetch-project/${projectId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error(`Error fetching project: ${response.statusText}`);
        }
        
        const project = await response.json();
        document.getElementById("project-title").textContent = project.properties.title.title[0]?.text.content || "Untitled";
        
        const projectDescription = project.properties.description.rich_text[0]?.text.content || "No description available.";
        document.getElementById("meta-description").setAttribute("content", projectDescription);
        
        const projectImageUrl = project.properties.thumbnail.url || "/Assets/Image/boy_in_vr.jpeg"; // Ensure a valid fallback
        document.getElementById("project-image").src = projectImageUrl;
        document.getElementById("project-description").textContent = projectDescription;

         // Fetch and apply background color
         const backgroundColor = project.properties.background_color; // Assuming this is how you access it
         if (backgroundColor && backgroundColor.rich_text.length > 0) {
             // Apply background color to the section with class 'project-template-bg-clr'
             document.querySelector('.project-template-bg-clr').style.backgroundColor = backgroundColor.rich_text[0].plain_text; // Apply background color
         }

                 // Insert Google Analytics Tag Code
        insertGoogleAnalytics();

        const pageId = project.id; // Use the project ID to fetch the page content
        const blocks = await fetchPageContent(pageId); // Fetch page content
        const contentContainer = document.getElementById("project-content");

        function updateSEO(title, description, imageUrl) {
            // Set Open Graph tags
            document.getElementById('og-title').setAttribute('content', title); // Open Graph Title
            document.getElementById('og-description').setAttribute('content', description); // Open Graph Description
            document.getElementById('og-image').setAttribute('content', imageUrl); // Open Graph Image
        
            // Site Search Settings
            document.getElementById('search-title').setAttribute('content', title); // Search Title
            document.getElementById('search-description').setAttribute('content', description); // Search Description
            document.getElementById('search-image').setAttribute('content', imageUrl); // Search Image
        }

        if (blocks && Array.isArray(blocks)) { // Ensure blocks is defined and is an array
            blocks.forEach((block) => {
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
                        const img = document.createElement("img");
                        img.src = block.image.file.url || block.image.external.url; // Ensure proper URL handling
                        img.alt = block.image.caption?.[0]?.text.content || "";
                        img.className = "project-image"; // Optional styling
                        contentContainer.appendChild(img);
                        
                        // Check for image caption
                        if (block.image.caption && block.image.caption.length > 0) {
                            const caption = document.createElement("p");
                            caption.textContent = block.image.caption.map(c => c.text.content).join("");
                            caption.className = "image-caption"; // Optional styling
                            contentContainer.appendChild(caption);
                        }
                        
                        break;
                    case "video":
                        const video = document.createElement("video");
                        video.src = block.video.external.url;
                        video.controls = true; // Allow user to control video playback
                        video.className = "project-video"; // Optional styling
                        contentContainer.appendChild(video);
                        break;
                    default:
                      console.log(`Unsupported block type: ${block.type}`);
                      break;
                }
            });
        } else {
            console.error("No blocks found or blocks are not in an array format.");
        }
        
    } catch (error) {
        console.error("Error loading project:", error);
        document.getElementById("project-description").textContent = "Error loading project data.";
    }
}

// Function to insert Google Analytics tag
function insertGoogleAnalytics() {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-5P0RBVR15S";
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-5P0RBVR15S');
    `;
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);
}

// Helper function to create text blocks with formatting
function createTextBlock(richTextArray, tagName, container, additionalClassName) {
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
            link.textContent = span.textContent; // Use the same text for the link
            link.target = "_blank"; // Open in a new tab
            span.replaceWith(link); // Replace span with link element
        }

        // Apply background color if specified
        if (textItem.annotations.background_color !== 'default') {
            span.style.backgroundColor = getColorFromNotion(textItem.annotations.background_color);
        }

        // Apply text color if specified
        if (textItem.annotations.color !== 'default') {
            span.style.color = getColorFromNotion(textItem.annotations.color);
        }

        element.appendChild(span); // Append styled text to element
    });

    if (additionalClassName) element.classList.add(additionalClassName); // Add class if provided
    container.appendChild(element); // Append the constructed element to the container
}

// Helper function to map Notion colors to CSS colors
function getColorFromNotion(color) {
    const colorsMap = {
        yellow: "#DA8C1F",
        blue: "#1F2BDA",
        green: "#09C363",
        pink: "#C309C0",
        red: "#CC3134",
        gray: "#575757",
    };
    return colorsMap[color] || ""; // Return mapped color or empty string for default
}

// Helper function to create list items
function createListItem(richTextArray, listType, container) {
    const listItem = document.createElement('li');
    richTextArray.forEach((textItem) => {
        listItem.appendChild(document.createTextNode(textItem.text.content));
    });

    let listContainer = container.querySelector(listType);
    if (!listContainer) {
        listContainer = document.createElement(listType); // Create a new list if it doesn't exist
        container.appendChild(listContainer);
    }
    
    listContainer.appendChild(listItem); // Append list item to the appropriate list
}

window.onload = loadProject;