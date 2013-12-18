"use strict";

/*
 * Mobile first responsive menu
 * Copyright 2013 Robin Poort
 * http://www.robinpoort.com
 */

;(function ( $, window, document, undefined ) {

    $.fn.stickyAnchorArea = function(options) {

        // Defaults
        var settings = $.extend(true, {
            // Default values
            stickyElement: this.selector
        }, options);



        // Custom functions
        $.fn.fixedPosition = function() {
            this.css({'position' : 'fixed', 'top' : '0', 'height' : stickyElemHeight, 'width' : stickyElemWidth});
        }
        $.fn.unFixedPosition = function() {
            this.removeAttr('style');
        }


        // Setting vars
        var stickyElem = $(settings.stickyElement),
            stickyElemOffset = Math.ceil(stickyElem.offset().top),
            stickyElemHeight = stickyElem.height(),
            stickyElemWidth = stickyElem.width(),
            scrollUntil = Math.ceil( $('.demo_container2').offset().top);

        $(window).on('resize', function() {
            stickyElemHeight = stickyElem.height();
        });

        stickyElem.wrap('<div class="stickAround"></div>');
        stickyElem.parent().css({'position' : 'relative', 'height' : stickyElemHeight});



        $(window).on('ready resize scroll', function() {
            var scrollTop = Math.ceil( $(window).scrollTop() );

            if ( scrollTop > stickyElemOffset ) {
                stickyElem.fixedPosition();
            }
            else if ( scrollTop < stickyElemOffset ) {
                stickyElem.unFixedPosition();
            }
            if ( scrollTop > (scrollUntil - stickyElemHeight) ) {
                stickyElem.css({'position' : 'absolute', 'top' : stickyElemHeight });
            }
            if ( scrollTop > scrollUntil ) {
                stickyElem.unFixedPosition();
            }
        });









        // Add appropriate body class
        function addBodyClass(width, bodyZIndex) {
            if( bodyZIndex == 1 ) {
                //$('body').removeClass('menu-unfolded').addClass('menu-folded');
            } else {
                //$('body').removeClass('menu-folded').addClass('menu-unfolded');
            }
        }


        // Run again on window resize and ready
        $(window).on('resize ready', function(event) {
            // Get the window width or get the body width as a fallback
            //var width = event.target.innerWidth || $('body').width();
            //var bodyZIndex = $('body').css('z-index');
            //toggleButtons(width, bodyZIndex);
            //addBodyClass(width, bodyZIndex);
        });

    };

})( jQuery, window, document );