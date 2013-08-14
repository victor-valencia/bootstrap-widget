//==============================================================================
//
//  File:	    index.js
//
//  Version:	    1.0
//
//  Autor:	    Victor Valencia Rico - valencia_vik@hotmail.com
//		    https://github.com/victor-valencia
//
//  Date:	    March 2013
//
//==============================================================================

$(function(){

    $('.widget:lt(7)').widget();


    $('.widget:gt(7)').widget({
	extras: [
	    {
		icon: 'icon-cog',
		onClick: function (e){
		    var widget = $(this).parents('.widget')
		    if( widget.hasClass('widget-content-transparent') ){
			widget.removeClass('widget-content-transparent');
		    }
		    else{
			widget.addClass('widget-content-transparent');
		    }
		}
	    },
	    {
		icon: 'icon-wrench',
		index: 1,
		onClick: function (e){
		    alert('Configure widget');
		}
	    }
	],
	onCreate: function(e){ console.log('Event: onCreate'); },
	onExpand: function(e){ console.log('Event: onExpand'); },
	onCollapse: function(e){ console.log('Event: onCollapse'); },
	onClose: function(e){ console.log('Event: onClose'); },
	onFullscreen: function(e){ console.log('Event: onFullscreen'); },
	onFullscreenExit: function(e){ console.log('Event: onFullscreenExit'); }
    });

});