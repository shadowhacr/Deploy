import { writeJSON } from './fileStore.js';
import { hashPassword } from './hash.js';

// Base HTML templates for different categories
const baseTemplates = {
  saas: {
    name: 'SaaS Landing',
    html: `<header class="hero">
  <nav class="navbar">
    <div class="logo">{{brandName}}</div>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#contact">Contact</a>
    </div>
    <button class="btn-primary">{{ctaText}}</button>
  </nav>
  <div class="hero-content">
    <h1>{{title}}</h1>
    <p class="subtitle">{{subtitle}}</p>
    <div class="hero-buttons">
      <button class="btn-primary btn-lg">{{primaryButton}}</button>
      <button class="btn-secondary btn-lg">{{secondaryButton}}</button>
    </div>
    <img src="{{heroImage}}" alt="Hero" class="hero-img">
  </div>
</header>
<section id="features" class="features">
  <h2>{{featuresTitle}}</h2>
  <div class="feature-grid">
    <div class="feature-card">
      <div class="feature-icon">{{feature1Icon}}</div>
      <h3>{{feature1Title}}</h3>
      <p>{{feature1Desc}}</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">{{feature2Icon}}</div>
      <h3>{{feature2Title}}</h3>
      <p>{{feature2Desc}}</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">{{feature3Icon}}</div>
      <h3>{{feature3Title}}</h3>
      <p>{{feature3Desc}}</p>
    </div>
  </div>
</section>
<section class="cta-section">
  <h2>{{ctaTitle}}</h2>
  <p>{{ctaSubtitle}}</p>
  <button class="btn-primary btn-lg">{{ctaButton}}</button>
</section>
<footer class="footer">
  <p>{{footerText}}</p>
</footer>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: {{backgroundColor}}; color: {{textColor}}; }
.hero { background: linear-gradient(135deg, {{primaryColor}}, {{secondaryColor}}); min-height: 100vh; color: white; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; }
.logo { font-size: 1.5rem; font-weight: 800; }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { color: white; text-decoration: none; opacity: 0.9; transition: opacity 0.3s; }
.nav-links a:hover { opacity: 1; }
.btn-primary { background: white; color: {{primaryColor}}; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.3s; }
.btn-primary:hover { transform: translateY(-2px); }
.btn-secondary { background: transparent; color: white; border: 2px solid white; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-lg { padding: 1rem 2rem; font-size: 1.1rem; }
.hero-content { text-align: center; padding: 4rem 5% 6rem; max-width: 900px; margin: 0 auto; }
.hero-content h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.1; }
.subtitle { font-size: 1.25rem; opacity: 0.95; margin-bottom: 2rem; }
.hero-buttons { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; }
.hero-img { width: 100%; max-width: 800px; border-radius: 12px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
.features { padding: 5rem 5%; max-width: 1200px; margin: 0 auto; }
.features h2 { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; }
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.feature-card { background: {{cardBg}}; padding: 2rem; border-radius: 12px; text-align: center; transition: transform 0.3s; }
.feature-card:hover { transform: translateY(-5px); }
.feature-icon { font-size: 3rem; margin-bottom: 1rem; }
.cta-section { text-align: center; padding: 5rem 5%; background: {{cardBg}}; }
.cta-section h2 { font-size: 2.5rem; margin-bottom: 1rem; }
.footer { text-align: center; padding: 2rem; background: {{backgroundColor}}; opacity: 0.7; }
@media (max-width: 768px) { .hero-content h1 { font-size: 2.2rem; } .nav-links { display: none; } }`,
    fields: [
      { id: 'title', label: 'Hero Title', type: 'text', default: 'Build Faster with Our SaaS' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', default: 'The all-in-one platform for modern teams' },
      { id: 'brandName', label: 'Brand Name', type: 'text', default: 'SaaSify' },
      { id: 'ctaText', label: 'Nav CTA', type: 'text', default: 'Get Started' },
      { id: 'primaryButton', label: 'Primary Button', type: 'text', default: 'Start Free Trial' },
      { id: 'secondaryButton', label: 'Secondary Button', type: 'text', default: 'Watch Demo' },
      { id: 'heroImage', label: 'Hero Image', type: 'image', default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' },
      { id: 'featuresTitle', label: 'Features Title', type: 'text', default: 'Why Choose Us' },
      { id: 'feature1Icon', label: 'Feature 1 Icon', type: 'text', default: '⚡' },
      { id: 'feature1Title', label: 'Feature 1 Title', type: 'text', default: 'Lightning Fast' },
      { id: 'feature1Desc', label: 'Feature 1 Desc', type: 'text', default: 'Optimized for speed and performance' },
      { id: 'feature2Icon', label: 'Feature 2 Icon', type: 'text', default: '🔒' },
      { id: 'feature2Title', label: 'Feature 2 Title', type: 'text', default: 'Enterprise Security' },
      { id: 'feature2Desc', label: 'Feature 2 Desc', type: 'text', default: 'Bank-grade encryption and compliance' },
      { id: 'feature3Icon', label: 'Feature 3 Icon', type: 'text', default: '📊' },
      { id: 'feature3Title', label: 'Feature 3 Title', type: 'text', default: 'Advanced Analytics' },
      { id: 'feature3Desc', label: 'Feature 3 Desc', type: 'text', default: 'Real-time insights and reporting' },
      { id: 'ctaTitle', label: 'CTA Title', type: 'text', default: 'Ready to Get Started?' },
      { id: 'ctaSubtitle', label: 'CTA Subtitle', type: 'text', default: 'Join thousands of satisfied customers' },
      { id: 'ctaButton', label: 'CTA Button', type: 'text', default: 'Start Your Free Trial' },
      { id: 'footerText', label: 'Footer Text', type: 'text', default: '© 2025 SaaSify. All rights reserved.' },
      { id: 'primaryColor', label: 'Primary Color', type: 'color', default: '#7c3aed' },
      { id: 'secondaryColor', label: 'Secondary Color', type: 'color', default: '#06b6d4' },
      { id: 'backgroundColor', label: 'Background', type: 'color', default: '#0f172a' },
      { id: 'textColor', label: 'Text Color', type: 'color', default: '#f8fafc' },
      { id: 'cardBg', label: 'Card Background', type: 'color', default: '#1e293b' },
    ]
  },
  portfolio: {
    name: 'Creative Portfolio',
    html: `<div class="portfolio">
  <aside class="sidebar">
    <div class="profile">
      <img src="{{profileImage}}" alt="{{name}}" class="profile-img">
      <h1>{{name}}</h1>
      <p class="tagline">{{tagline}}</p>
      <div class="social-links">
        <a href="{{twitter}}">𝕏</a>
        <a href="{{linkedin}}">in</a>
        <a href="{{github}}">GH</a>
      </div>
    </div>
    <nav class="side-nav">
      <a href="#about">About</a>
      <a href="#work">Work</a>
      <a href="#contact">Contact</a>
    </nav>
  </aside>
  <main class="main-content">
    <section id="about" class="about">
      <h2>{{aboutTitle}}</h2>
      <p>{{aboutText}}</p>
      <div class="skills">
        <span class="skill">{{skill1}}</span>
        <span class="skill">{{skill2}}</span>
        <span class="skill">{{skill3}}</span>
        <span class="skill">{{skill4}}</span>
      </div>
    </section>
    <section id="work" class="work">
      <h2>{{workTitle}}</h2>
      <div class="project-grid">
        <div class="project-card">
          <img src="{{project1Image}}" alt="{{project1Title}}">
          <h3>{{project1Title}}</h3>
          <p>{{project1Desc}}</p>
        </div>
        <div class="project-card">
          <img src="{{project2Image}}" alt="{{project2Title}}">
          <h3>{{project2Title}}</h3>
          <p>{{project2Desc}}</p>
        </div>
        <div class="project-card">
          <img src="{{project3Image}}" alt="{{project3Title}}">
          <h3>{{project3Title}}</h3>
          <p>{{project3Desc}}</p>
        </div>
      </div>
    </section>
    <section id="contact" class="contact">
      <h2>{{contactTitle}}</h2>
      <p>{{contactText}}</p>
      <a href="mailto:{{email}}" class="btn-primary">{{emailButton}}</a>
    </section>
  </main>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: {{backgroundColor}}; color: {{textColor}}; }
.portfolio { display: flex; min-height: 100vh; }
.sidebar { width: 320px; background: {{sidebarBg}}; padding: 3rem 2rem; position: fixed; height: 100vh; overflow-y: auto; }
.profile { text-align: center; margin-bottom: 2rem; }
.profile-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 3px solid {{primaryColor}}; }
.profile h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.tagline { color: {{accentColor}}; font-size: 0.9rem; }
.social-links { display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; }
.social-links a { color: {{textColor}}; text-decoration: none; font-weight: 600; transition: color 0.3s; }
.social-links a:hover { color: {{primaryColor}}; }
.side-nav { display: flex; flex-direction: column; gap: 0.5rem; }
.side-nav a { padding: 0.75rem 1rem; color: {{textColor}}; text-decoration: none; border-radius: 8px; transition: all 0.3s; }
.side-nav a:hover { background: {{primaryColor}}20; color: {{primaryColor}}; }
.main-content { margin-left: 320px; flex: 1; padding: 3rem 5%; }
.about h2, .work h2, .contact h2 { font-size: 2rem; margin-bottom: 1rem; }
.about p { line-height: 1.8; margin-bottom: 1.5rem; max-width: 600px; }
.skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill { background: {{primaryColor}}20; color: {{primaryColor}}; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
.work { margin-top: 3rem; }
.project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.project-card { background: {{cardBg}}; border-radius: 12px; overflow: hidden; transition: transform 0.3s; }
.project-card:hover { transform: translateY(-5px); }
.project-card img { width: 100%; height: 200px; object-fit: cover; }
.project-card h3 { padding: 1rem 1rem 0.5rem; }
.project-card p { padding: 0 1rem 1rem; opacity: 0.8; font-size: 0.9rem; }
.contact { margin-top: 3rem; text-align: center; padding: 3rem; background: {{cardBg}}; border-radius: 12px; }
.btn-primary { display: inline-block; background: {{primaryColor}}; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 1rem; transition: transform 0.3s; }
.btn-primary:hover { transform: translateY(-2px); }
@media (max-width: 768px) { .sidebar { width: 100%; position: relative; height: auto; } .main-content { margin-left: 0; } .portfolio { flex-direction: column; } }`,
    fields: [
      { id: 'name', label: 'Your Name', type: 'text', default: 'Alex Designer' },
      { id: 'tagline', label: 'Tagline', type: 'text', default: 'Creative Developer & UI Designer' },
      { id: 'profileImage', label: 'Profile Photo', type: 'image', default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { id: 'twitter', label: 'Twitter/X URL', type: 'text', default: '#' },
      { id: 'linkedin', label: 'LinkedIn URL', type: 'text', default: '#' },
      { id: 'github', label: 'GitHub URL', type: 'text', default: '#' },
      { id: 'aboutTitle', label: 'About Title', type: 'text', default: 'About Me' },
      { id: 'aboutText', label: 'About Text', type: 'text', default: 'Passionate designer and developer creating beautiful digital experiences.' },
      { id: 'skill1', label: 'Skill 1', type: 'text', default: 'React' },
      { id: 'skill2', label: 'Skill 2', type: 'text', default: 'UI Design' },
      { id: 'skill3', label: 'Skill 3', type: 'text', default: 'TypeScript' },
      { id: 'skill4', label: 'Skill 4', type: 'text', default: 'Node.js' },
      { id: 'workTitle', label: 'Work Title', type: 'text', default: 'Selected Work' },
      { id: 'project1Title', label: 'Project 1 Title', type: 'text', default: 'E-Commerce App' },
      { id: 'project1Desc', label: 'Project 1 Desc', type: 'text', default: 'Full-stack shopping platform' },
      { id: 'project1Image', label: 'Project 1 Image', type: 'image', default: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600' },
      { id: 'project2Title', label: 'Project 2 Title', type: 'text', default: 'Dashboard UI' },
      { id: 'project2Desc', label: 'Project 2 Desc', type: 'text', default: 'Analytics dashboard design' },
      { id: 'project2Image', label: 'Project 2 Image', type: 'image', default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600' },
      { id: 'project3Title', label: 'Project 3 Title', type: 'text', default: 'Mobile App' },
      { id: 'project3Desc', label: 'Project 3 Desc', type: 'text', default: 'Fitness tracking application' },
      { id: 'project3Image', label: 'Project 3 Image', type: 'image', default: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600' },
      { id: 'contactTitle', label: 'Contact Title', type: 'text', default: "Let's Work Together" },
      { id: 'contactText', label: 'Contact Text', type: 'text', default: "Have a project in mind? Let's discuss!" },
      { id: 'email', label: 'Email', type: 'text', default: 'hello@example.com' },
      { id: 'emailButton', label: 'Email Button', type: 'text', default: 'Send Email' },
      { id: 'primaryColor', label: 'Primary Color', type: 'color', default: '#7c3aed' },
      { id: 'backgroundColor', label: 'Background', type: 'color', default: '#0a0a0f' },
      { id: 'textColor', label: 'Text Color', type: 'color', default: '#f8fafc' },
      { id: 'sidebarBg', label: 'Sidebar BG', type: 'color', default: '#12121a' },
      { id: 'cardBg', label: 'Card BG', type: 'color', default: '#1a1a25' },
      { id: 'accentColor', label: 'Accent Color', type: 'color', default: '#06b6d4' },
    ]
  },
  business: {
    name: 'Business Corporate',
    html: `<header class="biz-header">
  <div class="header-top">
    <div class="logo">{{companyName}}</div>
    <div class="contact-info">
      <span>📞 {{phone}}</span>
      <span>✉️ {{email}}</span>
    </div>
  </div>
  <nav class="main-nav">
    <a href="#home">Home</a>
    <a href="#services">Services</a>
    <a href="#about">About</a>
    <a href="#testimonials">Testimonials</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
<section id="home" class="biz-hero">
  <div class="hero-text">
    <h1>{{headline}}</h1>
    <p>{{subheadline}}</p>
    <button class="btn-cta">{{ctaButton}}</button>
  </div>
  <img src="{{heroImage}}" alt="Business" class="hero-img">
</section>
<section id="services" class="services">
  <h2>{{servicesTitle}}</h2>
  <div class="service-cards">
    <div class="svc-card">
      <div class="svc-icon">{{svc1Icon}}</div>
      <h3>{{svc1Title}}</h3>
      <p>{{svc1Desc}}</p>
    </div>
    <div class="svc-card">
      <div class="svc-icon">{{svc2Icon}}</div>
      <h3>{{svc2Title}}</h3>
      <p>{{svc2Desc}}</p>
    </div>
    <div class="svc-card">
      <div class="svc-icon">{{svc3Icon}}</div>
      <h3>{{svc3Title}}</h3>
      <p>{{svc3Desc}}</p>
    </div>
    <div class="svc-card">
      <div class="svc-icon">{{svc4Icon}}</div>
      <h3>{{svc4Title}}</h3>
      <p>{{svc4Desc}}</p>
    </div>
  </div>
</section>
<section id="about" class="about-biz">
  <div class="about-content">
    <h2>{{aboutTitle}}</h2>
    <p>{{aboutText}}</p>
    <div class="stats">
      <div class="stat"><strong>{{stat1Number}}</strong>{{stat1Label}}</div>
      <div class="stat"><strong>{{stat2Number}}</strong>{{stat2Label}}</div>
      <div class="stat"><strong>{{stat3Number}}</strong>{{stat3Label}}</div>
    </div>
  </div>
</section>
<section id="testimonials" class="testimonials">
  <h2>{{testimonialsTitle}}</h2>
  <div class="testi-grid">
    <div class="testi-card">
      <p>"{{testi1Text}}"</p>
      <strong>- {{testi1Name}}</strong>
    </div>
    <div class="testi-card">
      <p>"{{testi2Text}}"</p>
      <strong>- {{testi2Name}}</strong>
    </div>
  </div>
</section>
<footer class="biz-footer">
  <p>{{footerText}}</p>
</footer>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: {{backgroundColor}}; color: {{textColor}}; }
.biz-header { background: {{headerBg}}; }
.header-top { display: flex; justify-content: space-between; align-items: center; padding: 1rem 5%; border-bottom: 1px solid {{borderColor}}; }
.logo { font-size: 1.5rem; font-weight: 800; color: {{primaryColor}}; }
.contact-info { display: flex; gap: 1.5rem; font-size: 0.9rem; }
.main-nav { display: flex; gap: 2rem; padding: 1rem 5%; }
.main-nav a { color: {{textColor}}; text-decoration: none; font-weight: 500; transition: color 0.3s; }
.main-nav a:hover { color: {{primaryColor}}; }
.biz-hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 4rem 5%; gap: 3rem; max-width: 1200px; margin: 0 auto; }
.hero-text h1 { font-size: 3rem; margin-bottom: 1rem; line-height: 1.1; }
.hero-text p { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9; }
.btn-cta { background: {{primaryColor}}; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.3s; }
.btn-cta:hover { transform: translateY(-3px); }
.hero-img { width: 100%; border-radius: 12px; }
.services { padding: 4rem 5%; max-width: 1200px; margin: 0 auto; }
.services h2 { text-align: center; font-size: 2.5rem; margin-bottom: 2rem; }
.service-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
.svc-card { background: {{cardBg}}; padding: 2rem; border-radius: 12px; text-align: center; border: 1px solid {{borderColor}}; transition: all 0.3s; }
.svc-card:hover { border-color: {{primaryColor}}; transform: translateY(-5px); }
.svc-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.about-biz { background: {{cardBg}}; padding: 4rem 5%; }
.about-content { max-width: 800px; margin: 0 auto; text-align: center; }
.about-content h2 { font-size: 2rem; margin-bottom: 1rem; }
.about-content p { margin-bottom: 2rem; line-height: 1.8; }
.stats { display: flex; justify-content: center; gap: 3rem; }
.stat { text-align: center; }
.stat strong { display: block; font-size: 2.5rem; color: {{primaryColor}}; }
.testimonials { padding: 4rem 5%; max-width: 1200px; margin: 0 auto; }
.testimonials h2 { text-align: center; font-size: 2.5rem; margin-bottom: 2rem; }
.testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.testi-card { background: {{cardBg}}; padding: 2rem; border-radius: 12px; border-left: 4px solid {{primaryColor}}; }
.testi-card p { font-style: italic; margin-bottom: 1rem; }
.biz-footer { text-align: center; padding: 2rem; background: {{headerBg}}; border-top: 1px solid {{borderColor}}; }
@media (max-width: 768px) { .biz-hero { grid-template-columns: 1fr; } .stats { flex-direction: column; gap: 1rem; } .contact-info { display: none; } }`,
    fields: [
      { id: 'companyName', label: 'Company Name', type: 'text', default: 'Apex Solutions' },
      { id: 'phone', label: 'Phone', type: 'text', default: '+1 (555) 123-4567' },
      { id: 'email', label: 'Email', type: 'text', default: 'info@apexsolutions.com' },
      { id: 'headline', label: 'Headline', type: 'text', default: 'Growing Your Business' },
      { id: 'subheadline', label: 'Subheadline', type: 'text', default: 'Professional solutions tailored to your needs' },
      { id: 'ctaButton', label: 'CTA Button', type: 'text', default: 'Get a Quote' },
      { id: 'heroImage', label: 'Hero Image', type: 'image', default: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800' },
      { id: 'servicesTitle', label: 'Services Title', type: 'text', default: 'Our Services' },
      { id: 'svc1Icon', label: 'Service 1 Icon', type: 'text', default: '💼' },
      { id: 'svc1Title', label: 'Service 1', type: 'text', default: 'Consulting' },
      { id: 'svc1Desc', label: 'Service 1 Desc', type: 'text', default: 'Strategic business advice' },
      { id: 'svc2Icon', label: 'Service 2 Icon', type: 'text', default: '📈' },
      { id: 'svc2Title', label: 'Service 2', type: 'text', default: 'Marketing' },
      { id: 'svc2Desc', label: 'Service 2 Desc', type: 'text', default: 'Digital growth strategies' },
      { id: 'svc3Icon', label: 'Service 3 Icon', type: 'text', default: '💻' },
      { id: 'svc3Title', label: 'Service 3', type: 'text', default: 'Development' },
      { id: 'svc3Desc', label: 'Service 3 Desc', type: 'text', default: 'Custom software solutions' },
      { id: 'svc4Icon', label: 'Service 4 Icon', type: 'text', default: '🎨' },
      { id: 'svc4Title', label: 'Service 4', type: 'text', default: 'Design' },
      { id: 'svc4Desc', label: 'Service 4 Desc', type: 'text', default: 'Brand identity creation' },
      { id: 'aboutTitle', label: 'About Title', type: 'text', default: 'About Our Company' },
      { id: 'aboutText', label: 'About Text', type: 'text', default: 'We are a team of professionals dedicated to helping businesses grow.' },
      { id: 'stat1Number', label: 'Stat 1 Number', type: 'text', default: '500+' },
      { id: 'stat1Label', label: 'Stat 1 Label', type: 'text', default: 'Clients' },
      { id: 'stat2Number', label: 'Stat 2 Number', type: 'text', default: '10+' },
      { id: 'stat2Label', label: 'Stat 2 Label', type: 'text', default: 'Years' },
      { id: 'stat3Number', label: 'Stat 3 Number', type: 'text', default: '50+' },
      { id: 'stat3Label', label: 'Stat 3 Label', type: 'text', default: 'Experts' },
      { id: 'testimonialsTitle', label: 'Testimonials Title', type: 'text', default: 'What Clients Say' },
      { id: 'testi1Text', label: 'Testimonial 1', type: 'text', default: 'Excellent service and outstanding results!' },
      { id: 'testi1Name', label: 'Testimonial 1 Name', type: 'text', default: 'Sarah Johnson' },
      { id: 'testi2Text', label: 'Testimonial 2', type: 'text', default: 'They transformed our business completely.' },
      { id: 'testi2Name', label: 'Testimonial 2 Name', type: 'text', default: 'Mike Chen' },
      { id: 'footerText', label: 'Footer', type: 'text', default: '© 2025 Apex Solutions. All rights reserved.' },
      { id: 'primaryColor', label: 'Primary Color', type: 'color', default: '#2563eb' },
      { id: 'backgroundColor', label: 'Background', type: 'color', default: '#ffffff' },
      { id: 'textColor', label: 'Text Color', type: 'color', default: '#1e293b' },
      { id: 'headerBg', label: 'Header BG', type: 'color', default: '#f8fafc' },
      { id: 'cardBg', label: 'Card BG', type: 'color', default: '#f1f5f9' },
      { id: 'borderColor', label: 'Border Color', type: 'color', default: '#e2e8f0' },
    ]
  },
  ecommerce: {
    name: 'E-Commerce Store',
    html: `<div class="store">
  <header class="store-header">
    <div class="store-brand">{{storeName}}</div>
    <div class="store-search">
      <input type="text" placeholder="Search products...">
    </div>
    <div class="store-actions">
      <button class="cart-btn">🛒 {{cartText}}</button>
    </div>
  </header>
  <div class="store-hero">
    <img src="{{bannerImage}}" alt="Banner" class="banner-img">
    <div class="banner-text">
      <h1>{{bannerTitle}}</h1>
      <p>{{bannerSubtitle}}</p>
      <button class="shop-btn">{{shopButton}}</button>
    </div>
  </div>
  <section class="products-section">
    <h2>{{productsTitle}}</h2>
    <div class="products-grid">
      <div class="product-card">
        <img src="{{product1Image}}" alt="{{product1Name}}">
        <h3>{{product1Name}}</h3>
        <p class="price">{{product1Price}}</p>
        <button class="add-cart">{{addToCart}}</button>
      </div>
      <div class="product-card">
        <img src="{{product2Image}}" alt="{{product2Name}}">
        <h3>{{product2Name}}</h3>
        <p class="price">{{product2Price}}</p>
        <button class="add-cart">{{addToCart}}</button>
      </div>
      <div class="product-card">
        <img src="{{product3Image}}" alt="{{product3Name}}">
        <h3>{{product3Name}}</h3>
        <p class="price">{{product3Price}}</p>
        <button class="add-cart">{{addToCart}}</button>
      </div>
      <div class="product-card">
        <img src="{{product4Image}}" alt="{{product4Name}}">
        <h3>{{product4Name}}</h3>
        <p class="price">{{product4Price}}</p>
        <button class="add-cart">{{addToCart}}</button>
      </div>
    </div>
  </section>
  <section class="features-bar">
    <div class="feat">{{feat1Icon}} {{feat1Text}}</div>
    <div class="feat">{{feat2Icon}} {{feat2Text}}</div>
    <div class="feat">{{feat3Icon}} {{feat3Text}}</div>
    <div class="feat">{{feat4Icon}} {{feat4Text}}</div>
  </section>
  <footer class="store-footer">
    <p>{{footerText}}</p>
  </footer>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: {{backgroundColor}}; color: {{textColor}}; }
.store-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 5%; background: {{headerBg}}; border-bottom: 1px solid {{borderColor}}; }
.store-brand { font-size: 1.5rem; font-weight: 800; color: {{primaryColor}}; }
.store-search input { padding: 0.5rem 1rem; border: 1px solid {{borderColor}}; border-radius: 20px; width: 250px; }
.cart-btn { background: {{primaryColor}}; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
.store-hero { position: relative; }
.banner-img { width: 100%; height: 400px; object-fit: cover; }
.banner-text { position: absolute; top: 50%; left: 5%; transform: translateY(-50%); color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
.banner-text h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.shop-btn { background: {{accentColor}}; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 600; margin-top: 1rem; cursor: pointer; }
.products-section { padding: 3rem 5%; max-width: 1200px; margin: 0 auto; }
.products-section h2 { text-align: center; font-size: 2rem; margin-bottom: 2rem; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
.product-card { background: {{cardBg}}; border-radius: 12px; overflow: hidden; border: 1px solid {{borderColor}}; transition: transform 0.3s; }
.product-card:hover { transform: translateY(-5px); }
.product-card img { width: 100%; height: 200px; object-fit: cover; }
.product-card h3 { padding: 1rem 1rem 0.5rem; font-size: 1rem; }
.price { padding: 0 1rem; color: {{primaryColor}}; font-size: 1.25rem; font-weight: 700; }
.add-cart { width: calc(100% - 2rem); margin: 0.5rem 1rem 1rem; padding: 0.75rem; background: {{primaryColor}}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
.features-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 2rem 5%; background: {{headerBg}}; text-align: center; }
.feat { font-size: 0.9rem; }
.store-footer { text-align: center; padding: 2rem; background: {{headerBg}}; border-top: 1px solid {{borderColor}}; }
@media (max-width: 768px) { .features-bar { grid-template-columns: repeat(2, 1fr); } .store-search { display: none; } .banner-text h1 { font-size: 2rem; } }`,
    fields: [
      { id: 'storeName', label: 'Store Name', type: 'text', default: 'ShopHub' },
      { id: 'cartText', label: 'Cart Text', type: 'text', default: 'Cart' },
      { id: 'bannerImage', label: 'Banner Image', type: 'image', default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200' },
      { id: 'bannerTitle', label: 'Banner Title', type: 'text', default: 'Summer Collection' },
      { id: 'bannerSubtitle', label: 'Banner Subtitle', type: 'text', default: 'Up to 50% off on selected items' },
      { id: 'shopButton', label: 'Shop Button', type: 'text', default: 'Shop Now' },
      { id: 'productsTitle', label: 'Products Title', type: 'text', default: 'Featured Products' },
      { id: 'product1Name', label: 'Product 1', type: 'text', default: 'Wireless Headphones' },
      { id: 'product1Price', label: 'Product 1 Price', type: 'text', default: '$79.99' },
      { id: 'product1Image', label: 'Product 1 Image', type: 'image', default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
      { id: 'product2Name', label: 'Product 2', type: 'text', default: 'Smart Watch' },
      { id: 'product2Price', label: 'Product 2 Price', type: 'text', default: '$199.99' },
      { id: 'product2Image', label: 'Product 2 Image', type: 'image', default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
      { id: 'product3Name', label: 'Product 3', type: 'text', default: 'Running Shoes' },
      { id: 'product3Price', label: 'Product 3 Price', type: 'text', default: '$129.99' },
      { id: 'product3Image', label: 'Product 3 Image', type: 'image', default: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
      { id: 'product4Name', label: 'Product 4', type: 'text', default: 'Backpack' },
      { id: 'product4Price', label: 'Product 4 Price', type: 'text', default: '$59.99' },
      { id: 'product4Image', label: 'Product 4 Image', type: 'image', default: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
      { id: 'addToCart', label: 'Add to Cart Text', type: 'text', default: 'Add to Cart' },
      { id: 'feat1Icon', label: 'Feature 1', type: 'text', default: '🚚' },
      { id: 'feat1Text', label: 'Feature 1 Text', type: 'text', default: 'Free Shipping' },
      { id: 'feat2Icon', label: 'Feature 2', type: 'text', default: '↩️' },
      { id: 'feat2Text', label: 'Feature 2 Text', type: 'text', default: 'Easy Returns' },
      { id: 'feat3Icon', label: 'Feature 3', type: 'text', default: '🔒' },
      { id: 'feat3Text', label: 'Feature 3 Text', type: 'text', default: 'Secure Payment' },
      { id: 'feat4Icon', label: 'Feature 4', type: 'text', default: '⭐' },
      { id: 'feat4Text', label: 'Feature 4 Text', type: 'text', default: 'Top Rated' },
      { id: 'footerText', label: 'Footer', type: 'text', default: '© 2025 ShopHub. All rights reserved.' },
      { id: 'primaryColor', label: 'Primary Color', type: 'color', default: '#7c3aed' },
      { id: 'accentColor', label: 'Accent Color', type: 'color', default: '#f59e0b' },
      { id: 'backgroundColor', label: 'Background', type: 'color', default: '#ffffff' },
      { id: 'textColor', label: 'Text Color', type: 'color', default: '#1e293b' },
      { id: 'headerBg', label: 'Header BG', type: 'color', default: '#f8fafc' },
      { id: 'cardBg', label: 'Card BG', type: 'color', default: '#ffffff' },
      { id: 'borderColor', label: 'Border Color', type: 'color', default: '#e2e8f0' },
    ]
  },
  blog: {
    name: 'Modern Blog',
    html: `<div class="blog">
  <nav class="blog-nav">
    <div class="blog-logo">{{blogName}}</div>
    <div class="nav-links">
      <a href="#">Home</a>
      <a href="#">{{category1}}</a>
      <a href="#">{{category2}}</a>
      <a href="#">{{category3}}</a>
      <a href="#">About</a>
    </div>
  </nav>
  <header class="blog-hero">
    <h1>{{heroTitle}}</h1>
    <p>{{heroSubtitle}}</p>
  </header>
  <main class="blog-main">
    <article class="featured-post">
      <img src="{{featuredImage}}" alt="{{featuredTitle}}">
      <div class="post-content">
        <span class="post-tag">{{featuredTag}}</span>
        <h2>{{featuredTitle}}</h2>
        <p>{{featuredExcerpt}}</p>
        <a href="#" class="read-more">{{readMore}} →</a>
      </div>
    </article>
    <div class="posts-grid">
      <article class="post-card">
        <img src="{{post1Image}}" alt="{{post1Title}}">
        <span class="post-tag">{{post1Tag}}</span>
        <h3>{{post1Title}}</h3>
        <p>{{post1Excerpt}}</p>
      </article>
      <article class="post-card">
        <img src="{{post2Image}}" alt="{{post2Title}}">
        <span class="post-tag">{{post2Tag}}</span>
        <h3>{{post2Title}}</h3>
        <p>{{post2Excerpt}}</p>
      </article>
      <article class="post-card">
        <img src="{{post3Image}}" alt="{{post3Title}}">
        <span class="post-tag">{{post3Tag}}</span>
        <h3>{{post3Title}}</h3>
        <p>{{post3Excerpt}}</p>
      </article>
    </div>
    <section class="newsletter">
      <h2>{{newsletterTitle}}</h2>
      <p>{{newsletterText}}</p>
      <div class="subscribe-form">
        <input type="email" placeholder="{{emailPlaceholder}}">
        <button>{{subscribeButton}}</button>
      </div>
    </section>
  </main>
  <footer class="blog-footer">
    <p>{{footerText}}</p>
  </footer>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: {{backgroundColor}}; color: {{textColor}}; }
.blog-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; max-width: 1200px; margin: 0 auto; }
.blog-logo { font-size: 1.5rem; font-weight: 800; color: {{primaryColor}}; }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { color: {{textColor}}; text-decoration: none; font-weight: 500; transition: color 0.3s; }
.nav-links a:hover { color: {{primaryColor}}; }
.blog-hero { text-align: center; padding: 3rem 5% 2rem; max-width: 800px; margin: 0 auto; }
.blog-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.blog-hero p { font-size: 1.1rem; opacity: 0.8; }
.blog-main { max-width: 1200px; margin: 0 auto; padding: 2rem 5%; }
.featured-post { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem; background: {{cardBg}}; border-radius: 12px; overflow: hidden; }
.featured-post img { width: 100%; height: 100%; object-fit: cover; min-height: 300px; }
.post-content { padding: 2rem; display: flex; flex-direction: column; justify-content: center; }
.post-tag { display: inline-block; background: {{primaryColor}}20; color: {{primaryColor}}; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; width: fit-content; }
.post-content h2 { font-size: 1.8rem; margin-bottom: 1rem; }
.read-more { color: {{primaryColor}}; text-decoration: none; font-weight: 600; margin-top: 1rem; }
.posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
.post-card { background: {{cardBg}}; border-radius: 12px; overflow: hidden; border: 1px solid {{borderColor}}; transition: transform 0.3s; }
.post-card:hover { transform: translateY(-5px); }
.post-card img { width: 100%; height: 180px; object-fit: cover; }
.post-card .post-tag { margin: 1rem 1rem 0.5rem; }
.post-card h3 { padding: 0 1rem 0.5rem; font-size: 1.1rem; }
.post-card p { padding: 0 1rem 1rem; font-size: 0.9rem; opacity: 0.8; }
.newsletter { text-align: center; padding: 3rem; background: {{primaryColor}}10; border-radius: 12px; }
.newsletter h2 { margin-bottom: 0.5rem; }
.subscribe-form { display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; max-width: 500px; margin-left: auto; margin-right: auto; }
.subscribe-form input { flex: 1; padding: 0.75rem 1rem; border: 1px solid {{borderColor}}; border-radius: 8px; }
.subscribe-form button { padding: 0.75rem 1.5rem; background: {{primaryColor}}; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
.blog-footer { text-align: center; padding: 2rem; border-top: 1px solid {{borderColor}}; margin-top: 2rem; }
@media (max-width: 768px) { .featured-post { grid-template-columns: 1fr; } .nav-links { display: none; } }`,
    fields: [
      { id: 'blogName', label: 'Blog Name', type: 'text', default: 'The Digital Journal' },
      { id: 'category1', label: 'Category 1', type: 'text', default: 'Technology' },
      { id: 'category2', label: 'Category 2', type: 'text', default: 'Design' },
      { id: 'category3', label: 'Category 3', type: 'text', default: 'Lifestyle' },
      { id: 'heroTitle', label: 'Hero Title', type: 'text', default: 'Stories That Matter' },
      { id: 'heroSubtitle', label: 'Hero Subtitle', type: 'text', default: 'Insights on technology, design, and modern living' },
      { id: 'featuredImage', label: 'Featured Image', type: 'image', default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800' },
      { id: 'featuredTag', label: 'Featured Tag', type: 'text', default: 'Featured' },
      { id: 'featuredTitle', label: 'Featured Title', type: 'text', default: 'The Future of Web Development' },
      { id: 'featuredExcerpt', label: 'Featured Excerpt', type: 'text', default: 'Exploring the latest trends shaping how we build for the web.' },
      { id: 'readMore', label: 'Read More Text', type: 'text', default: 'Read Article' },
      { id: 'post1Tag', label: 'Post 1 Tag', type: 'text', default: 'Technology' },
      { id: 'post1Title', label: 'Post 1 Title', type: 'text', default: 'AI in Everyday Life' },
      { id: 'post1Excerpt', label: 'Post 1 Excerpt', type: 'text', default: 'How artificial intelligence is changing our daily routines.' },
      { id: 'post1Image', label: 'Post 1 Image', type: 'image', default: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600' },
      { id: 'post2Tag', label: 'Post 2 Tag', type: 'text', default: 'Design' },
      { id: 'post2Title', label: 'Post 2 Title', type: 'text', default: 'Minimalist Design Trends' },
      { id: 'post2Excerpt', label: 'Post 2 Excerpt', type: 'text', default: 'Less is more: embracing simplicity in modern design.' },
      { id: 'post2Image', label: 'Post 2 Image', type: 'image', default: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600' },
      { id: 'post3Tag', label: 'Post 3 Tag', type: 'text', default: 'Lifestyle' },
      { id: 'post3Title', label: 'Post 3 Title', type: 'text', default: 'Digital Wellness' },
      { id: 'post3Excerpt', label: 'Post 3 Excerpt', type: 'text', default: 'Finding balance in our always-connected world.' },
      { id: 'post3Image', label: 'Post 3 Image', type: 'image', default: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600' },
      { id: 'newsletterTitle', label: 'Newsletter Title', type: 'text', default: 'Subscribe to Our Newsletter' },
      { id: 'newsletterText', label: 'Newsletter Text', type: 'text', default: 'Get the latest posts delivered to your inbox.' },
      { id: 'emailPlaceholder', label: 'Email Placeholder', type: 'text', default: 'Enter your email' },
      { id: 'subscribeButton', label: 'Subscribe Button', type: 'text', default: 'Subscribe' },
      { id: 'footerText', label: 'Footer', type: 'text', default: '© 2025 The Digital Journal. All rights reserved.' },
      { id: 'primaryColor', label: 'Primary Color', type: 'color', default: '#7c3aed' },
      { id: 'backgroundColor', label: 'Background', type: 'color', default: '#fafafa' },
      { id: 'textColor', label: 'Text Color', type: 'color', default: '#1e293b' },
      { id: 'cardBg', label: 'Card BG', type: 'color', default: '#ffffff' },
      { id: 'borderColor', label: 'Border Color', type: 'color', default: '#e2e8f0' },
    ]
  }
};

const additionalCategories = [
  { category: 'Landing Page', base: 'saas', variants: 80 },
  { category: 'Startup', base: 'saas', variants: 60 },
  { category: 'Agency', base: 'business', variants: 50 },
  { category: 'Restaurant', base: 'business', variants: 40 },
  { category: 'Real Estate', base: 'business', variants: 40 },
  { category: 'Education', base: 'business', variants: 35 },
  { category: 'Healthcare', base: 'business', variants: 30 },
  { category: 'Fitness', base: 'business', variants: 35 },
  { category: 'Photography', base: 'portfolio', variants: 45 },
  { category: 'Wedding', base: 'portfolio', variants: 30 },
  { category: 'Travel', base: 'blog', variants: 40 },
  { category: 'Nonprofit', base: 'business', variants: 25 },
  { category: 'Event', base: 'business', variants: 30 },
  { category: 'Technology', base: 'saas', variants: 50 },
  { category: 'Finance', base: 'business', variants: 35 },
  { category: 'Legal', base: 'business', variants: 20 },
  { category: 'Consulting', base: 'business', variants: 30 },
  { category: 'Creative', base: 'portfolio', variants: 45 },
  { category: 'Medical', base: 'business', variants: 25 },
  { category: 'Food', base: 'ecommerce', variants: 35 },
  { category: 'Fashion', base: 'ecommerce', variants: 50 },
  { category: 'Beauty', base: 'ecommerce', variants: 30 },
  { category: 'Sports', base: 'business', variants: 25 },
  { category: 'Music', base: 'portfolio', variants: 35 },
  { category: 'Gaming', base: 'saas', variants: 40 },
  { category: 'Personal', base: 'portfolio', variants: 30 },
  { category: 'Other', base: 'saas', variants: 50 },
];

const colorPalettes = [
  { primary: '#7c3aed', secondary: '#06b6d4', name: 'Violet-Cyan' },
  { primary: '#2563eb', secondary: '#10b981', name: 'Blue-Emerald' },
  { primary: '#dc2626', secondary: '#f59e0b', name: 'Red-Amber' },
  { primary: '#0891b2', secondary: '#8b5cf6', name: 'Cyan-Violet' },
  { primary: '#059669', secondary: '#3b82f6', name: 'Emerald-Blue' },
  { primary: '#ea580c', secondary: '#dc2626', name: 'Orange-Red' },
  { primary: '#4f46e5', secondary: '#ec4899', name: 'Indigo-Pink' },
  { primary: '#1e40af', secondary: '#fbbf24', name: 'Blue-Amber' },
  { primary: '#86198f', secondary: '#06b6d4', name: 'Fuchsia-Cyan' },
  { primary: '#166534', secondary: '#a16207', name: 'Green-Yellow' },
  { primary: '#be123c', secondary: '#7c3aed', name: 'Rose-Violet' },
  { primary: '#0e7490', secondary: '#84cc16', name: 'Teal-Lime' },
  { primary: '#4338ca', secondary: '#f97316', name: 'Indigo-Orange' },
  { primary: '#b91c1c', secondary: '#14b8a6', name: 'Red-Teal' },
  { primary: '#7c2d12', secondary: '#d97706', name: 'Brown-Amber' },
  { primary: '#312e81', secondary: '#22d3ee', name: 'Navy-Cyan' },
  { primary: '#9f1239', secondary: '#a855f7', name: 'Crimson-Purple' },
  { primary: '#14532d', secondary: '#eab308', name: 'Forest-Gold' },
  { primary: '#1e3a5f', secondary: '#f43f5e', name: 'Navy-Rose' },
  { primary: '#701a75', secondary: '#2dd4bf', name: 'Purple-Teal' },
];

const categoryImages = {
  'SaaS': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
  'Portfolio': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
  'Business': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600',
  'E-commerce': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
  'Blog': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600',
  'Landing Page': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
  'Startup': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
  'Agency': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
  'Restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
  'Real Estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'Education': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'Healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
  'Fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
  'Photography': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  'Wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
  'Travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
  'Nonprofit': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600',
  'Event': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
  'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'Finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600',
  'Legal': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
  'Consulting': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
  'Creative': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
  'Medical': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'Food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
  'Sports': 'https://images.unsplash.com/photo-1461896836934-bdffe1d2f258?w=600',
  'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
  'Gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
  'Personal': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
  'Other': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
};

function generateTemplates() {
  const templates = [];
  let id = 1;

  Object.entries(baseTemplates).forEach(([key, base]) => {
    const categories = {
      saas: ['SaaS', 'Technology', 'Startup', 'Landing Page'],
      portfolio: ['Portfolio', 'Creative', 'Photography', 'Personal'],
      business: ['Business', 'Agency', 'Consulting', 'Legal'],
      ecommerce: ['E-commerce', 'Fashion', 'Food', 'Beauty'],
      blog: ['Blog', 'Travel', 'Lifestyle'],
    };

    const cats = categories[key] || [key];
    cats.forEach((cat, idx) => {
      const palette = colorPalettes[idx % colorPalettes.length];
      const templateId = `${key}-${String(id).padStart(3, '0')}`;
      const fields = base.fields.map(f => ({
        ...f,
        default: f.id.includes('Color') && f.id === 'primaryColor' ? palette.primary :
                 f.id.includes('Color') && f.id === 'secondaryColor' ? palette.secondary : f.default
      }));

      templates.push({
        id: templateId,
        name: `${base.name} ${idx + 1}`,
        category: cat,
        thumbnail: categoryImages[cat] || categoryImages['Other'],
        html: base.html,
        css: base.css,
        fields,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        deployCount: Math.floor(Math.random() * 200),
      });
      id++;
    });
  });

  additionalCategories.forEach(({ category, base, variants }) => {
    const baseTemplate = baseTemplates[base];
    if (!baseTemplate) return;

    for (let i = 0; i < variants; i++) {
      const palette = colorPalettes[i % colorPalettes.length];
      const variantId = `${category.toLowerCase().replace(/\s+/g, '-')}-${String(templates.length + 1).padStart(3, '0')}`;

      const fields = baseTemplate.fields.map(f => ({
        ...f,
        default: f.id === 'primaryColor' ? palette.primary :
                 f.id === 'secondaryColor' ? palette.secondary :
                 f.id === 'accentColor' ? palette.secondary :
                 f.default
      }));

      const namePrefixes = ['Modern', 'Pro', 'Elite', 'Premium', 'Advanced', 'Smart', 'Dynamic', 'Ultra', 'Max', 'Prime', 'Lite', 'Studio', 'Hub', 'Cloud', 'Core', 'Edge', 'Wave', 'Pulse', 'Spark', 'Nova'];
      const prefix = namePrefixes[i % namePrefixes.length];

      templates.push({
        id: variantId,
        name: `${prefix} ${category} Template`,
        category,
        thumbnail: categoryImages[category] || categoryImages['Other'],
        html: baseTemplate.html,
        css: baseTemplate.css,
        fields,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        deployCount: Math.floor(Math.random() * 100),
      });
    }
  });

  while (templates.length < 1000) {
    const baseKeys = Object.keys(baseTemplates);
    const randomBase = baseTemplates[baseKeys[Math.floor(Math.random() * baseKeys.length)]];
    const randomCat = additionalCategories[Math.floor(Math.random() * additionalCategories.length)];
    const palette = colorPalettes[templates.length % colorPalettes.length];
    const names = ['Ultimate', 'Supreme', 'Infinity', 'Genesis', 'Quantum', 'Apex', 'Zenith', 'Summit', 'Pinnacle', 'Crest'];
    const name = `${names[templates.length % names.length]} ${randomCat.category}`;

    const fields = randomBase.fields.map(f => ({
      ...f,
      default: f.id === 'primaryColor' ? palette.primary :
               f.id === 'secondaryColor' ? palette.secondary :
               f.id === 'accentColor' ? palette.secondary : f.default
    }));

    templates.push({
      id: `template-${String(templates.length + 1).padStart(4, '0')}`,
      name,
      category: randomCat.category,
      thumbnail: categoryImages[randomCat.category] || categoryImages['Other'],
      html: randomBase.html,
      css: randomBase.css,
      fields,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      deployCount: Math.floor(Math.random() * 50),
    });
  }

  return templates;
}

export async function seedData() {
  console.log('Generating 1000+ templates...');
  const templates = generateTemplates();
  console.log(`Generated ${templates.length} templates`);

  const allCategories = [...new Set(templates.map(t => t.category))];

  await writeJSON('templates.json', {
    templates,
    categories: allCategories,
  });

  await writeJSON('users.json', { users: [] });
  await writeJSON('deployments.json', { deployments: [] });
  await writeJSON('creditPurchases.json', { purchases: [] });

  const hashedPassword = await hashPassword('SHADOW');

  await writeJSON('settings.json', {
    siteTitle: 'ShadowDeploy',
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#06b6d4',
      backgroundColor: '#0a0a0f',
      surfaceColor: '#1a1a25',
    },
    maintenanceMode: false,
    maintenanceMessage: 'Website is under maintenance. We\'ll be back soon!',
    adminPasswordHash: hashedPassword,
    contactInfo: {
      whatsapp: '+1234567890',
      telegram: '@shadowadmin',
    },
  });

  console.log('Seed data created successfully!');
  return { templatesCount: templates.length, categoriesCount: allCategories.length };
}

export { generateTemplates };
