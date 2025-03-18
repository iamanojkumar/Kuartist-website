/**
 * Main server file for the application
 */

import express from 'express';
import path from 'path';
import session from 'express-session';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { NOTION_CONFIG, API_ENDPOINTS } from './js/config.js';

// Initialize dotenv
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Add CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

/**
 * Common headers for Notion API requests
 */
const NOTION_HEADERS = {
    'Authorization': `Bearer ${NOTION_CONFIG.API_TOKEN}`,
    'Notion-Version': NOTION_CONFIG.API_VERSION,
    'Content-Type': 'application/json'
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/contact-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'contact-us.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'projects.html'));
});

// Routes for individual project pages
app.get('/project', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'project-template.html'));
});

// Admin routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'admin-login.html'));
});

app.get('/dashboard', (req, res) => {
    if (req.session.isAuthenticated) {
        res.sendFile(path.join(__dirname, 'pages', 'admin-dashboard.html'));
    } else {
        res.redirect('/login');
    }
});

// API Routes
app.post('/fetch-projects', async (req, res) => {
    try {
        const response = await axios.post(
            `${API_ENDPOINTS.NOTION.BASE_URL}${API_ENDPOINTS.NOTION.DATABASES}/${NOTION_CONFIG.DATABASES.PROJECTS}/query`,
            {},
            { headers: NOTION_HEADERS }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching projects from Notion:', error);
        res.status(500).send('Error fetching projects from Notion');
    }
});

app.get('/fetch-project/:id', async (req, res) => {
    try {
        const response = await axios.get(
            `${API_ENDPOINTS.NOTION.BASE_URL}${API_ENDPOINTS.NOTION.PAGES}/${req.params.id}`,
            { headers: NOTION_HEADERS }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching project from Notion:', error);
        res.status(500).send('Error fetching project from Notion');
    }
});

app.get('/fetch-page/:pageId', async (req, res) => {
    try {
        const response = await axios.get(
            `${API_ENDPOINTS.NOTION.BASE_URL}${API_ENDPOINTS.NOTION.BLOCKS}/${req.params.pageId}/children`,
            { headers: NOTION_HEADERS }
        );
        res.json(response.data.results);
    } catch (error) {
        console.error('Error fetching page content from Notion:', error);
        res.status(500).send('Error fetching page content from Notion');
    }
});

// Contact form submission
app.post('/submit', async (req, res) => {
    const formData = req.body;
    
    try {
        const notionData = {
            parent: { database_id: NOTION_CONFIG.DATABASES.CONTACT },
            properties: {
                'Name': {
                    title: [{ text: { content: formData.name } }]
                },
                'Email': {
                    email: formData.email
                },
                'Message': {
                    rich_text: [{ text: { content: formData.message } }]
                }
            }
        };

        await axios.post(
            `${API_ENDPOINTS.NOTION.BASE_URL}${API_ENDPOINTS.NOTION.PAGES}`,
            notionData,
            { headers: NOTION_HEADERS }
        );

        res.redirect('/');
    } catch (error) {
        console.error('Error submitting to Notion:', error.response ? error.response.data : error.message);
        res.status(500).send('Error submitting to Notion');
    }
});

// Analytics tracking
app.post('/api/track-visit', async (req, res) => {
    const visitorData = req.body;
    
    try {
        const notionData = {
            parent: { database_id: NOTION_CONFIG.DATABASES.ANALYTICS },
            properties: {
                'Visitor ID': { 
                    title: [{ text: { content: visitorData.visitorId } }]
                },
                'Device Info': { 
                    rich_text: [{ text: { content: visitorData.deviceInfo } }]
                },
                'Screen Size': { 
                    rich_text: [{ text: { content: visitorData.screenSize } }]
                },
                'Visit Time': { 
                    rich_text: [{ text: { content: visitorData.visitTime } }]
                },
                'Referrer': { 
                    rich_text: [{ text: { content: visitorData.referrer || '' } }]
                },
                'Location': { 
                    rich_text: [{ text: { content: visitorData.location || '' } }]
                }
            }
        };

        const response = await axios.post(
            `${API_ENDPOINTS.NOTION.BASE_URL}${API_ENDPOINTS.NOTION.PAGES}`,
            notionData,
            { headers: NOTION_HEADERS }
        );

        if (response.data.object === 'page' && response.data.id) {
            res.send({ message: 'Visitor data saved successfully' });
        } else {
            throw new Error('Failed to create page in Notion');
        }
    } catch (error) {
        console.error('Error submitting to Notion:', error.response ? error.response.data : error.message);
        res.status(500).send({ message: 'Error submitting visitor data to Notion' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});