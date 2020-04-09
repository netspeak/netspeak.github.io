define(["exports","meta","./netspeak-element.js","./netspeak.js","./util.js","./netspeak-navigator.js","./netspeak-example-queries.js","./snippets.js"],function(_exports,meta,_netspeakElement,_netspeak,_util,_netspeakNavigator,_netspeakExampleQueries,_snippets){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.PhraseFormatter=_exports.NetspeakSearchBar=void 0;meta=babelHelpers.interopRequireWildcard(meta);/**
 * @typedef QueryPhrasesOptions
 * @property {"append" | "overwrite"} [options.appendMode="overwrite"] How the queried phrases will be integrated into the existing ones. "append": All of the new phrases will be added. "overwrite": All already queried phrases will be removed and the newly queried will be added.
 * @property {number} [options.topk=this.initialLimit] The maximum number of phrases queried.
 * @property {number} [options.maxfreq=2**64-1] The maximum frequency a phrase is allowed to have.
 * @property {boolean} [options.focusInput=false] Whether the input box will be focused after the phrases were displayed.
 * @property {import("./netspeak.js").NetspeakSearchOptions} [options.searchOptions={}] The search option passed to Netspeak.search.
 */const sharedStyles=_netspeakElement.html`
	<style>

		table,
		tbody,
		tr,
		td {
			margin: 0;
			padding: 0;
			border-spacing: 0;
		}

		button {
			background-color: transparent;
			border: none;
			margin: 0;
			padding: 0;
		}

		:not(.btn-img)>.btn-img {
			background-image: none !important;
			background-color: transparent;
			border: none;
			cursor: pointer;
			display: inline-block;
			margin: 0;
			opacity: .5;
			padding: var(--icon-padding, 4px);
			position: relative;
		}

		:not(.btn-img)>.btn-img:hover,
		:not(.btn-img)>.btn-img.selected {
			opacity: .8;
		}

		.btn-img>span.btn-img {
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
			display: inline-block;
			margin: 0;
			padding: 0;
			width: var(--icon-size, 16px);
			height: var(--icon-size, 16px);
		}

		.btn-img>span.btn-text {
			display: inline-block;
			line-height: var(--icon-size, 16px);
			padding: 0;
			vertical-align: top;
		}

	</style>
`;/**
 * The Netspeak search bar can query and display phrases queried using the Netspeak API.
 */class NetspeakSearchBar extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-search-bar"}static get properties(){return{query:{type:String,value:"",observer:"_queryChanged"},corpus:{type:String,value:_netspeak.Netspeak.defaultCorpus,notify:!0},initialLimit:{type:Number,value:40},readonly:{type:Boolean,value:!1},slowSearch:{type:Boolean,value:!1},initialExamplesLimit:{type:Number,value:6},historyHidden:{type:Boolean,value:!1,notify:!0,observer:"_historyHiddenChanged"},infoVisibleByDefault:{type:Boolean,value:!1,notify:!0}}}static get template(){return _netspeakElement.html`
		${sharedStyles}

		<style>
			:host {
				--border-color: #BBB;
				--left-right-padding: 0;
				--left-right-border-style: solid;

				display: block;
				font-size: 1em;
				border-color: var(--border-color);
				border-style: solid var(--left-right-border-style) none var(--left-right-border-style);
				border-width: 1px;
			}

			/*
			 * INPUT
			 */

			#box {
				display: block;
				padding: 0 var(--left-right-padding);
				border-bottom: 1px solid var(--border-color);
				font-family: var(--input-font-family, inherit);
			}

			#box table,
			#box table td:first-child {
				width: 100%;
			}

			#box input {
				background-color: transparent;
				border: none;
				display: block;
				box-sizing: border-box;
				width: 100%;
				padding: .5em;
				font-family: var(--input-font-family, inherit);
				font-size: 110%;
			}

			#box input::-ms-clear {
				display: none;
			}

			#box button.btn-img {
				padding-top: .5em;
				padding-bottom: .5em;
			}

			#box #example-queries-button>* {
				background-image: url("/src/img/i.svg");
			}

			#box #clear-button>* {
				background-image: url("/src/img/x.svg");
			}

			#box #history-button>* {
				background-image: url("/src/img/history.svg");
			}

			/*
			 * DROP DOWN
			 */

			#drop-down {
				position: absolute;
				background-color: white;
				box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.2);
				border: 1px solid var(--border-color);
				width: 15em;
				margin-left: -15em;
				z-index: 10;
				font-size: 1em;
			}

			#drop-down .option {
				padding: .5em 1em;
				border-bottom: 1px solid var(--border-color);
				cursor: pointer;
			}

			#drop-down .option:nth-child(2n) {
				background-color: #F8F8F8;
			}

			#drop-down .option:hover {
				background-color: #EEE;
			}

			#drop-down .option:last-child {
				border-bottom: none;
			}

			/*
			 * WRAPPER
			 */

			#result-wrapper {
				border-bottom: 1px solid var(--border-color);
				font-family: var(--result-font-family, inherit);
			}

			/*
			 * ERRORS
			 */

			div#errors {
				display: block;
				border-bottom: 1px solid var(--border-color);
			}

			div#errors>p {
				background-color: #EAA;
				color: #300;
				display: block;
				padding: 1em;
				margin: 0;
				word-break: break-word;
			}

			/*
			 * WARNINGS
			 */

			div#warnings {
				display: table;
				box-sizing: border-box;
				width: 100%;

				background-color: #EDA;
				border-bottom: 1px solid var(--border-color);
			}

			div#warnings>p {
				color: #420;
				display: block;
				margin: 1em;
				word-break: break-word;
			}

			div#warnings span.suggestion:hover {
				cursor: pointer;
				text-decoration: underline;
			}

			/*
			 * EXAMPLE QUERIES
			 */

			netspeak-example-queries {
				border-bottom: 1px solid var(--border-color);
			}

			/*
			 * NO PHRASES FOUND
			 */

			#no-phrases-found-container {
				border-bottom: 1px solid var(--border-color);

				display: block;
				font-family: var(--result-font-family, inherit);
				color: #444;
				padding: 0 var(--left-right-padding);
			}

			#no-phrases-found-container p {
				font-style: italic;
				padding: .3em .5em;
				margin: 0;
			}

			/*
			 * PRELOAD IMAGES
			 */

			#img-pre-loader {
				/* this is a simple trick to preload images */
				background-image: url('/src/img/loading.svg'), url('/src/img/load-more.svg'), url("/src/img/plus.svg"), url("/src/img/minus.svg"), url("/src/img/pin.svg");
			}
		</style>

		<div id="box">
			<table>
				<tr>
					<td>
						<input type="text" id="query-input" value="{{query}}" on-change="_queryInputChange" on-keyup="_queryInputKeyUp" />
					</td>
					<td>
						<button class="btn-img" id="example-queries-button" on-click="_toggleExampleQueriesVisibility">
							<span class="btn-img"></span>
						</button>
					</td>
					<td>
						<button class="btn-img" id="clear-button" on-click="clear">
							<span class="btn-img"></span>
						</button>
					</td>
					<td>
						<button class="btn-img" id="history-button" on-click="_historyButtonClick">
							<span class="btn-img"></span>
						</button>
					</td>
				</tr>
			</table>
		</div>

		<div id="errors" style="display: none"></div>
		<div id="warnings" style="display: none"></div>

		<netspeak-example-queries corpus$="{{corpus}}"></netspeak-example-queries>

		<div id="result-wrapper" style="display: none">
			<netspeak-search-bar-result-list></netspeak-search-bar-result-list>
		</div>

		<div id="no-phrases-found-container" style="display: none">
			<p id="no-phrases-found">No phrases found.</p>
		</div>

		<div id="img-pre-loader"></div>
		`}/**
	 * The queried phrases of the search bar.
	 *
	 * @type {PhraseCollection}
	 */get queriedPhrases(){return this._queriedPhrases}/**
	 * The history of the current search bar. The item with the highest index is the most recent.
	 *
	 * The history is limited to 1024 items.
	 *
	 * @readonly
	 * @type {Object[]}
	 */get history(){if(!this._history)this._history=[];const limit=1024;if(this._history.length>limit)this._history.splice(0,this._history.length-limit);return this._history}/**
	 * Creates a new instance of NetspeakSearchBar.
	 *
	 */constructor(){super();this.netspeakApi=_netspeak.Netspeak.getInstance();this._queriedPhrases=new _netspeak.PhraseCollection;this._queryCount=0;// for typing purposes
/** @type {string} */this.query=this.query;/** @type {string} */this.corpus=this.corpus;/** @type {number} */this.initialLimit=this.initialLimit;/** @type {boolean} */this.readonly=this.readonly;/** @type {boolean} */this.slowSearch=this.slowSearch;/** @type {number} */this.initialExamplesLimit=this.initialExamplesLimit;/** @type {boolean} */this.historyHidden=this.historyHidden;/** @type {boolean} */this.infoVisibleByDefault=this.infoVisibleByDefault}/**
	 * The method called after the element was added to the DOM.
	 */connectedCallback(){super.connectedCallback();/** @type {HTMLInputElement} */this._queryInputElement=this.shadowRoot.querySelector("#query-input");/** @type {HTMLButtonElement} */this._exampleQueriesButton=this.shadowRoot.querySelector("#example-queries-button");/** @type {HTMLButtonElement} */this._clearButton=this.shadowRoot.querySelector("#clear-button");/** @type {HTMLButtonElement} */this._historyButton=this.shadowRoot.querySelector("#history-button");/** @type {import("./netspeak-example-queries").NetspeakExampleQueries} */this._exampleQueries=this.shadowRoot.querySelector("netspeak-example-queries");/** @type {NetspeakSearchBarResultList} */this._resultList=this.shadowRoot.querySelector("netspeak-search-bar-result-list");/** @type {NetspeakSearchBarResultList} */this._noPhraseFoundContainer=this.shadowRoot.querySelector("#no-phrases-found-container");this._queryInputElement.onblur=()=>{// this is a hack to ignore inputs from blur event.
// blur events are dispatched after the input event, so in the exactly wrong order.
// to combat this, we will set a flag of 3ms after which it is reset.
// input event will be delayed by 1ms to hopefully see the blur flag.
this._inputBlurred=!0;setTimeout(()=>{this._inputBlurred=!1},3)};this._historyHiddenChanged(this.historyHidden);this._resultList.addEventListener("load-more",()=>this._loadMoreItems());this._exampleQueries.addEventListener("query-selected",e=>{// @ts-ignore
this.query=e.detail.query});this._setExampleQueriesVisibility(this.infoVisibleByDefault)}/**
	 * Fires a new event with the given name and values.
	 *
	 * The event will be dispatched from this instance.
	 *
	 * @param {string} name The name of the event.
	 * @param {string} newValue The new value.
	 * @param {string} oldValue The old value.
	 * @param {boolean} [cancelable=false] Whether the event can be cancelled.
	 * @returns {boolean} Whether the event was cancelled.
	 */dispatchChangeEvent(name,newValue,oldValue,cancelable=!1){return this.dispatchEvent(new CustomEvent(name,{detail:{newValue:newValue,oldValue:oldValue},bubbles:!1,cancelable:cancelable}))}_queryChanged(newValue,oldValue){if(this._queryChanging)throw Error("You cannot modify the query during a query change event");this._queryChanging=!0;try{const focusInput=!!this._focusInput;this._focusInput=!1;// hide examples if they weren't used
if(this._exampleQueries&&0===this._exampleQueries.clickCounter){this._setExampleQueriesVisibility(!1)}this.dispatchChangeEvent("queryChange",newValue,oldValue);this.queryPhrases({focusInput:focusInput})}finally{this._queryChanging=!1}}_queryInputChange(e){if(this.readonly)return;const query=e.target.value,counter=this._queryCount;setTimeout(()=>{if(this._queryCount!==counter){// too slow
return}if(this._inputBlurred){// blurred
return}this._focusInput=!0;if(query!=this.query){this.query=query}else{this.queryPhrases()}},1)}_queryInputKeyUp(e){if(this.slowSearch||this.readonly)return;const newQuery=e.target.value;if((0,_netspeak.normalizeQuery)(newQuery)===(0,_netspeak.normalizeQuery)(this.query))return;this._focusInput=!0;this.query=newQuery;this._addToHistory({query:newQuery,corpus:this.corpus},!0)}/**
	 * Queries phrases using the Netspeak API adding them to or overwriting the phrases queried before.
	 *
	 * @param {QueryPhrasesOptions} [options={}]
	 */queryPhrases(options={}){this._queryCount++;const searchOptions=options.searchOptions||{},request={query:this.query,corpus:this.corpus,focusInput:!!options.focusInput};// request
// add to history
if(request.query&&request.corpus)this._addToHistory({query:request.query,corpus:request.corpus},!0);const addToRequest=(prop,defaultValue=void 0)=>{if(options[prop]!=void 0)request[prop]=options[prop];else if(defaultValue!==void 0)request[prop]=defaultValue};addToRequest("topk",this.initialLimit);addToRequest("maxfreq");// a more expensive search for the first query
if(!this._hadFirstQuery){this._hadFirstQuery=!0;if(!("topkMode"in searchOptions)){searchOptions.topkMode="fill"}}const append="append"==options.appendMode;let searchResult;if(!(0,_netspeak.normalizeQuery)(request.query)){// note that this optimization will also catch the first empty query from the polymer query change event.
searchResult=Promise.resolve(/** @type {import("./netspeak").NetspeakSearchResult} */{phrases:[],unknownWords:[]})}else{searchResult=this.netspeakApi.search(request,searchOptions)}searchResult.then(result=>{this._onSearchSuccess(result,request,append)}).catch(reason=>{this._onSearchError(reason,request,append)})}/**
	 *
	 * @param {import("./netspeak").NetspeakSearchResult} result
	 * @param {{ query: string, corpus: string, focusInput: boolean }} request
	 * @param {boolean} append
	 */_onSearchSuccess(result,request,append=!1){if(this.query!==request.query)return;// too late
let newPhrases=result.phrases.length;/** @type {string[]} */this.unknownWords=result.unknownWords;this.errorMessage="";if(append){newPhrases=this._queriedPhrases.addAll(result.phrases)}else{this._queriedPhrases=_netspeak.PhraseCollection.from(result.phrases)}this._resultList.showLoadMore=!result.complete&&0<newPhrases;this.update(request.focusInput)}/**
	 *
	 * @param {string | Error} message
	 * @param {{ query: string, corpus: string, focusInput: boolean }} request
	 * @param {boolean} append
	 * @param {number} delay
	 */_onSearchError(message,request,append=!1,delay=1e3){if(this.query!==request.query)return;// too late
// delay
if(0<delay){setTimeout(()=>this._onSearchError(message,request,append,0),delay);return}// disable load more
this._resultList.showLoadMore=!1;console.error(message,request);this.errorMessage=message;this.unknownWords=[];this.update(request.focusInput)}update(focusInput=!1){// declare variables
const queriedPhrases=this.queriedPhrases;this._resultList.phrases=queriedPhrases.toArray();// wrapper
/** @type {HTMLDivElement} */const wrapper=this.shadowRoot.querySelector("#result-wrapper"),warnings=this.shadowRoot.querySelector("#warnings");// output unknown words
/** @type {HTMLElement} */this.unknownWords=(this.unknownWords||[]).filter(Boolean);if(0<this.unknownWords.length){warnings.style.display=null;this._updateWarnings(warnings,this.unknownWords)}else{warnings.style.display="none"}// output errors
/** @type {HTMLElement} */const errors=this.shadowRoot.querySelector("#errors");if(this.errorMessage){errors.style.display=null;this._updateErrorMessage(errors,this.errorMessage);// the wrapper should stay as is
}else{errors.style.display="none";// wrapper
wrapper.style.display=!this._resultList.isEmpty?"block":"none"}// show "no phrase found" message
if(0===this._resultList.phrases.length&&!this._resultList.showLoadMore&&this.query){this._noPhraseFoundContainer.style.display=null}else{this._noPhraseFoundContainer.style.display="none"}if(focusInput&&this._queryInputElement){this._queryInputElement.focus()}}/**
	 * @param {HTMLElement} container
	 * @param {readonly string[]} unknownWords Must be non-empty
	 */_updateWarnings(container,unknownWords){container.innerHTML="";this.localMessage("unknown-word","Unknown word ${word}.").then(unknownWordMessage=>{unknownWordMessage=(0,_util.encode)(unknownWordMessage);unknownWords.forEach(word=>{const p=(0,_util.appendNewElements)(container,"P");p.innerHTML=unknownWordMessage.replace(/\$\{word\}/g,()=>{return`<em>${word}</em>`});// TODO: Add REAL support for suggestion for all-lower-case indexes.
const lower=word.toLowerCase();if("web-en"===this.corpus&&word!==lower){const WORD_BOUNDARY=/^[|[\]{}\s]$/;let suggestion=this.query,startIndex=0;// replace all occurrences
while(startIndex<suggestion.length){const index=suggestion.indexOf(word,startIndex);if(-1===index)break;// check boundaries
const before=suggestion[index-1],after=suggestion[index+word.length];if(before&&!WORD_BOUNDARY.test(before)||after&&!WORD_BOUNDARY.test(after)){startIndex=index+word.length;continue}suggestion=suggestion.slice(0,index)+lower+suggestion.slice(index+word.length);startIndex=index+lower.length}this.localMessage("did-you-mean","Did you mean ${word}?").then(didYouMeanMessage=>{p.appendChild(document.createTextNode(" "));didYouMeanMessage.split(/\$\{word\}/g).forEach((segment,i)=>{if(0<i){const span=(0,_util.appendNewElements)(p,"em","span");span.className="suggestion";span.textContent=lower;span.addEventListener("click",()=>{this.query=suggestion})}p.appendChild(document.createTextNode(segment))})})}})})}/**
	 * @param {HTMLElement} container
	 * @param {string | Error} details
	 */_updateErrorMessage(container,details){container.innerHTML="";Promise.all([this.localMessage("invalid-query",`Your input cannot be processed because it does not follow the Netspeak query syntax.
					Please correct your input.
					<br><br>
					More information about the Netpspeak query syntax can be found
					<a href="https://netspeak.org/help.html#how" target="_blank">here</a>.`),this.localMessage("full-details","Full details")]).then(([invalidQuery,fullDetails])=>{(0,_util.appendNewElements)(container,"P").innerHTML=`${invalidQuery}
				<br>
				<br>
				<details><summary>${(0,_util.encode)(fullDetails)}</summary>
					<p>${(0,_util.encode)(details+"")}</p>
				</details>`})}_loadMoreItems(){/** @type {QueryPhrasesOptions} */const options={appendMode:"append",topk:this.initialLimit,searchOptions:{topkMode:"fill"}};// max frequency
if(this.queriedPhrases&&0<this.queriedPhrases.length){options.maxfreq=this.queriedPhrases.at(this.queriedPhrases.length-1).frequency}this.queryPhrases(options)}/**
	 * Clears the current query and removes all queried and pinned phrases.
	 *
	 */clear(){this._resultList.clear();this._queriedPhrases=new _netspeak.PhraseCollection;this.query=""}_toggleExampleQueriesVisibility(){const visible="none"!==this._exampleQueries.style.display;this._setExampleQueriesVisibility(!visible)}_setExampleQueriesVisibility(visible){if(visible){this._exampleQueries.style.display=null;this._exampleQueriesButton.classList.add("selected")}else{this._exampleQueries.style.display="none";this._exampleQueriesButton.classList.remove("selected")}}addToHistory(){this._addToHistory({query:this.query,corpus:this.corpus})}_addToHistory(item,delayed=!1){if(!item)throw Error("item has to be defined");window.clearTimeout(this._addToHistoryTimeout);if(delayed){this._addToHistoryTimeout=window.setTimeout(()=>{this._addToHistory(item)},1e3);return}const copy={query:item.query,corpus:item.corpus,time:new Date().getTime()};// ignore empty queries
if(copy.query!==void 0&&null!==copy.query){if(""===copy.query)return;if(!(0,_netspeak.normalizeQuery)(copy.query))return}if(!copy.query)throw Error("item.query has to be defined");if(!copy.corpus)throw Error("item.corpus has to be defined");copy.query=copy.query.trim();const history=this.history;// remove less recent entries
for(let i=history.length-1;0<=i;i--){const it=history[i];if(!it||it.query==copy.query&&it.corpus==copy.corpus){history.splice(i,1)}}history.push(copy)}_historyHiddenChanged(newValue){if(!this._historyButton)return;this._historyButton.parentElement.style.display=newValue?"none":null}_historyButtonClick(){this._toggleHistoryDropDown()}_toggleHistoryDropDown(show=void 0){if(this.historyHidden||!this._historyButton)return;const container=this._historyButton.parentElement;if(show===void 0)show=!container.hasAttribute("history-visible");if(show){container.setAttribute("history-visible","");// current history
const history=this.history.filter(i=>i.corpus===this.corpus).reverse(),historyLimit=10;if(history.length>historyLimit)history.splice(historyLimit,history.length-historyLimit);const positioner=(0,_util.appendNewElements)(container,"DIV#drop-down-positioner");positioner.style.paddingLeft=this._historyButton.clientWidth+"px";const dd=(0,_util.appendNewElements)(positioner,"BUTTON#drop-down");dd.onblur=()=>{container.removeAttribute("history-visible");dd.parentElement.remove()};// new option function
const newOpt=query=>{const opt=(0,_util.appendNewElements)(dd,"DIV.option");opt.innerHTML=query;opt.onclick=()=>{this._toggleHistoryDropDown(!1);this.query=query}};history.forEach(i=>newOpt(i.query));if(0==history.length)newOpt("");dd.focus()}else{container.removeAttribute("history-visible");// @ts-ignore
container.querySelector("#drop-down").blur()}}}/**
 * The result list of the Netspeak search bar.
 *
 * This element will handle everything that is contained in the result list including:
 *
 * - Formatting the result phrases
 * - Notifying that more phrases are requested
 * - Pinning phrases
 * - Querying and displaying examples
 */_exports.NetspeakSearchBar=NetspeakSearchBar;class NetspeakSearchBarResultList extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-search-bar-result-list"}static get properties(){return{showLoadMore:{type:Boolean,notify:!0},phrases:{type:Array,notify:!0},formatter:{type:PhraseFormatter,notify:!0}}}static get template(){return _netspeakElement.html`
		${sharedStyles}

		<style>

			*::-moz-selection {
				text-shadow: none !important;
				background-color: rgba(32, 64, 255, .8);
				color: #FFF;
			}
			*::selection {
				text-shadow: none !important;
				background-color: rgba(32, 64, 255, .8);
				color: #FFF;
			}


			#result-list>div {
				background-color: var(--item-background-color);
				width: 100%;
				padding: 0;
			}

			#result-list>div:nth-child(2n) {
				--item-background-color: #F7F7F7;
			}
			#result-list>div:nth-child(2n+1) {
				--item-background-color: #FFF;
			}
			#result-list>div[options-visible],
			#result-list>div:hover {
				--item-background-color: #e2ebf1;
			}


			/**
			 * div.phrase-container
			 */

			#result-list .phrase-container {
				background-repeat: no-repeat;
				background-position-x: calc(100% + 1px);
				background-position-y: -2px;
				background-image: url("/src/img/frequency-bar.svg");

				cursor: pointer;
				padding: 0 var(--left-right-padding);
				width: 100%;
				box-sizing: border-box;
			}
			#result-list .phrase-container::after {
				content: "";
				clear: both;
				display: block;
			}


			#result-list span.text,
			#result-list span.freq {
				text-shadow: 0 1px 1px #FFF;
				padding: .3em .5em;
			}

			#result-list span.text {
				float: left;
			}
			#result-list [pinned] span.text {
				font-weight: bold;
			}

			#result-list span.freq {
				float: right;
				text-align: right;
			}

			#result-list span.freq>span.percentage {
				display: inline-block;
				padding-left: .5em;
				width: 4em;
			}

			#result-list span.text span {
				color: #333;
			}

			#result-list span.text span.asterisk,
			#result-list span.text span.q-mark,
			#result-list span.text span.plus,
			#result-list span.text span.regex {
				color: #c5000b;
			}

			#result-list span.text span.option-set,
			#result-list span.text span.order-set,
			#result-list span.text span.dict-set,
			#result-list span.text span.option-set-regex,
			#result-list span.text span.order-set-regex {
				color: #2d7db3;
			}


			/**
			 * div.options
			 */

			#result-list .options {
				background: rgb(247, 247, 247);
				border-bottom: 1px solid #CCC;
				border-top: 1px solid #CCC;
				color: #444;

				position: relative;
			}
			#result-list>div:last-child .options {
				border-bottom: none;
			}


			/*
			 * div.buttons
			 */

			#result-list .options .buttons {
				text-align: right;
				margin: .25em var(--left-right-padding);
			}

			#result-list .pinned>span.btn-img {
				background-image: url("/src/img/pin.svg");
			}
			#result-list [pinned] .pinned {
				opacity: 1;
			}

			#result-list .copy>span.btn-img {
				background-image: url("/src/img/copy.svg");
			}


			/*
			 * EXAMPLES
			 */

			#result-list .loading {
				cursor: default;
				opacity: 1;
			}
			#result-list .loading>span.btn-img {
				animation-name: show-via-opacity;
				animation-duration: 1s;
				background-image: url("/src/img/loading.svg");
			}
			@keyframes show-via-opacity {
				from {
					opacity: 0;
				}

				20% {
					opacity: 0;
				}

				to {
					opacity: 100%;
				}
			}

			#result-list .options .examples-container {
				padding: 0 1em 1em 1em;
			}
			#result-list .options .examples-list {
				font-size: 90%;
				word-break: break-word;
			}
			#result-list .options .load-more-examples {
				text-align: center;
			}

			#result-list .options .examples-list .source {
				padding-left: .25em;
			}

			#result-list .options .examples-list .source a {
				color: inherit;
				opacity: .7;
				text-decoration: none;
			}
			#result-list .options .examples-list .source a:hover {
				text-decoration: underline;
			}

			#result-list .options .load-more {
				cursor: pointer;
				display: block;
				position: relative;
				width: 100%;
			}

			#result-list .options .load-more>* {
				margin-left: auto;
				margin-top: auto;
			}


			/*
			 * LOAD MORE
			 */

			#load-more-button {
				border-top: 1px solid var(--border-color);
				cursor: pointer;
				position: relative;
				margin: 0;
				padding: 0;
				display: block;
				width: 100%;
			}

			#load-more-button:hover {
				background-color: #EEE;
			}

			/* These are for both the result list load-more button and the examples load-more buttons */

			*:hover>span.load-more-img {
				opacity: 1;
			}
			span.load-more-img {
				opacity: .5;
				display: block;
				width: 4em;
				height: 2em;
				padding: 0;
				margin: auto;
				background-position: center;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url('/src/img/load-more.svg');
			}

		</style>

		<div id="result-list"></div>

		<button id="load-more-button" style="display: none;">
			<span class="load-more-img"></span>
		</button>
		`}get isEmpty(){return 0===this.pinnedPhrases.size+this.phrases.length}constructor(){super();this.showLoadMore=!1;this.examplePageSize=6;/** @type {Phrase[]} */this.phrases=[];/** @type {Map<string, Phrase>} */this.pinnedPhrases=new Map;this.snippets=_snippets.DEFAULT_SNIPPETS;this.formatter=PhraseFormatter.getInstance();this.invalidate=(0,_util.createNextFrameInvoker)(()=>this._render());this.addEventListener("phrases-changed",()=>this.invalidate());this.addEventListener("formatter-changed",()=>this.invalidate())}connectedCallback(){super.connectedCallback();/** @type {HTMLElement} */this._resultList=this.shadowRoot.querySelector("#result-list");/** @type {HTMLElement} */this._loadMore=this.shadowRoot.querySelector("#load-more-button");this.addEventListener("show-load-more-changed",()=>{if(this._loadMore){this._loadMore.style.display=this.showLoadMore?"block":"none"}});this._loadMore.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("load-more",{bubbles:!1,cancelable:!1}))})}clear(){this.phrases=[];this.pinnedPhrases.clear();this.showLoadMore=!1;this.invalidate()}_render(){if(!this.isConnected)return;const collection=new NewPhraseCollection(this._getAllPhrasesToRender()),existingElementPhraseIdsSet=new Set;// update or delete current DOM elements
for(let i=this._resultList.children.length-1;0<=i;i--){const element=/** @type {HTMLElement} */this._resultList.children[i],elementPhrase=this._getResultElementPhrase(element);if(!elementPhrase){// delete
element.remove();continue}const mapEntry=collection.byId(elementPhrase.id);if(mapEntry){// update
existingElementPhraseIdsSet.add(elementPhrase.id);this._setResultElementPinned(element,elementPhrase);this._setResultElementStats(element,elementPhrase,collection)}else{// delete
element.remove()}}// insert new DOM elements
for(const phrase of collection){if(!existingElementPhraseIdsSet.has(phrase.id)){const element=this._createResultElement(phrase,collection);this._setResultElementPinned(element,phrase);this._insertResultElement(element,phrase)}}}/**
	 * Create a new result element for the given phrase.
	 *
	 * @param {Phrase} phrase
	 * @param {NewPhraseCollection} collection
	 * @returns {HTMLElement}
	 */_createResultElement(phrase,collection){const element=document.createElement("div");this._setResultElementPhrase(element,phrase);const phraseContainer=(0,_util.appendNewElements)(element,"div.phrase-container");phraseContainer.addEventListener("click",()=>{this._toggleResultElementOptions(element)});(0,_util.appendNewElements)(phraseContainer,"div","span.text");(0,_util.appendNewElements)(phraseContainer,"span.freq");this._setResultElementStats(element,phrase,collection);return element}_toggleResultElementPinned(element){const phrase=this._getResultElementPhrase(element);if(this.pinnedPhrases.has(phrase.id)){this.pinnedPhrases.delete(phrase.id)}else{this.pinnedPhrases.set(phrase.id,phrase)}this._setResultElementPinned(element,phrase)}/**
	 * @param {HTMLElement} element
	 */_toggleResultElementOptions(element){/** @type {HTMLElement} */const options=element.querySelector(".options");if(!options){this._addResultElementOptions(element);element.setAttribute("options-visible","")}else{const visible="none"!==options.style.display;if(visible){options.style.display="none";element.removeAttribute("options-visible")}else{options.style.display="block";element.setAttribute("options-visible","")}}}/**
	 * @param {HTMLElement} element
	 */_addResultElementOptions(element){const phrase=this._getResultElementPhrase(element),options=(0,_util.appendNewElements)(element,"DIV.options"),buttons=(0,_util.appendNewElements)(options,"div.buttons"),copyBtn=(0,_util.appendNewElements)(buttons,"SPAN.btn-img.copy");//copyBtn.onclick = () => console.log(`Copy "${phrase.text}"`);
(0,_util.appendNewElements)(copyBtn,"SPAN.btn-img");const copyText=(0,_util.appendNewElements)(copyBtn,"SPAN.btn-text"),setTextToCopy=()=>this.localMessage("copy","Copy").then(msg=>{copyText.textContent=msg}),setTextToCopied=()=>this.localMessage("copied","Copied").then(msg=>{copyText.textContent=msg});setTextToCopy();const text=phrase.text;(0,_util.createClipboardButton)(copyBtn,()=>{setTextToCopied();setTimeout(()=>setTextToCopy(),3e3);return text});// pin button
const pinningBtn=(0,_util.appendNewElements)(buttons,"SPAN.btn-img.pinned");pinningBtn.onclick=()=>this._toggleResultElementPinned(element);(0,_util.appendNewElements)(pinningBtn,"SPAN.btn-img");const pinningText=(0,_util.appendNewElements)(pinningBtn,"SPAN.btn-text");this.localMessage("pin","Pin").then(msg=>{pinningText.textContent=msg});// examples
this._addResultElementOptionsExamples(options,phrase)}/**
	 * @param {HTMLElement} options
	 * @param {Phrase} phrase
	 */_addResultElementOptionsExamples(options,phrase){const examplesContainer=(0,_util.appendNewElements)(options,"DIV.examples-container"),examplesList=(0,_util.appendNewElements)(examplesContainer,"div.examples-list"),loadMoreExamplesContainer=(0,_util.appendNewElements)(examplesContainer,"div.load-more-examples"),loadingIcon=(0,_util.appendNewElements)(loadMoreExamplesContainer,"SPAN.btn-img.loading");(0,_util.appendNewElements)(loadingIcon,"SPAN.btn-img");// load more button
const button=(0,_util.appendNewElements)(loadMoreExamplesContainer,"BUTTON.load-more");(0,_util.appendNewElements)(button,"SPAN.load-more-img");button.addEventListener("click",()=>loadMoreExamples());// load examples function
const exampleSupplier=this.snippets.getSupplier(phrase.text,this.examplePageSize),emphasize=this._createEmphasizer(phrase.text,200);let didSupplyExamples=!1;const loadMoreExamples=()=>{loadingIcon.style.display=null;button.style.display="none";const examplePromise=exampleSupplier();examplePromise.then(examples=>{if(!1===examples){loadingIcon.style.display="none";button.style.display="none";const p=(0,_util.appendNewElements)(examplesList,"DIV","P"),i=(0,_util.appendNewElements)(p,"I");if(didSupplyExamples){this.localMessage("no-further-examples-found","No further examples found.").then(msg=>{i.textContent=msg})}else{this.localMessage("no-examples-found","No examples found.").then(msg=>{i.textContent=msg})}}else{loadingIcon.style.display="none";button.style.display=null;for(const example of examples){didSupplyExamples=!0;// add paragraph
const p=(0,_util.appendNewElements)(examplesList,"DIV","P");p.innerHTML=emphasize(example.text);// add source(s) of the example
for(const name in example.urls){const element=example.urls[name],span=(0,_util.appendNewElements)(p,"SPAN.source");span.appendChild(document.createTextNode("["));const a=(0,_util.appendNewElements)(span,"A");a.setAttribute("href",element);a.setAttribute("target","_blank");a.textContent=name;span.appendChild(document.createTextNode("]"))}}}}).catch(e=>{console.error(e);loadingIcon.style.display="none";button.style.display="none";const p=(0,_util.appendNewElements)(examplesList,"DIV","P");this.localMessage("failed-to-load-examples","Failed to load examples.").then(msg=>{p.textContent=msg})})};// load examples right now.
loadMoreExamples()}/**
	 * Creates a function which given some plain text will return HTML code where the given phrase is emphasized.
	 *
	 * @param {string} phrase
	 * @param {number} context The number of characters allowed around the phrase.
	 * @returns {(text: string) => string}
	 */_createEmphasizer(phrase,context){const emphasisRE=new RegExp(phrase.replace(/[\\/(){}[\]|?+*^$.]/g,"\\$&")+"|(<)|(&)","ig");return text=>{/** @type {number | undefined} */let index;text.replace(emphasisRE,(m,lt,amp,i)=>{if(lt||amp)return"";index=i;return""});if(index!=void 0){if(text.length>index+context){text=text.substr(0,index+context).replace(/\s+\S*$/," ...")}if(index>context){text=text.substr(index-context).replace(/^\S*\s+/,"... ")}}return text.replace(emphasisRE,(m,lt,amp,index)=>{if(lt)return"&lt;";if(amp)return"&amp;";index=index;return`<strong>${(0,_util.encode)(m)}</strong>`})}}/**
	 * @param {HTMLElement} element
	 * @param {Phrase} phrase
	 */_setResultElementPinned(element,phrase){if(this.pinnedPhrases.has(phrase.id)){element.setAttribute("pinned","")}else{element.removeAttribute("pinned")}}/**
	 * Sets the values of all statistics of the given result DOM element.
	 *
	 * @param {HTMLElement} element
	 * @param {Phrase} phrase
	 * @param {NewPhraseCollection} collection
	 */_setResultElementStats(element,phrase,collection){/** @type {HTMLDivElement} */const phraseContainer=element.querySelector(".phrase-container"),relativeFreq=phrase.frequency/collection.maxFrequency;phraseContainer.style.backgroundSize=`${100*(.618*relativeFreq)}% 130%`;const text=this.formatter.formatText(phrase,collection),freq=this.formatter.formatFrequency(phrase,collection),percent=this.formatter.formatPercentage(phrase,collection);phraseContainer.querySelector(".text").innerHTML=text;phraseContainer.querySelector(".freq").innerHTML=`${freq}<span class="percentage">${percent}</span>`}/**
	 * Inserts the given element into the result list.
	 *
	 * @param {HTMLElement} element
	 * @param {Phrase} phrase
	 */_insertResultElement(element,phrase){if(0===this._resultList.children.length){this._resultList.appendChild(element)}else{// we usually append the element, so it's fast to search linearly from back to front
// than more complex methods such as binary search
const getFrequency=element=>this._getResultElementPhrase(element).frequency;for(let i=this._resultList.children.length-1;0<=i;i--){const child=this._resultList.children[i];if(phrase.frequency<=getFrequency(child)){this._resultList.insertBefore(element,child.nextSibling);return}}// if get here, the element has to be inserted as the first node
this._resultList.insertBefore(element,this._resultList.firstChild)}}/**
	 * Returns all phrases which have to be displayed in the order in which they have to be displayed.
	 *
	 * @returns {Phrase[]}
	 */_getAllPhrasesToRender(){/** @type {Phrase[]} */const phrases=[],includedTexts=new Set;/**
		 * Adds all of the given phrases to the list of rendered phrases.
		 *
		 * This will excluded already added phrases such that only the one will be displayed.
		 *
		 * @param {Iterable<Phrase>} phrasesToAdd
		 */function addAllPhrases(phrasesToAdd){for(const phrase of phrasesToAdd){if(!includedTexts.has(phrase.id)){phrases.push(phrase);includedTexts.add(phrase.id)}}}addAllPhrases(this.phrases);addAllPhrases(this.pinnedPhrases.values());// sort by frequency (desc)
phrases.sort((a,b)=>b.frequency-a.frequency);return phrases}/**
	 * @param {HTMLElement} element
	 * @returns {Phrase | undefined}
	 */_getResultElementPhrase(element){return(/** @type {any} */element.__phrase)}/**
	 * @param {HTMLElement} element
	 * @param {Phrase} phrase
	 */_setResultElementPhrase(element,phrase){/** @type {any} */element.__phrase=phrase}}/** @typedef {import('./netspeak').Phrase} Phrase */ /**
 * A PhraseFormatter converts phrases into HTML source code.
 */class PhraseFormatter{/**
	 * Creates an instance of PhraseFormatter.
	 */constructor(){this.local=_netspeakNavigator.NetspeakNavigator.currentLanguage}/**
	 * Formats the frequency of the given phrase.
	 *
	 * @param {Phrase} phrase The phrase.
	 * @param {NewPhraseCollection} collection The phrase collection.
	 * @returns {string} The formatted string.
	 */formatFrequency(phrase,collection){if(this._frequencyFormatter===void 0)this._frequencyFormatter=new Intl.NumberFormat(this.local,{style:"decimal"});const formatter=this._frequencyFormatter;let freq=phrase.frequency;// floor to 2 significant digits if the frequency has more than 3 digits
if(1e3<=freq){let log=Math.ceil(Math.log10(freq)),factor=Math.pow(10,log-2);freq=Math.floor(freq/factor)*factor}return formatter.format(freq)}/**
	 * Formats the frequency percentage of the given phrase.
	 *
	 * @param {Phrase} phrase The phrase.
	 * @param {NewPhraseCollection} collection The phrase collection.
	 * @returns {string} The formatted string.
	 */formatPercentage(phrase,collection){this._smallPercentageFormatter=this._smallPercentageFormatter||new Intl.NumberFormat(this.local,{style:"percent",minimumFractionDigits:1,maximumFractionDigits:1});this._largePercentageFormatter=this._largePercentageFormatter||new Intl.NumberFormat(this.local,{style:"percent",minimumFractionDigits:0,maximumFractionDigits:0});const ratio=phrase.frequency/collection.totalFrequency,useLarge=100<=Math.round(1e3*ratio),formatter=useLarge?this._largePercentageFormatter:this._smallPercentageFormatter;// this just means that if the rounded percentage is >= 10.0% then we'll use the other formatter
return formatter.format(ratio)}/**
	 * Formats the phrase text of the given phrase.
	 *
	 * @param {Phrase} phrase The phrase.
	 * @param {NewPhraseCollection} collection The phrase collection.
	 * @returns {string} The formatted string.
	 */formatText(phrase,collection){let html="",append=str=>{if(""===html)html+=str;else html+=" "+str};/**
		 * @param {string} str
		 */phrase.words.forEach(w=>{let classes=[];// is operator
if(w.type!=_netspeak.Word.Types.WORD){classes.push("operator")}// add type
classes.push((_netspeak.Word.nameOfType(w.type)+"").toLowerCase().replace(/[^a-z]+/,"-"));append("<span class=\""+classes.reduce((x,y)=>x+" "+y)+"\">"+w.text+"</span>")});return html}/**
	 * Returns the default PhraseFormatter used by the NetspeakSearchBar.
	 *
	 * @returns {PhraseFormatter} A formatter.
	 */static getInstance(){return DEFAULT_PHRASE_FORMATTER}}_exports.PhraseFormatter=PhraseFormatter;class NewPhraseCollection{/**
	 * @param {readonly Phrase[]} phrases
	 */constructor(phrases){this.phrases=phrases;this._map=new Map(phrases.map(p=>[p.id,p]));this.maxFrequency=phrases.reduce((max,curr)=>Math.max(max,curr.frequency),0);this.totalFrequency=phrases.reduce((total,curr)=>total+curr.frequency,0)}/**
	 * Returns the phrase with the given id of `undefined`.
	 *
	 * @param {string} id
	 * @returns {Phrase | undefined}
	 */byId(id){return this._map.get(id)}[Symbol.iterator](){return this.phrases[Symbol.iterator]()}}const DEFAULT_PHRASE_FORMATTER=new PhraseFormatter;(0,_netspeakElement.registerElement)(NetspeakSearchBar);(0,_netspeakElement.registerElement)(NetspeakSearchBarResultList)});