// der code muss laufen, nachdem das Chart geladen wurden

function drill_down() {
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
console.log($("g.x.axis").children()[Number(this.innerHTML)].children[1].innerHTML)
});
});
};