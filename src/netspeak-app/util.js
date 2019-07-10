define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.newElement=newElement;_exports.appendNewElements=appendNewElements;_exports.shadyQuerySelectorAll=shadyQuerySelectorAll;_exports.shadyQuerySelector=shadyQuerySelector;_exports.debounce=debounce;_exports.textContent=textContent;_exports.regularTagNames=void 0;/**
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
 * Queries all children of the given element matching the given selector.
 *
 * @param {ParentNode} element The parent HTML element.
 * @param {string} selector The selector.
 * @returns {Element[]} The matching elements.
 */function shadyQuerySelectorAll(element,selector){const result=Array.from(element.querySelectorAll(selector));element.querySelectorAll(irregularTagSelector).forEach(e=>{if(e.shadowRoot&&e.shadowRoot.querySelectorAll){result.push(...shadyQuerySelectorAll(e.shadowRoot,selector))}});return result}/**
 * Queries all children of the given element matching the given selector.
 *
 * @param {ParentNode} element The parent HTML element.
 * @param {string} selector The selector.
 * @returns {T & Element} The matching element or undefined.
 * @template T
 */function shadyQuerySelector(element,selector){const result=element.querySelector(selector);if(result)return(/** @type {any} */result);for(let e of element.querySelectorAll(irregularTagSelector)){if(e.shadowRoot&&e.shadowRoot.querySelector){const res=shadyQuerySelector(e.shadowRoot,selector);if(res)return res}}return void 0}/**
 * An array of plain old HTML tag names.
 *
 * @readonly
 * @type {string[]}
 */const regularTagNames=["style","script","link","div","span","a","h3","h4","h5","h6","br","p","b","i","img","em","strong","button","input","option","table","tr","td","th","ul","ol","li","iframe","th","pre","code"];_exports.regularTagNames=regularTagNames;const irregularTagSelector="*"+regularTagNames.map(e=>":not("+e+")").join("");/**
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
 */function textContent(html){// TODO: This is vulnerable to XSS
const e=document.createElement("DIV");e.innerHTML=html;return e.textContent||""}});