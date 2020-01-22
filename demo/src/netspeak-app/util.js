define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.newElement=newElement;_exports.appendNewElements=appendNewElements;_exports.appendNew=appendNew;_exports.debounce=debounce;_exports.textContent=textContent;_exports.encode=encode;_exports.createNextFrameInvoker=createNextFrameInvoker;_exports.startScrollToUrlHash=startScrollToUrlHash;_exports.createClipboardButton=createClipboardButton;_exports.normalizeSpaces=normalizeSpaces;_exports.createEmphasizer=createEmphasizer;/**
 *
 * @param {T | T[]} value
 * @returns {T[]}
 * @template T
 */function toArray(value){if(Array.isArray(value)){return value}else{return[value]}}/**
 * Creates phrase new HTML element matching the given selector.
 *
 * Supported features are tag names, ids, classes and attributes of the form `[attribute-name]`, `[attribute-name=value]` and `[attribute-name="value"]`
 *
 * @param {string} [selector="SPAN"] The selector.
 * @returns {HTMLElement} The created HTML element.
 */function newElement(selector="SPAN"){// tag name
let tagName=selector.replace(/[^\w-][\s\S]*/,"");if(!tagName||"*"==tagName)tagName="SPAN";// attributes
const attrs=[],r=/\[([\w-]+)(?:=("[^"]*"|[^"][^\]]*|))?\]/g;for(let phrase;phrase=r.exec(selector);)attrs.push([phrase[1],phrase[2]||""]);selector=selector.replace(r,"");// id, classes
const id=selector.match(/#([\w-]+)/),classes=selector.match(/\.[\w-]+/g),e=document.createElement(tagName);for(const phrase of attrs){e.setAttribute(phrase[0],phrase[1])}if(id)e.id=id[1];if(classes)classes.forEach(c=>e.classList.add(c.substring(1)));return e}/**
 * Creates new HTML elements and appends them to either the given parent or the previously create element.
 * This means that appendNewElements(par, s1) = par.appendChild(newElement(s1)) and that appendNewElements(par, s1, s2) = appendNewElements(appendNewElements(par, s1), s2)
 *
 * @param {HTMLElement} parent The element to which the first new element will be appended.
 * @param {string[]} selectors The selectors describing the elements to create.
 * @returns {HTMLElement} The element created last of the parent if no elements were created.
 */function appendNewElements(parent,...selectors){let e=parent;for(let i=0;i<selectors.length;i++)e=e.appendChild(newElement(selectors[i]));return e}/**
 *
 * @param {Element} parent
 * @param {AppendNewChildren} children
 * @returns {Object<string, HTMLElement>}
 *
 * @typedef {AppendNewChild | AppendNewChild[]} AppendNewChildren
 * @typedef {string | AppendNewSelectorObject | AppendNewTagObject} AppendNewChild
 *
 * @typedef AppendNewSelectorObject
 * @property {string} [out]
 * @property {string} selector
 * @property {Object<string, (this: Element, ev: Event) => any>} [listener]
 * @property {AppendNewChildren} [children]
 *
 * @typedef AppendNewTagObject
 * @property {string} [out]
 * @property {string} tag
 * @property {string} [className]
 * @property {Object<string, string>} [attr]
 * @property {Object<string, (this: Element, ev: Event) => any>} [listener]
 * @property {AppendNewChildren} [children]
 */function appendNew(parent,children){/** @type {Object<string, HTMLElement>} */const outObject={};for(let child of toArray(children)){if("string"===typeof child){child={selector:child}}/** @type {HTMLElement} */let element;if("selector"in child){let selector=child.selector;if(!selector){throw new Error(`Selector cannot be ${selector}`)}const tag=/^[^.#\s<>=$[\]]+/.exec(selector)[0];selector=selector.slice(tag.length);element=document.createElement(tag);let chainParent,chainElement;while(selector){/** @type {RegExpExecArray | null} */let m;if(m=/^\.([^.#\s<>=$[\]]+)/.exec(selector)){element.classList.add(m[1])}else if(m=/^#([^.#\s<>=$[\]]+)/.exec(selector)){element.id=m[1]}else if(m=/^[^.#\s<>=$[\]]+/.exec(selector)){chainParent=chainElement;chainElement=document.createElement(m[0]);if(chainParent){chainParent.appendChild(chainElement)}}else if(m=/^\s+/.exec(selector)){chainParent=chainElement;chainElement=void 0}else{throw new Error(`Cannot parse sub-selector: ${JSON.stringify(selector)}`)}selector=selector.slice(m[0].length)}element=chainElement}else{element=document.createElement(child.tag);if(child.className)element.className=child.className;if(child.attr){for(const key in child.attr){if(child.attr.hasOwnProperty(key)){element.setAttribute(key,child.attr[key])}}}}if("out"in child){outObject[child.out]=element}if("children"in child){Object.assign(outObject,appendNew(element,child.children))}if("listener"in child){for(const key in child.listener){if(child.listener.hasOwnProperty(key)){element.addEventListener(key,child.listener[key])}}}parent.appendChild(element)}return outObject}/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for `wait` milliseconds.
 *
 * If `immediate` is `true`, trigger the function on the leading edge, instead of the trailing.
 *
 * @param {(...args: (T & any[])) => void} func
 * @param {number} wait
 * @param {boolean} [immediate=false]
 * @returns {(...args: T) => void}
 * @template T
 */function debounce(func,wait,immediate){let timeout=void 0;return(/** @type {any} */function(){clearTimeout(timeout);timeout=setTimeout(()=>{timeout=void 0;if(!immediate)func.apply(this,arguments)},wait);if(immediate&&timeout===void 0)func.apply(this,arguments)})}/**
 * Returns the text content of a given HTML.
 *
 * @param {string} html
 * @returns {string}
 */function textContent(html){// copied from PrismJS' markup definition
html=html.replace(/<\/?(?!\d)[^\s>/=$<%]+(?:\s(?:\s*[^\s>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/g,"");const div=document.createElement("div");div.innerHTML=html;return div.textContent}/**
 * Encodes the given string such that it's a text literal.
 *
 * @param {string} html
 * @returns {string}
 */function encode(html){return html.replace(/&/g,"&amp;").replace(/</g,"&lt;")}/**
 * Returns a function which will execute the given function only once in the next frame.
 *
 * @param {() => void} func
 * @returns {() => void}
 */function createNextFrameInvoker(func){let requested=!1;const invoke=()=>{requested=!1;func()};return()=>{if(!requested){requested=!0;if("undefined"===typeof requestAnimationFrame){setTimeout(invoke,16)}else{requestAnimationFrame(invoke)}}}}/**
 * Queries all children of the given element matching the given selector.
 *
 * @param {ParentNode} element The parent HTML element.
 * @param {string} selector The selector.
 * @returns {T & Element | null} The matching element or undefined.
 * @template T
 */function shadyQuerySelector(element,selector){const result=element.querySelector(selector);if(result)return(/** @type {any} */result);for(let e of element.querySelectorAll(irregularTagSelector)){if(e.shadowRoot&&e.shadowRoot.querySelector){const res=shadyQuerySelector(e.shadowRoot,selector);if(res)return res}}return null}/**
 * Queries all children of the given element matching the given selector.
 *
 * @param {ParentNode} element The parent HTML element.
 * @param {string} selector The selector.
 * @returns {(T & Element)[]} The matching elements.
 * @template T
 */function shadyQuerySelectorAll(element,selector){const result=Array.from(element.querySelectorAll(selector));element.querySelectorAll(irregularTagSelector).forEach(e=>{if(e.shadowRoot&&e.shadowRoot.querySelectorAll){result.push(...shadyQuerySelectorAll(e.shadowRoot,selector))}});// @ts-ignore
return result}/**
 * An array of plain old HTML tag names.
 *
 * @readonly
 * @type {string[]}
 */const regularTagNames=["style","script","link","div","span","a","h3","h4","h5","h6","br","p","b","i","img","em","strong","button","input","option","table","tr","td","th","ul","ol","li","iframe","th","pre","code"],irregularTagSelector="*"+regularTagNames.map(e=>":not("+e+")").join("");function startScrollToUrlHash(){/** @type {string | null} */let lastHash=null,lastElement=null;/** @type {HTMLElement | null} */setInterval(()=>{const hash=location.hash.replace(/^#/,"");if(hash!==lastHash||!lastElement){lastElement=null;if(hash){lastElement=shadyQuerySelector(document,"#"+hash);if(lastElement){lastElement.scrollIntoView()}}}lastHash=hash},16)}/**
 * Creates a new ClipboardJS instance and returns a promise according to the `success` or `error` event.
 *
 * @param {string | Element} selector
 * @param {string | ((elem: Element) => string)} text
 * @returns {Promise<import("clipboard")>}
 */function createClipboardButton(selector,text){if("undefined"===typeof ClipboardJS){// load the library
return new Promise((resolve,reject)=>{const script=document.createElement("script");script.async=!0;script.src="https://unpkg.com/clipboard@2/dist/clipboard.min.js";script.onload=()=>{document.body.removeChild(script);resolve()};script.onerror=()=>{document.body.removeChild(script);reject()};document.body.appendChild(script)}).then(()=>{if("undefined"===typeof ClipboardJS){throw new Error("Unable to load ClipboardJS")}}).then(()=>{return createClipboardButton(selector,text)})}return Promise.resolve(new ClipboardJS(selector,{text(e){if("function"===typeof text){return text(e)}else{return text}}}))}/**
 *
 * @param {string} str
 * @returns {string}
 */function normalizeSpaces(str){return str.replace(/\s+/g," ").trim()}/**
 * Creates a function which given some plain text will return HTML code where the given phrase is emphasized.
 *
 * @param {string} phrase
 * @returns {(text: string) => string}
 */function createEmphasizer(phrase){const emphasisRE=new RegExp(phrase.replace(/[\\/(){}[\]|?+*^$.]/g,"\\$&")+"|(<)|(&)","ig");return text=>{return text.replace(emphasisRE,(m,lt,amp)=>{if(lt)return"&lt;";if(amp)return"&amp;";return`<em>${encode(m)}</em>`})}}});