define(["meta","./netspeak-element.js","./netspeak-navigator.js"],function(meta,_netspeakElement,_netspeakNavigator){"use strict";meta=babelHelpers.interopRequireWildcard(meta);class NetspeakHeader extends _netspeakElement.NetspeakElement{static get importMeta(){return meta}static get is(){return"netspeak-header"}static get properties(){return{}}static get template(){return _netspeakElement.html`
		<style>
			:host {
				background: #323232;
				display: block;
				padding: 0;
				border-bottom: 1px solid #727272;
				position: relative;
			}

			#content {
				max-width: 800px;
				padding: 8px 16px;
				box-sizing: border-box;
				margin: 0 auto;
			}

			#logo {
				display: block;
				float: left;
				height: 32px;
				width: 121px;
				background-image: url('/src/img/netspeak-path-white-121x32.svg');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
			}

			#slogan {
				color: rgba(255, 255, 255, .80);
				font-size: 10pt;
				white-space: nowrap;
				display: block;
				float: left;
				font-size: 15px;
				padding-top: 10px;
				padding-left: 16px;
			}

			@media screen and (max-width: 750px) {

				:host {
					height: 48px;
				}

				#content {
					padding: 0;
				}

				#logo {
					display: block;
					float: none;
					margin: auto;
					height: 48px;
					width: 182px;
				}

				#slogan {
					display: none;
				}

			}
		</style>

		<div id="content">
			<a href="[[getStartUrl()]]" id="logo"></a>
			<span id="slogan">
				One word leads to another.
			</span>
			<div style="clear: both"></div>
		</div>
		`}constructor(){super()}/**
	 * Returns the URL of the start page.
	 *
	 * @returns {string} The URL.
	 */getStartUrl(){return _netspeakNavigator.NetspeakNavigator.getPageUrl("index")}}(0,_netspeakElement.registerElement)(NetspeakHeader)});