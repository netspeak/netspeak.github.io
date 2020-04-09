define(["exports","../../node_modules/@polymer/polymer/polymer-element.js","./netspeak-navigator.js"],function(_exports,_polymerElement,_netspeakNavigator){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.innerHTML=innerHTML;_exports.loadLocalization=loadLocalization;_exports.highlightCode=highlightCode;_exports.registerElement=registerElement;_exports.NetspeakElement=_exports.htmlR=_exports.html=void 0;const html=_polymerElement.html;/**
 * A version of the usual `html` tag which uses raw strings.
 *
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 */_exports.html=html;const htmlR=(strings,...values)=>{/** @type {any} */const newStrings=[...strings.raw];newStrings.raw=strings.raw;return(0,_polymerElement.html)(newStrings,...values)};/**
 * This allows you to insert arbitrary strings into your Polymer templates.
 *
 * @param {string} htmlSource
 */_exports.htmlR=htmlR;function innerHTML(htmlSource){// @ts-ignore
return(0,_polymerElement.html)([htmlSource])}/**
 * @typedef LocalizationJson
 * @property {Object<string, string>} [template]
 * @property {Object<string, string>} [messages]
 * @property {any} [custom]
 *
 * @typedef {CustomElementConstructor & PolymerConstructorProperties} PolymerConstructor
 *
 * @typedef PolymerConstructorProperties
 * @property {string} is The HTML tag name of the custom HTML element.
 * @property {any} [importMeta] The `import.meta` of the file of this class.
 * @property {boolean} [noDefaultLocalization] Whether the element does not have a default localization.
 */ /**
 * Loads the localization of the current language for the given class.
 *
 * The given class is required to have static `is` and `importMeta` properties as `PolymerElement`s should.
 *
 * The returned promise will resolve to `false` if the current language is the default language (en).
 *
 * @param {Function} constructor
 * @returns {Promise<LocalizationJson | false>}
 */function loadLocalization(constructor){let promise=localizationCache.get(constructor);if(!promise){const temp=/** @type {any} */constructor,is=temp.is,meta=temp.importMeta,noDefaultLocalization=!!temp.noDefaultLocalization;/** @type {string} */if(meta&&meta.url&&is){const currentLang=_netspeakNavigator.NetspeakNavigator.currentLanguage;if(!noDefaultLocalization&&currentLang==_netspeakNavigator.NetspeakNavigator.defaultLanguage){promise=Promise.resolve(!1)}else{const url=new URL(meta.url);url.hash=url.search="";const dir=url.pathname.replace(/\/[^/]*$/,"");url.pathname=`${dir}/locales/${is}.${currentLang}.json`;promise=fetch(url.href).then(resp=>resp.json())}}else if(!is){promise=Promise.reject(`No 'is' property on ${constructor.name}`)}else{promise=Promise.reject(`No 'importMeta' property on ${constructor.name} (is: ${is})`)}localizationCache.set(constructor,promise)}return promise}/** @type {Map<Function, Promise<LocalizationJson | false>>} */const localizationCache=new Map;/**
 * A localizable element with support for PrismJS.
 */class NetspeakElement extends _polymerElement.PolymerElement{constructor(){super();// this is the latest we want to preload the localization
loadLocalization(this.constructor)}/**
	 * The method called after the element was added to the DOM.
	 */connectedCallback(){super.connectedCallback();loadLocalization(this.constructor).then(json=>{const shadowRoot=this.shadowRoot;if(shadowRoot&&json&&"object"===typeof json.template){const template=json.template;for(const element of shadowRoot.querySelectorAll("[id]")){let text;if(element.id&&"string"===typeof(text=template[element.id.toLowerCase()])){// only insert the text if the element doesn't contain other elements
if(0===element.childElementCount){element.textContent=text}}}}}).catch(e=>{/* ignore all errors. */})}/**
	 * Returns the message of the given key in the current language.
	 *
	 * The returned promise is guaranteed to resolve successfully.
	 *
	 * @param {string} key
	 * @param {string} defaultValue
	 * @returns {Promise<string>}
	 */localMessage(key,defaultValue){return loadLocalization(this.constructor).then(json=>{if(json&&json.messages){if(key in json.messages){return json.messages[key]}else{// to make debugging a little easier
console.warn(`There is no key '${key}' in the localization.`)}}return defaultValue}).catch(e=>{console.error(e);return defaultValue})}/**
	 * Styles all code elements with a language-xxxx class.
	 *
	 * This will not affect elements which are highlighted already.
	 * If Prism is not defined, then this method will do nothing.
	 */styleCode(){if(this.shadowRoot){highlightCode(this.shadowRoot)}}}/**
 * Highlights all code elements which follow the PrismJS language-xxxx convention.
 *
 * This will not affect elements which are highlighted already.
 * If Prism is not defined, then this method will do nothing.
 *
 * @param {DocumentFragment | Element} container
 */_exports.NetspeakElement=NetspeakElement;function highlightCode(container){if(!window.Prism||!container)return;const selector=["code[class*=\"language-\"]","pre[class*=\"language-\"] > code"].map(s=>s+":not([highlighted])").join(",");container.querySelectorAll(selector).forEach(e=>{window.Prism.highlightElement(e);e.setAttribute("highlighted","")})}/**
 *
 * @param {PolymerConstructor} constructor
 */function registerElement(constructor){window.customElements.define(constructor.is,constructor)}});