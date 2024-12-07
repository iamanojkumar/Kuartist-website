const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://kuartist.com';
const EXCLUDED_FILES = ['admin-login.html', 'admin-dashboard.html'];

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function generateSitemap() {
    // Initialize sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add homepage
    sitemap += `
    <url>
        <loc>${BASE_URL}</loc>
        <lastmod>${getCurrentDate()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>`;

    // Function to scan directory for HTML files
    function scanDirectory(dirPath) {
        const files = fs.readdirSync(dirPath);
        
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Recursively scan subdirectories
                scanDirectory(filePath);
            } else if (
                path.extname(file) === '.html' && 
                !EXCLUDED_FILES.includes(file) &&
                file !== 'index.html'
            ) {
                // Convert file path to URL path
                const relativePath = path
                    .relative(process.cwd(), filePath)
                    .replace(/\\/g, '/');
                
                // Add page to sitemap
                sitemap += `
    <url>
        <loc>${BASE_URL}/${relativePath}</loc>
        <lastmod>${getCurrentDate()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
            }
        });
    }

    // Start scanning from root directory
    scanDirectory('.');

    // Close sitemap XML
    sitemap += `
</urlset>`;

    // Write sitemap file
    fs.writeFileSync('sitemap.xml', sitemap);
    console.log('Sitemap generated successfully!');

    // Generate robots.txt
    const robotsTxt = `User-agent: *
Disallow: /pages/admin-login.html
Disallow: /pages/admin-dashboard.html
Sitemap: ${BASE_URL}/sitemap.xml`;

    fs.writeFileSync('robots.txt', robotsTxt);
    console.log('robots.txt generated successfully!');
}

// Run the generator
generateSitemap();
