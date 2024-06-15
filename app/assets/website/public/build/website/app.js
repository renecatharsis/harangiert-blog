(self["webpackChunk"] = self["webpackChunk"] || []).push([["app"],{

/***/ "./js/app.js":
/*!*******************!*\
  !*** ./js/app.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ./../styles/app.scss */ "./styles/app.scss");
__webpack_require__(/*! ./lightbox */ "./js/lightbox.js");
__webpack_require__(/*! ./navbar */ "./js/navbar.js");
__webpack_require__(/*! ./scrolling */ "./js/scrolling.js");
__webpack_require__(/*! ./map */ "./js/map.js");
__webpack_require__(/*! ./gallery */ "./js/gallery.js");

/***/ }),

/***/ "./js/gallery.js":
/*!***********************!*\
  !*** ./js/gallery.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

(function () {
  "use strict";

  var blueimpGallery = __webpack_require__(/*! blueimp-gallery/js/blueimp-gallery.min.js */ "./node_modules/blueimp-gallery/js/blueimp-gallery.min.js");
  var galleries = document.querySelectorAll('.blueimp-gallery');
  galleries.forEach(function (gallery) {
    blueimpGallery(JSON.parse(gallery.getAttribute('data-sources')), {
      container: '#' + gallery.getAttribute('id'),
      carousel: true,
      startSlideshow: false
    });
  });
})();

/***/ }),

/***/ "./js/lightbox.js":
/*!************************!*\
  !*** ./js/lightbox.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var glightbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! glightbox */ "./node_modules/glightbox/dist/js/glightbox.min.js");
/* harmony import */ var glightbox__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(glightbox__WEBPACK_IMPORTED_MODULE_0__);

(function () {
  "use strict";

  var lightboxElements = document.querySelectorAll('a[data-gallery^="lightbox-"]');
  var lightboxes = [];
  lightboxElements.forEach(function (element) {
    var selector = element.getAttribute('data-gallery');
    if (!lightboxes.includes(selector)) {
      glightbox__WEBPACK_IMPORTED_MODULE_0___default()();
      lightboxes.push(selector);
    }
  });
})();

/***/ }),

/***/ "./js/map.js":
/*!*******************!*\
  !*** ./js/map.js ***!
  \*******************/
/***/ (() => {

(function () {
  "use strict";

  var svg = document.querySelector('.map-draggable');
  if (null === svg) {
    return;
  }

  // If browser supports pointer events
  if (window.PointerEvent) {
    svg.addEventListener('pointerdown', onPointerDown, {
      passive: true
    }); // Pointer is pressed
    svg.addEventListener('pointerup', onPointerUp, {
      passive: true
    }); // Releasing the pointer
    svg.addEventListener('pointerleave', onPointerUp, {
      passive: true
    }); // Pointer gets out of the SVG area
    svg.addEventListener('pointermove', onPointerMove, {
      passive: true
    }); // Pointer is moving
  } else {
    // Add all mouse events listeners fallback
    svg.addEventListener('mousedown', onPointerDown, {
      passive: true
    }); // Pressing the mouse
    svg.addEventListener('mouseup', onPointerUp, {
      passive: true
    }); // Releasing the mouse
    svg.addEventListener('mouseleave', onPointerUp, {
      passive: true
    }); // Mouse gets out of the SVG area
    svg.addEventListener('mousemove', onPointerMove, {
      passive: true
    }); // Mouse is moving

    // Add all touch events listeners fallback
    svg.addEventListener('touchstart', onPointerDown, {
      passive: true
    }); // Finger is touching the screen
    svg.addEventListener('touchend', onPointerUp, {
      passive: true
    }); // Finger is no longer touching the screen
    svg.addEventListener('touchmove', onPointerMove, {
      passive: true
    }); // Finger is moving
  }

  // This variable will be used later for move events to check if pointer is down or not
  var isPointerDown = false;
  // This variable will contain the original coordinates when the user start pressing the mouse or touching the screen
  var pointerOrigin = {
    x: 0,
    y: 0
  };

  // We save the original values from the viewBox
  var origViewport = svg.getAttribute('viewBox').split(' ');
  var viewBox = {
    x: origViewport[0],
    y: origViewport[1],
    width: origViewport[2],
    height: origViewport[3]
  };

  // Set viewport depending on device width
  var deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (deviceWidth <= 576) {
    // bootstrap small breakpoint
    viewBox.x = viewBox.x * 2.15;
    viewBox.width = viewBox.width * 0.75;
    viewBox.height = viewBox.height * 0.75;
    updateViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
  }

  // The distances calculated from the pointer will be stored here
  var newViewBox = {
    x: 0,
    y: 0
  };

  // Calculate the ratio based on the viewBox width and the SVG width
  var ratio = viewBox.width / svg.getBoundingClientRect().width;
  window.addEventListener('resize', function () {
    ratio = viewBox.width / svg.getBoundingClientRect().width;
  });

  // This function returns an object with X & Y values from the pointer event
  function getPointFromEvent(event) {
    var point = {
      x: 0,
      y: 0
    };

    // If even is triggered by a touch event, we get the position of the first finger
    if (event.targetTouches) {
      point.x = event.targetTouches[0].clientX;
      point.y = event.targetTouches[0].clientY;
    } else {
      point.x = event.clientX;
      point.y = event.clientY;
    }
    return point;
  }

  // Function called by the event listeners when user start pressing/touching
  function onPointerDown(event) {
    isPointerDown = true; // We set the pointer as down

    // We get the pointer position on click/touchdown so we can get the value once the user starts to drag
    var pointerPosition = getPointFromEvent(event);
    pointerOrigin.x = pointerPosition.x;
    pointerOrigin.y = pointerPosition.y;
  }

  // Function called by the event listeners when user start moving/dragging
  function onPointerMove(event) {
    // Only run this function if the pointer is down
    if (!isPointerDown) {
      return;
    }
    // This prevent user to do a selection on the page
    // event.preventDefault();

    // Get the pointer position
    var pointerPosition = getPointFromEvent(event);

    // We calculate the distance between the pointer origin and the current position
    // The viewBox x & y values must be calculated from the original values and the distances
    newViewBox.x = viewBox.x - (pointerPosition.x - pointerOrigin.x) * ratio;
    newViewBox.y = viewBox.y - (pointerPosition.y - pointerOrigin.y) * ratio;

    // We create a string with the new viewBox values
    // The X & Y values are equal to the current viewBox minus the calculated distances
    updateViewBox(newViewBox.x, newViewBox.y, viewBox.width, viewBox.height);
  }
  function onPointerUp() {
    // The pointer is no longer considered as down
    isPointerDown = false;

    // We save the viewBox coordinates based on the last pointer offsets
    viewBox.x = newViewBox.x;
    viewBox.y = newViewBox.y;
  }
  function updateViewBox(x, y, w, h) {
    var viewBoxString = "".concat(x, " ").concat(y, " ").concat(w, " ").concat(h);

    // We apply the new viewBox values onto the SVG
    svg.setAttribute('viewBox', viewBoxString);
  }
})();

/***/ }),

/***/ "./js/navbar.js":
/*!**********************!*\
  !*** ./js/navbar.js ***!
  \**********************/
/***/ (() => {

(function () {
  "use strict";

  var toggle = document.getElementsByClassName('navbar-toggler')[0];
  var collapse = document.getElementsByClassName('navbar-collapse')[0];
  toggle.addEventListener('click', toggleMenu, false);
  function toggleMenu() {
    collapse.classList.toggle('collapse');
    collapse.classList.toggle('in');
  }
})();

/***/ }),

/***/ "./js/scrolling.js":
/*!*************************!*\
  !*** ./js/scrolling.js ***!
  \*************************/
/***/ (() => {

(function () {
  "use strict";

  // Show the navbar when the page is scrolled up
  var MQL = 992;

  //primary navigation slide-in effect
  if (document.documentElement.clientWidth > MQL) {
    var previousTop = 0;
    var mainNavStyles = getComputedStyle(document.getElementById('mainNav'));
    var headerHeight = parseInt(mainNavStyles.height.replace('px', '')) - parseInt(mainNavStyles.paddingTop.replace('px', '')) - parseInt(mainNavStyles.paddingBottom.replace('px', '')) - parseInt(mainNavStyles.borderBottomWidth.replace('px', ''));
    window.addEventListener('scroll', function () {
      var currentTop = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
      var mainNav = document.getElementById('mainNav');
      //check if user is scrolling up
      if (currentTop < previousTop) {
        //if scrolling up...
        if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
          mainNav.classList.add('is-visible');
        } else {
          mainNav.classList.remove('is-visible');
          mainNav.classList.remove('is-fixed');
        }
      } else if (currentTop > previousTop) {
        //if scrolling down...
        mainNav.classList.remove('is-visible');
        if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
          mainNav.classList.add('is-fixed');
        }
      }
      previousTop = currentTop;
    }, {
      passive: true
    });
  }
})();

/***/ }),

/***/ "./node_modules/blueimp-gallery/js/blueimp-gallery-video.js":
/*!******************************************************************!*\
  !*** ./node_modules/blueimp-gallery/js/blueimp-gallery-video.js ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * blueimp Gallery Video Factory JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define */

;(function (factory) {
  'use strict'
  if (true) {
    // Register as an anonymous AMD module:
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js"), __webpack_require__(/*! ./blueimp-gallery */ "./node_modules/blueimp-gallery/js/blueimp-gallery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else {}
})(function ($, Gallery) {
  'use strict'

  var galleryPrototype = Gallery.prototype

  $.extend(galleryPrototype.options, {
    // The class for video content elements:
    videoContentClass: 'video-content',
    // The class for video when it is loading:
    videoLoadingClass: 'video-loading',
    // The class for video when it is playing:
    videoPlayingClass: 'video-playing',
    // The class for video content displayed in an iframe:
    videoIframeClass: 'video-iframe',
    // The class for the video cover element:
    videoCoverClass: 'video-cover',
    // The class for the video play control:
    videoPlayClass: 'video-play',
    // Play videos inline by default:
    videoPlaysInline: true,
    // The list object property (or data attribute) for video preload:
    videoPreloadProperty: 'preload',
    // The list object property (or data attribute) for the video poster URL:
    videoPosterProperty: 'poster'
  })

  var handleSlide = galleryPrototype.handleSlide

  $.extend(galleryPrototype, {
    handleSlide: function (oldIndex, newIndex) {
      handleSlide.call(this, oldIndex, newIndex)
      this.setTimeout(function () {
        if (this.activeVideo) {
          this.activeVideo.pause()
        }
      })
    },

    videoFactory: function (obj, callback, videoInterface) {
      var that = this
      var options = this.options
      var videoContainerNode = this.elementPrototype.cloneNode(false)
      var videoContainer = $(videoContainerNode)
      var errorArgs = [
        {
          type: 'error',
          target: videoContainerNode
        }
      ]
      var video = videoInterface || document.createElement('video')
      var coverElement = this.elementPrototype.cloneNode(false)
      var playElement = document.createElement('a')
      var url = this.getItemProperty(obj, options.urlProperty)
      var sources = this.getItemProperty(obj, options.sourcesProperty)
      var title = this.getItemProperty(obj, options.titleProperty)
      var posterUrl = this.getItemProperty(obj, options.videoPosterProperty)
      var playControls = [playElement]
      var hasGalleryControls
      var isLoading
      var i
      videoContainer.addClass(options.videoContentClass)
      $(playElement).addClass(options.videoPlayClass)
      if (
        !$(coverElement)
          .addClass(options.videoCoverClass)
          .hasClass(options.toggleClass)
      ) {
        playControls.push(coverElement)
      }
      coverElement.draggable = false
      if (title) {
        videoContainerNode.title = title
        playElement.setAttribute('aria-label', title)
      }
      if (posterUrl) {
        // Set as background image instead of as poster video element property:
        // - Is accessible for browsers that do not support the video element
        // - Is accessible for both video element and iframe video players
        // - Avoids visual artifacts in IE with the poster property set
        coverElement.style.backgroundImage = 'url("' + posterUrl + '")'
      }
      if (video.setAttribute) {
        if (options.videoPlaysInline) video.setAttribute('playsinline', '')
      } else {
        videoContainer.addClass(options.videoIframeClass)
      }
      video.preload =
        this.getItemProperty(obj, options.videoPreloadProperty) || 'none'
      if (this.support.source && sources) {
        for (i = 0; i < sources.length; i += 1) {
          video.appendChild(
            $.extend(this.sourcePrototype.cloneNode(false), sources[i])
          )
        }
      }
      if (url) video.src = url
      playElement.href = url || (sources && sources.length && sources[0].src)
      if (video.play && video.pause) {
        ;(videoInterface || $(video))
          .on('error', function () {
            that.setTimeout(callback, errorArgs)
          })
          .on('pause', function () {
            if (video.seeking) return
            isLoading = false
            videoContainer
              .removeClass(that.options.videoLoadingClass)
              .removeClass(that.options.videoPlayingClass)
            if (hasGalleryControls) {
              that.container.addClass(that.options.controlsClass)
            }
            video.controls = false
            if (video === that.activeVideo) delete that.activeVideo
            if (that.interval) {
              // Continue slideshow interval
              that.play()
            }
          })
          .on('playing', function () {
            isLoading = false
            coverElement.removeAttribute('style')
            videoContainer
              .removeClass(that.options.videoLoadingClass)
              .addClass(that.options.videoPlayingClass)
          })
          .on('play', function () {
            // Clear slideshow timeout:
            window.clearTimeout(that.timeout)
            isLoading = true
            videoContainer.addClass(that.options.videoLoadingClass)
            if (that.container.hasClass(that.options.controlsClass)) {
              hasGalleryControls = true
              that.container.removeClass(that.options.controlsClass)
            } else {
              hasGalleryControls = false
            }
            video.controls = true
            that.activeVideo = video
          })
        $(playControls).on('click', function (event) {
          that.preventDefault(event)
          that.activeVideo = video
          if (isLoading) {
            video.pause()
          } else {
            video.play()
          }
        })
        videoContainerNode.appendChild(
          (videoInterface && videoInterface.element) || video
        )
      }
      videoContainerNode.appendChild(coverElement)
      videoContainerNode.appendChild(playElement)
      this.setTimeout(callback, [
        {
          type: 'load',
          target: videoContainerNode
        }
      ])
      return videoContainerNode
    }
  })

  return Gallery
})


/***/ }),

/***/ "./node_modules/blueimp-gallery/js/blueimp-gallery.js":
/*!************************************************************!*\
  !*** ./node_modules/blueimp-gallery/js/blueimp-gallery.js ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * blueimp Gallery JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Swipe implementation based on
 * https://github.com/bradbirdsall/Swipe
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define, DocumentTouch */

/* eslint-disable no-param-reassign */

;(function (factory) {
  'use strict'
  if (true) {
    // Register as an anonymous AMD module:
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else {}
})(function ($) {
  'use strict'

  /**
   * Gallery constructor
   *
   * @class
   * @param {Array|NodeList} list Gallery content
   * @param {object} [options] Gallery options
   * @returns {object} Gallery object
   */
  function Gallery(list, options) {
    if (document.body.style.maxHeight === undefined) {
      // document.body.style.maxHeight is undefined on IE6 and lower
      return null
    }
    if (!this || this.options !== Gallery.prototype.options) {
      // Called as function instead of as constructor,
      // so we simply return a new instance:
      return new Gallery(list, options)
    }
    if (!list || !list.length) {
      this.console.log(
        'blueimp Gallery: No or empty list provided as first argument.',
        list
      )
      return
    }
    this.list = list
    this.num = list.length
    this.initOptions(options)
    this.initialize()
  }

  $.extend(Gallery.prototype, {
    options: {
      // The Id, element or querySelector of the gallery widget:
      container: '#blueimp-gallery',
      // The tag name, Id, element or querySelector of the slides container:
      slidesContainer: 'div',
      // The tag name, Id, element or querySelector of the title element:
      titleElement: 'h3',
      // The class to add when the gallery is visible:
      displayClass: 'blueimp-gallery-display',
      // The class to add when the gallery controls are visible:
      controlsClass: 'blueimp-gallery-controls',
      // The class to add when the gallery only displays one element:
      singleClass: 'blueimp-gallery-single',
      // The class to add when the left edge has been reached:
      leftEdgeClass: 'blueimp-gallery-left',
      // The class to add when the right edge has been reached:
      rightEdgeClass: 'blueimp-gallery-right',
      // The class to add when the automatic slideshow is active:
      playingClass: 'blueimp-gallery-playing',
      // The class to add when the browser supports SVG as img (or background):
      svgasimgClass: 'blueimp-gallery-svgasimg',
      // The class to add when the browser supports SMIL (animated SVGs):
      smilClass: 'blueimp-gallery-smil',
      // The class for all slides:
      slideClass: 'slide',
      // The slide class for the active (current index) slide:
      slideActiveClass: 'slide-active',
      // The slide class for the previous (before current index) slide:
      slidePrevClass: 'slide-prev',
      // The slide class for the next (after current index) slide:
      slideNextClass: 'slide-next',
      // The slide class for loading elements:
      slideLoadingClass: 'slide-loading',
      // The slide class for elements that failed to load:
      slideErrorClass: 'slide-error',
      // The class for the content element loaded into each slide:
      slideContentClass: 'slide-content',
      // The class for the "toggle" control:
      toggleClass: 'toggle',
      // The class for the "prev" control:
      prevClass: 'prev',
      // The class for the "next" control:
      nextClass: 'next',
      // The class for the "close" control:
      closeClass: 'close',
      // The class for the "play-pause" toggle control:
      playPauseClass: 'play-pause',
      // The list object property (or data attribute) with the object type:
      typeProperty: 'type',
      // The list object property (or data attribute) with the object title:
      titleProperty: 'title',
      // The list object property (or data attribute) with the object alt text:
      altTextProperty: 'alt',
      // The list object property (or data attribute) with the object URL:
      urlProperty: 'href',
      // The list object property (or data attribute) with the object srcset:
      srcsetProperty: 'srcset',
      // The list object property (or data attribute) with the object sizes:
      sizesProperty: 'sizes',
      // The list object property (or data attribute) with the object sources:
      sourcesProperty: 'sources',
      // The gallery listens for transitionend events before triggering the
      // opened and closed events, unless the following option is set to false:
      displayTransition: true,
      // Defines if the gallery slides are cleared from the gallery modal,
      // or reused for the next gallery initialization:
      clearSlides: true,
      // Toggle the controls on pressing the Enter key:
      toggleControlsOnEnter: true,
      // Toggle the controls on slide click:
      toggleControlsOnSlideClick: true,
      // Toggle the automatic slideshow interval on pressing the Space key:
      toggleSlideshowOnSpace: true,
      // Navigate the gallery by pressing the ArrowLeft and ArrowRight keys:
      enableKeyboardNavigation: true,
      // Close the gallery on pressing the Escape key:
      closeOnEscape: true,
      // Close the gallery when clicking on an empty slide area:
      closeOnSlideClick: true,
      // Close the gallery by swiping up or down:
      closeOnSwipeUpOrDown: true,
      // Close the gallery when the URL hash changes:
      closeOnHashChange: true,
      // Emulate touch events on mouse-pointer devices such as desktop browsers:
      emulateTouchEvents: true,
      // Stop touch events from bubbling up to ancestor elements of the Gallery:
      stopTouchEventsPropagation: false,
      // Hide the page scrollbars:
      hidePageScrollbars: true,
      // Stops any touches on the container from scrolling the page:
      disableScroll: true,
      // Carousel mode (shortcut for carousel specific options):
      carousel: false,
      // Allow continuous navigation, moving from last to first
      // and from first to last slide:
      continuous: true,
      // Remove elements outside of the preload range from the DOM:
      unloadElements: true,
      // Start with the automatic slideshow:
      startSlideshow: false,
      // Delay in milliseconds between slides for the automatic slideshow:
      slideshowInterval: 5000,
      // The direction the slides are moving: ltr=LeftToRight or rtl=RightToLeft
      slideshowDirection: 'ltr',
      // The starting index as integer.
      // Can also be an object of the given list,
      // or an equal object with the same url property:
      index: 0,
      // The number of elements to load around the current index:
      preloadRange: 2,
      // The transition duration between slide changes in milliseconds:
      transitionDuration: 300,
      // The transition duration for automatic slide changes, set to an integer
      // greater 0 to override the default transition duration:
      slideshowTransitionDuration: 500,
      // The event object for which the default action will be canceled
      // on Gallery initialization (e.g. the click event to open the Gallery):
      event: undefined,
      // Callback function executed when the Gallery is initialized.
      // Is called with the gallery instance as "this" object:
      onopen: undefined,
      // Callback function executed when the Gallery has been initialized
      // and the initialization transition has been completed.
      // Is called with the gallery instance as "this" object:
      onopened: undefined,
      // Callback function executed on slide change.
      // Is called with the gallery instance as "this" object and the
      // current index and slide as arguments:
      onslide: undefined,
      // Callback function executed after the slide change transition.
      // Is called with the gallery instance as "this" object and the
      // current index and slide as arguments:
      onslideend: undefined,
      // Callback function executed on slide content load.
      // Is called with the gallery instance as "this" object and the
      // slide index and slide element as arguments:
      onslidecomplete: undefined,
      // Callback function executed when the Gallery is about to be closed.
      // Is called with the gallery instance as "this" object:
      onclose: undefined,
      // Callback function executed when the Gallery has been closed
      // and the closing transition has been completed.
      // Is called with the gallery instance as "this" object:
      onclosed: undefined
    },

    carouselOptions: {
      hidePageScrollbars: false,
      toggleControlsOnEnter: false,
      toggleSlideshowOnSpace: false,
      enableKeyboardNavigation: false,
      closeOnEscape: false,
      closeOnSlideClick: false,
      closeOnSwipeUpOrDown: false,
      closeOnHashChange: false,
      disableScroll: false,
      startSlideshow: true
    },

    console:
      window.console && typeof window.console.log === 'function'
        ? window.console
        : { log: function () {} },

    // Detect touch, transition, transform and background-size support:
    support: (function (element) {
      var support = {
        source: !!window.HTMLSourceElement,
        picture: !!window.HTMLPictureElement,
        svgasimg: document.implementation.hasFeature(
          'http://www.w3.org/TR/SVG11/feature#Image',
          '1.1'
        ),
        smil:
          !!document.createElementNS &&
          /SVGAnimate/.test(
            document
              .createElementNS('http://www.w3.org/2000/svg', 'animate')
              .toString()
          ),
        touch:
          window.ontouchstart !== undefined ||
          (window.DocumentTouch && document instanceof DocumentTouch)
      }
      var transitions = {
        webkitTransition: {
          end: 'webkitTransitionEnd',
          prefix: '-webkit-'
        },
        MozTransition: {
          end: 'transitionend',
          prefix: '-moz-'
        },
        OTransition: {
          end: 'otransitionend',
          prefix: '-o-'
        },
        transition: {
          end: 'transitionend',
          prefix: ''
        }
      }
      var prop
      for (prop in transitions) {
        if (
          Object.prototype.hasOwnProperty.call(transitions, prop) &&
          element.style[prop] !== undefined
        ) {
          support.transition = transitions[prop]
          support.transition.name = prop
          break
        }
      }
      /**
       * Tests browser support
       */
      function elementTests() {
        var transition = support.transition
        var prop
        var translateZ
        document.body.appendChild(element)
        if (transition) {
          prop = transition.name.slice(0, -9) + 'ransform'
          if (element.style[prop] !== undefined) {
            element.style[prop] = 'translateZ(0)'
            translateZ = window
              .getComputedStyle(element)
              .getPropertyValue(transition.prefix + 'transform')
            support.transform = {
              prefix: transition.prefix,
              name: prop,
              translate: true,
              translateZ: !!translateZ && translateZ !== 'none'
            }
          }
        }
        document.body.removeChild(element)
      }
      if (document.body) {
        elementTests()
      } else {
        $(document).on('DOMContentLoaded', elementTests)
      }
      return support
      // Test element, has to be standard HTML and must not be hidden
      // for the CSS3 tests using window.getComputedStyle to be applicable:
    })(document.createElement('div')),

    requestAnimationFrame:
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame,

    cancelAnimationFrame:
      window.cancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame,

    initialize: function () {
      this.initStartIndex()
      if (this.initWidget() === false) {
        return false
      }
      this.initEventListeners()
      // Load the slide at the given index:
      this.onslide(this.index)
      // Manually trigger the slideend event for the initial slide:
      this.ontransitionend()
      // Start the automatic slideshow if applicable:
      if (this.options.startSlideshow) {
        this.play()
      }
    },

    slide: function (to, duration) {
      window.clearTimeout(this.timeout)
      var index = this.index
      var direction
      var naturalDirection
      var diff
      if (index === to || this.num === 1) {
        return
      }
      if (!duration) {
        duration = this.options.transitionDuration
      }
      if (this.support.transform) {
        if (!this.options.continuous) {
          to = this.circle(to)
        }
        // 1: backward, -1: forward:
        direction = Math.abs(index - to) / (index - to)
        // Get the actual position of the slide:
        if (this.options.continuous) {
          naturalDirection = direction
          direction = -this.positions[this.circle(to)] / this.slideWidth
          // If going forward but to < index, use to = slides.length + to
          // If going backward but to > index, use to = -slides.length + to
          if (direction !== naturalDirection) {
            to = -direction * this.num + to
          }
        }
        diff = Math.abs(index - to) - 1
        // Move all the slides between index and to in the right direction:
        while (diff) {
          diff -= 1
          this.move(
            this.circle((to > index ? to : index) - diff - 1),
            this.slideWidth * direction,
            0
          )
        }
        to = this.circle(to)
        this.move(index, this.slideWidth * direction, duration)
        this.move(to, 0, duration)
        if (this.options.continuous) {
          this.move(
            this.circle(to - direction),
            -(this.slideWidth * direction),
            0
          )
        }
      } else {
        to = this.circle(to)
        this.animate(index * -this.slideWidth, to * -this.slideWidth, duration)
      }
      this.onslide(to)
    },

    getIndex: function () {
      return this.index
    },

    getNumber: function () {
      return this.num
    },

    prev: function () {
      if (this.options.continuous || this.index) {
        this.slide(this.index - 1)
      }
    },

    next: function () {
      if (this.options.continuous || this.index < this.num - 1) {
        this.slide(this.index + 1)
      }
    },

    play: function (time) {
      var that = this
      var nextIndex =
        this.index + (this.options.slideshowDirection === 'rtl' ? -1 : 1)
      window.clearTimeout(this.timeout)
      this.interval = time || this.options.slideshowInterval
      if (this.elements[this.index] > 1) {
        this.timeout = this.setTimeout(
          (!this.requestAnimationFrame && this.slide) ||
            function (to, duration) {
              that.animationFrameId = that.requestAnimationFrame.call(
                window,
                function () {
                  that.slide(to, duration)
                }
              )
            },
          [nextIndex, this.options.slideshowTransitionDuration],
          this.interval
        )
      }
      this.container.addClass(this.options.playingClass)
      this.slidesContainer[0].setAttribute('aria-live', 'off')
      if (this.playPauseElement.length) {
        this.playPauseElement[0].setAttribute('aria-pressed', 'true')
      }
    },

    pause: function () {
      window.clearTimeout(this.timeout)
      this.interval = null
      if (this.cancelAnimationFrame) {
        this.cancelAnimationFrame.call(window, this.animationFrameId)
        this.animationFrameId = null
      }
      this.container.removeClass(this.options.playingClass)
      this.slidesContainer[0].setAttribute('aria-live', 'polite')
      if (this.playPauseElement.length) {
        this.playPauseElement[0].setAttribute('aria-pressed', 'false')
      }
    },

    add: function (list) {
      var i
      if (!list.concat) {
        // Make a real array out of the list to add:
        list = Array.prototype.slice.call(list)
      }
      if (!this.list.concat) {
        // Make a real array out of the Gallery list:
        this.list = Array.prototype.slice.call(this.list)
      }
      this.list = this.list.concat(list)
      this.num = this.list.length
      if (this.num > 2 && this.options.continuous === null) {
        this.options.continuous = true
        this.container.removeClass(this.options.leftEdgeClass)
      }
      this.container
        .removeClass(this.options.rightEdgeClass)
        .removeClass(this.options.singleClass)
      for (i = this.num - list.length; i < this.num; i += 1) {
        this.addSlide(i)
        this.positionSlide(i)
      }
      this.positions.length = this.num
      this.initSlides(true)
    },

    resetSlides: function () {
      this.slidesContainer.empty()
      this.unloadAllSlides()
      this.slides = []
    },

    handleClose: function () {
      var options = this.options
      this.destroyEventListeners()
      // Cancel the slideshow:
      this.pause()
      this.container[0].style.display = 'none'
      this.container
        .removeClass(options.displayClass)
        .removeClass(options.singleClass)
        .removeClass(options.leftEdgeClass)
        .removeClass(options.rightEdgeClass)
      if (options.hidePageScrollbars) {
        document.body.style.overflow = this.bodyOverflowStyle
      }
      if (this.options.clearSlides) {
        this.resetSlides()
      }
      if (this.options.onclosed) {
        this.options.onclosed.call(this)
      }
    },

    close: function () {
      var that = this
      /**
       * Close handler
       *
       * @param {event} event Close event
       */
      function closeHandler(event) {
        if (event.target === that.container[0]) {
          that.container.off(that.support.transition.end, closeHandler)
          that.handleClose()
        }
      }
      if (this.options.onclose) {
        this.options.onclose.call(this)
      }
      if (this.support.transition && this.options.displayTransition) {
        this.container.on(this.support.transition.end, closeHandler)
        this.container.removeClass(this.options.displayClass)
      } else {
        this.handleClose()
      }
    },

    circle: function (index) {
      // Always return a number inside of the slides index range:
      return (this.num + (index % this.num)) % this.num
    },

    move: function (index, dist, duration) {
      this.translateX(index, dist, duration)
      this.positions[index] = dist
    },

    translate: function (index, x, y, duration) {
      if (!this.slides[index]) return
      var style = this.slides[index].style
      var transition = this.support.transition
      var transform = this.support.transform
      style[transition.name + 'Duration'] = duration + 'ms'
      style[transform.name] =
        'translate(' +
        x +
        'px, ' +
        y +
        'px)' +
        (transform.translateZ ? ' translateZ(0)' : '')
    },

    translateX: function (index, x, duration) {
      this.translate(index, x, 0, duration)
    },

    translateY: function (index, y, duration) {
      this.translate(index, 0, y, duration)
    },

    animate: function (from, to, duration) {
      if (!duration) {
        this.slidesContainer[0].style.left = to + 'px'
        return
      }
      var that = this
      var start = new Date().getTime()
      var timer = window.setInterval(function () {
        var timeElap = new Date().getTime() - start
        if (timeElap > duration) {
          that.slidesContainer[0].style.left = to + 'px'
          that.ontransitionend()
          window.clearInterval(timer)
          return
        }
        that.slidesContainer[0].style.left =
          (to - from) * (Math.floor((timeElap / duration) * 100) / 100) +
          from +
          'px'
      }, 4)
    },

    preventDefault: function (event) {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
    },

    stopPropagation: function (event) {
      if (event.stopPropagation) {
        event.stopPropagation()
      } else {
        event.cancelBubble = true
      }
    },

    onresize: function () {
      this.initSlides(true)
    },

    onhashchange: function () {
      if (this.options.closeOnHashChange) {
        this.close()
      }
    },

    onmousedown: function (event) {
      // Trigger on clicks of the left mouse button only
      // and exclude video & audio elements:
      if (
        event.which &&
        event.which === 1 &&
        event.target.nodeName !== 'VIDEO' &&
        event.target.nodeName !== 'AUDIO'
      ) {
        // Preventing the default mousedown action is required
        // to make touch emulation work with Firefox:
        event.preventDefault()
        ;(event.originalEvent || event).touches = [
          {
            pageX: event.pageX,
            pageY: event.pageY
          }
        ]
        this.ontouchstart(event)
      }
    },

    onmousemove: function (event) {
      if (this.touchStart) {
        ;(event.originalEvent || event).touches = [
          {
            pageX: event.pageX,
            pageY: event.pageY
          }
        ]
        this.ontouchmove(event)
      }
    },

    onmouseup: function (event) {
      if (this.touchStart) {
        this.ontouchend(event)
        delete this.touchStart
      }
    },

    onmouseout: function (event) {
      if (this.touchStart) {
        var target = event.target
        var related = event.relatedTarget
        if (!related || (related !== target && !$.contains(target, related))) {
          this.onmouseup(event)
        }
      }
    },

    ontouchstart: function (event) {
      if (this.options.stopTouchEventsPropagation) {
        this.stopPropagation(event)
      }
      // jQuery doesn't copy touch event properties by default,
      // so we have to access the originalEvent object:
      var touch = (event.originalEvent || event).touches[0]
      this.touchStart = {
        // Remember the initial touch coordinates:
        x: touch.pageX,
        y: touch.pageY,
        // Store the time to determine touch duration:
        time: Date.now()
      }
      // Helper variable to detect scroll movement:
      this.isScrolling = undefined
      // Reset delta values:
      this.touchDelta = {}
    },

    ontouchmove: function (event) {
      if (this.options.stopTouchEventsPropagation) {
        this.stopPropagation(event)
      }
      // jQuery doesn't copy touch event properties by default,
      // so we have to access the originalEvent object:
      var touches = (event.originalEvent || event).touches
      var touch = touches[0]
      var scale = (event.originalEvent || event).scale
      var index = this.index
      var touchDeltaX
      var indices
      // Ensure this is a one touch swipe and not, e.g. a pinch:
      if (touches.length > 1 || (scale && scale !== 1)) {
        return
      }
      if (this.options.disableScroll) {
        event.preventDefault()
      }
      // Measure change in x and y coordinates:
      this.touchDelta = {
        x: touch.pageX - this.touchStart.x,
        y: touch.pageY - this.touchStart.y
      }
      touchDeltaX = this.touchDelta.x
      // Detect if this is a vertical scroll movement (run only once per touch):
      if (this.isScrolling === undefined) {
        this.isScrolling =
          this.isScrolling ||
          Math.abs(touchDeltaX) < Math.abs(this.touchDelta.y)
      }
      if (!this.isScrolling) {
        // Always prevent horizontal scroll:
        event.preventDefault()
        // Stop the slideshow:
        window.clearTimeout(this.timeout)
        if (this.options.continuous) {
          indices = [this.circle(index + 1), index, this.circle(index - 1)]
        } else {
          // Increase resistance if first slide and sliding left
          // or last slide and sliding right:
          this.touchDelta.x = touchDeltaX =
            touchDeltaX /
            ((!index && touchDeltaX > 0) ||
            (index === this.num - 1 && touchDeltaX < 0)
              ? Math.abs(touchDeltaX) / this.slideWidth + 1
              : 1)
          indices = [index]
          if (index) {
            indices.push(index - 1)
          }
          if (index < this.num - 1) {
            indices.unshift(index + 1)
          }
        }
        while (indices.length) {
          index = indices.pop()
          this.translateX(index, touchDeltaX + this.positions[index], 0)
        }
      } else if (!this.options.carousel) {
        this.translateY(index, this.touchDelta.y + this.positions[index], 0)
      }
    },

    ontouchend: function (event) {
      if (this.options.stopTouchEventsPropagation) {
        this.stopPropagation(event)
      }
      var index = this.index
      var absTouchDeltaX = Math.abs(this.touchDelta.x)
      var slideWidth = this.slideWidth
      var duration = Math.ceil(
        (this.options.transitionDuration * (1 - absTouchDeltaX / slideWidth)) /
          2
      )
      // Determine if slide attempt triggers next/prev slide:
      var isValidSlide = absTouchDeltaX > 20
      // Determine if slide attempt is past start or end:
      var isPastBounds =
        (!index && this.touchDelta.x > 0) ||
        (index === this.num - 1 && this.touchDelta.x < 0)
      var isValidClose =
        !isValidSlide &&
        this.options.closeOnSwipeUpOrDown &&
        Math.abs(this.touchDelta.y) > 20
      var direction
      var indexForward
      var indexBackward
      var distanceForward
      var distanceBackward
      if (this.options.continuous) {
        isPastBounds = false
      }
      // Determine direction of swipe (true: right, false: left):
      direction = this.touchDelta.x < 0 ? -1 : 1
      if (!this.isScrolling) {
        if (isValidSlide && !isPastBounds) {
          indexForward = index + direction
          indexBackward = index - direction
          distanceForward = slideWidth * direction
          distanceBackward = -slideWidth * direction
          if (this.options.continuous) {
            this.move(this.circle(indexForward), distanceForward, 0)
            this.move(this.circle(index - 2 * direction), distanceBackward, 0)
          } else if (indexForward >= 0 && indexForward < this.num) {
            this.move(indexForward, distanceForward, 0)
          }
          this.move(index, this.positions[index] + distanceForward, duration)
          this.move(
            this.circle(indexBackward),
            this.positions[this.circle(indexBackward)] + distanceForward,
            duration
          )
          index = this.circle(indexBackward)
          this.onslide(index)
        } else {
          // Move back into position
          if (this.options.continuous) {
            this.move(this.circle(index - 1), -slideWidth, duration)
            this.move(index, 0, duration)
            this.move(this.circle(index + 1), slideWidth, duration)
          } else {
            if (index) {
              this.move(index - 1, -slideWidth, duration)
            }
            this.move(index, 0, duration)
            if (index < this.num - 1) {
              this.move(index + 1, slideWidth, duration)
            }
          }
        }
      } else {
        if (isValidClose) {
          this.close()
        } else {
          // Move back into position
          this.translateY(index, 0, duration)
        }
      }
    },

    ontouchcancel: function (event) {
      if (this.touchStart) {
        this.ontouchend(event)
        delete this.touchStart
      }
    },

    ontransitionend: function (event) {
      var slide = this.slides[this.index]
      if (!event || slide === event.target) {
        if (this.interval) {
          this.play()
        }
        this.setTimeout(this.options.onslideend, [this.index, slide])
      }
    },

    oncomplete: function (event) {
      var target = event.target || event.srcElement
      var parent = target && target.parentNode
      var index
      if (!target || !parent) {
        return
      }
      index = this.getNodeIndex(parent)
      $(parent).removeClass(this.options.slideLoadingClass)
      if (event.type === 'error') {
        $(parent).addClass(this.options.slideErrorClass)
        this.elements[index] = 3 // Fail
      } else {
        this.elements[index] = 2 // Done
      }
      // Fix for IE7's lack of support for percentage max-height:
      if (target.clientHeight > this.container[0].clientHeight) {
        target.style.maxHeight = this.container[0].clientHeight
      }
      if (this.interval && this.slides[this.index] === parent) {
        this.play()
      }
      this.setTimeout(this.options.onslidecomplete, [index, parent])
    },

    onload: function (event) {
      this.oncomplete(event)
    },

    onerror: function (event) {
      this.oncomplete(event)
    },

    onkeydown: function (event) {
      switch (event.which || event.keyCode) {
        case 13: // Enter
          if (this.options.toggleControlsOnEnter) {
            this.preventDefault(event)
            this.toggleControls()
          }
          break
        case 27: // Escape
          if (this.options.closeOnEscape) {
            this.close()
            // prevent Escape from closing other things
            event.stopImmediatePropagation()
          }
          break
        case 32: // Space
          if (this.options.toggleSlideshowOnSpace) {
            this.preventDefault(event)
            this.toggleSlideshow()
          }
          break
        case 37: // ArrowLeft
          if (this.options.enableKeyboardNavigation) {
            this.preventDefault(event)
            this.prev()
          }
          break
        case 39: // ArrowRight
          if (this.options.enableKeyboardNavigation) {
            this.preventDefault(event)
            this.next()
          }
          break
      }
    },

    handleClick: function (event) {
      var options = this.options
      var target = event.target || event.srcElement
      var parent = target.parentNode
      /**
       * Checks if the target from the close has the given class
       *
       * @param {string} className Class name
       * @returns {boolean} Returns true if the target has the class name
       */
      function isTarget(className) {
        return $(target).hasClass(className) || $(parent).hasClass(className)
      }
      if (isTarget(options.toggleClass)) {
        // Click on "toggle" control
        this.preventDefault(event)
        this.toggleControls()
      } else if (isTarget(options.prevClass)) {
        // Click on "prev" control
        this.preventDefault(event)
        this.prev()
      } else if (isTarget(options.nextClass)) {
        // Click on "next" control
        this.preventDefault(event)
        this.next()
      } else if (isTarget(options.closeClass)) {
        // Click on "close" control
        this.preventDefault(event)
        this.close()
      } else if (isTarget(options.playPauseClass)) {
        // Click on "play-pause" control
        this.preventDefault(event)
        this.toggleSlideshow()
      } else if (parent === this.slidesContainer[0]) {
        // Click on slide background
        if (options.closeOnSlideClick) {
          this.preventDefault(event)
          this.close()
        } else if (options.toggleControlsOnSlideClick) {
          this.preventDefault(event)
          this.toggleControls()
        }
      } else if (
        parent.parentNode &&
        parent.parentNode === this.slidesContainer[0]
      ) {
        // Click on displayed element
        if (options.toggleControlsOnSlideClick) {
          this.preventDefault(event)
          this.toggleControls()
        }
      }
    },

    onclick: function (event) {
      if (
        this.options.emulateTouchEvents &&
        this.touchDelta &&
        (Math.abs(this.touchDelta.x) > 20 || Math.abs(this.touchDelta.y) > 20)
      ) {
        delete this.touchDelta
        return
      }
      return this.handleClick(event)
    },

    updateEdgeClasses: function (index) {
      if (!index) {
        this.container.addClass(this.options.leftEdgeClass)
      } else {
        this.container.removeClass(this.options.leftEdgeClass)
      }
      if (index === this.num - 1) {
        this.container.addClass(this.options.rightEdgeClass)
      } else {
        this.container.removeClass(this.options.rightEdgeClass)
      }
    },

    updateActiveSlide: function (oldIndex, newIndex) {
      var slides = this.slides
      var options = this.options
      var list = [
        {
          index: newIndex,
          method: 'addClass',
          hidden: false
        },
        {
          index: oldIndex,
          method: 'removeClass',
          hidden: true
        }
      ]
      var item, index
      while (list.length) {
        item = list.pop()
        $(slides[item.index])[item.method](options.slideActiveClass)
        index = this.circle(item.index - 1)
        if (options.continuous || index < item.index) {
          $(slides[index])[item.method](options.slidePrevClass)
        }
        index = this.circle(item.index + 1)
        if (options.continuous || index > item.index) {
          $(slides[index])[item.method](options.slideNextClass)
        }
      }
      this.slides[oldIndex].setAttribute('aria-hidden', 'true')
      this.slides[newIndex].removeAttribute('aria-hidden')
    },

    handleSlide: function (oldIndex, newIndex) {
      if (!this.options.continuous) {
        this.updateEdgeClasses(newIndex)
      }
      this.updateActiveSlide(oldIndex, newIndex)
      this.loadElements(newIndex)
      if (this.options.unloadElements) {
        this.unloadElements(oldIndex, newIndex)
      }
      this.setTitle(newIndex)
    },

    onslide: function (index) {
      this.handleSlide(this.index, index)
      this.index = index
      this.setTimeout(this.options.onslide, [index, this.slides[index]])
    },

    setTitle: function (index) {
      var firstChild = this.slides[index].firstChild
      var text = firstChild.title || firstChild.alt
      var titleElement = this.titleElement
      if (titleElement.length) {
        this.titleElement.empty()
        if (text) {
          titleElement[0].appendChild(document.createTextNode(text))
        }
      }
    },

    setTimeout: function (func, args, wait) {
      var that = this
      return (
        func &&
        window.setTimeout(function () {
          func.apply(that, args || [])
        }, wait || 0)
      )
    },

    imageFactory: function (obj, callback) {
      var options = this.options
      var that = this
      var url = obj
      var img = this.imagePrototype.cloneNode(false)
      var picture
      var called
      var sources
      var srcset
      var sizes
      var title
      var altText
      var i
      /**
       * Wraps the callback function for the load/error event
       *
       * @param {event} event load/error event
       * @returns {number} timeout ID
       */
      function callbackWrapper(event) {
        if (!called) {
          event = {
            type: event.type,
            target: picture || img
          }
          if (!event.target.parentNode) {
            // Fix for browsers (e.g. IE7) firing the load event for
            // cached images before the element could
            // be added to the DOM:
            return that.setTimeout(callbackWrapper, [event])
          }
          called = true
          $(img).off('load error', callbackWrapper)
          callback(event)
        }
      }
      if (typeof url !== 'string') {
        url = this.getItemProperty(obj, options.urlProperty)
        sources =
          this.support.picture &&
          this.support.source &&
          this.getItemProperty(obj, options.sourcesProperty)
        srcset = this.getItemProperty(obj, options.srcsetProperty)
        sizes = this.getItemProperty(obj, options.sizesProperty)
        title = this.getItemProperty(obj, options.titleProperty)
        altText = this.getItemProperty(obj, options.altTextProperty) || title
      }
      img.draggable = false
      if (title) {
        img.title = title
      }
      if (altText) {
        img.alt = altText
      }
      $(img).on('load error', callbackWrapper)
      if (sources && sources.length) {
        picture = this.picturePrototype.cloneNode(false)
        for (i = 0; i < sources.length; i += 1) {
          picture.appendChild(
            $.extend(this.sourcePrototype.cloneNode(false), sources[i])
          )
        }
        picture.appendChild(img)
        $(picture).addClass(options.toggleClass)
      }
      if (srcset) {
        if (sizes) {
          img.sizes = sizes
        }
        img.srcset = srcset
      }
      img.src = url
      if (picture) return picture
      return img
    },

    createElement: function (obj, callback) {
      var type = obj && this.getItemProperty(obj, this.options.typeProperty)
      var factory =
        (type && this[type.split('/')[0] + 'Factory']) || this.imageFactory
      var element = obj && factory.call(this, obj, callback)
      if (!element) {
        element = this.elementPrototype.cloneNode(false)
        this.setTimeout(callback, [
          {
            type: 'error',
            target: element
          }
        ])
      }
      $(element).addClass(this.options.slideContentClass)
      return element
    },

    iteratePreloadRange: function (index, func) {
      var num = this.num
      var options = this.options
      var limit = Math.min(num, options.preloadRange * 2 + 1)
      var j = index
      var i
      for (i = 0; i < limit; i += 1) {
        // First iterate to the current index (0),
        // then the next one (+1),
        // then the previous one (-1),
        // then the next after next (+2),
        // then the one before the previous one (-2), etc.:
        j += i * (i % 2 === 0 ? -1 : 1)
        if (j < 0 || j >= num) {
          if (!options.continuous) continue
          // Connect the ends of the list to load slide elements for
          // continuous iteration:
          j = this.circle(j)
        }
        func.call(this, j)
      }
    },

    loadElement: function (index) {
      if (!this.elements[index]) {
        if (this.slides[index].firstChild) {
          this.elements[index] = $(this.slides[index]).hasClass(
            this.options.slideErrorClass
          )
            ? 3
            : 2
        } else {
          this.elements[index] = 1 // Loading
          $(this.slides[index]).addClass(this.options.slideLoadingClass)
          this.slides[index].appendChild(
            this.createElement(this.list[index], this.proxyListener)
          )
        }
      }
    },

    loadElements: function (index) {
      this.iteratePreloadRange(index, this.loadElement)
    },

    unloadElements: function (oldIndex, newIndex) {
      var preloadRange = this.options.preloadRange
      this.iteratePreloadRange(oldIndex, function (i) {
        var diff = Math.abs(i - newIndex)
        if (diff > preloadRange && diff + preloadRange < this.num) {
          this.unloadSlide(i)
          delete this.elements[i]
        }
      })
    },

    addSlide: function (index) {
      var slide = this.slidePrototype.cloneNode(false)
      slide.setAttribute('data-index', index)
      slide.setAttribute('aria-hidden', 'true')
      this.slidesContainer[0].appendChild(slide)
      this.slides.push(slide)
    },

    positionSlide: function (index) {
      var slide = this.slides[index]
      slide.style.width = this.slideWidth + 'px'
      if (this.support.transform) {
        slide.style.left = index * -this.slideWidth + 'px'
        this.move(
          index,
          this.index > index
            ? -this.slideWidth
            : this.index < index
            ? this.slideWidth
            : 0,
          0
        )
      }
    },

    initSlides: function (reload) {
      var clearSlides, i
      if (!reload) {
        this.positions = []
        this.positions.length = this.num
        this.elements = {}
        this.picturePrototype =
          this.support.picture && document.createElement('picture')
        this.sourcePrototype =
          this.support.source && document.createElement('source')
        this.imagePrototype = document.createElement('img')
        this.elementPrototype = document.createElement('div')
        this.slidePrototype = this.elementPrototype.cloneNode(false)
        $(this.slidePrototype).addClass(this.options.slideClass)
        this.slides = this.slidesContainer[0].children
        clearSlides =
          this.options.clearSlides || this.slides.length !== this.num
      }
      this.slideWidth = this.container[0].clientWidth
      this.slideHeight = this.container[0].clientHeight
      this.slidesContainer[0].style.width = this.num * this.slideWidth + 'px'
      if (clearSlides) {
        this.resetSlides()
      }
      for (i = 0; i < this.num; i += 1) {
        if (clearSlides) {
          this.addSlide(i)
        }
        this.positionSlide(i)
      }
      // Reposition the slides before and after the given index:
      if (this.options.continuous && this.support.transform) {
        this.move(this.circle(this.index - 1), -this.slideWidth, 0)
        this.move(this.circle(this.index + 1), this.slideWidth, 0)
      }
      if (!this.support.transform) {
        this.slidesContainer[0].style.left =
          this.index * -this.slideWidth + 'px'
      }
    },

    unloadSlide: function (index) {
      var slide, firstChild
      slide = this.slides[index]
      firstChild = slide.firstChild
      if (firstChild !== null) {
        slide.removeChild(firstChild)
      }
    },

    unloadAllSlides: function () {
      var i, len
      for (i = 0, len = this.slides.length; i < len; i++) {
        this.unloadSlide(i)
      }
    },

    toggleControls: function () {
      var controlsClass = this.options.controlsClass
      if (this.container.hasClass(controlsClass)) {
        this.container.removeClass(controlsClass)
      } else {
        this.container.addClass(controlsClass)
      }
    },

    toggleSlideshow: function () {
      if (!this.interval) {
        this.play()
      } else {
        this.pause()
      }
    },

    getNodeIndex: function (element) {
      return parseInt(element.getAttribute('data-index'), 10)
    },

    getNestedProperty: function (obj, property) {
      property.replace(
        // Matches native JavaScript notation in a String,
        // e.g. '["doubleQuoteProp"].dotProp[2]'
        // eslint-disable-next-line no-useless-escape
        /\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,
        function (str, singleQuoteProp, doubleQuoteProp, arrayIndex, dotProp) {
          var prop =
            dotProp ||
            singleQuoteProp ||
            doubleQuoteProp ||
            (arrayIndex && parseInt(arrayIndex, 10))
          if (str && obj) {
            obj = obj[prop]
          }
        }
      )
      return obj
    },

    getDataProperty: function (obj, property) {
      var key
      var prop
      if (obj.dataset) {
        key = property.replace(/-([a-z])/g, function (_, b) {
          return b.toUpperCase()
        })
        prop = obj.dataset[key]
      } else if (obj.getAttribute) {
        prop = obj.getAttribute(
          'data-' + property.replace(/([A-Z])/g, '-$1').toLowerCase()
        )
      }
      if (typeof prop === 'string') {
        // eslint-disable-next-line no-useless-escape
        if (
          /^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(prop)
        ) {
          try {
            return $.parseJSON(prop)
          } catch (ignore) {
            // ignore JSON parsing errors
          }
        }
        return prop
      }
    },

    getItemProperty: function (obj, property) {
      var prop = this.getDataProperty(obj, property)
      if (prop === undefined) {
        prop = obj[property]
      }
      if (prop === undefined) {
        prop = this.getNestedProperty(obj, property)
      }
      return prop
    },

    initStartIndex: function () {
      var index = this.options.index
      var urlProperty = this.options.urlProperty
      var i
      // Check if the index is given as a list object:
      if (index && typeof index !== 'number') {
        for (i = 0; i < this.num; i += 1) {
          if (
            this.list[i] === index ||
            this.getItemProperty(this.list[i], urlProperty) ===
              this.getItemProperty(index, urlProperty)
          ) {
            index = i
            break
          }
        }
      }
      // Make sure the index is in the list range:
      this.index = this.circle(parseInt(index, 10) || 0)
    },

    initEventListeners: function () {
      var that = this
      var slidesContainer = this.slidesContainer
      /**
       * Proxy listener
       *
       * @param {event} event original event
       */
      function proxyListener(event) {
        var type =
          that.support.transition && that.support.transition.end === event.type
            ? 'transitionend'
            : event.type
        that['on' + type](event)
      }
      $(window).on('resize', proxyListener)
      $(window).on('hashchange', proxyListener)
      $(document.body).on('keydown', proxyListener)
      this.container.on('click', proxyListener)
      if (this.support.touch) {
        slidesContainer.on(
          'touchstart touchmove touchend touchcancel',
          proxyListener
        )
      } else if (this.options.emulateTouchEvents && this.support.transition) {
        slidesContainer.on(
          'mousedown mousemove mouseup mouseout',
          proxyListener
        )
      }
      if (this.support.transition) {
        slidesContainer.on(this.support.transition.end, proxyListener)
      }
      this.proxyListener = proxyListener
    },

    destroyEventListeners: function () {
      var slidesContainer = this.slidesContainer
      var proxyListener = this.proxyListener
      $(window).off('resize', proxyListener)
      $(document.body).off('keydown', proxyListener)
      this.container.off('click', proxyListener)
      if (this.support.touch) {
        slidesContainer.off(
          'touchstart touchmove touchend touchcancel',
          proxyListener
        )
      } else if (this.options.emulateTouchEvents && this.support.transition) {
        slidesContainer.off(
          'mousedown mousemove mouseup mouseout',
          proxyListener
        )
      }
      if (this.support.transition) {
        slidesContainer.off(this.support.transition.end, proxyListener)
      }
    },

    handleOpen: function () {
      if (this.options.onopened) {
        this.options.onopened.call(this)
      }
    },

    initWidget: function () {
      var that = this
      /**
       * Open handler
       *
       * @param {event} event Gallery open event
       */
      function openHandler(event) {
        if (event.target === that.container[0]) {
          that.container.off(that.support.transition.end, openHandler)
          that.handleOpen()
        }
      }
      this.container = $(this.options.container)
      if (!this.container.length) {
        this.console.log(
          'blueimp Gallery: Widget container not found.',
          this.options.container
        )
        return false
      }
      this.slidesContainer = this.container
        .find(this.options.slidesContainer)
        .first()
      if (!this.slidesContainer.length) {
        this.console.log(
          'blueimp Gallery: Slides container not found.',
          this.options.slidesContainer
        )
        return false
      }
      this.titleElement = this.container.find(this.options.titleElement).first()
      this.playPauseElement = this.container
        .find('.' + this.options.playPauseClass)
        .first()
      if (this.num === 1) {
        this.container.addClass(this.options.singleClass)
      }
      if (this.support.svgasimg) {
        this.container.addClass(this.options.svgasimgClass)
      }
      if (this.support.smil) {
        this.container.addClass(this.options.smilClass)
      }
      if (this.options.onopen) {
        this.options.onopen.call(this)
      }
      if (this.support.transition && this.options.displayTransition) {
        this.container.on(this.support.transition.end, openHandler)
      } else {
        this.handleOpen()
      }
      if (this.options.hidePageScrollbars) {
        // Hide the page scrollbars:
        this.bodyOverflowStyle = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
      this.container[0].style.display = 'block'
      this.initSlides()
      this.container.addClass(this.options.displayClass)
    },

    initOptions: function (options) {
      // Create a copy of the prototype options:
      this.options = $.extend({}, this.options)
      // Check if carousel mode is enabled:
      if (
        (options && options.carousel) ||
        (this.options.carousel && (!options || options.carousel !== false))
      ) {
        $.extend(this.options, this.carouselOptions)
      }
      // Override any given options:
      $.extend(this.options, options)
      if (this.num < 3) {
        // 1 or 2 slides cannot be displayed continuous,
        // remember the original option by setting to null instead of false:
        this.options.continuous = this.options.continuous ? null : false
      }
      if (!this.support.transition) {
        this.options.emulateTouchEvents = false
      }
      if (this.options.event) {
        this.preventDefault(this.options.event)
      }
    }
  })

  return Gallery
})


/***/ }),

/***/ "./node_modules/blueimp-gallery/js/blueimp-gallery.min.js":
/*!****************************************************************!*\
  !*** ./node_modules/blueimp-gallery/js/blueimp-gallery.min.js ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";function t(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}function i(t){if(!this||this.find!==i.prototype.find)return new i(t);if(this.length=0,t)if((t="string"==typeof t?this.find(t):t).nodeType||t===t.window)this.length=1,this[0]=t;else{var e=t.length;for(this.length=e;e;)this[--e]=t[e]}}i.extend=t,i.contains=function(t,e){do{if((e=e.parentNode)===t)return!0}while(e);return!1},i.parseJSON=function(t){return JSON.parse(t)},t(i.prototype,{find:function(t){var e=this[0]||document;return new i(t="string"==typeof t?e.querySelectorAll?e.querySelectorAll(t):"#"===t.charAt(0)?e.getElementById(t.slice(1)):e.getElementsByTagName(t):t)},hasClass:function(t){return!!this[0]&&new RegExp("(?:^|\\s+)"+t+"(?:\\s+|$)").test(this[0].className)},addClass:function(t){for(var e,i,s,n=this.length;n;)if((i=this[--n]).className)for(e=e||t.split(/\s+/),s=0;s<e.length;s+=1)this.hasClass(e[s])||(i.className+=" "+e[s]);else i.className=t;return this},removeClass:function(t){for(var e,i=new RegExp("^(?:"+t.split(/\s+/).join("|")+")$"),s=/(\S+)(?:\s+|$)/g,n=function(t,e){return i.test(e)?"":t},o=/\s+$/,a=this.length;a;)(e=this[--a]).className=e.className.replace(s,n).replace(o,"");return this},on:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)(s=this[--i]).addEventListener?s.addEventListener(t,e,!1):s.attachEvent&&s.attachEvent("on"+t,e);return this},off:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)(s=this[--i]).removeEventListener?s.removeEventListener(t,e,!1):s.detachEvent&&s.detachEvent("on"+t,e);return this},empty:function(){for(var t,e=this.length;e;)for(t=this[--e];t.hasChildNodes();)t.removeChild(t.lastChild);return this},first:function(){return new i(this[0])}}), true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return i}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):(0)}(),function(t){"use strict"; true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):(0)}(function(f){"use strict";function i(t,e){return document.body.style.maxHeight===undefined?null:this&&this.options===i.prototype.options?void(t&&t.length?(this.list=t,this.num=t.length,this.initOptions(e),this.initialize()):this.console.log("blueimp Gallery: No or empty list provided as first argument.",t)):new i(t,e)}return f.extend(i.prototype,{options:{container:"#blueimp-gallery",slidesContainer:"div",titleElement:"h3",displayClass:"blueimp-gallery-display",controlsClass:"blueimp-gallery-controls",singleClass:"blueimp-gallery-single",leftEdgeClass:"blueimp-gallery-left",rightEdgeClass:"blueimp-gallery-right",playingClass:"blueimp-gallery-playing",svgasimgClass:"blueimp-gallery-svgasimg",smilClass:"blueimp-gallery-smil",slideClass:"slide",slideActiveClass:"slide-active",slidePrevClass:"slide-prev",slideNextClass:"slide-next",slideLoadingClass:"slide-loading",slideErrorClass:"slide-error",slideContentClass:"slide-content",toggleClass:"toggle",prevClass:"prev",nextClass:"next",closeClass:"close",playPauseClass:"play-pause",typeProperty:"type",titleProperty:"title",altTextProperty:"alt",urlProperty:"href",srcsetProperty:"srcset",sizesProperty:"sizes",sourcesProperty:"sources",displayTransition:!0,clearSlides:!0,toggleControlsOnEnter:!0,toggleControlsOnSlideClick:!0,toggleSlideshowOnSpace:!0,enableKeyboardNavigation:!0,closeOnEscape:!0,closeOnSlideClick:!0,closeOnSwipeUpOrDown:!0,closeOnHashChange:!0,emulateTouchEvents:!0,stopTouchEventsPropagation:!1,hidePageScrollbars:!0,disableScroll:!0,carousel:!1,continuous:!0,unloadElements:!0,startSlideshow:!1,slideshowInterval:5e3,slideshowDirection:"ltr",index:0,preloadRange:2,transitionDuration:300,slideshowTransitionDuration:500,event:undefined,onopen:undefined,onopened:undefined,onslide:undefined,onslideend:undefined,onslidecomplete:undefined,onclose:undefined,onclosed:undefined},carouselOptions:{hidePageScrollbars:!1,toggleControlsOnEnter:!1,toggleSlideshowOnSpace:!1,enableKeyboardNavigation:!1,closeOnEscape:!1,closeOnSlideClick:!1,closeOnSwipeUpOrDown:!1,closeOnHashChange:!1,disableScroll:!1,startSlideshow:!0},console:window.console&&"function"==typeof window.console.log?window.console:{log:function(){}},support:function(s){var t,n={source:!!window.HTMLSourceElement,picture:!!window.HTMLPictureElement,svgasimg:document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"),smil:!!document.createElementNS&&/SVGAnimate/.test(document.createElementNS("http://www.w3.org/2000/svg","animate").toString()),touch:window.ontouchstart!==undefined||window.DocumentTouch&&document instanceof DocumentTouch},e={webkitTransition:{end:"webkitTransitionEnd",prefix:"-webkit-"},MozTransition:{end:"transitionend",prefix:"-moz-"},OTransition:{end:"otransitionend",prefix:"-o-"},transition:{end:"transitionend",prefix:""}};for(t in e)if(Object.prototype.hasOwnProperty.call(e,t)&&s.style[t]!==undefined){n.transition=e[t],n.transition.name=t;break}function i(){var t,e,i=n.transition;document.body.appendChild(s),i&&(t=i.name.slice(0,-9)+"ransform",s.style[t]!==undefined&&(s.style[t]="translateZ(0)",e=window.getComputedStyle(s).getPropertyValue(i.prefix+"transform"),n.transform={prefix:i.prefix,name:t,translate:!0,translateZ:!!e&&"none"!==e})),document.body.removeChild(s)}return document.body?i():f(document).on("DOMContentLoaded",i),n}(document.createElement("div")),requestAnimationFrame:window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,cancelAnimationFrame:window.cancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame,initialize:function(){if(this.initStartIndex(),!1===this.initWidget())return!1;this.initEventListeners(),this.onslide(this.index),this.ontransitionend(),this.options.startSlideshow&&this.play()},slide:function(t,e){window.clearTimeout(this.timeout);var i,s,n,o=this.index;if(o!==t&&1!==this.num){if(e=e||this.options.transitionDuration,this.support.transform){for(this.options.continuous||(t=this.circle(t)),i=Math.abs(o-t)/(o-t),this.options.continuous&&(s=i,(i=-this.positions[this.circle(t)]/this.slideWidth)!==s&&(t=-i*this.num+t)),n=Math.abs(o-t)-1;n;)this.move(this.circle((o<t?t:o)- --n-1),this.slideWidth*i,0);t=this.circle(t),this.move(o,this.slideWidth*i,e),this.move(t,0,e),this.options.continuous&&this.move(this.circle(t-i),-this.slideWidth*i,0)}else t=this.circle(t),this.animate(o*-this.slideWidth,t*-this.slideWidth,e);this.onslide(t)}},getIndex:function(){return this.index},getNumber:function(){return this.num},prev:function(){(this.options.continuous||this.index)&&this.slide(this.index-1)},next:function(){(this.options.continuous||this.index<this.num-1)&&this.slide(this.index+1)},play:function(t){var i=this,e=this.index+("rtl"===this.options.slideshowDirection?-1:1);window.clearTimeout(this.timeout),this.interval=t||this.options.slideshowInterval,1<this.elements[this.index]&&(this.timeout=this.setTimeout(!this.requestAnimationFrame&&this.slide||function(t,e){i.animationFrameId=i.requestAnimationFrame.call(window,function(){i.slide(t,e)})},[e,this.options.slideshowTransitionDuration],this.interval)),this.container.addClass(this.options.playingClass),this.slidesContainer[0].setAttribute("aria-live","off"),this.playPauseElement.length&&this.playPauseElement[0].setAttribute("aria-pressed","true")},pause:function(){window.clearTimeout(this.timeout),this.interval=null,this.cancelAnimationFrame&&(this.cancelAnimationFrame.call(window,this.animationFrameId),this.animationFrameId=null),this.container.removeClass(this.options.playingClass),this.slidesContainer[0].setAttribute("aria-live","polite"),this.playPauseElement.length&&this.playPauseElement[0].setAttribute("aria-pressed","false")},add:function(t){var e;for(t.concat||(t=Array.prototype.slice.call(t)),this.list.concat||(this.list=Array.prototype.slice.call(this.list)),this.list=this.list.concat(t),this.num=this.list.length,2<this.num&&null===this.options.continuous&&(this.options.continuous=!0,this.container.removeClass(this.options.leftEdgeClass)),this.container.removeClass(this.options.rightEdgeClass).removeClass(this.options.singleClass),e=this.num-t.length;e<this.num;e+=1)this.addSlide(e),this.positionSlide(e);this.positions.length=this.num,this.initSlides(!0)},resetSlides:function(){this.slidesContainer.empty(),this.unloadAllSlides(),this.slides=[]},handleClose:function(){var t=this.options;this.destroyEventListeners(),this.pause(),this.container[0].style.display="none",this.container.removeClass(t.displayClass).removeClass(t.singleClass).removeClass(t.leftEdgeClass).removeClass(t.rightEdgeClass),t.hidePageScrollbars&&(document.body.style.overflow=this.bodyOverflowStyle),this.options.clearSlides&&this.resetSlides(),this.options.onclosed&&this.options.onclosed.call(this)},close:function(){var e=this;this.options.onclose&&this.options.onclose.call(this),this.support.transition&&this.options.displayTransition?(this.container.on(this.support.transition.end,function i(t){t.target===e.container[0]&&(e.container.off(e.support.transition.end,i),e.handleClose())}),this.container.removeClass(this.options.displayClass)):this.handleClose()},circle:function(t){return(this.num+t%this.num)%this.num},move:function(t,e,i){this.translateX(t,e,i),this.positions[t]=e},translate:function(t,e,i,s){var n,o;this.slides[t]&&(n=this.slides[t].style,o=this.support.transition,t=this.support.transform,n[o.name+"Duration"]=s+"ms",n[t.name]="translate("+e+"px, "+i+"px)"+(t.translateZ?" translateZ(0)":""))},translateX:function(t,e,i){this.translate(t,e,0,i)},translateY:function(t,e,i){this.translate(t,0,e,i)},animate:function(e,i,s){var n,o,a;s?(n=this,o=(new Date).getTime(),a=window.setInterval(function(){var t=(new Date).getTime()-o;if(s<t)return n.slidesContainer[0].style.left=i+"px",n.ontransitionend(),void window.clearInterval(a);n.slidesContainer[0].style.left=(i-e)*(Math.floor(t/s*100)/100)+e+"px"},4)):this.slidesContainer[0].style.left=i+"px"},preventDefault:function(t){t.preventDefault?t.preventDefault():t.returnValue=!1},stopPropagation:function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},onresize:function(){this.initSlides(!0)},onhashchange:function(){this.options.closeOnHashChange&&this.close()},onmousedown:function(t){t.which&&1===t.which&&"VIDEO"!==t.target.nodeName&&"AUDIO"!==t.target.nodeName&&(t.preventDefault(),(t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchstart(t))},onmousemove:function(t){this.touchStart&&((t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchmove(t))},onmouseup:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},onmouseout:function(t){var e,i;this.touchStart&&(e=t.target,(i=t.relatedTarget)&&(i===e||f.contains(e,i))||this.onmouseup(t))},ontouchstart:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);t=(t.originalEvent||t).touches[0];this.touchStart={x:t.pageX,y:t.pageY,time:Date.now()},this.isScrolling=undefined,this.touchDelta={}},ontouchmove:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e,i,s=(t.originalEvent||t).touches,n=s[0],o=(t.originalEvent||t).scale,a=this.index;if(!(1<s.length||o&&1!==o))if(this.options.disableScroll&&t.preventDefault(),this.touchDelta={x:n.pageX-this.touchStart.x,y:n.pageY-this.touchStart.y},e=this.touchDelta.x,this.isScrolling===undefined&&(this.isScrolling=this.isScrolling||Math.abs(e)<Math.abs(this.touchDelta.y)),this.isScrolling)this.options.carousel||this.translateY(a,this.touchDelta.y+this.positions[a],0);else for(t.preventDefault(),window.clearTimeout(this.timeout),this.options.continuous?i=[this.circle(a+1),a,this.circle(a-1)]:(this.touchDelta.x=e/=!a&&0<e||a===this.num-1&&e<0?Math.abs(e)/this.slideWidth+1:1,i=[a],a&&i.push(a-1),a<this.num-1&&i.unshift(a+1));i.length;)a=i.pop(),this.translateX(a,e+this.positions[a],0)},ontouchend:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e=this.index,i=Math.abs(this.touchDelta.x),s=this.slideWidth,n=Math.ceil(this.options.transitionDuration*(1-i/s)/2),o=20<i,a=!e&&0<this.touchDelta.x||e===this.num-1&&this.touchDelta.x<0,l=!o&&this.options.closeOnSwipeUpOrDown&&20<Math.abs(this.touchDelta.y);this.options.continuous&&(a=!1),t=this.touchDelta.x<0?-1:1,this.isScrolling?l?this.close():this.translateY(e,0,n):o&&!a?(i=e+t,l=e-t,o=s*t,a=-s*t,this.options.continuous?(this.move(this.circle(i),o,0),this.move(this.circle(e-2*t),a,0)):0<=i&&i<this.num&&this.move(i,o,0),this.move(e,this.positions[e]+o,n),this.move(this.circle(l),this.positions[this.circle(l)]+o,n),e=this.circle(l),this.onslide(e)):this.options.continuous?(this.move(this.circle(e-1),-s,n),this.move(e,0,n),this.move(this.circle(e+1),s,n)):(e&&this.move(e-1,-s,n),this.move(e,0,n),e<this.num-1&&this.move(e+1,s,n))},ontouchcancel:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},ontransitionend:function(t){var e=this.slides[this.index];t&&e!==t.target||(this.interval&&this.play(),this.setTimeout(this.options.onslideend,[this.index,e]))},oncomplete:function(t){var e,i=t.target||t.srcElement,s=i&&i.parentNode;i&&s&&(e=this.getNodeIndex(s),f(s).removeClass(this.options.slideLoadingClass),"error"===t.type?(f(s).addClass(this.options.slideErrorClass),this.elements[e]=3):this.elements[e]=2,i.clientHeight>this.container[0].clientHeight&&(i.style.maxHeight=this.container[0].clientHeight),this.interval&&this.slides[this.index]===s&&this.play(),this.setTimeout(this.options.onslidecomplete,[e,s]))},onload:function(t){this.oncomplete(t)},onerror:function(t){this.oncomplete(t)},onkeydown:function(t){switch(t.which||t.keyCode){case 13:this.options.toggleControlsOnEnter&&(this.preventDefault(t),this.toggleControls());break;case 27:this.options.closeOnEscape&&(this.close(),t.stopImmediatePropagation());break;case 32:this.options.toggleSlideshowOnSpace&&(this.preventDefault(t),this.toggleSlideshow());break;case 37:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.prev());break;case 39:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.next())}},handleClick:function(t){var e=this.options,i=t.target||t.srcElement,s=i.parentNode;function n(t){return f(i).hasClass(t)||f(s).hasClass(t)}n(e.toggleClass)?(this.preventDefault(t),this.toggleControls()):n(e.prevClass)?(this.preventDefault(t),this.prev()):n(e.nextClass)?(this.preventDefault(t),this.next()):n(e.closeClass)?(this.preventDefault(t),this.close()):n(e.playPauseClass)?(this.preventDefault(t),this.toggleSlideshow()):s===this.slidesContainer[0]?e.closeOnSlideClick?(this.preventDefault(t),this.close()):e.toggleControlsOnSlideClick&&(this.preventDefault(t),this.toggleControls()):s.parentNode&&s.parentNode===this.slidesContainer[0]&&e.toggleControlsOnSlideClick&&(this.preventDefault(t),this.toggleControls())},onclick:function(t){if(!(this.options.emulateTouchEvents&&this.touchDelta&&(20<Math.abs(this.touchDelta.x)||20<Math.abs(this.touchDelta.y))))return this.handleClick(t);delete this.touchDelta},updateEdgeClasses:function(t){t?this.container.removeClass(this.options.leftEdgeClass):this.container.addClass(this.options.leftEdgeClass),t===this.num-1?this.container.addClass(this.options.rightEdgeClass):this.container.removeClass(this.options.rightEdgeClass)},updateActiveSlide:function(t,e){for(var i,s,n=this.slides,o=this.options,a=[{index:e,method:"addClass",hidden:!1},{index:t,method:"removeClass",hidden:!0}];a.length;)i=a.pop(),f(n[i.index])[i.method](o.slideActiveClass),s=this.circle(i.index-1),(o.continuous||s<i.index)&&f(n[s])[i.method](o.slidePrevClass),s=this.circle(i.index+1),(o.continuous||s>i.index)&&f(n[s])[i.method](o.slideNextClass);this.slides[t].setAttribute("aria-hidden","true"),this.slides[e].removeAttribute("aria-hidden")},handleSlide:function(t,e){this.options.continuous||this.updateEdgeClasses(e),this.updateActiveSlide(t,e),this.loadElements(e),this.options.unloadElements&&this.unloadElements(t,e),this.setTitle(e)},onslide:function(t){this.handleSlide(this.index,t),this.index=t,this.setTimeout(this.options.onslide,[t,this.slides[t]])},setTitle:function(t){var e=this.slides[t].firstChild,t=e.title||e.alt,e=this.titleElement;e.length&&(this.titleElement.empty(),t&&e[0].appendChild(document.createTextNode(t)))},setTimeout:function(t,e,i){var s=this;return t&&window.setTimeout(function(){t.apply(s,e||[])},i||0)},imageFactory:function(t,e){var i,s,n,o,a,l,r,h,d=this.options,c=this,u=t,p=this.imagePrototype.cloneNode(!1);if("string"!=typeof u&&(u=this.getItemProperty(t,d.urlProperty),n=this.support.picture&&this.support.source&&this.getItemProperty(t,d.sourcesProperty),o=this.getItemProperty(t,d.srcsetProperty),a=this.getItemProperty(t,d.sizesProperty),l=this.getItemProperty(t,d.titleProperty),r=this.getItemProperty(t,d.altTextProperty)||l),p.draggable=!1,l&&(p.title=l),r&&(p.alt=r),f(p).on("load error",function m(t){if(!s){if(!(t={type:t.type,target:i||p}).target.parentNode)return c.setTimeout(m,[t]);s=!0,f(p).off("load error",m),e(t)}}),n&&n.length){for(i=this.picturePrototype.cloneNode(!1),h=0;h<n.length;h+=1)i.appendChild(f.extend(this.sourcePrototype.cloneNode(!1),n[h]));i.appendChild(p),f(i).addClass(d.toggleClass)}return o&&(a&&(p.sizes=a),p.srcset=o),p.src=u,i||p},createElement:function(t,e){var i=t&&this.getItemProperty(t,this.options.typeProperty),i=i&&this[i.split("/")[0]+"Factory"]||this.imageFactory,i=t&&i.call(this,t,e);return i||(i=this.elementPrototype.cloneNode(!1),this.setTimeout(e,[{type:"error",target:i}])),f(i).addClass(this.options.slideContentClass),i},iteratePreloadRange:function(t,e){for(var i=this.num,s=this.options,n=Math.min(i,2*s.preloadRange+1),o=t,a=0;a<n;a+=1){if((o+=a*(a%2==0?-1:1))<0||i<=o){if(!s.continuous)continue;o=this.circle(o)}e.call(this,o)}},loadElement:function(t){this.elements[t]||(this.slides[t].firstChild?this.elements[t]=f(this.slides[t]).hasClass(this.options.slideErrorClass)?3:2:(this.elements[t]=1,f(this.slides[t]).addClass(this.options.slideLoadingClass),this.slides[t].appendChild(this.createElement(this.list[t],this.proxyListener))))},loadElements:function(t){this.iteratePreloadRange(t,this.loadElement)},unloadElements:function(t,i){var s=this.options.preloadRange;this.iteratePreloadRange(t,function(t){var e=Math.abs(t-i);s<e&&e+s<this.num&&(this.unloadSlide(t),delete this.elements[t])})},addSlide:function(t){var e=this.slidePrototype.cloneNode(!1);e.setAttribute("data-index",t),e.setAttribute("aria-hidden","true"),this.slidesContainer[0].appendChild(e),this.slides.push(e)},positionSlide:function(t){var e=this.slides[t];e.style.width=this.slideWidth+"px",this.support.transform&&(e.style.left=t*-this.slideWidth+"px",this.move(t,this.index>t?-this.slideWidth:this.index<t?this.slideWidth:0,0))},initSlides:function(t){var e,i;for(t||(this.positions=[],this.positions.length=this.num,this.elements={},this.picturePrototype=this.support.picture&&document.createElement("picture"),this.sourcePrototype=this.support.source&&document.createElement("source"),this.imagePrototype=document.createElement("img"),this.elementPrototype=document.createElement("div"),this.slidePrototype=this.elementPrototype.cloneNode(!1),f(this.slidePrototype).addClass(this.options.slideClass),this.slides=this.slidesContainer[0].children,e=this.options.clearSlides||this.slides.length!==this.num),this.slideWidth=this.container[0].clientWidth,this.slideHeight=this.container[0].clientHeight,this.slidesContainer[0].style.width=this.num*this.slideWidth+"px",e&&this.resetSlides(),i=0;i<this.num;i+=1)e&&this.addSlide(i),this.positionSlide(i);this.options.continuous&&this.support.transform&&(this.move(this.circle(this.index-1),-this.slideWidth,0),this.move(this.circle(this.index+1),this.slideWidth,0)),this.support.transform||(this.slidesContainer[0].style.left=this.index*-this.slideWidth+"px")},unloadSlide:function(t){var e=this.slides[t],t=e.firstChild;null!==t&&e.removeChild(t)},unloadAllSlides:function(){for(var t=0,e=this.slides.length;t<e;t++)this.unloadSlide(t)},toggleControls:function(){var t=this.options.controlsClass;this.container.hasClass(t)?this.container.removeClass(t):this.container.addClass(t)},toggleSlideshow:function(){this.interval?this.pause():this.play()},getNodeIndex:function(t){return parseInt(t.getAttribute("data-index"),10)},getNestedProperty:function(o,t){return t.replace(/\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,function(t,e,i,s,n){s=n||e||i||s&&parseInt(s,10);t&&o&&(o=o[s])}),o},getDataProperty:function(t,e){var i;if(t.dataset?(i=e.replace(/-([a-z])/g,function(t,e){return e.toUpperCase()}),i=t.dataset[i]):t.getAttribute&&(i=t.getAttribute("data-"+e.replace(/([A-Z])/g,"-$1").toLowerCase())),"string"==typeof i){if(/^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(i))try{return f.parseJSON(i)}catch(s){}return i}},getItemProperty:function(t,e){var i=this.getDataProperty(t,e);return i=(i=i===undefined?t[e]:i)===undefined?this.getNestedProperty(t,e):i},initStartIndex:function(){var t,e=this.options.index,i=this.options.urlProperty;if(e&&"number"!=typeof e)for(t=0;t<this.num;t+=1)if(this.list[t]===e||this.getItemProperty(this.list[t],i)===this.getItemProperty(e,i)){e=t;break}this.index=this.circle(parseInt(e,10)||0)},initEventListeners:function(){var i=this,t=this.slidesContainer;function e(t){var e=i.support.transition&&i.support.transition.end===t.type?"transitionend":t.type;i["on"+e](t)}f(window).on("resize",e),f(window).on("hashchange",e),f(document.body).on("keydown",e),this.container.on("click",e),this.support.touch?t.on("touchstart touchmove touchend touchcancel",e):this.options.emulateTouchEvents&&this.support.transition&&t.on("mousedown mousemove mouseup mouseout",e),this.support.transition&&t.on(this.support.transition.end,e),this.proxyListener=e},destroyEventListeners:function(){var t=this.slidesContainer,e=this.proxyListener;f(window).off("resize",e),f(document.body).off("keydown",e),this.container.off("click",e),this.support.touch?t.off("touchstart touchmove touchend touchcancel",e):this.options.emulateTouchEvents&&this.support.transition&&t.off("mousedown mousemove mouseup mouseout",e),this.support.transition&&t.off(this.support.transition.end,e)},handleOpen:function(){this.options.onopened&&this.options.onopened.call(this)},initWidget:function(){var e=this;return this.container=f(this.options.container),this.container.length?(this.slidesContainer=this.container.find(this.options.slidesContainer).first(),this.slidesContainer.length?(this.titleElement=this.container.find(this.options.titleElement).first(),this.playPauseElement=this.container.find("."+this.options.playPauseClass).first(),1===this.num&&this.container.addClass(this.options.singleClass),this.support.svgasimg&&this.container.addClass(this.options.svgasimgClass),this.support.smil&&this.container.addClass(this.options.smilClass),this.options.onopen&&this.options.onopen.call(this),this.support.transition&&this.options.displayTransition?this.container.on(this.support.transition.end,function i(t){t.target===e.container[0]&&(e.container.off(e.support.transition.end,i),e.handleOpen())}):this.handleOpen(),this.options.hidePageScrollbars&&(this.bodyOverflowStyle=document.body.style.overflow,document.body.style.overflow="hidden"),this.container[0].style.display="block",this.initSlides(),void this.container.addClass(this.options.displayClass)):(this.console.log("blueimp Gallery: Slides container not found.",this.options.slidesContainer),!1)):(this.console.log("blueimp Gallery: Widget container not found.",this.options.container),!1)},initOptions:function(t){this.options=f.extend({},this.options),(t&&t.carousel||this.options.carousel&&(!t||!1!==t.carousel))&&f.extend(this.options,this.carouselOptions),f.extend(this.options,t),this.num<3&&(this.options.continuous=!!this.options.continuous&&null),this.support.transition||(this.options.emulateTouchEvents=!1),this.options.event&&this.preventDefault(this.options.event)}}),i}),function(t){"use strict"; true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js"),__webpack_require__(/*! ./blueimp-gallery */ "./node_modules/blueimp-gallery/js/blueimp-gallery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(function(t,e){"use strict";var i=e.prototype;t.extend(i.options,{fullscreen:!1});var s=i.initialize,n=i.close;return t.extend(i,{getFullScreenElement:function(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement},requestFullScreen:function(t){t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.msRequestFullscreen&&t.msRequestFullscreen()},exitFullScreen:function(){document.exitFullscreen?document.exitFullscreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen&&document.msExitFullscreen()},initialize:function(){s.call(this),this.options.fullscreen&&!this.getFullScreenElement()&&this.requestFullScreen(this.container[0])},close:function(){this.getFullScreenElement()===this.container[0]&&this.exitFullScreen(),n.call(this)}}),e}),function(t){"use strict"; true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js"),__webpack_require__(/*! ./blueimp-gallery */ "./node_modules/blueimp-gallery/js/blueimp-gallery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(function(a,t){"use strict";var e=t.prototype;a.extend(e.options,{indicatorContainer:"ol",activeIndicatorClass:"active",thumbnailProperty:"thumbnail",thumbnailIndicators:!0});var i=e.initSlides,s=e.addSlide,n=e.resetSlides,o=e.handleClick,l=e.handleSlide,r=e.handleClose;return a.extend(e,{createIndicator:function(t){var e,i,s=this.indicatorPrototype.cloneNode(!1),n=this.getItemProperty(t,this.options.titleProperty),o=this.options.thumbnailProperty;return this.options.thumbnailIndicators&&(e=(e=o?this.getItemProperty(t,o):e)===undefined&&(i=t.getElementsByTagName&&a(t).find("img")[0])?i.src:e)&&(s.style.backgroundImage='url("'+e+'")'),n&&(s.title=n),s.setAttribute("role","link"),s},addIndicator:function(t){var e;this.indicatorContainer.length&&((e=this.createIndicator(this.list[t])).setAttribute("data-index",t),this.indicatorContainer[0].appendChild(e),this.indicators.push(e))},setActiveIndicator:function(t){this.indicators&&(this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),this.activeIndicator=a(this.indicators[t]),this.activeIndicator.addClass(this.options.activeIndicatorClass))},initSlides:function(t){t||(this.indicatorContainer=this.container.find(this.options.indicatorContainer),this.indicatorContainer.length&&(this.indicatorPrototype=document.createElement("li"),this.indicators=this.indicatorContainer[0].children)),i.call(this,t)},addSlide:function(t){s.call(this,t),this.addIndicator(t)},resetSlides:function(){n.call(this),this.indicatorContainer.empty(),this.indicators=[]},handleClick:function(t){var e=t.target||t.srcElement,i=e.parentNode;if(i===this.indicatorContainer[0])this.preventDefault(t),this.slide(this.getNodeIndex(e));else{if(i.parentNode!==this.indicatorContainer[0])return o.call(this,t);this.preventDefault(t),this.slide(this.getNodeIndex(i))}},handleSlide:function(t,e){l.call(this,t,e),this.setActiveIndicator(e)},handleClose:function(){this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),r.call(this)}}),t}),function(t){"use strict"; true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js"),__webpack_require__(/*! ./blueimp-gallery */ "./node_modules/blueimp-gallery/js/blueimp-gallery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(function(C,t){"use strict";var e=t.prototype;C.extend(e.options,{videoContentClass:"video-content",videoLoadingClass:"video-loading",videoPlayingClass:"video-playing",videoIframeClass:"video-iframe",videoCoverClass:"video-cover",videoPlayClass:"video-play",videoPlaysInline:!0,videoPreloadProperty:"preload",videoPosterProperty:"poster"});var i=e.handleSlide;return C.extend(e,{handleSlide:function(t,e){i.call(this,t,e),this.setTimeout(function(){this.activeVideo&&this.activeVideo.pause()})},videoFactory:function(t,e,i){var s,n,o,a=this,l=this.options,r=this.elementPrototype.cloneNode(!1),h=C(r),d=[{type:"error",target:r}],c=i||document.createElement("video"),u=this.elementPrototype.cloneNode(!1),p=document.createElement("a"),m=this.getItemProperty(t,l.urlProperty),f=this.getItemProperty(t,l.sourcesProperty),y=this.getItemProperty(t,l.titleProperty),g=this.getItemProperty(t,l.videoPosterProperty),v=[p];if(h.addClass(l.videoContentClass),C(p).addClass(l.videoPlayClass),C(u).addClass(l.videoCoverClass).hasClass(l.toggleClass)||v.push(u),u.draggable=!1,y&&(r.title=y,p.setAttribute("aria-label",y)),g&&(u.style.backgroundImage='url("'+g+'")'),c.setAttribute?l.videoPlaysInline&&c.setAttribute("playsinline",""):h.addClass(l.videoIframeClass),c.preload=this.getItemProperty(t,l.videoPreloadProperty)||"none",this.support.source&&f)for(o=0;o<f.length;o+=1)c.appendChild(C.extend(this.sourcePrototype.cloneNode(!1),f[o]));return m&&(c.src=m),p.href=m||f&&f.length&&f[0].src,c.play&&c.pause&&((i||C(c)).on("error",function(){a.setTimeout(e,d)}).on("pause",function(){c.seeking||(n=!1,h.removeClass(a.options.videoLoadingClass).removeClass(a.options.videoPlayingClass),s&&a.container.addClass(a.options.controlsClass),c.controls=!1,c===a.activeVideo&&delete a.activeVideo,a.interval&&a.play())}).on("playing",function(){n=!1,u.removeAttribute("style"),h.removeClass(a.options.videoLoadingClass).addClass(a.options.videoPlayingClass)}).on("play",function(){window.clearTimeout(a.timeout),n=!0,h.addClass(a.options.videoLoadingClass),a.container.hasClass(a.options.controlsClass)?(s=!0,a.container.removeClass(a.options.controlsClass)):s=!1,c.controls=!0,a.activeVideo=c}),C(v).on("click",function(t){a.preventDefault(t),a.activeVideo=c,n?c.pause():c.play()}),r.appendChild(i&&i.element||c)),r.appendChild(u),r.appendChild(p),this.setTimeout(e,[{type:"load",target:r}]),r}}),t}),function(t){"use strict"; true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js"),__webpack_require__(/*! ./blueimp-gallery-video */ "./node_modules/blueimp-gallery/js/blueimp-gallery-video.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(function(l,t){"use strict";if(!window.postMessage)return t;var e=t.prototype;l.extend(e.options,{vimeoVideoIdProperty:"vimeo",vimeoPlayerUrl:"https://player.vimeo.com/video/VIDEO_ID?api=1&player_id=PLAYER_ID",vimeoPlayerIdPrefix:"vimeo-player-",vimeoClickToPlay:!1});var n=e.textFactory||e.imageFactory,o=function(t,e,i,s){this.url=t,this.videoId=e,this.playerId=i,this.clickToPlay=s,this.element=document.createElement("div"),this.listeners={}},a=0;return l.extend(o.prototype,{on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){var t,e,i=this,s="https://f.vimeocdn.com/js/froogaloop2.min.js",n=document.getElementsByTagName("script"),o=n.length;function a(){!e&&i.playOnReady&&i.play(),e=!0}for(;o;)if(n[--o].src===s){t=n[o];break}t||((t=document.createElement("script")).src=s),l(t).on("load",a),n[0].parentNode.insertBefore(t,n[0]),/loaded|complete/.test(t.readyState)&&a()},onReady:function(){var t=this;this.ready=!0,this.player.addEvent("play",function(){t.hasPlayed=!0,t.onPlaying()}),this.player.addEvent("pause",function(){t.onPause()}),this.player.addEvent("finish",function(){t.onPause()}),this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){this.listeners.pause(),delete this.playStatus},insertIframe:function(){var t=document.createElement("iframe");t.src=this.url.replace("VIDEO_ID",this.videoId).replace("PLAYER_ID",this.playerId),t.id=this.playerId,t.allow="autoplay",this.element.parentNode.replaceChild(t,this.element),this.element=t},play:function(){var t=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.api("play"):(this.playOnReady=!0,window.$f?this.player||(this.insertIframe(),this.player=$f(this.element),this.player.addEvent("ready",function(){t.onReady()})):this.loadAPI())},pause:function(){this.ready?this.player.api("pause"):this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),l.extend(e,{VimeoPlayer:o,textFactory:function(t,e){var i=this.options,s=this.getItemProperty(t,i.vimeoVideoIdProperty);return s?(this.getItemProperty(t,i.urlProperty)===undefined&&(t[i.urlProperty]="https://vimeo.com/"+s),a+=1,this.videoFactory(t,e,new o(i.vimeoPlayerUrl,s,i.vimeoPlayerIdPrefix+a,i.vimeoClickToPlay))):n.call(this,t,e)}}),t}),function(t){"use strict"; true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./blueimp-helper */ "./node_modules/blueimp-gallery/js/blueimp-helper.js"),__webpack_require__(/*! ./blueimp-gallery-video */ "./node_modules/blueimp-gallery/js/blueimp-gallery-video.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(function(t,e){"use strict";if(!window.postMessage)return e;var i=e.prototype;t.extend(i.options,{youTubeVideoIdProperty:"youtube",youTubePlayerVars:{wmode:"transparent"},youTubeClickToPlay:!1});var n=i.textFactory||i.imageFactory,o=function(t,e,i){this.videoId=t,this.playerVars=e,this.clickToPlay=i,this.element=document.createElement("div"),this.listeners={}};return t.extend(o.prototype,{on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){var t,e=this,i=window.onYouTubeIframeAPIReady,s="https://www.youtube.com/iframe_api",n=document.getElementsByTagName("script"),o=n.length;for(window.onYouTubeIframeAPIReady=function(){i&&i.apply(this),e.playOnReady&&e.play()};o;)if(n[--o].src===s)return;(t=document.createElement("script")).src=s,n[0].parentNode.insertBefore(t,n[0])},onReady:function(){this.ready=!0,this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){this.listeners.pause(),delete this.playStatus},onStateChange:function(t){switch(window.clearTimeout(this.pauseTimeout),t.data){case YT.PlayerState.PLAYING:this.hasPlayed=!0,this.onPlaying();break;case YT.PlayerState.UNSTARTED:case YT.PlayerState.PAUSED:this.pauseTimeout=i.setTimeout.call(this,this.onPause,null,500);break;case YT.PlayerState.ENDED:this.onPause()}},onError:function(t){this.listeners.error(t)},play:function(){var e=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.playVideo():(this.playOnReady=!0,window.YT&&YT.Player?this.player||(this.player=new YT.Player(this.element,{videoId:this.videoId,playerVars:this.playerVars,events:{onReady:function(){e.onReady()},onStateChange:function(t){e.onStateChange(t)},onError:function(t){e.onError(t)}}})):this.loadAPI())},pause:function(){this.ready?this.player.pauseVideo():this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),t.extend(i,{YouTubePlayer:o,textFactory:function(t,e){var i=this.options,s=this.getItemProperty(t,i.youTubeVideoIdProperty);return s?(this.getItemProperty(t,i.urlProperty)===undefined&&(t[i.urlProperty]="https://www.youtube.com/watch?v="+s),this.getItemProperty(t,i.videoPosterProperty)===undefined&&(t[i.videoPosterProperty]="https://img.youtube.com/vi/"+s+"/maxresdefault.jpg"),this.videoFactory(t,e,new o(s,i.youTubePlayerVars,i.youTubeClickToPlay))):n.call(this,t,e)}}),e});
//# sourceMappingURL=blueimp-gallery.min.js.map

/***/ }),

/***/ "./node_modules/blueimp-gallery/js/blueimp-helper.js":
/*!***********************************************************!*\
  !*** ./node_modules/blueimp-gallery/js/blueimp-helper.js ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * blueimp helper JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define */

/* eslint-disable no-param-reassign */

;(function () {
  'use strict'

  /**
   * Object.assign polyfill
   *
   * @param {object} obj1 First object
   * @param {object} obj2 Second object
   * @returns {object} Merged object
   */
  function extend(obj1, obj2) {
    var prop
    for (prop in obj2) {
      if (Object.prototype.hasOwnProperty.call(obj2, prop)) {
        obj1[prop] = obj2[prop]
      }
    }
    return obj1
  }
  /**
   * Helper constructor
   *
   * @class
   * @param {*} query jQuery type query argument
   */
  function Helper(query) {
    if (!this || this.find !== Helper.prototype.find) {
      // Called as function instead of as constructor,
      // so we simply return a new instance:
      return new Helper(query)
    }
    this.length = 0
    if (query) {
      if (typeof query === 'string') {
        query = this.find(query)
      }
      if (query.nodeType || query === query.window) {
        // Single HTML element
        this.length = 1
        this[0] = query
      } else {
        // HTML element collection
        var i = query.length
        this.length = i
        while (i) {
          i -= 1
          this[i] = query[i]
        }
      }
    }
  }

  Helper.extend = extend

  Helper.contains = function (container, element) {
    do {
      element = element.parentNode
      if (element === container) {
        return true
      }
    } while (element)
    return false
  }

  Helper.parseJSON = function (string) {
    return JSON.parse(string)
  }

  extend(Helper.prototype, {
    find: function (query) {
      var container = this[0] || document
      if (typeof query === 'string') {
        if (container.querySelectorAll) {
          query = container.querySelectorAll(query)
        } else if (query.charAt(0) === '#') {
          query = container.getElementById(query.slice(1))
        } else {
          query = container.getElementsByTagName(query)
        }
      }
      return new Helper(query)
    },

    hasClass: function (className) {
      if (!this[0]) return false
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(
        this[0].className
      )
    },

    addClass: function (className) {
      var i = this.length
      var classNames
      var element
      var j
      while (i) {
        i -= 1
        element = this[i]
        if (!element.className) {
          element.className = className
          continue
        }
        if (!classNames) classNames = className.split(/\s+/)
        for (j = 0; j < classNames.length; j += 1) {
          if (this.hasClass(classNames[j])) {
            continue
          }
          element.className += ' ' + classNames[j]
        }
      }
      return this
    },

    removeClass: function (className) {
      // Match any of the given class names
      var regexp = new RegExp('^(?:' + className.split(/\s+/).join('|') + ')$')
      // Match any class names and their trailing whitespace
      var matcher = /(\S+)(?:\s+|$)/g
      var replacer = function (match, className) {
        // Replace class names that match the given ones
        return regexp.test(className) ? '' : match
      }
      var trimEnd = /\s+$/
      var i = this.length
      var element
      while (i) {
        i -= 1
        element = this[i]
        element.className = element.className
          .replace(matcher, replacer)
          .replace(trimEnd, '')
      }
      return this
    },

    on: function (eventName, handler) {
      var eventNames = eventName.split(/\s+/)
      var i
      var element
      while (eventNames.length) {
        eventName = eventNames.shift()
        i = this.length
        while (i) {
          i -= 1
          element = this[i]
          if (element.addEventListener) {
            element.addEventListener(eventName, handler, false)
          } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, handler)
          }
        }
      }
      return this
    },

    off: function (eventName, handler) {
      var eventNames = eventName.split(/\s+/)
      var i
      var element
      while (eventNames.length) {
        eventName = eventNames.shift()
        i = this.length
        while (i) {
          i -= 1
          element = this[i]
          if (element.removeEventListener) {
            element.removeEventListener(eventName, handler, false)
          } else if (element.detachEvent) {
            element.detachEvent('on' + eventName, handler)
          }
        }
      }
      return this
    },

    empty: function () {
      var i = this.length
      var element
      while (i) {
        i -= 1
        element = this[i]
        while (element.hasChildNodes()) {
          element.removeChild(element.lastChild)
        }
      }
      return this
    },

    first: function () {
      return new Helper(this[0])
    }
  })

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return Helper
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else {}
})()


/***/ }),

/***/ "./node_modules/glightbox/dist/js/glightbox.min.js":
/*!*********************************************************!*\
  !*** ./node_modules/glightbox/dist/js/glightbox.min.js ***!
  \*********************************************************/
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";function e(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var n=i.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(t,i){for(var n=0;n<i.length;n++){var s=i[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,e(s.key),s)}}function s(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),Object.defineProperty(e,"prototype",{writable:!1}),e}var l=Date.now();function o(){var e={},t=!0,i=0,n=arguments.length;"[object Boolean]"===Object.prototype.toString.call(arguments[0])&&(t=arguments[0],i++);for(var s=function(i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t&&"[object Object]"===Object.prototype.toString.call(i[n])?e[n]=o(!0,e[n],i[n]):e[n]=i[n])};i<n;i++){var l=arguments[i];s(l)}return e}function r(e,t){if((E(e)||e===window||e===document)&&(e=[e]),L(e)||I(e)||(e=[e]),0!=M(e))if(L(e)&&!I(e))for(var i=e.length,n=0;n<i&&!1!==t.call(e[n],e[n],n,e);n++);else if(I(e))for(var s in e)if(P(e,s)&&!1===t.call(e[s],e[s],s,e))break}function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,n=e[l]=e[l]||[],s={all:n,evt:null,found:null};return t&&i&&M(n)>0&&r(n,(function(e,n){if(e.eventName==t&&e.fn.toString()==i.toString())return s.found=!0,s.evt=n,!1})),s}function h(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.onElement,n=t.withCallback,s=t.avoidDuplicate,l=void 0===s||s,o=t.once,h=void 0!==o&&o,d=t.useCapture,c=void 0!==d&&d,u=arguments.length>2?arguments[2]:void 0,g=i||[];function v(e){C(n)&&n.call(u,e,this),h&&v.destroy()}return k(g)&&(g=document.querySelectorAll(g)),v.destroy=function(){r(g,(function(t){var i=a(t,e,v);i.found&&i.all.splice(i.evt,1),t.removeEventListener&&t.removeEventListener(e,v,c)}))},r(g,(function(t){var i=a(t,e,v);(t.addEventListener&&l&&!i.found||!l)&&(t.addEventListener(e,v,c),i.all.push({eventName:e,fn:v}))})),v}function d(e,t){r(t.split(" "),(function(t){return e.classList.add(t)}))}function c(e,t){r(t.split(" "),(function(t){return e.classList.remove(t)}))}function u(e,t){return e.classList.contains(t)}function g(e,t){for(;e!==document.body;){if(!(e=e.parentElement))return!1;if("function"==typeof e.matches?e.matches(t):e.msMatchesSelector(t))return e}}function v(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!e||""===t)return!1;if("none"===t)return C(i)&&i(),!1;var n=b(),s=t.split(" ");r(s,(function(t){d(e,"g"+t)})),h(n,{onElement:e,avoidDuplicate:!1,once:!0,withCallback:function(e,t){r(s,(function(e){c(t,"g"+e)})),C(i)&&i()}})}function f(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if(""===t)return e.style.webkitTransform="",e.style.MozTransform="",e.style.msTransform="",e.style.OTransform="",e.style.transform="",!1;e.style.webkitTransform=t,e.style.MozTransform=t,e.style.msTransform=t,e.style.OTransform=t,e.style.transform=t}function p(e){e.style.display="block"}function m(e){e.style.display="none"}function y(e){var t=document.createDocumentFragment(),i=document.createElement("div");for(i.innerHTML=e;i.firstChild;)t.appendChild(i.firstChild);return t}function x(){return{width:window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,height:window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}}function b(){var e,t=document.createElement("fakeelement"),i={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(e in i)if(void 0!==t.style[e])return i[e]}function S(e,t,i,n){if(e())t();else{var s;i||(i=100);var l=setInterval((function(){e()&&(clearInterval(l),s&&clearTimeout(s),t())}),i);n&&(s=setTimeout((function(){clearInterval(l)}),n))}}function w(e,t,i){if(O(e))console.error("Inject assets error");else if(C(t)&&(i=t,t=!1),k(t)&&t in window)C(i)&&i();else{var n;if(-1!==e.indexOf(".css")){if((n=document.querySelectorAll('link[href="'+e+'"]'))&&n.length>0)return void(C(i)&&i());var s=document.getElementsByTagName("head")[0],l=s.querySelectorAll('link[rel="stylesheet"]'),o=document.createElement("link");return o.rel="stylesheet",o.type="text/css",o.href=e,o.media="all",l?s.insertBefore(o,l[0]):s.appendChild(o),void(C(i)&&i())}if((n=document.querySelectorAll('script[src="'+e+'"]'))&&n.length>0){if(C(i)){if(k(t))return S((function(){return void 0!==window[t]}),(function(){i()})),!1;i()}}else{var r=document.createElement("script");r.type="text/javascript",r.src=e,r.onload=function(){if(C(i)){if(k(t))return S((function(){return void 0!==window[t]}),(function(){i()})),!1;i()}},document.body.appendChild(r)}}}function T(){return"navigator"in window&&window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i)}function C(e){return"function"==typeof e}function k(e){return"string"==typeof e}function E(e){return!(!e||!e.nodeType||1!=e.nodeType)}function A(e){return Array.isArray(e)}function L(e){return e&&e.length&&isFinite(e.length)}function I(e){return"object"===t(e)&&null!=e&&!C(e)&&!A(e)}function O(e){return null==e}function P(e,t){return null!==e&&hasOwnProperty.call(e,t)}function M(e){if(I(e)){if(e.keys)return e.keys().length;var t=0;for(var i in e)P(e,i)&&t++;return t}return e.length}function z(e){return!isNaN(parseFloat(e))&&isFinite(e)}function X(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:-1,t=document.querySelectorAll(".gbtn[data-taborder]:not(.disabled)");if(!t.length)return!1;if(1==t.length)return t[0];"string"==typeof e&&(e=parseInt(e));var i=[];r(t,(function(e){i.push(e.getAttribute("data-taborder"))}));var n=Math.max.apply(Math,i.map((function(e){return parseInt(e)}))),s=e<0?1:e+1;s>n&&(s="1");var l=i.filter((function(e){return e>=parseInt(s)})),o=l.sort()[0];return document.querySelector('.gbtn[data-taborder="'.concat(o,'"]'))}function Y(e){if(e.events.hasOwnProperty("keyboard"))return!1;e.events.keyboard=h("keydown",{onElement:window,withCallback:function(t,i){var n=(t=t||window.event).keyCode;if(9==n){var s=document.querySelector(".gbtn.focused");if(!s){var l=!(!document.activeElement||!document.activeElement.nodeName)&&document.activeElement.nodeName.toLocaleLowerCase();if("input"==l||"textarea"==l||"button"==l)return}t.preventDefault();var o=document.querySelectorAll(".gbtn[data-taborder]");if(!o||o.length<=0)return;if(!s){var r=X();return void(r&&(r.focus(),d(r,"focused")))}var a=X(s.getAttribute("data-taborder"));c(s,"focused"),a&&(a.focus(),d(a,"focused"))}39==n&&e.nextSlide(),37==n&&e.prevSlide(),27==n&&e.close()}})}var q=s((function e(t,n){var s=this,l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(i(this,e),this.img=t,this.slide=n,this.onclose=l,this.img.setZoomEvents)return!1;this.active=!1,this.zoomedIn=!1,this.dragging=!1,this.currentX=null,this.currentY=null,this.initialX=null,this.initialY=null,this.xOffset=0,this.yOffset=0,this.img.addEventListener("mousedown",(function(e){return s.dragStart(e)}),!1),this.img.addEventListener("mouseup",(function(e){return s.dragEnd(e)}),!1),this.img.addEventListener("mousemove",(function(e){return s.drag(e)}),!1),this.img.addEventListener("click",(function(e){return s.slide.classList.contains("dragging-nav")?(s.zoomOut(),!1):s.zoomedIn?void(s.zoomedIn&&!s.dragging&&s.zoomOut()):s.zoomIn()}),!1),this.img.setZoomEvents=!0}),[{key:"zoomIn",value:function(){var e=this.widowWidth();if(!(this.zoomedIn||e<=768)){var t=this.img;if(t.setAttribute("data-style",t.getAttribute("style")),t.style.maxWidth=t.naturalWidth+"px",t.style.maxHeight=t.naturalHeight+"px",t.naturalWidth>e){var i=e/2-t.naturalWidth/2;this.setTranslate(this.img.parentNode,i,0)}this.slide.classList.add("zoomed"),this.zoomedIn=!0}}},{key:"zoomOut",value:function(){this.img.parentNode.setAttribute("style",""),this.img.setAttribute("style",this.img.getAttribute("data-style")),this.slide.classList.remove("zoomed"),this.zoomedIn=!1,this.currentX=null,this.currentY=null,this.initialX=null,this.initialY=null,this.xOffset=0,this.yOffset=0,this.onclose&&"function"==typeof this.onclose&&this.onclose()}},{key:"dragStart",value:function(e){e.preventDefault(),this.zoomedIn?("touchstart"===e.type?(this.initialX=e.touches[0].clientX-this.xOffset,this.initialY=e.touches[0].clientY-this.yOffset):(this.initialX=e.clientX-this.xOffset,this.initialY=e.clientY-this.yOffset),e.target===this.img&&(this.active=!0,this.img.classList.add("dragging"))):this.active=!1}},{key:"dragEnd",value:function(e){var t=this;e.preventDefault(),this.initialX=this.currentX,this.initialY=this.currentY,this.active=!1,setTimeout((function(){t.dragging=!1,t.img.isDragging=!1,t.img.classList.remove("dragging")}),100)}},{key:"drag",value:function(e){this.active&&(e.preventDefault(),"touchmove"===e.type?(this.currentX=e.touches[0].clientX-this.initialX,this.currentY=e.touches[0].clientY-this.initialY):(this.currentX=e.clientX-this.initialX,this.currentY=e.clientY-this.initialY),this.xOffset=this.currentX,this.yOffset=this.currentY,this.img.isDragging=!0,this.dragging=!0,this.setTranslate(this.img,this.currentX,this.currentY))}},{key:"onMove",value:function(e){if(this.zoomedIn){var t=e.clientX-this.img.naturalWidth/2,i=e.clientY-this.img.naturalHeight/2;this.setTranslate(this.img,t,i)}}},{key:"setTranslate",value:function(e,t,i){e.style.transform="translate3d("+t+"px, "+i+"px, 0)"}},{key:"widowWidth",value:function(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth}}]),N=s((function e(){var t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};i(this,e);var s=n.dragEl,l=n.toleranceX,o=void 0===l?40:l,r=n.toleranceY,a=void 0===r?65:r,h=n.slide,d=void 0===h?null:h,c=n.instance,u=void 0===c?null:c;this.el=s,this.active=!1,this.dragging=!1,this.currentX=null,this.currentY=null,this.initialX=null,this.initialY=null,this.xOffset=0,this.yOffset=0,this.direction=null,this.lastDirection=null,this.toleranceX=o,this.toleranceY=a,this.toleranceReached=!1,this.dragContainer=this.el,this.slide=d,this.instance=u,this.el.addEventListener("mousedown",(function(e){return t.dragStart(e)}),!1),this.el.addEventListener("mouseup",(function(e){return t.dragEnd(e)}),!1),this.el.addEventListener("mousemove",(function(e){return t.drag(e)}),!1)}),[{key:"dragStart",value:function(e){if(this.slide.classList.contains("zoomed"))this.active=!1;else{"touchstart"===e.type?(this.initialX=e.touches[0].clientX-this.xOffset,this.initialY=e.touches[0].clientY-this.yOffset):(this.initialX=e.clientX-this.xOffset,this.initialY=e.clientY-this.yOffset);var t=e.target.nodeName.toLowerCase();e.target.classList.contains("nodrag")||g(e.target,".nodrag")||-1!==["input","select","textarea","button","a"].indexOf(t)?this.active=!1:(e.preventDefault(),(e.target===this.el||"img"!==t&&g(e.target,".gslide-inline"))&&(this.active=!0,this.el.classList.add("dragging"),this.dragContainer=g(e.target,".ginner-container")))}}},{key:"dragEnd",value:function(e){var t=this;e&&e.preventDefault(),this.initialX=0,this.initialY=0,this.currentX=null,this.currentY=null,this.initialX=null,this.initialY=null,this.xOffset=0,this.yOffset=0,this.active=!1,this.doSlideChange&&(this.instance.preventOutsideClick=!0,"right"==this.doSlideChange&&this.instance.prevSlide(),"left"==this.doSlideChange&&this.instance.nextSlide()),this.doSlideClose&&this.instance.close(),this.toleranceReached||this.setTranslate(this.dragContainer,0,0,!0),setTimeout((function(){t.instance.preventOutsideClick=!1,t.toleranceReached=!1,t.lastDirection=null,t.dragging=!1,t.el.isDragging=!1,t.el.classList.remove("dragging"),t.slide.classList.remove("dragging-nav"),t.dragContainer.style.transform="",t.dragContainer.style.transition=""}),100)}},{key:"drag",value:function(e){if(this.active){e.preventDefault(),this.slide.classList.add("dragging-nav"),"touchmove"===e.type?(this.currentX=e.touches[0].clientX-this.initialX,this.currentY=e.touches[0].clientY-this.initialY):(this.currentX=e.clientX-this.initialX,this.currentY=e.clientY-this.initialY),this.xOffset=this.currentX,this.yOffset=this.currentY,this.el.isDragging=!0,this.dragging=!0,this.doSlideChange=!1,this.doSlideClose=!1;var t=Math.abs(this.currentX),i=Math.abs(this.currentY);if(t>0&&t>=Math.abs(this.currentY)&&(!this.lastDirection||"x"==this.lastDirection)){this.yOffset=0,this.lastDirection="x",this.setTranslate(this.dragContainer,this.currentX,0);var n=this.shouldChange();if(!this.instance.settings.dragAutoSnap&&n&&(this.doSlideChange=n),this.instance.settings.dragAutoSnap&&n)return this.instance.preventOutsideClick=!0,this.toleranceReached=!0,this.active=!1,this.instance.preventOutsideClick=!0,this.dragEnd(null),"right"==n&&this.instance.prevSlide(),void("left"==n&&this.instance.nextSlide())}if(this.toleranceY>0&&i>0&&i>=t&&(!this.lastDirection||"y"==this.lastDirection)){this.xOffset=0,this.lastDirection="y",this.setTranslate(this.dragContainer,0,this.currentY);var s=this.shouldClose();return!this.instance.settings.dragAutoSnap&&s&&(this.doSlideClose=!0),void(this.instance.settings.dragAutoSnap&&s&&this.instance.close())}}}},{key:"shouldChange",value:function(){var e=!1;if(Math.abs(this.currentX)>=this.toleranceX){var t=this.currentX>0?"right":"left";("left"==t&&this.slide!==this.slide.parentNode.lastChild||"right"==t&&this.slide!==this.slide.parentNode.firstChild)&&(e=t)}return e}},{key:"shouldClose",value:function(){var e=!1;return Math.abs(this.currentY)>=this.toleranceY&&(e=!0),e}},{key:"setTranslate",value:function(e,t,i){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3];e.style.transition=n?"all .2s ease":"",e.style.transform="translate3d(".concat(t,"px, ").concat(i,"px, 0)")}}]);function D(e,t,i,n){var s=e.querySelector(".gslide-media"),l=new Image,o="gSlideTitle_"+i,r="gSlideDesc_"+i;l.addEventListener("load",(function(){C(n)&&n()}),!1),l.src=t.href,""!=t.sizes&&""!=t.srcset&&(l.sizes=t.sizes,l.srcset=t.srcset),l.alt="",O(t.alt)||""===t.alt||(l.alt=t.alt),""!==t.title&&l.setAttribute("aria-labelledby",o),""!==t.description&&l.setAttribute("aria-describedby",r),t.hasOwnProperty("_hasCustomWidth")&&t._hasCustomWidth&&(l.style.width=t.width),t.hasOwnProperty("_hasCustomHeight")&&t._hasCustomHeight&&(l.style.height=t.height),s.insertBefore(l,s.firstChild)}function _(e,t,i,n){var s=this,l=e.querySelector(".ginner-container"),o="gvideo"+i,r=e.querySelector(".gslide-media"),a=this.getAllPlayers();d(l,"gvideo-container"),r.insertBefore(y('<div class="gvideo-wrapper"></div>'),r.firstChild);var h=e.querySelector(".gvideo-wrapper");w(this.settings.plyr.css,"Plyr");var c=t.href,u=null==t?void 0:t.videoProvider,g=!1;r.style.maxWidth=t.width,w(this.settings.plyr.js,"Plyr",(function(){if(!u&&c.match(/vimeo\.com\/([0-9]*)/)&&(u="vimeo"),!u&&(c.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/)||c.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)||c.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)||c.match(/(youtube\.com|youtube-nocookie\.com)\/shorts\/([a-zA-Z0-9\-_]+)/))&&(u="youtube"),"local"===u||!u){u="local";var l='<video id="'+o+'" ';l+='style="background:#000; max-width: '.concat(t.width,';" '),l+='preload="metadata" ',l+='x-webkit-airplay="allow" ',l+="playsinline ",l+="controls ",l+='class="gvideo-local">',l+='<source src="'.concat(c,'">'),g=y(l+="</video>")}var r=g||y('<div id="'.concat(o,'" data-plyr-provider="').concat(u,'" data-plyr-embed-id="').concat(c,'"></div>'));d(h,"".concat(u,"-video gvideo")),h.appendChild(r),h.setAttribute("data-id",o),h.setAttribute("data-index",i);var v=P(s.settings.plyr,"config")?s.settings.plyr.config:{},f=new Plyr("#"+o,v);f.on("ready",(function(e){a[o]=e.detail.plyr,C(n)&&n()})),S((function(){return e.querySelector("iframe")&&"true"==e.querySelector("iframe").dataset.ready}),(function(){s.resize(e)})),f.on("enterfullscreen",W),f.on("exitfullscreen",W)}))}function W(e){var t=g(e.target,".gslide-media");"enterfullscreen"===e.type&&d(t,"fullscreen"),"exitfullscreen"===e.type&&c(t,"fullscreen")}function B(e,t,i,n){var s,l=this,o=e.querySelector(".gslide-media"),r=!(!P(t,"href")||!t.href)&&t.href.split("#").pop().trim(),a=!(!P(t,"content")||!t.content)&&t.content;if(a&&(k(a)&&(s=y('<div class="ginlined-content">'.concat(a,"</div>"))),E(a))){"none"==a.style.display&&(a.style.display="block");var c=document.createElement("div");c.className="ginlined-content",c.appendChild(a),s=c}if(r){var u=document.getElementById(r);if(!u)return!1;var g=u.cloneNode(!0);g.style.height=t.height,g.style.maxWidth=t.width,d(g,"ginlined-content"),s=g}if(!s)return console.error("Unable to append inline slide content",t),!1;o.style.height=t.height,o.style.width=t.width,o.appendChild(s),this.events["inlineclose"+r]=h("click",{onElement:o.querySelectorAll(".gtrigger-close"),withCallback:function(e){e.preventDefault(),l.close()}}),C(n)&&n()}function H(e,t,i,n){var s=e.querySelector(".gslide-media"),l=function(e){var t=e.url,i=e.allow,n=e.callback,s=e.appendTo,l=document.createElement("iframe");return l.className="vimeo-video gvideo",l.src=t,l.style.width="100%",l.style.height="100%",i&&l.setAttribute("allow",i),l.onload=function(){l.onload=null,d(l,"node-ready"),C(n)&&n()},s&&s.appendChild(l),l}({url:t.href,callback:n});s.parentNode.style.maxWidth=t.width,s.parentNode.style.height=t.height,s.appendChild(l)}var j=s((function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};i(this,e),this.defaults={href:"",sizes:"",srcset:"",title:"",type:"",videoProvider:"",description:"",alt:"",descPosition:"bottom",effect:"",width:"",height:"",content:!1,zoomable:!0,draggable:!0},I(t)&&(this.defaults=o(this.defaults,t))}),[{key:"sourceType",value:function(e){var t=e;return null!==(e=e.toLowerCase()).match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/)?"image":e.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/)||e.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)||e.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)||e.match(/(youtube\.com|youtube-nocookie\.com)\/shorts\/([a-zA-Z0-9\-_]+)/)||e.match(/vimeo\.com\/([0-9]*)/)||null!==e.match(/\.(mp4|ogg|webm|mov)/)?"video":null!==e.match(/\.(mp3|wav|wma|aac|ogg)/)?"audio":e.indexOf("#")>-1&&""!==t.split("#").pop().trim()?"inline":e.indexOf("goajax=true")>-1?"ajax":"external"}},{key:"parseConfig",value:function(e,t){var i=this,n=o({descPosition:t.descPosition},this.defaults);if(I(e)&&!E(e)){P(e,"type")||(P(e,"content")&&e.content?e.type="inline":P(e,"href")&&(e.type=this.sourceType(e.href)));var s=o(n,e);return this.setSize(s,t),s}var l="",a=e.getAttribute("data-glightbox"),h=e.nodeName.toLowerCase();if("a"===h&&(l=e.href),"img"===h&&(l=e.src,n.alt=e.alt),n.href=l,r(n,(function(s,l){P(t,l)&&"width"!==l&&(n[l]=t[l]);var o=e.dataset[l];O(o)||(n[l]=i.sanitizeValue(o))})),n.content&&(n.type="inline"),!n.type&&l&&(n.type=this.sourceType(l)),O(a)){if(!n.title&&"a"==h){var d=e.title;O(d)||""===d||(n.title=d)}if(!n.title&&"img"==h){var c=e.alt;O(c)||""===c||(n.title=c)}}else{var u=[];r(n,(function(e,t){u.push(";\\s?"+t)})),u=u.join("\\s?:|"),""!==a.trim()&&r(n,(function(e,t){var s=a,l=new RegExp("s?"+t+"s?:s?(.*?)("+u+"s?:|$)"),o=s.match(l);if(o&&o.length&&o[1]){var r=o[1].trim().replace(/;\s*$/,"");n[t]=i.sanitizeValue(r)}}))}if(n.description&&"."===n.description.substring(0,1)){var g;try{g=document.querySelector(n.description).innerHTML}catch(e){if(!(e instanceof DOMException))throw e}g&&(n.description=g)}if(!n.description){var v=e.querySelector(".glightbox-desc");v&&(n.description=v.innerHTML)}return this.setSize(n,t,e),this.slideConfig=n,n}},{key:"setSize",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,n="video"==e.type?this.checkSize(t.videosWidth):this.checkSize(t.width),s=this.checkSize(t.height);return e.width=P(e,"width")&&""!==e.width?this.checkSize(e.width):n,e.height=P(e,"height")&&""!==e.height?this.checkSize(e.height):s,i&&"image"==e.type&&(e._hasCustomWidth=!!i.dataset.width,e._hasCustomHeight=!!i.dataset.height),e}},{key:"checkSize",value:function(e){return z(e)?"".concat(e,"px"):e}},{key:"sanitizeValue",value:function(e){return"true"!==e&&"false"!==e?e:"true"===e}}]),V=s((function e(t,n,s){i(this,e),this.element=t,this.instance=n,this.index=s}),[{key:"setContent",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(u(t,"loaded"))return!1;var n=this.instance.settings,s=this.slideConfig,l=T();C(n.beforeSlideLoad)&&n.beforeSlideLoad({index:this.index,slide:t,player:!1});var o=s.type,r=s.descPosition,a=t.querySelector(".gslide-media"),h=t.querySelector(".gslide-title"),c=t.querySelector(".gslide-desc"),g=t.querySelector(".gdesc-inner"),v=i,f="gSlideTitle_"+this.index,p="gSlideDesc_"+this.index;if(C(n.afterSlideLoad)&&(v=function(){C(i)&&i(),n.afterSlideLoad({index:e.index,slide:t,player:e.instance.getSlidePlayerInstance(e.index)})}),""==s.title&&""==s.description?g&&g.parentNode.parentNode.removeChild(g.parentNode):(h&&""!==s.title?(h.id=f,h.innerHTML=s.title):h.parentNode.removeChild(h),c&&""!==s.description?(c.id=p,l&&n.moreLength>0?(s.smallDescription=this.slideShortDesc(s.description,n.moreLength,n.moreText),c.innerHTML=s.smallDescription,this.descriptionEvents(c,s)):c.innerHTML=s.description):c.parentNode.removeChild(c),d(a.parentNode,"desc-".concat(r)),d(g.parentNode,"description-".concat(r))),d(a,"gslide-".concat(o)),d(t,"loaded"),"video"!==o){if("external"!==o)return"inline"===o?(B.apply(this.instance,[t,s,this.index,v]),void(s.draggable&&new N({dragEl:t.querySelector(".gslide-inline"),toleranceX:n.dragToleranceX,toleranceY:n.dragToleranceY,slide:t,instance:this.instance}))):void("image"!==o?C(v)&&v():D(t,s,this.index,(function(){var i=t.querySelector("img");s.draggable&&new N({dragEl:i,toleranceX:n.dragToleranceX,toleranceY:n.dragToleranceY,slide:t,instance:e.instance}),s.zoomable&&i.naturalWidth>i.offsetWidth&&(d(i,"zoomable"),new q(i,t,(function(){e.instance.resize()}))),C(v)&&v()})));H.apply(this,[t,s,this.index,v])}else _.apply(this.instance,[t,s,this.index,v])}},{key:"slideShortDesc",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:50,i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=document.createElement("div");n.innerHTML=e;var s=n.innerText,l=i;if((e=s.trim()).length<=t)return e;var o=e.substr(0,t-1);return l?(n=null,o+'... <a href="#" class="desc-more">'+i+"</a>"):o}},{key:"descriptionEvents",value:function(e,t){var i=this,n=e.querySelector(".desc-more");if(!n)return!1;h("click",{onElement:n,withCallback:function(e,n){e.preventDefault();var s=document.body,l=g(n,".gslide-desc");if(!l)return!1;l.innerHTML=t.description,d(s,"gdesc-open");var o=h("click",{onElement:[s,g(l,".gslide-description")],withCallback:function(e,n){"a"!==e.target.nodeName.toLowerCase()&&(c(s,"gdesc-open"),d(s,"gdesc-closed"),l.innerHTML=t.smallDescription,i.descriptionEvents(l,t),setTimeout((function(){c(s,"gdesc-closed")}),400),o.destroy())}})}})}},{key:"create",value:function(){return y(this.instance.settings.slideHTML)}},{key:"getConfig",value:function(){E(this.element)||this.element.hasOwnProperty("draggable")||(this.element.draggable=this.instance.settings.draggable);var e=new j(this.instance.settings.slideExtraAttributes);return this.slideConfig=e.parseConfig(this.element,this.instance.settings),this.slideConfig}}]);function F(e){return Math.sqrt(e.x*e.x+e.y*e.y)}function R(e,t){var i=function(e,t){var i=F(e)*F(t);if(0===i)return 0;var n=function(e,t){return e.x*t.x+e.y*t.y}(e,t)/i;return n>1&&(n=1),Math.acos(n)}(e,t);return function(e,t){return e.x*t.y-t.x*e.y}(e,t)>0&&(i*=-1),180*i/Math.PI}var G=s((function e(t){i(this,e),this.handlers=[],this.el=t}),[{key:"add",value:function(e){this.handlers.push(e)}},{key:"del",value:function(e){e||(this.handlers=[]);for(var t=this.handlers.length;t>=0;t--)this.handlers[t]===e&&this.handlers.splice(t,1)}},{key:"dispatch",value:function(){for(var e=0,t=this.handlers.length;e<t;e++){var i=this.handlers[e];"function"==typeof i&&i.apply(this.el,arguments)}}}]);function Z(e,t){var i=new G(e);return i.add(t),i}var U=s((function e(t,n){i(this,e),this.element="string"==typeof t?document.querySelector(t):t,this.start=this.start.bind(this),this.move=this.move.bind(this),this.end=this.end.bind(this),this.cancel=this.cancel.bind(this),this.element.addEventListener("touchstart",this.start,!1),this.element.addEventListener("touchmove",this.move,!1),this.element.addEventListener("touchend",this.end,!1),this.element.addEventListener("touchcancel",this.cancel,!1),this.preV={x:null,y:null},this.pinchStartLen=null,this.zoom=1,this.isDoubleTap=!1;var s=function(){};this.rotate=Z(this.element,n.rotate||s),this.touchStart=Z(this.element,n.touchStart||s),this.multipointStart=Z(this.element,n.multipointStart||s),this.multipointEnd=Z(this.element,n.multipointEnd||s),this.pinch=Z(this.element,n.pinch||s),this.swipe=Z(this.element,n.swipe||s),this.tap=Z(this.element,n.tap||s),this.doubleTap=Z(this.element,n.doubleTap||s),this.longTap=Z(this.element,n.longTap||s),this.singleTap=Z(this.element,n.singleTap||s),this.pressMove=Z(this.element,n.pressMove||s),this.twoFingerPressMove=Z(this.element,n.twoFingerPressMove||s),this.touchMove=Z(this.element,n.touchMove||s),this.touchEnd=Z(this.element,n.touchEnd||s),this.touchCancel=Z(this.element,n.touchCancel||s),this.translateContainer=this.element,this._cancelAllHandler=this.cancelAll.bind(this),window.addEventListener("scroll",this._cancelAllHandler),this.delta=null,this.last=null,this.now=null,this.tapTimeout=null,this.singleTapTimeout=null,this.longTapTimeout=null,this.swipeTimeout=null,this.x1=this.x2=this.y1=this.y2=null,this.preTapPosition={x:null,y:null}}),[{key:"start",value:function(e){if(e.touches)if(e.target&&e.target.nodeName&&["a","button","input"].indexOf(e.target.nodeName.toLowerCase())>=0)console.log("ignore drag for this touched element",e.target.nodeName.toLowerCase());else{this.now=Date.now(),this.x1=e.touches[0].pageX,this.y1=e.touches[0].pageY,this.delta=this.now-(this.last||this.now),this.touchStart.dispatch(e,this.element),null!==this.preTapPosition.x&&(this.isDoubleTap=this.delta>0&&this.delta<=250&&Math.abs(this.preTapPosition.x-this.x1)<30&&Math.abs(this.preTapPosition.y-this.y1)<30,this.isDoubleTap&&clearTimeout(this.singleTapTimeout)),this.preTapPosition.x=this.x1,this.preTapPosition.y=this.y1,this.last=this.now;var t=this.preV;if(e.touches.length>1){this._cancelLongTap(),this._cancelSingleTap();var i={x:e.touches[1].pageX-this.x1,y:e.touches[1].pageY-this.y1};t.x=i.x,t.y=i.y,this.pinchStartLen=F(t),this.multipointStart.dispatch(e,this.element)}this._preventTap=!1,this.longTapTimeout=setTimeout(function(){this.longTap.dispatch(e,this.element),this._preventTap=!0}.bind(this),750)}}},{key:"move",value:function(e){if(e.touches){var t=this.preV,i=e.touches.length,n=e.touches[0].pageX,s=e.touches[0].pageY;if(this.isDoubleTap=!1,i>1){var l=e.touches[1].pageX,o=e.touches[1].pageY,r={x:e.touches[1].pageX-n,y:e.touches[1].pageY-s};null!==t.x&&(this.pinchStartLen>0&&(e.zoom=F(r)/this.pinchStartLen,this.pinch.dispatch(e,this.element)),e.angle=R(r,t),this.rotate.dispatch(e,this.element)),t.x=r.x,t.y=r.y,null!==this.x2&&null!==this.sx2?(e.deltaX=(n-this.x2+l-this.sx2)/2,e.deltaY=(s-this.y2+o-this.sy2)/2):(e.deltaX=0,e.deltaY=0),this.twoFingerPressMove.dispatch(e,this.element),this.sx2=l,this.sy2=o}else{if(null!==this.x2){e.deltaX=n-this.x2,e.deltaY=s-this.y2;var a=Math.abs(this.x1-this.x2),h=Math.abs(this.y1-this.y2);(a>10||h>10)&&(this._preventTap=!0)}else e.deltaX=0,e.deltaY=0;this.pressMove.dispatch(e,this.element)}this.touchMove.dispatch(e,this.element),this._cancelLongTap(),this.x2=n,this.y2=s,i>1&&e.preventDefault()}}},{key:"end",value:function(e){if(e.changedTouches){this._cancelLongTap();var t=this;e.touches.length<2&&(this.multipointEnd.dispatch(e,this.element),this.sx2=this.sy2=null),this.x2&&Math.abs(this.x1-this.x2)>30||this.y2&&Math.abs(this.y1-this.y2)>30?(e.direction=this._swipeDirection(this.x1,this.x2,this.y1,this.y2),this.swipeTimeout=setTimeout((function(){t.swipe.dispatch(e,t.element)}),0)):(this.tapTimeout=setTimeout((function(){t._preventTap||t.tap.dispatch(e,t.element),t.isDoubleTap&&(t.doubleTap.dispatch(e,t.element),t.isDoubleTap=!1)}),0),t.isDoubleTap||(t.singleTapTimeout=setTimeout((function(){t.singleTap.dispatch(e,t.element)}),250))),this.touchEnd.dispatch(e,this.element),this.preV.x=0,this.preV.y=0,this.zoom=1,this.pinchStartLen=null,this.x1=this.x2=this.y1=this.y2=null}}},{key:"cancelAll",value:function(){this._preventTap=!0,clearTimeout(this.singleTapTimeout),clearTimeout(this.tapTimeout),clearTimeout(this.longTapTimeout),clearTimeout(this.swipeTimeout)}},{key:"cancel",value:function(e){this.cancelAll(),this.touchCancel.dispatch(e,this.element)}},{key:"_cancelLongTap",value:function(){clearTimeout(this.longTapTimeout)}},{key:"_cancelSingleTap",value:function(){clearTimeout(this.singleTapTimeout)}},{key:"_swipeDirection",value:function(e,t,i,n){return Math.abs(e-t)>=Math.abs(i-n)?e-t>0?"Left":"Right":i-n>0?"Up":"Down"}},{key:"on",value:function(e,t){this[e]&&this[e].add(t)}},{key:"off",value:function(e,t){this[e]&&this[e].del(t)}},{key:"destroy",value:function(){return this.singleTapTimeout&&clearTimeout(this.singleTapTimeout),this.tapTimeout&&clearTimeout(this.tapTimeout),this.longTapTimeout&&clearTimeout(this.longTapTimeout),this.swipeTimeout&&clearTimeout(this.swipeTimeout),this.element.removeEventListener("touchstart",this.start),this.element.removeEventListener("touchmove",this.move),this.element.removeEventListener("touchend",this.end),this.element.removeEventListener("touchcancel",this.cancel),this.rotate.del(),this.touchStart.del(),this.multipointStart.del(),this.multipointEnd.del(),this.pinch.del(),this.swipe.del(),this.tap.del(),this.doubleTap.del(),this.longTap.del(),this.singleTap.del(),this.pressMove.del(),this.twoFingerPressMove.del(),this.touchMove.del(),this.touchEnd.del(),this.touchCancel.del(),this.preV=this.pinchStartLen=this.zoom=this.isDoubleTap=this.delta=this.last=this.now=this.tapTimeout=this.singleTapTimeout=this.longTapTimeout=this.swipeTimeout=this.x1=this.x2=this.y1=this.y2=this.preTapPosition=this.rotate=this.touchStart=this.multipointStart=this.multipointEnd=this.pinch=this.swipe=this.tap=this.doubleTap=this.longTap=this.singleTap=this.pressMove=this.touchMove=this.touchEnd=this.touchCancel=this.twoFingerPressMove=null,window.removeEventListener("scroll",this._cancelAllHandler),null}}]);function $(e){var t=function(){var e,t=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in i)if(void 0!==t.style[e])return i[e]}(),i=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,n=u(e,"gslide-media")?e:e.querySelector(".gslide-media"),s=g(n,".ginner-container"),l=e.querySelector(".gslide-description");i>769&&(n=s),d(n,"greset"),f(n,"translate3d(0, 0, 0)"),h(t,{onElement:n,once:!0,withCallback:function(e,t){c(n,"greset")}}),n.style.opacity="",l&&(l.style.opacity="")}function J(e){if(e.events.hasOwnProperty("touch"))return!1;var t,i,n,s=x(),l=s.width,o=s.height,r=!1,a=null,h=null,v=null,p=!1,m=1,y=1,b=!1,S=!1,w=null,T=null,C=null,k=null,E=0,A=0,L=!1,I=!1,O={},P={},M=0,z=0,X=document.getElementById("glightbox-slider"),Y=document.querySelector(".goverlay"),q=new U(X,{touchStart:function(t){if(r=!0,(u(t.targetTouches[0].target,"ginner-container")||g(t.targetTouches[0].target,".gslide-desc")||"a"==t.targetTouches[0].target.nodeName.toLowerCase())&&(r=!1),g(t.targetTouches[0].target,".gslide-inline")&&!u(t.targetTouches[0].target.parentNode,"gslide-inline")&&(r=!1),r){if(P=t.targetTouches[0],O.pageX=t.targetTouches[0].pageX,O.pageY=t.targetTouches[0].pageY,M=t.targetTouches[0].clientX,z=t.targetTouches[0].clientY,a=e.activeSlide,h=a.querySelector(".gslide-media"),n=a.querySelector(".gslide-inline"),v=null,u(h,"gslide-image")&&(v=h.querySelector("img")),(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)>769&&(h=a.querySelector(".ginner-container")),c(Y,"greset"),t.pageX>20&&t.pageX<window.innerWidth-20)return;t.preventDefault()}},touchMove:function(s){if(r&&(P=s.targetTouches[0],!b&&!S)){if(n&&n.offsetHeight>o){var a=O.pageX-P.pageX;if(Math.abs(a)<=13)return!1}p=!0;var d,c=s.targetTouches[0].clientX,u=s.targetTouches[0].clientY,g=M-c,m=z-u;if(Math.abs(g)>Math.abs(m)?(L=!1,I=!0):(I=!1,L=!0),t=P.pageX-O.pageX,E=100*t/l,i=P.pageY-O.pageY,A=100*i/o,L&&v&&(d=1-Math.abs(i)/o,Y.style.opacity=d,e.settings.touchFollowAxis&&(E=0)),I&&(d=1-Math.abs(t)/l,h.style.opacity=d,e.settings.touchFollowAxis&&(A=0)),!v)return f(h,"translate3d(".concat(E,"%, 0, 0)"));f(h,"translate3d(".concat(E,"%, ").concat(A,"%, 0)"))}},touchEnd:function(){if(r){if(p=!1,S||b)return C=w,void(k=T);var t=Math.abs(parseInt(A)),i=Math.abs(parseInt(E));if(!(t>29&&v))return t<29&&i<25?(d(Y,"greset"),Y.style.opacity=1,$(h)):void 0;e.close()}},multipointEnd:function(){setTimeout((function(){b=!1}),50)},multipointStart:function(){b=!0,m=y||1},pinch:function(e){if(!v||p)return!1;b=!0,v.scaleX=v.scaleY=m*e.zoom;var t=m*e.zoom;if(S=!0,t<=1)return S=!1,t=1,k=null,C=null,w=null,T=null,void v.setAttribute("style","");t>4.5&&(t=4.5),v.style.transform="scale3d(".concat(t,", ").concat(t,", 1)"),y=t},pressMove:function(e){if(S&&!b){var t=P.pageX-O.pageX,i=P.pageY-O.pageY;C&&(t+=C),k&&(i+=k),w=t,T=i;var n="translate3d(".concat(t,"px, ").concat(i,"px, 0)");y&&(n+=" scale3d(".concat(y,", ").concat(y,", 1)")),f(v,n)}},swipe:function(t){if(!S)if(b)b=!1;else{if("Left"==t.direction){if(e.index==e.elements.length-1)return $(h);e.nextSlide()}if("Right"==t.direction){if(0==e.index)return $(h);e.prevSlide()}}}});e.events.touch=q}var K=T(),Q=null!==T()||void 0!==document.createTouch||"ontouchstart"in window||"onmsgesturechange"in window||navigator.msMaxTouchPoints,ee=document.getElementsByTagName("html")[0],te={selector:".glightbox",elements:null,skin:"clean",theme:"clean",closeButton:!0,startAt:null,autoplayVideos:!0,autofocusVideos:!0,descPosition:"bottom",width:"900px",height:"506px",videosWidth:"960px",beforeSlideChange:null,afterSlideChange:null,beforeSlideLoad:null,afterSlideLoad:null,slideInserted:null,slideRemoved:null,slideExtraAttributes:null,onOpen:null,onClose:null,loop:!1,zoomable:!0,draggable:!0,dragAutoSnap:!1,dragToleranceX:40,dragToleranceY:65,preload:!0,oneSlidePerOpen:!1,touchNavigation:!0,touchFollowAxis:!0,keyboardNavigation:!0,closeOnOutsideClick:!0,plugins:!1,plyr:{css:"https://cdn.plyr.io/3.6.12/plyr.css",js:"https://cdn.plyr.io/3.6.12/plyr.js",config:{ratio:"16:9",fullscreen:{enabled:!0,iosNative:!0},youtube:{noCookie:!0,rel:0,showinfo:0,iv_load_policy:3},vimeo:{byline:!1,portrait:!1,title:!1,transparent:!1}}},openEffect:"zoom",closeEffect:"zoom",slideEffect:"slide",moreText:"See more",moreLength:60,cssEfects:{fade:{in:"fadeIn",out:"fadeOut"},zoom:{in:"zoomIn",out:"zoomOut"},slide:{in:"slideInRight",out:"slideOutLeft"},slideBack:{in:"slideInLeft",out:"slideOutRight"},none:{in:"none",out:"none"}},svg:{close:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',next:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',prev:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'},slideHTML:'<div class="gslide">\n    <div class="gslide-inner-content">\n        <div class="ginner-container">\n            <div class="gslide-media">\n            </div>\n            <div class="gslide-description">\n                <div class="gdesc-inner">\n                    <h4 class="gslide-title"></h4>\n                    <div class="gslide-desc"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>',lightboxHTML:'<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-hidden="false">\n    <div class="gloader visible"></div>\n    <div class="goverlay"></div>\n    <div class="gcontainer">\n    <div id="glightbox-slider" class="gslider"></div>\n    <button class="gclose gbtn" aria-label="Close" data-taborder="3">{closeSVG}</button>\n    <button class="gprev gbtn" aria-label="Previous" data-taborder="2">{prevSVG}</button>\n    <button class="gnext gbtn" aria-label="Next" data-taborder="1">{nextSVG}</button>\n</div>\n</div>'},ie=s((function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};i(this,e),this.customOptions=t,this.settings=o(te,t),this.effectsClasses=this.getAnimationClasses(),this.videoPlayers={},this.apiEvents=[],this.fullElementsList=!1}),[{key:"init",value:function(){var e=this,t=this.getSelector();t&&(this.baseEvents=h("click",{onElement:t,withCallback:function(t,i){t.preventDefault(),e.open(i)}})),this.elements=this.getElements()}},{key:"open",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(0===this.elements.length)return!1;this.activeSlide=null,this.prevActiveSlideIndex=null,this.prevActiveSlide=null;var i=z(t)?t:this.settings.startAt;if(E(e)){var n=e.getAttribute("data-gallery");n&&(this.fullElementsList=this.elements,this.elements=this.getGalleryElements(this.elements,n)),O(i)&&(i=this.getElementIndex(e))<0&&(i=0)}z(i)||(i=0),this.build(),v(this.overlay,"none"===this.settings.openEffect?"none":this.settings.cssEfects.fade.in);var s=document.body,l=window.innerWidth-document.documentElement.clientWidth;if(l>0){var o=document.createElement("style");o.type="text/css",o.className="gcss-styles",o.innerText=".gscrollbar-fixer {margin-right: ".concat(l,"px}"),document.head.appendChild(o),d(s,"gscrollbar-fixer")}d(s,"glightbox-open"),d(ee,"glightbox-open"),K&&(d(document.body,"glightbox-mobile"),this.settings.slideEffect="slide"),this.showSlide(i,!0),1===this.elements.length?(d(this.prevButton,"glightbox-button-hidden"),d(this.nextButton,"glightbox-button-hidden")):(c(this.prevButton,"glightbox-button-hidden"),c(this.nextButton,"glightbox-button-hidden")),this.lightboxOpen=!0,this.trigger("open"),C(this.settings.onOpen)&&this.settings.onOpen(),Q&&this.settings.touchNavigation&&J(this),this.settings.keyboardNavigation&&Y(this)}},{key:"openAt",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.open(null,e)}},{key:"showSlide",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];p(this.loader),this.index=parseInt(t);var n=this.slidesContainer.querySelector(".current");n&&c(n,"current"),this.slideAnimateOut();var s=this.slidesContainer.querySelectorAll(".gslide")[t];if(u(s,"loaded"))this.slideAnimateIn(s,i),m(this.loader);else{p(this.loader);var l=this.elements[t],o={index:this.index,slide:s,slideNode:s,slideConfig:l.slideConfig,slideIndex:this.index,trigger:l.node,player:null};this.trigger("slide_before_load",o),l.instance.setContent(s,(function(){m(e.loader),e.resize(),e.slideAnimateIn(s,i),e.trigger("slide_after_load",o)}))}this.slideDescription=s.querySelector(".gslide-description"),this.slideDescriptionContained=this.slideDescription&&u(this.slideDescription.parentNode,"gslide-media"),this.settings.preload&&(this.preloadSlide(t+1),this.preloadSlide(t-1)),this.updateNavigationClasses(),this.activeSlide=s}},{key:"preloadSlide",value:function(e){var t=this;if(e<0||e>this.elements.length-1)return!1;if(O(this.elements[e]))return!1;var i=this.slidesContainer.querySelectorAll(".gslide")[e];if(u(i,"loaded"))return!1;var n=this.elements[e],s=n.type,l={index:e,slide:i,slideNode:i,slideConfig:n.slideConfig,slideIndex:e,trigger:n.node,player:null};this.trigger("slide_before_load",l),"video"===s||"external"===s?setTimeout((function(){n.instance.setContent(i,(function(){t.trigger("slide_after_load",l)}))}),200):n.instance.setContent(i,(function(){t.trigger("slide_after_load",l)}))}},{key:"prevSlide",value:function(){this.goToSlide(this.index-1)}},{key:"nextSlide",value:function(){this.goToSlide(this.index+1)}},{key:"goToSlide",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(this.prevActiveSlide=this.activeSlide,this.prevActiveSlideIndex=this.index,!this.loop()&&(e<0||e>this.elements.length-1))return!1;e<0?e=this.elements.length-1:e>=this.elements.length&&(e=0),this.showSlide(e)}},{key:"insertSlide",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;t<0&&(t=this.elements.length);var i=new V(e,this,t),n=i.getConfig(),s=o({},n),l=i.create(),r=this.elements.length-1;s.index=t,s.node=!1,s.instance=i,s.slideConfig=n,this.elements.splice(t,0,s);var a=null,h=null;if(this.slidesContainer){if(t>r)this.slidesContainer.appendChild(l);else{var d=this.slidesContainer.querySelectorAll(".gslide")[t];this.slidesContainer.insertBefore(l,d)}(this.settings.preload&&0==this.index&&0==t||this.index-1==t||this.index+1==t)&&this.preloadSlide(t),0===this.index&&0===t&&(this.index=1),this.updateNavigationClasses(),a=this.slidesContainer.querySelectorAll(".gslide")[t],h=this.getSlidePlayerInstance(t),s.slideNode=a}this.trigger("slide_inserted",{index:t,slide:a,slideNode:a,slideConfig:n,slideIndex:t,trigger:null,player:h}),C(this.settings.slideInserted)&&this.settings.slideInserted({index:t,slide:a,player:h})}},{key:"removeSlide",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:-1;if(e<0||e>this.elements.length-1)return!1;var t=this.slidesContainer&&this.slidesContainer.querySelectorAll(".gslide")[e];t&&(this.getActiveSlideIndex()==e&&(e==this.elements.length-1?this.prevSlide():this.nextSlide()),t.parentNode.removeChild(t)),this.elements.splice(e,1),this.trigger("slide_removed",e),C(this.settings.slideRemoved)&&this.settings.slideRemoved(e)}},{key:"slideAnimateIn",value:function(e,t){var i=this,n=e.querySelector(".gslide-media"),s=e.querySelector(".gslide-description"),l={index:this.prevActiveSlideIndex,slide:this.prevActiveSlide,slideNode:this.prevActiveSlide,slideIndex:this.prevActiveSlide,slideConfig:O(this.prevActiveSlideIndex)?null:this.elements[this.prevActiveSlideIndex].slideConfig,trigger:O(this.prevActiveSlideIndex)?null:this.elements[this.prevActiveSlideIndex].node,player:this.getSlidePlayerInstance(this.prevActiveSlideIndex)},o={index:this.index,slide:this.activeSlide,slideNode:this.activeSlide,slideConfig:this.elements[this.index].slideConfig,slideIndex:this.index,trigger:this.elements[this.index].node,player:this.getSlidePlayerInstance(this.index)};if(n.offsetWidth>0&&s&&(m(s),s.style.display=""),c(e,this.effectsClasses),t)v(e,this.settings.cssEfects[this.settings.openEffect].in,(function(){i.settings.autoplayVideos&&i.slidePlayerPlay(e),i.trigger("slide_changed",{prev:l,current:o}),C(i.settings.afterSlideChange)&&i.settings.afterSlideChange.apply(i,[l,o])}));else{var r=this.settings.slideEffect,a="none"!==r?this.settings.cssEfects[r].in:r;this.prevActiveSlideIndex>this.index&&"slide"==this.settings.slideEffect&&(a=this.settings.cssEfects.slideBack.in),v(e,a,(function(){i.settings.autoplayVideos&&i.slidePlayerPlay(e),i.trigger("slide_changed",{prev:l,current:o}),C(i.settings.afterSlideChange)&&i.settings.afterSlideChange.apply(i,[l,o])}))}setTimeout((function(){i.resize(e)}),100),d(e,"current")}},{key:"slideAnimateOut",value:function(){if(!this.prevActiveSlide)return!1;var e=this.prevActiveSlide;c(e,this.effectsClasses),d(e,"prev");var t=this.settings.slideEffect,i="none"!==t?this.settings.cssEfects[t].out:t;this.slidePlayerPause(e),this.trigger("slide_before_change",{prev:{index:this.prevActiveSlideIndex,slide:this.prevActiveSlide,slideNode:this.prevActiveSlide,slideIndex:this.prevActiveSlideIndex,slideConfig:O(this.prevActiveSlideIndex)?null:this.elements[this.prevActiveSlideIndex].slideConfig,trigger:O(this.prevActiveSlideIndex)?null:this.elements[this.prevActiveSlideIndex].node,player:this.getSlidePlayerInstance(this.prevActiveSlideIndex)},current:{index:this.index,slide:this.activeSlide,slideNode:this.activeSlide,slideIndex:this.index,slideConfig:this.elements[this.index].slideConfig,trigger:this.elements[this.index].node,player:this.getSlidePlayerInstance(this.index)}}),C(this.settings.beforeSlideChange)&&this.settings.beforeSlideChange.apply(this,[{index:this.prevActiveSlideIndex,slide:this.prevActiveSlide,player:this.getSlidePlayerInstance(this.prevActiveSlideIndex)},{index:this.index,slide:this.activeSlide,player:this.getSlidePlayerInstance(this.index)}]),this.prevActiveSlideIndex>this.index&&"slide"==this.settings.slideEffect&&(i=this.settings.cssEfects.slideBack.out),v(e,i,(function(){var t=e.querySelector(".ginner-container"),i=e.querySelector(".gslide-media"),n=e.querySelector(".gslide-description");t.style.transform="",i.style.transform="",c(i,"greset"),i.style.opacity="",n&&(n.style.opacity=""),c(e,"prev")}))}},{key:"getAllPlayers",value:function(){return this.videoPlayers}},{key:"getSlidePlayerInstance",value:function(e){var t="gvideo"+e,i=this.getAllPlayers();return!(!P(i,t)||!i[t])&&i[t]}},{key:"stopSlideVideo",value:function(e){if(E(e)){var t=e.querySelector(".gvideo-wrapper");t&&(e=t.getAttribute("data-index"))}console.log("stopSlideVideo is deprecated, use slidePlayerPause");var i=this.getSlidePlayerInstance(e);i&&i.playing&&i.pause()}},{key:"slidePlayerPause",value:function(e){if(E(e)){var t=e.querySelector(".gvideo-wrapper");t&&(e=t.getAttribute("data-index"))}var i=this.getSlidePlayerInstance(e);i&&i.playing&&i.pause()}},{key:"playSlideVideo",value:function(e){if(E(e)){var t=e.querySelector(".gvideo-wrapper");t&&(e=t.getAttribute("data-index"))}console.log("playSlideVideo is deprecated, use slidePlayerPlay");var i=this.getSlidePlayerInstance(e);i&&!i.playing&&i.play()}},{key:"slidePlayerPlay",value:function(e){var t;if(!K||null!==(t=this.settings.plyr.config)&&void 0!==t&&t.muted){if(E(e)){var i=e.querySelector(".gvideo-wrapper");i&&(e=i.getAttribute("data-index"))}var n=this.getSlidePlayerInstance(e);n&&!n.playing&&(n.play(),this.settings.autofocusVideos&&n.elements.container.focus())}}},{key:"setElements",value:function(e){var t=this;this.settings.elements=!1;var i=[];e&&e.length&&r(e,(function(e,n){var s=new V(e,t,n),l=s.getConfig(),r=o({},l);r.slideConfig=l,r.instance=s,r.index=n,i.push(r)})),this.elements=i,this.lightboxOpen&&(this.slidesContainer.innerHTML="",this.elements.length&&(r(this.elements,(function(){var e=y(t.settings.slideHTML);t.slidesContainer.appendChild(e)})),this.showSlide(0,!0)))}},{key:"getElementIndex",value:function(e){var t=!1;return r(this.elements,(function(i,n){if(P(i,"node")&&i.node==e)return t=n,!0})),t}},{key:"getElements",value:function(){var e=this,t=[];this.elements=this.elements?this.elements:[],!O(this.settings.elements)&&A(this.settings.elements)&&this.settings.elements.length&&r(this.settings.elements,(function(i,n){var s=new V(i,e,n),l=s.getConfig(),r=o({},l);r.node=!1,r.index=n,r.instance=s,r.slideConfig=l,t.push(r)}));var i=!1;return this.getSelector()&&(i=document.querySelectorAll(this.getSelector())),i?(r(i,(function(i,n){var s=new V(i,e,n),l=s.getConfig(),r=o({},l);r.node=i,r.index=n,r.instance=s,r.slideConfig=l,r.gallery=i.getAttribute("data-gallery"),t.push(r)})),t):t}},{key:"getGalleryElements",value:function(e,t){return e.filter((function(e){return e.gallery==t}))}},{key:"getSelector",value:function(){return!this.settings.elements&&(this.settings.selector&&"data-"==this.settings.selector.substring(0,5)?"*[".concat(this.settings.selector,"]"):this.settings.selector)}},{key:"getActiveSlide",value:function(){return this.slidesContainer.querySelectorAll(".gslide")[this.index]}},{key:"getActiveSlideIndex",value:function(){return this.index}},{key:"getAnimationClasses",value:function(){var e=[];for(var t in this.settings.cssEfects)if(this.settings.cssEfects.hasOwnProperty(t)){var i=this.settings.cssEfects[t];e.push("g".concat(i.in)),e.push("g".concat(i.out))}return e.join(" ")}},{key:"build",value:function(){var e=this;if(this.built)return!1;var t=document.body.childNodes,i=[];r(t,(function(e){e.parentNode==document.body&&"#"!==e.nodeName.charAt(0)&&e.hasAttribute&&!e.hasAttribute("aria-hidden")&&(i.push(e),e.setAttribute("aria-hidden","true"))}));var n=P(this.settings.svg,"next")?this.settings.svg.next:"",s=P(this.settings.svg,"prev")?this.settings.svg.prev:"",l=P(this.settings.svg,"close")?this.settings.svg.close:"",o=this.settings.lightboxHTML;o=y(o=(o=(o=o.replace(/{nextSVG}/g,n)).replace(/{prevSVG}/g,s)).replace(/{closeSVG}/g,l)),document.body.appendChild(o);var a=document.getElementById("glightbox-body");this.modal=a;var c=a.querySelector(".gclose");this.prevButton=a.querySelector(".gprev"),this.nextButton=a.querySelector(".gnext"),this.overlay=a.querySelector(".goverlay"),this.loader=a.querySelector(".gloader"),this.slidesContainer=document.getElementById("glightbox-slider"),this.bodyHiddenChildElms=i,this.events={},d(this.modal,"glightbox-"+this.settings.skin),this.settings.closeButton&&c&&(this.events.close=h("click",{onElement:c,withCallback:function(t,i){t.preventDefault(),e.close()}})),c&&!this.settings.closeButton&&c.parentNode.removeChild(c),this.nextButton&&(this.events.next=h("click",{onElement:this.nextButton,withCallback:function(t,i){t.preventDefault(),e.nextSlide()}})),this.prevButton&&(this.events.prev=h("click",{onElement:this.prevButton,withCallback:function(t,i){t.preventDefault(),e.prevSlide()}})),this.settings.closeOnOutsideClick&&(this.events.outClose=h("click",{onElement:a,withCallback:function(t,i){e.preventOutsideClick||u(document.body,"glightbox-mobile")||g(t.target,".ginner-container")||g(t.target,".gbtn")||u(t.target,"gnext")||u(t.target,"gprev")||e.close()}})),r(this.elements,(function(t,i){e.slidesContainer.appendChild(t.instance.create()),t.slideNode=e.slidesContainer.querySelectorAll(".gslide")[i]})),Q&&d(document.body,"glightbox-touch"),this.events.resize=h("resize",{onElement:window,withCallback:function(){e.resize()}}),this.built=!0}},{key:"resize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if((e=e||this.activeSlide)&&!u(e,"zoomed")){var t=x(),i=e.querySelector(".gvideo-wrapper"),n=e.querySelector(".gslide-image"),s=this.slideDescription,l=t.width,o=t.height;if(l<=768?d(document.body,"glightbox-mobile"):c(document.body,"glightbox-mobile"),i||n){var r=!1;if(s&&(u(s,"description-bottom")||u(s,"description-top"))&&!u(s,"gabsolute")&&(r=!0),n)if(l<=768)n.querySelector("img");else if(r){var a,h=s.offsetHeight,g=n.querySelector("img"),v=this.elements[this.index].node,f=null!==(a=v.getAttribute("data-height"))&&void 0!==a?a:"100vh";g.setAttribute("style","max-height: calc(".concat(f," - ").concat(h,"px)")),s.setAttribute("style","max-width: ".concat(g.offsetWidth,"px;"))}if(i){var p=P(this.settings.plyr.config,"ratio")?this.settings.plyr.config.ratio:"";if(!p){var m=i.clientWidth,y=i.clientHeight,b=m/y;p="".concat(m/b,":").concat(y/b)}var S=p.split(":"),w=this.settings.videosWidth,T=this.settings.videosWidth,C=(T=z(w)||-1!==w.indexOf("px")?parseInt(w):-1!==w.indexOf("vw")?l*parseInt(w)/100:-1!==w.indexOf("vh")?o*parseInt(w)/100:-1!==w.indexOf("%")?l*parseInt(w)/100:parseInt(i.clientWidth))/(parseInt(S[0])/parseInt(S[1]));if(C=Math.floor(C),r&&(o-=s.offsetHeight),T>l||C>o||o<C&&l>T){var k=i.offsetWidth,E=i.offsetHeight,A=o/E,L={width:k*A,height:E*A};i.parentNode.setAttribute("style","max-width: ".concat(L.width,"px")),r&&s.setAttribute("style","max-width: ".concat(L.width,"px;"))}else i.parentNode.style.maxWidth="".concat(w),r&&s.setAttribute("style","max-width: ".concat(w,";"))}}}}},{key:"reload",value:function(){this.init()}},{key:"updateNavigationClasses",value:function(){var e=this.loop();c(this.nextButton,"disabled"),c(this.prevButton,"disabled"),0==this.index&&this.elements.length-1==0?(d(this.prevButton,"disabled"),d(this.nextButton,"disabled")):0!==this.index||e?this.index!==this.elements.length-1||e||d(this.nextButton,"disabled"):d(this.prevButton,"disabled")}},{key:"loop",value:function(){var e=P(this.settings,"loopAtEnd")?this.settings.loopAtEnd:null;return e=P(this.settings,"loop")?this.settings.loop:e,e}},{key:"close",value:function(){var e=this;if(!this.lightboxOpen){if(this.events){for(var t in this.events)this.events.hasOwnProperty(t)&&this.events[t].destroy();this.events=null}return!1}if(this.closing)return!1;this.closing=!0,this.slidePlayerPause(this.activeSlide),this.fullElementsList&&(this.elements=this.fullElementsList),this.bodyHiddenChildElms.length&&r(this.bodyHiddenChildElms,(function(e){e.removeAttribute("aria-hidden")})),d(this.modal,"glightbox-closing"),v(this.overlay,"none"==this.settings.openEffect?"none":this.settings.cssEfects.fade.out),v(this.activeSlide,this.settings.cssEfects[this.settings.closeEffect].out,(function(){if(e.activeSlide=null,e.prevActiveSlideIndex=null,e.prevActiveSlide=null,e.built=!1,e.events){for(var t in e.events)e.events.hasOwnProperty(t)&&e.events[t].destroy();e.events=null}var i=document.body;c(ee,"glightbox-open"),c(i,"glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer"),e.modal.parentNode.removeChild(e.modal),e.trigger("close"),C(e.settings.onClose)&&e.settings.onClose();var n=document.querySelector(".gcss-styles");n&&n.parentNode.removeChild(n),e.lightboxOpen=!1,e.closing=null}))}},{key:"destroy",value:function(){this.close(),this.clearAllEvents(),this.baseEvents&&this.baseEvents.destroy()}},{key:"on",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!e||!C(t))throw new TypeError("Event name and callback must be defined");this.apiEvents.push({evt:e,once:i,callback:t})}},{key:"once",value:function(e,t){this.on(e,t,!0)}},{key:"trigger",value:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=[];r(this.apiEvents,(function(t,s){var l=t.evt,o=t.once,r=t.callback;l==e&&(r(i),o&&n.push(s))})),n.length&&r(n,(function(e){return t.apiEvents.splice(e,1)}))}},{key:"clearAllEvents",value:function(){this.apiEvents.splice(0,this.apiEvents.length)}},{key:"version",value:function(){return"3.3.0"}}]);return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=new ie(e);return t.init(),t}}));

/***/ }),

/***/ "./styles/app.scss":
/*!*************************!*\
  !*** ./styles/app.scss ***!
  \*************************/
/***/ (() => {

throw new Error("Module parse failed: Unexpected character '@' (1:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n> @import \"~startbootstrap-clean-blog/dist/css/styles.css\";\n| @import \"~blueimp-gallery/css/blueimp-gallery.min.css\";\n| @import \"~glightbox/dist/css/glightbox.min.css\";");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./js/app.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxZQUFZLHFCQUFxQjs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLGNBQWM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isb0JBQW9CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFdBQVc7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtB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Q0FBb0MsZ0RBQWdELGFBQWEsaUNBQWlDLGdSQUFnUiwyR0FBMkcsdUNBQXVDLDhCQUE4Qiw0R0FBNEcscURBQXFELGtDQUFrQyxpREFBaUQscURBQXFELGtDQUFrQyx1RUFBdUUsdUNBQXVDLHVLQUF1SyxrQ0FBa0MsZ0hBQWdILHdFQUF3RSx5Q0FBeUMsWUFBWSxpQkFBaUIsRUFBRSw4QkFBOEIsa0VBQWtFLDRDQUE0QywrSEFBK0gsd0ZBQXdGLFNBQVMsd0hBQXdILFdBQVcsa0pBQWtKLDBJQUEwSSxJQUFJLE1BQU0sOEVBQThFLE9BQU8sMkNBQTJDLGlDQUFpQyxvU0FBb1MsOERBQThELDhDQUE4QyxzQkFBc0IsaUlBQWlJLElBQUksaUdBQWlHLFFBQVEsRUFBRSw4QkFBOEIsYUFBYSxFQUFFLCtDQUErQyxrQkFBa0IsMFJBQTBSLEVBQUUsNEJBQTRCLGdFQUFnRSx5REFBeUQsRUFBRSw2QkFBNkIsV0FBVyx1QkFBdUIsZ0JBQWdCLGlGQUFpRixpQkFBaUIsU0FBUyx5QkFBeUIsOExBQThMLGlDQUFpQyxvTkFBb04sOEZBQThGLHdFQUF3RSxjQUFjLG9CQUFvQiwwTkFBME4sNkNBQTZDLGdFQUFnRSxJQUFJLEVBQUUsK0JBQStCLCtFQUErRSxFQUFFLDZCQUE2Qiw4REFBOEQsNEVBQTRFLHFCQUFxQix3QkFBd0IsR0FBRyxFQUFFLCtCQUErQixpQkFBaUIsRUFBRSxnQ0FBZ0MsOEVBQThFLGdDQUFnQyxrQ0FBa0MsMEJBQTBCLDhCQUE4QiwrQkFBK0IsSUFBSSxFQUFFLHNDQUFzQyxnREFBZ0QsRUFBRSwrQkFBK0IsZUFBZSxHQUFHLGtCQUFrQiwrREFBK0QsYUFBYSxtQkFBbUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZ2FsbGVyeS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9saWdodGJveC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvbmF2YmFyLmpzIiwid2VicGFjazovLy8uL2pzL3Njcm9sbGluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmx1ZWltcC1nYWxsZXJ5L2pzL2JsdWVpbXAtZ2FsbGVyeS12aWRlby5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmx1ZWltcC1nYWxsZXJ5L2pzL2JsdWVpbXAtZ2FsbGVyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmx1ZWltcC1nYWxsZXJ5L2pzL2JsdWVpbXAtZ2FsbGVyeS5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JsdWVpbXAtZ2FsbGVyeS9qcy9ibHVlaW1wLWhlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZ2xpZ2h0Ym94L2Rpc3QvanMvZ2xpZ2h0Ym94Lm1pbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuLy4uL3N0eWxlcy9hcHAuc2NzcycpO1xuXG5yZXF1aXJlKCcuL2xpZ2h0Ym94Jyk7XG5yZXF1aXJlKCcuL25hdmJhcicpO1xucmVxdWlyZSgnLi9zY3JvbGxpbmcnKTtcbnJlcXVpcmUoJy4vbWFwJyk7XG5yZXF1aXJlKCcuL2dhbGxlcnknKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBibHVlaW1wR2FsbGVyeSA9IHJlcXVpcmUoJ2JsdWVpbXAtZ2FsbGVyeS9qcy9ibHVlaW1wLWdhbGxlcnkubWluLmpzJyk7XG4gICAgbGV0IGdhbGxlcmllcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ibHVlaW1wLWdhbGxlcnknKTtcblxuICAgIGdhbGxlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChnYWxsZXJ5KSB7XG4gICAgICAgIGJsdWVpbXBHYWxsZXJ5KEpTT04ucGFyc2UoZ2FsbGVyeS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc291cmNlcycpKSwge1xuICAgICAgICAgICAgY29udGFpbmVyOiAnIycgKyBnYWxsZXJ5LmdldEF0dHJpYnV0ZSgnaWQnKSxcbiAgICAgICAgICAgIGNhcm91c2VsOiB0cnVlLFxuICAgICAgICAgICAgc3RhcnRTbGlkZXNob3c6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pKCk7XG4iLCJpbXBvcnQgR0xpZ2h0Ym94IGZyb20gJ2dsaWdodGJveCc7XG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBsaWdodGJveEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtkYXRhLWdhbGxlcnlePVwibGlnaHRib3gtXCJdJyk7XG4gICAgbGV0IGxpZ2h0Ym94ZXMgPSBbXTtcblxuICAgIGxpZ2h0Ym94RWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWdhbGxlcnknKTtcbiAgICAgICAgaWYgKCFsaWdodGJveGVzLmluY2x1ZGVzKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgR0xpZ2h0Ym94KCk7XG4gICAgICAgICAgICBsaWdodGJveGVzLnB1c2goc2VsZWN0b3IpO1xuICAgICAgICB9XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXAtZHJhZ2dhYmxlJyk7XG4gICAgaWYgKG51bGwgPT09IHN2Zykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgYnJvd3NlciBzdXBwb3J0cyBwb2ludGVyIGV2ZW50c1xuICAgIGlmICh3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gICAgICAgIHN2Zy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIG9uUG9pbnRlckRvd24sIHtwYXNzaXZlOiB0cnVlfSk7IC8vIFBvaW50ZXIgaXMgcHJlc3NlZFxuICAgICAgICBzdmcuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25Qb2ludGVyVXAsIHtwYXNzaXZlOiB0cnVlfSk7IC8vIFJlbGVhc2luZyB0aGUgcG9pbnRlclxuICAgICAgICBzdmcuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgb25Qb2ludGVyVXAsIHtwYXNzaXZlOiB0cnVlfSk7IC8vIFBvaW50ZXIgZ2V0cyBvdXQgb2YgdGhlIFNWRyBhcmVhXG4gICAgICAgIHN2Zy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uUG9pbnRlck1vdmUsIHtwYXNzaXZlOiB0cnVlfSk7IC8vIFBvaW50ZXIgaXMgbW92aW5nXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQWRkIGFsbCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGZhbGxiYWNrXG4gICAgICAgIHN2Zy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvblBvaW50ZXJEb3duLCB7cGFzc2l2ZTogdHJ1ZX0pOyAvLyBQcmVzc2luZyB0aGUgbW91c2VcbiAgICAgICAgc3ZnLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvblBvaW50ZXJVcCwge3Bhc3NpdmU6IHRydWV9KTsgLy8gUmVsZWFzaW5nIHRoZSBtb3VzZVxuICAgICAgICBzdmcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG9uUG9pbnRlclVwLCB7cGFzc2l2ZTogdHJ1ZX0pOyAvLyBNb3VzZSBnZXRzIG91dCBvZiB0aGUgU1ZHIGFyZWFcbiAgICAgICAgc3ZnLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uUG9pbnRlck1vdmUsIHtwYXNzaXZlOiB0cnVlfSk7IC8vIE1vdXNlIGlzIG1vdmluZ1xuXG4gICAgICAgIC8vIEFkZCBhbGwgdG91Y2ggZXZlbnRzIGxpc3RlbmVycyBmYWxsYmFja1xuICAgICAgICBzdmcuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uUG9pbnRlckRvd24sIHtwYXNzaXZlOiB0cnVlfSk7IC8vIEZpbmdlciBpcyB0b3VjaGluZyB0aGUgc2NyZWVuXG4gICAgICAgIHN2Zy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uUG9pbnRlclVwLCB7cGFzc2l2ZTogdHJ1ZX0pOyAvLyBGaW5nZXIgaXMgbm8gbG9uZ2VyIHRvdWNoaW5nIHRoZSBzY3JlZW5cbiAgICAgICAgc3ZnLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uUG9pbnRlck1vdmUsIHtwYXNzaXZlOiB0cnVlfSk7IC8vIEZpbmdlciBpcyBtb3ZpbmdcbiAgICB9XG5cbiAgICAvLyBUaGlzIHZhcmlhYmxlIHdpbGwgYmUgdXNlZCBsYXRlciBmb3IgbW92ZSBldmVudHMgdG8gY2hlY2sgaWYgcG9pbnRlciBpcyBkb3duIG9yIG5vdFxuICAgIGxldCBpc1BvaW50ZXJEb3duID0gZmFsc2U7XG4gICAgLy8gVGhpcyB2YXJpYWJsZSB3aWxsIGNvbnRhaW4gdGhlIG9yaWdpbmFsIGNvb3JkaW5hdGVzIHdoZW4gdGhlIHVzZXIgc3RhcnQgcHJlc3NpbmcgdGhlIG1vdXNlIG9yIHRvdWNoaW5nIHRoZSBzY3JlZW5cbiAgICBsZXQgcG9pbnRlck9yaWdpbiA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgIH07XG5cbiAgICAvLyBXZSBzYXZlIHRoZSBvcmlnaW5hbCB2YWx1ZXMgZnJvbSB0aGUgdmlld0JveFxuICAgIGxldCBvcmlnVmlld3BvcnQgPSBzdmcuZ2V0QXR0cmlidXRlKCd2aWV3Qm94Jykuc3BsaXQoJyAnKTtcbiAgICBsZXQgdmlld0JveCA9IHtcbiAgICAgICAgeDogb3JpZ1ZpZXdwb3J0WzBdLFxuICAgICAgICB5OiBvcmlnVmlld3BvcnRbMV0sXG4gICAgICAgIHdpZHRoOiBvcmlnVmlld3BvcnRbMl0sXG4gICAgICAgIGhlaWdodDogb3JpZ1ZpZXdwb3J0WzNdXG4gICAgfTtcblxuICAgIC8vIFNldCB2aWV3cG9ydCBkZXBlbmRpbmcgb24gZGV2aWNlIHdpZHRoXG4gICAgbGV0IGRldmljZVdpZHRoID0gKHdpbmRvdy5pbm5lcldpZHRoID4gMCkgPyB3aW5kb3cuaW5uZXJXaWR0aCA6IHNjcmVlbi53aWR0aDtcbiAgICBpZiAoZGV2aWNlV2lkdGggPD0gNTc2KSB7IC8vIGJvb3RzdHJhcCBzbWFsbCBicmVha3BvaW50XG4gICAgICAgIHZpZXdCb3gueCA9IHZpZXdCb3gueCAqIDIuMTU7XG4gICAgICAgIHZpZXdCb3gud2lkdGggPSB2aWV3Qm94LndpZHRoICogMC43NTtcbiAgICAgICAgdmlld0JveC5oZWlnaHQgPSB2aWV3Qm94LmhlaWdodCAqIDAuNzU7XG4gICAgICAgIHVwZGF0ZVZpZXdCb3godmlld0JveC54LCB2aWV3Qm94LnksIHZpZXdCb3gud2lkdGgsIHZpZXdCb3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvLyBUaGUgZGlzdGFuY2VzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgcG9pbnRlciB3aWxsIGJlIHN0b3JlZCBoZXJlXG4gICAgbGV0IG5ld1ZpZXdCb3ggPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICB9O1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSByYXRpbyBiYXNlZCBvbiB0aGUgdmlld0JveCB3aWR0aCBhbmQgdGhlIFNWRyB3aWR0aFxuICAgIGxldCByYXRpbyA9IHZpZXdCb3gud2lkdGggLyBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmF0aW8gPSB2aWV3Qm94LndpZHRoIC8gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIGFuIG9iamVjdCB3aXRoIFggJiBZIHZhbHVlcyBmcm9tIHRoZSBwb2ludGVyIGV2ZW50XG4gICAgZnVuY3Rpb24gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IHBvaW50ID0ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJZiBldmVuIGlzIHRyaWdnZXJlZCBieSBhIHRvdWNoIGV2ZW50LCB3ZSBnZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBmaW5nZXJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldFRvdWNoZXMpIHtcbiAgICAgICAgICAgIHBvaW50LnggPSBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgICBwb2ludC55ID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9pbnQueCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgICBwb2ludC55ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwb2ludDtcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbiBjYWxsZWQgYnkgdGhlIGV2ZW50IGxpc3RlbmVycyB3aGVuIHVzZXIgc3RhcnQgcHJlc3NpbmcvdG91Y2hpbmdcbiAgICBmdW5jdGlvbiBvblBvaW50ZXJEb3duKGV2ZW50KSB7XG4gICAgICAgIGlzUG9pbnRlckRvd24gPSB0cnVlOyAvLyBXZSBzZXQgdGhlIHBvaW50ZXIgYXMgZG93blxuXG4gICAgICAgIC8vIFdlIGdldCB0aGUgcG9pbnRlciBwb3NpdGlvbiBvbiBjbGljay90b3VjaGRvd24gc28gd2UgY2FuIGdldCB0aGUgdmFsdWUgb25jZSB0aGUgdXNlciBzdGFydHMgdG8gZHJhZ1xuICAgICAgICBsZXQgcG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgICBwb2ludGVyT3JpZ2luLnggPSBwb2ludGVyUG9zaXRpb24ueDtcbiAgICAgICAgcG9pbnRlck9yaWdpbi55ID0gcG9pbnRlclBvc2l0aW9uLnk7XG4gICAgfVxuXG4gICAgLy8gRnVuY3Rpb24gY2FsbGVkIGJ5IHRoZSBldmVudCBsaXN0ZW5lcnMgd2hlbiB1c2VyIHN0YXJ0IG1vdmluZy9kcmFnZ2luZ1xuICAgIGZ1bmN0aW9uIG9uUG9pbnRlck1vdmUoZXZlbnQpIHtcbiAgICAgICAgLy8gT25seSBydW4gdGhpcyBmdW5jdGlvbiBpZiB0aGUgcG9pbnRlciBpcyBkb3duXG4gICAgICAgIGlmICghaXNQb2ludGVyRG93bikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoaXMgcHJldmVudCB1c2VyIHRvIGRvIGEgc2VsZWN0aW9uIG9uIHRoZSBwYWdlXG4gICAgICAgIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBwb2ludGVyIHBvc2l0aW9uXG4gICAgICAgIGxldCBwb2ludGVyUG9zaXRpb24gPSBnZXRQb2ludEZyb21FdmVudChldmVudCk7XG5cbiAgICAgICAgLy8gV2UgY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwb2ludGVyIG9yaWdpbiBhbmQgdGhlIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAgLy8gVGhlIHZpZXdCb3ggeCAmIHkgdmFsdWVzIG11c3QgYmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBvcmlnaW5hbCB2YWx1ZXMgYW5kIHRoZSBkaXN0YW5jZXNcbiAgICAgICAgbmV3Vmlld0JveC54ID0gdmlld0JveC54IC0gKChwb2ludGVyUG9zaXRpb24ueCAtIHBvaW50ZXJPcmlnaW4ueCkgKiByYXRpbyk7XG4gICAgICAgIG5ld1ZpZXdCb3gueSA9IHZpZXdCb3gueSAtICgocG9pbnRlclBvc2l0aW9uLnkgLSBwb2ludGVyT3JpZ2luLnkpICogcmF0aW8pO1xuXG4gICAgICAgIC8vIFdlIGNyZWF0ZSBhIHN0cmluZyB3aXRoIHRoZSBuZXcgdmlld0JveCB2YWx1ZXNcbiAgICAgICAgLy8gVGhlIFggJiBZIHZhbHVlcyBhcmUgZXF1YWwgdG8gdGhlIGN1cnJlbnQgdmlld0JveCBtaW51cyB0aGUgY2FsY3VsYXRlZCBkaXN0YW5jZXNcbiAgICAgICAgdXBkYXRlVmlld0JveChuZXdWaWV3Qm94LngsIG5ld1ZpZXdCb3gueSwgdmlld0JveC53aWR0aCwgdmlld0JveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uUG9pbnRlclVwKCkge1xuICAgICAgICAvLyBUaGUgcG9pbnRlciBpcyBubyBsb25nZXIgY29uc2lkZXJlZCBhcyBkb3duXG4gICAgICAgIGlzUG9pbnRlckRvd24gPSBmYWxzZTtcblxuICAgICAgICAvLyBXZSBzYXZlIHRoZSB2aWV3Qm94IGNvb3JkaW5hdGVzIGJhc2VkIG9uIHRoZSBsYXN0IHBvaW50ZXIgb2Zmc2V0c1xuICAgICAgICB2aWV3Qm94LnggPSBuZXdWaWV3Qm94Lng7XG4gICAgICAgIHZpZXdCb3gueSA9IG5ld1ZpZXdCb3gueTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVWaWV3Qm94KHgsIHksIHcsIGgpIHtcbiAgICAgICAgbGV0IHZpZXdCb3hTdHJpbmcgPSBgJHt4fSAke3l9ICR7d30gJHtofWA7XG5cbiAgICAgICAgLy8gV2UgYXBwbHkgdGhlIG5ldyB2aWV3Qm94IHZhbHVlcyBvbnRvIHRoZSBTVkdcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIHZpZXdCb3hTdHJpbmcpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IHRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25hdmJhci10b2dnbGVyJylbMF07XG4gICAgbGV0IGNvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmF2YmFyLWNvbGxhcHNlJylbMF07XG5cbiAgICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVNZW51LCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgICAgICBjb2xsYXBzZS5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZScpO1xuICAgICAgICBjb2xsYXBzZS5jbGFzc0xpc3QudG9nZ2xlKCdpbicpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBTaG93IHRoZSBuYXZiYXIgd2hlbiB0aGUgcGFnZSBpcyBzY3JvbGxlZCB1cFxuICBsZXQgTVFMID0gOTkyO1xuXG4gIC8vcHJpbWFyeSBuYXZpZ2F0aW9uIHNsaWRlLWluIGVmZmVjdFxuICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoID4gTVFMKSB7XG4gICAgbGV0IHByZXZpb3VzVG9wID0gMDtcbiAgICBsZXQgbWFpbk5hdlN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5OYXYnKSk7XG4gICAgbGV0IGhlYWRlckhlaWdodCA9IHBhcnNlSW50KG1haW5OYXZTdHlsZXMuaGVpZ2h0LnJlcGxhY2UoJ3B4JywgJycpKVxuICAgICAgICAtIHBhcnNlSW50KG1haW5OYXZTdHlsZXMucGFkZGluZ1RvcC5yZXBsYWNlKCdweCcsICcnKSlcbiAgICAgICAgLSBwYXJzZUludChtYWluTmF2U3R5bGVzLnBhZGRpbmdCb3R0b20ucmVwbGFjZSgncHgnLCAnJykpXG4gICAgICAgIC0gcGFyc2VJbnQobWFpbk5hdlN0eWxlcy5ib3JkZXJCb3R0b21XaWR0aC5yZXBsYWNlKCdweCcsICcnKSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbGV0IGN1cnJlbnRUb3AgPSAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgICAgIGxldCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5OYXYnKTtcbiAgICAgICAgICAvL2NoZWNrIGlmIHVzZXIgaXMgc2Nyb2xsaW5nIHVwXG4gICAgICAgICAgaWYgKGN1cnJlbnRUb3AgPCBwcmV2aW91c1RvcCkge1xuICAgICAgICAgICAgLy9pZiBzY3JvbGxpbmcgdXAuLi5cbiAgICAgICAgICAgIGlmIChjdXJyZW50VG9wID4gMCAmJiBtYWluTmF2LmNsYXNzTGlzdC5jb250YWlucygnaXMtZml4ZWQnKSkge1xuICAgICAgICAgICAgICBtYWluTmF2LmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1haW5OYXYuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuICAgICAgICAgICAgICBtYWluTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50VG9wID4gcHJldmlvdXNUb3ApIHtcbiAgICAgICAgICAgIC8vaWYgc2Nyb2xsaW5nIGRvd24uLi5cbiAgICAgICAgICAgIG1haW5OYXYuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUb3AgPiBoZWFkZXJIZWlnaHQgJiYgIW1haW5OYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1maXhlZCcpKSB7XG4gICAgICAgICAgICAgIG1haW5OYXYuY2xhc3NMaXN0LmFkZCgnaXMtZml4ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwcmV2aW91c1RvcCA9IGN1cnJlbnRUb3A7XG4gICAgICAgIH0sIHtwYXNzaXZlOiB0cnVlfSk7XG4gIH1cbn0pKCk7XG4iLCIvKlxuICogYmx1ZWltcCBHYWxsZXJ5IFZpZGVvIEZhY3RvcnkgSlNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ibHVlaW1wL0dhbGxlcnlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICd1c2Ugc3RyaWN0J1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIEFNRCBtb2R1bGU6XG4gICAgZGVmaW5lKFsnLi9ibHVlaW1wLWhlbHBlcicsICcuL2JsdWVpbXAtZ2FsbGVyeSddLCBmYWN0b3J5KVxuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsczpcbiAgICBmYWN0b3J5KHdpbmRvdy5ibHVlaW1wLmhlbHBlciB8fCB3aW5kb3cualF1ZXJ5LCB3aW5kb3cuYmx1ZWltcC5HYWxsZXJ5KVxuICB9XG59KShmdW5jdGlvbiAoJCwgR2FsbGVyeSkge1xuICAndXNlIHN0cmljdCdcblxuICB2YXIgZ2FsbGVyeVByb3RvdHlwZSA9IEdhbGxlcnkucHJvdG90eXBlXG5cbiAgJC5leHRlbmQoZ2FsbGVyeVByb3RvdHlwZS5vcHRpb25zLCB7XG4gICAgLy8gVGhlIGNsYXNzIGZvciB2aWRlbyBjb250ZW50IGVsZW1lbnRzOlxuICAgIHZpZGVvQ29udGVudENsYXNzOiAndmlkZW8tY29udGVudCcsXG4gICAgLy8gVGhlIGNsYXNzIGZvciB2aWRlbyB3aGVuIGl0IGlzIGxvYWRpbmc6XG4gICAgdmlkZW9Mb2FkaW5nQ2xhc3M6ICd2aWRlby1sb2FkaW5nJyxcbiAgICAvLyBUaGUgY2xhc3MgZm9yIHZpZGVvIHdoZW4gaXQgaXMgcGxheWluZzpcbiAgICB2aWRlb1BsYXlpbmdDbGFzczogJ3ZpZGVvLXBsYXlpbmcnLFxuICAgIC8vIFRoZSBjbGFzcyBmb3IgdmlkZW8gY29udGVudCBkaXNwbGF5ZWQgaW4gYW4gaWZyYW1lOlxuICAgIHZpZGVvSWZyYW1lQ2xhc3M6ICd2aWRlby1pZnJhbWUnLFxuICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIHZpZGVvIGNvdmVyIGVsZW1lbnQ6XG4gICAgdmlkZW9Db3ZlckNsYXNzOiAndmlkZW8tY292ZXInLFxuICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIHZpZGVvIHBsYXkgY29udHJvbDpcbiAgICB2aWRlb1BsYXlDbGFzczogJ3ZpZGVvLXBsYXknLFxuICAgIC8vIFBsYXkgdmlkZW9zIGlubGluZSBieSBkZWZhdWx0OlxuICAgIHZpZGVvUGxheXNJbmxpbmU6IHRydWUsXG4gICAgLy8gVGhlIGxpc3Qgb2JqZWN0IHByb3BlcnR5IChvciBkYXRhIGF0dHJpYnV0ZSkgZm9yIHZpZGVvIHByZWxvYWQ6XG4gICAgdmlkZW9QcmVsb2FkUHJvcGVydHk6ICdwcmVsb2FkJyxcbiAgICAvLyBUaGUgbGlzdCBvYmplY3QgcHJvcGVydHkgKG9yIGRhdGEgYXR0cmlidXRlKSBmb3IgdGhlIHZpZGVvIHBvc3RlciBVUkw6XG4gICAgdmlkZW9Qb3N0ZXJQcm9wZXJ0eTogJ3Bvc3RlcidcbiAgfSlcblxuICB2YXIgaGFuZGxlU2xpZGUgPSBnYWxsZXJ5UHJvdG90eXBlLmhhbmRsZVNsaWRlXG5cbiAgJC5leHRlbmQoZ2FsbGVyeVByb3RvdHlwZSwge1xuICAgIGhhbmRsZVNsaWRlOiBmdW5jdGlvbiAob2xkSW5kZXgsIG5ld0luZGV4KSB7XG4gICAgICBoYW5kbGVTbGlkZS5jYWxsKHRoaXMsIG9sZEluZGV4LCBuZXdJbmRleClcbiAgICAgIHRoaXMuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVZpZGVvKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmVWaWRlby5wYXVzZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIHZpZGVvRmFjdG9yeTogZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2ssIHZpZGVvSW50ZXJmYWNlKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zXG4gICAgICB2YXIgdmlkZW9Db250YWluZXJOb2RlID0gdGhpcy5lbGVtZW50UHJvdG90eXBlLmNsb25lTm9kZShmYWxzZSlcbiAgICAgIHZhciB2aWRlb0NvbnRhaW5lciA9ICQodmlkZW9Db250YWluZXJOb2RlKVxuICAgICAgdmFyIGVycm9yQXJncyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGFyZ2V0OiB2aWRlb0NvbnRhaW5lck5vZGVcbiAgICAgICAgfVxuICAgICAgXVxuICAgICAgdmFyIHZpZGVvID0gdmlkZW9JbnRlcmZhY2UgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxuICAgICAgdmFyIGNvdmVyRWxlbWVudCA9IHRoaXMuZWxlbWVudFByb3RvdHlwZS5jbG9uZU5vZGUoZmFsc2UpXG4gICAgICB2YXIgcGxheUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICAgIHZhciB1cmwgPSB0aGlzLmdldEl0ZW1Qcm9wZXJ0eShvYmosIG9wdGlvbnMudXJsUHJvcGVydHkpXG4gICAgICB2YXIgc291cmNlcyA9IHRoaXMuZ2V0SXRlbVByb3BlcnR5KG9iaiwgb3B0aW9ucy5zb3VyY2VzUHJvcGVydHkpXG4gICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldEl0ZW1Qcm9wZXJ0eShvYmosIG9wdGlvbnMudGl0bGVQcm9wZXJ0eSlcbiAgICAgIHZhciBwb3N0ZXJVcmwgPSB0aGlzLmdldEl0ZW1Qcm9wZXJ0eShvYmosIG9wdGlvbnMudmlkZW9Qb3N0ZXJQcm9wZXJ0eSlcbiAgICAgIHZhciBwbGF5Q29udHJvbHMgPSBbcGxheUVsZW1lbnRdXG4gICAgICB2YXIgaGFzR2FsbGVyeUNvbnRyb2xzXG4gICAgICB2YXIgaXNMb2FkaW5nXG4gICAgICB2YXIgaVxuICAgICAgdmlkZW9Db250YWluZXIuYWRkQ2xhc3Mob3B0aW9ucy52aWRlb0NvbnRlbnRDbGFzcylcbiAgICAgICQocGxheUVsZW1lbnQpLmFkZENsYXNzKG9wdGlvbnMudmlkZW9QbGF5Q2xhc3MpXG4gICAgICBpZiAoXG4gICAgICAgICEkKGNvdmVyRWxlbWVudClcbiAgICAgICAgICAuYWRkQ2xhc3Mob3B0aW9ucy52aWRlb0NvdmVyQ2xhc3MpXG4gICAgICAgICAgLmhhc0NsYXNzKG9wdGlvbnMudG9nZ2xlQ2xhc3MpXG4gICAgICApIHtcbiAgICAgICAgcGxheUNvbnRyb2xzLnB1c2goY292ZXJFbGVtZW50KVxuICAgICAgfVxuICAgICAgY292ZXJFbGVtZW50LmRyYWdnYWJsZSA9IGZhbHNlXG4gICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgdmlkZW9Db250YWluZXJOb2RlLnRpdGxlID0gdGl0bGVcbiAgICAgICAgcGxheUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGl0bGUpXG4gICAgICB9XG4gICAgICBpZiAocG9zdGVyVXJsKSB7XG4gICAgICAgIC8vIFNldCBhcyBiYWNrZ3JvdW5kIGltYWdlIGluc3RlYWQgb2YgYXMgcG9zdGVyIHZpZGVvIGVsZW1lbnQgcHJvcGVydHk6XG4gICAgICAgIC8vIC0gSXMgYWNjZXNzaWJsZSBmb3IgYnJvd3NlcnMgdGhhdCBkbyBub3Qgc3VwcG9ydCB0aGUgdmlkZW8gZWxlbWVudFxuICAgICAgICAvLyAtIElzIGFjY2Vzc2libGUgZm9yIGJvdGggdmlkZW8gZWxlbWVudCBhbmQgaWZyYW1lIHZpZGVvIHBsYXllcnNcbiAgICAgICAgLy8gLSBBdm9pZHMgdmlzdWFsIGFydGlmYWN0cyBpbiBJRSB3aXRoIHRoZSBwb3N0ZXIgcHJvcGVydHkgc2V0XG4gICAgICAgIGNvdmVyRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiJyArIHBvc3RlclVybCArICdcIiknXG4gICAgICB9XG4gICAgICBpZiAodmlkZW8uc2V0QXR0cmlidXRlKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnZpZGVvUGxheXNJbmxpbmUpIHZpZGVvLnNldEF0dHJpYnV0ZSgncGxheXNpbmxpbmUnLCAnJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZGVvQ29udGFpbmVyLmFkZENsYXNzKG9wdGlvbnMudmlkZW9JZnJhbWVDbGFzcylcbiAgICAgIH1cbiAgICAgIHZpZGVvLnByZWxvYWQgPVxuICAgICAgICB0aGlzLmdldEl0ZW1Qcm9wZXJ0eShvYmosIG9wdGlvbnMudmlkZW9QcmVsb2FkUHJvcGVydHkpIHx8ICdub25lJ1xuICAgICAgaWYgKHRoaXMuc3VwcG9ydC5zb3VyY2UgJiYgc291cmNlcykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIHZpZGVvLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgJC5leHRlbmQodGhpcy5zb3VyY2VQcm90b3R5cGUuY2xvbmVOb2RlKGZhbHNlKSwgc291cmNlc1tpXSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh1cmwpIHZpZGVvLnNyYyA9IHVybFxuICAgICAgcGxheUVsZW1lbnQuaHJlZiA9IHVybCB8fCAoc291cmNlcyAmJiBzb3VyY2VzLmxlbmd0aCAmJiBzb3VyY2VzWzBdLnNyYylcbiAgICAgIGlmICh2aWRlby5wbGF5ICYmIHZpZGVvLnBhdXNlKSB7XG4gICAgICAgIDsodmlkZW9JbnRlcmZhY2UgfHwgJCh2aWRlbykpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuc2V0VGltZW91dChjYWxsYmFjaywgZXJyb3JBcmdzKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdwYXVzZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh2aWRlby5zZWVraW5nKSByZXR1cm5cbiAgICAgICAgICAgIGlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICAgICB2aWRlb0NvbnRhaW5lclxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3ModGhhdC5vcHRpb25zLnZpZGVvTG9hZGluZ0NsYXNzKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3ModGhhdC5vcHRpb25zLnZpZGVvUGxheWluZ0NsYXNzKVxuICAgICAgICAgICAgaWYgKGhhc0dhbGxlcnlDb250cm9scykge1xuICAgICAgICAgICAgICB0aGF0LmNvbnRhaW5lci5hZGRDbGFzcyh0aGF0Lm9wdGlvbnMuY29udHJvbHNDbGFzcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpZGVvLmNvbnRyb2xzID0gZmFsc2VcbiAgICAgICAgICAgIGlmICh2aWRlbyA9PT0gdGhhdC5hY3RpdmVWaWRlbykgZGVsZXRlIHRoYXQuYWN0aXZlVmlkZW9cbiAgICAgICAgICAgIGlmICh0aGF0LmludGVydmFsKSB7XG4gICAgICAgICAgICAgIC8vIENvbnRpbnVlIHNsaWRlc2hvdyBpbnRlcnZhbFxuICAgICAgICAgICAgICB0aGF0LnBsYXkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdwbGF5aW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgICAgICAgIGNvdmVyRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJylcbiAgICAgICAgICAgIHZpZGVvQ29udGFpbmVyXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyh0aGF0Lm9wdGlvbnMudmlkZW9Mb2FkaW5nQ2xhc3MpXG4gICAgICAgICAgICAgIC5hZGRDbGFzcyh0aGF0Lm9wdGlvbnMudmlkZW9QbGF5aW5nQ2xhc3MpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ3BsYXknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBDbGVhciBzbGlkZXNob3cgdGltZW91dDpcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhhdC50aW1lb3V0KVxuICAgICAgICAgICAgaXNMb2FkaW5nID0gdHJ1ZVxuICAgICAgICAgICAgdmlkZW9Db250YWluZXIuYWRkQ2xhc3ModGhhdC5vcHRpb25zLnZpZGVvTG9hZGluZ0NsYXNzKVxuICAgICAgICAgICAgaWYgKHRoYXQuY29udGFpbmVyLmhhc0NsYXNzKHRoYXQub3B0aW9ucy5jb250cm9sc0NsYXNzKSkge1xuICAgICAgICAgICAgICBoYXNHYWxsZXJ5Q29udHJvbHMgPSB0cnVlXG4gICAgICAgICAgICAgIHRoYXQuY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoYXQub3B0aW9ucy5jb250cm9sc0NsYXNzKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaGFzR2FsbGVyeUNvbnRyb2xzID0gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpZGVvLmNvbnRyb2xzID0gdHJ1ZVxuICAgICAgICAgICAgdGhhdC5hY3RpdmVWaWRlbyA9IHZpZGVvXG4gICAgICAgICAgfSlcbiAgICAgICAgJChwbGF5Q29udHJvbHMpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIHRoYXQucHJldmVudERlZmF1bHQoZXZlbnQpXG4gICAgICAgICAgdGhhdC5hY3RpdmVWaWRlbyA9IHZpZGVvXG4gICAgICAgICAgaWYgKGlzTG9hZGluZykge1xuICAgICAgICAgICAgdmlkZW8ucGF1c2UoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWRlby5wbGF5KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHZpZGVvQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAodmlkZW9JbnRlcmZhY2UgJiYgdmlkZW9JbnRlcmZhY2UuZWxlbWVudCkgfHwgdmlkZW9cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgdmlkZW9Db250YWluZXJOb2RlLmFwcGVuZENoaWxkKGNvdmVyRWxlbWVudClcbiAgICAgIHZpZGVvQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZChwbGF5RWxlbWVudClcbiAgICAgIHRoaXMuc2V0VGltZW91dChjYWxsYmFjaywgW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2xvYWQnLFxuICAgICAgICAgIHRhcmdldDogdmlkZW9Db250YWluZXJOb2RlXG4gICAgICAgIH1cbiAgICAgIF0pXG4gICAgICByZXR1cm4gdmlkZW9Db250YWluZXJOb2RlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBHYWxsZXJ5XG59KVxuIiwiLypcbiAqIGJsdWVpbXAgR2FsbGVyeSBKU1xuICogaHR0cHM6Ly9naXRodWIuY29tL2JsdWVpbXAvR2FsbGVyeVxuICpcbiAqIENvcHlyaWdodCAyMDEzLCBTZWJhc3RpYW4gVHNjaGFuXG4gKiBodHRwczovL2JsdWVpbXAubmV0XG4gKlxuICogU3dpcGUgaW1wbGVtZW50YXRpb24gYmFzZWQgb25cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9icmFkYmlyZHNhbGwvU3dpcGVcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2U6XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICovXG5cbi8qIGdsb2JhbCBkZWZpbmUsIERvY3VtZW50VG91Y2ggKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cblxuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAndXNlIHN0cmljdCdcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBBTUQgbW9kdWxlOlxuICAgIGRlZmluZShbJy4vYmx1ZWltcC1oZWxwZXInXSwgZmFjdG9yeSlcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHM6XG4gICAgd2luZG93LmJsdWVpbXAgPSB3aW5kb3cuYmx1ZWltcCB8fCB7fVxuICAgIHdpbmRvdy5ibHVlaW1wLkdhbGxlcnkgPSBmYWN0b3J5KHdpbmRvdy5ibHVlaW1wLmhlbHBlciB8fCB3aW5kb3cualF1ZXJ5KVxuICB9XG59KShmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCdcblxuICAvKipcbiAgICogR2FsbGVyeSBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtBcnJheXxOb2RlTGlzdH0gbGlzdCBHYWxsZXJ5IGNvbnRlbnRcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBHYWxsZXJ5IG9wdGlvbnNcbiAgICogQHJldHVybnMge29iamVjdH0gR2FsbGVyeSBvYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIEdhbGxlcnkobGlzdCwgb3B0aW9ucykge1xuICAgIGlmIChkb2N1bWVudC5ib2R5LnN0eWxlLm1heEhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLm1heEhlaWdodCBpcyB1bmRlZmluZWQgb24gSUU2IGFuZCBsb3dlclxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgaWYgKCF0aGlzIHx8IHRoaXMub3B0aW9ucyAhPT0gR2FsbGVyeS5wcm90b3R5cGUub3B0aW9ucykge1xuICAgICAgLy8gQ2FsbGVkIGFzIGZ1bmN0aW9uIGluc3RlYWQgb2YgYXMgY29uc3RydWN0b3IsXG4gICAgICAvLyBzbyB3ZSBzaW1wbHkgcmV0dXJuIGEgbmV3IGluc3RhbmNlOlxuICAgICAgcmV0dXJuIG5ldyBHYWxsZXJ5KGxpc3QsIG9wdGlvbnMpXG4gICAgfVxuICAgIGlmICghbGlzdCB8fCAhbGlzdC5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY29uc29sZS5sb2coXG4gICAgICAgICdibHVlaW1wIEdhbGxlcnk6IE5vIG9yIGVtcHR5IGxpc3QgcHJvdmlkZWQgYXMgZmlyc3QgYXJndW1lbnQuJyxcbiAgICAgICAgbGlzdFxuICAgICAgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMubGlzdCA9IGxpc3RcbiAgICB0aGlzLm51bSA9IGxpc3QubGVuZ3RoXG4gICAgdGhpcy5pbml0T3B0aW9ucyhvcHRpb25zKVxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpXG4gIH1cblxuICAkLmV4dGVuZChHYWxsZXJ5LnByb3RvdHlwZSwge1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIC8vIFRoZSBJZCwgZWxlbWVudCBvciBxdWVyeVNlbGVjdG9yIG9mIHRoZSBnYWxsZXJ5IHdpZGdldDpcbiAgICAgIGNvbnRhaW5lcjogJyNibHVlaW1wLWdhbGxlcnknLFxuICAgICAgLy8gVGhlIHRhZyBuYW1lLCBJZCwgZWxlbWVudCBvciBxdWVyeVNlbGVjdG9yIG9mIHRoZSBzbGlkZXMgY29udGFpbmVyOlxuICAgICAgc2xpZGVzQ29udGFpbmVyOiAnZGl2JyxcbiAgICAgIC8vIFRoZSB0YWcgbmFtZSwgSWQsIGVsZW1lbnQgb3IgcXVlcnlTZWxlY3RvciBvZiB0aGUgdGl0bGUgZWxlbWVudDpcbiAgICAgIHRpdGxlRWxlbWVudDogJ2gzJyxcbiAgICAgIC8vIFRoZSBjbGFzcyB0byBhZGQgd2hlbiB0aGUgZ2FsbGVyeSBpcyB2aXNpYmxlOlxuICAgICAgZGlzcGxheUNsYXNzOiAnYmx1ZWltcC1nYWxsZXJ5LWRpc3BsYXknLFxuICAgICAgLy8gVGhlIGNsYXNzIHRvIGFkZCB3aGVuIHRoZSBnYWxsZXJ5IGNvbnRyb2xzIGFyZSB2aXNpYmxlOlxuICAgICAgY29udHJvbHNDbGFzczogJ2JsdWVpbXAtZ2FsbGVyeS1jb250cm9scycsXG4gICAgICAvLyBUaGUgY2xhc3MgdG8gYWRkIHdoZW4gdGhlIGdhbGxlcnkgb25seSBkaXNwbGF5cyBvbmUgZWxlbWVudDpcbiAgICAgIHNpbmdsZUNsYXNzOiAnYmx1ZWltcC1nYWxsZXJ5LXNpbmdsZScsXG4gICAgICAvLyBUaGUgY2xhc3MgdG8gYWRkIHdoZW4gdGhlIGxlZnQgZWRnZSBoYXMgYmVlbiByZWFjaGVkOlxuICAgICAgbGVmdEVkZ2VDbGFzczogJ2JsdWVpbXAtZ2FsbGVyeS1sZWZ0JyxcbiAgICAgIC8vIFRoZSBjbGFzcyB0byBhZGQgd2hlbiB0aGUgcmlnaHQgZWRnZSBoYXMgYmVlbiByZWFjaGVkOlxuICAgICAgcmlnaHRFZGdlQ2xhc3M6ICdibHVlaW1wLWdhbGxlcnktcmlnaHQnLFxuICAgICAgLy8gVGhlIGNsYXNzIHRvIGFkZCB3aGVuIHRoZSBhdXRvbWF0aWMgc2xpZGVzaG93IGlzIGFjdGl2ZTpcbiAgICAgIHBsYXlpbmdDbGFzczogJ2JsdWVpbXAtZ2FsbGVyeS1wbGF5aW5nJyxcbiAgICAgIC8vIFRoZSBjbGFzcyB0byBhZGQgd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyBTVkcgYXMgaW1nIChvciBiYWNrZ3JvdW5kKTpcbiAgICAgIHN2Z2FzaW1nQ2xhc3M6ICdibHVlaW1wLWdhbGxlcnktc3ZnYXNpbWcnLFxuICAgICAgLy8gVGhlIGNsYXNzIHRvIGFkZCB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIFNNSUwgKGFuaW1hdGVkIFNWR3MpOlxuICAgICAgc21pbENsYXNzOiAnYmx1ZWltcC1nYWxsZXJ5LXNtaWwnLFxuICAgICAgLy8gVGhlIGNsYXNzIGZvciBhbGwgc2xpZGVzOlxuICAgICAgc2xpZGVDbGFzczogJ3NsaWRlJyxcbiAgICAgIC8vIFRoZSBzbGlkZSBjbGFzcyBmb3IgdGhlIGFjdGl2ZSAoY3VycmVudCBpbmRleCkgc2xpZGU6XG4gICAgICBzbGlkZUFjdGl2ZUNsYXNzOiAnc2xpZGUtYWN0aXZlJyxcbiAgICAgIC8vIFRoZSBzbGlkZSBjbGFzcyBmb3IgdGhlIHByZXZpb3VzIChiZWZvcmUgY3VycmVudCBpbmRleCkgc2xpZGU6XG4gICAgICBzbGlkZVByZXZDbGFzczogJ3NsaWRlLXByZXYnLFxuICAgICAgLy8gVGhlIHNsaWRlIGNsYXNzIGZvciB0aGUgbmV4dCAoYWZ0ZXIgY3VycmVudCBpbmRleCkgc2xpZGU6XG4gICAgICBzbGlkZU5leHRDbGFzczogJ3NsaWRlLW5leHQnLFxuICAgICAgLy8gVGhlIHNsaWRlIGNsYXNzIGZvciBsb2FkaW5nIGVsZW1lbnRzOlxuICAgICAgc2xpZGVMb2FkaW5nQ2xhc3M6ICdzbGlkZS1sb2FkaW5nJyxcbiAgICAgIC8vIFRoZSBzbGlkZSBjbGFzcyBmb3IgZWxlbWVudHMgdGhhdCBmYWlsZWQgdG8gbG9hZDpcbiAgICAgIHNsaWRlRXJyb3JDbGFzczogJ3NsaWRlLWVycm9yJyxcbiAgICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIGNvbnRlbnQgZWxlbWVudCBsb2FkZWQgaW50byBlYWNoIHNsaWRlOlxuICAgICAgc2xpZGVDb250ZW50Q2xhc3M6ICdzbGlkZS1jb250ZW50JyxcbiAgICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIFwidG9nZ2xlXCIgY29udHJvbDpcbiAgICAgIHRvZ2dsZUNsYXNzOiAndG9nZ2xlJyxcbiAgICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIFwicHJldlwiIGNvbnRyb2w6XG4gICAgICBwcmV2Q2xhc3M6ICdwcmV2JyxcbiAgICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIFwibmV4dFwiIGNvbnRyb2w6XG4gICAgICBuZXh0Q2xhc3M6ICduZXh0JyxcbiAgICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIFwiY2xvc2VcIiBjb250cm9sOlxuICAgICAgY2xvc2VDbGFzczogJ2Nsb3NlJyxcbiAgICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIFwicGxheS1wYXVzZVwiIHRvZ2dsZSBjb250cm9sOlxuICAgICAgcGxheVBhdXNlQ2xhc3M6ICdwbGF5LXBhdXNlJyxcbiAgICAgIC8vIFRoZSBsaXN0IG9iamVjdCBwcm9wZXJ0eSAob3IgZGF0YSBhdHRyaWJ1dGUpIHdpdGggdGhlIG9iamVjdCB0eXBlOlxuICAgICAgdHlwZVByb3BlcnR5OiAndHlwZScsXG4gICAgICAvLyBUaGUgbGlzdCBvYmplY3QgcHJvcGVydHkgKG9yIGRhdGEgYXR0cmlidXRlKSB3aXRoIHRoZSBvYmplY3QgdGl0bGU6XG4gICAgICB0aXRsZVByb3BlcnR5OiAndGl0bGUnLFxuICAgICAgLy8gVGhlIGxpc3Qgb2JqZWN0IHByb3BlcnR5IChvciBkYXRhIGF0dHJpYnV0ZSkgd2l0aCB0aGUgb2JqZWN0IGFsdCB0ZXh0OlxuICAgICAgYWx0VGV4dFByb3BlcnR5OiAnYWx0JyxcbiAgICAgIC8vIFRoZSBsaXN0IG9iamVjdCBwcm9wZXJ0eSAob3IgZGF0YSBhdHRyaWJ1dGUpIHdpdGggdGhlIG9iamVjdCBVUkw6XG4gICAgICB1cmxQcm9wZXJ0eTogJ2hyZWYnLFxuICAgICAgLy8gVGhlIGxpc3Qgb2JqZWN0IHByb3BlcnR5IChvciBkYXRhIGF0dHJpYnV0ZSkgd2l0aCB0aGUgb2JqZWN0IHNyY3NldDpcbiAgICAgIHNyY3NldFByb3BlcnR5OiAnc3Jjc2V0JyxcbiAgICAgIC8vIFRoZSBsaXN0IG9iamVjdCBwcm9wZXJ0eSAob3IgZGF0YSBhdHRyaWJ1dGUpIHdpdGggdGhlIG9iamVjdCBzaXplczpcbiAgICAgIHNpemVzUHJvcGVydHk6ICdzaXplcycsXG4gICAgICAvLyBUaGUgbGlzdCBvYmplY3QgcHJvcGVydHkgKG9yIGRhdGEgYXR0cmlidXRlKSB3aXRoIHRoZSBvYmplY3Qgc291cmNlczpcbiAgICAgIHNvdXJjZXNQcm9wZXJ0eTogJ3NvdXJjZXMnLFxuICAgICAgLy8gVGhlIGdhbGxlcnkgbGlzdGVucyBmb3IgdHJhbnNpdGlvbmVuZCBldmVudHMgYmVmb3JlIHRyaWdnZXJpbmcgdGhlXG4gICAgICAvLyBvcGVuZWQgYW5kIGNsb3NlZCBldmVudHMsIHVubGVzcyB0aGUgZm9sbG93aW5nIG9wdGlvbiBpcyBzZXQgdG8gZmFsc2U6XG4gICAgICBkaXNwbGF5VHJhbnNpdGlvbjogdHJ1ZSxcbiAgICAgIC8vIERlZmluZXMgaWYgdGhlIGdhbGxlcnkgc2xpZGVzIGFyZSBjbGVhcmVkIGZyb20gdGhlIGdhbGxlcnkgbW9kYWwsXG4gICAgICAvLyBvciByZXVzZWQgZm9yIHRoZSBuZXh0IGdhbGxlcnkgaW5pdGlhbGl6YXRpb246XG4gICAgICBjbGVhclNsaWRlczogdHJ1ZSxcbiAgICAgIC8vIFRvZ2dsZSB0aGUgY29udHJvbHMgb24gcHJlc3NpbmcgdGhlIEVudGVyIGtleTpcbiAgICAgIHRvZ2dsZUNvbnRyb2xzT25FbnRlcjogdHJ1ZSxcbiAgICAgIC8vIFRvZ2dsZSB0aGUgY29udHJvbHMgb24gc2xpZGUgY2xpY2s6XG4gICAgICB0b2dnbGVDb250cm9sc09uU2xpZGVDbGljazogdHJ1ZSxcbiAgICAgIC8vIFRvZ2dsZSB0aGUgYXV0b21hdGljIHNsaWRlc2hvdyBpbnRlcnZhbCBvbiBwcmVzc2luZyB0aGUgU3BhY2Uga2V5OlxuICAgICAgdG9nZ2xlU2xpZGVzaG93T25TcGFjZTogdHJ1ZSxcbiAgICAgIC8vIE5hdmlnYXRlIHRoZSBnYWxsZXJ5IGJ5IHByZXNzaW5nIHRoZSBBcnJvd0xlZnQgYW5kIEFycm93UmlnaHQga2V5czpcbiAgICAgIGVuYWJsZUtleWJvYXJkTmF2aWdhdGlvbjogdHJ1ZSxcbiAgICAgIC8vIENsb3NlIHRoZSBnYWxsZXJ5IG9uIHByZXNzaW5nIHRoZSBFc2NhcGUga2V5OlxuICAgICAgY2xvc2VPbkVzY2FwZTogdHJ1ZSxcbiAgICAgIC8vIENsb3NlIHRoZSBnYWxsZXJ5IHdoZW4gY2xpY2tpbmcgb24gYW4gZW1wdHkgc2xpZGUgYXJlYTpcbiAgICAgIGNsb3NlT25TbGlkZUNsaWNrOiB0cnVlLFxuICAgICAgLy8gQ2xvc2UgdGhlIGdhbGxlcnkgYnkgc3dpcGluZyB1cCBvciBkb3duOlxuICAgICAgY2xvc2VPblN3aXBlVXBPckRvd246IHRydWUsXG4gICAgICAvLyBDbG9zZSB0aGUgZ2FsbGVyeSB3aGVuIHRoZSBVUkwgaGFzaCBjaGFuZ2VzOlxuICAgICAgY2xvc2VPbkhhc2hDaGFuZ2U6IHRydWUsXG4gICAgICAvLyBFbXVsYXRlIHRvdWNoIGV2ZW50cyBvbiBtb3VzZS1wb2ludGVyIGRldmljZXMgc3VjaCBhcyBkZXNrdG9wIGJyb3dzZXJzOlxuICAgICAgZW11bGF0ZVRvdWNoRXZlbnRzOiB0cnVlLFxuICAgICAgLy8gU3RvcCB0b3VjaCBldmVudHMgZnJvbSBidWJibGluZyB1cCB0byBhbmNlc3RvciBlbGVtZW50cyBvZiB0aGUgR2FsbGVyeTpcbiAgICAgIHN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uOiBmYWxzZSxcbiAgICAgIC8vIEhpZGUgdGhlIHBhZ2Ugc2Nyb2xsYmFyczpcbiAgICAgIGhpZGVQYWdlU2Nyb2xsYmFyczogdHJ1ZSxcbiAgICAgIC8vIFN0b3BzIGFueSB0b3VjaGVzIG9uIHRoZSBjb250YWluZXIgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2U6XG4gICAgICBkaXNhYmxlU2Nyb2xsOiB0cnVlLFxuICAgICAgLy8gQ2Fyb3VzZWwgbW9kZSAoc2hvcnRjdXQgZm9yIGNhcm91c2VsIHNwZWNpZmljIG9wdGlvbnMpOlxuICAgICAgY2Fyb3VzZWw6IGZhbHNlLFxuICAgICAgLy8gQWxsb3cgY29udGludW91cyBuYXZpZ2F0aW9uLCBtb3ZpbmcgZnJvbSBsYXN0IHRvIGZpcnN0XG4gICAgICAvLyBhbmQgZnJvbSBmaXJzdCB0byBsYXN0IHNsaWRlOlxuICAgICAgY29udGludW91czogdHJ1ZSxcbiAgICAgIC8vIFJlbW92ZSBlbGVtZW50cyBvdXRzaWRlIG9mIHRoZSBwcmVsb2FkIHJhbmdlIGZyb20gdGhlIERPTTpcbiAgICAgIHVubG9hZEVsZW1lbnRzOiB0cnVlLFxuICAgICAgLy8gU3RhcnQgd2l0aCB0aGUgYXV0b21hdGljIHNsaWRlc2hvdzpcbiAgICAgIHN0YXJ0U2xpZGVzaG93OiBmYWxzZSxcbiAgICAgIC8vIERlbGF5IGluIG1pbGxpc2Vjb25kcyBiZXR3ZWVuIHNsaWRlcyBmb3IgdGhlIGF1dG9tYXRpYyBzbGlkZXNob3c6XG4gICAgICBzbGlkZXNob3dJbnRlcnZhbDogNTAwMCxcbiAgICAgIC8vIFRoZSBkaXJlY3Rpb24gdGhlIHNsaWRlcyBhcmUgbW92aW5nOiBsdHI9TGVmdFRvUmlnaHQgb3IgcnRsPVJpZ2h0VG9MZWZ0XG4gICAgICBzbGlkZXNob3dEaXJlY3Rpb246ICdsdHInLFxuICAgICAgLy8gVGhlIHN0YXJ0aW5nIGluZGV4IGFzIGludGVnZXIuXG4gICAgICAvLyBDYW4gYWxzbyBiZSBhbiBvYmplY3Qgb2YgdGhlIGdpdmVuIGxpc3QsXG4gICAgICAvLyBvciBhbiBlcXVhbCBvYmplY3Qgd2l0aCB0aGUgc2FtZSB1cmwgcHJvcGVydHk6XG4gICAgICBpbmRleDogMCxcbiAgICAgIC8vIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gbG9hZCBhcm91bmQgdGhlIGN1cnJlbnQgaW5kZXg6XG4gICAgICBwcmVsb2FkUmFuZ2U6IDIsXG4gICAgICAvLyBUaGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBiZXR3ZWVuIHNsaWRlIGNoYW5nZXMgaW4gbWlsbGlzZWNvbmRzOlxuICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAzMDAsXG4gICAgICAvLyBUaGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBmb3IgYXV0b21hdGljIHNsaWRlIGNoYW5nZXMsIHNldCB0byBhbiBpbnRlZ2VyXG4gICAgICAvLyBncmVhdGVyIDAgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgdHJhbnNpdGlvbiBkdXJhdGlvbjpcbiAgICAgIHNsaWRlc2hvd1RyYW5zaXRpb25EdXJhdGlvbjogNTAwLFxuICAgICAgLy8gVGhlIGV2ZW50IG9iamVjdCBmb3Igd2hpY2ggdGhlIGRlZmF1bHQgYWN0aW9uIHdpbGwgYmUgY2FuY2VsZWRcbiAgICAgIC8vIG9uIEdhbGxlcnkgaW5pdGlhbGl6YXRpb24gKGUuZy4gdGhlIGNsaWNrIGV2ZW50IHRvIG9wZW4gdGhlIEdhbGxlcnkpOlxuICAgICAgZXZlbnQ6IHVuZGVmaW5lZCxcbiAgICAgIC8vIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIEdhbGxlcnkgaXMgaW5pdGlhbGl6ZWQuXG4gICAgICAvLyBJcyBjYWxsZWQgd2l0aCB0aGUgZ2FsbGVyeSBpbnN0YW5jZSBhcyBcInRoaXNcIiBvYmplY3Q6XG4gICAgICBvbm9wZW46IHVuZGVmaW5lZCxcbiAgICAgIC8vIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIEdhbGxlcnkgaGFzIGJlZW4gaW5pdGlhbGl6ZWRcbiAgICAgIC8vIGFuZCB0aGUgaW5pdGlhbGl6YXRpb24gdHJhbnNpdGlvbiBoYXMgYmVlbiBjb21wbGV0ZWQuXG4gICAgICAvLyBJcyBjYWxsZWQgd2l0aCB0aGUgZ2FsbGVyeSBpbnN0YW5jZSBhcyBcInRoaXNcIiBvYmplY3Q6XG4gICAgICBvbm9wZW5lZDogdW5kZWZpbmVkLFxuICAgICAgLy8gQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgb24gc2xpZGUgY2hhbmdlLlxuICAgICAgLy8gSXMgY2FsbGVkIHdpdGggdGhlIGdhbGxlcnkgaW5zdGFuY2UgYXMgXCJ0aGlzXCIgb2JqZWN0IGFuZCB0aGVcbiAgICAgIC8vIGN1cnJlbnQgaW5kZXggYW5kIHNsaWRlIGFzIGFyZ3VtZW50czpcbiAgICAgIG9uc2xpZGU6IHVuZGVmaW5lZCxcbiAgICAgIC8vIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIGFmdGVyIHRoZSBzbGlkZSBjaGFuZ2UgdHJhbnNpdGlvbi5cbiAgICAgIC8vIElzIGNhbGxlZCB3aXRoIHRoZSBnYWxsZXJ5IGluc3RhbmNlIGFzIFwidGhpc1wiIG9iamVjdCBhbmQgdGhlXG4gICAgICAvLyBjdXJyZW50IGluZGV4IGFuZCBzbGlkZSBhcyBhcmd1bWVudHM6XG4gICAgICBvbnNsaWRlZW5kOiB1bmRlZmluZWQsXG4gICAgICAvLyBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCBvbiBzbGlkZSBjb250ZW50IGxvYWQuXG4gICAgICAvLyBJcyBjYWxsZWQgd2l0aCB0aGUgZ2FsbGVyeSBpbnN0YW5jZSBhcyBcInRoaXNcIiBvYmplY3QgYW5kIHRoZVxuICAgICAgLy8gc2xpZGUgaW5kZXggYW5kIHNsaWRlIGVsZW1lbnQgYXMgYXJndW1lbnRzOlxuICAgICAgb25zbGlkZWNvbXBsZXRlOiB1bmRlZmluZWQsXG4gICAgICAvLyBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBHYWxsZXJ5IGlzIGFib3V0IHRvIGJlIGNsb3NlZC5cbiAgICAgIC8vIElzIGNhbGxlZCB3aXRoIHRoZSBnYWxsZXJ5IGluc3RhbmNlIGFzIFwidGhpc1wiIG9iamVjdDpcbiAgICAgIG9uY2xvc2U6IHVuZGVmaW5lZCxcbiAgICAgIC8vIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIEdhbGxlcnkgaGFzIGJlZW4gY2xvc2VkXG4gICAgICAvLyBhbmQgdGhlIGNsb3NpbmcgdHJhbnNpdGlvbiBoYXMgYmVlbiBjb21wbGV0ZWQuXG4gICAgICAvLyBJcyBjYWxsZWQgd2l0aCB0aGUgZ2FsbGVyeSBpbnN0YW5jZSBhcyBcInRoaXNcIiBvYmplY3Q6XG4gICAgICBvbmNsb3NlZDogdW5kZWZpbmVkXG4gICAgfSxcblxuICAgIGNhcm91c2VsT3B0aW9uczoge1xuICAgICAgaGlkZVBhZ2VTY3JvbGxiYXJzOiBmYWxzZSxcbiAgICAgIHRvZ2dsZUNvbnRyb2xzT25FbnRlcjogZmFsc2UsXG4gICAgICB0b2dnbGVTbGlkZXNob3dPblNwYWNlOiBmYWxzZSxcbiAgICAgIGVuYWJsZUtleWJvYXJkTmF2aWdhdGlvbjogZmFsc2UsXG4gICAgICBjbG9zZU9uRXNjYXBlOiBmYWxzZSxcbiAgICAgIGNsb3NlT25TbGlkZUNsaWNrOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Td2lwZVVwT3JEb3duOiBmYWxzZSxcbiAgICAgIGNsb3NlT25IYXNoQ2hhbmdlOiBmYWxzZSxcbiAgICAgIGRpc2FibGVTY3JvbGw6IGZhbHNlLFxuICAgICAgc3RhcnRTbGlkZXNob3c6IHRydWVcbiAgICB9LFxuXG4gICAgY29uc29sZTpcbiAgICAgIHdpbmRvdy5jb25zb2xlICYmIHR5cGVvZiB3aW5kb3cuY29uc29sZS5sb2cgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB3aW5kb3cuY29uc29sZVxuICAgICAgICA6IHsgbG9nOiBmdW5jdGlvbiAoKSB7fSB9LFxuXG4gICAgLy8gRGV0ZWN0IHRvdWNoLCB0cmFuc2l0aW9uLCB0cmFuc2Zvcm0gYW5kIGJhY2tncm91bmQtc2l6ZSBzdXBwb3J0OlxuICAgIHN1cHBvcnQ6IChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgdmFyIHN1cHBvcnQgPSB7XG4gICAgICAgIHNvdXJjZTogISF3aW5kb3cuSFRNTFNvdXJjZUVsZW1lbnQsXG4gICAgICAgIHBpY3R1cmU6ICEhd2luZG93LkhUTUxQaWN0dXJlRWxlbWVudCxcbiAgICAgICAgc3ZnYXNpbWc6IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoXG4gICAgICAgICAgJ2h0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjSW1hZ2UnLFxuICAgICAgICAgICcxLjEnXG4gICAgICAgICksXG4gICAgICAgIHNtaWw6XG4gICAgICAgICAgISFkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiZcbiAgICAgICAgICAvU1ZHQW5pbWF0ZS8udGVzdChcbiAgICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAgIC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2FuaW1hdGUnKVxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICksXG4gICAgICAgIHRvdWNoOlxuICAgICAgICAgIHdpbmRvdy5vbnRvdWNoc3RhcnQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICh3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gpXG4gICAgICB9XG4gICAgICB2YXIgdHJhbnNpdGlvbnMgPSB7XG4gICAgICAgIHdlYmtpdFRyYW5zaXRpb246IHtcbiAgICAgICAgICBlbmQ6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICBwcmVmaXg6ICctd2Via2l0LSdcbiAgICAgICAgfSxcbiAgICAgICAgTW96VHJhbnNpdGlvbjoge1xuICAgICAgICAgIGVuZDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgIHByZWZpeDogJy1tb3otJ1xuICAgICAgICB9LFxuICAgICAgICBPVHJhbnNpdGlvbjoge1xuICAgICAgICAgIGVuZDogJ290cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICBwcmVmaXg6ICctby0nXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICBlbmQ6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICBwcmVmaXg6ICcnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBwcm9wXG4gICAgICBmb3IgKHByb3AgaW4gdHJhbnNpdGlvbnMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0cmFuc2l0aW9ucywgcHJvcCkgJiZcbiAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BdICE9PSB1bmRlZmluZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgc3VwcG9ydC50cmFuc2l0aW9uID0gdHJhbnNpdGlvbnNbcHJvcF1cbiAgICAgICAgICBzdXBwb3J0LnRyYW5zaXRpb24ubmFtZSA9IHByb3BcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFRlc3RzIGJyb3dzZXIgc3VwcG9ydFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBlbGVtZW50VGVzdHMoKSB7XG4gICAgICAgIHZhciB0cmFuc2l0aW9uID0gc3VwcG9ydC50cmFuc2l0aW9uXG4gICAgICAgIHZhciBwcm9wXG4gICAgICAgIHZhciB0cmFuc2xhdGVaXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgICBwcm9wID0gdHJhbnNpdGlvbi5uYW1lLnNsaWNlKDAsIC05KSArICdyYW5zZm9ybSdcbiAgICAgICAgICBpZiAoZWxlbWVudC5zdHlsZVtwcm9wXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gJ3RyYW5zbGF0ZVooMCknXG4gICAgICAgICAgICB0cmFuc2xhdGVaID0gd2luZG93XG4gICAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXG4gICAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKHRyYW5zaXRpb24ucHJlZml4ICsgJ3RyYW5zZm9ybScpXG4gICAgICAgICAgICBzdXBwb3J0LnRyYW5zZm9ybSA9IHtcbiAgICAgICAgICAgICAgcHJlZml4OiB0cmFuc2l0aW9uLnByZWZpeCxcbiAgICAgICAgICAgICAgbmFtZTogcHJvcCxcbiAgICAgICAgICAgICAgdHJhbnNsYXRlOiB0cnVlLFxuICAgICAgICAgICAgICB0cmFuc2xhdGVaOiAhIXRyYW5zbGF0ZVogJiYgdHJhbnNsYXRlWiAhPT0gJ25vbmUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudClcbiAgICAgIH1cbiAgICAgIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgIGVsZW1lbnRUZXN0cygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKGRvY3VtZW50KS5vbignRE9NQ29udGVudExvYWRlZCcsIGVsZW1lbnRUZXN0cylcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBwb3J0XG4gICAgICAvLyBUZXN0IGVsZW1lbnQsIGhhcyB0byBiZSBzdGFuZGFyZCBIVE1MIGFuZCBtdXN0IG5vdCBiZSBoaWRkZW5cbiAgICAgIC8vIGZvciB0aGUgQ1NTMyB0ZXN0cyB1c2luZyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSB0byBiZSBhcHBsaWNhYmxlOlxuICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKSxcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZTpcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXG5cbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZTpcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgd2luZG93LndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUsXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmluaXRTdGFydEluZGV4KClcbiAgICAgIGlmICh0aGlzLmluaXRXaWRnZXQoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLmluaXRFdmVudExpc3RlbmVycygpXG4gICAgICAvLyBMb2FkIHRoZSBzbGlkZSBhdCB0aGUgZ2l2ZW4gaW5kZXg6XG4gICAgICB0aGlzLm9uc2xpZGUodGhpcy5pbmRleClcbiAgICAgIC8vIE1hbnVhbGx5IHRyaWdnZXIgdGhlIHNsaWRlZW5kIGV2ZW50IGZvciB0aGUgaW5pdGlhbCBzbGlkZTpcbiAgICAgIHRoaXMub250cmFuc2l0aW9uZW5kKClcbiAgICAgIC8vIFN0YXJ0IHRoZSBhdXRvbWF0aWMgc2xpZGVzaG93IGlmIGFwcGxpY2FibGU6XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0YXJ0U2xpZGVzaG93KSB7XG4gICAgICAgIHRoaXMucGxheSgpXG4gICAgICB9XG4gICAgfSxcblxuICAgIHNsaWRlOiBmdW5jdGlvbiAodG8sIGR1cmF0aW9uKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhcbiAgICAgIHZhciBkaXJlY3Rpb25cbiAgICAgIHZhciBuYXR1cmFsRGlyZWN0aW9uXG4gICAgICB2YXIgZGlmZlxuICAgICAgaWYgKGluZGV4ID09PSB0byB8fCB0aGlzLm51bSA9PT0gMSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmICghZHVyYXRpb24pIHtcbiAgICAgICAgZHVyYXRpb24gPSB0aGlzLm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdXBwb3J0LnRyYW5zZm9ybSkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5jb250aW51b3VzKSB7XG4gICAgICAgICAgdG8gPSB0aGlzLmNpcmNsZSh0bylcbiAgICAgICAgfVxuICAgICAgICAvLyAxOiBiYWNrd2FyZCwgLTE6IGZvcndhcmQ6XG4gICAgICAgIGRpcmVjdGlvbiA9IE1hdGguYWJzKGluZGV4IC0gdG8pIC8gKGluZGV4IC0gdG8pXG4gICAgICAgIC8vIEdldCB0aGUgYWN0dWFsIHBvc2l0aW9uIG9mIHRoZSBzbGlkZTpcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb250aW51b3VzKSB7XG4gICAgICAgICAgbmF0dXJhbERpcmVjdGlvbiA9IGRpcmVjdGlvblxuICAgICAgICAgIGRpcmVjdGlvbiA9IC10aGlzLnBvc2l0aW9uc1t0aGlzLmNpcmNsZSh0byldIC8gdGhpcy5zbGlkZVdpZHRoXG4gICAgICAgICAgLy8gSWYgZ29pbmcgZm9yd2FyZCBidXQgdG8gPCBpbmRleCwgdXNlIHRvID0gc2xpZGVzLmxlbmd0aCArIHRvXG4gICAgICAgICAgLy8gSWYgZ29pbmcgYmFja3dhcmQgYnV0IHRvID4gaW5kZXgsIHVzZSB0byA9IC1zbGlkZXMubGVuZ3RoICsgdG9cbiAgICAgICAgICBpZiAoZGlyZWN0aW9uICE9PSBuYXR1cmFsRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICB0byA9IC1kaXJlY3Rpb24gKiB0aGlzLm51bSArIHRvXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRpZmYgPSBNYXRoLmFicyhpbmRleCAtIHRvKSAtIDFcbiAgICAgICAgLy8gTW92ZSBhbGwgdGhlIHNsaWRlcyBiZXR3ZWVuIGluZGV4IGFuZCB0byBpbiB0aGUgcmlnaHQgZGlyZWN0aW9uOlxuICAgICAgICB3aGlsZSAoZGlmZikge1xuICAgICAgICAgIGRpZmYgLT0gMVxuICAgICAgICAgIHRoaXMubW92ZShcbiAgICAgICAgICAgIHRoaXMuY2lyY2xlKCh0byA+IGluZGV4ID8gdG8gOiBpbmRleCkgLSBkaWZmIC0gMSksXG4gICAgICAgICAgICB0aGlzLnNsaWRlV2lkdGggKiBkaXJlY3Rpb24sXG4gICAgICAgICAgICAwXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHRvID0gdGhpcy5jaXJjbGUodG8pXG4gICAgICAgIHRoaXMubW92ZShpbmRleCwgdGhpcy5zbGlkZVdpZHRoICogZGlyZWN0aW9uLCBkdXJhdGlvbilcbiAgICAgICAgdGhpcy5tb3ZlKHRvLCAwLCBkdXJhdGlvbilcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb250aW51b3VzKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlKFxuICAgICAgICAgICAgdGhpcy5jaXJjbGUodG8gLSBkaXJlY3Rpb24pLFxuICAgICAgICAgICAgLSh0aGlzLnNsaWRlV2lkdGggKiBkaXJlY3Rpb24pLFxuICAgICAgICAgICAgMFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG8gPSB0aGlzLmNpcmNsZSh0bylcbiAgICAgICAgdGhpcy5hbmltYXRlKGluZGV4ICogLXRoaXMuc2xpZGVXaWR0aCwgdG8gKiAtdGhpcy5zbGlkZVdpZHRoLCBkdXJhdGlvbilcbiAgICAgIH1cbiAgICAgIHRoaXMub25zbGlkZSh0bylcbiAgICB9LFxuXG4gICAgZ2V0SW5kZXg6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4XG4gICAgfSxcblxuICAgIGdldE51bWJlcjogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMubnVtXG4gICAgfSxcblxuICAgIHByZXY6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGludW91cyB8fCB0aGlzLmluZGV4KSB7XG4gICAgICAgIHRoaXMuc2xpZGUodGhpcy5pbmRleCAtIDEpXG4gICAgICB9XG4gICAgfSxcblxuICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGludW91cyB8fCB0aGlzLmluZGV4IDwgdGhpcy5udW0gLSAxKSB7XG4gICAgICAgIHRoaXMuc2xpZGUodGhpcy5pbmRleCArIDEpXG4gICAgICB9XG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgIHZhciBuZXh0SW5kZXggPVxuICAgICAgICB0aGlzLmluZGV4ICsgKHRoaXMub3B0aW9ucy5zbGlkZXNob3dEaXJlY3Rpb24gPT09ICdydGwnID8gLTEgOiAxKVxuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgICB0aGlzLmludGVydmFsID0gdGltZSB8fCB0aGlzLm9wdGlvbnMuc2xpZGVzaG93SW50ZXJ2YWxcbiAgICAgIGlmICh0aGlzLmVsZW1lbnRzW3RoaXMuaW5kZXhdID4gMSkge1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSB0aGlzLnNldFRpbWVvdXQoXG4gICAgICAgICAgKCF0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB0aGlzLnNsaWRlKSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKHRvLCBkdXJhdGlvbikge1xuICAgICAgICAgICAgICB0aGF0LmFuaW1hdGlvbkZyYW1lSWQgPSB0aGF0LnJlcXVlc3RBbmltYXRpb25GcmFtZS5jYWxsKFxuICAgICAgICAgICAgICAgIHdpbmRvdyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB0aGF0LnNsaWRlKHRvLCBkdXJhdGlvbilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgW25leHRJbmRleCwgdGhpcy5vcHRpb25zLnNsaWRlc2hvd1RyYW5zaXRpb25EdXJhdGlvbl0sXG4gICAgICAgICAgdGhpcy5pbnRlcnZhbFxuICAgICAgICApXG4gICAgICB9XG4gICAgICB0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMucGxheWluZ0NsYXNzKVxuICAgICAgdGhpcy5zbGlkZXNDb250YWluZXJbMF0uc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnb2ZmJylcbiAgICAgIGlmICh0aGlzLnBsYXlQYXVzZUVsZW1lbnQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGxheVBhdXNlRWxlbWVudFswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsICd0cnVlJylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgICAgdGhpcy5pbnRlcnZhbCA9IG51bGxcbiAgICAgIGlmICh0aGlzLmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsQW5pbWF0aW9uRnJhbWUuY2FsbCh3aW5kb3csIHRoaXMuYW5pbWF0aW9uRnJhbWVJZClcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZUlkID0gbnVsbFxuICAgICAgfVxuICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLnBsYXlpbmdDbGFzcylcbiAgICAgIHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpXG4gICAgICBpZiAodGhpcy5wbGF5UGF1c2VFbGVtZW50Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLnBsYXlQYXVzZUVsZW1lbnRbMF0uc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCAnZmFsc2UnKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGQ6IGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICB2YXIgaVxuICAgICAgaWYgKCFsaXN0LmNvbmNhdCkge1xuICAgICAgICAvLyBNYWtlIGEgcmVhbCBhcnJheSBvdXQgb2YgdGhlIGxpc3QgdG8gYWRkOlxuICAgICAgICBsaXN0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobGlzdClcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5saXN0LmNvbmNhdCkge1xuICAgICAgICAvLyBNYWtlIGEgcmVhbCBhcnJheSBvdXQgb2YgdGhlIEdhbGxlcnkgbGlzdDpcbiAgICAgICAgdGhpcy5saXN0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5saXN0KVxuICAgICAgfVxuICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0LmNvbmNhdChsaXN0KVxuICAgICAgdGhpcy5udW0gPSB0aGlzLmxpc3QubGVuZ3RoXG4gICAgICBpZiAodGhpcy5udW0gPiAyICYmIHRoaXMub3B0aW9ucy5jb250aW51b3VzID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5jb250aW51b3VzID0gdHJ1ZVxuICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMubGVmdEVkZ2VDbGFzcylcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGFpbmVyXG4gICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMucmlnaHRFZGdlQ2xhc3MpXG4gICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuc2luZ2xlQ2xhc3MpXG4gICAgICBmb3IgKGkgPSB0aGlzLm51bSAtIGxpc3QubGVuZ3RoOyBpIDwgdGhpcy5udW07IGkgKz0gMSkge1xuICAgICAgICB0aGlzLmFkZFNsaWRlKGkpXG4gICAgICAgIHRoaXMucG9zaXRpb25TbGlkZShpKVxuICAgICAgfVxuICAgICAgdGhpcy5wb3NpdGlvbnMubGVuZ3RoID0gdGhpcy5udW1cbiAgICAgIHRoaXMuaW5pdFNsaWRlcyh0cnVlKVxuICAgIH0sXG5cbiAgICByZXNldFNsaWRlczogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zbGlkZXNDb250YWluZXIuZW1wdHkoKVxuICAgICAgdGhpcy51bmxvYWRBbGxTbGlkZXMoKVxuICAgICAgdGhpcy5zbGlkZXMgPSBbXVxuICAgIH0sXG5cbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcbiAgICAgIHRoaXMuZGVzdHJveUV2ZW50TGlzdGVuZXJzKClcbiAgICAgIC8vIENhbmNlbCB0aGUgc2xpZGVzaG93OlxuICAgICAgdGhpcy5wYXVzZSgpXG4gICAgICB0aGlzLmNvbnRhaW5lclswXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICB0aGlzLmNvbnRhaW5lclxuICAgICAgICAucmVtb3ZlQ2xhc3Mob3B0aW9ucy5kaXNwbGF5Q2xhc3MpXG4gICAgICAgIC5yZW1vdmVDbGFzcyhvcHRpb25zLnNpbmdsZUNsYXNzKVxuICAgICAgICAucmVtb3ZlQ2xhc3Mob3B0aW9ucy5sZWZ0RWRnZUNsYXNzKVxuICAgICAgICAucmVtb3ZlQ2xhc3Mob3B0aW9ucy5yaWdodEVkZ2VDbGFzcylcbiAgICAgIGlmIChvcHRpb25zLmhpZGVQYWdlU2Nyb2xsYmFycykge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gdGhpcy5ib2R5T3ZlcmZsb3dTdHlsZVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jbGVhclNsaWRlcykge1xuICAgICAgICB0aGlzLnJlc2V0U2xpZGVzKClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub25jbG9zZWQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uY2xvc2VkLmNhbGwodGhpcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgLyoqXG4gICAgICAgKiBDbG9zZSBoYW5kbGVyXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtldmVudH0gZXZlbnQgQ2xvc2UgZXZlbnRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gY2xvc2VIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoYXQuY29udGFpbmVyWzBdKSB7XG4gICAgICAgICAgdGhhdC5jb250YWluZXIub2ZmKHRoYXQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCwgY2xvc2VIYW5kbGVyKVxuICAgICAgICAgIHRoYXQuaGFuZGxlQ2xvc2UoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm9uY2xvc2UpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uY2xvc2UuY2FsbCh0aGlzKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMub3B0aW9ucy5kaXNwbGF5VHJhbnNpdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5vbih0aGlzLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGNsb3NlSGFuZGxlcilcbiAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmRpc3BsYXlDbGFzcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjaXJjbGU6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgLy8gQWx3YXlzIHJldHVybiBhIG51bWJlciBpbnNpZGUgb2YgdGhlIHNsaWRlcyBpbmRleCByYW5nZTpcbiAgICAgIHJldHVybiAodGhpcy5udW0gKyAoaW5kZXggJSB0aGlzLm51bSkpICUgdGhpcy5udW1cbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24gKGluZGV4LCBkaXN0LCBkdXJhdGlvbikge1xuICAgICAgdGhpcy50cmFuc2xhdGVYKGluZGV4LCBkaXN0LCBkdXJhdGlvbilcbiAgICAgIHRoaXMucG9zaXRpb25zW2luZGV4XSA9IGRpc3RcbiAgICB9LFxuXG4gICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAoaW5kZXgsIHgsIHksIGR1cmF0aW9uKSB7XG4gICAgICBpZiAoIXRoaXMuc2xpZGVzW2luZGV4XSkgcmV0dXJuXG4gICAgICB2YXIgc3R5bGUgPSB0aGlzLnNsaWRlc1tpbmRleF0uc3R5bGVcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcy5zdXBwb3J0LnRyYW5zaXRpb25cbiAgICAgIHZhciB0cmFuc2Zvcm0gPSB0aGlzLnN1cHBvcnQudHJhbnNmb3JtXG4gICAgICBzdHlsZVt0cmFuc2l0aW9uLm5hbWUgKyAnRHVyYXRpb24nXSA9IGR1cmF0aW9uICsgJ21zJ1xuICAgICAgc3R5bGVbdHJhbnNmb3JtLm5hbWVdID1cbiAgICAgICAgJ3RyYW5zbGF0ZSgnICtcbiAgICAgICAgeCArXG4gICAgICAgICdweCwgJyArXG4gICAgICAgIHkgK1xuICAgICAgICAncHgpJyArXG4gICAgICAgICh0cmFuc2Zvcm0udHJhbnNsYXRlWiA/ICcgdHJhbnNsYXRlWigwKScgOiAnJylcbiAgICB9LFxuXG4gICAgdHJhbnNsYXRlWDogZnVuY3Rpb24gKGluZGV4LCB4LCBkdXJhdGlvbikge1xuICAgICAgdGhpcy50cmFuc2xhdGUoaW5kZXgsIHgsIDAsIGR1cmF0aW9uKVxuICAgIH0sXG5cbiAgICB0cmFuc2xhdGVZOiBmdW5jdGlvbiAoaW5kZXgsIHksIGR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZShpbmRleCwgMCwgeSwgZHVyYXRpb24pXG4gICAgfSxcblxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uIChmcm9tLCB0bywgZHVyYXRpb24pIHtcbiAgICAgIGlmICghZHVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5zbGlkZXNDb250YWluZXJbMF0uc3R5bGUubGVmdCA9IHRvICsgJ3B4J1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgIHZhciB0aW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aW1lRWxhcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRcbiAgICAgICAgaWYgKHRpbWVFbGFwID4gZHVyYXRpb24pIHtcbiAgICAgICAgICB0aGF0LnNsaWRlc0NvbnRhaW5lclswXS5zdHlsZS5sZWZ0ID0gdG8gKyAncHgnXG4gICAgICAgICAgdGhhdC5vbnRyYW5zaXRpb25lbmQoKVxuICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRpbWVyKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoYXQuc2xpZGVzQ29udGFpbmVyWzBdLnN0eWxlLmxlZnQgPVxuICAgICAgICAgICh0byAtIGZyb20pICogKE1hdGguZmxvb3IoKHRpbWVFbGFwIC8gZHVyYXRpb24pICogMTAwKSAvIDEwMCkgK1xuICAgICAgICAgIGZyb20gK1xuICAgICAgICAgICdweCdcbiAgICAgIH0sIDQpXG4gICAgfSxcblxuICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlXG4gICAgICB9XG4gICAgfSxcblxuICAgIG9ucmVzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmluaXRTbGlkZXModHJ1ZSlcbiAgICB9LFxuXG4gICAgb25oYXNoY2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNsb3NlT25IYXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbm1vdXNlZG93bjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAvLyBUcmlnZ2VyIG9uIGNsaWNrcyBvZiB0aGUgbGVmdCBtb3VzZSBidXR0b24gb25seVxuICAgICAgLy8gYW5kIGV4Y2x1ZGUgdmlkZW8gJiBhdWRpbyBlbGVtZW50czpcbiAgICAgIGlmIChcbiAgICAgICAgZXZlbnQud2hpY2ggJiZcbiAgICAgICAgZXZlbnQud2hpY2ggPT09IDEgJiZcbiAgICAgICAgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnVklERU8nICYmXG4gICAgICAgIGV2ZW50LnRhcmdldC5ub2RlTmFtZSAhPT0gJ0FVRElPJ1xuICAgICAgKSB7XG4gICAgICAgIC8vIFByZXZlbnRpbmcgdGhlIGRlZmF1bHQgbW91c2Vkb3duIGFjdGlvbiBpcyByZXF1aXJlZFxuICAgICAgICAvLyB0byBtYWtlIHRvdWNoIGVtdWxhdGlvbiB3b3JrIHdpdGggRmlyZWZveDpcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICA7KGV2ZW50Lm9yaWdpbmFsRXZlbnQgfHwgZXZlbnQpLnRvdWNoZXMgPSBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGFnZVg6IGV2ZW50LnBhZ2VYLFxuICAgICAgICAgICAgcGFnZVk6IGV2ZW50LnBhZ2VZXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICAgIHRoaXMub250b3VjaHN0YXJ0KGV2ZW50KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbm1vdXNlbW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAodGhpcy50b3VjaFN0YXJ0KSB7XG4gICAgICAgIDsoZXZlbnQub3JpZ2luYWxFdmVudCB8fCBldmVudCkudG91Y2hlcyA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYWdlWDogZXZlbnQucGFnZVgsXG4gICAgICAgICAgICBwYWdlWTogZXZlbnQucGFnZVlcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgICAgdGhpcy5vbnRvdWNobW92ZShldmVudClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb25tb3VzZXVwOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLnRvdWNoU3RhcnQpIHtcbiAgICAgICAgdGhpcy5vbnRvdWNoZW5kKGV2ZW50KVxuICAgICAgICBkZWxldGUgdGhpcy50b3VjaFN0YXJ0XG4gICAgICB9XG4gICAgfSxcblxuICAgIG9ubW91c2VvdXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKHRoaXMudG91Y2hTdGFydCkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gICAgICAgIHZhciByZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldFxuICAgICAgICBpZiAoIXJlbGF0ZWQgfHwgKHJlbGF0ZWQgIT09IHRhcmdldCAmJiAhJC5jb250YWlucyh0YXJnZXQsIHJlbGF0ZWQpKSkge1xuICAgICAgICAgIHRoaXMub25tb3VzZXVwKGV2ZW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIG9udG91Y2hzdGFydDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uKGV2ZW50KVxuICAgICAgfVxuICAgICAgLy8galF1ZXJ5IGRvZXNuJ3QgY29weSB0b3VjaCBldmVudCBwcm9wZXJ0aWVzIGJ5IGRlZmF1bHQsXG4gICAgICAvLyBzbyB3ZSBoYXZlIHRvIGFjY2VzcyB0aGUgb3JpZ2luYWxFdmVudCBvYmplY3Q6XG4gICAgICB2YXIgdG91Y2ggPSAoZXZlbnQub3JpZ2luYWxFdmVudCB8fCBldmVudCkudG91Y2hlc1swXVxuICAgICAgdGhpcy50b3VjaFN0YXJ0ID0ge1xuICAgICAgICAvLyBSZW1lbWJlciB0aGUgaW5pdGlhbCB0b3VjaCBjb29yZGluYXRlczpcbiAgICAgICAgeDogdG91Y2gucGFnZVgsXG4gICAgICAgIHk6IHRvdWNoLnBhZ2VZLFxuICAgICAgICAvLyBTdG9yZSB0aGUgdGltZSB0byBkZXRlcm1pbmUgdG91Y2ggZHVyYXRpb246XG4gICAgICAgIHRpbWU6IERhdGUubm93KClcbiAgICAgIH1cbiAgICAgIC8vIEhlbHBlciB2YXJpYWJsZSB0byBkZXRlY3Qgc2Nyb2xsIG1vdmVtZW50OlxuICAgICAgdGhpcy5pc1Njcm9sbGluZyA9IHVuZGVmaW5lZFxuICAgICAgLy8gUmVzZXQgZGVsdGEgdmFsdWVzOlxuICAgICAgdGhpcy50b3VjaERlbHRhID0ge31cbiAgICB9LFxuXG4gICAgb250b3VjaG1vdmU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wVG91Y2hFdmVudHNQcm9wYWdhdGlvbikge1xuICAgICAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbihldmVudClcbiAgICAgIH1cbiAgICAgIC8vIGpRdWVyeSBkb2Vzbid0IGNvcHkgdG91Y2ggZXZlbnQgcHJvcGVydGllcyBieSBkZWZhdWx0LFxuICAgICAgLy8gc28gd2UgaGF2ZSB0byBhY2Nlc3MgdGhlIG9yaWdpbmFsRXZlbnQgb2JqZWN0OlxuICAgICAgdmFyIHRvdWNoZXMgPSAoZXZlbnQub3JpZ2luYWxFdmVudCB8fCBldmVudCkudG91Y2hlc1xuICAgICAgdmFyIHRvdWNoID0gdG91Y2hlc1swXVxuICAgICAgdmFyIHNjYWxlID0gKGV2ZW50Lm9yaWdpbmFsRXZlbnQgfHwgZXZlbnQpLnNjYWxlXG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4XG4gICAgICB2YXIgdG91Y2hEZWx0YVhcbiAgICAgIHZhciBpbmRpY2VzXG4gICAgICAvLyBFbnN1cmUgdGhpcyBpcyBhIG9uZSB0b3VjaCBzd2lwZSBhbmQgbm90LCBlLmcuIGEgcGluY2g6XG4gICAgICBpZiAodG91Y2hlcy5sZW5ndGggPiAxIHx8IChzY2FsZSAmJiBzY2FsZSAhPT0gMSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVTY3JvbGwpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgfVxuICAgICAgLy8gTWVhc3VyZSBjaGFuZ2UgaW4geCBhbmQgeSBjb29yZGluYXRlczpcbiAgICAgIHRoaXMudG91Y2hEZWx0YSA9IHtcbiAgICAgICAgeDogdG91Y2gucGFnZVggLSB0aGlzLnRvdWNoU3RhcnQueCxcbiAgICAgICAgeTogdG91Y2gucGFnZVkgLSB0aGlzLnRvdWNoU3RhcnQueVxuICAgICAgfVxuICAgICAgdG91Y2hEZWx0YVggPSB0aGlzLnRvdWNoRGVsdGEueFxuICAgICAgLy8gRGV0ZWN0IGlmIHRoaXMgaXMgYSB2ZXJ0aWNhbCBzY3JvbGwgbW92ZW1lbnQgKHJ1biBvbmx5IG9uY2UgcGVyIHRvdWNoKTpcbiAgICAgIGlmICh0aGlzLmlzU2Nyb2xsaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5pc1Njcm9sbGluZyA9XG4gICAgICAgICAgdGhpcy5pc1Njcm9sbGluZyB8fFxuICAgICAgICAgIE1hdGguYWJzKHRvdWNoRGVsdGFYKSA8IE1hdGguYWJzKHRoaXMudG91Y2hEZWx0YS55KVxuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlzU2Nyb2xsaW5nKSB7XG4gICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IGhvcml6b250YWwgc2Nyb2xsOlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIC8vIFN0b3AgdGhlIHNsaWRlc2hvdzpcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGludW91cykge1xuICAgICAgICAgIGluZGljZXMgPSBbdGhpcy5jaXJjbGUoaW5kZXggKyAxKSwgaW5kZXgsIHRoaXMuY2lyY2xlKGluZGV4IC0gMSldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSW5jcmVhc2UgcmVzaXN0YW5jZSBpZiBmaXJzdCBzbGlkZSBhbmQgc2xpZGluZyBsZWZ0XG4gICAgICAgICAgLy8gb3IgbGFzdCBzbGlkZSBhbmQgc2xpZGluZyByaWdodDpcbiAgICAgICAgICB0aGlzLnRvdWNoRGVsdGEueCA9IHRvdWNoRGVsdGFYID1cbiAgICAgICAgICAgIHRvdWNoRGVsdGFYIC9cbiAgICAgICAgICAgICgoIWluZGV4ICYmIHRvdWNoRGVsdGFYID4gMCkgfHxcbiAgICAgICAgICAgIChpbmRleCA9PT0gdGhpcy5udW0gLSAxICYmIHRvdWNoRGVsdGFYIDwgMClcbiAgICAgICAgICAgICAgPyBNYXRoLmFicyh0b3VjaERlbHRhWCkgLyB0aGlzLnNsaWRlV2lkdGggKyAxXG4gICAgICAgICAgICAgIDogMSlcbiAgICAgICAgICBpbmRpY2VzID0gW2luZGV4XVxuICAgICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGluZGV4IC0gMSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluZGV4IDwgdGhpcy5udW0gLSAxKSB7XG4gICAgICAgICAgICBpbmRpY2VzLnVuc2hpZnQoaW5kZXggKyAxKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoaW5kaWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICBpbmRleCA9IGluZGljZXMucG9wKClcbiAgICAgICAgICB0aGlzLnRyYW5zbGF0ZVgoaW5kZXgsIHRvdWNoRGVsdGFYICsgdGhpcy5wb3NpdGlvbnNbaW5kZXhdLCAwKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLm9wdGlvbnMuY2Fyb3VzZWwpIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZKGluZGV4LCB0aGlzLnRvdWNoRGVsdGEueSArIHRoaXMucG9zaXRpb25zW2luZGV4XSwgMClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb250b3VjaGVuZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uKGV2ZW50KVxuICAgICAgfVxuICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleFxuICAgICAgdmFyIGFic1RvdWNoRGVsdGFYID0gTWF0aC5hYnModGhpcy50b3VjaERlbHRhLngpXG4gICAgICB2YXIgc2xpZGVXaWR0aCA9IHRoaXMuc2xpZGVXaWR0aFxuICAgICAgdmFyIGR1cmF0aW9uID0gTWF0aC5jZWlsKFxuICAgICAgICAodGhpcy5vcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiAqICgxIC0gYWJzVG91Y2hEZWx0YVggLyBzbGlkZVdpZHRoKSkgL1xuICAgICAgICAgIDJcbiAgICAgIClcbiAgICAgIC8vIERldGVybWluZSBpZiBzbGlkZSBhdHRlbXB0IHRyaWdnZXJzIG5leHQvcHJldiBzbGlkZTpcbiAgICAgIHZhciBpc1ZhbGlkU2xpZGUgPSBhYnNUb3VjaERlbHRhWCA+IDIwXG4gICAgICAvLyBEZXRlcm1pbmUgaWYgc2xpZGUgYXR0ZW1wdCBpcyBwYXN0IHN0YXJ0IG9yIGVuZDpcbiAgICAgIHZhciBpc1Bhc3RCb3VuZHMgPVxuICAgICAgICAoIWluZGV4ICYmIHRoaXMudG91Y2hEZWx0YS54ID4gMCkgfHxcbiAgICAgICAgKGluZGV4ID09PSB0aGlzLm51bSAtIDEgJiYgdGhpcy50b3VjaERlbHRhLnggPCAwKVxuICAgICAgdmFyIGlzVmFsaWRDbG9zZSA9XG4gICAgICAgICFpc1ZhbGlkU2xpZGUgJiZcbiAgICAgICAgdGhpcy5vcHRpb25zLmNsb3NlT25Td2lwZVVwT3JEb3duICYmXG4gICAgICAgIE1hdGguYWJzKHRoaXMudG91Y2hEZWx0YS55KSA+IDIwXG4gICAgICB2YXIgZGlyZWN0aW9uXG4gICAgICB2YXIgaW5kZXhGb3J3YXJkXG4gICAgICB2YXIgaW5kZXhCYWNrd2FyZFxuICAgICAgdmFyIGRpc3RhbmNlRm9yd2FyZFxuICAgICAgdmFyIGRpc3RhbmNlQmFja3dhcmRcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGludW91cykge1xuICAgICAgICBpc1Bhc3RCb3VuZHMgPSBmYWxzZVxuICAgICAgfVxuICAgICAgLy8gRGV0ZXJtaW5lIGRpcmVjdGlvbiBvZiBzd2lwZSAodHJ1ZTogcmlnaHQsIGZhbHNlOiBsZWZ0KTpcbiAgICAgIGRpcmVjdGlvbiA9IHRoaXMudG91Y2hEZWx0YS54IDwgMCA/IC0xIDogMVxuICAgICAgaWYgKCF0aGlzLmlzU2Nyb2xsaW5nKSB7XG4gICAgICAgIGlmIChpc1ZhbGlkU2xpZGUgJiYgIWlzUGFzdEJvdW5kcykge1xuICAgICAgICAgIGluZGV4Rm9yd2FyZCA9IGluZGV4ICsgZGlyZWN0aW9uXG4gICAgICAgICAgaW5kZXhCYWNrd2FyZCA9IGluZGV4IC0gZGlyZWN0aW9uXG4gICAgICAgICAgZGlzdGFuY2VGb3J3YXJkID0gc2xpZGVXaWR0aCAqIGRpcmVjdGlvblxuICAgICAgICAgIGRpc3RhbmNlQmFja3dhcmQgPSAtc2xpZGVXaWR0aCAqIGRpcmVjdGlvblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGludW91cykge1xuICAgICAgICAgICAgdGhpcy5tb3ZlKHRoaXMuY2lyY2xlKGluZGV4Rm9yd2FyZCksIGRpc3RhbmNlRm9yd2FyZCwgMClcbiAgICAgICAgICAgIHRoaXMubW92ZSh0aGlzLmNpcmNsZShpbmRleCAtIDIgKiBkaXJlY3Rpb24pLCBkaXN0YW5jZUJhY2t3YXJkLCAwKVxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXhGb3J3YXJkID49IDAgJiYgaW5kZXhGb3J3YXJkIDwgdGhpcy5udW0pIHtcbiAgICAgICAgICAgIHRoaXMubW92ZShpbmRleEZvcndhcmQsIGRpc3RhbmNlRm9yd2FyZCwgMClcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5tb3ZlKGluZGV4LCB0aGlzLnBvc2l0aW9uc1tpbmRleF0gKyBkaXN0YW5jZUZvcndhcmQsIGR1cmF0aW9uKVxuICAgICAgICAgIHRoaXMubW92ZShcbiAgICAgICAgICAgIHRoaXMuY2lyY2xlKGluZGV4QmFja3dhcmQpLFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbdGhpcy5jaXJjbGUoaW5kZXhCYWNrd2FyZCldICsgZGlzdGFuY2VGb3J3YXJkLFxuICAgICAgICAgICAgZHVyYXRpb25cbiAgICAgICAgICApXG4gICAgICAgICAgaW5kZXggPSB0aGlzLmNpcmNsZShpbmRleEJhY2t3YXJkKVxuICAgICAgICAgIHRoaXMub25zbGlkZShpbmRleClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBNb3ZlIGJhY2sgaW50byBwb3NpdGlvblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGludW91cykge1xuICAgICAgICAgICAgdGhpcy5tb3ZlKHRoaXMuY2lyY2xlKGluZGV4IC0gMSksIC1zbGlkZVdpZHRoLCBkdXJhdGlvbilcbiAgICAgICAgICAgIHRoaXMubW92ZShpbmRleCwgMCwgZHVyYXRpb24pXG4gICAgICAgICAgICB0aGlzLm1vdmUodGhpcy5jaXJjbGUoaW5kZXggKyAxKSwgc2xpZGVXaWR0aCwgZHVyYXRpb24pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgICB0aGlzLm1vdmUoaW5kZXggLSAxLCAtc2xpZGVXaWR0aCwgZHVyYXRpb24pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1vdmUoaW5kZXgsIDAsIGR1cmF0aW9uKVxuICAgICAgICAgICAgaWYgKGluZGV4IDwgdGhpcy5udW0gLSAxKSB7XG4gICAgICAgICAgICAgIHRoaXMubW92ZShpbmRleCArIDEsIHNsaWRlV2lkdGgsIGR1cmF0aW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzVmFsaWRDbG9zZSkge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE1vdmUgYmFjayBpbnRvIHBvc2l0aW9uXG4gICAgICAgICAgdGhpcy50cmFuc2xhdGVZKGluZGV4LCAwLCBkdXJhdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbnRvdWNoY2FuY2VsOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLnRvdWNoU3RhcnQpIHtcbiAgICAgICAgdGhpcy5vbnRvdWNoZW5kKGV2ZW50KVxuICAgICAgICBkZWxldGUgdGhpcy50b3VjaFN0YXJ0XG4gICAgICB9XG4gICAgfSxcblxuICAgIG9udHJhbnNpdGlvbmVuZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgc2xpZGUgPSB0aGlzLnNsaWRlc1t0aGlzLmluZGV4XVxuICAgICAgaWYgKCFldmVudCB8fCBzbGlkZSA9PT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIGlmICh0aGlzLmludGVydmFsKSB7XG4gICAgICAgICAgdGhpcy5wbGF5KClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFRpbWVvdXQodGhpcy5vcHRpb25zLm9uc2xpZGVlbmQsIFt0aGlzLmluZGV4LCBzbGlkZV0pXG4gICAgICB9XG4gICAgfSxcblxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50XG4gICAgICB2YXIgcGFyZW50ID0gdGFyZ2V0ICYmIHRhcmdldC5wYXJlbnROb2RlXG4gICAgICB2YXIgaW5kZXhcbiAgICAgIGlmICghdGFyZ2V0IHx8ICFwYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpbmRleCA9IHRoaXMuZ2V0Tm9kZUluZGV4KHBhcmVudClcbiAgICAgICQocGFyZW50KS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuc2xpZGVMb2FkaW5nQ2xhc3MpXG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAkKHBhcmVudCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnNsaWRlRXJyb3JDbGFzcylcbiAgICAgICAgdGhpcy5lbGVtZW50c1tpbmRleF0gPSAzIC8vIEZhaWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWxlbWVudHNbaW5kZXhdID0gMiAvLyBEb25lXG4gICAgICB9XG4gICAgICAvLyBGaXggZm9yIElFNydzIGxhY2sgb2Ygc3VwcG9ydCBmb3IgcGVyY2VudGFnZSBtYXgtaGVpZ2h0OlxuICAgICAgaWYgKHRhcmdldC5jbGllbnRIZWlnaHQgPiB0aGlzLmNvbnRhaW5lclswXS5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLm1heEhlaWdodCA9IHRoaXMuY29udGFpbmVyWzBdLmNsaWVudEhlaWdodFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaW50ZXJ2YWwgJiYgdGhpcy5zbGlkZXNbdGhpcy5pbmRleF0gPT09IHBhcmVudCkge1xuICAgICAgICB0aGlzLnBsYXkoKVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRUaW1lb3V0KHRoaXMub3B0aW9ucy5vbnNsaWRlY29tcGxldGUsIFtpbmRleCwgcGFyZW50XSlcbiAgICB9LFxuXG4gICAgb25sb2FkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHRoaXMub25jb21wbGV0ZShldmVudClcbiAgICB9LFxuXG4gICAgb25lcnJvcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB0aGlzLm9uY29tcGxldGUoZXZlbnQpXG4gICAgfSxcblxuICAgIG9ua2V5ZG93bjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSAxMzogLy8gRW50ZXJcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZUNvbnRyb2xzT25FbnRlcikge1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdChldmVudClcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlQ29udHJvbHMoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI3OiAvLyBFc2NhcGVcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNsb3NlT25Fc2NhcGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICAgICAgLy8gcHJldmVudCBFc2NhcGUgZnJvbSBjbG9zaW5nIG90aGVyIHRoaW5nc1xuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzMjogLy8gU3BhY2VcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZVNsaWRlc2hvd09uU3BhY2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJldmVudERlZmF1bHQoZXZlbnQpXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVNsaWRlc2hvdygpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzc6IC8vIEFycm93TGVmdFxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5hYmxlS2V5Ym9hcmROYXZpZ2F0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0KGV2ZW50KVxuICAgICAgICAgICAgdGhpcy5wcmV2KClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOTogLy8gQXJyb3dSaWdodFxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5hYmxlS2V5Ym9hcmROYXZpZ2F0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0KGV2ZW50KVxuICAgICAgICAgICAgdGhpcy5uZXh0KClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcbiAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudFxuICAgICAgdmFyIHBhcmVudCA9IHRhcmdldC5wYXJlbnROb2RlXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrcyBpZiB0aGUgdGFyZ2V0IGZyb20gdGhlIGNsb3NlIGhhcyB0aGUgZ2l2ZW4gY2xhc3NcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIG5hbWVcbiAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIHRhcmdldCBoYXMgdGhlIGNsYXNzIG5hbWVcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gaXNUYXJnZXQoY2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiAkKHRhcmdldCkuaGFzQ2xhc3MoY2xhc3NOYW1lKSB8fCAkKHBhcmVudCkuaGFzQ2xhc3MoY2xhc3NOYW1lKVxuICAgICAgfVxuICAgICAgaWYgKGlzVGFyZ2V0KG9wdGlvbnMudG9nZ2xlQ2xhc3MpKSB7XG4gICAgICAgIC8vIENsaWNrIG9uIFwidG9nZ2xlXCIgY29udHJvbFxuICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0KGV2ZW50KVxuICAgICAgICB0aGlzLnRvZ2dsZUNvbnRyb2xzKClcbiAgICAgIH0gZWxzZSBpZiAoaXNUYXJnZXQob3B0aW9ucy5wcmV2Q2xhc3MpKSB7XG4gICAgICAgIC8vIENsaWNrIG9uIFwicHJldlwiIGNvbnRyb2xcbiAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdChldmVudClcbiAgICAgICAgdGhpcy5wcmV2KClcbiAgICAgIH0gZWxzZSBpZiAoaXNUYXJnZXQob3B0aW9ucy5uZXh0Q2xhc3MpKSB7XG4gICAgICAgIC8vIENsaWNrIG9uIFwibmV4dFwiIGNvbnRyb2xcbiAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdChldmVudClcbiAgICAgICAgdGhpcy5uZXh0KClcbiAgICAgIH0gZWxzZSBpZiAoaXNUYXJnZXQob3B0aW9ucy5jbG9zZUNsYXNzKSkge1xuICAgICAgICAvLyBDbGljayBvbiBcImNsb3NlXCIgY29udHJvbFxuICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0KGV2ZW50KVxuICAgICAgICB0aGlzLmNsb3NlKClcbiAgICAgIH0gZWxzZSBpZiAoaXNUYXJnZXQob3B0aW9ucy5wbGF5UGF1c2VDbGFzcykpIHtcbiAgICAgICAgLy8gQ2xpY2sgb24gXCJwbGF5LXBhdXNlXCIgY29udHJvbFxuICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0KGV2ZW50KVxuICAgICAgICB0aGlzLnRvZ2dsZVNsaWRlc2hvdygpXG4gICAgICB9IGVsc2UgaWYgKHBhcmVudCA9PT0gdGhpcy5zbGlkZXNDb250YWluZXJbMF0pIHtcbiAgICAgICAgLy8gQ2xpY2sgb24gc2xpZGUgYmFja2dyb3VuZFxuICAgICAgICBpZiAob3B0aW9ucy5jbG9zZU9uU2xpZGVDbGljaykge1xuICAgICAgICAgIHRoaXMucHJldmVudERlZmF1bHQoZXZlbnQpXG4gICAgICAgICAgdGhpcy5jbG9zZSgpXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy50b2dnbGVDb250cm9sc09uU2xpZGVDbGljaykge1xuICAgICAgICAgIHRoaXMucHJldmVudERlZmF1bHQoZXZlbnQpXG4gICAgICAgICAgdGhpcy50b2dnbGVDb250cm9scygpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHBhcmVudC5wYXJlbnROb2RlICYmXG4gICAgICAgIHBhcmVudC5wYXJlbnROb2RlID09PSB0aGlzLnNsaWRlc0NvbnRhaW5lclswXVxuICAgICAgKSB7XG4gICAgICAgIC8vIENsaWNrIG9uIGRpc3BsYXllZCBlbGVtZW50XG4gICAgICAgIGlmIChvcHRpb25zLnRvZ2dsZUNvbnRyb2xzT25TbGlkZUNsaWNrKSB7XG4gICAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdChldmVudClcbiAgICAgICAgICB0aGlzLnRvZ2dsZUNvbnRyb2xzKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbmNsaWNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5vcHRpb25zLmVtdWxhdGVUb3VjaEV2ZW50cyAmJlxuICAgICAgICB0aGlzLnRvdWNoRGVsdGEgJiZcbiAgICAgICAgKE1hdGguYWJzKHRoaXMudG91Y2hEZWx0YS54KSA+IDIwIHx8IE1hdGguYWJzKHRoaXMudG91Y2hEZWx0YS55KSA+IDIwKVxuICAgICAgKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoRGVsdGFcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVDbGljayhldmVudClcbiAgICB9LFxuXG4gICAgdXBkYXRlRWRnZUNsYXNzZXM6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMubGVmdEVkZ2VDbGFzcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5sZWZ0RWRnZUNsYXNzKVxuICAgICAgfVxuICAgICAgaWYgKGluZGV4ID09PSB0aGlzLm51bSAtIDEpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnJpZ2h0RWRnZUNsYXNzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLnJpZ2h0RWRnZUNsYXNzKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVBY3RpdmVTbGlkZTogZnVuY3Rpb24gKG9sZEluZGV4LCBuZXdJbmRleCkge1xuICAgICAgdmFyIHNsaWRlcyA9IHRoaXMuc2xpZGVzXG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xuICAgICAgdmFyIGxpc3QgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBpbmRleDogbmV3SW5kZXgsXG4gICAgICAgICAgbWV0aG9kOiAnYWRkQ2xhc3MnLFxuICAgICAgICAgIGhpZGRlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGluZGV4OiBvbGRJbmRleCxcbiAgICAgICAgICBtZXRob2Q6ICdyZW1vdmVDbGFzcycsXG4gICAgICAgICAgaGlkZGVuOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICAgIHZhciBpdGVtLCBpbmRleFxuICAgICAgd2hpbGUgKGxpc3QubGVuZ3RoKSB7XG4gICAgICAgIGl0ZW0gPSBsaXN0LnBvcCgpXG4gICAgICAgICQoc2xpZGVzW2l0ZW0uaW5kZXhdKVtpdGVtLm1ldGhvZF0ob3B0aW9ucy5zbGlkZUFjdGl2ZUNsYXNzKVxuICAgICAgICBpbmRleCA9IHRoaXMuY2lyY2xlKGl0ZW0uaW5kZXggLSAxKVxuICAgICAgICBpZiAob3B0aW9ucy5jb250aW51b3VzIHx8IGluZGV4IDwgaXRlbS5pbmRleCkge1xuICAgICAgICAgICQoc2xpZGVzW2luZGV4XSlbaXRlbS5tZXRob2RdKG9wdGlvbnMuc2xpZGVQcmV2Q2xhc3MpXG4gICAgICAgIH1cbiAgICAgICAgaW5kZXggPSB0aGlzLmNpcmNsZShpdGVtLmluZGV4ICsgMSlcbiAgICAgICAgaWYgKG9wdGlvbnMuY29udGludW91cyB8fCBpbmRleCA+IGl0ZW0uaW5kZXgpIHtcbiAgICAgICAgICAkKHNsaWRlc1tpbmRleF0pW2l0ZW0ubWV0aG9kXShvcHRpb25zLnNsaWRlTmV4dENsYXNzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnNsaWRlc1tvbGRJbmRleF0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICAgIHRoaXMuc2xpZGVzW25ld0luZGV4XS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJylcbiAgICB9LFxuXG4gICAgaGFuZGxlU2xpZGU6IGZ1bmN0aW9uIChvbGRJbmRleCwgbmV3SW5kZXgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmNvbnRpbnVvdXMpIHtcbiAgICAgICAgdGhpcy51cGRhdGVFZGdlQ2xhc3NlcyhuZXdJbmRleClcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlQWN0aXZlU2xpZGUob2xkSW5kZXgsIG5ld0luZGV4KVxuICAgICAgdGhpcy5sb2FkRWxlbWVudHMobmV3SW5kZXgpXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVubG9hZEVsZW1lbnRzKSB7XG4gICAgICAgIHRoaXMudW5sb2FkRWxlbWVudHMob2xkSW5kZXgsIG5ld0luZGV4KVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRUaXRsZShuZXdJbmRleClcbiAgICB9LFxuXG4gICAgb25zbGlkZTogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB0aGlzLmhhbmRsZVNsaWRlKHRoaXMuaW5kZXgsIGluZGV4KVxuICAgICAgdGhpcy5pbmRleCA9IGluZGV4XG4gICAgICB0aGlzLnNldFRpbWVvdXQodGhpcy5vcHRpb25zLm9uc2xpZGUsIFtpbmRleCwgdGhpcy5zbGlkZXNbaW5kZXhdXSlcbiAgICB9LFxuXG4gICAgc2V0VGl0bGU6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgdmFyIGZpcnN0Q2hpbGQgPSB0aGlzLnNsaWRlc1tpbmRleF0uZmlyc3RDaGlsZFxuICAgICAgdmFyIHRleHQgPSBmaXJzdENoaWxkLnRpdGxlIHx8IGZpcnN0Q2hpbGQuYWx0XG4gICAgICB2YXIgdGl0bGVFbGVtZW50ID0gdGhpcy50aXRsZUVsZW1lbnRcbiAgICAgIGlmICh0aXRsZUVsZW1lbnQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMudGl0bGVFbGVtZW50LmVtcHR5KClcbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICB0aXRsZUVsZW1lbnRbMF0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0VGltZW91dDogZnVuY3Rpb24gKGZ1bmMsIGFyZ3MsIHdhaXQpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgZnVuYyAmJlxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuYy5hcHBseSh0aGF0LCBhcmdzIHx8IFtdKVxuICAgICAgICB9LCB3YWl0IHx8IDApXG4gICAgICApXG4gICAgfSxcblxuICAgIGltYWdlRmFjdG9yeTogZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgIHZhciB1cmwgPSBvYmpcbiAgICAgIHZhciBpbWcgPSB0aGlzLmltYWdlUHJvdG90eXBlLmNsb25lTm9kZShmYWxzZSlcbiAgICAgIHZhciBwaWN0dXJlXG4gICAgICB2YXIgY2FsbGVkXG4gICAgICB2YXIgc291cmNlc1xuICAgICAgdmFyIHNyY3NldFxuICAgICAgdmFyIHNpemVzXG4gICAgICB2YXIgdGl0bGVcbiAgICAgIHZhciBhbHRUZXh0XG4gICAgICB2YXIgaVxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIHRoZSBsb2FkL2Vycm9yIGV2ZW50XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtldmVudH0gZXZlbnQgbG9hZC9lcnJvciBldmVudFxuICAgICAgICogQHJldHVybnMge251bWJlcn0gdGltZW91dCBJRFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjYWxsYmFja1dyYXBwZXIoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgICBldmVudCA9IHtcbiAgICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXG4gICAgICAgICAgICB0YXJnZXQ6IHBpY3R1cmUgfHwgaW1nXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIC8vIEZpeCBmb3IgYnJvd3NlcnMgKGUuZy4gSUU3KSBmaXJpbmcgdGhlIGxvYWQgZXZlbnQgZm9yXG4gICAgICAgICAgICAvLyBjYWNoZWQgaW1hZ2VzIGJlZm9yZSB0aGUgZWxlbWVudCBjb3VsZFxuICAgICAgICAgICAgLy8gYmUgYWRkZWQgdG8gdGhlIERPTTpcbiAgICAgICAgICAgIHJldHVybiB0aGF0LnNldFRpbWVvdXQoY2FsbGJhY2tXcmFwcGVyLCBbZXZlbnRdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICAgICAgJChpbWcpLm9mZignbG9hZCBlcnJvcicsIGNhbGxiYWNrV3JhcHBlcilcbiAgICAgICAgICBjYWxsYmFjayhldmVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHVybCA9IHRoaXMuZ2V0SXRlbVByb3BlcnR5KG9iaiwgb3B0aW9ucy51cmxQcm9wZXJ0eSlcbiAgICAgICAgc291cmNlcyA9XG4gICAgICAgICAgdGhpcy5zdXBwb3J0LnBpY3R1cmUgJiZcbiAgICAgICAgICB0aGlzLnN1cHBvcnQuc291cmNlICYmXG4gICAgICAgICAgdGhpcy5nZXRJdGVtUHJvcGVydHkob2JqLCBvcHRpb25zLnNvdXJjZXNQcm9wZXJ0eSlcbiAgICAgICAgc3Jjc2V0ID0gdGhpcy5nZXRJdGVtUHJvcGVydHkob2JqLCBvcHRpb25zLnNyY3NldFByb3BlcnR5KVxuICAgICAgICBzaXplcyA9IHRoaXMuZ2V0SXRlbVByb3BlcnR5KG9iaiwgb3B0aW9ucy5zaXplc1Byb3BlcnR5KVxuICAgICAgICB0aXRsZSA9IHRoaXMuZ2V0SXRlbVByb3BlcnR5KG9iaiwgb3B0aW9ucy50aXRsZVByb3BlcnR5KVxuICAgICAgICBhbHRUZXh0ID0gdGhpcy5nZXRJdGVtUHJvcGVydHkob2JqLCBvcHRpb25zLmFsdFRleHRQcm9wZXJ0eSkgfHwgdGl0bGVcbiAgICAgIH1cbiAgICAgIGltZy5kcmFnZ2FibGUgPSBmYWxzZVxuICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIGltZy50aXRsZSA9IHRpdGxlXG4gICAgICB9XG4gICAgICBpZiAoYWx0VGV4dCkge1xuICAgICAgICBpbWcuYWx0ID0gYWx0VGV4dFxuICAgICAgfVxuICAgICAgJChpbWcpLm9uKCdsb2FkIGVycm9yJywgY2FsbGJhY2tXcmFwcGVyKVxuICAgICAgaWYgKHNvdXJjZXMgJiYgc291cmNlcy5sZW5ndGgpIHtcbiAgICAgICAgcGljdHVyZSA9IHRoaXMucGljdHVyZVByb3RvdHlwZS5jbG9uZU5vZGUoZmFsc2UpXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgcGljdHVyZS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICQuZXh0ZW5kKHRoaXMuc291cmNlUHJvdG90eXBlLmNsb25lTm9kZShmYWxzZSksIHNvdXJjZXNbaV0pXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHBpY3R1cmUuYXBwZW5kQ2hpbGQoaW1nKVxuICAgICAgICAkKHBpY3R1cmUpLmFkZENsYXNzKG9wdGlvbnMudG9nZ2xlQ2xhc3MpXG4gICAgICB9XG4gICAgICBpZiAoc3Jjc2V0KSB7XG4gICAgICAgIGlmIChzaXplcykge1xuICAgICAgICAgIGltZy5zaXplcyA9IHNpemVzXG4gICAgICAgIH1cbiAgICAgICAgaW1nLnNyY3NldCA9IHNyY3NldFxuICAgICAgfVxuICAgICAgaW1nLnNyYyA9IHVybFxuICAgICAgaWYgKHBpY3R1cmUpIHJldHVybiBwaWN0dXJlXG4gICAgICByZXR1cm4gaW1nXG4gICAgfSxcblxuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgdHlwZSA9IG9iaiAmJiB0aGlzLmdldEl0ZW1Qcm9wZXJ0eShvYmosIHRoaXMub3B0aW9ucy50eXBlUHJvcGVydHkpXG4gICAgICB2YXIgZmFjdG9yeSA9XG4gICAgICAgICh0eXBlICYmIHRoaXNbdHlwZS5zcGxpdCgnLycpWzBdICsgJ0ZhY3RvcnknXSkgfHwgdGhpcy5pbWFnZUZhY3RvcnlcbiAgICAgIHZhciBlbGVtZW50ID0gb2JqICYmIGZhY3RvcnkuY2FsbCh0aGlzLCBvYmosIGNhbGxiYWNrKVxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRQcm90b3R5cGUuY2xvbmVOb2RlKGZhbHNlKVxuICAgICAgICB0aGlzLnNldFRpbWVvdXQoY2FsbGJhY2ssIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgdGFyZ2V0OiBlbGVtZW50XG4gICAgICAgICAgfVxuICAgICAgICBdKVxuICAgICAgfVxuICAgICAgJChlbGVtZW50KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuc2xpZGVDb250ZW50Q2xhc3MpXG4gICAgICByZXR1cm4gZWxlbWVudFxuICAgIH0sXG5cbiAgICBpdGVyYXRlUHJlbG9hZFJhbmdlOiBmdW5jdGlvbiAoaW5kZXgsIGZ1bmMpIHtcbiAgICAgIHZhciBudW0gPSB0aGlzLm51bVxuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcbiAgICAgIHZhciBsaW1pdCA9IE1hdGgubWluKG51bSwgb3B0aW9ucy5wcmVsb2FkUmFuZ2UgKiAyICsgMSlcbiAgICAgIHZhciBqID0gaW5kZXhcbiAgICAgIHZhciBpXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGltaXQ7IGkgKz0gMSkge1xuICAgICAgICAvLyBGaXJzdCBpdGVyYXRlIHRvIHRoZSBjdXJyZW50IGluZGV4ICgwKSxcbiAgICAgICAgLy8gdGhlbiB0aGUgbmV4dCBvbmUgKCsxKSxcbiAgICAgICAgLy8gdGhlbiB0aGUgcHJldmlvdXMgb25lICgtMSksXG4gICAgICAgIC8vIHRoZW4gdGhlIG5leHQgYWZ0ZXIgbmV4dCAoKzIpLFxuICAgICAgICAvLyB0aGVuIHRoZSBvbmUgYmVmb3JlIHRoZSBwcmV2aW91cyBvbmUgKC0yKSwgZXRjLjpcbiAgICAgICAgaiArPSBpICogKGkgJSAyID09PSAwID8gLTEgOiAxKVxuICAgICAgICBpZiAoaiA8IDAgfHwgaiA+PSBudW0pIHtcbiAgICAgICAgICBpZiAoIW9wdGlvbnMuY29udGludW91cykgY29udGludWVcbiAgICAgICAgICAvLyBDb25uZWN0IHRoZSBlbmRzIG9mIHRoZSBsaXN0IHRvIGxvYWQgc2xpZGUgZWxlbWVudHMgZm9yXG4gICAgICAgICAgLy8gY29udGludW91cyBpdGVyYXRpb246XG4gICAgICAgICAgaiA9IHRoaXMuY2lyY2xlKGopXG4gICAgICAgIH1cbiAgICAgICAgZnVuYy5jYWxsKHRoaXMsIGopXG4gICAgICB9XG4gICAgfSxcblxuICAgIGxvYWRFbGVtZW50OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIGlmICghdGhpcy5lbGVtZW50c1tpbmRleF0pIHtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVzW2luZGV4XS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50c1tpbmRleF0gPSAkKHRoaXMuc2xpZGVzW2luZGV4XSkuaGFzQ2xhc3MoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2xpZGVFcnJvckNsYXNzXG4gICAgICAgICAgKVxuICAgICAgICAgICAgPyAzXG4gICAgICAgICAgICA6IDJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnRzW2luZGV4XSA9IDEgLy8gTG9hZGluZ1xuICAgICAgICAgICQodGhpcy5zbGlkZXNbaW5kZXhdKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuc2xpZGVMb2FkaW5nQ2xhc3MpXG4gICAgICAgICAgdGhpcy5zbGlkZXNbaW5kZXhdLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KHRoaXMubGlzdFtpbmRleF0sIHRoaXMucHJveHlMaXN0ZW5lcilcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbG9hZEVsZW1lbnRzOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHRoaXMuaXRlcmF0ZVByZWxvYWRSYW5nZShpbmRleCwgdGhpcy5sb2FkRWxlbWVudClcbiAgICB9LFxuXG4gICAgdW5sb2FkRWxlbWVudHM6IGZ1bmN0aW9uIChvbGRJbmRleCwgbmV3SW5kZXgpIHtcbiAgICAgIHZhciBwcmVsb2FkUmFuZ2UgPSB0aGlzLm9wdGlvbnMucHJlbG9hZFJhbmdlXG4gICAgICB0aGlzLml0ZXJhdGVQcmVsb2FkUmFuZ2Uob2xkSW5kZXgsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHZhciBkaWZmID0gTWF0aC5hYnMoaSAtIG5ld0luZGV4KVxuICAgICAgICBpZiAoZGlmZiA+IHByZWxvYWRSYW5nZSAmJiBkaWZmICsgcHJlbG9hZFJhbmdlIDwgdGhpcy5udW0pIHtcbiAgICAgICAgICB0aGlzLnVubG9hZFNsaWRlKGkpXG4gICAgICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudHNbaV1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgYWRkU2xpZGU6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgdmFyIHNsaWRlID0gdGhpcy5zbGlkZVByb3RvdHlwZS5jbG9uZU5vZGUoZmFsc2UpXG4gICAgICBzbGlkZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpbmRleClcbiAgICAgIHNsaWRlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpXG4gICAgICB0aGlzLnNsaWRlc0NvbnRhaW5lclswXS5hcHBlbmRDaGlsZChzbGlkZSlcbiAgICAgIHRoaXMuc2xpZGVzLnB1c2goc2xpZGUpXG4gICAgfSxcblxuICAgIHBvc2l0aW9uU2xpZGU6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgdmFyIHNsaWRlID0gdGhpcy5zbGlkZXNbaW5kZXhdXG4gICAgICBzbGlkZS5zdHlsZS53aWR0aCA9IHRoaXMuc2xpZGVXaWR0aCArICdweCdcbiAgICAgIGlmICh0aGlzLnN1cHBvcnQudHJhbnNmb3JtKSB7XG4gICAgICAgIHNsaWRlLnN0eWxlLmxlZnQgPSBpbmRleCAqIC10aGlzLnNsaWRlV2lkdGggKyAncHgnXG4gICAgICAgIHRoaXMubW92ZShcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICB0aGlzLmluZGV4ID4gaW5kZXhcbiAgICAgICAgICAgID8gLXRoaXMuc2xpZGVXaWR0aFxuICAgICAgICAgICAgOiB0aGlzLmluZGV4IDwgaW5kZXhcbiAgICAgICAgICAgID8gdGhpcy5zbGlkZVdpZHRoXG4gICAgICAgICAgICA6IDAsXG4gICAgICAgICAgMFxuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcblxuICAgIGluaXRTbGlkZXM6IGZ1bmN0aW9uIChyZWxvYWQpIHtcbiAgICAgIHZhciBjbGVhclNsaWRlcywgaVxuICAgICAgaWYgKCFyZWxvYWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBbXVxuICAgICAgICB0aGlzLnBvc2l0aW9ucy5sZW5ndGggPSB0aGlzLm51bVxuICAgICAgICB0aGlzLmVsZW1lbnRzID0ge31cbiAgICAgICAgdGhpcy5waWN0dXJlUHJvdG90eXBlID1cbiAgICAgICAgICB0aGlzLnN1cHBvcnQucGljdHVyZSAmJiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwaWN0dXJlJylcbiAgICAgICAgdGhpcy5zb3VyY2VQcm90b3R5cGUgPVxuICAgICAgICAgIHRoaXMuc3VwcG9ydC5zb3VyY2UgJiYgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc291cmNlJylcbiAgICAgICAgdGhpcy5pbWFnZVByb3RvdHlwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgICAgIHRoaXMuZWxlbWVudFByb3RvdHlwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIHRoaXMuc2xpZGVQcm90b3R5cGUgPSB0aGlzLmVsZW1lbnRQcm90b3R5cGUuY2xvbmVOb2RlKGZhbHNlKVxuICAgICAgICAkKHRoaXMuc2xpZGVQcm90b3R5cGUpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5zbGlkZUNsYXNzKVxuICAgICAgICB0aGlzLnNsaWRlcyA9IHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLmNoaWxkcmVuXG4gICAgICAgIGNsZWFyU2xpZGVzID1cbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY2xlYXJTbGlkZXMgfHwgdGhpcy5zbGlkZXMubGVuZ3RoICE9PSB0aGlzLm51bVxuICAgICAgfVxuICAgICAgdGhpcy5zbGlkZVdpZHRoID0gdGhpcy5jb250YWluZXJbMF0uY2xpZW50V2lkdGhcbiAgICAgIHRoaXMuc2xpZGVIZWlnaHQgPSB0aGlzLmNvbnRhaW5lclswXS5jbGllbnRIZWlnaHRcbiAgICAgIHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLnN0eWxlLndpZHRoID0gdGhpcy5udW0gKiB0aGlzLnNsaWRlV2lkdGggKyAncHgnXG4gICAgICBpZiAoY2xlYXJTbGlkZXMpIHtcbiAgICAgICAgdGhpcy5yZXNldFNsaWRlcygpXG4gICAgICB9XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5udW07IGkgKz0gMSkge1xuICAgICAgICBpZiAoY2xlYXJTbGlkZXMpIHtcbiAgICAgICAgICB0aGlzLmFkZFNsaWRlKGkpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3NpdGlvblNsaWRlKGkpXG4gICAgICB9XG4gICAgICAvLyBSZXBvc2l0aW9uIHRoZSBzbGlkZXMgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2l2ZW4gaW5kZXg6XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnRpbnVvdXMgJiYgdGhpcy5zdXBwb3J0LnRyYW5zZm9ybSkge1xuICAgICAgICB0aGlzLm1vdmUodGhpcy5jaXJjbGUodGhpcy5pbmRleCAtIDEpLCAtdGhpcy5zbGlkZVdpZHRoLCAwKVxuICAgICAgICB0aGlzLm1vdmUodGhpcy5jaXJjbGUodGhpcy5pbmRleCArIDEpLCB0aGlzLnNsaWRlV2lkdGgsIDApXG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuc3VwcG9ydC50cmFuc2Zvcm0pIHtcbiAgICAgICAgdGhpcy5zbGlkZXNDb250YWluZXJbMF0uc3R5bGUubGVmdCA9XG4gICAgICAgICAgdGhpcy5pbmRleCAqIC10aGlzLnNsaWRlV2lkdGggKyAncHgnXG4gICAgICB9XG4gICAgfSxcblxuICAgIHVubG9hZFNsaWRlOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHZhciBzbGlkZSwgZmlyc3RDaGlsZFxuICAgICAgc2xpZGUgPSB0aGlzLnNsaWRlc1tpbmRleF1cbiAgICAgIGZpcnN0Q2hpbGQgPSBzbGlkZS5maXJzdENoaWxkXG4gICAgICBpZiAoZmlyc3RDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICBzbGlkZS5yZW1vdmVDaGlsZChmaXJzdENoaWxkKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmxvYWRBbGxTbGlkZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpLCBsZW5cbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHRoaXMuc2xpZGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHRoaXMudW5sb2FkU2xpZGUoaSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9nZ2xlQ29udHJvbHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb250cm9sc0NsYXNzID0gdGhpcy5vcHRpb25zLmNvbnRyb2xzQ2xhc3NcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5oYXNDbGFzcyhjb250cm9sc0NsYXNzKSkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyhjb250cm9sc0NsYXNzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ2xhc3MoY29udHJvbHNDbGFzcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9nZ2xlU2xpZGVzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgICAgdGhpcy5wbGF5KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGF1c2UoKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXROb2RlSW5kZXg6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSwgMTApXG4gICAgfSxcblxuICAgIGdldE5lc3RlZFByb3BlcnR5OiBmdW5jdGlvbiAob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgcHJvcGVydHkucmVwbGFjZShcbiAgICAgICAgLy8gTWF0Y2hlcyBuYXRpdmUgSmF2YVNjcmlwdCBub3RhdGlvbiBpbiBhIFN0cmluZyxcbiAgICAgICAgLy8gZS5nLiAnW1wiZG91YmxlUXVvdGVQcm9wXCJdLmRvdFByb3BbMl0nXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWVzY2FwZVxuICAgICAgICAvXFxbKD86JyhbXiddKyknfFwiKFteXCJdKylcInwoXFxkKykpXFxdfCg/Oig/Ol58XFwuKShbXlxcLlxcW10rKSkvZyxcbiAgICAgICAgZnVuY3Rpb24gKHN0ciwgc2luZ2xlUXVvdGVQcm9wLCBkb3VibGVRdW90ZVByb3AsIGFycmF5SW5kZXgsIGRvdFByb3ApIHtcbiAgICAgICAgICB2YXIgcHJvcCA9XG4gICAgICAgICAgICBkb3RQcm9wIHx8XG4gICAgICAgICAgICBzaW5nbGVRdW90ZVByb3AgfHxcbiAgICAgICAgICAgIGRvdWJsZVF1b3RlUHJvcCB8fFxuICAgICAgICAgICAgKGFycmF5SW5kZXggJiYgcGFyc2VJbnQoYXJyYXlJbmRleCwgMTApKVxuICAgICAgICAgIGlmIChzdHIgJiYgb2JqKSB7XG4gICAgICAgICAgICBvYmogPSBvYmpbcHJvcF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIHJldHVybiBvYmpcbiAgICB9LFxuXG4gICAgZ2V0RGF0YVByb3BlcnR5OiBmdW5jdGlvbiAob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgdmFyIGtleVxuICAgICAgdmFyIHByb3BcbiAgICAgIGlmIChvYmouZGF0YXNldCkge1xuICAgICAgICBrZXkgPSBwcm9wZXJ0eS5yZXBsYWNlKC8tKFthLXpdKS9nLCBmdW5jdGlvbiAoXywgYikge1xuICAgICAgICAgIHJldHVybiBiLnRvVXBwZXJDYXNlKClcbiAgICAgICAgfSlcbiAgICAgICAgcHJvcCA9IG9iai5kYXRhc2V0W2tleV1cbiAgICAgIH0gZWxzZSBpZiAob2JqLmdldEF0dHJpYnV0ZSkge1xuICAgICAgICBwcm9wID0gb2JqLmdldEF0dHJpYnV0ZShcbiAgICAgICAgICAnZGF0YS0nICsgcHJvcGVydHkucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykudG9Mb3dlckNhc2UoKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWVzY2FwZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgL14odHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyhcXC5cXGQrKT98XFx7W1xcc1xcU10qXFx9fFxcW1tcXHNcXFNdKlxcXSkkLy50ZXN0KHByb3ApXG4gICAgICAgICkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJC5wYXJzZUpTT04ocHJvcClcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBKU09OIHBhcnNpbmcgZXJyb3JzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wXG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldEl0ZW1Qcm9wZXJ0eTogZnVuY3Rpb24gKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgIHZhciBwcm9wID0gdGhpcy5nZXREYXRhUHJvcGVydHkob2JqLCBwcm9wZXJ0eSlcbiAgICAgIGlmIChwcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcCA9IG9ialtwcm9wZXJ0eV1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcCA9IHRoaXMuZ2V0TmVzdGVkUHJvcGVydHkob2JqLCBwcm9wZXJ0eSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9wXG4gICAgfSxcblxuICAgIGluaXRTdGFydEluZGV4OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLm9wdGlvbnMuaW5kZXhcbiAgICAgIHZhciB1cmxQcm9wZXJ0eSA9IHRoaXMub3B0aW9ucy51cmxQcm9wZXJ0eVxuICAgICAgdmFyIGlcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBpbmRleCBpcyBnaXZlbiBhcyBhIGxpc3Qgb2JqZWN0OlxuICAgICAgaWYgKGluZGV4ICYmIHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubnVtOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmxpc3RbaV0gPT09IGluZGV4IHx8XG4gICAgICAgICAgICB0aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0aGlzLmxpc3RbaV0sIHVybFByb3BlcnR5KSA9PT1cbiAgICAgICAgICAgICAgdGhpcy5nZXRJdGVtUHJvcGVydHkoaW5kZXgsIHVybFByb3BlcnR5KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaW5kZXggPSBpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTWFrZSBzdXJlIHRoZSBpbmRleCBpcyBpbiB0aGUgbGlzdCByYW5nZTpcbiAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmNpcmNsZShwYXJzZUludChpbmRleCwgMTApIHx8IDApXG4gICAgfSxcblxuICAgIGluaXRFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICB2YXIgc2xpZGVzQ29udGFpbmVyID0gdGhpcy5zbGlkZXNDb250YWluZXJcbiAgICAgIC8qKlxuICAgICAgICogUHJveHkgbGlzdGVuZXJcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2V2ZW50fSBldmVudCBvcmlnaW5hbCBldmVudFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBwcm94eUxpc3RlbmVyKGV2ZW50KSB7XG4gICAgICAgIHZhciB0eXBlID1cbiAgICAgICAgICB0aGF0LnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGF0LnN1cHBvcnQudHJhbnNpdGlvbi5lbmQgPT09IGV2ZW50LnR5cGVcbiAgICAgICAgICAgID8gJ3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICA6IGV2ZW50LnR5cGVcbiAgICAgICAgdGhhdFsnb24nICsgdHlwZV0oZXZlbnQpXG4gICAgICB9XG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHByb3h5TGlzdGVuZXIpXG4gICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBwcm94eUxpc3RlbmVyKVxuICAgICAgJChkb2N1bWVudC5ib2R5KS5vbigna2V5ZG93bicsIHByb3h5TGlzdGVuZXIpXG4gICAgICB0aGlzLmNvbnRhaW5lci5vbignY2xpY2snLCBwcm94eUxpc3RlbmVyKVxuICAgICAgaWYgKHRoaXMuc3VwcG9ydC50b3VjaCkge1xuICAgICAgICBzbGlkZXNDb250YWluZXIub24oXG4gICAgICAgICAgJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJyxcbiAgICAgICAgICBwcm94eUxpc3RlbmVyXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmVtdWxhdGVUb3VjaEV2ZW50cyAmJiB0aGlzLnN1cHBvcnQudHJhbnNpdGlvbikge1xuICAgICAgICBzbGlkZXNDb250YWluZXIub24oXG4gICAgICAgICAgJ21vdXNlZG93biBtb3VzZW1vdmUgbW91c2V1cCBtb3VzZW91dCcsXG4gICAgICAgICAgcHJveHlMaXN0ZW5lclxuICAgICAgICApXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdXBwb3J0LnRyYW5zaXRpb24pIHtcbiAgICAgICAgc2xpZGVzQ29udGFpbmVyLm9uKHRoaXMuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCwgcHJveHlMaXN0ZW5lcilcbiAgICAgIH1cbiAgICAgIHRoaXMucHJveHlMaXN0ZW5lciA9IHByb3h5TGlzdGVuZXJcbiAgICB9LFxuXG4gICAgZGVzdHJveUV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2xpZGVzQ29udGFpbmVyID0gdGhpcy5zbGlkZXNDb250YWluZXJcbiAgICAgIHZhciBwcm94eUxpc3RlbmVyID0gdGhpcy5wcm94eUxpc3RlbmVyXG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUnLCBwcm94eUxpc3RlbmVyKVxuICAgICAgJChkb2N1bWVudC5ib2R5KS5vZmYoJ2tleWRvd24nLCBwcm94eUxpc3RlbmVyKVxuICAgICAgdGhpcy5jb250YWluZXIub2ZmKCdjbGljaycsIHByb3h5TGlzdGVuZXIpXG4gICAgICBpZiAodGhpcy5zdXBwb3J0LnRvdWNoKSB7XG4gICAgICAgIHNsaWRlc0NvbnRhaW5lci5vZmYoXG4gICAgICAgICAgJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJyxcbiAgICAgICAgICBwcm94eUxpc3RlbmVyXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmVtdWxhdGVUb3VjaEV2ZW50cyAmJiB0aGlzLnN1cHBvcnQudHJhbnNpdGlvbikge1xuICAgICAgICBzbGlkZXNDb250YWluZXIub2ZmKFxuICAgICAgICAgICdtb3VzZWRvd24gbW91c2Vtb3ZlIG1vdXNldXAgbW91c2VvdXQnLFxuICAgICAgICAgIHByb3h5TGlzdGVuZXJcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3VwcG9ydC50cmFuc2l0aW9uKSB7XG4gICAgICAgIHNsaWRlc0NvbnRhaW5lci5vZmYodGhpcy5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLCBwcm94eUxpc3RlbmVyKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVPcGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm9ub3BlbmVkKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vbm9wZW5lZC5jYWxsKHRoaXMpXG4gICAgICB9XG4gICAgfSxcblxuICAgIGluaXRXaWRnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgLyoqXG4gICAgICAgKiBPcGVuIGhhbmRsZXJcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2V2ZW50fSBldmVudCBHYWxsZXJ5IG9wZW4gZXZlbnRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gb3BlbkhhbmRsZXIoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhhdC5jb250YWluZXJbMF0pIHtcbiAgICAgICAgICB0aGF0LmNvbnRhaW5lci5vZmYodGhhdC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLCBvcGVuSGFuZGxlcilcbiAgICAgICAgICB0aGF0LmhhbmRsZU9wZW4oKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnRhaW5lciA9ICQodGhpcy5vcHRpb25zLmNvbnRhaW5lcilcbiAgICAgIGlmICghdGhpcy5jb250YWluZXIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY29uc29sZS5sb2coXG4gICAgICAgICAgJ2JsdWVpbXAgR2FsbGVyeTogV2lkZ2V0IGNvbnRhaW5lciBub3QgZm91bmQuJyxcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY29udGFpbmVyXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLnNsaWRlc0NvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyXG4gICAgICAgIC5maW5kKHRoaXMub3B0aW9ucy5zbGlkZXNDb250YWluZXIpXG4gICAgICAgIC5maXJzdCgpXG4gICAgICBpZiAoIXRoaXMuc2xpZGVzQ29udGFpbmVyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmNvbnNvbGUubG9nKFxuICAgICAgICAgICdibHVlaW1wIEdhbGxlcnk6IFNsaWRlcyBjb250YWluZXIgbm90IGZvdW5kLicsXG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNsaWRlc0NvbnRhaW5lclxuICAgICAgICApXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy50aXRsZUVsZW1lbnQgPSB0aGlzLmNvbnRhaW5lci5maW5kKHRoaXMub3B0aW9ucy50aXRsZUVsZW1lbnQpLmZpcnN0KClcbiAgICAgIHRoaXMucGxheVBhdXNlRWxlbWVudCA9IHRoaXMuY29udGFpbmVyXG4gICAgICAgIC5maW5kKCcuJyArIHRoaXMub3B0aW9ucy5wbGF5UGF1c2VDbGFzcylcbiAgICAgICAgLmZpcnN0KClcbiAgICAgIGlmICh0aGlzLm51bSA9PT0gMSkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuc2luZ2xlQ2xhc3MpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdXBwb3J0LnN2Z2FzaW1nKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENsYXNzKHRoaXMub3B0aW9ucy5zdmdhc2ltZ0NsYXNzKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3VwcG9ydC5zbWlsKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENsYXNzKHRoaXMub3B0aW9ucy5zbWlsQ2xhc3MpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm9ub3Blbikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25vcGVuLmNhbGwodGhpcylcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLm9wdGlvbnMuZGlzcGxheVRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIub24odGhpcy5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLCBvcGVuSGFuZGxlcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGFuZGxlT3BlbigpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmhpZGVQYWdlU2Nyb2xsYmFycykge1xuICAgICAgICAvLyBIaWRlIHRoZSBwYWdlIHNjcm9sbGJhcnM6XG4gICAgICAgIHRoaXMuYm9keU92ZXJmbG93U3R5bGUgPSBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgfVxuICAgICAgdGhpcy5jb250YWluZXJbMF0uc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgIHRoaXMuaW5pdFNsaWRlcygpXG4gICAgICB0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuZGlzcGxheUNsYXNzKVxuICAgIH0sXG5cbiAgICBpbml0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgdGhlIHByb3RvdHlwZSBvcHRpb25zOlxuICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucylcbiAgICAgIC8vIENoZWNrIGlmIGNhcm91c2VsIG1vZGUgaXMgZW5hYmxlZDpcbiAgICAgIGlmIChcbiAgICAgICAgKG9wdGlvbnMgJiYgb3B0aW9ucy5jYXJvdXNlbCkgfHxcbiAgICAgICAgKHRoaXMub3B0aW9ucy5jYXJvdXNlbCAmJiAoIW9wdGlvbnMgfHwgb3B0aW9ucy5jYXJvdXNlbCAhPT0gZmFsc2UpKVxuICAgICAgKSB7XG4gICAgICAgICQuZXh0ZW5kKHRoaXMub3B0aW9ucywgdGhpcy5jYXJvdXNlbE9wdGlvbnMpXG4gICAgICB9XG4gICAgICAvLyBPdmVycmlkZSBhbnkgZ2l2ZW4gb3B0aW9uczpcbiAgICAgICQuZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucylcbiAgICAgIGlmICh0aGlzLm51bSA8IDMpIHtcbiAgICAgICAgLy8gMSBvciAyIHNsaWRlcyBjYW5ub3QgYmUgZGlzcGxheWVkIGNvbnRpbnVvdXMsXG4gICAgICAgIC8vIHJlbWVtYmVyIHRoZSBvcmlnaW5hbCBvcHRpb24gYnkgc2V0dGluZyB0byBudWxsIGluc3RlYWQgb2YgZmFsc2U6XG4gICAgICAgIHRoaXMub3B0aW9ucy5jb250aW51b3VzID0gdGhpcy5vcHRpb25zLmNvbnRpbnVvdXMgPyBudWxsIDogZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5zdXBwb3J0LnRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVtdWxhdGVUb3VjaEV2ZW50cyA9IGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmV2ZW50KSB7XG4gICAgICAgIHRoaXMucHJldmVudERlZmF1bHQodGhpcy5vcHRpb25zLmV2ZW50KVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gR2FsbGVyeVxufSlcbiIsIiFmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIGkgaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxpKSYmKHRbaV09ZVtpXSk7cmV0dXJuIHR9ZnVuY3Rpb24gaSh0KXtpZighdGhpc3x8dGhpcy5maW5kIT09aS5wcm90b3R5cGUuZmluZClyZXR1cm4gbmV3IGkodCk7aWYodGhpcy5sZW5ndGg9MCx0KWlmKCh0PVwic3RyaW5nXCI9PXR5cGVvZiB0P3RoaXMuZmluZCh0KTp0KS5ub2RlVHlwZXx8dD09PXQud2luZG93KXRoaXMubGVuZ3RoPTEsdGhpc1swXT10O2Vsc2V7dmFyIGU9dC5sZW5ndGg7Zm9yKHRoaXMubGVuZ3RoPWU7ZTspdGhpc1stLWVdPXRbZV19fWkuZXh0ZW5kPXQsaS5jb250YWlucz1mdW5jdGlvbih0LGUpe2Rve2lmKChlPWUucGFyZW50Tm9kZSk9PT10KXJldHVybiEwfXdoaWxlKGUpO3JldHVybiExfSxpLnBhcnNlSlNPTj1mdW5jdGlvbih0KXtyZXR1cm4gSlNPTi5wYXJzZSh0KX0sdChpLnByb3RvdHlwZSx7ZmluZDpmdW5jdGlvbih0KXt2YXIgZT10aGlzWzBdfHxkb2N1bWVudDtyZXR1cm4gbmV3IGkodD1cInN0cmluZ1wiPT10eXBlb2YgdD9lLnF1ZXJ5U2VsZWN0b3JBbGw/ZS5xdWVyeVNlbGVjdG9yQWxsKHQpOlwiI1wiPT09dC5jaGFyQXQoMCk/ZS5nZXRFbGVtZW50QnlJZCh0LnNsaWNlKDEpKTplLmdldEVsZW1lbnRzQnlUYWdOYW1lKHQpOnQpfSxoYXNDbGFzczpmdW5jdGlvbih0KXtyZXR1cm4hIXRoaXNbMF0mJm5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIit0K1wiKD86XFxcXHMrfCQpXCIpLnRlc3QodGhpc1swXS5jbGFzc05hbWUpfSxhZGRDbGFzczpmdW5jdGlvbih0KXtmb3IodmFyIGUsaSxzLG49dGhpcy5sZW5ndGg7bjspaWYoKGk9dGhpc1stLW5dKS5jbGFzc05hbWUpZm9yKGU9ZXx8dC5zcGxpdCgvXFxzKy8pLHM9MDtzPGUubGVuZ3RoO3MrPTEpdGhpcy5oYXNDbGFzcyhlW3NdKXx8KGkuY2xhc3NOYW1lKz1cIiBcIitlW3NdKTtlbHNlIGkuY2xhc3NOYW1lPXQ7cmV0dXJuIHRoaXN9LHJlbW92ZUNsYXNzOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxpPW5ldyBSZWdFeHAoXCJeKD86XCIrdC5zcGxpdCgvXFxzKy8pLmpvaW4oXCJ8XCIpK1wiKSRcIikscz0vKFxcUyspKD86XFxzK3wkKS9nLG49ZnVuY3Rpb24odCxlKXtyZXR1cm4gaS50ZXN0KGUpP1wiXCI6dH0sbz0vXFxzKyQvLGE9dGhpcy5sZW5ndGg7YTspKGU9dGhpc1stLWFdKS5jbGFzc05hbWU9ZS5jbGFzc05hbWUucmVwbGFjZShzLG4pLnJlcGxhY2UobyxcIlwiKTtyZXR1cm4gdGhpc30sb246ZnVuY3Rpb24odCxlKXtmb3IodmFyIGkscyxuPXQuc3BsaXQoL1xccysvKTtuLmxlbmd0aDspZm9yKHQ9bi5zaGlmdCgpLGk9dGhpcy5sZW5ndGg7aTspKHM9dGhpc1stLWldKS5hZGRFdmVudExpc3RlbmVyP3MuYWRkRXZlbnRMaXN0ZW5lcih0LGUsITEpOnMuYXR0YWNoRXZlbnQmJnMuYXR0YWNoRXZlbnQoXCJvblwiK3QsZSk7cmV0dXJuIHRoaXN9LG9mZjpmdW5jdGlvbih0LGUpe2Zvcih2YXIgaSxzLG49dC5zcGxpdCgvXFxzKy8pO24ubGVuZ3RoOylmb3IodD1uLnNoaWZ0KCksaT10aGlzLmxlbmd0aDtpOykocz10aGlzWy0taV0pLnJlbW92ZUV2ZW50TGlzdGVuZXI/cy5yZW1vdmVFdmVudExpc3RlbmVyKHQsZSwhMSk6cy5kZXRhY2hFdmVudCYmcy5kZXRhY2hFdmVudChcIm9uXCIrdCxlKTtyZXR1cm4gdGhpc30sZW1wdHk6ZnVuY3Rpb24oKXtmb3IodmFyIHQsZT10aGlzLmxlbmd0aDtlOylmb3IodD10aGlzWy0tZV07dC5oYXNDaGlsZE5vZGVzKCk7KXQucmVtb3ZlQ2hpbGQodC5sYXN0Q2hpbGQpO3JldHVybiB0aGlzfSxmaXJzdDpmdW5jdGlvbigpe3JldHVybiBuZXcgaSh0aGlzWzBdKX19KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGl9KTood2luZG93LmJsdWVpbXA9d2luZG93LmJsdWVpbXB8fHt9LHdpbmRvdy5ibHVlaW1wLmhlbHBlcj1pKX0oKSxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcIi4vYmx1ZWltcC1oZWxwZXJcIl0sdCk6KHdpbmRvdy5ibHVlaW1wPXdpbmRvdy5ibHVlaW1wfHx7fSx3aW5kb3cuYmx1ZWltcC5HYWxsZXJ5PXQod2luZG93LmJsdWVpbXAuaGVscGVyfHx3aW5kb3cualF1ZXJ5KSl9KGZ1bmN0aW9uKGYpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCxlKXtyZXR1cm4gZG9jdW1lbnQuYm9keS5zdHlsZS5tYXhIZWlnaHQ9PT11bmRlZmluZWQ/bnVsbDp0aGlzJiZ0aGlzLm9wdGlvbnM9PT1pLnByb3RvdHlwZS5vcHRpb25zP3ZvaWQodCYmdC5sZW5ndGg/KHRoaXMubGlzdD10LHRoaXMubnVtPXQubGVuZ3RoLHRoaXMuaW5pdE9wdGlvbnMoZSksdGhpcy5pbml0aWFsaXplKCkpOnRoaXMuY29uc29sZS5sb2coXCJibHVlaW1wIEdhbGxlcnk6IE5vIG9yIGVtcHR5IGxpc3QgcHJvdmlkZWQgYXMgZmlyc3QgYXJndW1lbnQuXCIsdCkpOm5ldyBpKHQsZSl9cmV0dXJuIGYuZXh0ZW5kKGkucHJvdG90eXBlLHtvcHRpb25zOntjb250YWluZXI6XCIjYmx1ZWltcC1nYWxsZXJ5XCIsc2xpZGVzQ29udGFpbmVyOlwiZGl2XCIsdGl0bGVFbGVtZW50OlwiaDNcIixkaXNwbGF5Q2xhc3M6XCJibHVlaW1wLWdhbGxlcnktZGlzcGxheVwiLGNvbnRyb2xzQ2xhc3M6XCJibHVlaW1wLWdhbGxlcnktY29udHJvbHNcIixzaW5nbGVDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1zaW5nbGVcIixsZWZ0RWRnZUNsYXNzOlwiYmx1ZWltcC1nYWxsZXJ5LWxlZnRcIixyaWdodEVkZ2VDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1yaWdodFwiLHBsYXlpbmdDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1wbGF5aW5nXCIsc3ZnYXNpbWdDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1zdmdhc2ltZ1wiLHNtaWxDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1zbWlsXCIsc2xpZGVDbGFzczpcInNsaWRlXCIsc2xpZGVBY3RpdmVDbGFzczpcInNsaWRlLWFjdGl2ZVwiLHNsaWRlUHJldkNsYXNzOlwic2xpZGUtcHJldlwiLHNsaWRlTmV4dENsYXNzOlwic2xpZGUtbmV4dFwiLHNsaWRlTG9hZGluZ0NsYXNzOlwic2xpZGUtbG9hZGluZ1wiLHNsaWRlRXJyb3JDbGFzczpcInNsaWRlLWVycm9yXCIsc2xpZGVDb250ZW50Q2xhc3M6XCJzbGlkZS1jb250ZW50XCIsdG9nZ2xlQ2xhc3M6XCJ0b2dnbGVcIixwcmV2Q2xhc3M6XCJwcmV2XCIsbmV4dENsYXNzOlwibmV4dFwiLGNsb3NlQ2xhc3M6XCJjbG9zZVwiLHBsYXlQYXVzZUNsYXNzOlwicGxheS1wYXVzZVwiLHR5cGVQcm9wZXJ0eTpcInR5cGVcIix0aXRsZVByb3BlcnR5OlwidGl0bGVcIixhbHRUZXh0UHJvcGVydHk6XCJhbHRcIix1cmxQcm9wZXJ0eTpcImhyZWZcIixzcmNzZXRQcm9wZXJ0eTpcInNyY3NldFwiLHNpemVzUHJvcGVydHk6XCJzaXplc1wiLHNvdXJjZXNQcm9wZXJ0eTpcInNvdXJjZXNcIixkaXNwbGF5VHJhbnNpdGlvbjohMCxjbGVhclNsaWRlczohMCx0b2dnbGVDb250cm9sc09uRW50ZXI6ITAsdG9nZ2xlQ29udHJvbHNPblNsaWRlQ2xpY2s6ITAsdG9nZ2xlU2xpZGVzaG93T25TcGFjZTohMCxlbmFibGVLZXlib2FyZE5hdmlnYXRpb246ITAsY2xvc2VPbkVzY2FwZTohMCxjbG9zZU9uU2xpZGVDbGljazohMCxjbG9zZU9uU3dpcGVVcE9yRG93bjohMCxjbG9zZU9uSGFzaENoYW5nZTohMCxlbXVsYXRlVG91Y2hFdmVudHM6ITAsc3RvcFRvdWNoRXZlbnRzUHJvcGFnYXRpb246ITEsaGlkZVBhZ2VTY3JvbGxiYXJzOiEwLGRpc2FibGVTY3JvbGw6ITAsY2Fyb3VzZWw6ITEsY29udGludW91czohMCx1bmxvYWRFbGVtZW50czohMCxzdGFydFNsaWRlc2hvdzohMSxzbGlkZXNob3dJbnRlcnZhbDo1ZTMsc2xpZGVzaG93RGlyZWN0aW9uOlwibHRyXCIsaW5kZXg6MCxwcmVsb2FkUmFuZ2U6Mix0cmFuc2l0aW9uRHVyYXRpb246MzAwLHNsaWRlc2hvd1RyYW5zaXRpb25EdXJhdGlvbjo1MDAsZXZlbnQ6dW5kZWZpbmVkLG9ub3Blbjp1bmRlZmluZWQsb25vcGVuZWQ6dW5kZWZpbmVkLG9uc2xpZGU6dW5kZWZpbmVkLG9uc2xpZGVlbmQ6dW5kZWZpbmVkLG9uc2xpZGVjb21wbGV0ZTp1bmRlZmluZWQsb25jbG9zZTp1bmRlZmluZWQsb25jbG9zZWQ6dW5kZWZpbmVkfSxjYXJvdXNlbE9wdGlvbnM6e2hpZGVQYWdlU2Nyb2xsYmFyczohMSx0b2dnbGVDb250cm9sc09uRW50ZXI6ITEsdG9nZ2xlU2xpZGVzaG93T25TcGFjZTohMSxlbmFibGVLZXlib2FyZE5hdmlnYXRpb246ITEsY2xvc2VPbkVzY2FwZTohMSxjbG9zZU9uU2xpZGVDbGljazohMSxjbG9zZU9uU3dpcGVVcE9yRG93bjohMSxjbG9zZU9uSGFzaENoYW5nZTohMSxkaXNhYmxlU2Nyb2xsOiExLHN0YXJ0U2xpZGVzaG93OiEwfSxjb25zb2xlOndpbmRvdy5jb25zb2xlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB3aW5kb3cuY29uc29sZS5sb2c/d2luZG93LmNvbnNvbGU6e2xvZzpmdW5jdGlvbigpe319LHN1cHBvcnQ6ZnVuY3Rpb24ocyl7dmFyIHQsbj17c291cmNlOiEhd2luZG93LkhUTUxTb3VyY2VFbGVtZW50LHBpY3R1cmU6ISF3aW5kb3cuSFRNTFBpY3R1cmVFbGVtZW50LHN2Z2FzaW1nOmRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoXCJodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0ltYWdlXCIsXCIxLjFcIiksc21pbDohIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyYmL1NWR0FuaW1hdGUvLnRlc3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImFuaW1hdGVcIikudG9TdHJpbmcoKSksdG91Y2g6d2luZG93Lm9udG91Y2hzdGFydCE9PXVuZGVmaW5lZHx8d2luZG93LkRvY3VtZW50VG91Y2gmJmRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaH0sZT17d2Via2l0VHJhbnNpdGlvbjp7ZW5kOlwid2Via2l0VHJhbnNpdGlvbkVuZFwiLHByZWZpeDpcIi13ZWJraXQtXCJ9LE1velRyYW5zaXRpb246e2VuZDpcInRyYW5zaXRpb25lbmRcIixwcmVmaXg6XCItbW96LVwifSxPVHJhbnNpdGlvbjp7ZW5kOlwib3RyYW5zaXRpb25lbmRcIixwcmVmaXg6XCItby1cIn0sdHJhbnNpdGlvbjp7ZW5kOlwidHJhbnNpdGlvbmVuZFwiLHByZWZpeDpcIlwifX07Zm9yKHQgaW4gZSlpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSx0KSYmcy5zdHlsZVt0XSE9PXVuZGVmaW5lZCl7bi50cmFuc2l0aW9uPWVbdF0sbi50cmFuc2l0aW9uLm5hbWU9dDticmVha31mdW5jdGlvbiBpKCl7dmFyIHQsZSxpPW4udHJhbnNpdGlvbjtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHMpLGkmJih0PWkubmFtZS5zbGljZSgwLC05KStcInJhbnNmb3JtXCIscy5zdHlsZVt0XSE9PXVuZGVmaW5lZCYmKHMuc3R5bGVbdF09XCJ0cmFuc2xhdGVaKDApXCIsZT13aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzKS5nZXRQcm9wZXJ0eVZhbHVlKGkucHJlZml4K1widHJhbnNmb3JtXCIpLG4udHJhbnNmb3JtPXtwcmVmaXg6aS5wcmVmaXgsbmFtZTp0LHRyYW5zbGF0ZTohMCx0cmFuc2xhdGVaOiEhZSYmXCJub25lXCIhPT1lfSkpLGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocyl9cmV0dXJuIGRvY3VtZW50LmJvZHk/aSgpOmYoZG9jdW1lbnQpLm9uKFwiRE9NQ29udGVudExvYWRlZFwiLGkpLG59KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLHJlcXVlc3RBbmltYXRpb25GcmFtZTp3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lLGNhbmNlbEFuaW1hdGlvbkZyYW1lOndpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUsaW5pdGlhbGl6ZTpmdW5jdGlvbigpe2lmKHRoaXMuaW5pdFN0YXJ0SW5kZXgoKSwhMT09PXRoaXMuaW5pdFdpZGdldCgpKXJldHVybiExO3RoaXMuaW5pdEV2ZW50TGlzdGVuZXJzKCksdGhpcy5vbnNsaWRlKHRoaXMuaW5kZXgpLHRoaXMub250cmFuc2l0aW9uZW5kKCksdGhpcy5vcHRpb25zLnN0YXJ0U2xpZGVzaG93JiZ0aGlzLnBsYXkoKX0sc2xpZGU6ZnVuY3Rpb24odCxlKXt3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7dmFyIGkscyxuLG89dGhpcy5pbmRleDtpZihvIT09dCYmMSE9PXRoaXMubnVtKXtpZihlPWV8fHRoaXMub3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24sdGhpcy5zdXBwb3J0LnRyYW5zZm9ybSl7Zm9yKHRoaXMub3B0aW9ucy5jb250aW51b3VzfHwodD10aGlzLmNpcmNsZSh0KSksaT1NYXRoLmFicyhvLXQpLyhvLXQpLHRoaXMub3B0aW9ucy5jb250aW51b3VzJiYocz1pLChpPS10aGlzLnBvc2l0aW9uc1t0aGlzLmNpcmNsZSh0KV0vdGhpcy5zbGlkZVdpZHRoKSE9PXMmJih0PS1pKnRoaXMubnVtK3QpKSxuPU1hdGguYWJzKG8tdCktMTtuOyl0aGlzLm1vdmUodGhpcy5jaXJjbGUoKG88dD90Om8pLSAtLW4tMSksdGhpcy5zbGlkZVdpZHRoKmksMCk7dD10aGlzLmNpcmNsZSh0KSx0aGlzLm1vdmUobyx0aGlzLnNsaWRlV2lkdGgqaSxlKSx0aGlzLm1vdmUodCwwLGUpLHRoaXMub3B0aW9ucy5jb250aW51b3VzJiZ0aGlzLm1vdmUodGhpcy5jaXJjbGUodC1pKSwtdGhpcy5zbGlkZVdpZHRoKmksMCl9ZWxzZSB0PXRoaXMuY2lyY2xlKHQpLHRoaXMuYW5pbWF0ZShvKi10aGlzLnNsaWRlV2lkdGgsdCotdGhpcy5zbGlkZVdpZHRoLGUpO3RoaXMub25zbGlkZSh0KX19LGdldEluZGV4OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaW5kZXh9LGdldE51bWJlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzLm51bX0scHJldjpmdW5jdGlvbigpeyh0aGlzLm9wdGlvbnMuY29udGludW91c3x8dGhpcy5pbmRleCkmJnRoaXMuc2xpZGUodGhpcy5pbmRleC0xKX0sbmV4dDpmdW5jdGlvbigpeyh0aGlzLm9wdGlvbnMuY29udGludW91c3x8dGhpcy5pbmRleDx0aGlzLm51bS0xKSYmdGhpcy5zbGlkZSh0aGlzLmluZGV4KzEpfSxwbGF5OmZ1bmN0aW9uKHQpe3ZhciBpPXRoaXMsZT10aGlzLmluZGV4KyhcInJ0bFwiPT09dGhpcy5vcHRpb25zLnNsaWRlc2hvd0RpcmVjdGlvbj8tMToxKTt3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCksdGhpcy5pbnRlcnZhbD10fHx0aGlzLm9wdGlvbnMuc2xpZGVzaG93SW50ZXJ2YWwsMTx0aGlzLmVsZW1lbnRzW3RoaXMuaW5kZXhdJiYodGhpcy50aW1lb3V0PXRoaXMuc2V0VGltZW91dCghdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUmJnRoaXMuc2xpZGV8fGZ1bmN0aW9uKHQsZSl7aS5hbmltYXRpb25GcmFtZUlkPWkucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmNhbGwod2luZG93LGZ1bmN0aW9uKCl7aS5zbGlkZSh0LGUpfSl9LFtlLHRoaXMub3B0aW9ucy5zbGlkZXNob3dUcmFuc2l0aW9uRHVyYXRpb25dLHRoaXMuaW50ZXJ2YWwpKSx0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMucGxheWluZ0NsYXNzKSx0aGlzLnNsaWRlc0NvbnRhaW5lclswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIixcIm9mZlwiKSx0aGlzLnBsYXlQYXVzZUVsZW1lbnQubGVuZ3RoJiZ0aGlzLnBsYXlQYXVzZUVsZW1lbnRbMF0uc2V0QXR0cmlidXRlKFwiYXJpYS1wcmVzc2VkXCIsXCJ0cnVlXCIpfSxwYXVzZTpmdW5jdGlvbigpe3dpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSx0aGlzLmludGVydmFsPW51bGwsdGhpcy5jYW5jZWxBbmltYXRpb25GcmFtZSYmKHRoaXMuY2FuY2VsQW5pbWF0aW9uRnJhbWUuY2FsbCh3aW5kb3csdGhpcy5hbmltYXRpb25GcmFtZUlkKSx0aGlzLmFuaW1hdGlvbkZyYW1lSWQ9bnVsbCksdGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLnBsYXlpbmdDbGFzcyksdGhpcy5zbGlkZXNDb250YWluZXJbMF0uc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsXCJwb2xpdGVcIiksdGhpcy5wbGF5UGF1c2VFbGVtZW50Lmxlbmd0aCYmdGhpcy5wbGF5UGF1c2VFbGVtZW50WzBdLnNldEF0dHJpYnV0ZShcImFyaWEtcHJlc3NlZFwiLFwiZmFsc2VcIil9LGFkZDpmdW5jdGlvbih0KXt2YXIgZTtmb3IodC5jb25jYXR8fCh0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHQpKSx0aGlzLmxpc3QuY29uY2F0fHwodGhpcy5saXN0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMubGlzdCkpLHRoaXMubGlzdD10aGlzLmxpc3QuY29uY2F0KHQpLHRoaXMubnVtPXRoaXMubGlzdC5sZW5ndGgsMjx0aGlzLm51bSYmbnVsbD09PXRoaXMub3B0aW9ucy5jb250aW51b3VzJiYodGhpcy5vcHRpb25zLmNvbnRpbnVvdXM9ITAsdGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmxlZnRFZGdlQ2xhc3MpKSx0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMucmlnaHRFZGdlQ2xhc3MpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5zaW5nbGVDbGFzcyksZT10aGlzLm51bS10Lmxlbmd0aDtlPHRoaXMubnVtO2UrPTEpdGhpcy5hZGRTbGlkZShlKSx0aGlzLnBvc2l0aW9uU2xpZGUoZSk7dGhpcy5wb3NpdGlvbnMubGVuZ3RoPXRoaXMubnVtLHRoaXMuaW5pdFNsaWRlcyghMCl9LHJlc2V0U2xpZGVzOmZ1bmN0aW9uKCl7dGhpcy5zbGlkZXNDb250YWluZXIuZW1wdHkoKSx0aGlzLnVubG9hZEFsbFNsaWRlcygpLHRoaXMuc2xpZGVzPVtdfSxoYW5kbGVDbG9zZTpmdW5jdGlvbigpe3ZhciB0PXRoaXMub3B0aW9uczt0aGlzLmRlc3Ryb3lFdmVudExpc3RlbmVycygpLHRoaXMucGF1c2UoKSx0aGlzLmNvbnRhaW5lclswXS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLHRoaXMuY29udGFpbmVyLnJlbW92ZUNsYXNzKHQuZGlzcGxheUNsYXNzKS5yZW1vdmVDbGFzcyh0LnNpbmdsZUNsYXNzKS5yZW1vdmVDbGFzcyh0LmxlZnRFZGdlQ2xhc3MpLnJlbW92ZUNsYXNzKHQucmlnaHRFZGdlQ2xhc3MpLHQuaGlkZVBhZ2VTY3JvbGxiYXJzJiYoZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdz10aGlzLmJvZHlPdmVyZmxvd1N0eWxlKSx0aGlzLm9wdGlvbnMuY2xlYXJTbGlkZXMmJnRoaXMucmVzZXRTbGlkZXMoKSx0aGlzLm9wdGlvbnMub25jbG9zZWQmJnRoaXMub3B0aW9ucy5vbmNsb3NlZC5jYWxsKHRoaXMpfSxjbG9zZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5vcHRpb25zLm9uY2xvc2UmJnRoaXMub3B0aW9ucy5vbmNsb3NlLmNhbGwodGhpcyksdGhpcy5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMub3B0aW9ucy5kaXNwbGF5VHJhbnNpdGlvbj8odGhpcy5jb250YWluZXIub24odGhpcy5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLGZ1bmN0aW9uIGkodCl7dC50YXJnZXQ9PT1lLmNvbnRhaW5lclswXSYmKGUuY29udGFpbmVyLm9mZihlLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsaSksZS5oYW5kbGVDbG9zZSgpKX0pLHRoaXMuY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5kaXNwbGF5Q2xhc3MpKTp0aGlzLmhhbmRsZUNsb3NlKCl9LGNpcmNsZTpmdW5jdGlvbih0KXtyZXR1cm4odGhpcy5udW0rdCV0aGlzLm51bSkldGhpcy5udW19LG1vdmU6ZnVuY3Rpb24odCxlLGkpe3RoaXMudHJhbnNsYXRlWCh0LGUsaSksdGhpcy5wb3NpdGlvbnNbdF09ZX0sdHJhbnNsYXRlOmZ1bmN0aW9uKHQsZSxpLHMpe3ZhciBuLG87dGhpcy5zbGlkZXNbdF0mJihuPXRoaXMuc2xpZGVzW3RdLnN0eWxlLG89dGhpcy5zdXBwb3J0LnRyYW5zaXRpb24sdD10aGlzLnN1cHBvcnQudHJhbnNmb3JtLG5bby5uYW1lK1wiRHVyYXRpb25cIl09cytcIm1zXCIsblt0Lm5hbWVdPVwidHJhbnNsYXRlKFwiK2UrXCJweCwgXCIraStcInB4KVwiKyh0LnRyYW5zbGF0ZVo/XCIgdHJhbnNsYXRlWigwKVwiOlwiXCIpKX0sdHJhbnNsYXRlWDpmdW5jdGlvbih0LGUsaSl7dGhpcy50cmFuc2xhdGUodCxlLDAsaSl9LHRyYW5zbGF0ZVk6ZnVuY3Rpb24odCxlLGkpe3RoaXMudHJhbnNsYXRlKHQsMCxlLGkpfSxhbmltYXRlOmZ1bmN0aW9uKGUsaSxzKXt2YXIgbixvLGE7cz8obj10aGlzLG89KG5ldyBEYXRlKS5nZXRUaW1lKCksYT13aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXt2YXIgdD0obmV3IERhdGUpLmdldFRpbWUoKS1vO2lmKHM8dClyZXR1cm4gbi5zbGlkZXNDb250YWluZXJbMF0uc3R5bGUubGVmdD1pK1wicHhcIixuLm9udHJhbnNpdGlvbmVuZCgpLHZvaWQgd2luZG93LmNsZWFySW50ZXJ2YWwoYSk7bi5zbGlkZXNDb250YWluZXJbMF0uc3R5bGUubGVmdD0oaS1lKSooTWF0aC5mbG9vcih0L3MqMTAwKS8xMDApK2UrXCJweFwifSw0KSk6dGhpcy5zbGlkZXNDb250YWluZXJbMF0uc3R5bGUubGVmdD1pK1wicHhcIn0scHJldmVudERlZmF1bHQ6ZnVuY3Rpb24odCl7dC5wcmV2ZW50RGVmYXVsdD90LnByZXZlbnREZWZhdWx0KCk6dC5yZXR1cm5WYWx1ZT0hMX0sc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKHQpe3Quc3RvcFByb3BhZ2F0aW9uP3Quc3RvcFByb3BhZ2F0aW9uKCk6dC5jYW5jZWxCdWJibGU9ITB9LG9ucmVzaXplOmZ1bmN0aW9uKCl7dGhpcy5pbml0U2xpZGVzKCEwKX0sb25oYXNoY2hhbmdlOmZ1bmN0aW9uKCl7dGhpcy5vcHRpb25zLmNsb3NlT25IYXNoQ2hhbmdlJiZ0aGlzLmNsb3NlKCl9LG9ubW91c2Vkb3duOmZ1bmN0aW9uKHQpe3Qud2hpY2gmJjE9PT10LndoaWNoJiZcIlZJREVPXCIhPT10LnRhcmdldC5ub2RlTmFtZSYmXCJBVURJT1wiIT09dC50YXJnZXQubm9kZU5hbWUmJih0LnByZXZlbnREZWZhdWx0KCksKHQub3JpZ2luYWxFdmVudHx8dCkudG91Y2hlcz1be3BhZ2VYOnQucGFnZVgscGFnZVk6dC5wYWdlWX1dLHRoaXMub250b3VjaHN0YXJ0KHQpKX0sb25tb3VzZW1vdmU6ZnVuY3Rpb24odCl7dGhpcy50b3VjaFN0YXJ0JiYoKHQub3JpZ2luYWxFdmVudHx8dCkudG91Y2hlcz1be3BhZ2VYOnQucGFnZVgscGFnZVk6dC5wYWdlWX1dLHRoaXMub250b3VjaG1vdmUodCkpfSxvbm1vdXNldXA6ZnVuY3Rpb24odCl7dGhpcy50b3VjaFN0YXJ0JiYodGhpcy5vbnRvdWNoZW5kKHQpLGRlbGV0ZSB0aGlzLnRvdWNoU3RhcnQpfSxvbm1vdXNlb3V0OmZ1bmN0aW9uKHQpe3ZhciBlLGk7dGhpcy50b3VjaFN0YXJ0JiYoZT10LnRhcmdldCwoaT10LnJlbGF0ZWRUYXJnZXQpJiYoaT09PWV8fGYuY29udGFpbnMoZSxpKSl8fHRoaXMub25tb3VzZXVwKHQpKX0sb250b3VjaHN0YXJ0OmZ1bmN0aW9uKHQpe3RoaXMub3B0aW9ucy5zdG9wVG91Y2hFdmVudHNQcm9wYWdhdGlvbiYmdGhpcy5zdG9wUHJvcGFnYXRpb24odCk7dD0odC5vcmlnaW5hbEV2ZW50fHx0KS50b3VjaGVzWzBdO3RoaXMudG91Y2hTdGFydD17eDp0LnBhZ2VYLHk6dC5wYWdlWSx0aW1lOkRhdGUubm93KCl9LHRoaXMuaXNTY3JvbGxpbmc9dW5kZWZpbmVkLHRoaXMudG91Y2hEZWx0YT17fX0sb250b3VjaG1vdmU6ZnVuY3Rpb24odCl7dGhpcy5vcHRpb25zLnN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uJiZ0aGlzLnN0b3BQcm9wYWdhdGlvbih0KTt2YXIgZSxpLHM9KHQub3JpZ2luYWxFdmVudHx8dCkudG91Y2hlcyxuPXNbMF0sbz0odC5vcmlnaW5hbEV2ZW50fHx0KS5zY2FsZSxhPXRoaXMuaW5kZXg7aWYoISgxPHMubGVuZ3RofHxvJiYxIT09bykpaWYodGhpcy5vcHRpb25zLmRpc2FibGVTY3JvbGwmJnQucHJldmVudERlZmF1bHQoKSx0aGlzLnRvdWNoRGVsdGE9e3g6bi5wYWdlWC10aGlzLnRvdWNoU3RhcnQueCx5Om4ucGFnZVktdGhpcy50b3VjaFN0YXJ0Lnl9LGU9dGhpcy50b3VjaERlbHRhLngsdGhpcy5pc1Njcm9sbGluZz09PXVuZGVmaW5lZCYmKHRoaXMuaXNTY3JvbGxpbmc9dGhpcy5pc1Njcm9sbGluZ3x8TWF0aC5hYnMoZSk8TWF0aC5hYnModGhpcy50b3VjaERlbHRhLnkpKSx0aGlzLmlzU2Nyb2xsaW5nKXRoaXMub3B0aW9ucy5jYXJvdXNlbHx8dGhpcy50cmFuc2xhdGVZKGEsdGhpcy50b3VjaERlbHRhLnkrdGhpcy5wb3NpdGlvbnNbYV0sMCk7ZWxzZSBmb3IodC5wcmV2ZW50RGVmYXVsdCgpLHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSx0aGlzLm9wdGlvbnMuY29udGludW91cz9pPVt0aGlzLmNpcmNsZShhKzEpLGEsdGhpcy5jaXJjbGUoYS0xKV06KHRoaXMudG91Y2hEZWx0YS54PWUvPSFhJiYwPGV8fGE9PT10aGlzLm51bS0xJiZlPDA/TWF0aC5hYnMoZSkvdGhpcy5zbGlkZVdpZHRoKzE6MSxpPVthXSxhJiZpLnB1c2goYS0xKSxhPHRoaXMubnVtLTEmJmkudW5zaGlmdChhKzEpKTtpLmxlbmd0aDspYT1pLnBvcCgpLHRoaXMudHJhbnNsYXRlWChhLGUrdGhpcy5wb3NpdGlvbnNbYV0sMCl9LG9udG91Y2hlbmQ6ZnVuY3Rpb24odCl7dGhpcy5vcHRpb25zLnN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uJiZ0aGlzLnN0b3BQcm9wYWdhdGlvbih0KTt2YXIgZT10aGlzLmluZGV4LGk9TWF0aC5hYnModGhpcy50b3VjaERlbHRhLngpLHM9dGhpcy5zbGlkZVdpZHRoLG49TWF0aC5jZWlsKHRoaXMub3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24qKDEtaS9zKS8yKSxvPTIwPGksYT0hZSYmMDx0aGlzLnRvdWNoRGVsdGEueHx8ZT09PXRoaXMubnVtLTEmJnRoaXMudG91Y2hEZWx0YS54PDAsbD0hbyYmdGhpcy5vcHRpb25zLmNsb3NlT25Td2lwZVVwT3JEb3duJiYyMDxNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGEueSk7dGhpcy5vcHRpb25zLmNvbnRpbnVvdXMmJihhPSExKSx0PXRoaXMudG91Y2hEZWx0YS54PDA/LTE6MSx0aGlzLmlzU2Nyb2xsaW5nP2w/dGhpcy5jbG9zZSgpOnRoaXMudHJhbnNsYXRlWShlLDAsbik6byYmIWE/KGk9ZSt0LGw9ZS10LG89cyp0LGE9LXMqdCx0aGlzLm9wdGlvbnMuY29udGludW91cz8odGhpcy5tb3ZlKHRoaXMuY2lyY2xlKGkpLG8sMCksdGhpcy5tb3ZlKHRoaXMuY2lyY2xlKGUtMip0KSxhLDApKTowPD1pJiZpPHRoaXMubnVtJiZ0aGlzLm1vdmUoaSxvLDApLHRoaXMubW92ZShlLHRoaXMucG9zaXRpb25zW2VdK28sbiksdGhpcy5tb3ZlKHRoaXMuY2lyY2xlKGwpLHRoaXMucG9zaXRpb25zW3RoaXMuY2lyY2xlKGwpXStvLG4pLGU9dGhpcy5jaXJjbGUobCksdGhpcy5vbnNsaWRlKGUpKTp0aGlzLm9wdGlvbnMuY29udGludW91cz8odGhpcy5tb3ZlKHRoaXMuY2lyY2xlKGUtMSksLXMsbiksdGhpcy5tb3ZlKGUsMCxuKSx0aGlzLm1vdmUodGhpcy5jaXJjbGUoZSsxKSxzLG4pKTooZSYmdGhpcy5tb3ZlKGUtMSwtcyxuKSx0aGlzLm1vdmUoZSwwLG4pLGU8dGhpcy5udW0tMSYmdGhpcy5tb3ZlKGUrMSxzLG4pKX0sb250b3VjaGNhbmNlbDpmdW5jdGlvbih0KXt0aGlzLnRvdWNoU3RhcnQmJih0aGlzLm9udG91Y2hlbmQodCksZGVsZXRlIHRoaXMudG91Y2hTdGFydCl9LG9udHJhbnNpdGlvbmVuZDpmdW5jdGlvbih0KXt2YXIgZT10aGlzLnNsaWRlc1t0aGlzLmluZGV4XTt0JiZlIT09dC50YXJnZXR8fCh0aGlzLmludGVydmFsJiZ0aGlzLnBsYXkoKSx0aGlzLnNldFRpbWVvdXQodGhpcy5vcHRpb25zLm9uc2xpZGVlbmQsW3RoaXMuaW5kZXgsZV0pKX0sb25jb21wbGV0ZTpmdW5jdGlvbih0KXt2YXIgZSxpPXQudGFyZ2V0fHx0LnNyY0VsZW1lbnQscz1pJiZpLnBhcmVudE5vZGU7aSYmcyYmKGU9dGhpcy5nZXROb2RlSW5kZXgocyksZihzKS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuc2xpZGVMb2FkaW5nQ2xhc3MpLFwiZXJyb3JcIj09PXQudHlwZT8oZihzKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuc2xpZGVFcnJvckNsYXNzKSx0aGlzLmVsZW1lbnRzW2VdPTMpOnRoaXMuZWxlbWVudHNbZV09MixpLmNsaWVudEhlaWdodD50aGlzLmNvbnRhaW5lclswXS5jbGllbnRIZWlnaHQmJihpLnN0eWxlLm1heEhlaWdodD10aGlzLmNvbnRhaW5lclswXS5jbGllbnRIZWlnaHQpLHRoaXMuaW50ZXJ2YWwmJnRoaXMuc2xpZGVzW3RoaXMuaW5kZXhdPT09cyYmdGhpcy5wbGF5KCksdGhpcy5zZXRUaW1lb3V0KHRoaXMub3B0aW9ucy5vbnNsaWRlY29tcGxldGUsW2Usc10pKX0sb25sb2FkOmZ1bmN0aW9uKHQpe3RoaXMub25jb21wbGV0ZSh0KX0sb25lcnJvcjpmdW5jdGlvbih0KXt0aGlzLm9uY29tcGxldGUodCl9LG9ua2V5ZG93bjpmdW5jdGlvbih0KXtzd2l0Y2godC53aGljaHx8dC5rZXlDb2RlKXtjYXNlIDEzOnRoaXMub3B0aW9ucy50b2dnbGVDb250cm9sc09uRW50ZXImJih0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMudG9nZ2xlQ29udHJvbHMoKSk7YnJlYWs7Y2FzZSAyNzp0aGlzLm9wdGlvbnMuY2xvc2VPbkVzY2FwZSYmKHRoaXMuY2xvc2UoKSx0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpKTticmVhaztjYXNlIDMyOnRoaXMub3B0aW9ucy50b2dnbGVTbGlkZXNob3dPblNwYWNlJiYodGhpcy5wcmV2ZW50RGVmYXVsdCh0KSx0aGlzLnRvZ2dsZVNsaWRlc2hvdygpKTticmVhaztjYXNlIDM3OnRoaXMub3B0aW9ucy5lbmFibGVLZXlib2FyZE5hdmlnYXRpb24mJih0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMucHJldigpKTticmVhaztjYXNlIDM5OnRoaXMub3B0aW9ucy5lbmFibGVLZXlib2FyZE5hdmlnYXRpb24mJih0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMubmV4dCgpKX19LGhhbmRsZUNsaWNrOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMub3B0aW9ucyxpPXQudGFyZ2V0fHx0LnNyY0VsZW1lbnQscz1pLnBhcmVudE5vZGU7ZnVuY3Rpb24gbih0KXtyZXR1cm4gZihpKS5oYXNDbGFzcyh0KXx8ZihzKS5oYXNDbGFzcyh0KX1uKGUudG9nZ2xlQ2xhc3MpPyh0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMudG9nZ2xlQ29udHJvbHMoKSk6bihlLnByZXZDbGFzcyk/KHRoaXMucHJldmVudERlZmF1bHQodCksdGhpcy5wcmV2KCkpOm4oZS5uZXh0Q2xhc3MpPyh0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMubmV4dCgpKTpuKGUuY2xvc2VDbGFzcyk/KHRoaXMucHJldmVudERlZmF1bHQodCksdGhpcy5jbG9zZSgpKTpuKGUucGxheVBhdXNlQ2xhc3MpPyh0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMudG9nZ2xlU2xpZGVzaG93KCkpOnM9PT10aGlzLnNsaWRlc0NvbnRhaW5lclswXT9lLmNsb3NlT25TbGlkZUNsaWNrPyh0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMuY2xvc2UoKSk6ZS50b2dnbGVDb250cm9sc09uU2xpZGVDbGljayYmKHRoaXMucHJldmVudERlZmF1bHQodCksdGhpcy50b2dnbGVDb250cm9scygpKTpzLnBhcmVudE5vZGUmJnMucGFyZW50Tm9kZT09PXRoaXMuc2xpZGVzQ29udGFpbmVyWzBdJiZlLnRvZ2dsZUNvbnRyb2xzT25TbGlkZUNsaWNrJiYodGhpcy5wcmV2ZW50RGVmYXVsdCh0KSx0aGlzLnRvZ2dsZUNvbnRyb2xzKCkpfSxvbmNsaWNrOmZ1bmN0aW9uKHQpe2lmKCEodGhpcy5vcHRpb25zLmVtdWxhdGVUb3VjaEV2ZW50cyYmdGhpcy50b3VjaERlbHRhJiYoMjA8TWF0aC5hYnModGhpcy50b3VjaERlbHRhLngpfHwyMDxNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGEueSkpKSlyZXR1cm4gdGhpcy5oYW5kbGVDbGljayh0KTtkZWxldGUgdGhpcy50b3VjaERlbHRhfSx1cGRhdGVFZGdlQ2xhc3NlczpmdW5jdGlvbih0KXt0P3RoaXMuY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5sZWZ0RWRnZUNsYXNzKTp0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMubGVmdEVkZ2VDbGFzcyksdD09PXRoaXMubnVtLTE/dGhpcy5jb250YWluZXIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnJpZ2h0RWRnZUNsYXNzKTp0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMucmlnaHRFZGdlQ2xhc3MpfSx1cGRhdGVBY3RpdmVTbGlkZTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgaSxzLG49dGhpcy5zbGlkZXMsbz10aGlzLm9wdGlvbnMsYT1be2luZGV4OmUsbWV0aG9kOlwiYWRkQ2xhc3NcIixoaWRkZW46ITF9LHtpbmRleDp0LG1ldGhvZDpcInJlbW92ZUNsYXNzXCIsaGlkZGVuOiEwfV07YS5sZW5ndGg7KWk9YS5wb3AoKSxmKG5baS5pbmRleF0pW2kubWV0aG9kXShvLnNsaWRlQWN0aXZlQ2xhc3MpLHM9dGhpcy5jaXJjbGUoaS5pbmRleC0xKSwoby5jb250aW51b3VzfHxzPGkuaW5kZXgpJiZmKG5bc10pW2kubWV0aG9kXShvLnNsaWRlUHJldkNsYXNzKSxzPXRoaXMuY2lyY2xlKGkuaW5kZXgrMSksKG8uY29udGludW91c3x8cz5pLmluZGV4KSYmZihuW3NdKVtpLm1ldGhvZF0oby5zbGlkZU5leHRDbGFzcyk7dGhpcy5zbGlkZXNbdF0uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksdGhpcy5zbGlkZXNbZV0ucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIil9LGhhbmRsZVNsaWRlOmZ1bmN0aW9uKHQsZSl7dGhpcy5vcHRpb25zLmNvbnRpbnVvdXN8fHRoaXMudXBkYXRlRWRnZUNsYXNzZXMoZSksdGhpcy51cGRhdGVBY3RpdmVTbGlkZSh0LGUpLHRoaXMubG9hZEVsZW1lbnRzKGUpLHRoaXMub3B0aW9ucy51bmxvYWRFbGVtZW50cyYmdGhpcy51bmxvYWRFbGVtZW50cyh0LGUpLHRoaXMuc2V0VGl0bGUoZSl9LG9uc2xpZGU6ZnVuY3Rpb24odCl7dGhpcy5oYW5kbGVTbGlkZSh0aGlzLmluZGV4LHQpLHRoaXMuaW5kZXg9dCx0aGlzLnNldFRpbWVvdXQodGhpcy5vcHRpb25zLm9uc2xpZGUsW3QsdGhpcy5zbGlkZXNbdF1dKX0sc2V0VGl0bGU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5zbGlkZXNbdF0uZmlyc3RDaGlsZCx0PWUudGl0bGV8fGUuYWx0LGU9dGhpcy50aXRsZUVsZW1lbnQ7ZS5sZW5ndGgmJih0aGlzLnRpdGxlRWxlbWVudC5lbXB0eSgpLHQmJmVbMF0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodCkpKX0sc2V0VGltZW91dDpmdW5jdGlvbih0LGUsaSl7dmFyIHM9dGhpcztyZXR1cm4gdCYmd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmFwcGx5KHMsZXx8W10pfSxpfHwwKX0saW1hZ2VGYWN0b3J5OmZ1bmN0aW9uKHQsZSl7dmFyIGkscyxuLG8sYSxsLHIsaCxkPXRoaXMub3B0aW9ucyxjPXRoaXMsdT10LHA9dGhpcy5pbWFnZVByb3RvdHlwZS5jbG9uZU5vZGUoITEpO2lmKFwic3RyaW5nXCIhPXR5cGVvZiB1JiYodT10aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LGQudXJsUHJvcGVydHkpLG49dGhpcy5zdXBwb3J0LnBpY3R1cmUmJnRoaXMuc3VwcG9ydC5zb3VyY2UmJnRoaXMuZ2V0SXRlbVByb3BlcnR5KHQsZC5zb3VyY2VzUHJvcGVydHkpLG89dGhpcy5nZXRJdGVtUHJvcGVydHkodCxkLnNyY3NldFByb3BlcnR5KSxhPXRoaXMuZ2V0SXRlbVByb3BlcnR5KHQsZC5zaXplc1Byb3BlcnR5KSxsPXRoaXMuZ2V0SXRlbVByb3BlcnR5KHQsZC50aXRsZVByb3BlcnR5KSxyPXRoaXMuZ2V0SXRlbVByb3BlcnR5KHQsZC5hbHRUZXh0UHJvcGVydHkpfHxsKSxwLmRyYWdnYWJsZT0hMSxsJiYocC50aXRsZT1sKSxyJiYocC5hbHQ9ciksZihwKS5vbihcImxvYWQgZXJyb3JcIixmdW5jdGlvbiBtKHQpe2lmKCFzKXtpZighKHQ9e3R5cGU6dC50eXBlLHRhcmdldDppfHxwfSkudGFyZ2V0LnBhcmVudE5vZGUpcmV0dXJuIGMuc2V0VGltZW91dChtLFt0XSk7cz0hMCxmKHApLm9mZihcImxvYWQgZXJyb3JcIixtKSxlKHQpfX0pLG4mJm4ubGVuZ3RoKXtmb3IoaT10aGlzLnBpY3R1cmVQcm90b3R5cGUuY2xvbmVOb2RlKCExKSxoPTA7aDxuLmxlbmd0aDtoKz0xKWkuYXBwZW5kQ2hpbGQoZi5leHRlbmQodGhpcy5zb3VyY2VQcm90b3R5cGUuY2xvbmVOb2RlKCExKSxuW2hdKSk7aS5hcHBlbmRDaGlsZChwKSxmKGkpLmFkZENsYXNzKGQudG9nZ2xlQ2xhc3MpfXJldHVybiBvJiYoYSYmKHAuc2l6ZXM9YSkscC5zcmNzZXQ9bykscC5zcmM9dSxpfHxwfSxjcmVhdGVFbGVtZW50OmZ1bmN0aW9uKHQsZSl7dmFyIGk9dCYmdGhpcy5nZXRJdGVtUHJvcGVydHkodCx0aGlzLm9wdGlvbnMudHlwZVByb3BlcnR5KSxpPWkmJnRoaXNbaS5zcGxpdChcIi9cIilbMF0rXCJGYWN0b3J5XCJdfHx0aGlzLmltYWdlRmFjdG9yeSxpPXQmJmkuY2FsbCh0aGlzLHQsZSk7cmV0dXJuIGl8fChpPXRoaXMuZWxlbWVudFByb3RvdHlwZS5jbG9uZU5vZGUoITEpLHRoaXMuc2V0VGltZW91dChlLFt7dHlwZTpcImVycm9yXCIsdGFyZ2V0Oml9XSkpLGYoaSkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnNsaWRlQ29udGVudENsYXNzKSxpfSxpdGVyYXRlUHJlbG9hZFJhbmdlOmZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBpPXRoaXMubnVtLHM9dGhpcy5vcHRpb25zLG49TWF0aC5taW4oaSwyKnMucHJlbG9hZFJhbmdlKzEpLG89dCxhPTA7YTxuO2ErPTEpe2lmKChvKz1hKihhJTI9PTA/LTE6MSkpPDB8fGk8PW8pe2lmKCFzLmNvbnRpbnVvdXMpY29udGludWU7bz10aGlzLmNpcmNsZShvKX1lLmNhbGwodGhpcyxvKX19LGxvYWRFbGVtZW50OmZ1bmN0aW9uKHQpe3RoaXMuZWxlbWVudHNbdF18fCh0aGlzLnNsaWRlc1t0XS5maXJzdENoaWxkP3RoaXMuZWxlbWVudHNbdF09Zih0aGlzLnNsaWRlc1t0XSkuaGFzQ2xhc3ModGhpcy5vcHRpb25zLnNsaWRlRXJyb3JDbGFzcyk/MzoyOih0aGlzLmVsZW1lbnRzW3RdPTEsZih0aGlzLnNsaWRlc1t0XSkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnNsaWRlTG9hZGluZ0NsYXNzKSx0aGlzLnNsaWRlc1t0XS5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUVsZW1lbnQodGhpcy5saXN0W3RdLHRoaXMucHJveHlMaXN0ZW5lcikpKSl9LGxvYWRFbGVtZW50czpmdW5jdGlvbih0KXt0aGlzLml0ZXJhdGVQcmVsb2FkUmFuZ2UodCx0aGlzLmxvYWRFbGVtZW50KX0sdW5sb2FkRWxlbWVudHM6ZnVuY3Rpb24odCxpKXt2YXIgcz10aGlzLm9wdGlvbnMucHJlbG9hZFJhbmdlO3RoaXMuaXRlcmF0ZVByZWxvYWRSYW5nZSh0LGZ1bmN0aW9uKHQpe3ZhciBlPU1hdGguYWJzKHQtaSk7czxlJiZlK3M8dGhpcy5udW0mJih0aGlzLnVubG9hZFNsaWRlKHQpLGRlbGV0ZSB0aGlzLmVsZW1lbnRzW3RdKX0pfSxhZGRTbGlkZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLnNsaWRlUHJvdG90eXBlLmNsb25lTm9kZSghMSk7ZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsdCksZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSx0aGlzLnNsaWRlc0NvbnRhaW5lclswXS5hcHBlbmRDaGlsZChlKSx0aGlzLnNsaWRlcy5wdXNoKGUpfSxwb3NpdGlvblNsaWRlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuc2xpZGVzW3RdO2Uuc3R5bGUud2lkdGg9dGhpcy5zbGlkZVdpZHRoK1wicHhcIix0aGlzLnN1cHBvcnQudHJhbnNmb3JtJiYoZS5zdHlsZS5sZWZ0PXQqLXRoaXMuc2xpZGVXaWR0aCtcInB4XCIsdGhpcy5tb3ZlKHQsdGhpcy5pbmRleD50Py10aGlzLnNsaWRlV2lkdGg6dGhpcy5pbmRleDx0P3RoaXMuc2xpZGVXaWR0aDowLDApKX0saW5pdFNsaWRlczpmdW5jdGlvbih0KXt2YXIgZSxpO2Zvcih0fHwodGhpcy5wb3NpdGlvbnM9W10sdGhpcy5wb3NpdGlvbnMubGVuZ3RoPXRoaXMubnVtLHRoaXMuZWxlbWVudHM9e30sdGhpcy5waWN0dXJlUHJvdG90eXBlPXRoaXMuc3VwcG9ydC5waWN0dXJlJiZkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGljdHVyZVwiKSx0aGlzLnNvdXJjZVByb3RvdHlwZT10aGlzLnN1cHBvcnQuc291cmNlJiZkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic291cmNlXCIpLHRoaXMuaW1hZ2VQcm90b3R5cGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKSx0aGlzLmVsZW1lbnRQcm90b3R5cGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLnNsaWRlUHJvdG90eXBlPXRoaXMuZWxlbWVudFByb3RvdHlwZS5jbG9uZU5vZGUoITEpLGYodGhpcy5zbGlkZVByb3RvdHlwZSkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnNsaWRlQ2xhc3MpLHRoaXMuc2xpZGVzPXRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLmNoaWxkcmVuLGU9dGhpcy5vcHRpb25zLmNsZWFyU2xpZGVzfHx0aGlzLnNsaWRlcy5sZW5ndGghPT10aGlzLm51bSksdGhpcy5zbGlkZVdpZHRoPXRoaXMuY29udGFpbmVyWzBdLmNsaWVudFdpZHRoLHRoaXMuc2xpZGVIZWlnaHQ9dGhpcy5jb250YWluZXJbMF0uY2xpZW50SGVpZ2h0LHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLnN0eWxlLndpZHRoPXRoaXMubnVtKnRoaXMuc2xpZGVXaWR0aCtcInB4XCIsZSYmdGhpcy5yZXNldFNsaWRlcygpLGk9MDtpPHRoaXMubnVtO2krPTEpZSYmdGhpcy5hZGRTbGlkZShpKSx0aGlzLnBvc2l0aW9uU2xpZGUoaSk7dGhpcy5vcHRpb25zLmNvbnRpbnVvdXMmJnRoaXMuc3VwcG9ydC50cmFuc2Zvcm0mJih0aGlzLm1vdmUodGhpcy5jaXJjbGUodGhpcy5pbmRleC0xKSwtdGhpcy5zbGlkZVdpZHRoLDApLHRoaXMubW92ZSh0aGlzLmNpcmNsZSh0aGlzLmluZGV4KzEpLHRoaXMuc2xpZGVXaWR0aCwwKSksdGhpcy5zdXBwb3J0LnRyYW5zZm9ybXx8KHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLnN0eWxlLmxlZnQ9dGhpcy5pbmRleCotdGhpcy5zbGlkZVdpZHRoK1wicHhcIil9LHVubG9hZFNsaWRlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuc2xpZGVzW3RdLHQ9ZS5maXJzdENoaWxkO251bGwhPT10JiZlLnJlbW92ZUNoaWxkKHQpfSx1bmxvYWRBbGxTbGlkZXM6ZnVuY3Rpb24oKXtmb3IodmFyIHQ9MCxlPXRoaXMuc2xpZGVzLmxlbmd0aDt0PGU7dCsrKXRoaXMudW5sb2FkU2xpZGUodCl9LHRvZ2dsZUNvbnRyb2xzOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5vcHRpb25zLmNvbnRyb2xzQ2xhc3M7dGhpcy5jb250YWluZXIuaGFzQ2xhc3ModCk/dGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModCk6dGhpcy5jb250YWluZXIuYWRkQ2xhc3ModCl9LHRvZ2dsZVNsaWRlc2hvdzpmdW5jdGlvbigpe3RoaXMuaW50ZXJ2YWw/dGhpcy5wYXVzZSgpOnRoaXMucGxheSgpfSxnZXROb2RlSW5kZXg6ZnVuY3Rpb24odCl7cmV0dXJuIHBhcnNlSW50KHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKSwxMCl9LGdldE5lc3RlZFByb3BlcnR5OmZ1bmN0aW9uKG8sdCl7cmV0dXJuIHQucmVwbGFjZSgvXFxbKD86JyhbXiddKyknfFwiKFteXCJdKylcInwoXFxkKykpXFxdfCg/Oig/Ol58XFwuKShbXlxcLlxcW10rKSkvZyxmdW5jdGlvbih0LGUsaSxzLG4pe3M9bnx8ZXx8aXx8cyYmcGFyc2VJbnQocywxMCk7dCYmbyYmKG89b1tzXSl9KSxvfSxnZXREYXRhUHJvcGVydHk6ZnVuY3Rpb24odCxlKXt2YXIgaTtpZih0LmRhdGFzZXQ/KGk9ZS5yZXBsYWNlKC8tKFthLXpdKS9nLGZ1bmN0aW9uKHQsZSl7cmV0dXJuIGUudG9VcHBlckNhc2UoKX0pLGk9dC5kYXRhc2V0W2ldKTp0LmdldEF0dHJpYnV0ZSYmKGk9dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK2UucmVwbGFjZSgvKFtBLVpdKS9nLFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpKSxcInN0cmluZ1wiPT10eXBlb2YgaSl7aWYoL14odHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyhcXC5cXGQrKT98XFx7W1xcc1xcU10qXFx9fFxcW1tcXHNcXFNdKlxcXSkkLy50ZXN0KGkpKXRyeXtyZXR1cm4gZi5wYXJzZUpTT04oaSl9Y2F0Y2gocyl7fXJldHVybiBpfX0sZ2V0SXRlbVByb3BlcnR5OmZ1bmN0aW9uKHQsZSl7dmFyIGk9dGhpcy5nZXREYXRhUHJvcGVydHkodCxlKTtyZXR1cm4gaT0oaT1pPT09dW5kZWZpbmVkP3RbZV06aSk9PT11bmRlZmluZWQ/dGhpcy5nZXROZXN0ZWRQcm9wZXJ0eSh0LGUpOml9LGluaXRTdGFydEluZGV4OmZ1bmN0aW9uKCl7dmFyIHQsZT10aGlzLm9wdGlvbnMuaW5kZXgsaT10aGlzLm9wdGlvbnMudXJsUHJvcGVydHk7aWYoZSYmXCJudW1iZXJcIiE9dHlwZW9mIGUpZm9yKHQ9MDt0PHRoaXMubnVtO3QrPTEpaWYodGhpcy5saXN0W3RdPT09ZXx8dGhpcy5nZXRJdGVtUHJvcGVydHkodGhpcy5saXN0W3RdLGkpPT09dGhpcy5nZXRJdGVtUHJvcGVydHkoZSxpKSl7ZT10O2JyZWFrfXRoaXMuaW5kZXg9dGhpcy5jaXJjbGUocGFyc2VJbnQoZSwxMCl8fDApfSxpbml0RXZlbnRMaXN0ZW5lcnM6ZnVuY3Rpb24oKXt2YXIgaT10aGlzLHQ9dGhpcy5zbGlkZXNDb250YWluZXI7ZnVuY3Rpb24gZSh0KXt2YXIgZT1pLnN1cHBvcnQudHJhbnNpdGlvbiYmaS5zdXBwb3J0LnRyYW5zaXRpb24uZW5kPT09dC50eXBlP1widHJhbnNpdGlvbmVuZFwiOnQudHlwZTtpW1wib25cIitlXSh0KX1mKHdpbmRvdykub24oXCJyZXNpemVcIixlKSxmKHdpbmRvdykub24oXCJoYXNoY2hhbmdlXCIsZSksZihkb2N1bWVudC5ib2R5KS5vbihcImtleWRvd25cIixlKSx0aGlzLmNvbnRhaW5lci5vbihcImNsaWNrXCIsZSksdGhpcy5zdXBwb3J0LnRvdWNoP3Qub24oXCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiLGUpOnRoaXMub3B0aW9ucy5lbXVsYXRlVG91Y2hFdmVudHMmJnRoaXMuc3VwcG9ydC50cmFuc2l0aW9uJiZ0Lm9uKFwibW91c2Vkb3duIG1vdXNlbW92ZSBtb3VzZXVwIG1vdXNlb3V0XCIsZSksdGhpcy5zdXBwb3J0LnRyYW5zaXRpb24mJnQub24odGhpcy5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLGUpLHRoaXMucHJveHlMaXN0ZW5lcj1lfSxkZXN0cm95RXZlbnRMaXN0ZW5lcnM6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnNsaWRlc0NvbnRhaW5lcixlPXRoaXMucHJveHlMaXN0ZW5lcjtmKHdpbmRvdykub2ZmKFwicmVzaXplXCIsZSksZihkb2N1bWVudC5ib2R5KS5vZmYoXCJrZXlkb3duXCIsZSksdGhpcy5jb250YWluZXIub2ZmKFwiY2xpY2tcIixlKSx0aGlzLnN1cHBvcnQudG91Y2g/dC5vZmYoXCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiLGUpOnRoaXMub3B0aW9ucy5lbXVsYXRlVG91Y2hFdmVudHMmJnRoaXMuc3VwcG9ydC50cmFuc2l0aW9uJiZ0Lm9mZihcIm1vdXNlZG93biBtb3VzZW1vdmUgbW91c2V1cCBtb3VzZW91dFwiLGUpLHRoaXMuc3VwcG9ydC50cmFuc2l0aW9uJiZ0Lm9mZih0aGlzLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsZSl9LGhhbmRsZU9wZW46ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMub25vcGVuZWQmJnRoaXMub3B0aW9ucy5vbm9wZW5lZC5jYWxsKHRoaXMpfSxpbml0V2lkZ2V0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztyZXR1cm4gdGhpcy5jb250YWluZXI9Zih0aGlzLm9wdGlvbnMuY29udGFpbmVyKSx0aGlzLmNvbnRhaW5lci5sZW5ndGg/KHRoaXMuc2xpZGVzQ29udGFpbmVyPXRoaXMuY29udGFpbmVyLmZpbmQodGhpcy5vcHRpb25zLnNsaWRlc0NvbnRhaW5lcikuZmlyc3QoKSx0aGlzLnNsaWRlc0NvbnRhaW5lci5sZW5ndGg/KHRoaXMudGl0bGVFbGVtZW50PXRoaXMuY29udGFpbmVyLmZpbmQodGhpcy5vcHRpb25zLnRpdGxlRWxlbWVudCkuZmlyc3QoKSx0aGlzLnBsYXlQYXVzZUVsZW1lbnQ9dGhpcy5jb250YWluZXIuZmluZChcIi5cIit0aGlzLm9wdGlvbnMucGxheVBhdXNlQ2xhc3MpLmZpcnN0KCksMT09PXRoaXMubnVtJiZ0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuc2luZ2xlQ2xhc3MpLHRoaXMuc3VwcG9ydC5zdmdhc2ltZyYmdGhpcy5jb250YWluZXIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnN2Z2FzaW1nQ2xhc3MpLHRoaXMuc3VwcG9ydC5zbWlsJiZ0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuc21pbENsYXNzKSx0aGlzLm9wdGlvbnMub25vcGVuJiZ0aGlzLm9wdGlvbnMub25vcGVuLmNhbGwodGhpcyksdGhpcy5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMub3B0aW9ucy5kaXNwbGF5VHJhbnNpdGlvbj90aGlzLmNvbnRhaW5lci5vbih0aGlzLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsZnVuY3Rpb24gaSh0KXt0LnRhcmdldD09PWUuY29udGFpbmVyWzBdJiYoZS5jb250YWluZXIub2ZmKGUuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxpKSxlLmhhbmRsZU9wZW4oKSl9KTp0aGlzLmhhbmRsZU9wZW4oKSx0aGlzLm9wdGlvbnMuaGlkZVBhZ2VTY3JvbGxiYXJzJiYodGhpcy5ib2R5T3ZlcmZsb3dTdHlsZT1kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93LGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIiksdGhpcy5jb250YWluZXJbMF0uc3R5bGUuZGlzcGxheT1cImJsb2NrXCIsdGhpcy5pbml0U2xpZGVzKCksdm9pZCB0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuZGlzcGxheUNsYXNzKSk6KHRoaXMuY29uc29sZS5sb2coXCJibHVlaW1wIEdhbGxlcnk6IFNsaWRlcyBjb250YWluZXIgbm90IGZvdW5kLlwiLHRoaXMub3B0aW9ucy5zbGlkZXNDb250YWluZXIpLCExKSk6KHRoaXMuY29uc29sZS5sb2coXCJibHVlaW1wIEdhbGxlcnk6IFdpZGdldCBjb250YWluZXIgbm90IGZvdW5kLlwiLHRoaXMub3B0aW9ucy5jb250YWluZXIpLCExKX0saW5pdE9wdGlvbnM6ZnVuY3Rpb24odCl7dGhpcy5vcHRpb25zPWYuZXh0ZW5kKHt9LHRoaXMub3B0aW9ucyksKHQmJnQuY2Fyb3VzZWx8fHRoaXMub3B0aW9ucy5jYXJvdXNlbCYmKCF0fHwhMSE9PXQuY2Fyb3VzZWwpKSYmZi5leHRlbmQodGhpcy5vcHRpb25zLHRoaXMuY2Fyb3VzZWxPcHRpb25zKSxmLmV4dGVuZCh0aGlzLm9wdGlvbnMsdCksdGhpcy5udW08MyYmKHRoaXMub3B0aW9ucy5jb250aW51b3VzPSEhdGhpcy5vcHRpb25zLmNvbnRpbnVvdXMmJm51bGwpLHRoaXMuc3VwcG9ydC50cmFuc2l0aW9ufHwodGhpcy5vcHRpb25zLmVtdWxhdGVUb3VjaEV2ZW50cz0hMSksdGhpcy5vcHRpb25zLmV2ZW50JiZ0aGlzLnByZXZlbnREZWZhdWx0KHRoaXMub3B0aW9ucy5ldmVudCl9fSksaX0pLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiLi9ibHVlaW1wLWhlbHBlclwiLFwiLi9ibHVlaW1wLWdhbGxlcnlcIl0sdCk6dCh3aW5kb3cuYmx1ZWltcC5oZWxwZXJ8fHdpbmRvdy5qUXVlcnksd2luZG93LmJsdWVpbXAuR2FsbGVyeSl9KGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9ZS5wcm90b3R5cGU7dC5leHRlbmQoaS5vcHRpb25zLHtmdWxsc2NyZWVuOiExfSk7dmFyIHM9aS5pbml0aWFsaXplLG49aS5jbG9zZTtyZXR1cm4gdC5leHRlbmQoaSx7Z2V0RnVsbFNjcmVlbkVsZW1lbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnR8fGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50fHxkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudHx8ZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudH0scmVxdWVzdEZ1bGxTY3JlZW46ZnVuY3Rpb24odCl7dC5yZXF1ZXN0RnVsbHNjcmVlbj90LnJlcXVlc3RGdWxsc2NyZWVuKCk6dC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbj90LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk6dC5tb3pSZXF1ZXN0RnVsbFNjcmVlbj90Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk6dC5tc1JlcXVlc3RGdWxsc2NyZWVuJiZ0Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKX0sZXhpdEZ1bGxTY3JlZW46ZnVuY3Rpb24oKXtkb2N1bWVudC5leGl0RnVsbHNjcmVlbj9kb2N1bWVudC5leGl0RnVsbHNjcmVlbigpOmRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4/ZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpOmRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4/ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpOmRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4mJmRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKX0saW5pdGlhbGl6ZTpmdW5jdGlvbigpe3MuY2FsbCh0aGlzKSx0aGlzLm9wdGlvbnMuZnVsbHNjcmVlbiYmIXRoaXMuZ2V0RnVsbFNjcmVlbkVsZW1lbnQoKSYmdGhpcy5yZXF1ZXN0RnVsbFNjcmVlbih0aGlzLmNvbnRhaW5lclswXSl9LGNsb3NlOmZ1bmN0aW9uKCl7dGhpcy5nZXRGdWxsU2NyZWVuRWxlbWVudCgpPT09dGhpcy5jb250YWluZXJbMF0mJnRoaXMuZXhpdEZ1bGxTY3JlZW4oKSxuLmNhbGwodGhpcyl9fSksZX0pLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiLi9ibHVlaW1wLWhlbHBlclwiLFwiLi9ibHVlaW1wLWdhbGxlcnlcIl0sdCk6dCh3aW5kb3cuYmx1ZWltcC5oZWxwZXJ8fHdpbmRvdy5qUXVlcnksd2luZG93LmJsdWVpbXAuR2FsbGVyeSl9KGZ1bmN0aW9uKGEsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9dC5wcm90b3R5cGU7YS5leHRlbmQoZS5vcHRpb25zLHtpbmRpY2F0b3JDb250YWluZXI6XCJvbFwiLGFjdGl2ZUluZGljYXRvckNsYXNzOlwiYWN0aXZlXCIsdGh1bWJuYWlsUHJvcGVydHk6XCJ0aHVtYm5haWxcIix0aHVtYm5haWxJbmRpY2F0b3JzOiEwfSk7dmFyIGk9ZS5pbml0U2xpZGVzLHM9ZS5hZGRTbGlkZSxuPWUucmVzZXRTbGlkZXMsbz1lLmhhbmRsZUNsaWNrLGw9ZS5oYW5kbGVTbGlkZSxyPWUuaGFuZGxlQ2xvc2U7cmV0dXJuIGEuZXh0ZW5kKGUse2NyZWF0ZUluZGljYXRvcjpmdW5jdGlvbih0KXt2YXIgZSxpLHM9dGhpcy5pbmRpY2F0b3JQcm90b3R5cGUuY2xvbmVOb2RlKCExKSxuPXRoaXMuZ2V0SXRlbVByb3BlcnR5KHQsdGhpcy5vcHRpb25zLnRpdGxlUHJvcGVydHkpLG89dGhpcy5vcHRpb25zLnRodW1ibmFpbFByb3BlcnR5O3JldHVybiB0aGlzLm9wdGlvbnMudGh1bWJuYWlsSW5kaWNhdG9ycyYmKGU9KGU9bz90aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LG8pOmUpPT09dW5kZWZpbmVkJiYoaT10LmdldEVsZW1lbnRzQnlUYWdOYW1lJiZhKHQpLmZpbmQoXCJpbWdcIilbMF0pP2kuc3JjOmUpJiYocy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2U9J3VybChcIicrZSsnXCIpJyksbiYmKHMudGl0bGU9bikscy5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsXCJsaW5rXCIpLHN9LGFkZEluZGljYXRvcjpmdW5jdGlvbih0KXt2YXIgZTt0aGlzLmluZGljYXRvckNvbnRhaW5lci5sZW5ndGgmJigoZT10aGlzLmNyZWF0ZUluZGljYXRvcih0aGlzLmxpc3RbdF0pKS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsdCksdGhpcy5pbmRpY2F0b3JDb250YWluZXJbMF0uYXBwZW5kQ2hpbGQoZSksdGhpcy5pbmRpY2F0b3JzLnB1c2goZSkpfSxzZXRBY3RpdmVJbmRpY2F0b3I6ZnVuY3Rpb24odCl7dGhpcy5pbmRpY2F0b3JzJiYodGhpcy5hY3RpdmVJbmRpY2F0b3ImJnRoaXMuYWN0aXZlSW5kaWNhdG9yLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVJbmRpY2F0b3JDbGFzcyksdGhpcy5hY3RpdmVJbmRpY2F0b3I9YSh0aGlzLmluZGljYXRvcnNbdF0pLHRoaXMuYWN0aXZlSW5kaWNhdG9yLmFkZENsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVJbmRpY2F0b3JDbGFzcykpfSxpbml0U2xpZGVzOmZ1bmN0aW9uKHQpe3R8fCh0aGlzLmluZGljYXRvckNvbnRhaW5lcj10aGlzLmNvbnRhaW5lci5maW5kKHRoaXMub3B0aW9ucy5pbmRpY2F0b3JDb250YWluZXIpLHRoaXMuaW5kaWNhdG9yQ29udGFpbmVyLmxlbmd0aCYmKHRoaXMuaW5kaWNhdG9yUHJvdG90eXBlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKSx0aGlzLmluZGljYXRvcnM9dGhpcy5pbmRpY2F0b3JDb250YWluZXJbMF0uY2hpbGRyZW4pKSxpLmNhbGwodGhpcyx0KX0sYWRkU2xpZGU6ZnVuY3Rpb24odCl7cy5jYWxsKHRoaXMsdCksdGhpcy5hZGRJbmRpY2F0b3IodCl9LHJlc2V0U2xpZGVzOmZ1bmN0aW9uKCl7bi5jYWxsKHRoaXMpLHRoaXMuaW5kaWNhdG9yQ29udGFpbmVyLmVtcHR5KCksdGhpcy5pbmRpY2F0b3JzPVtdfSxoYW5kbGVDbGljazpmdW5jdGlvbih0KXt2YXIgZT10LnRhcmdldHx8dC5zcmNFbGVtZW50LGk9ZS5wYXJlbnROb2RlO2lmKGk9PT10aGlzLmluZGljYXRvckNvbnRhaW5lclswXSl0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMuc2xpZGUodGhpcy5nZXROb2RlSW5kZXgoZSkpO2Vsc2V7aWYoaS5wYXJlbnROb2RlIT09dGhpcy5pbmRpY2F0b3JDb250YWluZXJbMF0pcmV0dXJuIG8uY2FsbCh0aGlzLHQpO3RoaXMucHJldmVudERlZmF1bHQodCksdGhpcy5zbGlkZSh0aGlzLmdldE5vZGVJbmRleChpKSl9fSxoYW5kbGVTbGlkZTpmdW5jdGlvbih0LGUpe2wuY2FsbCh0aGlzLHQsZSksdGhpcy5zZXRBY3RpdmVJbmRpY2F0b3IoZSl9LGhhbmRsZUNsb3NlOmZ1bmN0aW9uKCl7dGhpcy5hY3RpdmVJbmRpY2F0b3ImJnRoaXMuYWN0aXZlSW5kaWNhdG9yLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVJbmRpY2F0b3JDbGFzcyksci5jYWxsKHRoaXMpfX0pLHR9KSxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcIi4vYmx1ZWltcC1oZWxwZXJcIixcIi4vYmx1ZWltcC1nYWxsZXJ5XCJdLHQpOnQod2luZG93LmJsdWVpbXAuaGVscGVyfHx3aW5kb3cualF1ZXJ5LHdpbmRvdy5ibHVlaW1wLkdhbGxlcnkpfShmdW5jdGlvbihDLHQpe1widXNlIHN0cmljdFwiO3ZhciBlPXQucHJvdG90eXBlO0MuZXh0ZW5kKGUub3B0aW9ucyx7dmlkZW9Db250ZW50Q2xhc3M6XCJ2aWRlby1jb250ZW50XCIsdmlkZW9Mb2FkaW5nQ2xhc3M6XCJ2aWRlby1sb2FkaW5nXCIsdmlkZW9QbGF5aW5nQ2xhc3M6XCJ2aWRlby1wbGF5aW5nXCIsdmlkZW9JZnJhbWVDbGFzczpcInZpZGVvLWlmcmFtZVwiLHZpZGVvQ292ZXJDbGFzczpcInZpZGVvLWNvdmVyXCIsdmlkZW9QbGF5Q2xhc3M6XCJ2aWRlby1wbGF5XCIsdmlkZW9QbGF5c0lubGluZTohMCx2aWRlb1ByZWxvYWRQcm9wZXJ0eTpcInByZWxvYWRcIix2aWRlb1Bvc3RlclByb3BlcnR5OlwicG9zdGVyXCJ9KTt2YXIgaT1lLmhhbmRsZVNsaWRlO3JldHVybiBDLmV4dGVuZChlLHtoYW5kbGVTbGlkZTpmdW5jdGlvbih0LGUpe2kuY2FsbCh0aGlzLHQsZSksdGhpcy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5hY3RpdmVWaWRlbyYmdGhpcy5hY3RpdmVWaWRlby5wYXVzZSgpfSl9LHZpZGVvRmFjdG9yeTpmdW5jdGlvbih0LGUsaSl7dmFyIHMsbixvLGE9dGhpcyxsPXRoaXMub3B0aW9ucyxyPXRoaXMuZWxlbWVudFByb3RvdHlwZS5jbG9uZU5vZGUoITEpLGg9QyhyKSxkPVt7dHlwZTpcImVycm9yXCIsdGFyZ2V0OnJ9XSxjPWl8fGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKSx1PXRoaXMuZWxlbWVudFByb3RvdHlwZS5jbG9uZU5vZGUoITEpLHA9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIiksbT10aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LGwudXJsUHJvcGVydHkpLGY9dGhpcy5nZXRJdGVtUHJvcGVydHkodCxsLnNvdXJjZXNQcm9wZXJ0eSkseT10aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LGwudGl0bGVQcm9wZXJ0eSksZz10aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LGwudmlkZW9Qb3N0ZXJQcm9wZXJ0eSksdj1bcF07aWYoaC5hZGRDbGFzcyhsLnZpZGVvQ29udGVudENsYXNzKSxDKHApLmFkZENsYXNzKGwudmlkZW9QbGF5Q2xhc3MpLEModSkuYWRkQ2xhc3MobC52aWRlb0NvdmVyQ2xhc3MpLmhhc0NsYXNzKGwudG9nZ2xlQ2xhc3MpfHx2LnB1c2godSksdS5kcmFnZ2FibGU9ITEseSYmKHIudGl0bGU9eSxwLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIix5KSksZyYmKHUuc3R5bGUuYmFja2dyb3VuZEltYWdlPSd1cmwoXCInK2crJ1wiKScpLGMuc2V0QXR0cmlidXRlP2wudmlkZW9QbGF5c0lubGluZSYmYy5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLFwiXCIpOmguYWRkQ2xhc3MobC52aWRlb0lmcmFtZUNsYXNzKSxjLnByZWxvYWQ9dGhpcy5nZXRJdGVtUHJvcGVydHkodCxsLnZpZGVvUHJlbG9hZFByb3BlcnR5KXx8XCJub25lXCIsdGhpcy5zdXBwb3J0LnNvdXJjZSYmZilmb3Iobz0wO288Zi5sZW5ndGg7bys9MSljLmFwcGVuZENoaWxkKEMuZXh0ZW5kKHRoaXMuc291cmNlUHJvdG90eXBlLmNsb25lTm9kZSghMSksZltvXSkpO3JldHVybiBtJiYoYy5zcmM9bSkscC5ocmVmPW18fGYmJmYubGVuZ3RoJiZmWzBdLnNyYyxjLnBsYXkmJmMucGF1c2UmJigoaXx8QyhjKSkub24oXCJlcnJvclwiLGZ1bmN0aW9uKCl7YS5zZXRUaW1lb3V0KGUsZCl9KS5vbihcInBhdXNlXCIsZnVuY3Rpb24oKXtjLnNlZWtpbmd8fChuPSExLGgucmVtb3ZlQ2xhc3MoYS5vcHRpb25zLnZpZGVvTG9hZGluZ0NsYXNzKS5yZW1vdmVDbGFzcyhhLm9wdGlvbnMudmlkZW9QbGF5aW5nQ2xhc3MpLHMmJmEuY29udGFpbmVyLmFkZENsYXNzKGEub3B0aW9ucy5jb250cm9sc0NsYXNzKSxjLmNvbnRyb2xzPSExLGM9PT1hLmFjdGl2ZVZpZGVvJiZkZWxldGUgYS5hY3RpdmVWaWRlbyxhLmludGVydmFsJiZhLnBsYXkoKSl9KS5vbihcInBsYXlpbmdcIixmdW5jdGlvbigpe249ITEsdS5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKSxoLnJlbW92ZUNsYXNzKGEub3B0aW9ucy52aWRlb0xvYWRpbmdDbGFzcykuYWRkQ2xhc3MoYS5vcHRpb25zLnZpZGVvUGxheWluZ0NsYXNzKX0pLm9uKFwicGxheVwiLGZ1bmN0aW9uKCl7d2luZG93LmNsZWFyVGltZW91dChhLnRpbWVvdXQpLG49ITAsaC5hZGRDbGFzcyhhLm9wdGlvbnMudmlkZW9Mb2FkaW5nQ2xhc3MpLGEuY29udGFpbmVyLmhhc0NsYXNzKGEub3B0aW9ucy5jb250cm9sc0NsYXNzKT8ocz0hMCxhLmNvbnRhaW5lci5yZW1vdmVDbGFzcyhhLm9wdGlvbnMuY29udHJvbHNDbGFzcykpOnM9ITEsYy5jb250cm9scz0hMCxhLmFjdGl2ZVZpZGVvPWN9KSxDKHYpLm9uKFwiY2xpY2tcIixmdW5jdGlvbih0KXthLnByZXZlbnREZWZhdWx0KHQpLGEuYWN0aXZlVmlkZW89YyxuP2MucGF1c2UoKTpjLnBsYXkoKX0pLHIuYXBwZW5kQ2hpbGQoaSYmaS5lbGVtZW50fHxjKSksci5hcHBlbmRDaGlsZCh1KSxyLmFwcGVuZENoaWxkKHApLHRoaXMuc2V0VGltZW91dChlLFt7dHlwZTpcImxvYWRcIix0YXJnZXQ6cn1dKSxyfX0pLHR9KSxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcIi4vYmx1ZWltcC1oZWxwZXJcIixcIi4vYmx1ZWltcC1nYWxsZXJ5LXZpZGVvXCJdLHQpOnQod2luZG93LmJsdWVpbXAuaGVscGVyfHx3aW5kb3cualF1ZXJ5LHdpbmRvdy5ibHVlaW1wLkdhbGxlcnkpfShmdW5jdGlvbihsLHQpe1widXNlIHN0cmljdFwiO2lmKCF3aW5kb3cucG9zdE1lc3NhZ2UpcmV0dXJuIHQ7dmFyIGU9dC5wcm90b3R5cGU7bC5leHRlbmQoZS5vcHRpb25zLHt2aW1lb1ZpZGVvSWRQcm9wZXJ0eTpcInZpbWVvXCIsdmltZW9QbGF5ZXJVcmw6XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vVklERU9fSUQ/YXBpPTEmcGxheWVyX2lkPVBMQVlFUl9JRFwiLHZpbWVvUGxheWVySWRQcmVmaXg6XCJ2aW1lby1wbGF5ZXItXCIsdmltZW9DbGlja1RvUGxheTohMX0pO3ZhciBuPWUudGV4dEZhY3Rvcnl8fGUuaW1hZ2VGYWN0b3J5LG89ZnVuY3Rpb24odCxlLGkscyl7dGhpcy51cmw9dCx0aGlzLnZpZGVvSWQ9ZSx0aGlzLnBsYXllcklkPWksdGhpcy5jbGlja1RvUGxheT1zLHRoaXMuZWxlbWVudD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHRoaXMubGlzdGVuZXJzPXt9fSxhPTA7cmV0dXJuIGwuZXh0ZW5kKG8ucHJvdG90eXBlLHtvbjpmdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLmxpc3RlbmVyc1t0XT1lLHRoaXN9LGxvYWRBUEk6ZnVuY3Rpb24oKXt2YXIgdCxlLGk9dGhpcyxzPVwiaHR0cHM6Ly9mLnZpbWVvY2RuLmNvbS9qcy9mcm9vZ2Fsb29wMi5taW4uanNcIixuPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpLG89bi5sZW5ndGg7ZnVuY3Rpb24gYSgpeyFlJiZpLnBsYXlPblJlYWR5JiZpLnBsYXkoKSxlPSEwfWZvcig7bzspaWYoblstLW9dLnNyYz09PXMpe3Q9bltvXTticmVha310fHwoKHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkuc3JjPXMpLGwodCkub24oXCJsb2FkXCIsYSksblswXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0LG5bMF0pLC9sb2FkZWR8Y29tcGxldGUvLnRlc3QodC5yZWFkeVN0YXRlKSYmYSgpfSxvblJlYWR5OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLnJlYWR5PSEwLHRoaXMucGxheWVyLmFkZEV2ZW50KFwicGxheVwiLGZ1bmN0aW9uKCl7dC5oYXNQbGF5ZWQ9ITAsdC5vblBsYXlpbmcoKX0pLHRoaXMucGxheWVyLmFkZEV2ZW50KFwicGF1c2VcIixmdW5jdGlvbigpe3Qub25QYXVzZSgpfSksdGhpcy5wbGF5ZXIuYWRkRXZlbnQoXCJmaW5pc2hcIixmdW5jdGlvbigpe3Qub25QYXVzZSgpfSksdGhpcy5wbGF5T25SZWFkeSYmdGhpcy5wbGF5KCl9LG9uUGxheWluZzpmdW5jdGlvbigpe3RoaXMucGxheVN0YXR1czwyJiYodGhpcy5saXN0ZW5lcnMucGxheWluZygpLHRoaXMucGxheVN0YXR1cz0yKX0sb25QYXVzZTpmdW5jdGlvbigpe3RoaXMubGlzdGVuZXJzLnBhdXNlKCksZGVsZXRlIHRoaXMucGxheVN0YXR1c30saW5zZXJ0SWZyYW1lOmZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTt0LnNyYz10aGlzLnVybC5yZXBsYWNlKFwiVklERU9fSURcIix0aGlzLnZpZGVvSWQpLnJlcGxhY2UoXCJQTEFZRVJfSURcIix0aGlzLnBsYXllcklkKSx0LmlkPXRoaXMucGxheWVySWQsdC5hbGxvdz1cImF1dG9wbGF5XCIsdGhpcy5lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHQsdGhpcy5lbGVtZW50KSx0aGlzLmVsZW1lbnQ9dH0scGxheTpmdW5jdGlvbigpe3ZhciB0PXRoaXM7dGhpcy5wbGF5U3RhdHVzfHwodGhpcy5saXN0ZW5lcnMucGxheSgpLHRoaXMucGxheVN0YXR1cz0xKSx0aGlzLnJlYWR5PyF0aGlzLmhhc1BsYXllZCYmKHRoaXMuY2xpY2tUb1BsYXl8fHdpbmRvdy5uYXZpZ2F0b3ImJi9pUChob25lfG9kfGFkKS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnBsYXRmb3JtKSk/dGhpcy5vblBsYXlpbmcoKTp0aGlzLnBsYXllci5hcGkoXCJwbGF5XCIpOih0aGlzLnBsYXlPblJlYWR5PSEwLHdpbmRvdy4kZj90aGlzLnBsYXllcnx8KHRoaXMuaW5zZXJ0SWZyYW1lKCksdGhpcy5wbGF5ZXI9JGYodGhpcy5lbGVtZW50KSx0aGlzLnBsYXllci5hZGRFdmVudChcInJlYWR5XCIsZnVuY3Rpb24oKXt0Lm9uUmVhZHkoKX0pKTp0aGlzLmxvYWRBUEkoKSl9LHBhdXNlOmZ1bmN0aW9uKCl7dGhpcy5yZWFkeT90aGlzLnBsYXllci5hcGkoXCJwYXVzZVwiKTp0aGlzLnBsYXlTdGF0dXMmJihkZWxldGUgdGhpcy5wbGF5T25SZWFkeSx0aGlzLmxpc3RlbmVycy5wYXVzZSgpLGRlbGV0ZSB0aGlzLnBsYXlTdGF0dXMpfX0pLGwuZXh0ZW5kKGUse1ZpbWVvUGxheWVyOm8sdGV4dEZhY3Rvcnk6ZnVuY3Rpb24odCxlKXt2YXIgaT10aGlzLm9wdGlvbnMscz10aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LGkudmltZW9WaWRlb0lkUHJvcGVydHkpO3JldHVybiBzPyh0aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LGkudXJsUHJvcGVydHkpPT09dW5kZWZpbmVkJiYodFtpLnVybFByb3BlcnR5XT1cImh0dHBzOi8vdmltZW8uY29tL1wiK3MpLGErPTEsdGhpcy52aWRlb0ZhY3RvcnkodCxlLG5ldyBvKGkudmltZW9QbGF5ZXJVcmwscyxpLnZpbWVvUGxheWVySWRQcmVmaXgrYSxpLnZpbWVvQ2xpY2tUb1BsYXkpKSk6bi5jYWxsKHRoaXMsdCxlKX19KSx0fSksZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCIuL2JsdWVpbXAtaGVscGVyXCIsXCIuL2JsdWVpbXAtZ2FsbGVyeS12aWRlb1wiXSx0KTp0KHdpbmRvdy5ibHVlaW1wLmhlbHBlcnx8d2luZG93LmpRdWVyeSx3aW5kb3cuYmx1ZWltcC5HYWxsZXJ5KX0oZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtpZighd2luZG93LnBvc3RNZXNzYWdlKXJldHVybiBlO3ZhciBpPWUucHJvdG90eXBlO3QuZXh0ZW5kKGkub3B0aW9ucyx7eW91VHViZVZpZGVvSWRQcm9wZXJ0eTpcInlvdXR1YmVcIix5b3VUdWJlUGxheWVyVmFyczp7d21vZGU6XCJ0cmFuc3BhcmVudFwifSx5b3VUdWJlQ2xpY2tUb1BsYXk6ITF9KTt2YXIgbj1pLnRleHRGYWN0b3J5fHxpLmltYWdlRmFjdG9yeSxvPWZ1bmN0aW9uKHQsZSxpKXt0aGlzLnZpZGVvSWQ9dCx0aGlzLnBsYXllclZhcnM9ZSx0aGlzLmNsaWNrVG9QbGF5PWksdGhpcy5lbGVtZW50PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdGhpcy5saXN0ZW5lcnM9e319O3JldHVybiB0LmV4dGVuZChvLnByb3RvdHlwZSx7b246ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5saXN0ZW5lcnNbdF09ZSx0aGlzfSxsb2FkQVBJOmZ1bmN0aW9uKCl7dmFyIHQsZT10aGlzLGk9d2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5LHM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9pZnJhbWVfYXBpXCIsbj1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSxvPW4ubGVuZ3RoO2Zvcih3aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHk9ZnVuY3Rpb24oKXtpJiZpLmFwcGx5KHRoaXMpLGUucGxheU9uUmVhZHkmJmUucGxheSgpfTtvOylpZihuWy0tb10uc3JjPT09cylyZXR1cm47KHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkuc3JjPXMsblswXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0LG5bMF0pfSxvblJlYWR5OmZ1bmN0aW9uKCl7dGhpcy5yZWFkeT0hMCx0aGlzLnBsYXlPblJlYWR5JiZ0aGlzLnBsYXkoKX0sb25QbGF5aW5nOmZ1bmN0aW9uKCl7dGhpcy5wbGF5U3RhdHVzPDImJih0aGlzLmxpc3RlbmVycy5wbGF5aW5nKCksdGhpcy5wbGF5U3RhdHVzPTIpfSxvblBhdXNlOmZ1bmN0aW9uKCl7dGhpcy5saXN0ZW5lcnMucGF1c2UoKSxkZWxldGUgdGhpcy5wbGF5U3RhdHVzfSxvblN0YXRlQ2hhbmdlOmZ1bmN0aW9uKHQpe3N3aXRjaCh3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMucGF1c2VUaW1lb3V0KSx0LmRhdGEpe2Nhc2UgWVQuUGxheWVyU3RhdGUuUExBWUlORzp0aGlzLmhhc1BsYXllZD0hMCx0aGlzLm9uUGxheWluZygpO2JyZWFrO2Nhc2UgWVQuUGxheWVyU3RhdGUuVU5TVEFSVEVEOmNhc2UgWVQuUGxheWVyU3RhdGUuUEFVU0VEOnRoaXMucGF1c2VUaW1lb3V0PWkuc2V0VGltZW91dC5jYWxsKHRoaXMsdGhpcy5vblBhdXNlLG51bGwsNTAwKTticmVhaztjYXNlIFlULlBsYXllclN0YXRlLkVOREVEOnRoaXMub25QYXVzZSgpfX0sb25FcnJvcjpmdW5jdGlvbih0KXt0aGlzLmxpc3RlbmVycy5lcnJvcih0KX0scGxheTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5wbGF5U3RhdHVzfHwodGhpcy5saXN0ZW5lcnMucGxheSgpLHRoaXMucGxheVN0YXR1cz0xKSx0aGlzLnJlYWR5PyF0aGlzLmhhc1BsYXllZCYmKHRoaXMuY2xpY2tUb1BsYXl8fHdpbmRvdy5uYXZpZ2F0b3ImJi9pUChob25lfG9kfGFkKS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnBsYXRmb3JtKSk/dGhpcy5vblBsYXlpbmcoKTp0aGlzLnBsYXllci5wbGF5VmlkZW8oKToodGhpcy5wbGF5T25SZWFkeT0hMCx3aW5kb3cuWVQmJllULlBsYXllcj90aGlzLnBsYXllcnx8KHRoaXMucGxheWVyPW5ldyBZVC5QbGF5ZXIodGhpcy5lbGVtZW50LHt2aWRlb0lkOnRoaXMudmlkZW9JZCxwbGF5ZXJWYXJzOnRoaXMucGxheWVyVmFycyxldmVudHM6e29uUmVhZHk6ZnVuY3Rpb24oKXtlLm9uUmVhZHkoKX0sb25TdGF0ZUNoYW5nZTpmdW5jdGlvbih0KXtlLm9uU3RhdGVDaGFuZ2UodCl9LG9uRXJyb3I6ZnVuY3Rpb24odCl7ZS5vbkVycm9yKHQpfX19KSk6dGhpcy5sb2FkQVBJKCkpfSxwYXVzZTpmdW5jdGlvbigpe3RoaXMucmVhZHk/dGhpcy5wbGF5ZXIucGF1c2VWaWRlbygpOnRoaXMucGxheVN0YXR1cyYmKGRlbGV0ZSB0aGlzLnBsYXlPblJlYWR5LHRoaXMubGlzdGVuZXJzLnBhdXNlKCksZGVsZXRlIHRoaXMucGxheVN0YXR1cyl9fSksdC5leHRlbmQoaSx7WW91VHViZVBsYXllcjpvLHRleHRGYWN0b3J5OmZ1bmN0aW9uKHQsZSl7dmFyIGk9dGhpcy5vcHRpb25zLHM9dGhpcy5nZXRJdGVtUHJvcGVydHkodCxpLnlvdVR1YmVWaWRlb0lkUHJvcGVydHkpO3JldHVybiBzPyh0aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LGkudXJsUHJvcGVydHkpPT09dW5kZWZpbmVkJiYodFtpLnVybFByb3BlcnR5XT1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9XCIrcyksdGhpcy5nZXRJdGVtUHJvcGVydHkodCxpLnZpZGVvUG9zdGVyUHJvcGVydHkpPT09dW5kZWZpbmVkJiYodFtpLnZpZGVvUG9zdGVyUHJvcGVydHldPVwiaHR0cHM6Ly9pbWcueW91dHViZS5jb20vdmkvXCIrcytcIi9tYXhyZXNkZWZhdWx0LmpwZ1wiKSx0aGlzLnZpZGVvRmFjdG9yeSh0LGUsbmV3IG8ocyxpLnlvdVR1YmVQbGF5ZXJWYXJzLGkueW91VHViZUNsaWNrVG9QbGF5KSkpOm4uY2FsbCh0aGlzLHQsZSl9fSksZX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Ymx1ZWltcC1nYWxsZXJ5Lm1pbi5qcy5tYXAiLCIvKlxuICogYmx1ZWltcCBoZWxwZXIgSlNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ibHVlaW1wL0dhbGxlcnlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuXG47KGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnXG5cbiAgLyoqXG4gICAqIE9iamVjdC5hc3NpZ24gcG9seWZpbGxcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG9iajEgRmlyc3Qgb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmoyIFNlY29uZCBvYmplY3RcbiAgICogQHJldHVybnMge29iamVjdH0gTWVyZ2VkIG9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gZXh0ZW5kKG9iajEsIG9iajIpIHtcbiAgICB2YXIgcHJvcFxuICAgIGZvciAocHJvcCBpbiBvYmoyKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iajIsIHByb3ApKSB7XG4gICAgICAgIG9iajFbcHJvcF0gPSBvYmoyW3Byb3BdXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmoxXG4gIH1cbiAgLyoqXG4gICAqIEhlbHBlciBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHsqfSBxdWVyeSBqUXVlcnkgdHlwZSBxdWVyeSBhcmd1bWVudFxuICAgKi9cbiAgZnVuY3Rpb24gSGVscGVyKHF1ZXJ5KSB7XG4gICAgaWYgKCF0aGlzIHx8IHRoaXMuZmluZCAhPT0gSGVscGVyLnByb3RvdHlwZS5maW5kKSB7XG4gICAgICAvLyBDYWxsZWQgYXMgZnVuY3Rpb24gaW5zdGVhZCBvZiBhcyBjb25zdHJ1Y3RvcixcbiAgICAgIC8vIHNvIHdlIHNpbXBseSByZXR1cm4gYSBuZXcgaW5zdGFuY2U6XG4gICAgICByZXR1cm4gbmV3IEhlbHBlcihxdWVyeSlcbiAgICB9XG4gICAgdGhpcy5sZW5ndGggPSAwXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICBpZiAodHlwZW9mIHF1ZXJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBxdWVyeSA9IHRoaXMuZmluZChxdWVyeSlcbiAgICAgIH1cbiAgICAgIGlmIChxdWVyeS5ub2RlVHlwZSB8fCBxdWVyeSA9PT0gcXVlcnkud2luZG93KSB7XG4gICAgICAgIC8vIFNpbmdsZSBIVE1MIGVsZW1lbnRcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxXG4gICAgICAgIHRoaXNbMF0gPSBxdWVyeVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSFRNTCBlbGVtZW50IGNvbGxlY3Rpb25cbiAgICAgICAgdmFyIGkgPSBxdWVyeS5sZW5ndGhcbiAgICAgICAgdGhpcy5sZW5ndGggPSBpXG4gICAgICAgIHdoaWxlIChpKSB7XG4gICAgICAgICAgaSAtPSAxXG4gICAgICAgICAgdGhpc1tpXSA9IHF1ZXJ5W2ldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBIZWxwZXIuZXh0ZW5kID0gZXh0ZW5kXG5cbiAgSGVscGVyLmNvbnRhaW5zID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZWxlbWVudCkge1xuICAgIGRvIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9IHdoaWxlIChlbGVtZW50KVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgSGVscGVyLnBhcnNlSlNPTiA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzdHJpbmcpXG4gIH1cblxuICBleHRlbmQoSGVscGVyLnByb3RvdHlwZSwge1xuICAgIGZpbmQ6IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXNbMF0gfHwgZG9jdW1lbnRcbiAgICAgIGlmICh0eXBlb2YgcXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmIChjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgICAgIHF1ZXJ5ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpXG4gICAgICAgIH0gZWxzZSBpZiAocXVlcnkuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgICBxdWVyeSA9IGNvbnRhaW5lci5nZXRFbGVtZW50QnlJZChxdWVyeS5zbGljZSgxKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBxdWVyeSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZShxdWVyeSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBIZWxwZXIocXVlcnkpXG4gICAgfSxcblxuICAgIGhhc0NsYXNzOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoIXRoaXNbMF0pIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMrKScgKyBjbGFzc05hbWUgKyAnKD86XFxcXHMrfCQpJykudGVzdChcbiAgICAgICAgdGhpc1swXS5jbGFzc05hbWVcbiAgICAgIClcbiAgICB9LFxuXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIHZhciBpID0gdGhpcy5sZW5ndGhcbiAgICAgIHZhciBjbGFzc05hbWVzXG4gICAgICB2YXIgZWxlbWVudFxuICAgICAgdmFyIGpcbiAgICAgIHdoaWxlIChpKSB7XG4gICAgICAgIGkgLT0gMVxuICAgICAgICBlbGVtZW50ID0gdGhpc1tpXVxuICAgICAgICBpZiAoIWVsZW1lbnQuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWVcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIGlmICghY2xhc3NOYW1lcykgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBjbGFzc05hbWVzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lc1tqXSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZXNbal1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIE1hdGNoIGFueSBvZiB0aGUgZ2l2ZW4gY2xhc3MgbmFtZXNcbiAgICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCdeKD86JyArIGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLmpvaW4oJ3wnKSArICcpJCcpXG4gICAgICAvLyBNYXRjaCBhbnkgY2xhc3MgbmFtZXMgYW5kIHRoZWlyIHRyYWlsaW5nIHdoaXRlc3BhY2VcbiAgICAgIHZhciBtYXRjaGVyID0gLyhcXFMrKSg/Olxccyt8JCkvZ1xuICAgICAgdmFyIHJlcGxhY2VyID0gZnVuY3Rpb24gKG1hdGNoLCBjbGFzc05hbWUpIHtcbiAgICAgICAgLy8gUmVwbGFjZSBjbGFzcyBuYW1lcyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBvbmVzXG4gICAgICAgIHJldHVybiByZWdleHAudGVzdChjbGFzc05hbWUpID8gJycgOiBtYXRjaFxuICAgICAgfVxuICAgICAgdmFyIHRyaW1FbmQgPSAvXFxzKyQvXG4gICAgICB2YXIgaSA9IHRoaXMubGVuZ3RoXG4gICAgICB2YXIgZWxlbWVudFxuICAgICAgd2hpbGUgKGkpIHtcbiAgICAgICAgaSAtPSAxXG4gICAgICAgIGVsZW1lbnQgPSB0aGlzW2ldXG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICAgICAgICAucmVwbGFjZShtYXRjaGVyLCByZXBsYWNlcilcbiAgICAgICAgICAucmVwbGFjZSh0cmltRW5kLCAnJylcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICB2YXIgZXZlbnROYW1lcyA9IGV2ZW50TmFtZS5zcGxpdCgvXFxzKy8pXG4gICAgICB2YXIgaVxuICAgICAgdmFyIGVsZW1lbnRcbiAgICAgIHdoaWxlIChldmVudE5hbWVzLmxlbmd0aCkge1xuICAgICAgICBldmVudE5hbWUgPSBldmVudE5hbWVzLnNoaWZ0KClcbiAgICAgICAgaSA9IHRoaXMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpKSB7XG4gICAgICAgICAgaSAtPSAxXG4gICAgICAgICAgZWxlbWVudCA9IHRoaXNbaV1cbiAgICAgICAgICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSlcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIG9mZjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgdmFyIGV2ZW50TmFtZXMgPSBldmVudE5hbWUuc3BsaXQoL1xccysvKVxuICAgICAgdmFyIGlcbiAgICAgIHZhciBlbGVtZW50XG4gICAgICB3aGlsZSAoZXZlbnROYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgZXZlbnROYW1lID0gZXZlbnROYW1lcy5zaGlmdCgpXG4gICAgICAgIGkgPSB0aGlzLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaSkge1xuICAgICAgICAgIGkgLT0gMVxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzW2ldXG4gICAgICAgICAgaWYgKGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmRldGFjaEV2ZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LmRldGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBlbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGkgPSB0aGlzLmxlbmd0aFxuICAgICAgdmFyIGVsZW1lbnRcbiAgICAgIHdoaWxlIChpKSB7XG4gICAgICAgIGkgLT0gMVxuICAgICAgICBlbGVtZW50ID0gdGhpc1tpXVxuICAgICAgICB3aGlsZSAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQubGFzdENoaWxkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBmaXJzdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBIZWxwZXIodGhpc1swXSlcbiAgICB9XG4gIH0pXG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gSGVscGVyXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuYmx1ZWltcCA9IHdpbmRvdy5ibHVlaW1wIHx8IHt9XG4gICAgd2luZG93LmJsdWVpbXAuaGVscGVyID0gSGVscGVyXG4gIH1cbn0pKClcbiIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKHQpOihlPWV8fHNlbGYpLkdMaWdodGJveD10KCl9KHRoaXMsKGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gZShlKXt2YXIgdD1mdW5jdGlvbihlLHQpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiBlfHwhZSlyZXR1cm4gZTt2YXIgaT1lW1N5bWJvbC50b1ByaW1pdGl2ZV07aWYodm9pZCAwIT09aSl7dmFyIG49aS5jYWxsKGUsdHx8XCJkZWZhdWx0XCIpO2lmKFwib2JqZWN0XCIhPXR5cGVvZiBuKXJldHVybiBuO3Rocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKX1yZXR1cm4oXCJzdHJpbmdcIj09PXQ/U3RyaW5nOk51bWJlcikoZSl9KGUsXCJzdHJpbmdcIik7cmV0dXJuXCJzeW1ib2xcIj09dHlwZW9mIHQ/dDp0K1wiXCJ9ZnVuY3Rpb24gdChlKXtyZXR1cm4odD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24oZSl7cmV0dXJuIHR5cGVvZiBlfTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiBlfSkoZSl9ZnVuY3Rpb24gaShlLHQpe2lmKCEoZSBpbnN0YW5jZW9mIHQpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9ZnVuY3Rpb24gbih0LGkpe2Zvcih2YXIgbj0wO248aS5sZW5ndGg7bisrKXt2YXIgcz1pW25dO3MuZW51bWVyYWJsZT1zLmVudW1lcmFibGV8fCExLHMuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHMmJihzLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxlKHMua2V5KSxzKX19ZnVuY3Rpb24gcyhlLHQsaSl7cmV0dXJuIHQmJm4oZS5wcm90b3R5cGUsdCksaSYmbihlLGkpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwicHJvdG90eXBlXCIse3dyaXRhYmxlOiExfSksZX12YXIgbD1EYXRlLm5vdygpO2Z1bmN0aW9uIG8oKXt2YXIgZT17fSx0PSEwLGk9MCxuPWFyZ3VtZW50cy5sZW5ndGg7XCJbb2JqZWN0IEJvb2xlYW5dXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnRzWzBdKSYmKHQ9YXJndW1lbnRzWzBdLGkrKyk7Zm9yKHZhciBzPWZ1bmN0aW9uKGkpe2Zvcih2YXIgbiBpbiBpKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChpLG4pJiYodCYmXCJbb2JqZWN0IE9iamVjdF1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpW25dKT9lW25dPW8oITAsZVtuXSxpW25dKTplW25dPWlbbl0pfTtpPG47aSsrKXt2YXIgbD1hcmd1bWVudHNbaV07cyhsKX1yZXR1cm4gZX1mdW5jdGlvbiByKGUsdCl7aWYoKEUoZSl8fGU9PT13aW5kb3d8fGU9PT1kb2N1bWVudCkmJihlPVtlXSksTChlKXx8SShlKXx8KGU9W2VdKSwwIT1NKGUpKWlmKEwoZSkmJiFJKGUpKWZvcih2YXIgaT1lLmxlbmd0aCxuPTA7bjxpJiYhMSE9PXQuY2FsbChlW25dLGVbbl0sbixlKTtuKyspO2Vsc2UgaWYoSShlKSlmb3IodmFyIHMgaW4gZSlpZihQKGUscykmJiExPT09dC5jYWxsKGVbc10sZVtzXSxzLGUpKWJyZWFrfWZ1bmN0aW9uIGEoZSl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOm51bGwsaT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06bnVsbCxuPWVbbF09ZVtsXXx8W10scz17YWxsOm4sZXZ0Om51bGwsZm91bmQ6bnVsbH07cmV0dXJuIHQmJmkmJk0obik+MCYmcihuLChmdW5jdGlvbihlLG4pe2lmKGUuZXZlbnROYW1lPT10JiZlLmZuLnRvU3RyaW5nKCk9PWkudG9TdHJpbmcoKSlyZXR1cm4gcy5mb3VuZD0hMCxzLmV2dD1uLCExfSkpLHN9ZnVuY3Rpb24gaChlKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06e30saT10Lm9uRWxlbWVudCxuPXQud2l0aENhbGxiYWNrLHM9dC5hdm9pZER1cGxpY2F0ZSxsPXZvaWQgMD09PXN8fHMsbz10Lm9uY2UsaD12b2lkIDAhPT1vJiZvLGQ9dC51c2VDYXB0dXJlLGM9dm9pZCAwIT09ZCYmZCx1PWFyZ3VtZW50cy5sZW5ndGg+Mj9hcmd1bWVudHNbMl06dm9pZCAwLGc9aXx8W107ZnVuY3Rpb24gdihlKXtDKG4pJiZuLmNhbGwodSxlLHRoaXMpLGgmJnYuZGVzdHJveSgpfXJldHVybiBrKGcpJiYoZz1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGcpKSx2LmRlc3Ryb3k9ZnVuY3Rpb24oKXtyKGcsKGZ1bmN0aW9uKHQpe3ZhciBpPWEodCxlLHYpO2kuZm91bmQmJmkuYWxsLnNwbGljZShpLmV2dCwxKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXImJnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLHYsYyl9KSl9LHIoZywoZnVuY3Rpb24odCl7dmFyIGk9YSh0LGUsdik7KHQuYWRkRXZlbnRMaXN0ZW5lciYmbCYmIWkuZm91bmR8fCFsKSYmKHQuYWRkRXZlbnRMaXN0ZW5lcihlLHYsYyksaS5hbGwucHVzaCh7ZXZlbnROYW1lOmUsZm46dn0pKX0pKSx2fWZ1bmN0aW9uIGQoZSx0KXtyKHQuc3BsaXQoXCIgXCIpLChmdW5jdGlvbih0KXtyZXR1cm4gZS5jbGFzc0xpc3QuYWRkKHQpfSkpfWZ1bmN0aW9uIGMoZSx0KXtyKHQuc3BsaXQoXCIgXCIpLChmdW5jdGlvbih0KXtyZXR1cm4gZS5jbGFzc0xpc3QucmVtb3ZlKHQpfSkpfWZ1bmN0aW9uIHUoZSx0KXtyZXR1cm4gZS5jbGFzc0xpc3QuY29udGFpbnModCl9ZnVuY3Rpb24gZyhlLHQpe2Zvcig7ZSE9PWRvY3VtZW50LmJvZHk7KXtpZighKGU9ZS5wYXJlbnRFbGVtZW50KSlyZXR1cm4hMTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLm1hdGNoZXM/ZS5tYXRjaGVzKHQpOmUubXNNYXRjaGVzU2VsZWN0b3IodCkpcmV0dXJuIGV9fWZ1bmN0aW9uIHYoZSl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOlwiXCIsaT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdO2lmKCFlfHxcIlwiPT09dClyZXR1cm4hMTtpZihcIm5vbmVcIj09PXQpcmV0dXJuIEMoaSkmJmkoKSwhMTt2YXIgbj1iKCkscz10LnNwbGl0KFwiIFwiKTtyKHMsKGZ1bmN0aW9uKHQpe2QoZSxcImdcIit0KX0pKSxoKG4se29uRWxlbWVudDplLGF2b2lkRHVwbGljYXRlOiExLG9uY2U6ITAsd2l0aENhbGxiYWNrOmZ1bmN0aW9uKGUsdCl7cihzLChmdW5jdGlvbihlKXtjKHQsXCJnXCIrZSl9KSksQyhpKSYmaSgpfX0pfWZ1bmN0aW9uIGYoZSl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOlwiXCI7aWYoXCJcIj09PXQpcmV0dXJuIGUuc3R5bGUud2Via2l0VHJhbnNmb3JtPVwiXCIsZS5zdHlsZS5Nb3pUcmFuc2Zvcm09XCJcIixlLnN0eWxlLm1zVHJhbnNmb3JtPVwiXCIsZS5zdHlsZS5PVHJhbnNmb3JtPVwiXCIsZS5zdHlsZS50cmFuc2Zvcm09XCJcIiwhMTtlLnN0eWxlLndlYmtpdFRyYW5zZm9ybT10LGUuc3R5bGUuTW96VHJhbnNmb3JtPXQsZS5zdHlsZS5tc1RyYW5zZm9ybT10LGUuc3R5bGUuT1RyYW5zZm9ybT10LGUuc3R5bGUudHJhbnNmb3JtPXR9ZnVuY3Rpb24gcChlKXtlLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wifWZ1bmN0aW9uIG0oZSl7ZS5zdHlsZS5kaXNwbGF5PVwibm9uZVwifWZ1bmN0aW9uIHkoZSl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmb3IoaS5pbm5lckhUTUw9ZTtpLmZpcnN0Q2hpbGQ7KXQuYXBwZW5kQ2hpbGQoaS5maXJzdENoaWxkKTtyZXR1cm4gdH1mdW5jdGlvbiB4KCl7cmV0dXJue3dpZHRoOndpbmRvdy5pbm5lcldpZHRofHxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGh8fGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsaGVpZ2h0OndpbmRvdy5pbm5lckhlaWdodHx8ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodHx8ZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHR9fWZ1bmN0aW9uIGIoKXt2YXIgZSx0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmYWtlZWxlbWVudFwiKSxpPXthbmltYXRpb246XCJhbmltYXRpb25lbmRcIixPQW5pbWF0aW9uOlwib0FuaW1hdGlvbkVuZFwiLE1vekFuaW1hdGlvbjpcImFuaW1hdGlvbmVuZFwiLFdlYmtpdEFuaW1hdGlvbjpcIndlYmtpdEFuaW1hdGlvbkVuZFwifTtmb3IoZSBpbiBpKWlmKHZvaWQgMCE9PXQuc3R5bGVbZV0pcmV0dXJuIGlbZV19ZnVuY3Rpb24gUyhlLHQsaSxuKXtpZihlKCkpdCgpO2Vsc2V7dmFyIHM7aXx8KGk9MTAwKTt2YXIgbD1zZXRJbnRlcnZhbCgoZnVuY3Rpb24oKXtlKCkmJihjbGVhckludGVydmFsKGwpLHMmJmNsZWFyVGltZW91dChzKSx0KCkpfSksaSk7biYmKHM9c2V0VGltZW91dCgoZnVuY3Rpb24oKXtjbGVhckludGVydmFsKGwpfSksbikpfX1mdW5jdGlvbiB3KGUsdCxpKXtpZihPKGUpKWNvbnNvbGUuZXJyb3IoXCJJbmplY3QgYXNzZXRzIGVycm9yXCIpO2Vsc2UgaWYoQyh0KSYmKGk9dCx0PSExKSxrKHQpJiZ0IGluIHdpbmRvdylDKGkpJiZpKCk7ZWxzZXt2YXIgbjtpZigtMSE9PWUuaW5kZXhPZihcIi5jc3NcIikpe2lmKChuPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbaHJlZj1cIicrZSsnXCJdJykpJiZuLmxlbmd0aD4wKXJldHVybiB2b2lkKEMoaSkmJmkoKSk7dmFyIHM9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLGw9cy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKSxvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO3JldHVybiBvLnJlbD1cInN0eWxlc2hlZXRcIixvLnR5cGU9XCJ0ZXh0L2Nzc1wiLG8uaHJlZj1lLG8ubWVkaWE9XCJhbGxcIixsP3MuaW5zZXJ0QmVmb3JlKG8sbFswXSk6cy5hcHBlbmRDaGlsZChvKSx2b2lkKEMoaSkmJmkoKSl9aWYoKG49ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3NyYz1cIicrZSsnXCJdJykpJiZuLmxlbmd0aD4wKXtpZihDKGkpKXtpZihrKHQpKXJldHVybiBTKChmdW5jdGlvbigpe3JldHVybiB2b2lkIDAhPT13aW5kb3dbdF19KSwoZnVuY3Rpb24oKXtpKCl9KSksITE7aSgpfX1lbHNle3ZhciByPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ci50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIsci5zcmM9ZSxyLm9ubG9hZD1mdW5jdGlvbigpe2lmKEMoaSkpe2lmKGsodCkpcmV0dXJuIFMoKGZ1bmN0aW9uKCl7cmV0dXJuIHZvaWQgMCE9PXdpbmRvd1t0XX0pLChmdW5jdGlvbigpe2koKX0pKSwhMTtpKCl9fSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHIpfX19ZnVuY3Rpb24gVCgpe3JldHVyblwibmF2aWdhdG9yXCJpbiB3aW5kb3cmJndpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBhZCl8KGlQaG9uZSl8KGlQb2QpfChBbmRyb2lkKXwoUGxheUJvb2spfChCQjEwKXwoQmxhY2tCZXJyeSl8KE9wZXJhIE1pbmkpfChJRU1vYmlsZSl8KHdlYk9TKXwoTWVlR28pL2kpfWZ1bmN0aW9uIEMoZSl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgZX1mdW5jdGlvbiBrKGUpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIEUoZSl7cmV0dXJuISghZXx8IWUubm9kZVR5cGV8fDEhPWUubm9kZVR5cGUpfWZ1bmN0aW9uIEEoZSl7cmV0dXJuIEFycmF5LmlzQXJyYXkoZSl9ZnVuY3Rpb24gTChlKXtyZXR1cm4gZSYmZS5sZW5ndGgmJmlzRmluaXRlKGUubGVuZ3RoKX1mdW5jdGlvbiBJKGUpe3JldHVyblwib2JqZWN0XCI9PT10KGUpJiZudWxsIT1lJiYhQyhlKSYmIUEoZSl9ZnVuY3Rpb24gTyhlKXtyZXR1cm4gbnVsbD09ZX1mdW5jdGlvbiBQKGUsdCl7cmV0dXJuIG51bGwhPT1lJiZoYXNPd25Qcm9wZXJ0eS5jYWxsKGUsdCl9ZnVuY3Rpb24gTShlKXtpZihJKGUpKXtpZihlLmtleXMpcmV0dXJuIGUua2V5cygpLmxlbmd0aDt2YXIgdD0wO2Zvcih2YXIgaSBpbiBlKVAoZSxpKSYmdCsrO3JldHVybiB0fXJldHVybiBlLmxlbmd0aH1mdW5jdGlvbiB6KGUpe3JldHVybiFpc05hTihwYXJzZUZsb2F0KGUpKSYmaXNGaW5pdGUoZSl9ZnVuY3Rpb24gWCgpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTotMSx0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2J0bltkYXRhLXRhYm9yZGVyXTpub3QoLmRpc2FibGVkKVwiKTtpZighdC5sZW5ndGgpcmV0dXJuITE7aWYoMT09dC5sZW5ndGgpcmV0dXJuIHRbMF07XCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPXBhcnNlSW50KGUpKTt2YXIgaT1bXTtyKHQsKGZ1bmN0aW9uKGUpe2kucHVzaChlLmdldEF0dHJpYnV0ZShcImRhdGEtdGFib3JkZXJcIikpfSkpO3ZhciBuPU1hdGgubWF4LmFwcGx5KE1hdGgsaS5tYXAoKGZ1bmN0aW9uKGUpe3JldHVybiBwYXJzZUludChlKX0pKSkscz1lPDA/MTplKzE7cz5uJiYocz1cIjFcIik7dmFyIGw9aS5maWx0ZXIoKGZ1bmN0aW9uKGUpe3JldHVybiBlPj1wYXJzZUludChzKX0pKSxvPWwuc29ydCgpWzBdO3JldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2J0bltkYXRhLXRhYm9yZGVyPVwiJy5jb25jYXQobywnXCJdJykpfWZ1bmN0aW9uIFkoZSl7aWYoZS5ldmVudHMuaGFzT3duUHJvcGVydHkoXCJrZXlib2FyZFwiKSlyZXR1cm4hMTtlLmV2ZW50cy5rZXlib2FyZD1oKFwia2V5ZG93blwiLHtvbkVsZW1lbnQ6d2luZG93LHdpdGhDYWxsYmFjazpmdW5jdGlvbih0LGkpe3ZhciBuPSh0PXR8fHdpbmRvdy5ldmVudCkua2V5Q29kZTtpZig5PT1uKXt2YXIgcz1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdidG4uZm9jdXNlZFwiKTtpZighcyl7dmFyIGw9ISghZG9jdW1lbnQuYWN0aXZlRWxlbWVudHx8IWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUpJiZkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCk7aWYoXCJpbnB1dFwiPT1sfHxcInRleHRhcmVhXCI9PWx8fFwiYnV0dG9uXCI9PWwpcmV0dXJufXQucHJldmVudERlZmF1bHQoKTt2YXIgbz1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdidG5bZGF0YS10YWJvcmRlcl1cIik7aWYoIW98fG8ubGVuZ3RoPD0wKXJldHVybjtpZighcyl7dmFyIHI9WCgpO3JldHVybiB2b2lkKHImJihyLmZvY3VzKCksZChyLFwiZm9jdXNlZFwiKSkpfXZhciBhPVgocy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYm9yZGVyXCIpKTtjKHMsXCJmb2N1c2VkXCIpLGEmJihhLmZvY3VzKCksZChhLFwiZm9jdXNlZFwiKSl9Mzk9PW4mJmUubmV4dFNsaWRlKCksMzc9PW4mJmUucHJldlNsaWRlKCksMjc9PW4mJmUuY2xvc2UoKX19KX12YXIgcT1zKChmdW5jdGlvbiBlKHQsbil7dmFyIHM9dGhpcyxsPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTpudWxsO2lmKGkodGhpcyxlKSx0aGlzLmltZz10LHRoaXMuc2xpZGU9bix0aGlzLm9uY2xvc2U9bCx0aGlzLmltZy5zZXRab29tRXZlbnRzKXJldHVybiExO3RoaXMuYWN0aXZlPSExLHRoaXMuem9vbWVkSW49ITEsdGhpcy5kcmFnZ2luZz0hMSx0aGlzLmN1cnJlbnRYPW51bGwsdGhpcy5jdXJyZW50WT1udWxsLHRoaXMuaW5pdGlhbFg9bnVsbCx0aGlzLmluaXRpYWxZPW51bGwsdGhpcy54T2Zmc2V0PTAsdGhpcy55T2Zmc2V0PTAsdGhpcy5pbWcuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLChmdW5jdGlvbihlKXtyZXR1cm4gcy5kcmFnU3RhcnQoZSl9KSwhMSksdGhpcy5pbWcuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwoZnVuY3Rpb24oZSl7cmV0dXJuIHMuZHJhZ0VuZChlKX0pLCExKSx0aGlzLmltZy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsKGZ1bmN0aW9uKGUpe3JldHVybiBzLmRyYWcoZSl9KSwhMSksdGhpcy5pbWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKGZ1bmN0aW9uKGUpe3JldHVybiBzLnNsaWRlLmNsYXNzTGlzdC5jb250YWlucyhcImRyYWdnaW5nLW5hdlwiKT8ocy56b29tT3V0KCksITEpOnMuem9vbWVkSW4/dm9pZChzLnpvb21lZEluJiYhcy5kcmFnZ2luZyYmcy56b29tT3V0KCkpOnMuem9vbUluKCl9KSwhMSksdGhpcy5pbWcuc2V0Wm9vbUV2ZW50cz0hMH0pLFt7a2V5Olwiem9vbUluXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLndpZG93V2lkdGgoKTtpZighKHRoaXMuem9vbWVkSW58fGU8PTc2OCkpe3ZhciB0PXRoaXMuaW1nO2lmKHQuc2V0QXR0cmlidXRlKFwiZGF0YS1zdHlsZVwiLHQuZ2V0QXR0cmlidXRlKFwic3R5bGVcIikpLHQuc3R5bGUubWF4V2lkdGg9dC5uYXR1cmFsV2lkdGgrXCJweFwiLHQuc3R5bGUubWF4SGVpZ2h0PXQubmF0dXJhbEhlaWdodCtcInB4XCIsdC5uYXR1cmFsV2lkdGg+ZSl7dmFyIGk9ZS8yLXQubmF0dXJhbFdpZHRoLzI7dGhpcy5zZXRUcmFuc2xhdGUodGhpcy5pbWcucGFyZW50Tm9kZSxpLDApfXRoaXMuc2xpZGUuY2xhc3NMaXN0LmFkZChcInpvb21lZFwiKSx0aGlzLnpvb21lZEluPSEwfX19LHtrZXk6XCJ6b29tT3V0XCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmltZy5wYXJlbnROb2RlLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsXCJcIiksdGhpcy5pbWcuc2V0QXR0cmlidXRlKFwic3R5bGVcIix0aGlzLmltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0eWxlXCIpKSx0aGlzLnNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJ6b29tZWRcIiksdGhpcy56b29tZWRJbj0hMSx0aGlzLmN1cnJlbnRYPW51bGwsdGhpcy5jdXJyZW50WT1udWxsLHRoaXMuaW5pdGlhbFg9bnVsbCx0aGlzLmluaXRpYWxZPW51bGwsdGhpcy54T2Zmc2V0PTAsdGhpcy55T2Zmc2V0PTAsdGhpcy5vbmNsb3NlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLm9uY2xvc2UmJnRoaXMub25jbG9zZSgpfX0se2tleTpcImRyYWdTdGFydFwiLHZhbHVlOmZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKSx0aGlzLnpvb21lZEluPyhcInRvdWNoc3RhcnRcIj09PWUudHlwZT8odGhpcy5pbml0aWFsWD1lLnRvdWNoZXNbMF0uY2xpZW50WC10aGlzLnhPZmZzZXQsdGhpcy5pbml0aWFsWT1lLnRvdWNoZXNbMF0uY2xpZW50WS10aGlzLnlPZmZzZXQpOih0aGlzLmluaXRpYWxYPWUuY2xpZW50WC10aGlzLnhPZmZzZXQsdGhpcy5pbml0aWFsWT1lLmNsaWVudFktdGhpcy55T2Zmc2V0KSxlLnRhcmdldD09PXRoaXMuaW1nJiYodGhpcy5hY3RpdmU9ITAsdGhpcy5pbWcuY2xhc3NMaXN0LmFkZChcImRyYWdnaW5nXCIpKSk6dGhpcy5hY3RpdmU9ITF9fSx7a2V5OlwiZHJhZ0VuZFwiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7ZS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuaW5pdGlhbFg9dGhpcy5jdXJyZW50WCx0aGlzLmluaXRpYWxZPXRoaXMuY3VycmVudFksdGhpcy5hY3RpdmU9ITEsc2V0VGltZW91dCgoZnVuY3Rpb24oKXt0LmRyYWdnaW5nPSExLHQuaW1nLmlzRHJhZ2dpbmc9ITEsdC5pbWcuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nXCIpfSksMTAwKX19LHtrZXk6XCJkcmFnXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5hY3RpdmUmJihlLnByZXZlbnREZWZhdWx0KCksXCJ0b3VjaG1vdmVcIj09PWUudHlwZT8odGhpcy5jdXJyZW50WD1lLnRvdWNoZXNbMF0uY2xpZW50WC10aGlzLmluaXRpYWxYLHRoaXMuY3VycmVudFk9ZS50b3VjaGVzWzBdLmNsaWVudFktdGhpcy5pbml0aWFsWSk6KHRoaXMuY3VycmVudFg9ZS5jbGllbnRYLXRoaXMuaW5pdGlhbFgsdGhpcy5jdXJyZW50WT1lLmNsaWVudFktdGhpcy5pbml0aWFsWSksdGhpcy54T2Zmc2V0PXRoaXMuY3VycmVudFgsdGhpcy55T2Zmc2V0PXRoaXMuY3VycmVudFksdGhpcy5pbWcuaXNEcmFnZ2luZz0hMCx0aGlzLmRyYWdnaW5nPSEwLHRoaXMuc2V0VHJhbnNsYXRlKHRoaXMuaW1nLHRoaXMuY3VycmVudFgsdGhpcy5jdXJyZW50WSkpfX0se2tleTpcIm9uTW92ZVwiLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKHRoaXMuem9vbWVkSW4pe3ZhciB0PWUuY2xpZW50WC10aGlzLmltZy5uYXR1cmFsV2lkdGgvMixpPWUuY2xpZW50WS10aGlzLmltZy5uYXR1cmFsSGVpZ2h0LzI7dGhpcy5zZXRUcmFuc2xhdGUodGhpcy5pbWcsdCxpKX19fSx7a2V5Olwic2V0VHJhbnNsYXRlXCIsdmFsdWU6ZnVuY3Rpb24oZSx0LGkpe2Uuc3R5bGUudHJhbnNmb3JtPVwidHJhbnNsYXRlM2QoXCIrdCtcInB4LCBcIitpK1wicHgsIDApXCJ9fSx7a2V5Olwid2lkb3dXaWR0aFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHdpbmRvdy5pbm5lcldpZHRofHxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGh8fGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGh9fV0pLE49cygoZnVuY3Rpb24gZSgpe3ZhciB0PXRoaXMsbj1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e307aSh0aGlzLGUpO3ZhciBzPW4uZHJhZ0VsLGw9bi50b2xlcmFuY2VYLG89dm9pZCAwPT09bD80MDpsLHI9bi50b2xlcmFuY2VZLGE9dm9pZCAwPT09cj82NTpyLGg9bi5zbGlkZSxkPXZvaWQgMD09PWg/bnVsbDpoLGM9bi5pbnN0YW5jZSx1PXZvaWQgMD09PWM/bnVsbDpjO3RoaXMuZWw9cyx0aGlzLmFjdGl2ZT0hMSx0aGlzLmRyYWdnaW5nPSExLHRoaXMuY3VycmVudFg9bnVsbCx0aGlzLmN1cnJlbnRZPW51bGwsdGhpcy5pbml0aWFsWD1udWxsLHRoaXMuaW5pdGlhbFk9bnVsbCx0aGlzLnhPZmZzZXQ9MCx0aGlzLnlPZmZzZXQ9MCx0aGlzLmRpcmVjdGlvbj1udWxsLHRoaXMubGFzdERpcmVjdGlvbj1udWxsLHRoaXMudG9sZXJhbmNlWD1vLHRoaXMudG9sZXJhbmNlWT1hLHRoaXMudG9sZXJhbmNlUmVhY2hlZD0hMSx0aGlzLmRyYWdDb250YWluZXI9dGhpcy5lbCx0aGlzLnNsaWRlPWQsdGhpcy5pbnN0YW5jZT11LHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLChmdW5jdGlvbihlKXtyZXR1cm4gdC5kcmFnU3RhcnQoZSl9KSwhMSksdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLChmdW5jdGlvbihlKXtyZXR1cm4gdC5kcmFnRW5kKGUpfSksITEpLHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLChmdW5jdGlvbihlKXtyZXR1cm4gdC5kcmFnKGUpfSksITEpfSksW3trZXk6XCJkcmFnU3RhcnRcIix2YWx1ZTpmdW5jdGlvbihlKXtpZih0aGlzLnNsaWRlLmNsYXNzTGlzdC5jb250YWlucyhcInpvb21lZFwiKSl0aGlzLmFjdGl2ZT0hMTtlbHNle1widG91Y2hzdGFydFwiPT09ZS50eXBlPyh0aGlzLmluaXRpYWxYPWUudG91Y2hlc1swXS5jbGllbnRYLXRoaXMueE9mZnNldCx0aGlzLmluaXRpYWxZPWUudG91Y2hlc1swXS5jbGllbnRZLXRoaXMueU9mZnNldCk6KHRoaXMuaW5pdGlhbFg9ZS5jbGllbnRYLXRoaXMueE9mZnNldCx0aGlzLmluaXRpYWxZPWUuY2xpZW50WS10aGlzLnlPZmZzZXQpO3ZhciB0PWUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7ZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibm9kcmFnXCIpfHxnKGUudGFyZ2V0LFwiLm5vZHJhZ1wiKXx8LTEhPT1bXCJpbnB1dFwiLFwic2VsZWN0XCIsXCJ0ZXh0YXJlYVwiLFwiYnV0dG9uXCIsXCJhXCJdLmluZGV4T2YodCk/dGhpcy5hY3RpdmU9ITE6KGUucHJldmVudERlZmF1bHQoKSwoZS50YXJnZXQ9PT10aGlzLmVsfHxcImltZ1wiIT09dCYmZyhlLnRhcmdldCxcIi5nc2xpZGUtaW5saW5lXCIpKSYmKHRoaXMuYWN0aXZlPSEwLHRoaXMuZWwuY2xhc3NMaXN0LmFkZChcImRyYWdnaW5nXCIpLHRoaXMuZHJhZ0NvbnRhaW5lcj1nKGUudGFyZ2V0LFwiLmdpbm5lci1jb250YWluZXJcIikpKX19fSx7a2V5OlwiZHJhZ0VuZFwiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7ZSYmZS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuaW5pdGlhbFg9MCx0aGlzLmluaXRpYWxZPTAsdGhpcy5jdXJyZW50WD1udWxsLHRoaXMuY3VycmVudFk9bnVsbCx0aGlzLmluaXRpYWxYPW51bGwsdGhpcy5pbml0aWFsWT1udWxsLHRoaXMueE9mZnNldD0wLHRoaXMueU9mZnNldD0wLHRoaXMuYWN0aXZlPSExLHRoaXMuZG9TbGlkZUNoYW5nZSYmKHRoaXMuaW5zdGFuY2UucHJldmVudE91dHNpZGVDbGljaz0hMCxcInJpZ2h0XCI9PXRoaXMuZG9TbGlkZUNoYW5nZSYmdGhpcy5pbnN0YW5jZS5wcmV2U2xpZGUoKSxcImxlZnRcIj09dGhpcy5kb1NsaWRlQ2hhbmdlJiZ0aGlzLmluc3RhbmNlLm5leHRTbGlkZSgpKSx0aGlzLmRvU2xpZGVDbG9zZSYmdGhpcy5pbnN0YW5jZS5jbG9zZSgpLHRoaXMudG9sZXJhbmNlUmVhY2hlZHx8dGhpcy5zZXRUcmFuc2xhdGUodGhpcy5kcmFnQ29udGFpbmVyLDAsMCwhMCksc2V0VGltZW91dCgoZnVuY3Rpb24oKXt0Lmluc3RhbmNlLnByZXZlbnRPdXRzaWRlQ2xpY2s9ITEsdC50b2xlcmFuY2VSZWFjaGVkPSExLHQubGFzdERpcmVjdGlvbj1udWxsLHQuZHJhZ2dpbmc9ITEsdC5lbC5pc0RyYWdnaW5nPSExLHQuZWwuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nXCIpLHQuc2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdnaW5nLW5hdlwiKSx0LmRyYWdDb250YWluZXIuc3R5bGUudHJhbnNmb3JtPVwiXCIsdC5kcmFnQ29udGFpbmVyLnN0eWxlLnRyYW5zaXRpb249XCJcIn0pLDEwMCl9fSx7a2V5OlwiZHJhZ1wiLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKHRoaXMuYWN0aXZlKXtlLnByZXZlbnREZWZhdWx0KCksdGhpcy5zbGlkZS5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dpbmctbmF2XCIpLFwidG91Y2htb3ZlXCI9PT1lLnR5cGU/KHRoaXMuY3VycmVudFg9ZS50b3VjaGVzWzBdLmNsaWVudFgtdGhpcy5pbml0aWFsWCx0aGlzLmN1cnJlbnRZPWUudG91Y2hlc1swXS5jbGllbnRZLXRoaXMuaW5pdGlhbFkpOih0aGlzLmN1cnJlbnRYPWUuY2xpZW50WC10aGlzLmluaXRpYWxYLHRoaXMuY3VycmVudFk9ZS5jbGllbnRZLXRoaXMuaW5pdGlhbFkpLHRoaXMueE9mZnNldD10aGlzLmN1cnJlbnRYLHRoaXMueU9mZnNldD10aGlzLmN1cnJlbnRZLHRoaXMuZWwuaXNEcmFnZ2luZz0hMCx0aGlzLmRyYWdnaW5nPSEwLHRoaXMuZG9TbGlkZUNoYW5nZT0hMSx0aGlzLmRvU2xpZGVDbG9zZT0hMTt2YXIgdD1NYXRoLmFicyh0aGlzLmN1cnJlbnRYKSxpPU1hdGguYWJzKHRoaXMuY3VycmVudFkpO2lmKHQ+MCYmdD49TWF0aC5hYnModGhpcy5jdXJyZW50WSkmJighdGhpcy5sYXN0RGlyZWN0aW9ufHxcInhcIj09dGhpcy5sYXN0RGlyZWN0aW9uKSl7dGhpcy55T2Zmc2V0PTAsdGhpcy5sYXN0RGlyZWN0aW9uPVwieFwiLHRoaXMuc2V0VHJhbnNsYXRlKHRoaXMuZHJhZ0NvbnRhaW5lcix0aGlzLmN1cnJlbnRYLDApO3ZhciBuPXRoaXMuc2hvdWxkQ2hhbmdlKCk7aWYoIXRoaXMuaW5zdGFuY2Uuc2V0dGluZ3MuZHJhZ0F1dG9TbmFwJiZuJiYodGhpcy5kb1NsaWRlQ2hhbmdlPW4pLHRoaXMuaW5zdGFuY2Uuc2V0dGluZ3MuZHJhZ0F1dG9TbmFwJiZuKXJldHVybiB0aGlzLmluc3RhbmNlLnByZXZlbnRPdXRzaWRlQ2xpY2s9ITAsdGhpcy50b2xlcmFuY2VSZWFjaGVkPSEwLHRoaXMuYWN0aXZlPSExLHRoaXMuaW5zdGFuY2UucHJldmVudE91dHNpZGVDbGljaz0hMCx0aGlzLmRyYWdFbmQobnVsbCksXCJyaWdodFwiPT1uJiZ0aGlzLmluc3RhbmNlLnByZXZTbGlkZSgpLHZvaWQoXCJsZWZ0XCI9PW4mJnRoaXMuaW5zdGFuY2UubmV4dFNsaWRlKCkpfWlmKHRoaXMudG9sZXJhbmNlWT4wJiZpPjAmJmk+PXQmJighdGhpcy5sYXN0RGlyZWN0aW9ufHxcInlcIj09dGhpcy5sYXN0RGlyZWN0aW9uKSl7dGhpcy54T2Zmc2V0PTAsdGhpcy5sYXN0RGlyZWN0aW9uPVwieVwiLHRoaXMuc2V0VHJhbnNsYXRlKHRoaXMuZHJhZ0NvbnRhaW5lciwwLHRoaXMuY3VycmVudFkpO3ZhciBzPXRoaXMuc2hvdWxkQ2xvc2UoKTtyZXR1cm4hdGhpcy5pbnN0YW5jZS5zZXR0aW5ncy5kcmFnQXV0b1NuYXAmJnMmJih0aGlzLmRvU2xpZGVDbG9zZT0hMCksdm9pZCh0aGlzLmluc3RhbmNlLnNldHRpbmdzLmRyYWdBdXRvU25hcCYmcyYmdGhpcy5pbnN0YW5jZS5jbG9zZSgpKX19fX0se2tleTpcInNob3VsZENoYW5nZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9ITE7aWYoTWF0aC5hYnModGhpcy5jdXJyZW50WCk+PXRoaXMudG9sZXJhbmNlWCl7dmFyIHQ9dGhpcy5jdXJyZW50WD4wP1wicmlnaHRcIjpcImxlZnRcIjsoXCJsZWZ0XCI9PXQmJnRoaXMuc2xpZGUhPT10aGlzLnNsaWRlLnBhcmVudE5vZGUubGFzdENoaWxkfHxcInJpZ2h0XCI9PXQmJnRoaXMuc2xpZGUhPT10aGlzLnNsaWRlLnBhcmVudE5vZGUuZmlyc3RDaGlsZCkmJihlPXQpfXJldHVybiBlfX0se2tleTpcInNob3VsZENsb3NlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT0hMTtyZXR1cm4gTWF0aC5hYnModGhpcy5jdXJyZW50WSk+PXRoaXMudG9sZXJhbmNlWSYmKGU9ITApLGV9fSx7a2V5Olwic2V0VHJhbnNsYXRlXCIsdmFsdWU6ZnVuY3Rpb24oZSx0LGkpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdJiZhcmd1bWVudHNbM107ZS5zdHlsZS50cmFuc2l0aW9uPW4/XCJhbGwgLjJzIGVhc2VcIjpcIlwiLGUuc3R5bGUudHJhbnNmb3JtPVwidHJhbnNsYXRlM2QoXCIuY29uY2F0KHQsXCJweCwgXCIpLmNvbmNhdChpLFwicHgsIDApXCIpfX1dKTtmdW5jdGlvbiBEKGUsdCxpLG4pe3ZhciBzPWUucXVlcnlTZWxlY3RvcihcIi5nc2xpZGUtbWVkaWFcIiksbD1uZXcgSW1hZ2Usbz1cImdTbGlkZVRpdGxlX1wiK2kscj1cImdTbGlkZURlc2NfXCIraTtsLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsKGZ1bmN0aW9uKCl7QyhuKSYmbigpfSksITEpLGwuc3JjPXQuaHJlZixcIlwiIT10LnNpemVzJiZcIlwiIT10LnNyY3NldCYmKGwuc2l6ZXM9dC5zaXplcyxsLnNyY3NldD10LnNyY3NldCksbC5hbHQ9XCJcIixPKHQuYWx0KXx8XCJcIj09PXQuYWx0fHwobC5hbHQ9dC5hbHQpLFwiXCIhPT10LnRpdGxlJiZsLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLG8pLFwiXCIhPT10LmRlc2NyaXB0aW9uJiZsLnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIixyKSx0Lmhhc093blByb3BlcnR5KFwiX2hhc0N1c3RvbVdpZHRoXCIpJiZ0Ll9oYXNDdXN0b21XaWR0aCYmKGwuc3R5bGUud2lkdGg9dC53aWR0aCksdC5oYXNPd25Qcm9wZXJ0eShcIl9oYXNDdXN0b21IZWlnaHRcIikmJnQuX2hhc0N1c3RvbUhlaWdodCYmKGwuc3R5bGUuaGVpZ2h0PXQuaGVpZ2h0KSxzLmluc2VydEJlZm9yZShsLHMuZmlyc3RDaGlsZCl9ZnVuY3Rpb24gXyhlLHQsaSxuKXt2YXIgcz10aGlzLGw9ZS5xdWVyeVNlbGVjdG9yKFwiLmdpbm5lci1jb250YWluZXJcIiksbz1cImd2aWRlb1wiK2kscj1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLW1lZGlhXCIpLGE9dGhpcy5nZXRBbGxQbGF5ZXJzKCk7ZChsLFwiZ3ZpZGVvLWNvbnRhaW5lclwiKSxyLmluc2VydEJlZm9yZSh5KCc8ZGl2IGNsYXNzPVwiZ3ZpZGVvLXdyYXBwZXJcIj48L2Rpdj4nKSxyLmZpcnN0Q2hpbGQpO3ZhciBoPWUucXVlcnlTZWxlY3RvcihcIi5ndmlkZW8td3JhcHBlclwiKTt3KHRoaXMuc2V0dGluZ3MucGx5ci5jc3MsXCJQbHlyXCIpO3ZhciBjPXQuaHJlZix1PW51bGw9PXQ/dm9pZCAwOnQudmlkZW9Qcm92aWRlcixnPSExO3Iuc3R5bGUubWF4V2lkdGg9dC53aWR0aCx3KHRoaXMuc2V0dGluZ3MucGx5ci5qcyxcIlBseXJcIiwoZnVuY3Rpb24oKXtpZighdSYmYy5tYXRjaCgvdmltZW9cXC5jb21cXC8oWzAtOV0qKS8pJiYodT1cInZpbWVvXCIpLCF1JiYoYy5tYXRjaCgvKHlvdXR1YmVcXC5jb218eW91dHViZS1ub2Nvb2tpZVxcLmNvbSlcXC93YXRjaFxcP3Y9KFthLXpBLVowLTlcXC1fXSspLyl8fGMubWF0Y2goL3lvdXR1XFwuYmVcXC8oW2EtekEtWjAtOVxcLV9dKykvKXx8Yy5tYXRjaCgvKHlvdXR1YmVcXC5jb218eW91dHViZS1ub2Nvb2tpZVxcLmNvbSlcXC9lbWJlZFxcLyhbYS16QS1aMC05XFwtX10rKS8pfHxjLm1hdGNoKC8oeW91dHViZVxcLmNvbXx5b3V0dWJlLW5vY29va2llXFwuY29tKVxcL3Nob3J0c1xcLyhbYS16QS1aMC05XFwtX10rKS8pKSYmKHU9XCJ5b3V0dWJlXCIpLFwibG9jYWxcIj09PXV8fCF1KXt1PVwibG9jYWxcIjt2YXIgbD0nPHZpZGVvIGlkPVwiJytvKydcIiAnO2wrPSdzdHlsZT1cImJhY2tncm91bmQ6IzAwMDsgbWF4LXdpZHRoOiAnLmNvbmNhdCh0LndpZHRoLCc7XCIgJyksbCs9J3ByZWxvYWQ9XCJtZXRhZGF0YVwiICcsbCs9J3gtd2Via2l0LWFpcnBsYXk9XCJhbGxvd1wiICcsbCs9XCJwbGF5c2lubGluZSBcIixsKz1cImNvbnRyb2xzIFwiLGwrPSdjbGFzcz1cImd2aWRlby1sb2NhbFwiPicsbCs9Jzxzb3VyY2Ugc3JjPVwiJy5jb25jYXQoYywnXCI+JyksZz15KGwrPVwiPC92aWRlbz5cIil9dmFyIHI9Z3x8eSgnPGRpdiBpZD1cIicuY29uY2F0KG8sJ1wiIGRhdGEtcGx5ci1wcm92aWRlcj1cIicpLmNvbmNhdCh1LCdcIiBkYXRhLXBseXItZW1iZWQtaWQ9XCInKS5jb25jYXQoYywnXCI+PC9kaXY+JykpO2QoaCxcIlwiLmNvbmNhdCh1LFwiLXZpZGVvIGd2aWRlb1wiKSksaC5hcHBlbmRDaGlsZChyKSxoLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIixvKSxoLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIixpKTt2YXIgdj1QKHMuc2V0dGluZ3MucGx5cixcImNvbmZpZ1wiKT9zLnNldHRpbmdzLnBseXIuY29uZmlnOnt9LGY9bmV3IFBseXIoXCIjXCIrbyx2KTtmLm9uKFwicmVhZHlcIiwoZnVuY3Rpb24oZSl7YVtvXT1lLmRldGFpbC5wbHlyLEMobikmJm4oKX0pKSxTKChmdW5jdGlvbigpe3JldHVybiBlLnF1ZXJ5U2VsZWN0b3IoXCJpZnJhbWVcIikmJlwidHJ1ZVwiPT1lLnF1ZXJ5U2VsZWN0b3IoXCJpZnJhbWVcIikuZGF0YXNldC5yZWFkeX0pLChmdW5jdGlvbigpe3MucmVzaXplKGUpfSkpLGYub24oXCJlbnRlcmZ1bGxzY3JlZW5cIixXKSxmLm9uKFwiZXhpdGZ1bGxzY3JlZW5cIixXKX0pKX1mdW5jdGlvbiBXKGUpe3ZhciB0PWcoZS50YXJnZXQsXCIuZ3NsaWRlLW1lZGlhXCIpO1wiZW50ZXJmdWxsc2NyZWVuXCI9PT1lLnR5cGUmJmQodCxcImZ1bGxzY3JlZW5cIiksXCJleGl0ZnVsbHNjcmVlblwiPT09ZS50eXBlJiZjKHQsXCJmdWxsc2NyZWVuXCIpfWZ1bmN0aW9uIEIoZSx0LGksbil7dmFyIHMsbD10aGlzLG89ZS5xdWVyeVNlbGVjdG9yKFwiLmdzbGlkZS1tZWRpYVwiKSxyPSEoIVAodCxcImhyZWZcIil8fCF0LmhyZWYpJiZ0LmhyZWYuc3BsaXQoXCIjXCIpLnBvcCgpLnRyaW0oKSxhPSEoIVAodCxcImNvbnRlbnRcIil8fCF0LmNvbnRlbnQpJiZ0LmNvbnRlbnQ7aWYoYSYmKGsoYSkmJihzPXkoJzxkaXYgY2xhc3M9XCJnaW5saW5lZC1jb250ZW50XCI+Jy5jb25jYXQoYSxcIjwvZGl2PlwiKSkpLEUoYSkpKXtcIm5vbmVcIj09YS5zdHlsZS5kaXNwbGF5JiYoYS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIik7dmFyIGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLmNsYXNzTmFtZT1cImdpbmxpbmVkLWNvbnRlbnRcIixjLmFwcGVuZENoaWxkKGEpLHM9Y31pZihyKXt2YXIgdT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChyKTtpZighdSlyZXR1cm4hMTt2YXIgZz11LmNsb25lTm9kZSghMCk7Zy5zdHlsZS5oZWlnaHQ9dC5oZWlnaHQsZy5zdHlsZS5tYXhXaWR0aD10LndpZHRoLGQoZyxcImdpbmxpbmVkLWNvbnRlbnRcIikscz1nfWlmKCFzKXJldHVybiBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIGFwcGVuZCBpbmxpbmUgc2xpZGUgY29udGVudFwiLHQpLCExO28uc3R5bGUuaGVpZ2h0PXQuaGVpZ2h0LG8uc3R5bGUud2lkdGg9dC53aWR0aCxvLmFwcGVuZENoaWxkKHMpLHRoaXMuZXZlbnRzW1wiaW5saW5lY2xvc2VcIityXT1oKFwiY2xpY2tcIix7b25FbGVtZW50Om8ucXVlcnlTZWxlY3RvckFsbChcIi5ndHJpZ2dlci1jbG9zZVwiKSx3aXRoQ2FsbGJhY2s6ZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpLGwuY2xvc2UoKX19KSxDKG4pJiZuKCl9ZnVuY3Rpb24gSChlLHQsaSxuKXt2YXIgcz1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLW1lZGlhXCIpLGw9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS51cmwsaT1lLmFsbG93LG49ZS5jYWxsYmFjayxzPWUuYXBwZW5kVG8sbD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO3JldHVybiBsLmNsYXNzTmFtZT1cInZpbWVvLXZpZGVvIGd2aWRlb1wiLGwuc3JjPXQsbC5zdHlsZS53aWR0aD1cIjEwMCVcIixsLnN0eWxlLmhlaWdodD1cIjEwMCVcIixpJiZsLnNldEF0dHJpYnV0ZShcImFsbG93XCIsaSksbC5vbmxvYWQ9ZnVuY3Rpb24oKXtsLm9ubG9hZD1udWxsLGQobCxcIm5vZGUtcmVhZHlcIiksQyhuKSYmbigpfSxzJiZzLmFwcGVuZENoaWxkKGwpLGx9KHt1cmw6dC5ocmVmLGNhbGxiYWNrOm59KTtzLnBhcmVudE5vZGUuc3R5bGUubWF4V2lkdGg9dC53aWR0aCxzLnBhcmVudE5vZGUuc3R5bGUuaGVpZ2h0PXQuaGVpZ2h0LHMuYXBwZW5kQ2hpbGQobCl9dmFyIGo9cygoZnVuY3Rpb24gZSgpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp7fTtpKHRoaXMsZSksdGhpcy5kZWZhdWx0cz17aHJlZjpcIlwiLHNpemVzOlwiXCIsc3Jjc2V0OlwiXCIsdGl0bGU6XCJcIix0eXBlOlwiXCIsdmlkZW9Qcm92aWRlcjpcIlwiLGRlc2NyaXB0aW9uOlwiXCIsYWx0OlwiXCIsZGVzY1Bvc2l0aW9uOlwiYm90dG9tXCIsZWZmZWN0OlwiXCIsd2lkdGg6XCJcIixoZWlnaHQ6XCJcIixjb250ZW50OiExLHpvb21hYmxlOiEwLGRyYWdnYWJsZTohMH0sSSh0KSYmKHRoaXMuZGVmYXVsdHM9byh0aGlzLmRlZmF1bHRzLHQpKX0pLFt7a2V5Olwic291cmNlVHlwZVwiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PWU7cmV0dXJuIG51bGwhPT0oZT1lLnRvTG93ZXJDYXNlKCkpLm1hdGNoKC9cXC4oanBlZ3xqcGd8anBlfGdpZnxwbmd8YXBufHdlYnB8YXZpZnxzdmcpLyk/XCJpbWFnZVwiOmUubWF0Y2goLyh5b3V0dWJlXFwuY29tfHlvdXR1YmUtbm9jb29raWVcXC5jb20pXFwvd2F0Y2hcXD92PShbYS16QS1aMC05XFwtX10rKS8pfHxlLm1hdGNoKC95b3V0dVxcLmJlXFwvKFthLXpBLVowLTlcXC1fXSspLyl8fGUubWF0Y2goLyh5b3V0dWJlXFwuY29tfHlvdXR1YmUtbm9jb29raWVcXC5jb20pXFwvZW1iZWRcXC8oW2EtekEtWjAtOVxcLV9dKykvKXx8ZS5tYXRjaCgvKHlvdXR1YmVcXC5jb218eW91dHViZS1ub2Nvb2tpZVxcLmNvbSlcXC9zaG9ydHNcXC8oW2EtekEtWjAtOVxcLV9dKykvKXx8ZS5tYXRjaCgvdmltZW9cXC5jb21cXC8oWzAtOV0qKS8pfHxudWxsIT09ZS5tYXRjaCgvXFwuKG1wNHxvZ2d8d2VibXxtb3YpLyk/XCJ2aWRlb1wiOm51bGwhPT1lLm1hdGNoKC9cXC4obXAzfHdhdnx3bWF8YWFjfG9nZykvKT9cImF1ZGlvXCI6ZS5pbmRleE9mKFwiI1wiKT4tMSYmXCJcIiE9PXQuc3BsaXQoXCIjXCIpLnBvcCgpLnRyaW0oKT9cImlubGluZVwiOmUuaW5kZXhPZihcImdvYWpheD10cnVlXCIpPi0xP1wiYWpheFwiOlwiZXh0ZXJuYWxcIn19LHtrZXk6XCJwYXJzZUNvbmZpZ1wiLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dmFyIGk9dGhpcyxuPW8oe2Rlc2NQb3NpdGlvbjp0LmRlc2NQb3NpdGlvbn0sdGhpcy5kZWZhdWx0cyk7aWYoSShlKSYmIUUoZSkpe1AoZSxcInR5cGVcIil8fChQKGUsXCJjb250ZW50XCIpJiZlLmNvbnRlbnQ/ZS50eXBlPVwiaW5saW5lXCI6UChlLFwiaHJlZlwiKSYmKGUudHlwZT10aGlzLnNvdXJjZVR5cGUoZS5ocmVmKSkpO3ZhciBzPW8obixlKTtyZXR1cm4gdGhpcy5zZXRTaXplKHMsdCksc312YXIgbD1cIlwiLGE9ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWdsaWdodGJveFwiKSxoPWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtpZihcImFcIj09PWgmJihsPWUuaHJlZiksXCJpbWdcIj09PWgmJihsPWUuc3JjLG4uYWx0PWUuYWx0KSxuLmhyZWY9bCxyKG4sKGZ1bmN0aW9uKHMsbCl7UCh0LGwpJiZcIndpZHRoXCIhPT1sJiYobltsXT10W2xdKTt2YXIgbz1lLmRhdGFzZXRbbF07TyhvKXx8KG5bbF09aS5zYW5pdGl6ZVZhbHVlKG8pKX0pKSxuLmNvbnRlbnQmJihuLnR5cGU9XCJpbmxpbmVcIiksIW4udHlwZSYmbCYmKG4udHlwZT10aGlzLnNvdXJjZVR5cGUobCkpLE8oYSkpe2lmKCFuLnRpdGxlJiZcImFcIj09aCl7dmFyIGQ9ZS50aXRsZTtPKGQpfHxcIlwiPT09ZHx8KG4udGl0bGU9ZCl9aWYoIW4udGl0bGUmJlwiaW1nXCI9PWgpe3ZhciBjPWUuYWx0O08oYyl8fFwiXCI9PT1jfHwobi50aXRsZT1jKX19ZWxzZXt2YXIgdT1bXTtyKG4sKGZ1bmN0aW9uKGUsdCl7dS5wdXNoKFwiO1xcXFxzP1wiK3QpfSkpLHU9dS5qb2luKFwiXFxcXHM/OnxcIiksXCJcIiE9PWEudHJpbSgpJiZyKG4sKGZ1bmN0aW9uKGUsdCl7dmFyIHM9YSxsPW5ldyBSZWdFeHAoXCJzP1wiK3QrXCJzPzpzPyguKj8pKFwiK3UrXCJzPzp8JClcIiksbz1zLm1hdGNoKGwpO2lmKG8mJm8ubGVuZ3RoJiZvWzFdKXt2YXIgcj1vWzFdLnRyaW0oKS5yZXBsYWNlKC87XFxzKiQvLFwiXCIpO25bdF09aS5zYW5pdGl6ZVZhbHVlKHIpfX0pKX1pZihuLmRlc2NyaXB0aW9uJiZcIi5cIj09PW4uZGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsMSkpe3ZhciBnO3RyeXtnPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iobi5kZXNjcmlwdGlvbikuaW5uZXJIVE1MfWNhdGNoKGUpe2lmKCEoZSBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbikpdGhyb3cgZX1nJiYobi5kZXNjcmlwdGlvbj1nKX1pZighbi5kZXNjcmlwdGlvbil7dmFyIHY9ZS5xdWVyeVNlbGVjdG9yKFwiLmdsaWdodGJveC1kZXNjXCIpO3YmJihuLmRlc2NyaXB0aW9uPXYuaW5uZXJIVE1MKX1yZXR1cm4gdGhpcy5zZXRTaXplKG4sdCxlKSx0aGlzLnNsaWRlQ29uZmlnPW4sbn19LHtrZXk6XCJzZXRTaXplXCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXt2YXIgaT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06bnVsbCxuPVwidmlkZW9cIj09ZS50eXBlP3RoaXMuY2hlY2tTaXplKHQudmlkZW9zV2lkdGgpOnRoaXMuY2hlY2tTaXplKHQud2lkdGgpLHM9dGhpcy5jaGVja1NpemUodC5oZWlnaHQpO3JldHVybiBlLndpZHRoPVAoZSxcIndpZHRoXCIpJiZcIlwiIT09ZS53aWR0aD90aGlzLmNoZWNrU2l6ZShlLndpZHRoKTpuLGUuaGVpZ2h0PVAoZSxcImhlaWdodFwiKSYmXCJcIiE9PWUuaGVpZ2h0P3RoaXMuY2hlY2tTaXplKGUuaGVpZ2h0KTpzLGkmJlwiaW1hZ2VcIj09ZS50eXBlJiYoZS5faGFzQ3VzdG9tV2lkdGg9ISFpLmRhdGFzZXQud2lkdGgsZS5faGFzQ3VzdG9tSGVpZ2h0PSEhaS5kYXRhc2V0LmhlaWdodCksZX19LHtrZXk6XCJjaGVja1NpemVcIix2YWx1ZTpmdW5jdGlvbihlKXtyZXR1cm4geihlKT9cIlwiLmNvbmNhdChlLFwicHhcIik6ZX19LHtrZXk6XCJzYW5pdGl6ZVZhbHVlXCIsdmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuXCJ0cnVlXCIhPT1lJiZcImZhbHNlXCIhPT1lP2U6XCJ0cnVlXCI9PT1lfX1dKSxWPXMoKGZ1bmN0aW9uIGUodCxuLHMpe2kodGhpcyxlKSx0aGlzLmVsZW1lbnQ9dCx0aGlzLmluc3RhbmNlPW4sdGhpcy5pbmRleD1zfSksW3trZXk6XCJzZXRDb250ZW50XCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOm51bGwsaT1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXSYmYXJndW1lbnRzWzFdO2lmKHUodCxcImxvYWRlZFwiKSlyZXR1cm4hMTt2YXIgbj10aGlzLmluc3RhbmNlLnNldHRpbmdzLHM9dGhpcy5zbGlkZUNvbmZpZyxsPVQoKTtDKG4uYmVmb3JlU2xpZGVMb2FkKSYmbi5iZWZvcmVTbGlkZUxvYWQoe2luZGV4OnRoaXMuaW5kZXgsc2xpZGU6dCxwbGF5ZXI6ITF9KTt2YXIgbz1zLnR5cGUscj1zLmRlc2NQb3NpdGlvbixhPXQucXVlcnlTZWxlY3RvcihcIi5nc2xpZGUtbWVkaWFcIiksaD10LnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLXRpdGxlXCIpLGM9dC5xdWVyeVNlbGVjdG9yKFwiLmdzbGlkZS1kZXNjXCIpLGc9dC5xdWVyeVNlbGVjdG9yKFwiLmdkZXNjLWlubmVyXCIpLHY9aSxmPVwiZ1NsaWRlVGl0bGVfXCIrdGhpcy5pbmRleCxwPVwiZ1NsaWRlRGVzY19cIit0aGlzLmluZGV4O2lmKEMobi5hZnRlclNsaWRlTG9hZCkmJih2PWZ1bmN0aW9uKCl7QyhpKSYmaSgpLG4uYWZ0ZXJTbGlkZUxvYWQoe2luZGV4OmUuaW5kZXgsc2xpZGU6dCxwbGF5ZXI6ZS5pbnN0YW5jZS5nZXRTbGlkZVBsYXllckluc3RhbmNlKGUuaW5kZXgpfSl9KSxcIlwiPT1zLnRpdGxlJiZcIlwiPT1zLmRlc2NyaXB0aW9uP2cmJmcucGFyZW50Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGcucGFyZW50Tm9kZSk6KGgmJlwiXCIhPT1zLnRpdGxlPyhoLmlkPWYsaC5pbm5lckhUTUw9cy50aXRsZSk6aC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGgpLGMmJlwiXCIhPT1zLmRlc2NyaXB0aW9uPyhjLmlkPXAsbCYmbi5tb3JlTGVuZ3RoPjA/KHMuc21hbGxEZXNjcmlwdGlvbj10aGlzLnNsaWRlU2hvcnREZXNjKHMuZGVzY3JpcHRpb24sbi5tb3JlTGVuZ3RoLG4ubW9yZVRleHQpLGMuaW5uZXJIVE1MPXMuc21hbGxEZXNjcmlwdGlvbix0aGlzLmRlc2NyaXB0aW9uRXZlbnRzKGMscykpOmMuaW5uZXJIVE1MPXMuZGVzY3JpcHRpb24pOmMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjKSxkKGEucGFyZW50Tm9kZSxcImRlc2MtXCIuY29uY2F0KHIpKSxkKGcucGFyZW50Tm9kZSxcImRlc2NyaXB0aW9uLVwiLmNvbmNhdChyKSkpLGQoYSxcImdzbGlkZS1cIi5jb25jYXQobykpLGQodCxcImxvYWRlZFwiKSxcInZpZGVvXCIhPT1vKXtpZihcImV4dGVybmFsXCIhPT1vKXJldHVyblwiaW5saW5lXCI9PT1vPyhCLmFwcGx5KHRoaXMuaW5zdGFuY2UsW3Qscyx0aGlzLmluZGV4LHZdKSx2b2lkKHMuZHJhZ2dhYmxlJiZuZXcgTih7ZHJhZ0VsOnQucXVlcnlTZWxlY3RvcihcIi5nc2xpZGUtaW5saW5lXCIpLHRvbGVyYW5jZVg6bi5kcmFnVG9sZXJhbmNlWCx0b2xlcmFuY2VZOm4uZHJhZ1RvbGVyYW5jZVksc2xpZGU6dCxpbnN0YW5jZTp0aGlzLmluc3RhbmNlfSkpKTp2b2lkKFwiaW1hZ2VcIiE9PW8/Qyh2KSYmdigpOkQodCxzLHRoaXMuaW5kZXgsKGZ1bmN0aW9uKCl7dmFyIGk9dC5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO3MuZHJhZ2dhYmxlJiZuZXcgTih7ZHJhZ0VsOmksdG9sZXJhbmNlWDpuLmRyYWdUb2xlcmFuY2VYLHRvbGVyYW5jZVk6bi5kcmFnVG9sZXJhbmNlWSxzbGlkZTp0LGluc3RhbmNlOmUuaW5zdGFuY2V9KSxzLnpvb21hYmxlJiZpLm5hdHVyYWxXaWR0aD5pLm9mZnNldFdpZHRoJiYoZChpLFwiem9vbWFibGVcIiksbmV3IHEoaSx0LChmdW5jdGlvbigpe2UuaW5zdGFuY2UucmVzaXplKCl9KSkpLEModikmJnYoKX0pKSk7SC5hcHBseSh0aGlzLFt0LHMsdGhpcy5pbmRleCx2XSl9ZWxzZSBfLmFwcGx5KHRoaXMuaW5zdGFuY2UsW3Qscyx0aGlzLmluZGV4LHZdKX19LHtrZXk6XCJzbGlkZVNob3J0RGVzY1wiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTo1MCxpPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl0sbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO24uaW5uZXJIVE1MPWU7dmFyIHM9bi5pbm5lclRleHQsbD1pO2lmKChlPXMudHJpbSgpKS5sZW5ndGg8PXQpcmV0dXJuIGU7dmFyIG89ZS5zdWJzdHIoMCx0LTEpO3JldHVybiBsPyhuPW51bGwsbysnLi4uIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJkZXNjLW1vcmVcIj4nK2krXCI8L2E+XCIpOm99fSx7a2V5OlwiZGVzY3JpcHRpb25FdmVudHNcIix2YWx1ZTpmdW5jdGlvbihlLHQpe3ZhciBpPXRoaXMsbj1lLnF1ZXJ5U2VsZWN0b3IoXCIuZGVzYy1tb3JlXCIpO2lmKCFuKXJldHVybiExO2goXCJjbGlja1wiLHtvbkVsZW1lbnQ6bix3aXRoQ2FsbGJhY2s6ZnVuY3Rpb24oZSxuKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIHM9ZG9jdW1lbnQuYm9keSxsPWcobixcIi5nc2xpZGUtZGVzY1wiKTtpZighbClyZXR1cm4hMTtsLmlubmVySFRNTD10LmRlc2NyaXB0aW9uLGQocyxcImdkZXNjLW9wZW5cIik7dmFyIG89aChcImNsaWNrXCIse29uRWxlbWVudDpbcyxnKGwsXCIuZ3NsaWRlLWRlc2NyaXB0aW9uXCIpXSx3aXRoQ2FsbGJhY2s6ZnVuY3Rpb24oZSxuKXtcImFcIiE9PWUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJihjKHMsXCJnZGVzYy1vcGVuXCIpLGQocyxcImdkZXNjLWNsb3NlZFwiKSxsLmlubmVySFRNTD10LnNtYWxsRGVzY3JpcHRpb24saS5kZXNjcmlwdGlvbkV2ZW50cyhsLHQpLHNldFRpbWVvdXQoKGZ1bmN0aW9uKCl7YyhzLFwiZ2Rlc2MtY2xvc2VkXCIpfSksNDAwKSxvLmRlc3Ryb3koKSl9fSl9fSl9fSx7a2V5OlwiY3JlYXRlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4geSh0aGlzLmluc3RhbmNlLnNldHRpbmdzLnNsaWRlSFRNTCl9fSx7a2V5OlwiZ2V0Q29uZmlnXCIsdmFsdWU6ZnVuY3Rpb24oKXtFKHRoaXMuZWxlbWVudCl8fHRoaXMuZWxlbWVudC5oYXNPd25Qcm9wZXJ0eShcImRyYWdnYWJsZVwiKXx8KHRoaXMuZWxlbWVudC5kcmFnZ2FibGU9dGhpcy5pbnN0YW5jZS5zZXR0aW5ncy5kcmFnZ2FibGUpO3ZhciBlPW5ldyBqKHRoaXMuaW5zdGFuY2Uuc2V0dGluZ3Muc2xpZGVFeHRyYUF0dHJpYnV0ZXMpO3JldHVybiB0aGlzLnNsaWRlQ29uZmlnPWUucGFyc2VDb25maWcodGhpcy5lbGVtZW50LHRoaXMuaW5zdGFuY2Uuc2V0dGluZ3MpLHRoaXMuc2xpZGVDb25maWd9fV0pO2Z1bmN0aW9uIEYoZSl7cmV0dXJuIE1hdGguc3FydChlLngqZS54K2UueSplLnkpfWZ1bmN0aW9uIFIoZSx0KXt2YXIgaT1mdW5jdGlvbihlLHQpe3ZhciBpPUYoZSkqRih0KTtpZigwPT09aSlyZXR1cm4gMDt2YXIgbj1mdW5jdGlvbihlLHQpe3JldHVybiBlLngqdC54K2UueSp0Lnl9KGUsdCkvaTtyZXR1cm4gbj4xJiYobj0xKSxNYXRoLmFjb3Mobil9KGUsdCk7cmV0dXJuIGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUueCp0LnktdC54KmUueX0oZSx0KT4wJiYoaSo9LTEpLDE4MCppL01hdGguUEl9dmFyIEc9cygoZnVuY3Rpb24gZSh0KXtpKHRoaXMsZSksdGhpcy5oYW5kbGVycz1bXSx0aGlzLmVsPXR9KSxbe2tleTpcImFkZFwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuaGFuZGxlcnMucHVzaChlKX19LHtrZXk6XCJkZWxcIix2YWx1ZTpmdW5jdGlvbihlKXtlfHwodGhpcy5oYW5kbGVycz1bXSk7Zm9yKHZhciB0PXRoaXMuaGFuZGxlcnMubGVuZ3RoO3Q+PTA7dC0tKXRoaXMuaGFuZGxlcnNbdF09PT1lJiZ0aGlzLmhhbmRsZXJzLnNwbGljZSh0LDEpfX0se2tleTpcImRpc3BhdGNoXCIsdmFsdWU6ZnVuY3Rpb24oKXtmb3IodmFyIGU9MCx0PXRoaXMuaGFuZGxlcnMubGVuZ3RoO2U8dDtlKyspe3ZhciBpPXRoaXMuaGFuZGxlcnNbZV07XCJmdW5jdGlvblwiPT10eXBlb2YgaSYmaS5hcHBseSh0aGlzLmVsLGFyZ3VtZW50cyl9fX1dKTtmdW5jdGlvbiBaKGUsdCl7dmFyIGk9bmV3IEcoZSk7cmV0dXJuIGkuYWRkKHQpLGl9dmFyIFU9cygoZnVuY3Rpb24gZSh0LG4pe2kodGhpcyxlKSx0aGlzLmVsZW1lbnQ9XCJzdHJpbmdcIj09dHlwZW9mIHQ/ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0KTp0LHRoaXMuc3RhcnQ9dGhpcy5zdGFydC5iaW5kKHRoaXMpLHRoaXMubW92ZT10aGlzLm1vdmUuYmluZCh0aGlzKSx0aGlzLmVuZD10aGlzLmVuZC5iaW5kKHRoaXMpLHRoaXMuY2FuY2VsPXRoaXMuY2FuY2VsLmJpbmQodGhpcyksdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdGhpcy5zdGFydCwhMSksdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIix0aGlzLm1vdmUsITEpLHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0aGlzLmVuZCwhMSksdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLHRoaXMuY2FuY2VsLCExKSx0aGlzLnByZVY9e3g6bnVsbCx5Om51bGx9LHRoaXMucGluY2hTdGFydExlbj1udWxsLHRoaXMuem9vbT0xLHRoaXMuaXNEb3VibGVUYXA9ITE7dmFyIHM9ZnVuY3Rpb24oKXt9O3RoaXMucm90YXRlPVoodGhpcy5lbGVtZW50LG4ucm90YXRlfHxzKSx0aGlzLnRvdWNoU3RhcnQ9Wih0aGlzLmVsZW1lbnQsbi50b3VjaFN0YXJ0fHxzKSx0aGlzLm11bHRpcG9pbnRTdGFydD1aKHRoaXMuZWxlbWVudCxuLm11bHRpcG9pbnRTdGFydHx8cyksdGhpcy5tdWx0aXBvaW50RW5kPVoodGhpcy5lbGVtZW50LG4ubXVsdGlwb2ludEVuZHx8cyksdGhpcy5waW5jaD1aKHRoaXMuZWxlbWVudCxuLnBpbmNofHxzKSx0aGlzLnN3aXBlPVoodGhpcy5lbGVtZW50LG4uc3dpcGV8fHMpLHRoaXMudGFwPVoodGhpcy5lbGVtZW50LG4udGFwfHxzKSx0aGlzLmRvdWJsZVRhcD1aKHRoaXMuZWxlbWVudCxuLmRvdWJsZVRhcHx8cyksdGhpcy5sb25nVGFwPVoodGhpcy5lbGVtZW50LG4ubG9uZ1RhcHx8cyksdGhpcy5zaW5nbGVUYXA9Wih0aGlzLmVsZW1lbnQsbi5zaW5nbGVUYXB8fHMpLHRoaXMucHJlc3NNb3ZlPVoodGhpcy5lbGVtZW50LG4ucHJlc3NNb3ZlfHxzKSx0aGlzLnR3b0ZpbmdlclByZXNzTW92ZT1aKHRoaXMuZWxlbWVudCxuLnR3b0ZpbmdlclByZXNzTW92ZXx8cyksdGhpcy50b3VjaE1vdmU9Wih0aGlzLmVsZW1lbnQsbi50b3VjaE1vdmV8fHMpLHRoaXMudG91Y2hFbmQ9Wih0aGlzLmVsZW1lbnQsbi50b3VjaEVuZHx8cyksdGhpcy50b3VjaENhbmNlbD1aKHRoaXMuZWxlbWVudCxuLnRvdWNoQ2FuY2VsfHxzKSx0aGlzLnRyYW5zbGF0ZUNvbnRhaW5lcj10aGlzLmVsZW1lbnQsdGhpcy5fY2FuY2VsQWxsSGFuZGxlcj10aGlzLmNhbmNlbEFsbC5iaW5kKHRoaXMpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsdGhpcy5fY2FuY2VsQWxsSGFuZGxlciksdGhpcy5kZWx0YT1udWxsLHRoaXMubGFzdD1udWxsLHRoaXMubm93PW51bGwsdGhpcy50YXBUaW1lb3V0PW51bGwsdGhpcy5zaW5nbGVUYXBUaW1lb3V0PW51bGwsdGhpcy5sb25nVGFwVGltZW91dD1udWxsLHRoaXMuc3dpcGVUaW1lb3V0PW51bGwsdGhpcy54MT10aGlzLngyPXRoaXMueTE9dGhpcy55Mj1udWxsLHRoaXMucHJlVGFwUG9zaXRpb249e3g6bnVsbCx5Om51bGx9fSksW3trZXk6XCJzdGFydFwiLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKGUudG91Y2hlcylpZihlLnRhcmdldCYmZS50YXJnZXQubm9kZU5hbWUmJltcImFcIixcImJ1dHRvblwiLFwiaW5wdXRcIl0uaW5kZXhPZihlLnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKT49MCljb25zb2xlLmxvZyhcImlnbm9yZSBkcmFnIGZvciB0aGlzIHRvdWNoZWQgZWxlbWVudFwiLGUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpO2Vsc2V7dGhpcy5ub3c9RGF0ZS5ub3coKSx0aGlzLngxPWUudG91Y2hlc1swXS5wYWdlWCx0aGlzLnkxPWUudG91Y2hlc1swXS5wYWdlWSx0aGlzLmRlbHRhPXRoaXMubm93LSh0aGlzLmxhc3R8fHRoaXMubm93KSx0aGlzLnRvdWNoU3RhcnQuZGlzcGF0Y2goZSx0aGlzLmVsZW1lbnQpLG51bGwhPT10aGlzLnByZVRhcFBvc2l0aW9uLngmJih0aGlzLmlzRG91YmxlVGFwPXRoaXMuZGVsdGE+MCYmdGhpcy5kZWx0YTw9MjUwJiZNYXRoLmFicyh0aGlzLnByZVRhcFBvc2l0aW9uLngtdGhpcy54MSk8MzAmJk1hdGguYWJzKHRoaXMucHJlVGFwUG9zaXRpb24ueS10aGlzLnkxKTwzMCx0aGlzLmlzRG91YmxlVGFwJiZjbGVhclRpbWVvdXQodGhpcy5zaW5nbGVUYXBUaW1lb3V0KSksdGhpcy5wcmVUYXBQb3NpdGlvbi54PXRoaXMueDEsdGhpcy5wcmVUYXBQb3NpdGlvbi55PXRoaXMueTEsdGhpcy5sYXN0PXRoaXMubm93O3ZhciB0PXRoaXMucHJlVjtpZihlLnRvdWNoZXMubGVuZ3RoPjEpe3RoaXMuX2NhbmNlbExvbmdUYXAoKSx0aGlzLl9jYW5jZWxTaW5nbGVUYXAoKTt2YXIgaT17eDplLnRvdWNoZXNbMV0ucGFnZVgtdGhpcy54MSx5OmUudG91Y2hlc1sxXS5wYWdlWS10aGlzLnkxfTt0Lng9aS54LHQueT1pLnksdGhpcy5waW5jaFN0YXJ0TGVuPUYodCksdGhpcy5tdWx0aXBvaW50U3RhcnQuZGlzcGF0Y2goZSx0aGlzLmVsZW1lbnQpfXRoaXMuX3ByZXZlbnRUYXA9ITEsdGhpcy5sb25nVGFwVGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5sb25nVGFwLmRpc3BhdGNoKGUsdGhpcy5lbGVtZW50KSx0aGlzLl9wcmV2ZW50VGFwPSEwfS5iaW5kKHRoaXMpLDc1MCl9fX0se2tleTpcIm1vdmVcIix2YWx1ZTpmdW5jdGlvbihlKXtpZihlLnRvdWNoZXMpe3ZhciB0PXRoaXMucHJlVixpPWUudG91Y2hlcy5sZW5ndGgsbj1lLnRvdWNoZXNbMF0ucGFnZVgscz1lLnRvdWNoZXNbMF0ucGFnZVk7aWYodGhpcy5pc0RvdWJsZVRhcD0hMSxpPjEpe3ZhciBsPWUudG91Y2hlc1sxXS5wYWdlWCxvPWUudG91Y2hlc1sxXS5wYWdlWSxyPXt4OmUudG91Y2hlc1sxXS5wYWdlWC1uLHk6ZS50b3VjaGVzWzFdLnBhZ2VZLXN9O251bGwhPT10LngmJih0aGlzLnBpbmNoU3RhcnRMZW4+MCYmKGUuem9vbT1GKHIpL3RoaXMucGluY2hTdGFydExlbix0aGlzLnBpbmNoLmRpc3BhdGNoKGUsdGhpcy5lbGVtZW50KSksZS5hbmdsZT1SKHIsdCksdGhpcy5yb3RhdGUuZGlzcGF0Y2goZSx0aGlzLmVsZW1lbnQpKSx0Lng9ci54LHQueT1yLnksbnVsbCE9PXRoaXMueDImJm51bGwhPT10aGlzLnN4Mj8oZS5kZWx0YVg9KG4tdGhpcy54MitsLXRoaXMuc3gyKS8yLGUuZGVsdGFZPShzLXRoaXMueTIrby10aGlzLnN5MikvMik6KGUuZGVsdGFYPTAsZS5kZWx0YVk9MCksdGhpcy50d29GaW5nZXJQcmVzc01vdmUuZGlzcGF0Y2goZSx0aGlzLmVsZW1lbnQpLHRoaXMuc3gyPWwsdGhpcy5zeTI9b31lbHNle2lmKG51bGwhPT10aGlzLngyKXtlLmRlbHRhWD1uLXRoaXMueDIsZS5kZWx0YVk9cy10aGlzLnkyO3ZhciBhPU1hdGguYWJzKHRoaXMueDEtdGhpcy54MiksaD1NYXRoLmFicyh0aGlzLnkxLXRoaXMueTIpOyhhPjEwfHxoPjEwKSYmKHRoaXMuX3ByZXZlbnRUYXA9ITApfWVsc2UgZS5kZWx0YVg9MCxlLmRlbHRhWT0wO3RoaXMucHJlc3NNb3ZlLmRpc3BhdGNoKGUsdGhpcy5lbGVtZW50KX10aGlzLnRvdWNoTW92ZS5kaXNwYXRjaChlLHRoaXMuZWxlbWVudCksdGhpcy5fY2FuY2VsTG9uZ1RhcCgpLHRoaXMueDI9bix0aGlzLnkyPXMsaT4xJiZlLnByZXZlbnREZWZhdWx0KCl9fX0se2tleTpcImVuZFwiLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKGUuY2hhbmdlZFRvdWNoZXMpe3RoaXMuX2NhbmNlbExvbmdUYXAoKTt2YXIgdD10aGlzO2UudG91Y2hlcy5sZW5ndGg8MiYmKHRoaXMubXVsdGlwb2ludEVuZC5kaXNwYXRjaChlLHRoaXMuZWxlbWVudCksdGhpcy5zeDI9dGhpcy5zeTI9bnVsbCksdGhpcy54MiYmTWF0aC5hYnModGhpcy54MS10aGlzLngyKT4zMHx8dGhpcy55MiYmTWF0aC5hYnModGhpcy55MS10aGlzLnkyKT4zMD8oZS5kaXJlY3Rpb249dGhpcy5fc3dpcGVEaXJlY3Rpb24odGhpcy54MSx0aGlzLngyLHRoaXMueTEsdGhpcy55MiksdGhpcy5zd2lwZVRpbWVvdXQ9c2V0VGltZW91dCgoZnVuY3Rpb24oKXt0LnN3aXBlLmRpc3BhdGNoKGUsdC5lbGVtZW50KX0pLDApKToodGhpcy50YXBUaW1lb3V0PXNldFRpbWVvdXQoKGZ1bmN0aW9uKCl7dC5fcHJldmVudFRhcHx8dC50YXAuZGlzcGF0Y2goZSx0LmVsZW1lbnQpLHQuaXNEb3VibGVUYXAmJih0LmRvdWJsZVRhcC5kaXNwYXRjaChlLHQuZWxlbWVudCksdC5pc0RvdWJsZVRhcD0hMSl9KSwwKSx0LmlzRG91YmxlVGFwfHwodC5zaW5nbGVUYXBUaW1lb3V0PXNldFRpbWVvdXQoKGZ1bmN0aW9uKCl7dC5zaW5nbGVUYXAuZGlzcGF0Y2goZSx0LmVsZW1lbnQpfSksMjUwKSkpLHRoaXMudG91Y2hFbmQuZGlzcGF0Y2goZSx0aGlzLmVsZW1lbnQpLHRoaXMucHJlVi54PTAsdGhpcy5wcmVWLnk9MCx0aGlzLnpvb209MSx0aGlzLnBpbmNoU3RhcnRMZW49bnVsbCx0aGlzLngxPXRoaXMueDI9dGhpcy55MT10aGlzLnkyPW51bGx9fX0se2tleTpcImNhbmNlbEFsbFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5fcHJldmVudFRhcD0hMCxjbGVhclRpbWVvdXQodGhpcy5zaW5nbGVUYXBUaW1lb3V0KSxjbGVhclRpbWVvdXQodGhpcy50YXBUaW1lb3V0KSxjbGVhclRpbWVvdXQodGhpcy5sb25nVGFwVGltZW91dCksY2xlYXJUaW1lb3V0KHRoaXMuc3dpcGVUaW1lb3V0KX19LHtrZXk6XCJjYW5jZWxcIix2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLmNhbmNlbEFsbCgpLHRoaXMudG91Y2hDYW5jZWwuZGlzcGF0Y2goZSx0aGlzLmVsZW1lbnQpfX0se2tleTpcIl9jYW5jZWxMb25nVGFwXCIsdmFsdWU6ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodGhpcy5sb25nVGFwVGltZW91dCl9fSx7a2V5OlwiX2NhbmNlbFNpbmdsZVRhcFwiLHZhbHVlOmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuc2luZ2xlVGFwVGltZW91dCl9fSx7a2V5OlwiX3N3aXBlRGlyZWN0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oZSx0LGksbil7cmV0dXJuIE1hdGguYWJzKGUtdCk+PU1hdGguYWJzKGktbik/ZS10PjA/XCJMZWZ0XCI6XCJSaWdodFwiOmktbj4wP1wiVXBcIjpcIkRvd25cIn19LHtrZXk6XCJvblwiLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dGhpc1tlXSYmdGhpc1tlXS5hZGQodCl9fSx7a2V5Olwib2ZmXCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXt0aGlzW2VdJiZ0aGlzW2VdLmRlbCh0KX19LHtrZXk6XCJkZXN0cm95XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zaW5nbGVUYXBUaW1lb3V0JiZjbGVhclRpbWVvdXQodGhpcy5zaW5nbGVUYXBUaW1lb3V0KSx0aGlzLnRhcFRpbWVvdXQmJmNsZWFyVGltZW91dCh0aGlzLnRhcFRpbWVvdXQpLHRoaXMubG9uZ1RhcFRpbWVvdXQmJmNsZWFyVGltZW91dCh0aGlzLmxvbmdUYXBUaW1lb3V0KSx0aGlzLnN3aXBlVGltZW91dCYmY2xlYXJUaW1lb3V0KHRoaXMuc3dpcGVUaW1lb3V0KSx0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0aGlzLnN0YXJ0KSx0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLHRoaXMubW92ZSksdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHRoaXMuZW5kKSx0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsdGhpcy5jYW5jZWwpLHRoaXMucm90YXRlLmRlbCgpLHRoaXMudG91Y2hTdGFydC5kZWwoKSx0aGlzLm11bHRpcG9pbnRTdGFydC5kZWwoKSx0aGlzLm11bHRpcG9pbnRFbmQuZGVsKCksdGhpcy5waW5jaC5kZWwoKSx0aGlzLnN3aXBlLmRlbCgpLHRoaXMudGFwLmRlbCgpLHRoaXMuZG91YmxlVGFwLmRlbCgpLHRoaXMubG9uZ1RhcC5kZWwoKSx0aGlzLnNpbmdsZVRhcC5kZWwoKSx0aGlzLnByZXNzTW92ZS5kZWwoKSx0aGlzLnR3b0ZpbmdlclByZXNzTW92ZS5kZWwoKSx0aGlzLnRvdWNoTW92ZS5kZWwoKSx0aGlzLnRvdWNoRW5kLmRlbCgpLHRoaXMudG91Y2hDYW5jZWwuZGVsKCksdGhpcy5wcmVWPXRoaXMucGluY2hTdGFydExlbj10aGlzLnpvb209dGhpcy5pc0RvdWJsZVRhcD10aGlzLmRlbHRhPXRoaXMubGFzdD10aGlzLm5vdz10aGlzLnRhcFRpbWVvdXQ9dGhpcy5zaW5nbGVUYXBUaW1lb3V0PXRoaXMubG9uZ1RhcFRpbWVvdXQ9dGhpcy5zd2lwZVRpbWVvdXQ9dGhpcy54MT10aGlzLngyPXRoaXMueTE9dGhpcy55Mj10aGlzLnByZVRhcFBvc2l0aW9uPXRoaXMucm90YXRlPXRoaXMudG91Y2hTdGFydD10aGlzLm11bHRpcG9pbnRTdGFydD10aGlzLm11bHRpcG9pbnRFbmQ9dGhpcy5waW5jaD10aGlzLnN3aXBlPXRoaXMudGFwPXRoaXMuZG91YmxlVGFwPXRoaXMubG9uZ1RhcD10aGlzLnNpbmdsZVRhcD10aGlzLnByZXNzTW92ZT10aGlzLnRvdWNoTW92ZT10aGlzLnRvdWNoRW5kPXRoaXMudG91Y2hDYW5jZWw9dGhpcy50d29GaW5nZXJQcmVzc01vdmU9bnVsbCx3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLHRoaXMuX2NhbmNlbEFsbEhhbmRsZXIpLG51bGx9fV0pO2Z1bmN0aW9uICQoZSl7dmFyIHQ9ZnVuY3Rpb24oKXt2YXIgZSx0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmYWtlZWxlbWVudFwiKSxpPXt0cmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwiLE9UcmFuc2l0aW9uOlwib1RyYW5zaXRpb25FbmRcIixNb3pUcmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwiLFdlYmtpdFRyYW5zaXRpb246XCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCJ9O2ZvcihlIGluIGkpaWYodm9pZCAwIT09dC5zdHlsZVtlXSlyZXR1cm4gaVtlXX0oKSxpPXdpbmRvdy5pbm5lcldpZHRofHxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGh8fGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsbj11KGUsXCJnc2xpZGUtbWVkaWFcIik/ZTplLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLW1lZGlhXCIpLHM9ZyhuLFwiLmdpbm5lci1jb250YWluZXJcIiksbD1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLWRlc2NyaXB0aW9uXCIpO2k+NzY5JiYobj1zKSxkKG4sXCJncmVzZXRcIiksZihuLFwidHJhbnNsYXRlM2QoMCwgMCwgMClcIiksaCh0LHtvbkVsZW1lbnQ6bixvbmNlOiEwLHdpdGhDYWxsYmFjazpmdW5jdGlvbihlLHQpe2MobixcImdyZXNldFwiKX19KSxuLnN0eWxlLm9wYWNpdHk9XCJcIixsJiYobC5zdHlsZS5vcGFjaXR5PVwiXCIpfWZ1bmN0aW9uIEooZSl7aWYoZS5ldmVudHMuaGFzT3duUHJvcGVydHkoXCJ0b3VjaFwiKSlyZXR1cm4hMTt2YXIgdCxpLG4scz14KCksbD1zLndpZHRoLG89cy5oZWlnaHQscj0hMSxhPW51bGwsaD1udWxsLHY9bnVsbCxwPSExLG09MSx5PTEsYj0hMSxTPSExLHc9bnVsbCxUPW51bGwsQz1udWxsLGs9bnVsbCxFPTAsQT0wLEw9ITEsST0hMSxPPXt9LFA9e30sTT0wLHo9MCxYPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2xpZ2h0Ym94LXNsaWRlclwiKSxZPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ292ZXJsYXlcIikscT1uZXcgVShYLHt0b3VjaFN0YXJ0OmZ1bmN0aW9uKHQpe2lmKHI9ITAsKHUodC50YXJnZXRUb3VjaGVzWzBdLnRhcmdldCxcImdpbm5lci1jb250YWluZXJcIil8fGcodC50YXJnZXRUb3VjaGVzWzBdLnRhcmdldCxcIi5nc2xpZGUtZGVzY1wiKXx8XCJhXCI9PXQudGFyZ2V0VG91Y2hlc1swXS50YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkmJihyPSExKSxnKHQudGFyZ2V0VG91Y2hlc1swXS50YXJnZXQsXCIuZ3NsaWRlLWlubGluZVwiKSYmIXUodC50YXJnZXRUb3VjaGVzWzBdLnRhcmdldC5wYXJlbnROb2RlLFwiZ3NsaWRlLWlubGluZVwiKSYmKHI9ITEpLHIpe2lmKFA9dC50YXJnZXRUb3VjaGVzWzBdLE8ucGFnZVg9dC50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYLE8ucGFnZVk9dC50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZLE09dC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsej10LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSxhPWUuYWN0aXZlU2xpZGUsaD1hLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLW1lZGlhXCIpLG49YS5xdWVyeVNlbGVjdG9yKFwiLmdzbGlkZS1pbmxpbmVcIiksdj1udWxsLHUoaCxcImdzbGlkZS1pbWFnZVwiKSYmKHY9aC5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSwod2luZG93LmlubmVyV2lkdGh8fGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aHx8ZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCk+NzY5JiYoaD1hLnF1ZXJ5U2VsZWN0b3IoXCIuZ2lubmVyLWNvbnRhaW5lclwiKSksYyhZLFwiZ3Jlc2V0XCIpLHQucGFnZVg+MjAmJnQucGFnZVg8d2luZG93LmlubmVyV2lkdGgtMjApcmV0dXJuO3QucHJldmVudERlZmF1bHQoKX19LHRvdWNoTW92ZTpmdW5jdGlvbihzKXtpZihyJiYoUD1zLnRhcmdldFRvdWNoZXNbMF0sIWImJiFTKSl7aWYobiYmbi5vZmZzZXRIZWlnaHQ+byl7dmFyIGE9Ty5wYWdlWC1QLnBhZ2VYO2lmKE1hdGguYWJzKGEpPD0xMylyZXR1cm4hMX1wPSEwO3ZhciBkLGM9cy50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsdT1zLnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSxnPU0tYyxtPXotdTtpZihNYXRoLmFicyhnKT5NYXRoLmFicyhtKT8oTD0hMSxJPSEwKTooST0hMSxMPSEwKSx0PVAucGFnZVgtTy5wYWdlWCxFPTEwMCp0L2wsaT1QLnBhZ2VZLU8ucGFnZVksQT0xMDAqaS9vLEwmJnYmJihkPTEtTWF0aC5hYnMoaSkvbyxZLnN0eWxlLm9wYWNpdHk9ZCxlLnNldHRpbmdzLnRvdWNoRm9sbG93QXhpcyYmKEU9MCkpLEkmJihkPTEtTWF0aC5hYnModCkvbCxoLnN0eWxlLm9wYWNpdHk9ZCxlLnNldHRpbmdzLnRvdWNoRm9sbG93QXhpcyYmKEE9MCkpLCF2KXJldHVybiBmKGgsXCJ0cmFuc2xhdGUzZChcIi5jb25jYXQoRSxcIiUsIDAsIDApXCIpKTtmKGgsXCJ0cmFuc2xhdGUzZChcIi5jb25jYXQoRSxcIiUsIFwiKS5jb25jYXQoQSxcIiUsIDApXCIpKX19LHRvdWNoRW5kOmZ1bmN0aW9uKCl7aWYocil7aWYocD0hMSxTfHxiKXJldHVybiBDPXcsdm9pZChrPVQpO3ZhciB0PU1hdGguYWJzKHBhcnNlSW50KEEpKSxpPU1hdGguYWJzKHBhcnNlSW50KEUpKTtpZighKHQ+MjkmJnYpKXJldHVybiB0PDI5JiZpPDI1PyhkKFksXCJncmVzZXRcIiksWS5zdHlsZS5vcGFjaXR5PTEsJChoKSk6dm9pZCAwO2UuY2xvc2UoKX19LG11bHRpcG9pbnRFbmQ6ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KChmdW5jdGlvbigpe2I9ITF9KSw1MCl9LG11bHRpcG9pbnRTdGFydDpmdW5jdGlvbigpe2I9ITAsbT15fHwxfSxwaW5jaDpmdW5jdGlvbihlKXtpZighdnx8cClyZXR1cm4hMTtiPSEwLHYuc2NhbGVYPXYuc2NhbGVZPW0qZS56b29tO3ZhciB0PW0qZS56b29tO2lmKFM9ITAsdDw9MSlyZXR1cm4gUz0hMSx0PTEsaz1udWxsLEM9bnVsbCx3PW51bGwsVD1udWxsLHZvaWQgdi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwiXCIpO3Q+NC41JiYodD00LjUpLHYuc3R5bGUudHJhbnNmb3JtPVwic2NhbGUzZChcIi5jb25jYXQodCxcIiwgXCIpLmNvbmNhdCh0LFwiLCAxKVwiKSx5PXR9LHByZXNzTW92ZTpmdW5jdGlvbihlKXtpZihTJiYhYil7dmFyIHQ9UC5wYWdlWC1PLnBhZ2VYLGk9UC5wYWdlWS1PLnBhZ2VZO0MmJih0Kz1DKSxrJiYoaSs9ayksdz10LFQ9aTt2YXIgbj1cInRyYW5zbGF0ZTNkKFwiLmNvbmNhdCh0LFwicHgsIFwiKS5jb25jYXQoaSxcInB4LCAwKVwiKTt5JiYobis9XCIgc2NhbGUzZChcIi5jb25jYXQoeSxcIiwgXCIpLmNvbmNhdCh5LFwiLCAxKVwiKSksZih2LG4pfX0sc3dpcGU6ZnVuY3Rpb24odCl7aWYoIVMpaWYoYiliPSExO2Vsc2V7aWYoXCJMZWZ0XCI9PXQuZGlyZWN0aW9uKXtpZihlLmluZGV4PT1lLmVsZW1lbnRzLmxlbmd0aC0xKXJldHVybiAkKGgpO2UubmV4dFNsaWRlKCl9aWYoXCJSaWdodFwiPT10LmRpcmVjdGlvbil7aWYoMD09ZS5pbmRleClyZXR1cm4gJChoKTtlLnByZXZTbGlkZSgpfX19fSk7ZS5ldmVudHMudG91Y2g9cX12YXIgSz1UKCksUT1udWxsIT09VCgpfHx2b2lkIDAhPT1kb2N1bWVudC5jcmVhdGVUb3VjaHx8XCJvbnRvdWNoc3RhcnRcImluIHdpbmRvd3x8XCJvbm1zZ2VzdHVyZWNoYW5nZVwiaW4gd2luZG93fHxuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyxlZT1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImh0bWxcIilbMF0sdGU9e3NlbGVjdG9yOlwiLmdsaWdodGJveFwiLGVsZW1lbnRzOm51bGwsc2tpbjpcImNsZWFuXCIsdGhlbWU6XCJjbGVhblwiLGNsb3NlQnV0dG9uOiEwLHN0YXJ0QXQ6bnVsbCxhdXRvcGxheVZpZGVvczohMCxhdXRvZm9jdXNWaWRlb3M6ITAsZGVzY1Bvc2l0aW9uOlwiYm90dG9tXCIsd2lkdGg6XCI5MDBweFwiLGhlaWdodDpcIjUwNnB4XCIsdmlkZW9zV2lkdGg6XCI5NjBweFwiLGJlZm9yZVNsaWRlQ2hhbmdlOm51bGwsYWZ0ZXJTbGlkZUNoYW5nZTpudWxsLGJlZm9yZVNsaWRlTG9hZDpudWxsLGFmdGVyU2xpZGVMb2FkOm51bGwsc2xpZGVJbnNlcnRlZDpudWxsLHNsaWRlUmVtb3ZlZDpudWxsLHNsaWRlRXh0cmFBdHRyaWJ1dGVzOm51bGwsb25PcGVuOm51bGwsb25DbG9zZTpudWxsLGxvb3A6ITEsem9vbWFibGU6ITAsZHJhZ2dhYmxlOiEwLGRyYWdBdXRvU25hcDohMSxkcmFnVG9sZXJhbmNlWDo0MCxkcmFnVG9sZXJhbmNlWTo2NSxwcmVsb2FkOiEwLG9uZVNsaWRlUGVyT3BlbjohMSx0b3VjaE5hdmlnYXRpb246ITAsdG91Y2hGb2xsb3dBeGlzOiEwLGtleWJvYXJkTmF2aWdhdGlvbjohMCxjbG9zZU9uT3V0c2lkZUNsaWNrOiEwLHBsdWdpbnM6ITEscGx5cjp7Y3NzOlwiaHR0cHM6Ly9jZG4ucGx5ci5pby8zLjYuMTIvcGx5ci5jc3NcIixqczpcImh0dHBzOi8vY2RuLnBseXIuaW8vMy42LjEyL3BseXIuanNcIixjb25maWc6e3JhdGlvOlwiMTY6OVwiLGZ1bGxzY3JlZW46e2VuYWJsZWQ6ITAsaW9zTmF0aXZlOiEwfSx5b3V0dWJlOntub0Nvb2tpZTohMCxyZWw6MCxzaG93aW5mbzowLGl2X2xvYWRfcG9saWN5OjN9LHZpbWVvOntieWxpbmU6ITEscG9ydHJhaXQ6ITEsdGl0bGU6ITEsdHJhbnNwYXJlbnQ6ITF9fX0sb3BlbkVmZmVjdDpcInpvb21cIixjbG9zZUVmZmVjdDpcInpvb21cIixzbGlkZUVmZmVjdDpcInNsaWRlXCIsbW9yZVRleHQ6XCJTZWUgbW9yZVwiLG1vcmVMZW5ndGg6NjAsY3NzRWZlY3RzOntmYWRlOntpbjpcImZhZGVJblwiLG91dDpcImZhZGVPdXRcIn0sem9vbTp7aW46XCJ6b29tSW5cIixvdXQ6XCJ6b29tT3V0XCJ9LHNsaWRlOntpbjpcInNsaWRlSW5SaWdodFwiLG91dDpcInNsaWRlT3V0TGVmdFwifSxzbGlkZUJhY2s6e2luOlwic2xpZGVJbkxlZnRcIixvdXQ6XCJzbGlkZU91dFJpZ2h0XCJ9LG5vbmU6e2luOlwibm9uZVwiLG91dDpcIm5vbmVcIn19LHN2Zzp7Y2xvc2U6JzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48Zz48Zz48cGF0aCBkPVwiTTUwNS45NDMsNi4wNThjLTguMDc3LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDksMEw2LjA1OCw0NzYuNjkzYy04LjA3Nyw4LjA3Ny04LjA3NywyMS4xNzIsMCwyOS4yNDlDMTAuMDk2LDUwOS45ODIsMTUuMzksNTEyLDIwLjY4Myw1MTJjNS4yOTMsMCwxMC41ODYtMi4wMTksMTQuNjI1LTYuMDU5TDUwNS45NDMsMzUuMzA2QzUxNC4wMTksMjcuMjMsNTE0LjAxOSwxNC4xMzUsNTA1Ljk0Myw2LjA1OHpcIi8+PC9nPjwvZz48Zz48Zz48cGF0aCBkPVwiTTUwNS45NDIsNDc2LjY5NEwzNS4zMDYsNi4wNTljLTguMDc2LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDgsMGMtOC4wNzcsOC4wNzYtOC4wNzcsMjEuMTcxLDAsMjkuMjQ4bDQ3MC42MzYsNDcwLjYzNmM0LjAzOCw0LjAzOSw5LjMzMiw2LjA1OCwxNC42MjUsNi4wNThjNS4yOTMsMCwxMC41ODctMi4wMTksMTQuNjI0LTYuMDU3QzUxNC4wMTgsNDk3Ljg2Niw1MTQuMDE4LDQ4NC43NzEsNTA1Ljk0Miw0NzYuNjk0elwiLz48L2c+PC9nPjwvc3ZnPicsbmV4dDonPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDQ3Ny4xNzUgNDc3LjE3NVwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+IDxnPjxwYXRoIGQ9XCJNMzYwLjczMSwyMjkuMDc1bC0yMjUuMS0yMjUuMWMtNS4zLTUuMy0xMy44LTUuMy0xOS4xLDBzLTUuMywxMy44LDAsMTkuMWwyMTUuNSwyMTUuNWwtMjE1LjUsMjE1LjVjLTUuMyw1LjMtNS4zLDEzLjgsMCwxOS4xYzIuNiwyLjYsNi4xLDQsOS41LDRjMy40LDAsNi45LTEuMyw5LjUtNGwyMjUuMS0yMjUuMUMzNjUuOTMxLDI0Mi44NzUsMzY1LjkzMSwyMzQuMjc1LDM2MC43MzEsMjI5LjA3NXpcIi8+PC9nPjwvc3ZnPicscHJldjonPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDQ3Ny4xNzUgNDc3LjE3NVwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PGc+PHBhdGggZD1cIk0xNDUuMTg4LDIzOC41NzVsMjE1LjUtMjE1LjVjNS4zLTUuMyw1LjMtMTMuOCwwLTE5LjFzLTEzLjgtNS4zLTE5LjEsMGwtMjI1LjEsMjI1LjFjLTUuMyw1LjMtNS4zLDEzLjgsMCwxOS4xbDIyNS4xLDIyNWMyLjYsMi42LDYuMSw0LDkuNSw0czYuOS0xLjMsOS41LTRjNS4zLTUuMyw1LjMtMTMuOCwwLTE5LjFMMTQ1LjE4OCwyMzguNTc1elwiLz48L2c+PC9zdmc+J30sc2xpZGVIVE1MOic8ZGl2IGNsYXNzPVwiZ3NsaWRlXCI+XFxuICAgIDxkaXYgY2xhc3M9XCJnc2xpZGUtaW5uZXItY29udGVudFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImdpbm5lci1jb250YWluZXJcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3NsaWRlLW1lZGlhXCI+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdzbGlkZS1kZXNjcmlwdGlvblwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2Rlc2MtaW5uZXJcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cImdzbGlkZS10aXRsZVwiPjwvaDQ+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3NsaWRlLWRlc2NcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+JyxsaWdodGJveEhUTUw6JzxkaXYgaWQ9XCJnbGlnaHRib3gtYm9keVwiIGNsYXNzPVwiZ2xpZ2h0Ym94LWNvbnRhaW5lclwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1oaWRkZW49XCJmYWxzZVwiPlxcbiAgICA8ZGl2IGNsYXNzPVwiZ2xvYWRlciB2aXNpYmxlXCI+PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XCJnb3ZlcmxheVwiPjwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVwiZ2NvbnRhaW5lclwiPlxcbiAgICA8ZGl2IGlkPVwiZ2xpZ2h0Ym94LXNsaWRlclwiIGNsYXNzPVwiZ3NsaWRlclwiPjwvZGl2PlxcbiAgICA8YnV0dG9uIGNsYXNzPVwiZ2Nsb3NlIGdidG5cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBkYXRhLXRhYm9yZGVyPVwiM1wiPntjbG9zZVNWR308L2J1dHRvbj5cXG4gICAgPGJ1dHRvbiBjbGFzcz1cImdwcmV2IGdidG5cIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiBkYXRhLXRhYm9yZGVyPVwiMlwiPntwcmV2U1ZHfTwvYnV0dG9uPlxcbiAgICA8YnV0dG9uIGNsYXNzPVwiZ25leHQgZ2J0blwiIGFyaWEtbGFiZWw9XCJOZXh0XCIgZGF0YS10YWJvcmRlcj1cIjFcIj57bmV4dFNWR308L2J1dHRvbj5cXG48L2Rpdj5cXG48L2Rpdj4nfSxpZT1zKChmdW5jdGlvbiBlKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9O2kodGhpcyxlKSx0aGlzLmN1c3RvbU9wdGlvbnM9dCx0aGlzLnNldHRpbmdzPW8odGUsdCksdGhpcy5lZmZlY3RzQ2xhc3Nlcz10aGlzLmdldEFuaW1hdGlvbkNsYXNzZXMoKSx0aGlzLnZpZGVvUGxheWVycz17fSx0aGlzLmFwaUV2ZW50cz1bXSx0aGlzLmZ1bGxFbGVtZW50c0xpc3Q9ITF9KSxbe2tleTpcImluaXRcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMsdD10aGlzLmdldFNlbGVjdG9yKCk7dCYmKHRoaXMuYmFzZUV2ZW50cz1oKFwiY2xpY2tcIix7b25FbGVtZW50OnQsd2l0aENhbGxiYWNrOmZ1bmN0aW9uKHQsaSl7dC5wcmV2ZW50RGVmYXVsdCgpLGUub3BlbihpKX19KSksdGhpcy5lbGVtZW50cz10aGlzLmdldEVsZW1lbnRzKCl9fSx7a2V5Olwib3BlblwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOm51bGwsdD1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06bnVsbDtpZigwPT09dGhpcy5lbGVtZW50cy5sZW5ndGgpcmV0dXJuITE7dGhpcy5hY3RpdmVTbGlkZT1udWxsLHRoaXMucHJldkFjdGl2ZVNsaWRlSW5kZXg9bnVsbCx0aGlzLnByZXZBY3RpdmVTbGlkZT1udWxsO3ZhciBpPXoodCk/dDp0aGlzLnNldHRpbmdzLnN0YXJ0QXQ7aWYoRShlKSl7dmFyIG49ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWdhbGxlcnlcIik7biYmKHRoaXMuZnVsbEVsZW1lbnRzTGlzdD10aGlzLmVsZW1lbnRzLHRoaXMuZWxlbWVudHM9dGhpcy5nZXRHYWxsZXJ5RWxlbWVudHModGhpcy5lbGVtZW50cyxuKSksTyhpKSYmKGk9dGhpcy5nZXRFbGVtZW50SW5kZXgoZSkpPDAmJihpPTApfXooaSl8fChpPTApLHRoaXMuYnVpbGQoKSx2KHRoaXMub3ZlcmxheSxcIm5vbmVcIj09PXRoaXMuc2V0dGluZ3Mub3BlbkVmZmVjdD9cIm5vbmVcIjp0aGlzLnNldHRpbmdzLmNzc0VmZWN0cy5mYWRlLmluKTt2YXIgcz1kb2N1bWVudC5ib2R5LGw9d2luZG93LmlubmVyV2lkdGgtZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO2lmKGw+MCl7dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO28udHlwZT1cInRleHQvY3NzXCIsby5jbGFzc05hbWU9XCJnY3NzLXN0eWxlc1wiLG8uaW5uZXJUZXh0PVwiLmdzY3JvbGxiYXItZml4ZXIge21hcmdpbi1yaWdodDogXCIuY29uY2F0KGwsXCJweH1cIiksZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChvKSxkKHMsXCJnc2Nyb2xsYmFyLWZpeGVyXCIpfWQocyxcImdsaWdodGJveC1vcGVuXCIpLGQoZWUsXCJnbGlnaHRib3gtb3BlblwiKSxLJiYoZChkb2N1bWVudC5ib2R5LFwiZ2xpZ2h0Ym94LW1vYmlsZVwiKSx0aGlzLnNldHRpbmdzLnNsaWRlRWZmZWN0PVwic2xpZGVcIiksdGhpcy5zaG93U2xpZGUoaSwhMCksMT09PXRoaXMuZWxlbWVudHMubGVuZ3RoPyhkKHRoaXMucHJldkJ1dHRvbixcImdsaWdodGJveC1idXR0b24taGlkZGVuXCIpLGQodGhpcy5uZXh0QnV0dG9uLFwiZ2xpZ2h0Ym94LWJ1dHRvbi1oaWRkZW5cIikpOihjKHRoaXMucHJldkJ1dHRvbixcImdsaWdodGJveC1idXR0b24taGlkZGVuXCIpLGModGhpcy5uZXh0QnV0dG9uLFwiZ2xpZ2h0Ym94LWJ1dHRvbi1oaWRkZW5cIikpLHRoaXMubGlnaHRib3hPcGVuPSEwLHRoaXMudHJpZ2dlcihcIm9wZW5cIiksQyh0aGlzLnNldHRpbmdzLm9uT3BlbikmJnRoaXMuc2V0dGluZ3Mub25PcGVuKCksUSYmdGhpcy5zZXR0aW5ncy50b3VjaE5hdmlnYXRpb24mJkoodGhpcyksdGhpcy5zZXR0aW5ncy5rZXlib2FyZE5hdmlnYXRpb24mJlkodGhpcyl9fSx7a2V5Olwib3BlbkF0XCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06MDt0aGlzLm9wZW4obnVsbCxlKX19LHtrZXk6XCJzaG93U2xpZGVcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06MCxpPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdJiZhcmd1bWVudHNbMV07cCh0aGlzLmxvYWRlciksdGhpcy5pbmRleD1wYXJzZUludCh0KTt2YXIgbj10aGlzLnNsaWRlc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRcIik7biYmYyhuLFwiY3VycmVudFwiKSx0aGlzLnNsaWRlQW5pbWF0ZU91dCgpO3ZhciBzPXRoaXMuc2xpZGVzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3NsaWRlXCIpW3RdO2lmKHUocyxcImxvYWRlZFwiKSl0aGlzLnNsaWRlQW5pbWF0ZUluKHMsaSksbSh0aGlzLmxvYWRlcik7ZWxzZXtwKHRoaXMubG9hZGVyKTt2YXIgbD10aGlzLmVsZW1lbnRzW3RdLG89e2luZGV4OnRoaXMuaW5kZXgsc2xpZGU6cyxzbGlkZU5vZGU6cyxzbGlkZUNvbmZpZzpsLnNsaWRlQ29uZmlnLHNsaWRlSW5kZXg6dGhpcy5pbmRleCx0cmlnZ2VyOmwubm9kZSxwbGF5ZXI6bnVsbH07dGhpcy50cmlnZ2VyKFwic2xpZGVfYmVmb3JlX2xvYWRcIixvKSxsLmluc3RhbmNlLnNldENvbnRlbnQocywoZnVuY3Rpb24oKXttKGUubG9hZGVyKSxlLnJlc2l6ZSgpLGUuc2xpZGVBbmltYXRlSW4ocyxpKSxlLnRyaWdnZXIoXCJzbGlkZV9hZnRlcl9sb2FkXCIsbyl9KSl9dGhpcy5zbGlkZURlc2NyaXB0aW9uPXMucXVlcnlTZWxlY3RvcihcIi5nc2xpZGUtZGVzY3JpcHRpb25cIiksdGhpcy5zbGlkZURlc2NyaXB0aW9uQ29udGFpbmVkPXRoaXMuc2xpZGVEZXNjcmlwdGlvbiYmdSh0aGlzLnNsaWRlRGVzY3JpcHRpb24ucGFyZW50Tm9kZSxcImdzbGlkZS1tZWRpYVwiKSx0aGlzLnNldHRpbmdzLnByZWxvYWQmJih0aGlzLnByZWxvYWRTbGlkZSh0KzEpLHRoaXMucHJlbG9hZFNsaWRlKHQtMSkpLHRoaXMudXBkYXRlTmF2aWdhdGlvbkNsYXNzZXMoKSx0aGlzLmFjdGl2ZVNsaWRlPXN9fSx7a2V5OlwicHJlbG9hZFNsaWRlXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpZihlPDB8fGU+dGhpcy5lbGVtZW50cy5sZW5ndGgtMSlyZXR1cm4hMTtpZihPKHRoaXMuZWxlbWVudHNbZV0pKXJldHVybiExO3ZhciBpPXRoaXMuc2xpZGVzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3NsaWRlXCIpW2VdO2lmKHUoaSxcImxvYWRlZFwiKSlyZXR1cm4hMTt2YXIgbj10aGlzLmVsZW1lbnRzW2VdLHM9bi50eXBlLGw9e2luZGV4OmUsc2xpZGU6aSxzbGlkZU5vZGU6aSxzbGlkZUNvbmZpZzpuLnNsaWRlQ29uZmlnLHNsaWRlSW5kZXg6ZSx0cmlnZ2VyOm4ubm9kZSxwbGF5ZXI6bnVsbH07dGhpcy50cmlnZ2VyKFwic2xpZGVfYmVmb3JlX2xvYWRcIixsKSxcInZpZGVvXCI9PT1zfHxcImV4dGVybmFsXCI9PT1zP3NldFRpbWVvdXQoKGZ1bmN0aW9uKCl7bi5pbnN0YW5jZS5zZXRDb250ZW50KGksKGZ1bmN0aW9uKCl7dC50cmlnZ2VyKFwic2xpZGVfYWZ0ZXJfbG9hZFwiLGwpfSkpfSksMjAwKTpuLmluc3RhbmNlLnNldENvbnRlbnQoaSwoZnVuY3Rpb24oKXt0LnRyaWdnZXIoXCJzbGlkZV9hZnRlcl9sb2FkXCIsbCl9KSl9fSx7a2V5OlwicHJldlNsaWRlXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmdvVG9TbGlkZSh0aGlzLmluZGV4LTEpfX0se2tleTpcIm5leHRTbGlkZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5nb1RvU2xpZGUodGhpcy5pbmRleCsxKX19LHtrZXk6XCJnb1RvU2xpZGVcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF07aWYodGhpcy5wcmV2QWN0aXZlU2xpZGU9dGhpcy5hY3RpdmVTbGlkZSx0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4PXRoaXMuaW5kZXgsIXRoaXMubG9vcCgpJiYoZTwwfHxlPnRoaXMuZWxlbWVudHMubGVuZ3RoLTEpKXJldHVybiExO2U8MD9lPXRoaXMuZWxlbWVudHMubGVuZ3RoLTE6ZT49dGhpcy5lbGVtZW50cy5sZW5ndGgmJihlPTApLHRoaXMuc2hvd1NsaWRlKGUpfX0se2tleTpcImluc2VydFNsaWRlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e30sdD1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06LTE7dDwwJiYodD10aGlzLmVsZW1lbnRzLmxlbmd0aCk7dmFyIGk9bmV3IFYoZSx0aGlzLHQpLG49aS5nZXRDb25maWcoKSxzPW8oe30sbiksbD1pLmNyZWF0ZSgpLHI9dGhpcy5lbGVtZW50cy5sZW5ndGgtMTtzLmluZGV4PXQscy5ub2RlPSExLHMuaW5zdGFuY2U9aSxzLnNsaWRlQ29uZmlnPW4sdGhpcy5lbGVtZW50cy5zcGxpY2UodCwwLHMpO3ZhciBhPW51bGwsaD1udWxsO2lmKHRoaXMuc2xpZGVzQ29udGFpbmVyKXtpZih0PnIpdGhpcy5zbGlkZXNDb250YWluZXIuYXBwZW5kQ2hpbGQobCk7ZWxzZXt2YXIgZD10aGlzLnNsaWRlc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLmdzbGlkZVwiKVt0XTt0aGlzLnNsaWRlc0NvbnRhaW5lci5pbnNlcnRCZWZvcmUobCxkKX0odGhpcy5zZXR0aW5ncy5wcmVsb2FkJiYwPT10aGlzLmluZGV4JiYwPT10fHx0aGlzLmluZGV4LTE9PXR8fHRoaXMuaW5kZXgrMT09dCkmJnRoaXMucHJlbG9hZFNsaWRlKHQpLDA9PT10aGlzLmluZGV4JiYwPT09dCYmKHRoaXMuaW5kZXg9MSksdGhpcy51cGRhdGVOYXZpZ2F0aW9uQ2xhc3NlcygpLGE9dGhpcy5zbGlkZXNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi5nc2xpZGVcIilbdF0saD10aGlzLmdldFNsaWRlUGxheWVySW5zdGFuY2UodCkscy5zbGlkZU5vZGU9YX10aGlzLnRyaWdnZXIoXCJzbGlkZV9pbnNlcnRlZFwiLHtpbmRleDp0LHNsaWRlOmEsc2xpZGVOb2RlOmEsc2xpZGVDb25maWc6bixzbGlkZUluZGV4OnQsdHJpZ2dlcjpudWxsLHBsYXllcjpofSksQyh0aGlzLnNldHRpbmdzLnNsaWRlSW5zZXJ0ZWQpJiZ0aGlzLnNldHRpbmdzLnNsaWRlSW5zZXJ0ZWQoe2luZGV4OnQsc2xpZGU6YSxwbGF5ZXI6aH0pfX0se2tleTpcInJlbW92ZVNsaWRlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06LTE7aWYoZTwwfHxlPnRoaXMuZWxlbWVudHMubGVuZ3RoLTEpcmV0dXJuITE7dmFyIHQ9dGhpcy5zbGlkZXNDb250YWluZXImJnRoaXMuc2xpZGVzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3NsaWRlXCIpW2VdO3QmJih0aGlzLmdldEFjdGl2ZVNsaWRlSW5kZXgoKT09ZSYmKGU9PXRoaXMuZWxlbWVudHMubGVuZ3RoLTE/dGhpcy5wcmV2U2xpZGUoKTp0aGlzLm5leHRTbGlkZSgpKSx0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodCkpLHRoaXMuZWxlbWVudHMuc3BsaWNlKGUsMSksdGhpcy50cmlnZ2VyKFwic2xpZGVfcmVtb3ZlZFwiLGUpLEModGhpcy5zZXR0aW5ncy5zbGlkZVJlbW92ZWQpJiZ0aGlzLnNldHRpbmdzLnNsaWRlUmVtb3ZlZChlKX19LHtrZXk6XCJzbGlkZUFuaW1hdGVJblwiLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dmFyIGk9dGhpcyxuPWUucXVlcnlTZWxlY3RvcihcIi5nc2xpZGUtbWVkaWFcIikscz1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLWRlc2NyaXB0aW9uXCIpLGw9e2luZGV4OnRoaXMucHJldkFjdGl2ZVNsaWRlSW5kZXgsc2xpZGU6dGhpcy5wcmV2QWN0aXZlU2xpZGUsc2xpZGVOb2RlOnRoaXMucHJldkFjdGl2ZVNsaWRlLHNsaWRlSW5kZXg6dGhpcy5wcmV2QWN0aXZlU2xpZGUsc2xpZGVDb25maWc6Tyh0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4KT9udWxsOnRoaXMuZWxlbWVudHNbdGhpcy5wcmV2QWN0aXZlU2xpZGVJbmRleF0uc2xpZGVDb25maWcsdHJpZ2dlcjpPKHRoaXMucHJldkFjdGl2ZVNsaWRlSW5kZXgpP251bGw6dGhpcy5lbGVtZW50c1t0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4XS5ub2RlLHBsYXllcjp0aGlzLmdldFNsaWRlUGxheWVySW5zdGFuY2UodGhpcy5wcmV2QWN0aXZlU2xpZGVJbmRleCl9LG89e2luZGV4OnRoaXMuaW5kZXgsc2xpZGU6dGhpcy5hY3RpdmVTbGlkZSxzbGlkZU5vZGU6dGhpcy5hY3RpdmVTbGlkZSxzbGlkZUNvbmZpZzp0aGlzLmVsZW1lbnRzW3RoaXMuaW5kZXhdLnNsaWRlQ29uZmlnLHNsaWRlSW5kZXg6dGhpcy5pbmRleCx0cmlnZ2VyOnRoaXMuZWxlbWVudHNbdGhpcy5pbmRleF0ubm9kZSxwbGF5ZXI6dGhpcy5nZXRTbGlkZVBsYXllckluc3RhbmNlKHRoaXMuaW5kZXgpfTtpZihuLm9mZnNldFdpZHRoPjAmJnMmJihtKHMpLHMuc3R5bGUuZGlzcGxheT1cIlwiKSxjKGUsdGhpcy5lZmZlY3RzQ2xhc3NlcyksdCl2KGUsdGhpcy5zZXR0aW5ncy5jc3NFZmVjdHNbdGhpcy5zZXR0aW5ncy5vcGVuRWZmZWN0XS5pbiwoZnVuY3Rpb24oKXtpLnNldHRpbmdzLmF1dG9wbGF5VmlkZW9zJiZpLnNsaWRlUGxheWVyUGxheShlKSxpLnRyaWdnZXIoXCJzbGlkZV9jaGFuZ2VkXCIse3ByZXY6bCxjdXJyZW50Om99KSxDKGkuc2V0dGluZ3MuYWZ0ZXJTbGlkZUNoYW5nZSkmJmkuc2V0dGluZ3MuYWZ0ZXJTbGlkZUNoYW5nZS5hcHBseShpLFtsLG9dKX0pKTtlbHNle3ZhciByPXRoaXMuc2V0dGluZ3Muc2xpZGVFZmZlY3QsYT1cIm5vbmVcIiE9PXI/dGhpcy5zZXR0aW5ncy5jc3NFZmVjdHNbcl0uaW46cjt0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4PnRoaXMuaW5kZXgmJlwic2xpZGVcIj09dGhpcy5zZXR0aW5ncy5zbGlkZUVmZmVjdCYmKGE9dGhpcy5zZXR0aW5ncy5jc3NFZmVjdHMuc2xpZGVCYWNrLmluKSx2KGUsYSwoZnVuY3Rpb24oKXtpLnNldHRpbmdzLmF1dG9wbGF5VmlkZW9zJiZpLnNsaWRlUGxheWVyUGxheShlKSxpLnRyaWdnZXIoXCJzbGlkZV9jaGFuZ2VkXCIse3ByZXY6bCxjdXJyZW50Om99KSxDKGkuc2V0dGluZ3MuYWZ0ZXJTbGlkZUNoYW5nZSkmJmkuc2V0dGluZ3MuYWZ0ZXJTbGlkZUNoYW5nZS5hcHBseShpLFtsLG9dKX0pKX1zZXRUaW1lb3V0KChmdW5jdGlvbigpe2kucmVzaXplKGUpfSksMTAwKSxkKGUsXCJjdXJyZW50XCIpfX0se2tleTpcInNsaWRlQW5pbWF0ZU91dFwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXRoaXMucHJldkFjdGl2ZVNsaWRlKXJldHVybiExO3ZhciBlPXRoaXMucHJldkFjdGl2ZVNsaWRlO2MoZSx0aGlzLmVmZmVjdHNDbGFzc2VzKSxkKGUsXCJwcmV2XCIpO3ZhciB0PXRoaXMuc2V0dGluZ3Muc2xpZGVFZmZlY3QsaT1cIm5vbmVcIiE9PXQ/dGhpcy5zZXR0aW5ncy5jc3NFZmVjdHNbdF0ub3V0OnQ7dGhpcy5zbGlkZVBsYXllclBhdXNlKGUpLHRoaXMudHJpZ2dlcihcInNsaWRlX2JlZm9yZV9jaGFuZ2VcIix7cHJldjp7aW5kZXg6dGhpcy5wcmV2QWN0aXZlU2xpZGVJbmRleCxzbGlkZTp0aGlzLnByZXZBY3RpdmVTbGlkZSxzbGlkZU5vZGU6dGhpcy5wcmV2QWN0aXZlU2xpZGUsc2xpZGVJbmRleDp0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4LHNsaWRlQ29uZmlnOk8odGhpcy5wcmV2QWN0aXZlU2xpZGVJbmRleCk/bnVsbDp0aGlzLmVsZW1lbnRzW3RoaXMucHJldkFjdGl2ZVNsaWRlSW5kZXhdLnNsaWRlQ29uZmlnLHRyaWdnZXI6Tyh0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4KT9udWxsOnRoaXMuZWxlbWVudHNbdGhpcy5wcmV2QWN0aXZlU2xpZGVJbmRleF0ubm9kZSxwbGF5ZXI6dGhpcy5nZXRTbGlkZVBsYXllckluc3RhbmNlKHRoaXMucHJldkFjdGl2ZVNsaWRlSW5kZXgpfSxjdXJyZW50OntpbmRleDp0aGlzLmluZGV4LHNsaWRlOnRoaXMuYWN0aXZlU2xpZGUsc2xpZGVOb2RlOnRoaXMuYWN0aXZlU2xpZGUsc2xpZGVJbmRleDp0aGlzLmluZGV4LHNsaWRlQ29uZmlnOnRoaXMuZWxlbWVudHNbdGhpcy5pbmRleF0uc2xpZGVDb25maWcsdHJpZ2dlcjp0aGlzLmVsZW1lbnRzW3RoaXMuaW5kZXhdLm5vZGUscGxheWVyOnRoaXMuZ2V0U2xpZGVQbGF5ZXJJbnN0YW5jZSh0aGlzLmluZGV4KX19KSxDKHRoaXMuc2V0dGluZ3MuYmVmb3JlU2xpZGVDaGFuZ2UpJiZ0aGlzLnNldHRpbmdzLmJlZm9yZVNsaWRlQ2hhbmdlLmFwcGx5KHRoaXMsW3tpbmRleDp0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4LHNsaWRlOnRoaXMucHJldkFjdGl2ZVNsaWRlLHBsYXllcjp0aGlzLmdldFNsaWRlUGxheWVySW5zdGFuY2UodGhpcy5wcmV2QWN0aXZlU2xpZGVJbmRleCl9LHtpbmRleDp0aGlzLmluZGV4LHNsaWRlOnRoaXMuYWN0aXZlU2xpZGUscGxheWVyOnRoaXMuZ2V0U2xpZGVQbGF5ZXJJbnN0YW5jZSh0aGlzLmluZGV4KX1dKSx0aGlzLnByZXZBY3RpdmVTbGlkZUluZGV4PnRoaXMuaW5kZXgmJlwic2xpZGVcIj09dGhpcy5zZXR0aW5ncy5zbGlkZUVmZmVjdCYmKGk9dGhpcy5zZXR0aW5ncy5jc3NFZmVjdHMuc2xpZGVCYWNrLm91dCksdihlLGksKGZ1bmN0aW9uKCl7dmFyIHQ9ZS5xdWVyeVNlbGVjdG9yKFwiLmdpbm5lci1jb250YWluZXJcIiksaT1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLW1lZGlhXCIpLG49ZS5xdWVyeVNlbGVjdG9yKFwiLmdzbGlkZS1kZXNjcmlwdGlvblwiKTt0LnN0eWxlLnRyYW5zZm9ybT1cIlwiLGkuc3R5bGUudHJhbnNmb3JtPVwiXCIsYyhpLFwiZ3Jlc2V0XCIpLGkuc3R5bGUub3BhY2l0eT1cIlwiLG4mJihuLnN0eWxlLm9wYWNpdHk9XCJcIiksYyhlLFwicHJldlwiKX0pKX19LHtrZXk6XCJnZXRBbGxQbGF5ZXJzXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52aWRlb1BsYXllcnN9fSx7a2V5OlwiZ2V0U2xpZGVQbGF5ZXJJbnN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PVwiZ3ZpZGVvXCIrZSxpPXRoaXMuZ2V0QWxsUGxheWVycygpO3JldHVybiEoIVAoaSx0KXx8IWlbdF0pJiZpW3RdfX0se2tleTpcInN0b3BTbGlkZVZpZGVvXCIsdmFsdWU6ZnVuY3Rpb24oZSl7aWYoRShlKSl7dmFyIHQ9ZS5xdWVyeVNlbGVjdG9yKFwiLmd2aWRlby13cmFwcGVyXCIpO3QmJihlPXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKSl9Y29uc29sZS5sb2coXCJzdG9wU2xpZGVWaWRlbyBpcyBkZXByZWNhdGVkLCB1c2Ugc2xpZGVQbGF5ZXJQYXVzZVwiKTt2YXIgaT10aGlzLmdldFNsaWRlUGxheWVySW5zdGFuY2UoZSk7aSYmaS5wbGF5aW5nJiZpLnBhdXNlKCl9fSx7a2V5Olwic2xpZGVQbGF5ZXJQYXVzZVwiLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKEUoZSkpe3ZhciB0PWUucXVlcnlTZWxlY3RvcihcIi5ndmlkZW8td3JhcHBlclwiKTt0JiYoZT10LmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIikpfXZhciBpPXRoaXMuZ2V0U2xpZGVQbGF5ZXJJbnN0YW5jZShlKTtpJiZpLnBsYXlpbmcmJmkucGF1c2UoKX19LHtrZXk6XCJwbGF5U2xpZGVWaWRlb1wiLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKEUoZSkpe3ZhciB0PWUucXVlcnlTZWxlY3RvcihcIi5ndmlkZW8td3JhcHBlclwiKTt0JiYoZT10LmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIikpfWNvbnNvbGUubG9nKFwicGxheVNsaWRlVmlkZW8gaXMgZGVwcmVjYXRlZCwgdXNlIHNsaWRlUGxheWVyUGxheVwiKTt2YXIgaT10aGlzLmdldFNsaWRlUGxheWVySW5zdGFuY2UoZSk7aSYmIWkucGxheWluZyYmaS5wbGF5KCl9fSx7a2V5Olwic2xpZGVQbGF5ZXJQbGF5XCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ7aWYoIUt8fG51bGwhPT0odD10aGlzLnNldHRpbmdzLnBseXIuY29uZmlnKSYmdm9pZCAwIT09dCYmdC5tdXRlZCl7aWYoRShlKSl7dmFyIGk9ZS5xdWVyeVNlbGVjdG9yKFwiLmd2aWRlby13cmFwcGVyXCIpO2kmJihlPWkuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKSl9dmFyIG49dGhpcy5nZXRTbGlkZVBsYXllckluc3RhbmNlKGUpO24mJiFuLnBsYXlpbmcmJihuLnBsYXkoKSx0aGlzLnNldHRpbmdzLmF1dG9mb2N1c1ZpZGVvcyYmbi5lbGVtZW50cy5jb250YWluZXIuZm9jdXMoKSl9fX0se2tleTpcInNldEVsZW1lbnRzXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpczt0aGlzLnNldHRpbmdzLmVsZW1lbnRzPSExO3ZhciBpPVtdO2UmJmUubGVuZ3RoJiZyKGUsKGZ1bmN0aW9uKGUsbil7dmFyIHM9bmV3IFYoZSx0LG4pLGw9cy5nZXRDb25maWcoKSxyPW8oe30sbCk7ci5zbGlkZUNvbmZpZz1sLHIuaW5zdGFuY2U9cyxyLmluZGV4PW4saS5wdXNoKHIpfSkpLHRoaXMuZWxlbWVudHM9aSx0aGlzLmxpZ2h0Ym94T3BlbiYmKHRoaXMuc2xpZGVzQ29udGFpbmVyLmlubmVySFRNTD1cIlwiLHRoaXMuZWxlbWVudHMubGVuZ3RoJiYocih0aGlzLmVsZW1lbnRzLChmdW5jdGlvbigpe3ZhciBlPXkodC5zZXR0aW5ncy5zbGlkZUhUTUwpO3Quc2xpZGVzQ29udGFpbmVyLmFwcGVuZENoaWxkKGUpfSkpLHRoaXMuc2hvd1NsaWRlKDAsITApKSl9fSx7a2V5OlwiZ2V0RWxlbWVudEluZGV4XCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9ITE7cmV0dXJuIHIodGhpcy5lbGVtZW50cywoZnVuY3Rpb24oaSxuKXtpZihQKGksXCJub2RlXCIpJiZpLm5vZGU9PWUpcmV0dXJuIHQ9biwhMH0pKSx0fX0se2tleTpcImdldEVsZW1lbnRzXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9W107dGhpcy5lbGVtZW50cz10aGlzLmVsZW1lbnRzP3RoaXMuZWxlbWVudHM6W10sIU8odGhpcy5zZXR0aW5ncy5lbGVtZW50cykmJkEodGhpcy5zZXR0aW5ncy5lbGVtZW50cykmJnRoaXMuc2V0dGluZ3MuZWxlbWVudHMubGVuZ3RoJiZyKHRoaXMuc2V0dGluZ3MuZWxlbWVudHMsKGZ1bmN0aW9uKGksbil7dmFyIHM9bmV3IFYoaSxlLG4pLGw9cy5nZXRDb25maWcoKSxyPW8oe30sbCk7ci5ub2RlPSExLHIuaW5kZXg9bixyLmluc3RhbmNlPXMsci5zbGlkZUNvbmZpZz1sLHQucHVzaChyKX0pKTt2YXIgaT0hMTtyZXR1cm4gdGhpcy5nZXRTZWxlY3RvcigpJiYoaT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuZ2V0U2VsZWN0b3IoKSkpLGk/KHIoaSwoZnVuY3Rpb24oaSxuKXt2YXIgcz1uZXcgVihpLGUsbiksbD1zLmdldENvbmZpZygpLHI9byh7fSxsKTtyLm5vZGU9aSxyLmluZGV4PW4sci5pbnN0YW5jZT1zLHIuc2xpZGVDb25maWc9bCxyLmdhbGxlcnk9aS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWdhbGxlcnlcIiksdC5wdXNoKHIpfSkpLHQpOnR9fSx7a2V5OlwiZ2V0R2FsbGVyeUVsZW1lbnRzXCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5maWx0ZXIoKGZ1bmN0aW9uKGUpe3JldHVybiBlLmdhbGxlcnk9PXR9KSl9fSx7a2V5OlwiZ2V0U2VsZWN0b3JcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiF0aGlzLnNldHRpbmdzLmVsZW1lbnRzJiYodGhpcy5zZXR0aW5ncy5zZWxlY3RvciYmXCJkYXRhLVwiPT10aGlzLnNldHRpbmdzLnNlbGVjdG9yLnN1YnN0cmluZygwLDUpP1wiKltcIi5jb25jYXQodGhpcy5zZXR0aW5ncy5zZWxlY3RvcixcIl1cIik6dGhpcy5zZXR0aW5ncy5zZWxlY3Rvcil9fSx7a2V5OlwiZ2V0QWN0aXZlU2xpZGVcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnNsaWRlc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLmdzbGlkZVwiKVt0aGlzLmluZGV4XX19LHtrZXk6XCJnZXRBY3RpdmVTbGlkZUluZGV4XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pbmRleH19LHtrZXk6XCJnZXRBbmltYXRpb25DbGFzc2VzXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1bXTtmb3IodmFyIHQgaW4gdGhpcy5zZXR0aW5ncy5jc3NFZmVjdHMpaWYodGhpcy5zZXR0aW5ncy5jc3NFZmVjdHMuaGFzT3duUHJvcGVydHkodCkpe3ZhciBpPXRoaXMuc2V0dGluZ3MuY3NzRWZlY3RzW3RdO2UucHVzaChcImdcIi5jb25jYXQoaS5pbikpLGUucHVzaChcImdcIi5jb25jYXQoaS5vdXQpKX1yZXR1cm4gZS5qb2luKFwiIFwiKX19LHtrZXk6XCJidWlsZFwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZih0aGlzLmJ1aWx0KXJldHVybiExO3ZhciB0PWRvY3VtZW50LmJvZHkuY2hpbGROb2RlcyxpPVtdO3IodCwoZnVuY3Rpb24oZSl7ZS5wYXJlbnROb2RlPT1kb2N1bWVudC5ib2R5JiZcIiNcIiE9PWUubm9kZU5hbWUuY2hhckF0KDApJiZlLmhhc0F0dHJpYnV0ZSYmIWUuaGFzQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikmJihpLnB1c2goZSksZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSl9KSk7dmFyIG49UCh0aGlzLnNldHRpbmdzLnN2ZyxcIm5leHRcIik/dGhpcy5zZXR0aW5ncy5zdmcubmV4dDpcIlwiLHM9UCh0aGlzLnNldHRpbmdzLnN2ZyxcInByZXZcIik/dGhpcy5zZXR0aW5ncy5zdmcucHJldjpcIlwiLGw9UCh0aGlzLnNldHRpbmdzLnN2ZyxcImNsb3NlXCIpP3RoaXMuc2V0dGluZ3Muc3ZnLmNsb3NlOlwiXCIsbz10aGlzLnNldHRpbmdzLmxpZ2h0Ym94SFRNTDtvPXkobz0obz0obz1vLnJlcGxhY2UoL3tuZXh0U1ZHfS9nLG4pKS5yZXBsYWNlKC97cHJldlNWR30vZyxzKSkucmVwbGFjZSgve2Nsb3NlU1ZHfS9nLGwpKSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG8pO3ZhciBhPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2xpZ2h0Ym94LWJvZHlcIik7dGhpcy5tb2RhbD1hO3ZhciBjPWEucXVlcnlTZWxlY3RvcihcIi5nY2xvc2VcIik7dGhpcy5wcmV2QnV0dG9uPWEucXVlcnlTZWxlY3RvcihcIi5ncHJldlwiKSx0aGlzLm5leHRCdXR0b249YS5xdWVyeVNlbGVjdG9yKFwiLmduZXh0XCIpLHRoaXMub3ZlcmxheT1hLnF1ZXJ5U2VsZWN0b3IoXCIuZ292ZXJsYXlcIiksdGhpcy5sb2FkZXI9YS5xdWVyeVNlbGVjdG9yKFwiLmdsb2FkZXJcIiksdGhpcy5zbGlkZXNDb250YWluZXI9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnbGlnaHRib3gtc2xpZGVyXCIpLHRoaXMuYm9keUhpZGRlbkNoaWxkRWxtcz1pLHRoaXMuZXZlbnRzPXt9LGQodGhpcy5tb2RhbCxcImdsaWdodGJveC1cIit0aGlzLnNldHRpbmdzLnNraW4pLHRoaXMuc2V0dGluZ3MuY2xvc2VCdXR0b24mJmMmJih0aGlzLmV2ZW50cy5jbG9zZT1oKFwiY2xpY2tcIix7b25FbGVtZW50OmMsd2l0aENhbGxiYWNrOmZ1bmN0aW9uKHQsaSl7dC5wcmV2ZW50RGVmYXVsdCgpLGUuY2xvc2UoKX19KSksYyYmIXRoaXMuc2V0dGluZ3MuY2xvc2VCdXR0b24mJmMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjKSx0aGlzLm5leHRCdXR0b24mJih0aGlzLmV2ZW50cy5uZXh0PWgoXCJjbGlja1wiLHtvbkVsZW1lbnQ6dGhpcy5uZXh0QnV0dG9uLHdpdGhDYWxsYmFjazpmdW5jdGlvbih0LGkpe3QucHJldmVudERlZmF1bHQoKSxlLm5leHRTbGlkZSgpfX0pKSx0aGlzLnByZXZCdXR0b24mJih0aGlzLmV2ZW50cy5wcmV2PWgoXCJjbGlja1wiLHtvbkVsZW1lbnQ6dGhpcy5wcmV2QnV0dG9uLHdpdGhDYWxsYmFjazpmdW5jdGlvbih0LGkpe3QucHJldmVudERlZmF1bHQoKSxlLnByZXZTbGlkZSgpfX0pKSx0aGlzLnNldHRpbmdzLmNsb3NlT25PdXRzaWRlQ2xpY2smJih0aGlzLmV2ZW50cy5vdXRDbG9zZT1oKFwiY2xpY2tcIix7b25FbGVtZW50OmEsd2l0aENhbGxiYWNrOmZ1bmN0aW9uKHQsaSl7ZS5wcmV2ZW50T3V0c2lkZUNsaWNrfHx1KGRvY3VtZW50LmJvZHksXCJnbGlnaHRib3gtbW9iaWxlXCIpfHxnKHQudGFyZ2V0LFwiLmdpbm5lci1jb250YWluZXJcIil8fGcodC50YXJnZXQsXCIuZ2J0blwiKXx8dSh0LnRhcmdldCxcImduZXh0XCIpfHx1KHQudGFyZ2V0LFwiZ3ByZXZcIil8fGUuY2xvc2UoKX19KSkscih0aGlzLmVsZW1lbnRzLChmdW5jdGlvbih0LGkpe2Uuc2xpZGVzQ29udGFpbmVyLmFwcGVuZENoaWxkKHQuaW5zdGFuY2UuY3JlYXRlKCkpLHQuc2xpZGVOb2RlPWUuc2xpZGVzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3NsaWRlXCIpW2ldfSkpLFEmJmQoZG9jdW1lbnQuYm9keSxcImdsaWdodGJveC10b3VjaFwiKSx0aGlzLmV2ZW50cy5yZXNpemU9aChcInJlc2l6ZVwiLHtvbkVsZW1lbnQ6d2luZG93LHdpdGhDYWxsYmFjazpmdW5jdGlvbigpe2UucmVzaXplKCl9fSksdGhpcy5idWlsdD0hMH19LHtrZXk6XCJyZXNpemVcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpudWxsO2lmKChlPWV8fHRoaXMuYWN0aXZlU2xpZGUpJiYhdShlLFwiem9vbWVkXCIpKXt2YXIgdD14KCksaT1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ3ZpZGVvLXdyYXBwZXJcIiksbj1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ3NsaWRlLWltYWdlXCIpLHM9dGhpcy5zbGlkZURlc2NyaXB0aW9uLGw9dC53aWR0aCxvPXQuaGVpZ2h0O2lmKGw8PTc2OD9kKGRvY3VtZW50LmJvZHksXCJnbGlnaHRib3gtbW9iaWxlXCIpOmMoZG9jdW1lbnQuYm9keSxcImdsaWdodGJveC1tb2JpbGVcIiksaXx8bil7dmFyIHI9ITE7aWYocyYmKHUocyxcImRlc2NyaXB0aW9uLWJvdHRvbVwiKXx8dShzLFwiZGVzY3JpcHRpb24tdG9wXCIpKSYmIXUocyxcImdhYnNvbHV0ZVwiKSYmKHI9ITApLG4paWYobDw9NzY4KW4ucXVlcnlTZWxlY3RvcihcImltZ1wiKTtlbHNlIGlmKHIpe3ZhciBhLGg9cy5vZmZzZXRIZWlnaHQsZz1uLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIiksdj10aGlzLmVsZW1lbnRzW3RoaXMuaW5kZXhdLm5vZGUsZj1udWxsIT09KGE9di5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhlaWdodFwiKSkmJnZvaWQgMCE9PWE/YTpcIjEwMHZoXCI7Zy5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwibWF4LWhlaWdodDogY2FsYyhcIi5jb25jYXQoZixcIiAtIFwiKS5jb25jYXQoaCxcInB4KVwiKSkscy5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwibWF4LXdpZHRoOiBcIi5jb25jYXQoZy5vZmZzZXRXaWR0aCxcInB4O1wiKSl9aWYoaSl7dmFyIHA9UCh0aGlzLnNldHRpbmdzLnBseXIuY29uZmlnLFwicmF0aW9cIik/dGhpcy5zZXR0aW5ncy5wbHlyLmNvbmZpZy5yYXRpbzpcIlwiO2lmKCFwKXt2YXIgbT1pLmNsaWVudFdpZHRoLHk9aS5jbGllbnRIZWlnaHQsYj1tL3k7cD1cIlwiLmNvbmNhdChtL2IsXCI6XCIpLmNvbmNhdCh5L2IpfXZhciBTPXAuc3BsaXQoXCI6XCIpLHc9dGhpcy5zZXR0aW5ncy52aWRlb3NXaWR0aCxUPXRoaXMuc2V0dGluZ3MudmlkZW9zV2lkdGgsQz0oVD16KHcpfHwtMSE9PXcuaW5kZXhPZihcInB4XCIpP3BhcnNlSW50KHcpOi0xIT09dy5pbmRleE9mKFwidndcIik/bCpwYXJzZUludCh3KS8xMDA6LTEhPT13LmluZGV4T2YoXCJ2aFwiKT9vKnBhcnNlSW50KHcpLzEwMDotMSE9PXcuaW5kZXhPZihcIiVcIik/bCpwYXJzZUludCh3KS8xMDA6cGFyc2VJbnQoaS5jbGllbnRXaWR0aCkpLyhwYXJzZUludChTWzBdKS9wYXJzZUludChTWzFdKSk7aWYoQz1NYXRoLmZsb29yKEMpLHImJihvLT1zLm9mZnNldEhlaWdodCksVD5sfHxDPm98fG88QyYmbD5UKXt2YXIgaz1pLm9mZnNldFdpZHRoLEU9aS5vZmZzZXRIZWlnaHQsQT1vL0UsTD17d2lkdGg6aypBLGhlaWdodDpFKkF9O2kucGFyZW50Tm9kZS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwibWF4LXdpZHRoOiBcIi5jb25jYXQoTC53aWR0aCxcInB4XCIpKSxyJiZzLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsXCJtYXgtd2lkdGg6IFwiLmNvbmNhdChMLndpZHRoLFwicHg7XCIpKX1lbHNlIGkucGFyZW50Tm9kZS5zdHlsZS5tYXhXaWR0aD1cIlwiLmNvbmNhdCh3KSxyJiZzLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsXCJtYXgtd2lkdGg6IFwiLmNvbmNhdCh3LFwiO1wiKSl9fX19fSx7a2V5OlwicmVsb2FkXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmluaXQoKX19LHtrZXk6XCJ1cGRhdGVOYXZpZ2F0aW9uQ2xhc3Nlc1wiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5sb29wKCk7Yyh0aGlzLm5leHRCdXR0b24sXCJkaXNhYmxlZFwiKSxjKHRoaXMucHJldkJ1dHRvbixcImRpc2FibGVkXCIpLDA9PXRoaXMuaW5kZXgmJnRoaXMuZWxlbWVudHMubGVuZ3RoLTE9PTA/KGQodGhpcy5wcmV2QnV0dG9uLFwiZGlzYWJsZWRcIiksZCh0aGlzLm5leHRCdXR0b24sXCJkaXNhYmxlZFwiKSk6MCE9PXRoaXMuaW5kZXh8fGU/dGhpcy5pbmRleCE9PXRoaXMuZWxlbWVudHMubGVuZ3RoLTF8fGV8fGQodGhpcy5uZXh0QnV0dG9uLFwiZGlzYWJsZWRcIik6ZCh0aGlzLnByZXZCdXR0b24sXCJkaXNhYmxlZFwiKX19LHtrZXk6XCJsb29wXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1QKHRoaXMuc2V0dGluZ3MsXCJsb29wQXRFbmRcIik/dGhpcy5zZXR0aW5ncy5sb29wQXRFbmQ6bnVsbDtyZXR1cm4gZT1QKHRoaXMuc2V0dGluZ3MsXCJsb29wXCIpP3RoaXMuc2V0dGluZ3MubG9vcDplLGV9fSx7a2V5OlwiY2xvc2VcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7aWYoIXRoaXMubGlnaHRib3hPcGVuKXtpZih0aGlzLmV2ZW50cyl7Zm9yKHZhciB0IGluIHRoaXMuZXZlbnRzKXRoaXMuZXZlbnRzLmhhc093blByb3BlcnR5KHQpJiZ0aGlzLmV2ZW50c1t0XS5kZXN0cm95KCk7dGhpcy5ldmVudHM9bnVsbH1yZXR1cm4hMX1pZih0aGlzLmNsb3NpbmcpcmV0dXJuITE7dGhpcy5jbG9zaW5nPSEwLHRoaXMuc2xpZGVQbGF5ZXJQYXVzZSh0aGlzLmFjdGl2ZVNsaWRlKSx0aGlzLmZ1bGxFbGVtZW50c0xpc3QmJih0aGlzLmVsZW1lbnRzPXRoaXMuZnVsbEVsZW1lbnRzTGlzdCksdGhpcy5ib2R5SGlkZGVuQ2hpbGRFbG1zLmxlbmd0aCYmcih0aGlzLmJvZHlIaWRkZW5DaGlsZEVsbXMsKGZ1bmN0aW9uKGUpe2UucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIil9KSksZCh0aGlzLm1vZGFsLFwiZ2xpZ2h0Ym94LWNsb3NpbmdcIiksdih0aGlzLm92ZXJsYXksXCJub25lXCI9PXRoaXMuc2V0dGluZ3Mub3BlbkVmZmVjdD9cIm5vbmVcIjp0aGlzLnNldHRpbmdzLmNzc0VmZWN0cy5mYWRlLm91dCksdih0aGlzLmFjdGl2ZVNsaWRlLHRoaXMuc2V0dGluZ3MuY3NzRWZlY3RzW3RoaXMuc2V0dGluZ3MuY2xvc2VFZmZlY3RdLm91dCwoZnVuY3Rpb24oKXtpZihlLmFjdGl2ZVNsaWRlPW51bGwsZS5wcmV2QWN0aXZlU2xpZGVJbmRleD1udWxsLGUucHJldkFjdGl2ZVNsaWRlPW51bGwsZS5idWlsdD0hMSxlLmV2ZW50cyl7Zm9yKHZhciB0IGluIGUuZXZlbnRzKWUuZXZlbnRzLmhhc093blByb3BlcnR5KHQpJiZlLmV2ZW50c1t0XS5kZXN0cm95KCk7ZS5ldmVudHM9bnVsbH12YXIgaT1kb2N1bWVudC5ib2R5O2MoZWUsXCJnbGlnaHRib3gtb3BlblwiKSxjKGksXCJnbGlnaHRib3gtb3BlbiB0b3VjaGluZyBnZGVzYy1vcGVuIGdsaWdodGJveC10b3VjaCBnbGlnaHRib3gtbW9iaWxlIGdzY3JvbGxiYXItZml4ZXJcIiksZS5tb2RhbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGUubW9kYWwpLGUudHJpZ2dlcihcImNsb3NlXCIpLEMoZS5zZXR0aW5ncy5vbkNsb3NlKSYmZS5zZXR0aW5ncy5vbkNsb3NlKCk7dmFyIG49ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nY3NzLXN0eWxlc1wiKTtuJiZuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobiksZS5saWdodGJveE9wZW49ITEsZS5jbG9zaW5nPW51bGx9KSl9fSx7a2V5OlwiZGVzdHJveVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5jbG9zZSgpLHRoaXMuY2xlYXJBbGxFdmVudHMoKSx0aGlzLmJhc2VFdmVudHMmJnRoaXMuYmFzZUV2ZW50cy5kZXN0cm95KCl9fSx7a2V5Olwib25cIix2YWx1ZTpmdW5jdGlvbihlLHQpe3ZhciBpPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl07aWYoIWV8fCFDKHQpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJFdmVudCBuYW1lIGFuZCBjYWxsYmFjayBtdXN0IGJlIGRlZmluZWRcIik7dGhpcy5hcGlFdmVudHMucHVzaCh7ZXZ0OmUsb25jZTppLGNhbGxiYWNrOnR9KX19LHtrZXk6XCJvbmNlXCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXt0aGlzLm9uKGUsdCwhMCl9fSx7a2V5OlwidHJpZ2dlclwiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsaT1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06bnVsbCxuPVtdO3IodGhpcy5hcGlFdmVudHMsKGZ1bmN0aW9uKHQscyl7dmFyIGw9dC5ldnQsbz10Lm9uY2Uscj10LmNhbGxiYWNrO2w9PWUmJihyKGkpLG8mJm4ucHVzaChzKSl9KSksbi5sZW5ndGgmJnIobiwoZnVuY3Rpb24oZSl7cmV0dXJuIHQuYXBpRXZlbnRzLnNwbGljZShlLDEpfSkpfX0se2tleTpcImNsZWFyQWxsRXZlbnRzXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmFwaUV2ZW50cy5zcGxpY2UoMCx0aGlzLmFwaUV2ZW50cy5sZW5ndGgpfX0se2tleTpcInZlcnNpb25cIix2YWx1ZTpmdW5jdGlvbigpe3JldHVyblwiMy4zLjBcIn19XSk7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LHQ9bmV3IGllKGUpO3JldHVybiB0LmluaXQoKSx0fX0pKTsiXSwibmFtZXMiOlsicmVxdWlyZSIsImJsdWVpbXBHYWxsZXJ5IiwiZ2FsbGVyaWVzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImdhbGxlcnkiLCJKU09OIiwicGFyc2UiLCJnZXRBdHRyaWJ1dGUiLCJjb250YWluZXIiLCJjYXJvdXNlbCIsInN0YXJ0U2xpZGVzaG93IiwiR0xpZ2h0Ym94IiwibGlnaHRib3hFbGVtZW50cyIsImxpZ2h0Ym94ZXMiLCJlbGVtZW50Iiwic2VsZWN0b3IiLCJpbmNsdWRlcyIsInB1c2giLCJzdmciLCJxdWVyeVNlbGVjdG9yIiwid2luZG93IiwiUG9pbnRlckV2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uUG9pbnRlckRvd24iLCJwYXNzaXZlIiwib25Qb2ludGVyVXAiLCJvblBvaW50ZXJNb3ZlIiwiaXNQb2ludGVyRG93biIsInBvaW50ZXJPcmlnaW4iLCJ4IiwieSIsIm9yaWdWaWV3cG9ydCIsInNwbGl0Iiwidmlld0JveCIsIndpZHRoIiwiaGVpZ2h0IiwiZGV2aWNlV2lkdGgiLCJpbm5lcldpZHRoIiwic2NyZWVuIiwidXBkYXRlVmlld0JveCIsIm5ld1ZpZXdCb3giLCJyYXRpbyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImdldFBvaW50RnJvbUV2ZW50IiwiZXZlbnQiLCJwb2ludCIsInRhcmdldFRvdWNoZXMiLCJjbGllbnRYIiwiY2xpZW50WSIsInBvaW50ZXJQb3NpdGlvbiIsInciLCJoIiwidmlld0JveFN0cmluZyIsImNvbmNhdCIsInNldEF0dHJpYnV0ZSIsInRvZ2dsZSIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJjb2xsYXBzZSIsInRvZ2dsZU1lbnUiLCJjbGFzc0xpc3QiLCJNUUwiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRXaWR0aCIsInByZXZpb3VzVG9wIiwibWFpbk5hdlN0eWxlcyIsImdldENvbXB1dGVkU3R5bGUiLCJnZXRFbGVtZW50QnlJZCIsImhlYWRlckhlaWdodCIsInBhcnNlSW50IiwicmVwbGFjZSIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwiYm9yZGVyQm90dG9tV2lkdGgiLCJjdXJyZW50VG9wIiwic2Nyb2xsVG9wIiwiYm9keSIsIm1haW5OYXYiLCJjb250YWlucyIsImFkZCIsInJlbW92ZSJdLCJzb3VyY2VSb290IjoiIn0=