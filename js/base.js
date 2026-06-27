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
	
	updateAllCarouselCaptions();
}

function updateAllCarouselCaptions() {

    const lang = document.documentElement.lang || DEFAULT_LANG;

    document.querySelectorAll(".carouselWrap").forEach(wrap => {

        const gallery = wrap.dataset.gallery;
        const current = Number(wrap.dataset.current || 0);

        const captions =
            translations[lang]?.[gallery];

        if (!captions) return;

        const captionEl =
            wrap.closest(".card")
                ?.querySelector(".carouselCaption");

        if (!captionEl) return;

        captionEl.textContent =
            captions[current] || "";

    });

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








//icons
class Insta extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="currentColor" viewBox="0 0 500 500" xml:space="preserve"><g><path d="M400,45c14.6,0,28.4,5.8,38.8,16.2C449.2,71.6,455,85.4,455,100v300c0,14.6-5.8,28.4-16.2,38.8 C428.4,449.2,414.6,455,400,455H100c-14.6,0-28.4-5.8-38.8-16.2C50.8,428.4,45,414.6,45,400V100c0-14.6,5.8-28.4,16.2-38.8 C71.6,50.8,85.4,45,100,45H400 M400,0H100C45,0,0,45,0,100v300c0,55,45,100,100,100h300c55,0,100-45,100-100V100 C500,45,455,0,400,0L400,0z"/></g><g><path d="M250,157.5c51,0,92.5,41.5,92.5,92.5S301,342.5,250,342.5S157.5,301,157.5,250S199,157.5,250,157.5 M250,112.5 c-75.9,0-137.5,61.6-137.5,137.5S174.1,387.5,250,387.5S387.5,325.9,387.5,250S325.9,112.5,250,112.5L250,112.5z"/></g><g><circle cx="391" cy="109" r="29"/></g></svg>
    `;
  }
}
customElements.define('insta-icon', Insta);

class Flow extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="currentColor" viewBox="0 0 500 500" xml:space="preserve">
<g>
	<path d="M109.1,175.8c-3.3,1.6-5.7,2.6-7.9,3.9C73,196.5,58.1,221.4,60,254.3c1.9,33.7,19.8,57.8,51,70.4
		c43.7,17.6,92.7-7.3,106-52.7c2.8-9.5,2.9-19.2,3.2-29c0.8-24.7,7.9-47.6,21.7-68c20-29.6,46.9-50.5,81.8-59.8
		c64.7-17.2,131,12.9,160.7,71.3c13.5,26.4,18.7,54.5,13.8,83.7c-8.5,51.8-37.4,88.2-85.5,109.2c-6.6,2.9-13.8,4.6-20.7,6.6
		c-2.4,0.7-3.4,1.8-3.4,4.2c0.1,5.6,0,11.1,0,16.7c0,6.1-2.5,10.8-7.9,13.7c-5.5,2.9-11,2.6-16.2-0.8
		c-23.3-15.8-46.7-31.6-69.9-47.6c-9.1-6.3-8.8-18.9,0.5-25.4c10.7-7.5,21.6-14.7,32.4-22c12-8.2,24-16.4,36.1-24.5
		c8.1-5.5,17.7-4,22.5,3.6c1.2,1.9,2,4.4,2.3,6.7c0.4,3.4,0.2,6.8,0.3,10.2c0.1,3.7,0.9,4.4,4,2.6c6.8-4.1,14-7.8,19.9-12.9
		c19.1-16.8,28.5-38.2,27.8-63.7c-1-36-28.7-68.3-64.1-75.1c-41.1-7.9-80.2,15.3-92.7,55.1c-2.4,7.6-3.3,15.5-3.3,23.5
		c-0.2,35.2-11.5,66.4-35.2,92.5c-17.8,19.6-39.4,33.8-65.1,41.3c-26.7,7.8-53.4,8.1-80-0.1C59,371,29.6,345,12,306.1
		c-11.2-24.9-14.7-51.1-9.9-78c9.4-52.9,39.8-89,89.4-109.1c4.5-1.8,9.3-3.1,14-4.3c2.7-0.7,3.7-1.9,3.6-4.7
		c-0.2-5.5-0.1-10.9,0-16.4c0.1-6.3,2.5-11.4,8.2-14.3c5.7-3,11.4-2.3,16.8,1.3c22.6,15.3,45.1,30.6,67.7,46
		c10.8,7.4,10.9,19.8,0.1,27.2c-22.6,15.5-45.3,30.8-67.9,46.2c-5.2,3.6-10.7,4.3-16.4,1.3c-5.9-3-8.3-8.2-8.4-14.5
		C109,183.5,109.1,180.2,109.1,175.8z M139.9,372.3c20,0,38.4-4.6,56.1-13.6c21-10.7,37.2-26.8,49.7-46.4c11.4-17.9,17-38,17.1-59.2
		c0.1-11,1-21.8,4.3-32.3c17.3-54.1,75.5-81.9,128.6-61.6c57,21.8,79.9,92.5,46.4,143.5c-12.2,18.6-28.7,31.7-49.7,39.2
		c-1.9,0.7-3.9,1.1-3.8,3.9c0.1,6.6,0.1,13.2,0,19.8c0,2.6,1.2,3.2,3.5,2.5c3-0.9,6.1-1.8,9.1-2.9c62.7-22.9,98.1-92.7,73.6-158.1
		c-22.3-59.5-86.9-93.3-150-74.4c-23.4,7-43,20.3-58.7,39.1c-9.3,11.2-15.9,23.9-21.4,37.4c-5,12.1-7.2,24.6-7.4,37.5
		c-0.1,9.1-0.6,18.1-2.9,27c-12.8,51.5-66.4,85.9-121.9,69.7c-60.2-17.6-88.1-86-57.8-140.9c11.4-20.5,28.2-35.1,50.2-43.4
		c3.1-1.2,4.4-2.6,4.3-6.1c-0.3-5.9-0.2-11.8,0-17.7c0.1-2.9-1-3.8-3.7-2.8c-5.1,1.9-10.4,3.4-15.3,5.7
		C33.5,163.4,4.9,226,22.7,285.6C38,336.7,86.2,372.4,139.9,372.3z M371,316.1c-21.6,14.7-42.5,28.9-63.9,43.4
		c1.6,1.2,2.6,2,3.6,2.7c19,13,38.1,25.9,57.2,38.9c0.9,0.6,2,0.8,3,1.2c0.2-1.1,0.7-2.1,0.7-3.2c0.1-25.8,0.1-51.6,0.1-77.4
		C371.6,320.2,371.3,318.7,371,316.1z M191,140.3c-21.6-14.7-42.6-29-64.3-43.7c0,29.5,0,57.9,0,87.4
		C148.3,169.3,169.3,155,191,140.3z"/>
</g>
</svg>
    `;
  }
}
customElements.define('flow-icon', Flow);

