// --- FRONTMATTER PARSER ---
function parseFrontmatter(text) {
  const parts = text.split('---');

  if (parts.length < 3) {
    console.warn('Invalid frontmatter format');
    return null;
  }

  const frontmatterRaw = parts[1].trim();
  const content = parts[2].trim();

  const lines = frontmatterRaw.split('\n');
  const meta = {};

  lines.forEach(line => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    meta[key] = value;
  });

  if (meta.active === 'true') meta.active = true;
  if (meta.active === 'false') meta.active = false;

  return {
    ...meta,
    content
  };
}


// --- LOAD ALL POSTS ---
async function loadAllPosts() {
  const posts = [];

  for (let i = 1; i <= 100; i++) {
    const path = `/assets/posts/${i}.md`;

    const res = await fetch(path);

    if (!res.ok) break;

    const text = await res.text();
    const post = parseFrontmatter(text);

    if (post) posts.push(post);
  }

  return posts;
}


// --- DATE FORMATTER ---
function formatDate(dateStr) {
  const d = new Date(dateStr);

  if (isNaN(d)) return dateStr;

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}


// --- INTERSECTION OBSERVER ---
function initObserver(navMap) {
  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      const navItem = navMap[id];

      if (!navItem) return;

      // remove active from all
      Object.values(navMap).forEach(el =>
        el.classList.remove('active')
      );

      // add to current
      navItem.classList.add('active');
    });
  }, options);

  document.querySelectorAll('article').forEach(article => {
    observer.observe(article);
  });
}


//Make links open in new tab
const renderer = new marked.Renderer();

renderer.link = function({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);

  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.setOptions({ renderer });


// --- RENDER POSTS ---
function renderPosts(posts) {
  const cont = document.getElementById('cont');
  const navWrap = document.getElementById('navWrap');

  cont.innerHTML = '';
  navWrap.innerHTML = '';

  const navMap = {}; // ← IMPORTANT

  posts.forEach(post => {
    // ARTICLE
    const article = document.createElement('article');

    const slug = post.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    article.id = slug;

    const h1 = document.createElement('h1');
    h1.textContent = post.title.toLowerCase();

    const h2 = document.createElement('h2');
    h2.textContent = formatDate(post.date).toLowerCase();

    const content = document.createElement('div');
    content.innerHTML = marked.parse(post.content);

    article.appendChild(h1);
    article.appendChild(h2);
    article.appendChild(content);

    cont.appendChild(article);

    // NAV
    const span = document.createElement('span');
	const phoneNav = document.getElementById("phoneNav");
    span.textContent = post.title.toLowerCase();

    navWrap.appendChild(span);

    // map nav to article
    navMap[slug] = span;

    // click → scroll
    span.onclick = () => {
      document.getElementById(slug).scrollIntoView({
        behavior: 'smooth'
      });
	  phoneNav.checked = false;
    };
  });

  // INIT OBSERVER HERE
  initObserver(navMap);
}


// --- INIT ---
async function init() {
  let posts = await loadAllPosts();

  posts = posts.filter(p => p && p.active !== false);

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  renderPosts(posts);
}

init();