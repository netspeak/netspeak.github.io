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
 * @property {any} [custom]
 *
 * @typedef {Function & PolymerConstructorProperties} PolymerConstructor
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
 * @param {PolymerConstructor} constructor
 * @returns {Promise<LocalizationJson | false>}
 */function loadLocalization(constructor){let promise=localizationCache.get(constructor);if(!promise){/** @type {string} */const is=constructor.is,meta=constructor.importMeta,noDefaultLocalization=!!constructor.noDefaultLocalization;/** @type {{ url: string }} */if(meta&&meta.url&&is){const currentLang=_netspeakNavigator.NetspeakNavigator.currentLanguage;if(!noDefaultLocalization&&currentLang==_netspeakNavigator.NetspeakNavigator.defaultLanguage){promise=Promise.resolve(!1)}else{const url=new URL(meta.url);url.hash=url.search="";const dir=url.pathname.replace(/\/[^/]*$/,"");url.pathname=`${dir}/locales/${is}.${currentLang}.json`;promise=fetch(url.href).then(resp=>resp.json())}}else if(!is){promise=Promise.reject(`No 'is' property on ${constructor.name}`)}else{promise=Promise.reject(`No 'importMeta' property on ${constructor.name} (is: ${is})`)}localizationCache.set(constructor,promise)}return promise}/** @type {Map<Function, Promise<LocalizationJson | false>>} */const localizationCache=new Map;/**
 * A localizable element with support for PrismJS.
 */class NetspeakElement extends _polymerElement.PolymerElement{constructor(){super();// this is the latest we want to preload the localization
loadLocalization(this.constructor)}/**
	 * The method called after the element was added to the DOM.
	 */connectedCallback(){super.connectedCallback();loadLocalization(this.constructor).then(json=>{const shadowRoot=this.shadowRoot;if(shadowRoot&&json&&"object"===typeof json.template){const template=json.template;for(const element of shadowRoot.querySelectorAll("[id]")){let text;if(element.id&&"string"===typeof(text=template[element.id.toLowerCase()])){// only insert the text if the element doesn't contain other elements
if(0===element.childElementCount){element.textContent=text}}}}}).catch(e=>{/* ignore all errors. */})}/**
	 * Styles all code elements with a language-xxxx class.
	 *
	 * This will not affect elements which are highlighted already.
	 * If Prism is not defined, then this method will do nothing.
	 */styleCode(){highlightCode(this.shadowRoot)}}/**
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