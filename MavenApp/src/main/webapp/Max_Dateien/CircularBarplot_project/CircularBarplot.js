function barplot() {
	$(document).ready(
			function() {
	
// Deklariert zwei Arrays, eines für die gelöschten (aka die leeren Checkboxen) und eines mit dem Datensatz

var deleted = [];
var data = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'Prepared_data/Softwaredeveloper_Circular_27-JUNE-2019.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

// Funktion die überprüft, ob die Checkboxen nun gecheckt oder nicht sind und verändert dementsprechend den Datensatz, um den Graphen zu aktualisieren
function checkdata(data){
  var checkbox=document.getElementsByClassName("checkbox");
  for(i=0;i<checkbox.length;i++){
    for(j=0;j<data.length;j++){
      if(checkbox[i].name == data[j].token){
        if(checkbox[i].checked ==false){
          deleted.push({"token":data[j].token,"token_count":data[j].token_count})
          data.splice(j,1)
          if((i==checkbox.length)) {
          return data
          }
        } else if (checkbox[i].checked ==true){
          if((i==checkbox.length)) {
            return data
            }
        } else {
          if((i==checkbox.length)) {
            return data
            }
        }
      } else if(j<=data.length && (checkbox[i].checked==true) ){
          for (k=0;k<deleted.length;k++){
              if(checkbox[i].name == deleted[k].token && deleted.length != 0){
                data.push({"token":deleted[k].token,"token_count":deleted[k].token_count})
                deleted.splice(k,1)
                if((i==checkbox.length)) {
                  return data
                  }
              }
          }
    } else{
      if((i==checkbox.length)) {
        return data
        }
    }
        
    }
  } return data
}

// Zeichnet den Graphen
function Circular_Barplot(data){

  // Überprüft den Datensatz zu Beginn
  var data = checkdata(data);

  // Sortiert die Daten
  data.sort(function(a,b){
    return b.token_count - a.token_count
  });

  // Setzt die Dimension und den Rand des Graphen fest
  var margin = {top: 100, right: 0, bottom: 0, left: 0},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom,
  innerRadius = 90,
  outerRadius = Math.min(width, height) / 2;

  // Bearbeitet das SVG Objekt
  var svg = d3.select("#circ_barplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

  // Graphen Skala
  var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .domain(data.map(function(d) { return d.token; }));
  var y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(data, function(d){return +d.token_count;})]);

  // Erstellt Tooltip
  var Tooltip = d3.select("#circ_barplot")
    .append("div")
    .attr("class", "tooltip")
    .style('position', 'absolute')
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "20px")

  // Erstellt 3 Events für die Bewegung der Maus über den Graphen
  var mouseover = function(d) {
    Tooltip.style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
          .html("token_count: " + d.token_count)
          .style("left", (d3.mouse(this)[0]+500) + "px")
          .style("top", (d3.mouse(this)[1] + (window.innerHeight*5)-250) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
      .html("")
  }
  // Definiert die Farben des Graphen
  var color = d3.scaleOrdinal()
  .domain(data)
  .range(["#a6cee3","#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]);

  // Fügt die Balken hinzu
  svg.append("g")
  .selectAll("path")
  .data(data)
  .enter()
  .append("path")
    .attr("fill", function(d){return color(d['token'])})
    .attr("d", d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d['token_count']); })
        .startAngle(function(d) { return x(d.token); })
        .endAngle(function(d) { return x(d.token) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius))
    .on("mouseover",mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  // Fügt die Bezeichnungen am Ende jedes Balken hinzu
  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
      .attr("text-anchor", function(d) { return (x(d.token) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((x(d.token) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['token_count'])+10) + ",0)"; })
    .append("text")
      .text(function(d){return(d.token)})
      .attr("transform", function(d) { return (x(d.token) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .attr("alignment-baseline", "middle")

  // Funktion die bei der Aktualisierung einer Checkbox aufgerufen wird
  function update() {

        d3.select("#circ_barplot").selectAll("*").remove();
        Circular_Barplot(data)
      }    
  d3.selectAll(".checkbox").on("change",update);
}

//Initialisiert den Circular Barplot
Circular_Barplot(data);

})}
