import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { readJSON, writeJSON } from '../utils/fileStore.js';
import { generateSite } from '../utils/deployEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const SITES_DIR = path.join(__dirname, '../../public/sites');

async function ensureSitesDir() {
  try {
    await fs.access(SITES_DIR);
  } catch {
    await fs.mkdir(SITES_DIR, { recursive: true });
  }
}

function generateSiteId() {
  return Math.random().toString(36).substring(2, 10);
}

function canDeploy(user) {
  const today = new Date().toISOString().split('T')[0];
  if (user.deploysResetDate !== today) {
    return { canDeploy: true, type: 'free', remaining: 2 };
  }
  const freeRemaining = 2 - user.deploysToday;
  if (freeRemaining > 0) {
    return { canDeploy: true, type: 'free', remaining: freeRemaining };
  }
  if (user.credits > 0) {
    return { canDeploy: true, type: 'credit', remaining: user.credits };
  }
  return { canDeploy: false, remaining: 0 };
}

router.post('/', async (req, res) => {
  try {
    const { username, templateId, customizations } = req.body;

    if (!username || !templateId || !customizations) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const usersData = await readJSON('users.json', { users: [] });
    const user = usersData.users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.deploysResetDate !== today) {
      user.deploysToday = 0;
      user.deploysResetDate = today;
    }

    const deployCheck = canDeploy(user);
    if (!deployCheck.canDeploy) {
      return res.json({
        success: false,
        error: 'No deploys remaining. Purchase credits or wait for daily reset.',
        creditsNeeded: true,
      });
    }

    const templatesData = await readJSON('templates.json', { templates: [], categories: [] });
    const template = templatesData.templates.find(t => t.id === templateId);

    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    const siteHtml = generateSite(template, customizations);
    const siteId = generateSiteId();
    const sitePath = path.join(SITES_DIR, username, siteId);

    await ensureSitesDir();
    await fs.mkdir(sitePath, { recursive: true });
    await fs.writeFile(path.join(sitePath, 'index.html'), siteHtml);

    if (deployCheck.type === 'free') {
      user.deploysToday += 1;
    } else {
      user.credits -= 1;
    }
    await writeJSON('users.json', usersData);

    const deploymentsData = await readJSON('deployments.json', { deployments: [] });
    const deployment = {
      siteId,
      username,
      templateId,
      templateName: template.name,
      url: `/sites/${username}/${siteId}`,
      deployDate: new Date().toISOString(),
      customizations,
    };
    deploymentsData.deployments.push(deployment);
    await writeJSON('deployments.json', deploymentsData);

    template.deployCount += 1;
    await writeJSON('templates.json', templatesData);

    res.json({
      success: true,
      siteId,
      url: `/sites/${username}/${siteId}`,
      message: 'Website deployed successfully!',
      remainingDeploys: deployCheck.type === 'free' ? 2 - user.deploysToday : user.credits,
    });
  } catch (err) {
    console.error('Deploy error:', err);
    res.status(500).json({ success: false, error: 'Deployment failed: ' + err.message });
  }
});

router.get('/deployments/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const data = await readJSON('deployments.json', { deployments: [] });
    const userDeployments = data.deployments
      .filter(d => d.username === username)
      .map(d => ({
        siteId: d.siteId,
        templateId: d.templateId,
        templateName: d.templateName,
        url: d.url,
        deployDate: d.deployDate,
      }));

    res.json({ deployments: userDeployments });
  } catch (err) {
    console.error('Get deployments error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
