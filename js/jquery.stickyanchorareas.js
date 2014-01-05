/* @preserve
 * Sticky Anchor Areas
 * Make elements sticky to the top of the document
 * and keep anchor scrolling support from both links and the window.location.hash
 * Copyright 2013 Robin Poort
 * http://www.robinpoort.com
 */

"use strict";

;(function($) {

    // Test if the browser supports position fixed by testing the top offset of a fixed element
    $('<div id="canBrowserhandleFixedPosition" style="position:fixed;width:0;height:0;overflow:hidden;top:100px;"></div>').prependTo('body');
    var theOffset = $('#canBrowserhandleFixedPosition').offset().top;
    if( theOffset >= 100 ) { theOffset = true } else { theOffset = false }
    $('#canBrowserhandleFixedPosition').remove();

    $.stickyAnchorArea = function(element, options) {

        var defaults = {},
            plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element;

        plugin.init = function() {

            plugin.settings = $.extend({}, defaults, options);

            // Setting variables initially
            var stickyElement = $element,
                stickyElementHeight = $element.outerHeight(),
                stickyElementZindex = $element.css('z-index');

            // Variables for scrollFrom
            if ( plugin.settings.scrollFrom ) {
                var scrollFromContainer = plugin.settings.scrollFrom;
            }

            // Variables for ScrollUntil
            if ( plugin.settings.scrollUntil ) {
                var scrollUntilContainer = plugin.settings.scrollUntil;
            }


            // Custom functions
            $.fn.fixedPosition = function(scrollFromHeight, stickyElementWidth) {
                this.css({'position' : 'fixed', 'top' : scrollFromHeight, 'height' : 'auto', 'width' : stickyElementWidth});
            }
            $.fn.unFixedPosition = function() {
                this.removeAttr('style');
            }


            // Add div to all sticky elements
            stickyElement.wrap('<div class="stickyParent"></div>');


            // The actual function that runs it all
            function makeSticky() {

                var scrollTop = Math.ceil( $(window).scrollTop()),
                    stickyElementParent = stickyElement.parent('.stickyParent'),
                    stickyElementOffset = Math.ceil(stickyElement.parent('.stickyParent').offset().top),
                    stickyElementHeight = $element.outerHeight(),
                    stickyElementWidth = stickyElementParent.width(),
                    scrollFromHeight = '0',
                    windowWidth = $(window).width(),
                    windowHeight = $(window).height();

                // Variables for scrollFrom
                if ( plugin.settings.scrollFrom ) {
                    var scrollFromHeight = Math.ceil( $(scrollFromContainer).outerHeight()),
                        scrollUntilNewTop = scrollTop + scrollFromHeight;
                }

                // Variables for ScrollUntil
                if ( plugin.settings.scrollUntil ) {
                    if ( plugin.settings.scrollFrom && scrollFromHeight <= windowHeight ) {
                        var scrollUntil = (Math.ceil( $(scrollUntilContainer).offset().top)) - scrollFromHeight,
                            scrollUntilPosition = (scrollUntil - stickyElementOffset + (scrollFromHeight - stickyElementHeight) );
                    } else {
                        var scrollUntil = Math.ceil( $(scrollUntilContainer).offset().top),
                            scrollUntilPosition = (scrollUntil - stickyElementOffset - stickyElementHeight);
                    }
                }

                // Check wether stickyFromWidth or stickyFromHeight is being used
                if ( ( ( plugin.settings.stickyFromWidth && plugin.settings.stickyFromHeight ) &&
                    ( windowWidth >= plugin.settings.stickyFromWidth && windowHeight >= plugin.settings.stickyFromHeight) ) ||
                    ( ( windowWidth >= plugin.settings.stickyFromWidth && !plugin.settings.stickyFromHeight ) ||
                        ( windowHeight >= plugin.settings.stickyFromHeight && !plugin.settings.stickyFromWidth ) ) ||
                    !plugin.settings.stickyFromWidth && !plugin.settings.stickyFromHeight ) {

                    // Give the surrounding div the height of the element
                    if ( !stickyElementParent.hasClass('child-to-tall') ) {
                        stickyElementParent.css({ 'position' : 'relative', 'height' : stickyElementHeight, 'z-index' : stickyElementZindex });
                    }

                    // Sticky element taller than viewport?
                    if ( stickyElementHeight >= windowHeight ) {
                        var stickyTopOffset = stickyElement.offset().top;
                        stickyElementParent.addClass('child-to-tall');
                        stickyElement.addClass('to-tall');
                    }

                    // Already sticking element taller than viewport?
                    if ( stickyElementHeight >= windowHeight && stickyElement.css('position') == 'fixed' ) {
                        var stickyTopOffset = stickyElement.offset().top;
                        stickyElementParent.css('position', 'static').addClass('child-to-tall');
                        stickyElement.css({'position': 'absolute', 'top' : stickyTopOffset, 'height' : 'auto', 'width' : stickyElementWidth }).addClass('to-tall');
                    }

                    // Sticky element taller than viewport and scrolltop smaller than the offset of our stickyParent container?
                    else if ( scrollTop <= stickyElementParent.offset().top && stickyElementHeight >= windowHeight ) {
                        stickyElement.unFixedPosition();
                        if ( stickyElement.hasClass('child-to-tall') ) {
                            stickyElement.removeClass('child-to-tall');
                        }
                    }

                    // Keep already sticking elements in "fake fixed position" when scrolling to the top
                    else if ( scrollTop <= stickyElement.offset().top && stickyElementHeight >= windowHeight && stickyElement.css('position') == 'absolute' ) {
                        stickyElement.css({'position': 'absolute', 'top' : scrollTop }).addClass('to-tall');
                    }

                    // Keep element as big as the viewport
                    else if ( stickyElementHeight >= windowHeight && stickyElement.css('position') == 'absolute' && stickyElement.hasClass('to-tall') ) {
                        stickyElement.css({ 'height' : 'auto', 'width' : stickyElementWidth });
                    }

                    // remove classes when viewport is large enough again
                    else if ( stickyElementHeight < windowHeight ) {
                        if ( stickyElementParent.hasClass('child-to-tall') ) {
                            stickyElementParent.removeClass('child-to-tall');
                        }
                        if ( stickyElement.hasClass('to-tall') ) {
                            stickyElement.removeClass('to-tall');
                        }
                    }

                    // Make elements sticky when element is smaller than viewport height
                    if ( !stickyElement.hasClass('to-tall') ) {

                        // Make element sticky
                        if ( scrollTop > stickyElementOffset || stickyElementOffset == 0) {
                            $(element).fixedPosition(scrollFromHeight, stickyElementWidth);
                        }

                        // scrollFrom
                        if ( plugin.settings.scrollFrom ) {
                            if ( scrollFromHeight <= windowHeight ) {
                                if ( stickyElementOffset <= scrollUntilNewTop ) {
                                    stickyElement.fixedPosition(scrollFromHeight, stickyElementWidth);
                                }
                                if ( stickyElementOffset > scrollUntilNewTop ) {
                                    stickyElement.unFixedPosition();
                                }
                            } else if ( scrollTop > stickyElementOffset) {
                                stickyElement.fixedPosition(0, stickyElementWidth);
                            }
                        }

                        // Make element unsticky
                        if ( scrollTop < stickyElementOffset && stickyElementOffset != 0 && ( !plugin.settings.scrollFrom || !plugin.settings.scrollFrom ) ) {
                            stickyElement.unFixedPosition();
                        } else if ( scrollTop < stickyElementOffset && scrollFromHeight >= windowHeight) {
                            stickyElement.unFixedPosition();
                        }

                        // Stickyness when scrollUntil is used
                        if ( plugin.settings.scrollUntil ) {
                            if ( scrollTop >= (scrollUntil - stickyElementHeight) ) {
                                stickyElement.css({'position' : 'absolute', 'top' : scrollUntilPosition });
                            }
                            if ( scrollTop >= scrollUntil ) {
                                stickyElement.unFixedPosition();
                            }
                        }
                    }
                } else {
                    // Reset the whole sticky element
                    stickyElement.unFixedPosition();
                    if ( stickyElementParent.hasClass('child-to-tall') ) {
                        stickyElementParent.removeClass('child-to-tall');
                    }
                    if ( stickyElement.hasClass('to-tall') ) {
                        stickyElement.removeClass('to-tall');
                    }
                }

                if( stickyElement.parent('.stickyParent').height() > stickyElement.outerHeight() ) {
                    stickyElementParent.css('height', stickyElement.outerHeight() );
                }

            }


            // Run function initially and on events
            $(window).on('ready resize scroll', function() {
                makeSticky();
            });
        }

        plugin.init();

    }

    if( theOffset == true ) {

        // Check the position of elements in the markup
        $.fn.isAfter = function(elem) {
            if(typeof(elem) == "string") elem = $(elem);
            return this.add(elem).index(elem) == 0;
        }

        // Anchor links
        $(function() {
            $('a[href*=#]:not([href=#])').click(function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                    var target = $(this.hash),
                        target2 = $(this).prop('hash'),
                        stickies = $('.stickyParent');

                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                    if (target.length) {
                        var tester = target.offset().top;
                        if( $(target2).isAfter(stickies) ) {
                            tester = tester - stickies.outerHeight();
                        }
                        $('html,body').animate({
                            scrollTop: tester
                        }, 200);
                        window.location.hash = target2;
                        return false;
                    }
                }
            });
        });
    }

    // add the plugin to the jQuery.fn object
    $.fn.stickyAnchorArea = function(options) {
        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            // if plugin has not already been attached to the element
            if (undefined == $(this).data('stickyAnchorArea')) {
                // create a new instance of the plugin
                var plugin = new $.stickyAnchorArea(this, options);
                // in the jQuery version of the element
                // store a reference to the plugin object
                $(this).data('stickyAnchorArea', plugin);
            }

        });
    }

})(jQuery);