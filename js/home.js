//back button no landing
if (window.location.hash === "#home") {
	document.querySelector("#landBtn").checked = false;
}

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
		videoId: 'GrCKcxC-0nI',
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
// --- GET LATEST POST ---
function getLatestPost(posts) {
  return posts
    .filter(p => p && p.active !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}


// --- GET FIRST REAL PARAGRAPH ---
function getExcerpt(content) {

  const lines = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  for (const line of lines) {

    // skip markdown headings
    if (line.startsWith('#')) continue;

    // skip images
    if (line.startsWith('![')) continue;

    // skip list items
    if (line.startsWith('- ')) continue;
    if (/^\d+\./.test(line)) continue;

    return line;
  }

  return '';
}


// --- GET CURRENT LANGUAGE ---
function getCurrentLanguage() {
  return localStorage.getItem("language") || "en";
}


// --- RENDER ---
function renderLatestPost(post) {
  if (!post) return;

  const lang = getCurrentLanguage();

  const title =
    post.title[lang] ||
    post.title.en;

  const contentMarkdown =
    post.content[lang] ||
    post.content.en;

  const container = document.querySelector('.blog');

  const titleEl =
    container.querySelector('.blog > div:nth-child(1)');

  const contentEl =
    container.querySelector('.blogCont');

  titleEl.textContent = title;

  contentEl.innerHTML =
    marked.parse(getExcerpt(contentMarkdown));
}


// --- INIT ---
let latestPost = null;

async function init() {
  generateCalendar();

  const posts = await loadAllPosts();

  latestPost = getLatestPost(posts);

  renderLatestPost(latestPost);
}

init();




document.querySelectorAll(".carouselWrap").forEach(wrap => {

	// --------------------
	// elements
	// --------------------

	const carousel = wrap.querySelector(".carousel");
	const slides = wrap.querySelectorAll(".carPic");
	const markers = wrap.querySelectorAll(".carMark span");

	let current = 0;
	let autoSlide;

	// --------------------
	// marker clicks
	// --------------------

	markers.forEach((marker, index) => {

		marker.addEventListener("click", (e) => {

			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			goToSlide(index);
			resetAutoplay();

		});

	});

	// --------------------
	// scroll to slide
	// --------------------

	function goToSlide(index) {

		carousel.scrollTo({
			top: slides[index].offsetTop,
			behavior: "smooth"
		});

		current = index;

		updateMarkers();
	}

	// --------------------
	// active marker
	// --------------------

	function updateMarkers() {

		markers.forEach(marker =>
			marker.classList.remove("on")
		);

		markers[current].classList.add("on");
	}

	// --------------------
	// detect active slide
	// --------------------

	carousel.addEventListener("scroll", () => {

		const carouselTop = carousel.scrollTop;
		const slideHeight = slides[0].offsetHeight;

		const index = Math.round(carouselTop / slideHeight);

		if (index !== current) {

			current = index;
			updateMarkers();

		}
	});

	// --------------------
	// autoplay
	// --------------------

	function startAutoplay() {

		autoSlide = setInterval(() => {

			current++;

			if (current >= slides.length) {
				current = 0;
			}

			goToSlide(current);

		}, 10000);
	}

	function resetAutoplay() {

		clearInterval(autoSlide);
		startAutoplay();

	}

	carousel.addEventListener(
		"wheel",
		resetAutoplay,
		{ passive: true }
	);

	carousel.addEventListener(
		"touchstart",
		resetAutoplay,
		{ passive: true }
	);

	// --------------------

	updateMarkers();
	startAutoplay();

});