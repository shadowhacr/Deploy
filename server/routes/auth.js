import express from 'express';
import { readJSON, writeJSON } from '../utils/fileStore.js';

const router = express.Router();

router.post('/username', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !/^[a-z0-9_]{3,20}$/.test(username)) {
      return res.json({ success: false, error: 'Username must be 3-20 characters, lowercase alphanumeric and underscores only' });
    }

    const data = await readJSON('users.json', { users: [] });
    const existingUser = data.users.find(u => u.username === username);

    if (existingUser) {
      const today = new Date().toISOString().split('T')[0];
      if (existingUser.deploysResetDate !== today) {
        existingUser.deploysToday = 0;
        existingUser.deploysResetDate = today;
        await writeJSON('users.json', data);
      }

      return res.json({
        success: true,
        username,
        isNew: false,
        deploysToday: existingUser.deploysToday,
        credits: existingUser.credits,
        joinDate: existingUser.joinDate,
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const newUser = {
      username,
      deploysToday: 0,
      deploysResetDate: today,
      credits: 0,
      joinDate: new Date().toISOString(),
    };

    data.users.push(newUser);
    await writeJSON('users.json', data);

    res.json({ success: true, username, isNew: true });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const data = await readJSON('users.json', { users: [] });
    const user = data.users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const deployData = await readJSON('deployments.json', { deployments: [] });
    const userDeployments = deployData.deployments.filter(d => d.username === username);

    const today = new Date().toISOString().split('T')[0];
    if (user.deploysResetDate !== today) {
      user.deploysToday = 0;
      user.deploysResetDate = today;
      await writeJSON('users.json', data);
    }

    res.json({
      success: true,
      username: user.username,
      deploysToday: user.deploysToday,
      deploysResetDate: user.deploysResetDate,
      credits: user.credits,
      joinDate: user.joinDate,
      deployments: userDeployments,
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
