// Bubble Map

function draw_bubble_map(){
// Größe der Bubble Map
var width = 600
var height = 600


// Das zu verwendende svg element
var svg = d3.select("#BubbleMap")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// Lokalisierung und Fokus der Bubble Map
var projection = d3.geoMercator()
    .center([9, 50])                // Fokus Ziel (Gps Koordinaten)
    .scale(2020)                    // Zoom Einstellung
    .translate([ width/2, height/2 ])


// Daten für die Kreise bereitstellen
var Data_circle = [
  {long: 11.581981, lat: 48.135125, name: "München", jobs: 90}, 
  {long: 9.182932, lat: 48.775846, name: "Stuttgart", jobs: 120},
  {long: 8.6821267, lat: 50.1109221, name: "Frankfurt am Main", jobs: 280},
  {long: 9.993682, lat: 53.551085, name: "Hamburg", jobs: 24},
  {long: 13.404954, lat: 52.520007, name: "Berlin", jobs: 55}
];

// Daten von github beziehen
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

    // Datensatz nach Deutschland filtern
    data.features = data.features.filter( function(d){return d.properties.name=="Germany"} )

    // Karte zeichnen
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
          .attr("fill", "#b8b8b8")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "black")
        .style("opacity", .3)

    // Skala für Bubble erstellen. Die Höhe in .domain sollte die größte Zahl des Datensatze sein (Dynamische Anpassung fehlt noch). Die Skalierung wird in .range festgelegt.
    var size = d3.scaleLinear()
      .domain([1,300])  
      .range([4, 50])  

    // Erstellung des Tooltips
    var Tooltip = d3.select("#BubbleMap")
      .append("div")
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Drei Funktionen für die jewelige Veränderung des Tooltips bei Hover, bewegen und verlassen einer Bubble.
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
            .html(d.name + "<br>" + "Data Scientist Jobs: " + d.jobs)
            .style("left", (d3.mouse(this)[0]+50) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseclick = function(d){
          d3.select("#BubbleMap").selectAll("*").remove();
          d3.select("#BubbleMap").append("g");
          var Stadt_Wahl;
          switch (d.name){

            case "Frankfurt am Main":
                Stadt_Wahl = Frankfurt_am_Main;
                break;
            case "Hamburg":
                Stadt_Wahl = Hamburg;
                break;
            case "München":
                Stadt_Wahl = München;
                break;
            case "Berlin":
                Stadt_Wahl = Berlin;
                break;
            case "Stuttgart":
                Stadt_Wahl = Stuttgart;
                break;
            default:
                Stadt_Wahl = Frankfurt_am_Main
              }
          draw_bar_chart(Stadt_Wahl);
          draw_button();
    }
    
    var mouseleave = function(d) {
      Tooltip
      .style("opacity", 0)
      .html("")
    }
    // Definiert die Farben des Graphen
    var color = d3.scaleOrdinal()
    .domain(Data_circle)
    .range(["#a6cee3","#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]);

    // Erstellung der Bubbles auf der Karte
    svg
      .selectAll("myCircles")
      .data(Data_circle)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r", function(d){ return size(d.jobs)})
        .attr("class", "circle")
        .style("fill", function(d){return color(d['jobs'])})
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .9)
        .html(Data_circle.name)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("click",mouseclick)
      .on("mouseleave", mouseleave)

    // Fügt eine Legende zu der Bubble Map hinzu

    var valuesToShow = [15,100,300]
    var xHeight = 150   // y-Achsen Wert
    var xCircle = 100   // x-Achsen Wert
    var xLabel = 180    // Label Wert. x-Achse
    // Zeichnet Bubbles
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return xHeight - size(d) } )
        .attr("r", function(d){ return size(d) })
        .style("fill", "none")
        .attr("stroke", "black")
  
    // Zeichnet gepunktete Linie
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
        .attr('x1', function(d){ return xCircle + size(d) } )
        .attr('x2', xLabel)
        .attr('y1', function(d){ return xHeight - size(d) } )
        .attr('y2', function(d){ return xHeight - size(d) } )
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))
  
    // Fügt text zu der zuvor erstellten Linie hinzu
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return xHeight - size(d) } )
        .text( function(d){ return d } )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

})}


// Bar Chart

// Legt den Abstand zum Rand des Containers fest
var margin = { top:20 , right:0 , bottom:40 , left:30 }

var screen_width;
var screen_height;

var chart_container_width;
var chart_container_height;

var chart_width;
var chart_height;

