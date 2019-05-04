$( document ).ready(function() {

	// Änderung der Farben im Header.
	$('.topnav a').on('click', function(){
	    $('a').removeClass('active');
	    $(this).addClass('active');
	});	
});

