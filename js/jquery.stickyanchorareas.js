"use strict";

/*
 * Mobile first responsive menu
 * Copyright 2013 Robin Poort
 * http://www.robinpoort.com
 */

;(function($) {

    $.stickyAnchorArea = function(element, options) {

        var defaults = {}

        // to avoid confusions, use "plugin" to reference the
        // current instance of the object
        var plugin = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('stickyAnchorArea').settings.propertyName from outside the plugin,
        // where "element" is the element the plugin is attached to;
        plugin.settings = {}

        var $element = $(element), // reference to the jQuery version of DOM element
            element = element;    // reference to the actual DOM element

        // the "constructor" method that gets called when the object is created
        plugin.init = function() {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);

            // Test if the browser supports position fixed by testing the top offset of a fixed element
            $('<div id="canBrowserhandleFixedPosition" style="position:fixed;width:0;height:0;overflow:hidden;top:100px;"></div>').prependTo('body');
            var theOffset = $('#canBrowserhandleFixedPosition').offset().top;
            if( theOffset >= 100 ) { theOffset = true } else { theOffset = false }
            $('body').remove('#canBrowserhandleFixedPosition');

            // Variables
            var stickyElem = $(element),
                stickyElemOffset = Math.ceil($(element).offset().top),
                stickyElemHeight = $(element).height(),
                stickyElemWidth = $(element).width(),
                absolutePosition = (scrollUntil - stickyElemOffset - stickyElemHeight),
                urlHash = window.location.hash;

            // ScrollUntil
            if( plugin.settings.scrollUntil ) {
                var scrollUntilContainer = plugin.settings.scrollUntil,
                    scrollUntil = Math.ceil( $(scrollUntilContainer).offset().top),
                    absolutePosition = (scrollUntil - stickyElemOffset - stickyElemHeight);
            }


            // Custom functions
            $.fn.fixedPosition = function(stickyElemHeight) {
                this.css({'position' : 'fixed', 'top' : '0', 'height' : stickyElemHeight, 'width' : stickyElemWidth});
            }
            $.fn.unFixedPosition = function() {
                this.removeAttr('style');
            }


            stickyElem.wrap('<div class="stickAround"></div>');
            stickyElem.parent().css({'position' : 'relative', 'height' : stickyElemHeight});


            $(window).on('ready resize scroll', function() {
                var scrollTop = Math.ceil( $(window).scrollTop() );
                stickyElemHeight = $(element).height();

                if ( scrollTop > stickyElemOffset ) {
                    $(element).fixedPosition(stickyElemHeight);
                }
                else if ( scrollTop < stickyElemOffset ) {
                    stickyElem.unFixedPosition();
                }
                if ( plugin.settings.scrollUntil ) {
                    if ( scrollTop > (scrollUntil - stickyElemHeight) ) {
                        stickyElem.css({'position' : 'absolute', 'top' : absolutePosition });
                    }
                    if ( scrollTop > scrollUntil ) {
                        stickyElem.unFixedPosition();
                    }
                }
            });




            /*
             Anchor linking with a fixed menu:
             Duplicate the target element and give it a negative margin of the height of the menu
             */

            // Check the position of elements in the markup, has to be after the menu
            $.fn.isAfter = function(elem) {
                if(typeof(elem) == "string") elem = $(elem);
                return this.add(elem).index(elem) == 0;
            }

            // Create empty anchors array
            var elements = [];

            // The function to call for adding divs
            function addAnchorDiv(elem) {
                if( $(elem).isAfter(stickyElem)) {

                    var elemClean = elem.replace('#', '');

                    // Check if the current anchor was already processed
                    if($.inArray(elemClean, elements) == -1)
                    {
                        $(elem).before('<div class="relativeAnchorDiv" id="'+elemClean+'" style="position:relative;top:-'+stickyElemHeight+'px;z-index:-99;">');

                        // Add current anchor to array
                        elements.push(elemClean);
                    }
                }
            }

            if( theOffset == true ) {

                // The URL method
                addAnchorDiv(urlHash);

                // Per link method
                $('a[href*=#]:not([href=#])').each(function() {

                    var target = $(this).prop('hash');

                    // Add items
                    $(target).each(function() {
                        // Add extra div code
                        addAnchorDiv(target);
                    });
                });
            }







        }

        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.stickyAnchorArea = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('stickyAnchorArea')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.stickyAnchorArea(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('stickyAnchorArea').publicMethod(arg1, arg2, ... argn) or
                // element.data('stickyAnchorArea').settings.propertyName
                $(this).data('stickyAnchorArea', plugin);

            }

        });
    }

})(jQuery);