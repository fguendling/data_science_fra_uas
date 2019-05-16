$( document ).ready(function() {

	// Änderung der Farben im Header.
	$('.topnav a').on('click', function(){
	    $('a').removeClass('active');
	    $(this).addClass('active');
	});	
	
	// test
	$('.topnav a').on('click', function(){
	    my_id = this.id;
	    
	    if (my_id == "Crawl_and_NLP"){
	    	$('#content').innerhtml("crawler buttons go here")
	    }
	});	
	/*
	$.ajax({url: "/MavenApp/SimpleServlet", success: function(result){
		$("#Jobsuche_Basic").html(result);
		// text (m. escaped characters)
		// $("#Jobsuche_Basic").text(result).html();
	  }});
	*/
});

