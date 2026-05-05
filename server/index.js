import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedData } from './utils/seedTemplates.js';
import fs from 'fs/promises';

import authRoutes from './routes/auth.js';
import templatesRoutes from './routes/templates.js';
import deployRoutes from './routes/deploy.js';
import creditsRoutes from './routes/credits.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Serve deployed sites
app.use('/sites', express.static(path.join(__dirname, '../public/sites')));

// Serve static template thumbnails
app.use('/templates', express.static(path.join(__dirname, '../public/templates')));

// Serve React app (production build)
app.use(express.static(path.join(__dirname, '../dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Check if data exists, if not seed it
async function initialize() {
  try {
    const dataDir = path.join(__dirname, 'data');
    try {
      await fs.access(path.join(dataDir, 'templates.json'));
      console.log('Data files exist, skipping seed');
    } catch {
      console.log('No data found, seeding...');
      const result = await seedData();
      console.log(`Seeded ${result.templatesCount} templates across ${result.categoriesCount} categories`);
    }
  } catch (err) {
    console.error('Initialization error:', err);
  }
}

initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ShadowDeploy server running on port ${PORT}`);
    console.log(`📁 API: http://localhost:${PORT}/api`);
    console.log(`🌐 App: http://localhost:${PORT}`);
  });
});

export default app;
