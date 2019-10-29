define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.NetspeakNavigator=void 0;/**
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
for(let l of navigator.languages){l=l.toLowerCase();if(isValid(l))return l;// reduce e.g. "en-US" to "en"
l=(/^(\w+)-\w+$/.exec(l)||[])[1];if(isValid(l))return l}// return default language
return NetspeakNavigator.defaultLanguage}/**
	 * Returns the url the given page will have.
	 *
	 * This will include a lang parameter.
	 *
	 * @param {string} page The page.
	 * @param {string} [hash] The hash of the target url.
	 * @return {string} The url of the page.
	 */static getPageUrl(page,hash){const baseUrl=location.href.replace(/[?#][\s\S]*$/,"").replace(/\/[^/]*$/,"");if("index"===page){page=""}else{page+=".html"}let url=`${baseUrl}/${page}?lang=${NetspeakNavigator.currentLanguage}`;if(hash){url+="#"+hash}return url}/**
	 * Returns the url the current page with the given language will have.
	 *
	 * @param {string} lang The target language.
	 * @return {string} The url of the page.
	 */static getLanguageUrl(lang){let url=location.href;// set language
url=UrlUtil.setParameter(url,"lang",lang);return url}}/**
* A utility class for URL-manipulation.
*
* @class UrlUtil
*/_exports.NetspeakNavigator=NetspeakNavigator;class UrlUtil{/**
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
u.searchParams.set(parameter+"",value)}}}return u.href}}});