define(["exports","./util.js"],function(_exports,_util){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.DEFAULT_SNIPPETS=_exports.GoogleBooksSnippetBackend=_exports.NetspeakSnippetsBackend=_exports.Snippets=void 0;/**
 * @typedef Snippet
 * @property {string} text The clean text content of the snippet.
 * @property {{ [source: string]: string }} urls URLs which link to the source of the snippet.
 * It's possible to declare more than one URL to provide mirror links and alternative sources.
 *
 * @callback SnippetSupplier
 * A generic supplier of snippets.
 *
 * If `false` is returned, the supplier will not supply any additional items.
 * @returns {Promise<Snippet[] | false>}
 *
 * @typedef SnippetBackend
 * @property {(phrase: string, count: number) => SnippetSupplier} getSupplier
 */ /**
 * Creates a new snippet supplier which returns snippets from all given suppliers favouring faster suppliers.
 *
 * @param {SnippetSupplier[]} suppliers
 * @returns {SnippetSupplier}
 */function unfairSupplierCombination(suppliers){suppliers=[...suppliers];/** @type {boolean[]} */const pendingSuppliers=[],pendingResolves=[],cached=[];/**
	 * @type {ResolveFn[]}
	 *
	 * @typedef {(value: Snippet[] | false) => void} ResolveFn
	 */function resolvePendingResolves(){if(0==suppliers.length){pendingResolves.forEach(resolve=>{const fromCache=cached.pop();if(fromCache){resolve(fromCache)}else{resolve(!1)}});pendingResolves.length=0}else{let fromCache;while(pendingResolves.length&&(fromCache=cached.pop())){const resolve=pendingResolves.splice(0,1)[0];resolve(fromCache)}if(pendingResolves.length){callSuppliers()}}}function callSuppliers(){for(let i=0;i<suppliers.length;i++){const pending=pendingSuppliers[i];if(!pending){pendingSuppliers[i]=!0;const supplier=suppliers[i];supplier().then(snippets=>{if(snippets){cached.push(snippets)}return!snippets},e=>{console.log(e);return!0}).then(empty=>{let index=suppliers.indexOf(supplier);if(empty){suppliers.splice(index,1);pendingSuppliers.splice(index,1)}else{pendingSuppliers[index]=!1}resolvePendingResolves()})}}}return()=>{return new Promise(resolve=>{pendingResolves.push(resolve);resolvePendingResolves()})}}/**
 * Creates a new snippet supplier which will always return the exact amount of snippets until the given supplier runs
 * out of snippets.
 *
 * @param {SnippetSupplier} supplier
 * @param {number} count
 * @returns {SnippetSupplier}
 */function exactSupplier(supplier,count){/** Whether all suppliers are empty */let empty=!1,buffer=[];/** @type {Snippet[]} */ /**
	 * @type {ResolveFn[]}
	 *
	 * @typedef {(value: Snippet[] | false) => void} ResolveFn
	 */const pendingResolves=[];let waitingForSupplier=!1;function resolvePendingResolves(){if(empty){pendingResolves.forEach(resolve=>{if(buffer.length){resolve(buffer.splice(0,Math.min(count,buffer.length)))}else{resolve(!1)}});pendingResolves.length=0}else{while(buffer.length>=count&&pendingResolves.length){const resolve=pendingResolves.splice(0,1)[0];resolve(buffer.splice(0,count))}if(pendingResolves.length){callSuppliers()}}}function callSuppliers(){if(waitingForSupplier)return;waitingForSupplier=!0;supplier().then(snippets=>{waitingForSupplier=!1;if(snippets){snippets.forEach(s=>buffer.push(s))}else{empty=!0}},e=>{console.error(e);waitingForSupplier=!1;empty=!0}).then(()=>{resolvePendingResolves()})}return()=>{return new Promise(resolve=>{pendingResolves.push(resolve);resolvePendingResolves()})}}/**
 * Adds a timeout to the given supplier.
 *
 * If the given supplier takes longer than the specified timeout, it's assumed that the supplier could not find
 * more snippets, so an empty array will be returned.
 *
 * @param {SnippetSupplier} supplier
 * @param {number} timeout
 * @returns {SnippetSupplier}
 */function timeoutSupplier(supplier,timeout){if(timeout===1/0)return supplier;let dead=!1;return()=>{if(dead){return Promise.resolve(!1)}let raceIsOver=!1;/** @type {Promise<false>} */const timeoutPromise=new Promise(resolve=>{setTimeout(()=>{if(!raceIsOver){dead=!0;resolve(!1)}},timeout)});return Promise.race([supplier(),timeoutPromise]).then(x=>{raceIsOver=!0;return x},x=>{raceIsOver=!0;throw x})}}/**
 * Returns a new supplier based on the given supplier which will return `false` instead of rejecting.
 *
 * @param {SnippetSupplier} supplier
 * @returns {SnippetSupplier}
 */function nonRejectingSupplier(supplier){let rejected=!1;return()=>{if(rejected)return Promise.resolve(!1);return supplier().catch(e=>{console.log(e);rejected=!0;return!1})}}/**
 * Returns a new supplier based on the given supplier which will return `false` instead of rejecting.
 *
 * @param {SnippetSupplier} supplier
 * @param {(snippet: Snippet) => boolean} filterFn
 * @returns {SnippetSupplier}
 */function filterSupplier(supplier,filterFn){return()=>{return supplier().then(snippets=>{if(snippets){return snippets.filter(filterFn)}return!1})}}class Snippets{/**
	 * @typedef SnippetBackendConfig
	 * @property {SnippetBackend} backend
	 * @property {(count: number) => number} [getCount]
	 * @property {number} [parallel=1] The number of parallel suppliers for the given backend.
	 * @property {number} [timeout] The timeout after which a supplier from the backend will be declared dead.
	 */constructor(){/** @type {SnippetBackendConfig[]} */this.backends=[];this.defaultTimeout=5e3}/**
	 *
	 * @param {string} phrase
	 * @param {number} [count]
	 * @returns {SnippetSupplier}
	 */getSupplier(phrase,count=6){const filter=this._createSnippetFilter(phrase),suppliers=this._createSuppliers(phrase,count).map(s=>{return filterSupplier(s,filter)}),unionSupplier=unfairSupplierCombination(suppliers);return exactSupplier(unionSupplier,count)}/**
	 * Creates a list of suppliers from the current backend config.
	 *
	 * @param {string} phrase
	 * @param {number} count
	 */_createSuppliers(phrase,count){/** @type {SnippetSupplier[]} */const suppliers=[];this.backends.forEach(config=>{/** @type {number | undefined} */let supplierCount=void 0;if(config.getCount){supplierCount=config.getCount(count)}else{supplierCount=count}let supplier=config.backend.getSupplier(phrase,supplierCount);supplier=timeoutSupplier(supplier,config.timeout||this.defaultTimeout);supplier=nonRejectingSupplier(supplier);let parallel=config.parallel;if(parallel==void 0)parallel=1;for(let i=parallel;0<i;i--){suppliers.push(supplier)}});return suppliers}/**
	 *
	 * @param {string} phrase
	 * @returns {(snippet: Snippet) => boolean}
	 */_createSnippetFilter(phrase){phrase=(0,_util.normalizeSpaces)(phrase.toLowerCase());const pastExamples=new Set([""]);return snippet=>{const text=snippet.text.toLowerCase();// The text has to contain the phrase.
if(-1===text.indexOf(phrase))return!1;// The basic idea behind this id is that most duplicate examples are equal character for character,
// so a simple (and fast) hash lookup is sufficient.
// To also filter duplicates which are technically different but don't look very different to
// humans, some additional transformation are performed.
const id=text.replace(/\d+/g,"0");if(pastExamples.has(id))return!1;pastExamples.add(id);return!0}}}/**
 * A snippet backend for Netspeak's internal snippet API based on ChatNoir.
 *
 * @see https://www.chatnoir.eu/doc/api/
 */_exports.Snippets=Snippets;class NetspeakSnippetsBackend{/**
	 * @param {string} phrase
	 * @param {number} count
	 * @returns {SnippetSupplier}
	 */getSupplier(phrase,count){phrase=(0,_util.normalizeSpaces)(phrase);let internalPage=0,noFurtherExamples=!1;// whether the snippet API doesn't have any more examples
return()=>{if(noFurtherExamples){return Promise.resolve(!1)}/**@type {NetspeakSnippetsRequest} */const request={query:phrase,size:count,from:count*internalPage++};return this.search(request).then(res=>{if(0===res.results.length){noFurtherExamples=!0;return!1}/** @type {Snippet[]} */const snippets=[];res.results.forEach(({snippet,target_uri,uuid,index})=>{const chatNoirUrl=`https://www.chatnoir.eu/cache?uuid=${uuid}&index=${encodeURIComponent(index)}`,urls={web:target_uri,cache:chatNoirUrl,plain:`${chatNoirUrl}&plain`};snippets.push({text:(0,_util.normalizeSpaces)((0,_util.textContent)(snippet)),urls})});return snippets})}}/**
	 * The simple search operation of the Snippets API.
	 *
	 * @param {NetspeakSnippetsRequest} request The request details passed to the API.
	 * @returns {Promise<NetspeakSnippetsResponse>}
	 *
	 * @typedef NetspeakSnippetsRequest
	 * @property {string} query
	 * @property {string[]} [index] list of indices to search
	 * @property {number} from result pagination begin
	 * @property {number} size number of results per page
	 *
	 * @typedef NetspeakSnippetsResponse
	 * @property {object} meta global result meta information
	 * @property {number} meta.query_time query time in milliseconds
	 * @property {number} meta.total_results number of total hits
	 * @property {string[]} meta.indices list of indices that were searched
	 * @property {NetspeakSnippetsResponseItem[]} results list of search results
	 *
	 * @typedef NetspeakSnippetsResponseItem
	 * @property {number} score ranking score of this result
	 * @property {string} uuid Webis UUID of this document
	 * @property {string} index index the document was retrieved from
	 * @property {string | null} trec_id TREC ID of the result if available (null otherwise)
	 * @property {string} target_hostname web host this document was crawled from
	 * @property {string} target_uri full web URI
	 * @property {number | null} page_rank page rank of this document if available (null otherwise)
	 * @property {number | null} spam_rank spam rank of this document if available (null otherwise)
	 * @property {string} title document title with highlights
	 * @property {string} snippet document body snippet with highlights
	 * @property {string | null} explanation additional scoring information if explain was set to true
	 */search(request){try{if(!request)throw new Error("request cannot be "+request);// copy request and add defaults
const req=Object.assign({},request);// construct URL
let url="https://snippets.netspeak.org/";url+="_search?query="+encodeURIComponent(req.query);["index","from","size"].forEach(p=>{if(!(p in req))return;let v=req[p];if(!0===v){url+="&"+p}else if(!1===v){// noop
}else{url+="&"+p+"="+encodeURIComponent(v+"")}});// fetch data
return fetch(url).then(res=>res.json())}catch(error){return Promise.reject(error)}}}/**
 * A snippet backend for Google Book's public search API.
 *
 * @see https://developers.google.com/books/docs/v1/using
 */_exports.NetspeakSnippetsBackend=NetspeakSnippetsBackend;class GoogleBooksSnippetBackend{/**
	 * @param {string} phrase
	 * @param {number} count
	 * @returns {SnippetSupplier}
	 */getSupplier(phrase,count){// The API only supports up to 40 results
// https://developers.google.com/books/docs/v1/using#maxResults
const maxResults=Math.min(count,40),q=encodeURIComponent(`"${(0,_util.normalizeSpaces)(phrase)}"`);let startIndex=0,done=!1;return()=>{if(done){return Promise.resolve(!1)}const currentIndex=startIndex;startIndex+=maxResults;// Note: The following type definitions are incomplete
/**
			 * @type {Promise<ErrorJson | GoogleBooksJson>}
			 *
			 * @typedef ErrorJson
			 * @property {ErrorJsonObject} error
			 * @typedef ErrorJsonObject
			 * @property {number} code
			 * @property {string} message
			 *
			 * @typedef GoogleBooksJson
			 * @property {string} kind
			 * @property {number} totalItems
			 * @property {GoogleBooksJsonItem[] | undefined} items
			 * @typedef GoogleBooksJsonItem
			 * @property {string} kind
			 * @property {string} id
			 * @property {string} etag
			 * @property {string} selfLink
			 * @property {GoogleBooksJsonItemVolumeInfo} volumeInfo
			 * @property {GoogleBooksJsonItemSearchInfo} searchInfo
			 * @typedef GoogleBooksJsonItemVolumeInfo
			 * @property {string} title
			 * @property {string[]} authors
			 * @property {string} publishedDate
			 * @property {string | undefined} [description]
			 * @property {string} language
			 * @property {string} previewLink
			 * @property {string} infoLink
			 * @property {string} canonicalVolumeLink
			 * @typedef GoogleBooksJsonItemSearchInfo
			 * @property {string} textSnippet
			 */const promise=fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&startIndex=${currentIndex}&maxResults=${maxResults}`).then(res=>res.json());return promise.then(json=>{if("error"in json){throw new Error(json.error.message)}const items=json.items;if(!items){done=!0;return!1}/** @type {Snippet[]} */const snippets=[];items.forEach(item=>{const urls={"Google Books":item.volumeInfo.previewLink};// we use 3 parts of every result
if(item.volumeInfo){if(item.volumeInfo.title)snippets.push({text:(0,_util.normalizeSpaces)((0,_util.textContent)(item.volumeInfo.title)),urls});if(item.volumeInfo.description)snippets.push({text:(0,_util.normalizeSpaces)((0,_util.textContent)(item.volumeInfo.description)),urls})}if(item.searchInfo&&item.searchInfo.textSnippet)snippets.push({text:(0,_util.normalizeSpaces)((0,_util.textContent)(item.searchInfo.textSnippet)),urls})});return snippets})}}}_exports.GoogleBooksSnippetBackend=GoogleBooksSnippetBackend;const DEFAULT_SNIPPETS=new Snippets;_exports.DEFAULT_SNIPPETS=DEFAULT_SNIPPETS;DEFAULT_SNIPPETS.backends.push({backend:new NetspeakSnippetsBackend,parallel:3,getCount:()=>33},{backend:new GoogleBooksSnippetBackend,parallel:1,getCount:()=>20})});