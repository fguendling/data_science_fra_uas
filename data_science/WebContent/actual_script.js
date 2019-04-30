$( document ).ready(function() {
	// wenn das dokument geladen ist, 
	// dann ersetze den paragraph database_content mit den Daten aus der Datenbank.
	// Wurde zum Testen verwendet.
	
	$.ajax({url: "/data_science/FileCounter", success: function(result){
	    $("#database_content").html(result);
	  }});
	
	// Änderung der Farben im Header.
	$('.topnav a').on('click', function(){
	    $('a').removeClass('active');
	    $(this).addClass('active');
	});	
});

