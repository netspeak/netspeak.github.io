define(["exports","meta","../netspeak-app/netspeak-element.js","./page-styles.js"],function(_exports,meta,_netspeakElement,_pageStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.NetspeakPublisher=void 0;meta=babelHelpers.interopRequireWildcard(meta);class NetspeakPublisher extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-publisher"}static get properties(){return{}}static get template(){return _netspeakElement.html`${_pageStyles.styles}

<div class="article">
	<h1 id="publisher">Publisher</h1>

	<p id="subject">
		Netspeak is subject to research and development at the Web Technology &amp; Information Systems Group at
		Bauhaus-Universität
		Weimar.
	</p>

	<h3 id="contact">Contact</h3>

	<p>
		Martin Potthast
		<br> Bauhaus-Universität Weimar
		<br> Fakultät Medien
		<br> 99423 Weimar
	</p>

	<p>
		<span id="email">Email:</span>
		<a href="mailto:info@netspeak.org">info@netspeak.org</a>
		<br>
		<span id="phone">Phone:</span> +49 3643 58 3720
		<br>
		<span id="fax">Fax:</span> +49 3643 58 3709
	</p>

</div>
		`}}_exports.NetspeakPublisher=NetspeakPublisher;(0,_netspeakElement.registerElement)(NetspeakPublisher)});