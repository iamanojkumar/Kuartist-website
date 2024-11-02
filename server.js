const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const cors = require('cors'); // Importing CORS

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors({
    origin: '*', // Allow all origins or specify allowed domains
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Serve static files
app.use('/style-sheet', express.static(path.join(__dirname, 'style-sheet')));
app.use('/component-lib', express.static(path.join(__dirname, 'component-lib')));
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));
app.use('/pages', express.static(path.join(__dirname, 'pages'))); // Serve static files from the 'pages' directory
app.use('/js', express.static(path.join(__dirname, 'js'))); // Serve JS files from the 'js' directory

// Use body-parser middleware (Express 4.x has built-in body parsing)
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

// Session management
app.use(session({
    secret: 'your-secret-key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Dummy credentials
const validEmail = 'manoj@kuartist.com'; // Replace with your admin email
const validPassword = 'kuartist9944'; // Replace with your admin password

// Serve index.html from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'admin-login.html')); // Serve the login page
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check credentials
    if (email === validEmail && password === validPassword) {
        req.session.isAuthenticated = true; // Set session variable
        res.redirect('/dashboard'); // Redirect to the dashboard
    } else {
        res.send('<h1>Invalid email or password</h1><a href="/login">Try again</a>');
    }
});

// Admin Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.isAuthenticated) {
        res.sendFile(path.join(__dirname, 'pages', 'admin-dashboard.html')); // Serve the dashboard page
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.redirect('/login'); // Redirect to login after logout
    });
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const formData = req.body;
    console.log('Form Data:', formData); 

    // Prepare data for Notion
    const notionData = {
        parent: { database_id: 'e40af1dba4be4b40b93a95a5eb662f45' }, // Replace with your database ID
        properties: {
            'Name': { // Use the exact property name from your Notion database
                title: [
                    {
                        text: {
                            content: formData.name // The name from the form
                        }
                    }
                ]
            },
            'Email': { // Use the exact property name from your Notion database
                email: formData.email // The email from the form
            },
            'Message': { // Use the exact property name from your Notion database
                rich_text: [
                    {
                        text: {
                            content: formData.message // The message from the form
                        }
                    }
                ]
            }
        }
    };

    console.log('Notion Data:', notionData); // Log the data being sent to Notion

    try {
        // Send data to Notion
        await axios.post('https://api.notion.com/v1/pages', notionData, {
            headers: {
                'Authorization': `Bearer secret_EU6lsUCuIMro9cCy0NE54BJLuE7nkKamQoNUIh3Bgfj`, // Replace with your API token
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28' // Use the latest version
            }
        });
        console.log('Data submitted to Notion:', formData);
        res.redirect('/');
    } catch (error) {
        console.error('Error submitting to Notion:', error.response ? error.response.data : error.message);
        res.status(500).send('Error submitting to Notion');
    }
});

// Proxy route for fetching projects from Notion
app.post('/fetch-projects', async (req, res) => {
    try {
        const response = await axios.post('https://api.notion.com/v1/databases/cb577993a053443d9515f077a3a9f876/query', {}, {
            headers: {
                'Authorization': `Bearer secret_EU6lsUCuIMro9cCy0NE54BJLuE7nkKamQoNUIh3Bgfj`, // Your Notion API token
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data); // Send the response data back to the client
    } catch (error) {
        console.error('Error fetching projects from Notion:', error);
        res.status(500).send('Error fetching projects from Notion');
    }
});

// New route to fetch a specific project by ID
app.get('/fetch-project/:id', async (req, res) => {
    const projectId = req.params.id;

    try {
        const response = await axios.get(`https://api.notion.com/v1/pages/${projectId}`, {
            headers: {
                'Authorization': `Bearer secret_EU6lsUCuIMro9cCy0NE54BJLuE7nkKamQoNUIh3Bgfj`, // Your Notion API token
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data); // Send the project data back to the client
    } catch (error) {
        console.error('Error fetching project from Notion:', error);
        res.status(500).send('Error fetching project from Notion');
    }
});

// New route to fetch page content by ID
app.get('/fetch-page/:id', async (req, res) => {
    const pageId = req.params.id;

    try {
        const response = await axios.get(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            headers: {
                'Authorization': `Bearer secret_EU6lsUCuIMro9cCy0NE54BJLuE7nkKamQoNUIh3Bgfj`, // Your Notion API token
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data.results); // Send the page content back to the client
    } catch (error) {
        console.error('Error fetching page content from Notion:', error);
        res.status(500).send('Error fetching page content from Notion');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});