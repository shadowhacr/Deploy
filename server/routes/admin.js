import express from 'express';
import { adminAuth, generateToken } from '../middleware/adminAuth.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { readJSON, writeJSON } from '../utils/fileStore.js';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const settings = await readJSON('settings.json', {});

    if (!settings.adminPasswordHash) {
      return res.status(500).json({ success: false, error: 'Admin not configured' });
    }

    const isValid = await comparePassword(password, settings.adminPasswordHash);
    if (!isValid) {
      return res.json({ success: false, error: 'Invalid password' });
    }

    const token = generateToken();
    res.json({ success: true, token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const usersData = await readJSON('users.json', { users: [] });
    const deploymentsData = await readJSON('deployments.json', { deployments: [] });
    const templatesData = await readJSON('templates.json', { templates: [], categories: [] });
    const purchasesData = await readJSON('creditPurchases.json', { purchases: [] });

    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const deploymentsThisWeek = Array(7).fill(0);

    deploymentsData.deployments.forEach(d => {
      const deployDate = new Date(d.deployDate);
      if (deployDate >= weekAgo) {
        const dayIndex = Math.floor((now - deployDate) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < 7) {
          deploymentsThisWeek[6 - dayIndex]++;
        }
      }
    });

    const today = now.toISOString().split('T')[0];
    const deploymentsToday = deploymentsData.deployments.filter(d =>
      d.deployDate.startsWith(today)
    ).length;

    res.json({
      totalUsers: usersData.users.length,
      totalDeployments: deploymentsData.deployments.length,
      totalTemplates: templatesData.templates.length,
      creditsSold: purchasesData.purchases.reduce((sum, p) => sum + p.credits, 0),
      deploymentsToday,
      deploymentsThisWeek,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const usersData = await readJSON('users.json', { users: [] });
    const deploymentsData = await readJSON('deployments.json', { deployments: [] });

    const users = usersData.users.map(u => ({
      username: u.username,
      deploysToday: u.deploysToday,
      deploysResetDate: u.deploysResetDate,
      credits: u.credits,
      joinDate: u.joinDate,
      totalDeploys: deploymentsData.deployments.filter(d => d.username === u.username).length,
    }));

    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add/remove credits
router.post('/credits', adminAuth, async (req, res) => {
  try {
    const { username, credits, action } = req.body;

    if (!username || !credits || !['add', 'remove'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const usersData = await readJSON('users.json', { users: [] });
    const user = usersData.users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (action === 'add') {
      user.credits += parseInt(credits);
    } else {
      user.credits = Math.max(0, user.credits - parseInt(credits));
    }

    await writeJSON('users.json', usersData);

    res.json({
      success: true,
      newBalance: user.credits,
      message: `${credits} credits ${action === 'add' ? 'added to' : 'removed from'} ${username}`,
    });
  } catch (err) {
    console.error('Credits admin error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all templates for management
router.get('/templates', adminAuth, async (req, res) => {
  try {
    const data = await readJSON('templates.json', { templates: [], categories: [] });
    const templates = data.templates.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      thumbnail: t.thumbnail,
      deployCount: t.deployCount,
      createdAt: t.createdAt,
    }));

    res.json({ templates, total: templates.length });
  } catch (err) {
    console.error('Admin templates error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete template
router.delete('/templates/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJSON('templates.json', { templates: [], categories: [] });

    const index = data.templates.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    data.templates.splice(index, 1);
    await writeJSON('templates.json', data);

    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    console.error('Delete template error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
