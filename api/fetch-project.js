// /api/fetch-project.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing project id' });
  }

  const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;

  try {
    const notionRes = await fetch(
      `https://api.notion.com/v1/pages/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${NOTION_API_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }
      }
    );
    const data = await notionRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching project from Notion:', error);
    res.status(500).json({ error: 'Error fetching project from Notion' });
  }
} 