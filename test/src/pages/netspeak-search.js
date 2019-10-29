define(["exports","meta","../netspeak-app/netspeak-element.js","../netspeak-app/netspeak-search-bar.js","../netspeak-app/netspeak-corpus-selector.js"],function(_exports,meta,_netspeakElement,_netspeakSearchBar,_netspeakCorpusSelector){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.NetspeakSearch=void 0;meta=babelHelpers.interopRequireWildcard(meta);class NetspeakSearch extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-search"}static get template(){return _netspeakElement.html`

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

			netspeak-search-bar {
				--result-font-family: 'Verdana', 'Geneva', sans-serif;
			}

			@media screen and (max-width: 750px) {

				#wrapper {
					padding: 3em 0;
				}

				netspeak-search-bar {
					--icon-size: 20px;
					--icon-padding: 6px;
					--result-item-data-margin: 0 .5em;
					--input-margin: .5em;
					--result-border-right: none;
					--result-border-left: none;
				}

				netspeak-corpus-selector {
					margin: 0 .5em 2em auto;
				}

			}

		</style>

		<div id="wrapper">
			<netspeak-corpus-selector></netspeak-corpus-selector>
			<netspeak-search-bar info-visible-by-default></netspeak-search-bar>
		</div>
		`}constructor(){super()}/**
	 * The method called after the element was added to the DOM.
	 */connectedCallback(){super.connectedCallback();/** @type {import("../netspeak-app/netspeak-search-bar").NetspeakSearchBar} */this.searchBar=/** @type {any} */this.shadowRoot.querySelector("netspeak-search-bar");/** @type {import("../netspeak-app/netspeak-corpus-selector").NetspeakCorpusSelector} */this.corpusSelector=/** @type {any} */this.shadowRoot.querySelector("netspeak-corpus-selector");this.searchBar.addEventListener("queryChange",()=>{this.updateUrl();clearTimeout(this._writeHistoryInterval);this._writeHistoryInterval=setTimeout(()=>this.writeHistory(),500)});this.corpusSelector.addEventListener("valueChange",()=>{this.searchBar.corpus=this.corpusSelector.value;this.searchBar.queryPhrases();this.updateUrl()});window.addEventListener("hashchange",()=>{this.initializeSettingsFromUrl()});this.initializeSettingsFromUrl();this.loadHistory()}/**
	 * Sets the values of the elements of the page to the values specified in the URL.
	 */initializeSettingsFromUrl(){const params=new URLSearchParams(location.hash.replace(/^#/,"")),query=params.get("q"),corpus=params.get("corpus");if(null!=corpus)this.corpusSelector.value=corpus;if(null!=query)this.searchBar.query=query}/**
	 * This function will set the URLs query to the current query of the search bar.
	 */updateUrl(){const query=this.searchBar.query,corpus=this.searchBar.corpus,params=new URLSearchParams(location.hash.replace(/^#/,""));params.set("q",query);params.set("corpus",corpus);const newUrl=location.href.replace(/#[\s\S]*$/,"")+"#"+params.toString();if(newUrl!==location.href){history.pushState(null,"",newUrl)}}/**
	 * Loads the history of a search bar from the cookie.
	 */loadHistory(){try{let history=sessionStorage.getItem("history");if(history){this.searchBar.history.push(...JSON.parse(history))}}catch(error){console.error(error)}}/**
	 * Writes the history of the current search bar to the cookie.
	 */writeHistory(){const thisHistory=Array.from(this.searchBar.history);let oldJson,oldHistory;try{oldJson=sessionStorage.getItem("history");oldHistory=oldJson?JSON.parse(oldJson):[]}catch(error){console.error(error);return}// merge
const map={},addToMap=historyItem=>{const id=historyItem.corpus+";"+historyItem.query;if(!map[id]||map[id].time<historyItem.time)map[id]=historyItem};oldHistory.forEach(addToMap);thisHistory.forEach(addToMap);const newHistory=[];for(const id in map){newHistory.push(map[id])}newHistory.sort((a,b)=>a.time-b.time);const historyLimit=20;if(newHistory.length>historyLimit){newHistory.splice(0,newHistory.length-historyLimit)}const json=JSON.stringify(newHistory);if(sessionStorage.getItem("history")!==oldJson){// modified -> try again
this.writeHistory()}else{sessionStorage.setItem("history",json)}}}_exports.NetspeakSearch=NetspeakSearch;(0,_netspeakElement.registerElement)(NetspeakSearch)});