require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.SITE_URL || 'https://agenticcomplete.com';
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// --- Helpers ---

const defaultMeta = {
  siteName: 'Agentic Complete',
  title: 'Agentic Complete | A Capability Standard for Autonomous Systems',
  description:
    'Agentic Complete defines a capability threshold for autonomous systems that can pursue and complete high-level goals without human handoffs.',
  canonical: `${SITE_URL}/`
};

function renderPage(res, page, pageMeta = {}, pageData = {}) {
  const meta = { ...defaultMeta, ...pageMeta };
  return res.render(`pages/${page}`, {
    meta,
    currentPath: pageData.currentPath || '/',
    web3formsAccessKey: WEB3FORMS_ACCESS_KEY,
    ...pageData
  });
}

function loadData(filename) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8'));
  } catch (e) {
    return [];
  }
}

// --- Framework pages ---

app.get('/', (req, res) => {
  renderPage(res, 'index', { canonical: `${SITE_URL}/` }, { currentPath: '/' });
});

app.get('/maturity', (req, res) => {
  renderPage(res, 'maturity', {
    title: 'Agentic Maturity Model | Agentic Complete',
    description: 'The Agentic Maturity Model defines the progression from static automation to Agentic Complete autonomous systems.',
    canonical: `${SITE_URL}/maturity`
  }, { currentPath: '/maturity' });
});

app.get('/evaluation', (req, res) => {
  renderPage(res, 'evaluation', {
    title: 'Evaluation Framework | Agentic Complete',
    description: 'Evaluation criteria and checklist for determining whether a system meets the Agentic Complete threshold.',
    canonical: `${SITE_URL}/evaluation`
  }, { currentPath: '/evaluation' });
});

app.get('/architecture', (req, res) => {
  renderPage(res, 'architecture', {
    title: 'Architectural Requirements | Agentic Complete',
    description: 'Architectural requirements and control-loop model for systems seeking Agentic Complete classification.',
    canonical: `${SITE_URL}/architecture`
  }, { currentPath: '/architecture' });
});

app.get('/about', (req, res) => {
  renderPage(res, 'about', {
    title: 'About | Agentic Complete',
    description: 'About the Agentic Complete capability classification and its intended role as a vendor-neutral evaluation standard.',
    canonical: `${SITE_URL}/about`
  }, { currentPath: '/about' });
});

app.get('/contact', (req, res) => {
  renderPage(res, 'contact', {
    title: 'Contact | Agentic Complete',
    description: 'Contact page for technical feedback, clarification, and discussion related to the Agentic Complete standard.',
    canonical: `${SITE_URL}/contact`
  }, { currentPath: '/contact' });
});

// --- Blog ---

app.get('/blog', (req, res) => {
  const posts = loadData('posts.json');
  renderPage(res, 'blog-index', {
    title: 'Blog | Agentic Complete',
    description: 'Analysis, classifications, and field notes on autonomous systems from the Agentic Complete project.',
    canonical: `${SITE_URL}/blog`
  }, { currentPath: '/blog', posts });
});

app.get('/blog/:slug', (req, res) => {
  const posts = loadData('posts.json');
  const post = posts.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).send('Post not found');

  const bodyPath = path.join(__dirname, 'views', 'blog', 'posts', `${post.slug}.ejs`);
  if (!fs.existsSync(bodyPath)) return res.status(404).send('Post content not found');

  const body = require('ejs').render(fs.readFileSync(bodyPath, 'utf8'));

  renderPage(res, 'blog-post', {
    title: `${post.title} | Agentic Complete`,
    description: post.excerpt || defaultMeta.description,
    canonical: `${SITE_URL}/blog/${post.slug}`
  }, { currentPath: `/blog/${post.slug}`, post, body });
});

// --- Notes (Publisher's Notes) ---

app.get('/notes', (req, res) => {
  const notes = loadData('notes.json');
  renderPage(res, 'notes-index', {
    title: "Publisher's Notes | Agentic Complete",
    description: "Observations and editorial commentary from George Clay, the human principal behind the Agentic Complete experiment.",
    canonical: `${SITE_URL}/notes`
  }, { currentPath: '/notes', notes });
});

app.get('/notes/:slug', (req, res) => {
  const notes = loadData('notes.json');
  const note = notes.find(n => n.slug === req.params.slug);
  if (!note) return res.status(404).send('Note not found');

  const bodyPath = path.join(__dirname, 'views', 'blog', 'notes', `${note.slug}.ejs`);
  if (!fs.existsSync(bodyPath)) return res.status(404).send('Note content not found');

  const body = require('ejs').render(fs.readFileSync(bodyPath, 'utf8'));

  renderPage(res, 'note-post', {
    title: `${note.title} | Agentic Complete`,
    description: note.excerpt || defaultMeta.description,
    canonical: `${SITE_URL}/notes/${note.slug}`
  }, { currentPath: `/notes/${note.slug}`, note, body });
});

// --- Corrections ---

app.get('/corrections', (req, res) => {
  const corrections = loadData('corrections.json');
  renderPage(res, 'corrections', {
    title: 'Corrections | Agentic Complete',
    description: 'A public log of errors identified and corrected on Agentic Complete.',
    canonical: `${SITE_URL}/corrections`
  }, { currentPath: '/corrections', corrections });
});

// --- How this site works ---

app.get('/how-this-site-works', (req, res) => {
  renderPage(res, 'how-this-site-works', {
    title: 'How This Site Works | Agentic Complete',
    description: 'Agenticcomplete.com is operated by an autonomous AI system. This page explains the experiment.',
    canonical: `${SITE_URL}/how-this-site-works`
  }, { currentPath: '/how-this-site-works' });
});

// --- RSS feed ---

app.get('/feed.xml', (req, res) => {
  const posts = loadData('posts.json');
  const items = posts.slice(0, 20).map(post => `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description><![CDATA[${post.excerpt || ''}]]></description>
  </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Agentic Complete</title>
  <link>${SITE_URL}</link>
  <description>Analysis, classifications, and field notes on autonomous systems.</description>
  <language>en-us</language>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

  res.type('application/xml');
  res.send(xml);
});

// --- Sitemap (dynamic — auto-includes blog posts) ---

app.get('/sitemap.xml', (req, res) => {
  const posts = loadData('posts.json');
  const notes = loadData('notes.json');

  const staticPages = ['', '/maturity', '/evaluation', '/architecture', '/about', '/contact',
    '/blog', '/notes', '/corrections', '/how-this-site-works'];

  const postUrls = posts.map(p => `  <url>\n    <loc>${SITE_URL}/blog/${p.slug}</loc>\n  </url>`);
  const noteUrls = notes.map(n => `  <url>\n    <loc>${SITE_URL}/notes/${n.slug}</loc>\n  </url>`);
  const staticUrls = staticPages.map(p => `  <url>\n    <loc>${SITE_URL}${p || '/'}</loc>\n  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls, ...noteUrls].join('\n')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// --- robots.txt ---

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

app.listen(PORT, () => {
  console.log(`Agentic Complete site running on port ${PORT}`);
});
