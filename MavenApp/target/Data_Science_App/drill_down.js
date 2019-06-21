// der code muss laufen, nachdem das Chart geladen wurden

function drill_down() {
	console.log('actually called drill down');

	$(document).ready(
			function() {

// set index for bars
var list = document.querySelectorAll('rect.bar');
for (i = 0; i < document.querySelectorAll('rect.bar').length; i++) { 
    var list = document.querySelectorAll('rect.bar')[i]
    list.append(i)
    };

// get index of bar 
$('rect.bar').on("click", function(){
	// get values of axis
var param = ($("g.x.axis").children()[(this.innerHTML)].children[1].innerHTML);
window.open("http://localhost:8080/MavenApp/SimpleServlet?condition=" + param, 
				"Awesome Drill Down",	
				"width=300,height=400,left=100,top=200" );

});
});
};