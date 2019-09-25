define(["exports","meta","../netspeak-app/netspeak-element.js","../netspeak-app/netspeak-navigator.js","./page-styles.js"],function(_exports,meta,_netspeakElement,_netspeakNavigator,_pageStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.NetspeakHelp=void 0;meta=babelHelpers.interopRequireWildcard(meta);class NetspeakHelp extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-help"}static get properties(){return{}}static get template(){return _netspeakElement.html`${_pageStyles.styles}
<div class="article">

	<h1 id="help">Help</h1>

	<h2 id="how">How Netspeak works</h2>

	<p id="how-desc">
		Netspeak is a search engine designed to help you to express yourself in a foreign language by providing you with insight on how common native speakers use certain phrases. The following examples illustrate how you can use Netspeak to query phrases.
	</p>
	<p>
		<a href="[[getPageUrl('examples')]]" id="examples-link">Examples</a>
	</p>

	<h2 id="for-developers">For developers</h2>

	<ul>
		<li><a href="[[getPageUrl('developer')]]" id="developer-link">Developer page</a></li>
		<li><a href="https://github.com/netspeak" target="_blank" id="github-link">GitHub</a></li>
	</ul>

	<h2 id="contact">Contact</h2>

	<p>
		<span id="email">Email:</span>
		<a href="mailto:info@netspeak.org">info@netspeak.org</a>
	</p>

</div>
		`}getPageUrl(page){return _netspeakNavigator.NetspeakNavigator.getPageUrl(page)}}_exports.NetspeakHelp=NetspeakHelp;(0,_netspeakElement.registerElement)(NetspeakHelp)});