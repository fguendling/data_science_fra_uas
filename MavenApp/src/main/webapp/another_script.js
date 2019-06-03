$(document).ready(function() {

	// Änderung der Farben im Header.
	$('.topnav a').on('click', function() {
		$('a').removeClass('active');
		$(this).addClass('active');
	});

	// test
	$('.topnav a').on('click', function() {
		my_id = this.id;

		if (my_id == "Crawl_and_NLP") {
			$('#content').load("crawl_and_nlp.html")
		}

		if (my_id == "home") {
			$('#content').html("<h1>Herzlich Willkommen</h1>")
		}

		if (my_id == "Charts") {
			$('#content').html('<div></div>');
			$('#content').load(awesome_chart_example());
		}

		if (my_id == "Charts2") {
			$('#content').html('<div></div>');
			$('#content').on('load', onclick_example());
			if ($('svg').is(':visible')){
				drill_down();
			}
				else {
					setTimeout(drill_down, 1000);
				}					
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
			data:{
			       job: jobVal,
			       place: placeVal,
			       url: URLVal
			    },			
//			data: "job="+jobVal+"&place="+placeVal+"&url="+URLVal,			
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
