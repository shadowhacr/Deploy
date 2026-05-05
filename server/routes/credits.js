import express from 'express';
import { readJSON, writeJSON } from '../utils/fileStore.js';

const router = express.Router();

const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 10, price: 9.99 },
  { id: 'pro', name: 'Pro', credits: 50, price: 29.99 },
  { id: 'enterprise', name: 'Enterprise', credits: -1, price: 0, contact: true },
];

router.get('/packages', async (req, res) => {
  try {
    res.json({ packages: CREDIT_PACKAGES });
  } catch (err) {
    console.error('Packages error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/purchase', async (req, res) => {
  try {
    const { username, package: packageId } = req.body;

    if (!username || !packageId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    if (pkg.contact) {
      return res.json({
        success: true,
        message: 'Please contact admin for Enterprise package',
        contact: true,
      });
    }

    const usersData = await readJSON('users.json', { users: [] });
    const user = usersData.users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.credits += pkg.credits;
    await writeJSON('users.json', usersData);

    const purchasesData = await readJSON('creditPurchases.json', { purchases: [] });
    purchasesData.purchases.push({
      id: `purchase_${Date.now()}`,
      username,
      package: pkg.name,
      credits: pkg.credits,
      amount: pkg.price,
      purchaseDate: new Date().toISOString(),
      status: 'completed',
    });
    await writeJSON('creditPurchases.json', purchasesData);

    res.json({
      success: true,
      creditsAdded: pkg.credits,
      totalCredits: user.credits,
      message: `${pkg.credits} credits added successfully!`,
    });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