class Bio extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<g>
<g>
<path id="Combined Shape" fill-rule="evenodd" clip-rule="evenodd" d="M32.2301 22.2985C30.2149 24.5691 27.2745 25.9998 24 25.9998C17.925 25.9998 13 21.0754 13 14.9998C13 8.92552 17.9257 3.9998 24 3.9998C30.0743 3.9998 35 8.92552 35 14.9998C35 17.0807 34.4222 19.0266 33.4184 20.6859C37.4029 23.2673 39.9994 27.4474 39.9994 32.1866V40.9786C39.9994 42.6369 38.6577 43.9786 36.9994 43.9786H10.9994C9.34257 43.9786 7.99939 42.6364 7.99939 40.9786V32.1866C7.99939 28.5756 9.51984 25.1783 12.201 22.5769C12.5974 22.1923 13.2305 22.2019 13.6151 22.5983C13.9997 22.9946 13.9901 23.6277 13.5937 24.0123C11.2906 26.2469 9.99939 29.132 9.99939 32.1866V40.9786C9.99939 41.5315 10.4468 41.9786 10.9994 41.9786H36.9994C37.5531 41.9786 37.9994 41.5323 37.9994 40.9786V32.1866C37.9994 28.1349 35.7312 24.5261 32.2301 22.2985ZM30.4104 21.3171C28.7782 22.9732 26.5089 23.9998 24 23.9998C19.0296 23.9998 15 19.9708 15 14.9998C15 10.0301 19.0303 5.9998 24 5.9998C28.9697 5.9998 33 10.0301 33 14.9998C33 16.7236 32.5154 18.3341 31.6751 19.7026C29.394 18.5927 26.7773 17.9626 23.9994 17.9626C23.4471 17.9626 22.9994 18.4103 22.9994 18.9626C22.9994 19.5149 23.4471 19.9626 23.9994 19.9626C26.313 19.9626 28.4918 20.452 30.4104 21.3171Z" fill="currentColor"/>
</g>
</g>
</svg>
    `;
  }
}
customElements.define('bio-icon', Bio);

class Mail extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.39 256.39"><defs><style>.cls-1{stroke-width:0px;}.cls-2{fill:none;stroke:currentColor;stroke-linecap:round;stroke-miterlimit:10;stroke-width:25px;}</style></defs><path class="cls-1" d="M206.52,25c13.72,0,24.87,11.16,24.87,24.87v156.64c0,13.72-11.16,24.87-24.87,24.87H49.87c-13.72,0-24.87-11.16-24.87-24.87V49.87c0-13.72,11.16-24.87,24.87-24.87h156.64M206.52,0H49.87C22.33,0,0,22.33,0,49.87v156.64c0,27.54,22.33,49.87,49.87,49.87h156.64c27.54,0,49.87-22.33,49.87-49.87V49.87c0-27.54-22.33-49.87-49.87-49.87h0Z"/><polyline class="cls-2" points="232.52 24.55 128.2 117.25 23.87 24.55"/></svg>
    `;
  }
}
customElements.define('mail-icon', Mail);

