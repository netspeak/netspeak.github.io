define(["exports","meta","../netspeak-app/netspeak-element.js","../netspeak-app/netspeak-navigator.js","../netspeak-app/netspeak-search-bar.js","../netspeak-app/netspeak-corpus-selector.js"],function(_exports,meta,_netspeakElement,_netspeakNavigator,_netspeakSearchBar,_netspeakCorpusSelector){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.NetspeakSearch=void 0;meta=babelHelpers.interopRequireWildcard(meta);class NetspeakSearch extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-search"}static get properties(){return{}}static get template(){return _netspeakElement.html`

		<style>
			:host {
				display: block;
			}

			#wrapper {
				padding: 3em 1em;
				position: relative;
			}

			netspeak-corpus-selector {
				margin: 0 0 2em auto;
			}

			/*
			 * INFO
			 */

			#info {
				background-color: #EEE;
				border: 1px solid #BBB;
				box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.2);
				clear: both;
				position: relative;

				margin-top: 2em;
			}

			#info #quick-examples {
				padding: .5em 1em;
				position: relative;
			}

			#info .example-container {
				clear: both;
				position: relative;
			}

			#info .example-container::after {
				clear: both;
				content: " ";
				display: table;
				position: relative;
				width: 100%;
			}

			#info .example-container a {
				color: #333;
			}

			#info .example,
			#info .explanation {
				padding: .25em 0;
			}

			#info .example {
				float: left;
			}

			#info .explanation {
				float: right;
				width: 50%;
			}

			.highlight-red {
				color: #c5000b;
			}

			.highlight-blue {
				color: #2d7db3;
			}

			@media screen and (max-width: 750px) {

				#wrapper {
					padding: 3em 0;
				}

				netspeak-search-bar {
					font-size: 18px;
					--icon-size: 20px;
					--icon-padding: 6px;
					--result-item-data-margin: 0 .5em;
					--input-margin: .5em;
					--result-border-right: none;
					--result-border-left: none;
				}

				netspeak-corpus-selector {
					font-size: 18px;
					margin: 0 .5em 2em auto;
				}

				/*
				 * INFO
				 */
				#info {
					margin-left: .5em;
					margin-right: .5em;
				}

			}

			@media screen and (max-width: 500px) {

				#info .example,
				#info .explanation {
					float: none;
					display: block;
					width: auto;
				}

				#info .explanation>* {
					padding-left: .5em;
				}

			}
		</style>

		<div id="wrapper">
			<netspeak-corpus-selector></netspeak-corpus-selector>
			<netspeak-search-bar></netspeak-search-bar>

			<div id="info">
				<div id="quick-examples">

					<div class="example-container">
						<div class="example">
							<a href="[[getQueryUrl('how to ? this')]]">how to
								<span class="highlight-red">?</span> this</a>
						</div>
						<div class="explanation">
							<span>
								<span id="explanation-qmark-1">The</span>
								<span class="highlight-red">?</span>
								<span id="explanation-qmark-2">finds one word.</span>
							</span>
						</div>
					</div>

					<div class="example-container">
						<div class="example">
							<a href="[[getQueryUrl('see ... works')]]">see
								<span class="highlight-red">...</span> works</a>
						</div>
						<div class="explanation">
							<span>
								<span id="explanation-dots-1">The</span>
								<span class="highlight-red">...</span>
								<span id="explanation-dots-2">finds many words.</span>
							</span>
						</div>
					</div>

					<div class="example-container">
						<div class="example">
							<a href="[[getQueryUrl('it\\'s [ great well ]')]]">it's
								<span class="highlight-blue">[</span> great well
								<span class="highlight-blue">]</span>
							</a>
						</div>
						<div class="explanation">
							<span>
								<span id="explanation-option-1">The</span>
								<span class="highlight-blue">[]</span>
								<span id="explanation-option-2">compare options.</span>
							</span>
						</div>
					</div>

					<div class="example-container">
						<div class="example">
							<a href="[[getQueryUrl('and knows #much')]]">and knows
								<span class="highlight-blue">#</span>much</a>
						</div>
						<div class="explanation">
							<span>
								<span id="explanation-synonym-1">The</span>
								<span class="highlight-blue">#</span>
								<span id="explanation-synonym-2">finds similar words.</span>
							</span>
						</div>
					</div>

					<div class="example-container">
						<div class="example">
							<a href="[[getQueryUrl('{ more show me }')]]">
								<span class="highlight-blue">{</span> more show me
								<span class="highlight-blue">}</span>
							</a>
						</div>
						<div class="explanation">
							<span>
								<span id="explanation-order-1">The</span>
								<span class="highlight-blue">{}</span>
								<span id="explanation-order-2">check the order.</span>
							</span>
						</div>
					</div>

				</div>
			</div>
		</div>
		`}constructor(){super()}/**
	 * The method called after the element was added to the DOM.
	 */connectedCallback(){super.connectedCallback();/** @type {import("../netspeak-app/netspeak-search-bar").NetspeakSearchBar} */this.searchBar=this.shadowRoot.querySelector("netspeak-search-bar");/** @type {import("../netspeak-app/netspeak-corpus-selector").NetspeakCorpusSelector} */this.corpusSelector=this.shadowRoot.querySelector("netspeak-corpus-selector");/** @type {HTMLElement} */this.info=this.shadowRoot.querySelector("#info");this._queryChange=()=>{this.updateUrl();clearTimeout(this._writeHistoryInterval);this._writeHistoryInterval=setTimeout(()=>this.writeHistory(),500)};this._valueChange=()=>{this.searchBar.corpus=this.corpusSelector.value;this.searchBar.queryPhrases();this.updateUrl()};this._urlChange=()=>{this.updateElements()};this.searchBar.addEventListener("queryChange",this._queryChange);this.corpusSelector.addEventListener("valueChange",this._valueChange);_netspeakNavigator.NetspeakNavigator.addEventListener("urlChange",this._urlChange);this.updateElements();this.loadHistory()}/**
	 * The method called after the element was removed from the DOM.
	 */disconnectedCallback(){super.disconnectedCallback();clearInterval(this._writeHistoryInterval);_netspeakNavigator.NetspeakNavigator.removeEventListener("urlChange",this._urlChange);this.corpusSelector.removeEventListener("valueChange",this._valueChange);this.searchBar.removeEventListener("queryChange",this._queryChange);this.corpusSelector=this.searchBar=this.info=void 0}/**
	 * Sets the values of the elements of the page to the values specified in the URL.
	 */updateElements(){if(this._suppressNextUpdate){this._suppressNextUpdate=!1;return}const query=_netspeakNavigator.HashUtil.getParameter(_netspeakNavigator.UrlUtil.getHash(location.href,""),"q",""),corpus=_netspeakNavigator.HashUtil.getParameter(_netspeakNavigator.UrlUtil.getHash(location.href,""),"corpus","");if(corpus){this.searchBar.corpus=corpus;this.corpusSelector.value=corpus}this.searchBar.query=query;this.toggleInfo(!query);setTimeout(()=>{this._suppressNextUpdate=!1},30)}/**
	 * This function will set the URLs query to the current query of the search bar.
	 */updateUrl(){this._suppressNextUpdate=!0;const query=this.searchBar.query,corpus=this.searchBar.corpus;this.toggleInfo(!query);let href=location.href,hash=_netspeakNavigator.UrlUtil.getHash(href,"");location.href=_netspeakNavigator.UrlUtil.setHash(href,_netspeakNavigator.HashUtil.setParameters(hash,{q:query,corpus:corpus}))}toggleInfo(showInfo=void 0){if(!this.info)return;if(showInfo===void 0){showInfo="none"==this.info.style.display}this.info.style.display=showInfo?"block":"none"}/**
	 * Loads the history of a search bar from the cookie.
	 */loadHistory(){try{let history=sessionStorage.getItem("history");if(history){this.searchBar.history.push(...JSON.parse(history))}}catch(error){console.error(error)}}/**
	 * Writes the history of the current search bar to the cookie.
	 */writeHistory(){const thisHistory=Array.from(this.searchBar.history);let oldJson,oldHistory;try{oldJson=sessionStorage.getItem("history");oldHistory=oldJson?JSON.parse(oldJson):[]}catch(error){console.error(error);return}// merge
const map={},addToMap=historyItem=>{const id=historyItem.corpus+";"+historyItem.query;if(!map[id]||map[id].time<historyItem.time)map[id]=historyItem};oldHistory.forEach(addToMap);thisHistory.forEach(addToMap);const newHistory=[];for(const id in map){newHistory.push(map[id])}newHistory.sort((a,b)=>a.time-b.time);const historyLimit=20;if(newHistory.length>historyLimit){newHistory.splice(0,newHistory.length-historyLimit)}const json=JSON.stringify(newHistory);if(sessionStorage.getItem("history")!==oldJson){// modified -> try again
this.writeHistory()}else{sessionStorage.setItem("history",json)}}/**
	 * Returns the URL a given query will have.
	 *
	 * @param {string} query The query.
	 * @param {string} [corpus="web-en"] The corpus.
	 * @returns {string} The URL.
	 */getQueryUrl(query,corpus="web-en"){let href=location.href,hash=_netspeakNavigator.UrlUtil.getHash(href,"");hash=_netspeakNavigator.HashUtil.setPage(hash,"");hash=_netspeakNavigator.HashUtil.setParameter(hash,"corpus",corpus);hash=_netspeakNavigator.HashUtil.setParameter(hash,"q",query);href=_netspeakNavigator.UrlUtil.setHash(href,hash);return href}}_exports.NetspeakSearch=NetspeakSearch;(0,_netspeakElement.registerElement)(NetspeakSearch)});