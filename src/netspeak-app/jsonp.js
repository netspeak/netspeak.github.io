define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.jsonp=jsonp;_exports.TimeoutError=_exports.NetworkError=void 0;let idCounter=0;/**
 * Queries the JSON result for the given URL.
 *
 * The given URL is not allowed to contain a `callback` parameter.
 *
 * @param {string} url
 * @param {number} [timeout]
 * @returns {Promise<any>}
 */function jsonp(url,timeout=2e4){return new Promise((resolve,reject)=>{try{if(!url)throw new Error("url cannot be "+url);// DO NOT use URL here
// Edge can't handle it. I'm serious. Edge can't even build an URL.
// check for callback
if(/[&?]callback=/i.test(url))throw new Error("url is not allowed to contain a callback parameter.");// convenience functions
const addCallback=(id,callback)=>{window[id]=callback;return id},removeCallback=(id,timeoutId)=>{// timeout
window.clearTimeout(timeoutId);// remove callback
delete window[id];// remove script
let script=document.getElementById(id);if(script)script.remove()};// id
let id="jsonp$$"+idCounter++,timeoutId;// callbacks
/** @param {any} json */const callbackSuccess=json=>{removeCallback(id,timeoutId);resolve(json)},callbackError=message=>{removeCallback(id,timeoutId);reject(message)},prefix=-1===url.indexOf("?")?"?":"&";/** @param {NetworkError} message */url+=prefix+"callback="+encodeURIComponent(addCallback(id,callbackSuccess));// set timeout
timeoutId=window.setTimeout(()=>{callbackError(new TimeoutError(`Could not reach server after ${timeout/1e3} seconds for ${url}`))},timeout);// create script
let script=document.createElement("SCRIPT");script.id=id;script.onerror=()=>callbackError(new NetworkError(`Unknown networking error for ${url}`));script.setAttribute("async","true");script.setAttribute("src",url);document.body.appendChild(script)}catch(error){reject(error)}})}class NetworkError extends Error{}_exports.NetworkError=NetworkError;class TimeoutError extends NetworkError{}_exports.TimeoutError=TimeoutError});