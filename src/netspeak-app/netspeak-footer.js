define(["meta","./netspeak-element.js","./netspeak-navigator.js"],function(meta,_netspeakElement,_netspeakNavigator){"use strict";meta=babelHelpers.interopRequireWildcard(meta);class NetspeakFooter extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-footer"}static get template(){return _netspeakElement.html`
<style>
	:host {
		display: block;
		background-color: #F8F8F8;
		font-size: 90%;
		color: #666;
		padding: 2em 3em;
		line-height: 1.4;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	a.current-lang {
		text-decoration: underline;
	}

	a:hover {
		text-decoration: underline;
	}


	#netspeak-points {
		display: inline;

	}

	#language-section {
		display: inline;

	}

	#webis-copyright {
		float: right;
	}

	.bullet {
		padding: 0 5px;
	}

	.pipe {
		padding: 0 15px;
	}


	@media screen and (max-width: 750px) {
		:host {
			padding: 2em;
		}

		#netspeak-points,
		#language-section,
		#webis-copyright {
			display: block;
			float: none;
			text-align: center;
			padding: .5em 0;
		}

		.pipe {
			display: none;
		}

	}
</style>


<div>
	<div id="webis-copyright">
		&copy; 2019 <a href="https://webis.de" target="_blank">Webis group</a>
		<span class="bullet">&bullet;</span>
		<a href="https://webis.de/people.html" target="_blank" id="contact">Contact</a>
		<span class="bullet">&bullet;</span>
		<a href="https://webis.de/impressum.html" target="_blank" id="impressum-and-privacy">Impressum&nbsp;/&nbsp;Terms&nbsp;/&nbsp;Privacy</a>
	</div>
	<div id="netspeak-points">
		<a href="[[getPageUrl('help')]]" id="help">Help</a>
	</div>
	<div id="language-section">
		<span class="pipe">|</span>
		<a class$="[[isCurrentLang('de')]]" href$="[[getLangUrl('de')]]">Deutsch</a>
		<span class="bullet">&bullet;</span>
		<a class$="[[isCurrentLang('en')]]" href$="[[getLangUrl('en')]]">English</a>
	</div>
</div>

<div style="clear: both"></div>
		`}/**
	 * Returns the URL a given page will have.
	 *
	 * @param {string} page The page.
	 * @returns {string} The URL.
	 */getPageUrl(page){return _netspeakNavigator.NetspeakNavigator.getPageUrl(page)}/**
	 * Returns the URL the current page with a given language will have.
	 *
	 * @param {string} lang The language.
	 * @returns {string} The URL.
	 */getLangUrl(lang){return _netspeakNavigator.NetspeakNavigator.getLanguageUrl(lang)}/**
	 * Returns CSS classes indicating whether the given language is the current language.
	 *
	 * @param {string} lang The language.
	 * @returns {string} The CSS class string.
	 */isCurrentLang(lang){return _netspeakNavigator.NetspeakNavigator.currentLanguage==lang?"current-lang":""}}(0,_netspeakElement.registerElement)(NetspeakFooter)});