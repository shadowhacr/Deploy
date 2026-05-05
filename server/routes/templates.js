import express from 'express';
import { readJSON, writeJSON } from '../utils/fileStore.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const search = req.query.search?.toLowerCase();
    const sort = req.query.sort || 'popular';

    const data = await readJSON('templates.json', { templates: [], categories: [] });
    let templates = [...data.templates];

    if (category && category !== 'All') {
      templates = templates.filter(t => t.category === category);
    }

    if (search) {
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search)
      );
    }

    switch (sort) {
      case 'newest':
        templates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name':
        templates.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
      default:
        templates.sort((a, b) => b.deployCount - a.deployCount);
        break;
    }

    const total = templates.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTemplates = templates.slice(startIndex, endIndex);

    const lightTemplates = paginatedTemplates.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      thumbnail: t.thumbnail,
      deployCount: t.deployCount,
      createdAt: t.createdAt,
    }));

    res.json({
      templates: lightTemplates,
      total,
      page,
      limit,
      totalPages,
      categories: data.categories,
    });
  } catch (err) {
    console.error('Templates error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const data = await readJSON('templates.json', { templates: [], categories: [] });
    res.json({ categories: data.categories });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJSON('templates.json', { templates: [], categories: [] });
    const template = data.templates.find(t => t.id === id);

    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    res.json(template);
  } catch (err) {
    console.error('Get template error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
