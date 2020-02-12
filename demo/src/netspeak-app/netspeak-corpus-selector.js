define(["exports","meta","./netspeak-element.js","./netspeak.js","./util.js"],function(_exports,meta,_netspeakElement,_netspeak,_util){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LabelProvider=_exports.NetspeakCorpusSelector=void 0;meta=babelHelpers.interopRequireWildcard(meta);class NetspeakCorpusSelector extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-corpus-selector"}static get properties(){return{value:{type:String,notify:!0,value:"web-en"}}}static get template(){return _netspeakElement.html`
		<style>
			:host {
				display: table;
				padding: 0;
			}

			#wrapper {
				position: relative;
			}

			#wrapper .button {
				background-color: transparent;
				font-size: inherit;
				border: 1px solid #BBB;
				cursor: pointer;
				display: inline-block;
				margin-left: .5em;
				padding: .5em .75em;
			}

			#wrapper .button.selected {
				background-color: #F8F8F8;
				border-color: #888;
			}

			#wrapper .button:hover {
				background-color: #EEE;
				color: #000;
			}
		</style>

		<div id="wrapper">
		</div>
		`}/**
	 * Creates an instance of NetspeakCorpusSelector.
	 *
	 * @param {Netspeak} [api] The Netspeak API point to query the displayed corpora.
	 * @param {LabelProvider} [labelProvider] The label provider of the selector.
	 */constructor(api,labelProvider){super();this.api=api||_netspeak.Netspeak.getInstance();this.labelProvider=labelProvider||new LabelProvider;this.addEventListener("value-changed",()=>this._setValue(this.value))}/**
	 * The method called after the element was added to the DOM.
	 */connectedCallback(){super.connectedCallback();this.api.queryCorpora().then(corporaInfo=>{/** @type {HTMLElement} */const wrapper=this.shadowRoot.querySelector("#wrapper");wrapper.innerHTML="";// sort corpora
const defaultSorting=["web-en","web-de"];corporaInfo.corpora.sort((a,b)=>{let indexA=defaultSorting.indexOf(a.key),indexB=defaultSorting.indexOf(b.key);if(-1===indexA)indexA=defaultSorting.length;if(-1===indexB)indexB=defaultSorting.length;return indexA-indexB});for(const corpus of corporaInfo.corpora){const value=corpus.key,button=(0,_util.appendNewElements)(wrapper,`button.button[data-value="${value}"]`);button.addEventListener("click",()=>{this._setValue(value)});const text=(0,_util.appendNewElements)(button,"span");text.textContent=corpus.name;this.labelProvider.getLabel(corpus).then(label=>{text.innerHTML=label}).catch(e=>{console.error(e)})}this._setValue(this.value||corporaInfo.default||"web-en")})}_setValue(value){if(value!==this.value){this.value=value}for(const element of this.shadowRoot.querySelectorAll(".selected")){element.classList.remove("selected")}const newSelected=this.shadowRoot.querySelector(`[data-value="${value}"]`);if(newSelected){newSelected.classList.add("selected")}}}_exports.NetspeakCorpusSelector=NetspeakCorpusSelector;const localLabels=(0,_netspeakElement.loadLocalization)(NetspeakCorpusSelector).then(json=>{if(json&&json.custom&&json.custom.labels){return(/** @type {Object<string, string>} */json.custom.labels)}return!1});/**
 * A LabelProvider converts corpora into HTML source code.
 */class LabelProvider{/**
	 * Provides the label of the given corpus.
	 *
	 * @param {import("./netspeak.js").Corpus} corpus The corpus.
	 * @returns {Promise<string>} The label source code.
	 */getLabel(corpus){return localLabels.then(labels=>{if(labels&&labels[corpus.name]){return(0,_util.encode)(labels[corpus.name])}else{return(0,_util.encode)(corpus.name)}})}}_exports.LabelProvider=LabelProvider;(0,_netspeakElement.registerElement)(NetspeakCorpusSelector)});