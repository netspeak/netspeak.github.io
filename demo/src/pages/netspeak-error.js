define(["exports", "meta", "../netspeak-app/netspeak-element.js", "./page-styles.js"], function (_exports, meta, _netspeakElement, _pageStyles) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.NetspeakError = void 0;
  meta = babelHelpers.interopRequireWildcard(meta);

  class NetspeakError extends _netspeakElement.NetspeakElement {
    static get importMeta() {
      return meta;
    }

    static get is() {
      return 'netspeak-error';
    }

    static get properties() {
      return {};
    }

    static get template() {
      return _netspeakElement.html`${_pageStyles.styles}

<div class="article">
	<h1 id="error">Error:</h1>
	<p id="message">There seems to be a problem with the site.</p>
</div>
		`;
    }

  }

  _exports.NetspeakError = NetspeakError;
  (0, _netspeakElement.registerElement)(NetspeakError);
});