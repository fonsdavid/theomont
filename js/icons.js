class Insta extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="currentColor" viewBox="0 0 500 500" xml:space="preserve"><g><path d="M400,45c14.6,0,28.4,5.8,38.8,16.2C449.2,71.6,455,85.4,455,100v300c0,14.6-5.8,28.4-16.2,38.8 C428.4,449.2,414.6,455,400,455H100c-14.6,0-28.4-5.8-38.8-16.2C50.8,428.4,45,414.6,45,400V100c0-14.6,5.8-28.4,16.2-38.8 C71.6,50.8,85.4,45,100,45H400 M400,0H100C45,0,0,45,0,100v300c0,55,45,100,100,100h300c55,0,100-45,100-100V100 C500,45,455,0,400,0L400,0z"/></g><g><path d="M250,157.5c51,0,92.5,41.5,92.5,92.5S301,342.5,250,342.5S157.5,301,157.5,250S199,157.5,250,157.5 M250,112.5 c-75.9,0-137.5,61.6-137.5,137.5S174.1,387.5,250,387.5S387.5,325.9,387.5,250S325.9,112.5,250,112.5L250,112.5z"/></g><g><circle cx="391" cy="109" r="29"/></g></svg>
    `;
  }
}
customElements.define('insta-icon', Insta);

class Excla extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="currentColor" viewBox="0 0 500 500" xml:space="preserve"><g><g><path d="M250.7,500c-13.2,0-24.3-4.5-33.3-13.5c-9-9-13.5-19.6-13.5-31.9c0-13.2,4.5-24.1,13.5-32.6c9-8.5,20.1-12.7,33.3-12.7 c13.2,0,24.1,4.2,32.6,12.7c8.5,8.5,12.7,19.4,12.7,32.6c0,12.3-4.3,22.9-12.7,31.9C274.8,495.5,263.9,500,250.7,500z M250,339.2 c-14.8,0-27.6-18-28.4-40L211.8,40C211,18,228.3,0,250.3,0h0c22,0,39.3,18,38.4,40l-10.3,259.3C277.6,321.2,264.8,339.2,250,339.2 z"/></g></g></svg>
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