/**
 * @file  Base JavaScript needed independent of the project
 * @author Atoom Studio <info@atoomstudio.com>
 */

/**
 * The jQuery object or a jQuery set containing on or more DOM elements.
 * @typedef {Object} jQuery
 */

/**
 * Namespace of the app.
 * This should be the only variable the app stores in the global scope.
 * @namespace montiboli
 */
var montiboli = window.montiboli || {};

/**
 * Namespace of the base module. Contains JavaScript needed independent of the
 * project or other modules.
 * @namespace base
 * @memberof montiboli
 */
montiboli.base = (function () {
	'use strict';

	/**
	 * Fix viewport issues with IE 10.
	 * @see {@link http://getbootstrap.com/getting-started/#support-ie10-width}
	 * @memberof montiboli.base
	 * @private
	 */
	(function () {
		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
			var msViewportStyle = document.createElement('style');
			msViewportStyle.appendChild(
				document.createTextNode(
					'@-ms-viewport{width:auto!important}'
				)
			);
			document.querySelector('head').appendChild(msViewportStyle);
		}
	})();

	/**
	 * Avoid `console` errors in browsers that lack a console.
	 * @see {@link https://github.com/h5bp/html5-boilerplate/blob/master/js/plugins.js}
	 * @memberof montiboli.base
	 * @private
	 */
	(function () {
		var method;
		var noop = function () {};
		var methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeStamp', 'trace', 'warn'
		];
		var length = methods.length;
		var console = (window.console = window.console || {});

		while (length--) {
			method = methods[length];

			// Only stub undefined methods.
			if (!console[method]) {
				console[method] = noop;
			}
		}
	})();

})();

(function ($) {
	var $window = $(window);
	var windowHeight = $window.height();

	$window.resize(function () {
		windowHeight = $window.height();
	});

	$.fn.parallax = function (xpos, speedFactor, outerHeight) {
		var $this = $(this);
		var getHeight;
		var firstTop;
		var paddingTop = 0;

		// get the starting position of each element to have parallax applied to it
		$this.each(function () {
		    																																																																																																																																																																																																																																																																				firstTop = $this.offset().top;
		});

		if (outerHeight) {
			getHeight = function (jqo) {
				return jqo.outerHeight(true);
			};
		} else {
			getHeight = function (jqo) {
				return jqo.height();
			};
		}

		// setup defaults if arguments aren't specified
		if (arguments.length < 1 || xpos === null) xpos = '50%';
		if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
		if (arguments.length < 3 || outerHeight === null) outerHeight = true;

		// function to be called whenever the window is scrolled or resized
		function update() {
			var pos = $window.scrollTop();

			$this.each(function () {
				var $element = $(this);
				var top = $element.offset().top;
				var height = getHeight($element);

				// Check if totally above or totally below viewport
				if (top + height < pos || top > pos + windowHeight) {
					return;
				}

				$this.css('backgroundPosition', xpos + ' ' + Math.round((firstTop - pos) * speedFactor) + 'px');
			});
		}

		$window.bind('scroll', update).resize(update);
		update();
	};
})(jQuery);
