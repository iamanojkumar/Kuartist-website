const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use('/style-sheet', express.static(path.join(__dirname, 'style-sheet')));
app.use('/component-lib', express.static(path.join(__dirname, 'component-lib')));
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve index.html from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const formData = req.body;

    // Prepare data for Notion
    const notionData = {
        parent: { database_id: 'e40af1dba4be4b40b93a95a5eb662f45' }, // Your database ID
        properties: {
            name: {
                title: [
                    {
                        text: {
                            content: formData.name // The name from the form
                        }
                    }
                ]
            },
            email: {
                email: formData.email // The email from the form
            },
            message: {
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

    try {
        // Send data to Notion
        await axios.post('https://api.notion.com/v1/pages', notionData, {
            headers: {
                'Authorization': `Bearer secret_EU6lsUCuIMro9cCy0NE54BJLuE7nkKamQoNUIh3Bgfj`, // Your API token
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28' // Use the latest version
            }
        });
        console.log('Data submitted to Notion:', formData);
        res.redirect('/');
    } catch (error) {
        console.error('Error submitting to Notion:', error.response.data); // Log the error response
        res.status(500).send('Error submitting to Notion');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});