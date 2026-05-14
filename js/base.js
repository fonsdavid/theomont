// --- FRONTMATTER PARSER ---
function parseFrontmatter(text) {
  const parts = text.split('---');

  if (parts.length < 3) {
    console.warn('Invalid frontmatter format');
    return null;
  }

  const frontmatterRaw = parts[1].trim();
  const rawContent = parts.slice(2).join('---').trim();

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

  // --- MULTILANGUAGE CONTENT PARSER ---
  const sections = {
    en: '',
    es: '',
    fr: ''
  };

  const regex = /<!--\s?(EN|ES|FR)\s?-->([\s\S]*?)(?=(<!--\s?(EN|ES|FR)\s?-->)|$)/gi;

  let match;

  while ((match = regex.exec(rawContent)) !== null) {
    const lang = match[1].toLowerCase();
    const content = match[2].trim();

    sections[lang] = content;
  }

  return {
    ...meta,

    title: {
      en: meta.title_en || '',
      es: meta.title_es || meta.title_en || '',
      fr: meta.title_fr || meta.title_en || ''
    },

    content: {
      en: sections.en || '',
      es: sections.es || sections.en || '',
      fr: sections.fr || sections.en || ''
    }
  };
}

// --- LOAD ALL POSTS ---
async function loadAllPosts() {
  const posts = [];

  for (let i = 1; i <= 100; i++) {
    const path = `${BLOG_PATH}${i}.md`;

    const res = await fetch(path);

    if (!res.ok) break;

    const text = await res.text();
    const post = parseFrontmatter(text);

    if (post) posts.push(post);
  }

  return posts;
}




let translations = {};
const STORAGE_KEY = "language";
const DEFAULT_LANG = "en";

/* ---------------------------
   Load translations + init
----------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/js/trans.json");
        translations = await res.json();

        const savedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

        setLanguage(savedLang, false);
        bindLanguageButtons();
    } catch (err) {
        console.error("Translation load failed:", err);
    }
});

/* ---------------------------
   Core: set language
----------------------------*/
function setLanguage(lang, save = true) {
    if (!translations[lang]) return;

    // 1. update HTML lang
    document.documentElement.lang = lang;

    // 2. translate all elements
    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        const value = translations[lang]?.[key];

        if (value !== undefined) {
            el.textContent = value;
        }
    });

    // 3. update active states
    updateActiveStates(lang);
	if (typeof updateDate === "function") {
		updateDate(lang);
	}

    // 4. persist
    if (save) {
        localStorage.setItem(STORAGE_KEY, lang);
    }
	
	// rerender blog page if present
	if (typeof renderPosts === "function" && typeof allPosts !== "undefined") {
		renderPosts(allPosts);
	}
	
	// rerender homepage preview
	if (typeof renderLatestPost === "function" && latestPost) {
		renderLatestPost(latestPost);
	}
}

/* ---------------------------
   Update UI active classes
   (works for both navs)
----------------------------*/
function updateActiveStates(lang) {
    document.querySelectorAll(".en, .es, .fr").forEach(el => {
        el.classList.remove("active");
    });

    document.querySelectorAll(`.${lang}`).forEach(el => {
        el.classList.add("active");
    });
}

/* ---------------------------
   Bind click events
----------------------------*/
function bindLanguageButtons() {
    document.querySelectorAll(".en, .es, .fr").forEach(el => {
        el.addEventListener("click", () => {
            const lang = getLangFromElement(el);
            setLanguage(lang);
        });
    });
}

/* ---------------------------
   Helper: extract language
----------------------------*/
function getLangFromElement(el) {
    if (el.classList.contains("en")) return "en";
    if (el.classList.contains("es")) return "es";
    if (el.classList.contains("fr")) return "fr";
    return DEFAULT_LANG;
}