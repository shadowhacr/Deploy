import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { readJSON, writeJSON } from '../utils/fileStore.js';

const router = express.Router();

// Public settings
router.get('/', async (req, res) => {
  try {
    const settings = await readJSON('settings.json', {});
    res.json({
      siteTitle: settings.siteTitle || 'ShadowDeploy',
      theme: settings.theme || {
        primaryColor: '#7c3aed',
        secondaryColor: '#06b6d4',
        backgroundColor: '#0a0a0f',
        surfaceColor: '#1a1a25',
      },
      maintenanceMode: settings.maintenanceMode || false,
      maintenanceMessage: settings.maintenanceMessage || 'Website is under maintenance. We\'ll be back soon!',
      contactInfo: settings.contactInfo || {
        whatsapp: '+1234567890',
        telegram: '@shadowadmin',
      },
    });
  } catch (err) {
    console.error('Settings error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin-only settings update
router.put('/', adminAuth, async (req, res) => {
  try {
    const { siteTitle, theme, maintenanceMode, maintenanceMessage, contactInfo } = req.body;
    const settings = await readJSON('settings.json', {});

    if (siteTitle !== undefined) settings.siteTitle = siteTitle;
    if (theme) settings.theme = { ...settings.theme, ...theme };
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (maintenanceMessage !== undefined) settings.maintenanceMessage = maintenanceMessage;
    if (contactInfo) settings.contactInfo = { ...settings.contactInfo, ...contactInfo };

    await writeJSON('settings.json', settings);
    res.json({ success: true });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Change admin password
router.put('/password', adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const settings = await readJSON('settings.json', {});

    const isValid = await comparePassword(currentPassword, settings.adminPasswordHash);
    if (!isValid) {
      return res.json({ success: false, error: 'Current password is incorrect' });
    }

    settings.adminPasswordHash = await hashPassword(newPassword);
    await writeJSON('settings.json', settings);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
