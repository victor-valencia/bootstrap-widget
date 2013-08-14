//==============================================================================
//
//  File:	    bootstrap.widget.js
//
//  Version:	    1.0
//
//  Autor:	    Victor Valencia Rico - valencia_vik@hotmail.com
//		    https://github.com/victor-valencia
//
//  Date:	    March 2013
//
//==============================================================================


( function( $ ) {


    /**
    * Inserts a new element within the selected object at the specified index.
    * @param {Number} index Index of the new item.
    * @param {jQuery} element Element to insert.
    * @return {jQuery} Returns the value of the selected object.
    */
    $.fn.insertAt = function( index, element ) {

	return this.each( function() {

	    var lastIndex = $( this ).children().size();
	    if( index <= 0 ) {
		$(this).prepend( element );
	    }
	    else if( index >= lastIndex ) {
		$(this).append( element );
	    }
	    else {
		$(this).children().eq( index ).before( element );
	    }

	});

    }


    //==========================================================================
    //
    //  Bootstrap Widget Plug-in
    //
    //==========================================================================

    /**
    * Initialization logic and method calls inside the plug-in.
    * @param {String} method Method name to call.
    */
    $.fn.widget = function( method ) {

        if( $.fn.widget.methods[ method ] ) {
            return $.fn.widget.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
        else if( typeof method === 'object' || ! method ) {
            return $.fn.widget.methods.init.apply( this, arguments );
        }
        else {
            $.error( 'The method "' +  method + '" is not in the plug-in widget' );
        }

    };


    //==========================================================================
    //
    //  JQuery Widget Methods
    //
    //==========================================================================


    /**
    * Enums.
    */
    var enums = {
	ICON_CLOSE: 'icon-remove',
	ICON_RESIZE_FULL: 'icon-resize-full',
	ICON_RESIZE_SMALL: 'icon-resize-small',
	ICON_COLLAPSE: 'icon-chevron-up',
	ICON_EXPAND: 'icon-chevron-down'
    };


    $.fn.widget.methods = {


        /**
        * Initializes the component.
	* @param {Object} options Option settings and initialization events.
        */
        init : function( options ) {

            return this.each( function() {

		var target = $( this );

		//Default options object
		var defaults = {
		    header: true,
		    title: '',
		    icon: null,
		    contentTransparent: false,
		    fullscreen: true,
		    collapse: true,
		    close: true,
		    extras: [],
		    onCreate: function(e){},
		    onExpand: function(e){},
		    onCollapse: function(e){},
		    onClose: function(e){},
		    onFullscreen: function(e){},
		    onFullscreenExit: function(e){}
		};

		// HTML5 options data parse whith "data-" in html attributes
		var settings = $.extend( { }, defaults, target.data() );

		// Javascritp options data parse by "param"
		settings = $.extend( { }, settings, options );

		var resize = function(){
		    $(document).trigger('resize');
		    $('body,html').animate({scrollTop:$('.widget-container').data('scroll')},200);
		};

		if( settings.contentTransparent == true ) {
		    target.addClass('widget-content-transparent');
		}

		if( settings.header == true ) {

		    var header = $('<div class="widget-header"></div>');

		    if( settings.icon != null ) {
			header.append('<i class="'+settings.icon+'"></i>');
		    }
		    header.append('<h3>'+settings.title+'</h3>');

		    var buttons = $('<div class="options"></div>');

		    var container = $('body .widget-container');

		    if( settings.fullscreen == true && container.length ) {
			buttons.append('<i class="btn-fullscreen ' + enums.ICON_RESIZE_FULL + '"></i>');
		    }
		    if( settings.collapse == true ) {
			buttons.append('<i class="btn-collapse ' + enums.ICON_COLLAPSE + '"></i>');
		    }
		    if( settings.close == true ) {
			buttons.append('<i class="btn-close ' + enums.ICON_CLOSE + '"></i>');
		    }

		    if( $.isArray( settings.extras ) == true ) {

			$.each(settings.extras, function(i,v){
			    settings.extras[i] = $.extend( { }, {
				icon: null,
				index: 0,
				onClick: function(e){}
			    }, v );

			    var b = settings.extras[i];
			    var btn = $('<i class="' + b.icon + '"></i>');
			    if( $.isFunction( b.onClick ) ) { btn.bind('click', b.onClick) }
			    buttons.insertAt(b.index, btn);
			});

		    }

		    header.append(buttons);

		    target.prepend(header);

		    var btn_fullscreen = buttons.find('i[class*="btn-fullscreen"]');
		    var btn_collapse = buttons.find('i[class*="btn-collapse"]');
		    var btn_close = buttons.find('i[class*="btn-close"]');

		    if( btn_close.length ){

			btn_close.bind('click',function(e){

			    target.hide( 'fade', 100, function() {

				var parent = target.parents('div[class*="row"]').eq(0);

				if( parent.find('.widget:visible').length == 0 ) {
				    parent.hide();
				}

				if( $.isFunction( settings.onClose ) ) { settings.onClose.apply(target); }

			    });

			});

		    }

		    if( btn_fullscreen.length ){

			btn_fullscreen.toggle(function(e){

			    target.data('index', target.index());
			    $('.widget-container').data('scroll', $(window).scrollTop());

			    if( btn_close.length ){ btn_close.hide() }
			    if( btn_collapse.length ){ btn_collapse.hide() }

			    $(this).removeClass(enums.ICON_RESIZE_FULL).addClass(enums.ICON_RESIZE_SMALL);

			    var container = $('.widget-container').parent();
			    $('.widget-container').hide();

			    var tpl = [
				'<div class="row-fluid widget-fullscreen">',
				    '<div class="span12 target"></div>',
				'</div>'
			    ].join('');

			    target.data('parent',target.parent());
			    var fullscreen = $(tpl);

			    fullscreen.find('.target').append(target);

			    container.append(fullscreen);

			    fullscreen.show('fade', 1000);

			    setTimeout(resize, 100);

			    if( $.isFunction( settings.onFullscreen ) ) { settings.onFullscreen.apply(target); }

			}, function(e){

			    if( btn_close.length ){ btn_close.show() }
			    if( btn_collapse.length ){ btn_collapse.show() }

			    $(this).removeClass(enums.ICON_RESIZE_SMALL).addClass(enums.ICON_RESIZE_FULL);

			    var parent = target.data('parent');

			    parent.insertAt(target.data('index'), target);

			    $('.widget-fullscreen').remove();

			    $('.widget-container').show('fade', 1000);

			    setTimeout(resize, 100);

			    if( $.isFunction( settings.onFullscreenExit ) ) { settings.onFullscreenExit.apply(target); }

			});

		    }

		    if( btn_collapse.length ){
			btn_collapse.toggle(function(e){
			    if( btn_fullscreen.length ){ btn_fullscreen.hide() }
			    target.find('.widget-content').animate( { height: "hide" }, 200, 'linear', function(){
				//setTimeout(resize, 0);
			    });

			    $(this).removeClass(enums.ICON_COLLAPSE).addClass(enums.ICON_EXPAND);

			    if( $.isFunction( settings.onCollapse ) ) { settings.onCollapse.apply(target); }

			}, function(e){
			    if( btn_fullscreen.length ){ btn_fullscreen.show() }
			    target.find('.widget-content').animate( { height: "show" }, 200, 'linear', function(){
				setTimeout(resize, 0);
			    });
			    $(this).removeClass(enums.ICON_EXPAND).addClass(enums.ICON_COLLAPSE);

			    if( $.isFunction( settings.onExpand ) ) { settings.onExpand.apply(target); }

			});
		    }

		}

		if( $.isFunction( settings.onCreate ) ) { settings.onCreate.apply(target); }

            });

        }

    }


})(jQuery);