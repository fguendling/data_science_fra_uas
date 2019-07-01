// Der Code muss laufen, nachdem das Chart geladen wurden.
//
// Wird aufgerufen, wenn man im zweiten Chart auf einen der Balken klickt.
// Lädt die detaillierten Ausschreibungstexte.
// Die Ladezeit ist nicht optimal, das Beispiel soll vielmehr zeigen, 
// dass auch Anfragen ans Backend durchgereicht werden können.

function drill_down() {
	console.log('actually called drill down');

	$(document).ready(
			function() {

				console.log('should open the window');

// set index for bars
var list = document.querySelectorAll('rect');
for (i = 0; i < document.querySelectorAll('rect').length; i++) { 
    var list = document.querySelectorAll('rect')[i]
    list.append(i)
    };
    
    
// get index of bar 
$('rect').on('click', function(){
//	setTimeout(function(){console.log('gude');}, 5000);
//	// get values of axis
//	console.log('rect was clicked');
		
// var param = ($("g.x.axis").children()[(this.innerHTML)].children[1].innerHTML);
// var param = ($('rect').parent().children()[this.innerHTML].children[1].children[1].innerHTML);
	
var param = ($('g.tick')[this.innerHTML].textContent);

window.open("http://localhost:8080/MavenApp/SimpleServlet?condition=" + param, 
				"Awesome Drill Down",	
				"width=300,height=400,left=100,top=200" );

});
});
};