// Datensätze
var Stuttgart = [{"Nomen": "gemeinsam mit", "Anzahl":4},{"Nomen": "Weitere Informationen", "Anzahl":3},{"Nomen": "gute Kenntnisse", "Anzahl":3}]
var München = [{"Nomen": "männliche Form", "Anzahl":3},{"Nomen": "interdisziplinären Teams", "Anzahl":3},{"Nomen": "familiar with", "Anzahl":2}]
var Frankfurt_am_Main = [{"Nomen": "eng mit", "Anzahl":1},{"Nomen": "gute Deutsch-", "Anzahl":2},{"Nomen": "zukunftsweisenden Technologien", "Anzahl":2}]
var Hamburg = [{"Nomen": "agilen Teams", "Anzahl":2},{"Nomen": "gute Deutsch-", "Anzahl":2},{"Nomen": "zukunftsweisenden Technologien", "Anzahl":2}]
var Berlin = [{"Nomen": "zukunftsweisenden Technologien", "Anzahl":2},{"Nomen": "agilen Teams", "Anzahl":2},{"Nomen": "gute Deutsch-", "Anzahl":2}]

function draw_bar_chart(data){
  // Achsen erstellen
  define_chart();
  var horizontal_scale = d3.scaleBand().domain(data.map(function(item){return item.Nomen})).rangeRound([0,chart_width]);
  var vertical_scale = d3.scaleLinear().domain([0,d3.max(data, function(item){return item.Anzahl})]).range([chart_height, 0]);
  var bar_width = chart_width / data.length - chart_width / data.length / 1.5;
  var bar_horizontal_margin = (chart_width / data.length - bar_width) / 2;
  var xAxis = d3.axisBottom(horizontal_scale);
  var yAxis = d3.axisLeft(vertical_scale);

  var chart = d3.select("#d3_wrapper svg").attr("width", chart_container_width).attr("height", chart_container_height)
    .select("#d3_wrapper svg g").attr("width", chart_width).attr("height", chart_height).attr("transform", "translate("+margin.left+", "+margin.top+")");

  var bar = chart.selectAll(".bar").data(data);
  chart.append("g").attr("class", "x axis").attr("transform", "translate(0,"+((chart_container_height - margin.bottom)-20)+")").call(xAxis).call(adjustxAxis);
  chart.append("g").attr("class", "y axis").call(yAxis);

  // Farbe der Balken
  var color = d3.scaleOrdinal()
    .domain(data)
    .range(["#a6cee3","#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]);

  // Balken erstellen
  var g = bar.enter().append("g").attr("class", "bar");
  g.append("rect").attr("x", function(d,i) {return horizontal_scale(d.Nomen) + bar_horizontal_margin})
    .attr("y", function(d){return vertical_scale(d.Anzahl)})
    .attr("width", bar_width)
    .on("mouseover", function(d,i){
        d3.select(this.parentNode).append("text").attr("x", function(d,i) {return horizontal_scale(d.Nomen) + bar_horizontal_margin + bar_width/2 - 1}).text(d.Anzahl).attr("y", function(d){return vertical_scale(d.Anzahl) + 15});
      })
    .on("mouseout", function(d,i){
        d3.select(this.parentNode).selectAll("text").remove();
      })
    .transition().delay(function(d,i){return i * 10})
    .attr("height", function(d){ return chart_height - vertical_scale(d.Anzahl)})
    .attr("fill", function(d){return color(d.Nomen)})
    .attr("alignment-baseline", "middle")
    .attr("class", "Random_bar");

  var exit = bar.exit();
    exit.select("rect").transition().duration("1000").attr("height", "0");
}
// Dimension des Charts bestimmen
function define_chart(){
  screen_width = get_screen_width_height().width;
  screen_height = get_screen_width_height().height;

  chart_container_width = define_chart_container_width(screen_width);
  chart_container_height = define_chart_container_height(screen_height);

  chart_width = chart_container_width - margin.right - margin.left;
  chart_height = chart_container_height - margin.top - margin.bottom;
}
// X Achse anpassen
function adjustxAxis(selection){
  selection.selectAll("text").attr("transform", "translate(4,0)");
}
// Button für Return zu Bubble Map
function draw_button(){
  d3.select(".chart").append('text').attr("class", "Return_Button").attr("x", 130).attr("y", 10).text("Zurück zu Bubble Map").on("click", function(d){
    d3.select(".chart").selectAll("*").remove();
    d3.select(".chart").append("g");
    draw_bubble_map();
  });
}
// Breite des Charts festlegen
function define_chart_container_width(screen_width){
  if(screen_width > 1000) {
    return 1000;
  } else {
    return screen_width - 30;
  }
}
// Höhe des Charts festlegen
function define_chart_container_height(screen_height){
  if(screen_height > 500) {
    return 600;
  } else {
    return screen_height - 20;
  }
}
// Größe des Bildschirms bestimmen
function get_screen_width_height(){
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  return {width:x, height:y}
}
