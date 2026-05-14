// --- DATE FORMATTER ---
function formatDate(dateStr) {
  const d = new Date(dateStr);

  if (isNaN(d)) return dateStr;

  const lang = localStorage.getItem("language") || "en";

  const localeMap = {
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR"
  };

  return d.toLocaleDateString(localeMap[lang] || "en-GB", {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}


// --- INTERSECTION OBSERVER ---
function initObserver(navMap) {
  const options = {
    root: null,
    rootMargin: '-48% 0px -48% 0px',
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


// --- GET CURRENT LANGUAGE ---
function getCurrentLanguage() {
  return localStorage.getItem("language") || "en";
}


// --- RENDER POSTS ---
function renderPosts(posts) {
  const cont = document.getElementById('cont');
  const navWrap = document.getElementById('navWrap');

  cont.innerHTML = '';
  navWrap.innerHTML = '';

  const navMap = {};

  const lang = getCurrentLanguage();

  posts.forEach(post => {

    const title =
      post.title[lang] ||
      post.title.en;

    const contentMarkdown =
      post.content[lang] ||
      post.content.en;

    // ARTICLE
    const article = document.createElement('article');

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    article.id = slug;

    const h1 = document.createElement('h1');
    h1.textContent = title.toLowerCase();

    const h2 = document.createElement('h2');
    if (post.date) {
	  h2.textContent = formatDate(post.date).toLowerCase();
	}

    const content = document.createElement('div');
    content.innerHTML = marked.parse(contentMarkdown);

    article.appendChild(h1);
	if (post.date) {
	  article.appendChild(h2);
	}
    article.appendChild(content);

    cont.appendChild(article);

    // NAV
    const span = document.createElement('span');
    const phoneNav = document.getElementById("phoneNav");

    span.textContent = title.toLowerCase();

    navWrap.appendChild(span);

    // map nav to article
    navMap[slug] = span;

    // click → scroll
    span.onclick = () => {
	  const container = document.getElementById('cont');
	  const target = document.getElementById(slug);

	  // close nav first (safe here since we are NOT relying on window scroll)
	  phoneNav.checked = false;

	  // wait one frame so layout settles (mobile-safe)
	  requestAnimationFrame(() => {
		container.scrollTo({
		  top: target.offsetTop,
		  behavior: 'smooth'
		});
	  });
	};
  });

  initObserver(navMap);
}


// --- INIT ---
let allPosts = [];

async function init() {
  allPosts = await loadAllPosts();

  allPosts = allPosts.filter(p => p && p.active !== false);

  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  renderPosts(allPosts);
}

init();