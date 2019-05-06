$( document ).ready(function() {

	// Änderung der Farben im Header.
	$('.topnav a').on('click', function(){
	    $('a').removeClass('active');
	    $(this).addClass('active');
	});	
	
	$.ajax({url: "/MavenApp/SimpleServlet", success: function(result){
	    $("#Jobsuche_Basic").html(result);
	  }});
	
	
	
});