class Excla extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 571.886 571.885"
	 xml:space="preserve">
<g>
	<g>
		<path d="M563.829,326.378l-55.995-40.464l55.977-40.475c2.898-2.098,4.336-5.678,3.72-9.194c-0.625-3.517-3.192-6.384-6.646-7.365
			l-66.44-18.874l38.765-57.181c2.007-2.949,2.138-6.795,0.345-9.892c-1.782-3.083-5.231-4.929-8.746-4.651l-68.886,4.994
			l16.867-66.994c0.849-3.463-0.337-7.129-3.076-9.427c-2.744-2.315-6.543-2.831-9.801-1.363l-63.033,28.236l-7.071-68.699
			c-0.363-3.575-2.734-6.602-6.095-7.825c-3.351-1.244-7.09-0.441-9.693,2.084l-49.551,48.087l-30.126-62.11
			C292.779,2.046,289.508,0,285.933,0c-3.575,0-6.835,2.046-8.4,5.267L247.39,67.395l-49.56-48.083
			c-2.567-2.5-6.317-3.288-9.677-2.065c-3.351,1.225-5.722,4.25-6.083,7.825l-7.073,68.681l-63.031-28.227
			c-3.269-1.438-7.059-0.94-9.812,1.372c-2.732,2.294-3.918,5.964-3.063,9.43l16.846,66.954l-68.865-4.966
			c-3.78-0.306-6.991,1.549-8.755,4.66c-1.783,3.097-1.664,6.944,0.343,9.894l38.765,57.181l-66.445,18.888
			c-3.444,0.959-6.021,3.827-6.637,7.344c-0.628,3.517,0.821,7.091,3.713,9.196l55.977,40.454L8.057,326.416
			c-2.891,2.096-4.34,5.671-3.712,9.185c0.616,3.52,3.192,6.385,6.637,7.346l66.419,18.893L38.657,419.02
			c-2.007,2.959-2.126,6.805-0.343,9.903c1.664,2.894,4.76,4.667,8.072,4.667c0.224,0,0.459,0,0.684-0.019l68.881-4.976
			L99.079,495.56c-0.858,3.472,0.325,7.131,3.064,9.427c1.706,1.447,3.848,2.194,6.002,2.194c1.291,0,2.585-0.28,3.811-0.821
			l63.031-28.246l7.073,68.7c0.362,3.575,2.732,6.608,6.083,7.821c1.036,0.393,2.116,0.57,3.192,0.57
			c2.39,0,4.721-0.915,6.503-2.643l49.564-48.08l30.142,62.138c1.566,3.229,4.826,5.265,8.401,5.265s6.847-2.035,8.415-5.265
			l30.122-62.156l49.573,48.095c1.782,1.722,4.111,2.642,6.501,2.642c1.088,0,2.156-0.173,3.192-0.565
			c3.36-1.218,5.731-4.27,6.096-7.826l7.057-68.718l63.042,28.245c1.224,0.546,2.521,0.821,3.818,0.821
			c2.146,0,4.284-0.747,5.992-2.193c2.735-2.292,3.921-5.956,3.057-9.423l-16.885-66.991l68.923,4.975
			c0.215,0.019,0.448,0.019,0.673,0.019c3.313,0,6.417-1.773,8.073-4.667c1.812-3.099,1.662-6.944-0.345-9.903l-38.803-57.182
			l66.459-18.883c3.454-0.971,6.021-3.836,6.637-7.355C568.175,332.044,566.732,328.469,563.829,326.378z M537.265,241.598
			l-45.359,32.798l-11.547-8.335c-0.541-0.401-1.204-0.458-1.801-0.707l-4.574-25.97c0.467-0.438,1.073-0.726,1.438-1.279
			l7.999-11.81L537.265,241.598z M455.198,285.933c0,93.342-75.924,169.266-169.266,169.266
			c-93.33,0-169.256-75.924-169.256-169.266c0-93.332,75.926-169.256,169.256-169.256
			C379.274,116.677,455.198,192.601,455.198,285.933z M506.956,158.298l-31.409,46.354l-13.707-3.902
			c-0.649-0.187-1.283,0-1.933-0.037l-13.188-22.829c0.298-0.579,0.761-1.057,0.929-1.691l3.486-13.841L506.956,158.298z
			 M449.98,90.401l-13.675,54.276l-14.225,1.048c-0.653,0.046-1.204,0.429-1.82,0.616l-20.204-16.96
			c0.07-0.637,0.364-1.225,0.294-1.878l-1.47-14.228L449.98,90.401z M373.222,46.094l5.717,55.686l-13.012,5.836
			c-0.607,0.273-0.989,0.822-1.513,1.204l-24.744-9.01c-0.168-0.635-0.094-1.292-0.383-1.876l-6.235-12.872L373.222,46.094z
			 M285.933,30.721l24.438,50.346l-10.268,9.95c-0.477,0.459-0.635,1.099-0.999,1.645l-26.351-0.021
			c-0.364-0.521-0.532-1.183-1.01-1.643l-10.24-9.931L285.933,30.721z M198.646,46.108l40.174,38.949l-6.237,12.853
			c-0.301,0.598-0.224,1.26-0.392,1.89l-24.754,9.01c-0.513-0.383-0.9-0.931-1.498-1.204l-13.042-5.836L198.646,46.108z
			 M121.885,90.438l51.079,22.841l-1.456,14.228c-0.077,0.654,0.215,1.26,0.292,1.893l-20.192,16.941
			c-0.616-0.187-1.167-0.569-1.823-0.616l-14.237-1.029L121.885,90.438z M64.909,158.335l55.812,4.016l3.484,13.841
			c0.166,0.653,0.644,1.108,0.931,1.691l-13.18,22.829c-0.646,0.037-1.281-0.149-1.914,0.056l-13.709,3.902L64.909,158.335z
			 M34.601,241.626l53.831-15.308l8.001,11.792c0.38,0.548,0.968,0.84,1.447,1.295l-4.583,25.949
			c-0.579,0.273-1.251,0.324-1.783,0.707l-11.537,8.354L34.601,241.626z M34.601,330.261l45.371-32.8l11.537,8.344
			c0.53,0.383,1.186,0.318,1.773,0.57l4.611,26.107c-0.478,0.457-1.094,0.728-1.465,1.278l-8.001,11.799L34.601,330.261z
			 M64.909,413.55l31.398-46.335l13.73,3.911c0.674,0.195,1.363,0.233,2.056,0.271l13.056,22.607
			c-0.292,0.569-0.765,1.036-0.931,1.68l-3.484,13.834L64.909,413.55z M121.885,481.456l13.675-54.287l14.225-1.018
			c0.656-0.056,1.207-0.438,1.823-0.625l20.21,16.96c-0.077,0.635-0.364,1.223-0.292,1.876l1.456,14.211L121.885,481.456z
			 M198.646,525.756l-5.719-55.655l13.023-5.848c0.597-0.271,0.978-0.812,1.51-1.195l24.754,9.021
			c0.168,0.626,0.096,1.279,0.383,1.867l6.247,12.849L198.646,525.756z M285.951,541.148l-24.425-50.358l10.242-9.94
			c0.476-0.457,0.644-1.11,1.008-1.643h26.364c0.35,0.527,0.509,1.167,0.984,1.624l10.254,9.959L285.951,541.148z M373.259,525.756
			l-40.184-38.98l6.217-12.834c0.294-0.606,0.214-1.26,0.382-1.876l24.787-9.026c0.519,0.378,0.887,0.9,1.493,1.186l13.012,5.834
			L373.259,525.756z M449.999,481.437l-51.09-22.887l1.465-14.188c0.075-0.658-0.224-1.255-0.303-1.913l20.213-16.941
			c0.616,0.168,1.148,0.55,1.801,0.606l14.24,1.018L449.999,481.437z M506.975,413.512l-55.846-4.032l-3.486-13.796
			c-0.168-0.662-0.635-1.11-0.929-1.717l13.054-22.589c0.695-0.038,1.362-0.094,2.044-0.29l13.735-3.901L506.975,413.512z
			 M483.415,345.542l-7.98-11.78c-0.383-0.569-0.989-0.84-1.456-1.297l4.593-26.089c0.574-0.252,1.241-0.188,1.76-0.565
			l11.588-8.363l45.359,32.777L483.415,345.542z"/>
		<path d="M145.771,268.705c-0.469,4.593-0.707,9.267-0.707,14.022c0,77.366,62.94,140.307,140.328,140.307
			c77.38,0,140.32-62.94,140.32-140.307c0-77.38-62.94-140.32-140.32-140.32C212.933,142.402,152.902,196.717,145.771,268.705z
			 M407.044,282.722c0,67.066-54.577,121.643-121.652,121.643c-1.146,0-2.269-0.149-3.398-0.168V161.238
			c1.129-0.04,2.252-0.168,3.398-0.168C352.467,161.07,407.044,215.647,407.044,282.722z"/>
	</g>
