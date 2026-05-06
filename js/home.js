//insert date
function updateDate(lang) {
    const localeMap = {
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR"
    };

    const locale = localeMap[lang] || "en-US";

    document.getElementById("date").textContent =
        new Date()
            .toLocaleDateString(locale, { month: "long", year: "numeric" })
            .toLowerCase();
}

//calendar logic
function generateCalendar() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  // First day of month
  const firstDay = new Date(year, month, 1);

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Convert JS day → Monday-based (Mon = 0, Sun = 6)
  let startDay = firstDay.getDay();
  startDay = (startDay + 6) % 7;

  const spans = document.querySelectorAll('#dots span');

  spans.forEach((span, i) => {
    const dayNumber = i - startDay + 1;

    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      span.classList.remove('no');
    } else {
      span.classList.add('no');
    }
	
	if (
  year === now.getFullYear() &&
  month === now.getMonth() &&
  dayNumber === now.getDate()
) {
  span.classList.add('today');
}
  });
}

// ==========================
// YOUTUBE PLAYER STATE
// ==========================
let player;
let isReady = false;
let isLoaded = false;

const trigger = document.querySelector('.audioPlay');
const playIcon = document.querySelector('play-icon');
const pauseIcon = document.querySelector('pause-icon');

// Required global callback
function onYouTubeIframeAPIReady() {
	// we lazy load, so nothing here
}

// ==========================
// INIT PLAYER
// ==========================
function initPlayer() {
	player = new YT.Player('yt-player', {
		videoId: 'w0pXac9pej8',
		playerVars: {
			controls: 0,
			modestbranding: 1,
			disablekb: 1,
			fs: 0,
			rel: 0,
			iv_load_policy: 3
		},
		events: {
			onReady: () => {
				isReady = true;
				player.setPlaybackQuality('small');
			},

			onStateChange: (e) => {
				// THIS is now your source of truth
				if (e.data === YT.PlayerState.PLAYING) {
					setPlayingUI();
				}

				if (
					e.data === YT.PlayerState.PAUSED ||
					e.data === YT.PlayerState.ENDED
				) {
					setPausedUI();
				}
			}
		}
	});

	isLoaded = true;
}

// ==========================
// CLICK HANDLER
// ==========================
trigger.addEventListener('click', () => {

	// First click → create + autoplay
	if (!isLoaded) {
		initPlayer();

		const wait = setInterval(() => {
			if (isReady) {
				player.playVideo();
				player.setPlaybackQuality('small');
				clearInterval(wait);
			}
		}, 50);

		return;
	}

	// Ask YouTube what it's doing
	const state = player.getPlayerState();

	if (state === YT.PlayerState.PLAYING) {
		player.pauseVideo();
	} else {
		player.playVideo();
	}
});

// ==========================
// UI CONTROL
// ==========================
function setPlayingUI() {
	playIcon.classList.remove('audioTog');
	pauseIcon.classList.add('audioTog');
}

function setPausedUI() {
	playIcon.classList.add('audioTog');
	pauseIcon.classList.remove('audioTog');
}

	
//blog preview
// --- FRONTMATTER PARSER (same as your main file) ---
function parseFrontmatter(text) {
  const parts = text.split('---');

  if (parts.length < 3) return null;

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
    const res = await fetch(`/assets/posts/${i}.md`);

    if (!res.ok) break;

    const text = await res.text();
    const post = parseFrontmatter(text);

    if (post) posts.push(post);
  }

  return posts;
}


// --- GET LATEST POST ---
function getLatestPost(posts) {
  return posts
    .filter(p => p && p.active !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}


// --- GET FIRST PARAGRAPH (EXCERPT) ---
function getExcerpt(content) {
  // split by double line breaks
  const parts = content.split('\n');

  return parts[0];
}


// --- RENDER ---
function renderLatestPost(post) {
  if (!post) return;

  const container = document.querySelector('.blog');
  const titleEl = container.querySelector('.blog > div:nth-child(1)');
  const contentEl = container.querySelector('.blogCont');

  titleEl.textContent = post.title;
  contentEl.innerHTML = marked.parse(getExcerpt(post.content));

}


// --- INIT ---
async function init() {
	generateCalendar();
  const posts = await loadAllPosts();
  const latest = getLatestPost(posts);

  renderLatestPost(latest);
}

init();












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
	updateDate(lang);

    // 4. persist
    if (save) {
        localStorage.setItem(STORAGE_KEY, lang);
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