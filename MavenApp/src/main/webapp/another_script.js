// Der Code in diesem File war als "CMS" gedacht um die Charts via Ajax Call auszutauschen.
// Wird letztendlich nicht verwendet.

$(document).ready(function() {

	// Änderung der Farben im Header.
	$('.topnav a').on('click', function() {
		$('a').removeClass('active');
		$(this).addClass('active');
	});

	$('.topnav a').on('click', function() {
		my_id = this.id;

		if (my_id == "Crawl_and_NLP") {
			//$('#content').load("crawl_and_nlp.html")
		
			    $('html,body').animate({
			        scrollTop: $("#sec_09").offset().top},
			        'slow');		
		}

		if (my_id == "home") {
			//$('#content').html('<h1>This is home</h1>');
			
		    $('html,body').animate({
		        scrollTop: $("#content").offset().top},
		        'slow');	
		}

		if (my_id == "feature_1") {
//			$('#content').html('<h2>Chart 1 - Anzahl der "Data Scientist" Jobs, pro Stadt</h2>');
//			$('#content').append('<div id="my_dataviz" width="600" height="600"></div>');
//			$('#content').load(bubblemap());
			
		    $('html,body').animate({
		        scrollTop: $("#sec_1").offset().top},
		        'slow');					
		}

		if (my_id == "feature_2") {
/*			$('#content').html('<div></div>');
			$('#content').on('load', onclick_example());
			if ($('svg').is(':visible')) {
				drill_down();
			} else {
				setTimeout(drill_down, 1000);
			}
*/
			$('html,body').animate({
		        scrollTop: $("#sec_2").offset().top},
		        'slow');					

			
		}		
		if (my_id == "feature_3") {
//			$('#content').load('sunburst.html');		
//			$('#content').load(setTimeout(chart3, 100));

			$('html,body').animate({
		        scrollTop: $("#sec_3").offset().top},
		        'slow');					

		
		}

		if (my_id == "About") {
//			$('#content').load('sunburst.html');		
//			$('#content').load(setTimeout(chart3, 100));

			$('html,body').animate({
		        scrollTop: $("#about_section").offset().top},
		        'slow');					

		
		}
	});

	myPost = function() {
		// Auslösen von Crawler und NLP
		var jobVal = document.CrawlerAndNLP_Form.job.value;
		var placeVal = document.CrawlerAndNLP_Form.place.value;
		var URLVal = document.CrawlerAndNLP_Form.url.value;

		$.ajax({
			url : 'SimpleServlet',
			type : 'post',
			data : {
				job : jobVal,
				place : placeVal,
				url : URLVal
			},
			success : function(data) {
				console.log(data);
			}
		})
	};

	/*
	 * $.ajax({url: "/MavenApp/SimpleServlet", success:
	 * function(result){ $("#Jobsuche_Basic").html(result); // text (m.
	 * escaped characters) // $("#Jobsuche_Basic").text(result).html();
	 * }});
	 */
});