</g>
</svg>
    `;
  }
}
customElements.define('excla-icon', Excla);

class Lang extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" xml:space="preserve">
<style type="text/css">
	.st0{fill:none;stroke:currentColor;stroke-width:45;stroke-miterlimit:10;}
</style>
<g>
	<path style="fill:currentColor" d="M250,45c54.8,0,106.2,21.3,145,60c38.7,38.7,60,90.2,60,145s-21.3,106.2-60,145c-38.7,38.7-90.2,60-145,60
		s-106.2-21.3-145-60c-38.7-38.7-60-90.2-60-145s21.3-106.2,60-145C143.8,66.3,195.2,45,250,45 M250,0C111.9,0,0,111.9,0,250
		s111.9,250,250,250s250-111.9,250-250S388.1,0,250,0L250,0z"/>
</g>
<g>
	<line class="st0" x1="50" y1="176.7" x2="450" y2="176.7"/>
</g>
<g>
	<line class="st0" x1="50" y1="323.3" x2="450" y2="323.3"/>
</g>
<g>
	<line class="st0" x1="250" y1="480" x2="250" y2="20"/>
</g>
<path class="st0" d="M250,20c-8.3,5.3-125.3,83.9-125.3,230s117,224.7,125.3,230"/>
<path class="st0" d="M250,20c8.3,5.3,125.3,83.9,125.3,230S258.3,474.7,250,480"/>
</svg>
    `;
  }
}
customElements.define('lang-icon', Lang);

