define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.EventSystem=void 0;/**
 * @callback EventSystemListener
 * @param {EventSystem.Event} event
 * @returns {void}
 */ /**
 * A collection of event listeners and logic to manipulate them.
 */class EventSystem{/**
	 * Creates an instance of EventSystem.
	 *
	 */constructor(){/** @type {Object<string, EventSystemListener[]>} */this.listeners={}}/**
	 * Adds a new listener to the list of listeners of the given event type.
	 *
	 * @param {string} type The event type.
	 * @param {EventSystemListener} listener The listener.
	 */addEventListener(type,listener){type=(type+"").toLowerCase();const listeners=this.listeners[type];if(listeners){listeners.push(listener)}else{this.listeners[type]=[listener]}}/**
	 * Removes the given listener from the list of listeners of the given event type
	 *
	 * @param {string} type The event type.
	 * @param {(event: EventSystem.Event) => void} listener The listener.
	 * @returns {Boolean} Whether the given listener was removed.
	 */removeEventListener(type,listener){type=(type+"").toLowerCase();const listeners=this.listeners[type];if(listeners){for(let i=listeners.length-1;0<=i;i--){const l=listeners[i];if(l===listener){listeners.splice(i,1);return!0}}}return!1}/**
	 * Fires the given Event.
	 *
	 * @param {EventSystem.Event} event The event.
	 */fireEvent(event){const listeners=this.listeners[event.type];if(listeners){for(let i=listeners.length-1;0<=i;i--){const listener=listeners[i];try{listener(event)}catch(error){console.error(error)}}}}}/**
* An event.
*/_exports.EventSystem=EventSystem;EventSystem.Event=class Event{/**
	 * Creates an instance of Event.
	 *
	 * @param {string} type The event type.
	 * @param {any} [newValue=undefined] The new value.
	 * @param {any} [oldValue=undefined] The old value.
	 */constructor(type,newValue=void 0,oldValue=void 0){this.type=(type+"").toLowerCase();this.newValue=newValue;this.oldValue=oldValue}}});