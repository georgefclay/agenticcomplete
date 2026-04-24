require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.SITE_URL || 'https://agenticcomplete.com';
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const defaultMeta = {
  siteName: 'Agentic Complete',
  title: 'Agentic Complete | A Capability Standard for Autonomous Systems',
  description:
    'Agentic Complete defines a capability threshold for autonomous systems that can pursue and complete high-level goals without human handoffs.',
  canonical: `${SITE_URL}/`
};

function renderPage(res, page, pageMeta = {}, pageData = {}) {
  const meta = {
    ...defaultMeta,
    ...pageMeta
  };

  return res.render(`pages/${page}`, {
    meta,
    currentPath: pageData.currentPath || '/',
    web3formsAccessKey: WEB3FORMS_ACCESS_KEY,
    ...pageData
  });
}

app.get('/', (req, res) => {
  renderPage(res, 'index', {
    canonical: `${SITE_URL}/`
  }, { currentPath: '/' });
});

app.get('/maturity', (req, res) => {
  renderPage(res, 'maturity', {
    title: 'Agentic Maturity Model | Agentic Complete',
    description:
      'The Agentic Maturity Model defines the progression from static automation to Agentic Complete autonomous systems.',
    canonical: `${SITE_URL}/maturity`
  }, { currentPath: '/maturity' });
});

app.get('/evaluation', (req, res) => {
  renderPage(res, 'evaluation', {
    title: 'Evaluation Framework | Agentic Complete',
    description:
      'Evaluation criteria and checklist for determining whether a system meets the Agentic Complete threshold.',
    canonical: `${SITE_URL}/evaluation`
  }, { currentPath: '/evaluation' });
});

app.get('/architecture', (req, res) => {
  renderPage(res, 'architecture', {
    title: 'Architectural Requirements | Agentic Complete',
    description:
      'Architectural requirements and control-loop model for systems seeking Agentic Complete classification.',
    canonical: `${SITE_URL}/architecture`
  }, { currentPath: '/architecture' });
});

app.get('/about', (req, res) => {
  renderPage(res, 'about', {
    title: 'About | Agentic Complete',
    description:
      'About the Agentic Complete capability classification and its intended role as a vendor-neutral evaluation standard.',
    canonical: `${SITE_URL}/about`
  }, { currentPath: '/about' });
});

app.get('/contact', (req, res) => {
  renderPage(res, 'contact', {
    title: 'Contact | Agentic Complete',
    description:
      'Contact page for technical feedback, clarification, and discussion related to the Agentic Complete standard.',
    canonical: `${SITE_URL}/contact`
  }, { currentPath: '/contact' });
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const pages = ['', '/maturity', '/evaluation', '/architecture', '/about', '/contact'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>\n    <loc>${SITE_URL}${page || '/'}</loc>\n  </url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

app.listen(PORT, () => {
  console.log(`Agentic Complete site running on port ${PORT}`);
});