class Plus extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" xml:space="preserve">
<style type="text/css"> .st2{fill:none;stroke:currentColor;stroke-width:45;stroke-linecap:round;stroke-miterlimit:10;}
</style>
<line class="st2" x1="250" y1="24" x2="250" y2="476"/>
<line class="st2" x1="24" y1="250" x2="476" y2="250"/>
</svg>
    `;
  }
}
customElements.define('plus-icon', Plus);

class Play extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" fill="currentColor" xml:space="preserve">
<path d="M433.4,309c56.2-32.5,56.2-85.6,0-118.1L126.7,13.9C70.4-18.6,24.4,8,24.4,72.9v354.2c0,64.9,46,91.5,102.3,59L433.4,309z"
	/>
</svg>
    `;
  }
}
customElements.define('play-icon', Play);

class Pause extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" xml:space="preserve">
<style type="text/css">
	.st1{fill:none;stroke:currentColor;stroke-width:100;stroke-linecap:round;stroke-miterlimit:10;}
</style>
<line class="st1" x1="150" y1="449.5" x2="150" y2="50.5"/>
<line class="st1" x1="350" y1="449.5" x2="350" y2="50.5"/>
</svg>
    `;
  }
}
customElements.define('pause-icon', Pause);

class Mix extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" fill="currentColor" xml:space="preserve">
<path d="M127,104v45c0,11-9,20-20,20H86v307c0,12.4-10.1,22.5-22.5,22.5S41,488.4,41,476V169H20c-11,0-20-9-20-20v-45
	c0-11,9-20,20-20h21V24C41,11.6,51.1,1.5,63.5,1.5S86,11.6,86,24v60h21C118,84,127,93,127,104z"/>
<path d="M313.5,294v45c0,11-9,20-20,20h-21v117c0,12.4-10.1,22.5-22.5,22.5s-22.5-10.1-22.5-22.5V359h-21c-11,0-20-9-20-20v-45
	c0-11,9-20,20-20h21V24c0-12.4,10.1-22.5,22.5-22.5s22.5,10.1,22.5,22.5v250h21C304.5,274,313.5,283,313.5,294z"/>
<path d="M500,234v45c0,11-9,20-20,20h-21v177c0,12.4-10.1,22.5-22.5,22.5S414,488.4,414,476V299h-21c-11,0-20-9-20-20v-45
	c0-11,9-20,20-20h21V24c0-12.4,10.1-22.5,22.5-22.5S459,11.6,459,24v190h21C491,214,500,223,500,234z"/>
</svg>
    `;
  }
}
customElements.define('mix-icon', Mix);

