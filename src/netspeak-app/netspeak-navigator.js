define(["exports","require","./event-system.js"],function(_exports,_require,_eventSystem){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HashUtil=_exports.UrlUtil=_exports.NetspeakNavigator=void 0;_require=babelHelpers.interopRequireWildcard(_require);const eventSystem=new _eventSystem.EventSystem;/** @type {string | undefined} */let defaultPage=void 0,errorPage=void 0,defaultContainer=void 0,autoReload=!0,lastPage=void 0;/** @type {string | undefined} */ /**
 * The component containing the logic for navigation within the Netspeak website.
 *
 * Navigation works by using the hash value of the url (i.g. ../page.html#hash) to determine which page to load.
 */class NetspeakNavigator{/**
	 * The supported languages of the website.
	 *
	 * The first language in this array is the default language.
	 *
	 * @type {string[]}
	 */static get supportedLanguages(){return["en","de"]}/**
	 * The default language of all templates and messages.
	 *
	 * This language will be displayed in the cause that other languages are not available.
	 *
	 * @type {string}
	 */static get defaultLanguage(){return NetspeakNavigator.supportedLanguages[0]}/**
	 * The current language of the document.
	 *
	 * @type {string}
	 */static get currentLanguage(){/**
		 * Returns whether the given string describes a valid language.
		 *
		 * @param {string} l The language string.
		 * @returns {boolean} Whether the language is valid.
		 */function isValid(l){if(!l)return!1;if(!NetspeakNavigator.supportedLanguages.includes(l))return!1;return!0}// lang search parameter of the URL
let lang=(new URL(location.href).searchParams.get("lang")||"").toLowerCase();if(isValid(lang))return lang;// lang attribute of the html tag
lang=(document.documentElement.getAttribute("lang")||"").toLowerCase();if(isValid(lang))return lang;// match against users languages
for(let l of navigator.languages){l=l.toLowerCase();if(isValid(l))return l}// return default language
return NetspeakNavigator.defaultLanguage}/**
	 * The current page.
	 *
	 * If no page is set by the URL, an empty string will be returned.
	 *
	 * This will not change the document itself.
	 *
	 * @type {string}
	 */static get page(){let hash=UrlUtil.getHash(location.href,"");if(!hash)return"";hash=hash.replace(/([\w-]*)[\s\S]*/,"$1");if(!hash)return"";return hash.toLowerCase()}static set page(value){if("string"===typeof value)value=value.toLowerCase();let href=UrlUtil.setHash(location.href,value);if(href!=location.href)location.href=href}/**
	 * The default page.
	 *
	 * If no page is specified by the URL, this page will be used.
	 *
	 * @type {string | undefined}
	 */static get defaultPage(){return defaultPage}static set defaultPage(value){defaultPage=(value+"").toLowerCase()}/**
	 * The error page.
	 *
	 * @type {string | undefined}
	 */static get errorPage(){return errorPage}static set errorPage(value){errorPage=(value+"").toLowerCase()}/**
	 * The default container.
	 *
	 * @type {HTMLElement | undefined}
	 */static get defaultContainer(){return defaultContainer}static set defaultContainer(value){defaultContainer=value}/**
	 * Whether or not changes in the page URL will automatically reload the page.
	 *
	 * Default: true.
	 *
	 * @type {Boolean}
	 */static get autoReload(){return autoReload}static set autoReload(value){value=!!value;NetspeakNavigator.removeEventListener("pageChange",NetspeakNavigator.onUrlChange);if(value){NetspeakNavigator.addEventListener("pageChange",NetspeakNavigator.onUrlChange)}autoReload=value}static onUrlChange(){NetspeakNavigator.reloadPage()}/**
	 * Loads the page given by the page URL.
	 * If no page is specified by the URL, the default page will be used.
	 *
	 * @param {HTMLElement} [container=NetspeakNavigator.defaultContainer] The container element to insert the page into.
	 * @returns {Promise<void>}
	 */static loadPage(container=NetspeakNavigator.defaultContainer){// get the page
let page=NetspeakNavigator.page,pageContent=page||NetspeakNavigator.defaultPage;const pageUrl=name=>`../pages/${name}.js`;return new Promise((res,rej)=>_require.default([pageUrl(`netspeak-${pageContent}`)],res,rej)).then(()=>{lastPage=page;container.innerHTML="";container.appendChild(document.createElement("NETSPEAK-"+pageContent))},reason=>{container.innerHTML="";console.error(reason);let errPage=NetspeakNavigator.errorPage;return new Promise((res,rej)=>_require.default([pageUrl(`netspeak-${errPage}`)],res,rej)).then(()=>{container.appendChild(document.createElement("NETSPEAK-"+errPage))})}).catch(reason=>{console.dir(reason);container.appendChild(document.createTextNode("Could not connect to Netspeak website."))})}/**
	 * Reloads the page by swapping the loaded contents - a soft reload - or by actually reloading the page - a hard reload.
	 *
	 * A soft reload requires the NetspeakNavigator.defaultPage to be set!
	 *
	 * @param {boolean} [softReload=true] Whether or not a soft reload should be performed.
	 */static reloadPage(softReload=!0){if(!softReload||!NetspeakNavigator.defaultContainer){location.reload();return}NetspeakNavigator.loadPage();window.scrollTo(0,0)}/**
	 * Returns the url the given page will have.
	 *
	 * This will include a lang parameter.
	 *
	 * @param {string} page The page.
	 * @return {string} The url of the page.
	 */static getPageUrl(page){let url=location.href;// remove all parameters
url=UrlUtil.setParameters(location.href,void 0);// add page
url=UrlUtil.setHash(url,page);// add language
let lang=NetspeakNavigator.currentLanguage;if(lang){url=UrlUtil.setParameter(url,"lang",lang)}return url}/**
	 * Returns the url the current page with the given language will have.
	 *
	 * @param {string} lang The target language.
	 * @return {string} The url of the page.
	 */static getLanguageUrl(lang){let url=location.href;// set language
url=UrlUtil.setParameter(url,"lang",lang);return url}static addEventListener(event,listener){return eventSystem.addEventListener(event,listener)}static removeEventListener(event,listener){return eventSystem.removeEventListener(event,listener)}static fire(event,newValue=void 0,oldValue=void 0){eventSystem.fireEvent(new _eventSystem.EventSystem.Event(event,newValue,oldValue))}}/**
* A utility class for URL-manipulation.
*
* @class UrlUtil
*/_exports.NetspeakNavigator=NetspeakNavigator;class UrlUtil{/**
	 * Returns the hash value (without the hash symbol) of the given URL of the default value.
	 *
	 * @param {string} url The URL.
	 * @param {string} [defaultValue=undefined] The value returned if no hash value is present.
	 * @returns {string} The hash value or defaultValue.
	 */static getHash(url,defaultValue=void 0){let match=url.match(/#([\s\S]*)/);if(null===match||match[1]===void 0)return defaultValue;return match[1]}/**
	 * Sets the hash value of the given URL. This will add the hash if necessary.
	 *
	 * If value is undefined or null, any hash value (including the hash symbol) will be removed from the URL.
	 *
	 * @param {string} url The URL.
	 * @param {string} value The new hash value.
	 * @returns {string} The changed URL.
	 */static setHash(url,value){// remove hash
url=url.replace(/#([\s\S]*)/,"");// just remove the hash
if(value===void 0||null===value){return url}// set the hash
return url+"#"+(value+"")}/**
	 * Returns an object of all URL parameter key-value-pairs.
	 *
	 * @param {string} url The URL.
	 * @returns {Object} The parameters.
	 */static getParameters(url){let parameters={};new URL(url).searchParams.forEach((value,name)=>parameters[name]=value);return parameters}/**
	 * Returns the parameter value of the given URL of defaultValue.
	 *
	 * @param {string} url The URL.
	 * @param {string} name The name of the parameter.
	 * @param {string} [defaultValue=undefined] The default value.
	 * @returns {string} The value of the parameter.
	 */static getParameter(url,name,defaultValue=void 0){let value=new URL(url).searchParams.get(name+"");return null===value?defaultValue:value}/**
	 * Sets the parameter value of the given URL.
	 *
	 * If value is undefined, null or an empty string, any parameter with the given name will be removed.
	 *
	 * @param {string} url The URL.
	 * @param {string} name The name of the parameter.
	 * @param {string} value The new value of the parameter.
	 * @returns {string} The changed URL.
	 */static setParameter(url,name,value){return UrlUtil.setParameters(url,{[name+""]:value})}/**
	 * Sets the parameters of the given URL.
	 *
	 * If the value of a parameter is undefined, null or an empty string, the parameter will be removed.
	 *
	 * If parameters is undefined or null, all parameters will be removed.
	 *
	 * @param {string} url The URL.
	 * @param {Object<string, string | null | undefined>} parameters The collection of key-value-pairs of parameters to change or undefined.
	 * @returns {string} The changed URL.
	 */static setParameters(url,parameters){let u=new URL(url);if(parameters===void 0||null===parameters){// remove all parameters
u.search=""}else{for(let parameter in parameters){let value=parameters[parameter];if(value===void 0||null===value||""===(value=value+"")){// remove parameter
u.searchParams.delete(parameter+"")}else{// set value
u.searchParams.set(parameter+"",value)}}}return u.href}}/**
* A utility class for URL-hash-manipulation.
*/_exports.UrlUtil=UrlUtil;class HashUtil{/**
	 * Returns a base URL.
	 *
	 * This is for private use of the methods of Hash only.
	 *
	 * @readonly
	 * @returns {string} The base URL.
	 */static get baseUrl(){return"http://www.abc.de/"}/**
	 * Gets the Netspeak page of a URL hash.
	 *
	 * @param {string} hash The URL hash value.
	 * @param {string} [defaultValue=undefined] The default value.
	 * @returns {string} The page specified by the hash or defaultValue.
	 */static getPage(hash,defaultValue=void 0){if(hash===void 0||null===hash)return defaultValue;return new URL(HashUtil.baseUrl+hash).pathname.substr(1)||defaultValue}/**
	 * Sets the Netspeak page of a URL hash.
	 *
	 * @param {string} hash The URL hash value.
	 * @param {string} value The new page.
	 * @returns {string} The change hash value.
	 */static setPage(hash,value){if(hash===void 0||null===hash||""===(hash=hash+""))return value;let u=new URL(HashUtil.baseUrl+hash);u.pathname="/"+(value||"");return u.href.substr(HashUtil.baseUrl.length)}/**
	 * Returns an object of all URL hash value parameter key-value-pairs.
	 *
	 * @param {string} hash The URL hash value.
	 * @returns {string} The change hash value.
	 */static getParameters(hash){return UrlUtil.getParameters(HashUtil.baseUrl+hash)}/**
	 * Returns the parameter value of the given URL hash value of defaultValue.
	 *
	 * @param {string} hash The URL hash value.
	 * @param {string} name The name of the parameter.
	 * @param {string} [defaultValue=undefined] The default value.
	 * @returns {string} The value of the parameter.
	 */static getParameter(hash,name,defaultValue=void 0){return UrlUtil.getParameter(HashUtil.baseUrl+hash,name,defaultValue)}/**
	 * Sets the parameter value of the given URL hash value.
	 *
	 * If value is undefined, null or an empty string, any parameter with the given name will be removed.
	 *
	 * @param {string} hash The URL hash value.
	 * @param {string} name The name of the parameter.
	 * @param {string} value The new value of the parameter.
	 * @returns {string} The changed hash value.
	 */static setParameter(hash,name,value){return UrlUtil.setParameter(HashUtil.baseUrl+hash,name,value).substr(HashUtil.baseUrl.length)}/**
	 * Sets the parameters of the given URL hash value.
	 *
	 * If the value of a parameter is undefined, null or an empty string, the parameter will be removed.
	 *
	 * If parameters is undefined or null, all parameters will be removed.
	 *
	 * @param {string} hash The URL hash value.
	 * @param {Object} parameters The collection of key-value-pairs of parameters to change or undefined.
	 * @returns {string} The changed hash value.
	 */static setParameters(hash,parameters){return UrlUtil.setParameters(HashUtil.baseUrl+hash,parameters).substr(HashUtil.baseUrl.length)}}// Setup everything
_exports.HashUtil=HashUtil;NetspeakNavigator.autoReload=!0;window.onhashchange=function(e){NetspeakNavigator.fire("urlChange",location.href);let page=NetspeakNavigator.page;if(lastPage!==page){let old=lastPage;lastPage=page;NetspeakNavigator.fire("pageChange",page,old)}}});