class Phone extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 500 500"  xml:space="preserve">
<style type="text/css">
	.st4{fill:currentColor;}
</style>
<g>
	<path class="st4" d="M256,47.18C127.063,47.18,0,97.628,0,155.555c0,49.742,0,54.334,0,54.644c0,13.168,10.67,23.838,23.838,23.838
		h90.602c13.168,0,23.837-10.67,23.837-23.838v-41.116c0-12,8.93-22.132,20.83-23.647c0,0,32.619-6.7,96.893-6.7
		s96.892,6.7,96.892,6.7c11.901,1.514,20.83,11.647,20.83,23.647V210.2c0,13.168,10.67,23.838,23.837,23.838h90.602
		c13.168,0,23.838-10.67,23.838-23.838c0-0.311,0-4.903,0-54.644C512,97.628,384.938,47.18,256,47.18z"/>
	<path class="st4" d="M348.499,210.2v-39.913l-0.687-0.142c-0.247-0.049-31.55-6.184-91.812-6.184
		c-60.262,0-91.564,6.134-91.876,6.198l-0.622,0.127V210.2c0,27.057-22.012,49.062-49.062,49.062H51.39v141.992
		c0,35.109,28.458,63.566,63.56,63.566H397.05c35.102,0,63.56-28.458,63.56-63.566V259.262h-63.05
		C370.51,259.262,348.499,237.257,348.499,210.2z M331.057,368.105v33.92h-33.913v-33.92H331.057z M331.057,314.465v33.921h-33.913
		v-33.921H331.057z M331.057,260.833v33.913h-33.913v-33.913H331.057z M272.96,368.105v33.92h-33.913v-33.92H272.96z
		 M272.96,314.465v33.921h-33.913v-33.921H272.96z M239.047,294.746v-33.913h33.913v33.913H239.047z M214.863,368.105v33.92H180.95
		v-33.92H214.863z M214.863,314.465v33.921H180.95v-33.921H214.863z M214.863,260.833v33.913H180.95v-33.913H214.863z"/>
</g>
</svg>
    `;
  }
}
customElements.define('phone-icon', Phone);

class Playlist extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" fill="currentColor" xml:space="preserve">
<style type="text/css">
	.st5{fill:none;stroke:currentColor;stroke-width:45;stroke-linecap:round;stroke-miterlimit:10;}
</style>
<line class="st5" x1="23.2" y1="418.6" x2="299.2" y2="418.6"/>
<g>
	<path d="M481.3,443.6c23.8-13.8,23.8-36.2,0-50l-86.6-50c-23.8-13.7-43.3-2.5-43.3,25l0,100c0,27.5,19.5,38.7,43.3,25L481.3,443.6z
		"/>
</g>
<line class="st5" x1="23.2" y1="287" x2="476.3" y2="287"/>
<line class="st5" x1="23.2" y1="155.4" x2="476.3" y2="155.4"/>
<line class="st5" x1="23.2" y1="23.8" x2="476.3" y2="23.8"/>
</svg>
    `;
  }
}
customElements.define('playlist-icon', Playlist);

class Tidal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.016 5.323l-5.339 5.339-5.339-5.339-5.339 5.339 5.339 5.339 5.339-5.339 5.339 5.339-5.339 5.339 5.339 5.339 5.339-5.339-5.339-5.339 5.339-5.339zM21.391 10.661l5.302-5.307 5.307 5.307-5.307 5.307z"/>
</svg>
    `;
  }
}
customElements.define('tidal-icon', Tidal);

class Spotify extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 0c-8.803 0-16 7.197-16 16s7.197 16 16 16c8.803 0 16-7.197 16-16s-7.12-16-16-16zM23.36 23.12c-0.319 0.479-0.881 0.64-1.36 0.317-3.76-2.317-8.479-2.797-14.083-1.52-0.557 0.165-1.037-0.235-1.199-0.72-0.156-0.557 0.24-1.036 0.719-1.197 6.084-1.36 11.365-0.803 15.521 1.76 0.563 0.24 0.64 0.88 0.401 1.36zM25.281 18.719c-0.401 0.563-1.12 0.803-1.683 0.401-4.317-2.641-10.88-3.437-15.916-1.839-0.641 0.156-1.365-0.161-1.521-0.803-0.161-0.64 0.156-1.359 0.797-1.52 5.844-1.761 13.041-0.876 18 2.161 0.484 0.24 0.724 1.041 0.323 1.599zM25.443 14.24c-5.125-3.043-13.683-3.36-18.563-1.839-0.801 0.239-1.599-0.24-1.839-0.964-0.239-0.797 0.24-1.599 0.959-1.839 5.683-1.681 15.041-1.359 20.964 2.161 0.719 0.401 0.957 1.36 0.557 2.079-0.401 0.563-1.36 0.801-2.079 0.401z"></path>
</svg>
    `;
  }
}
customElements.define('spotify-icon', Spotify);

class Folder extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
	.st6{fill:none;stroke:currentColor;stroke-width:45;stroke-miterlimit:10;}
</style>
<g>
	<path d="M450,440.5H50c-27.6,0-50-22.4-50-50v-281h450c27.6,0,50,22.4,50,50v231C500,418.1,477.6,440.5,450,440.5z"/>
	<path class="st6" d="M22.5,109.5c0-27.6,22.3-50,49.8-50h160.4c27.5,0,49.8,22.4,49.8,50"/>
</g>
</svg>
    `;
  }
}
customElements.define('folder-icon', Folder);

class Back extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
	.st7{fill:none;stroke:currentColor;stroke-width:45;stroke-linecap:round;stroke-miterlimit:10;}
</style>
<g>
	<path d="M250,45c54.8,0,106.2,21.3,145,60c38.7,38.7,60,90.2,60,145s-21.3,106.2-60,145c-38.7,38.7-90.2,60-145,60
		s-106.2-21.3-145-60c-38.7-38.7-60-90.2-60-145s21.3-106.2,60-145C143.8,66.3,195.2,45,250,45 M250,0C111.9,0,0,111.9,0,250
		s111.9,250,250,250s250-111.9,250-250S388.1,0,250,0L250,0z"/>
</g>
<g>
	<path class="st7" d="M215.7,334.1l-62.9-62.9c-11.7-11.7-11.7-30.8,0-42.5l62.9-62.9"/>
	<line class="st7" x1="356" y1="250" x2="144" y2="250"/>
</g>
</svg>
    `;
  }
}
customElements.define('back-icon', Back);