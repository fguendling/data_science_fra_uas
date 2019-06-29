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
    .center([10.5, 50])                // Fokus Ziel (Gps Koordinaten)
    .scale(2020)                    // Zoom Einstellung
    .translate([ width/2, height/2 ])

// Daten beziehen
    var markers = (function () {
	    var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'Prepared_data/Bubble_Map_27-JUNE-2019.json',
	        'dataType': "json",
	        'success': function (data) {
	            json = data;
	        }
	    });
	    return json;
	})(); 
    	
    	// Hinzufügen der Koordinaten
markers[0].lat = '52.520007';  // Berlin
markers[0].long = '13.134954';  // Berlin
markers[1].lat = '50.1109221'; // Frankfurt
markers[1].long = '8.6821267'; // Frankfurt
markers[2].lat = '50.937738'; // Köln 
markers[2].long = '6.956315'; // Köln
markers[3].lat = '48.775846'; // Stuttgart
markers[3].long = '9.182932'; // Stuttgart
markers[4].lat = '53.542137'; // Hamburg
markers[4].long = '9.997127'; // Hamburg

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
            .html(d.Ort + "<br>" + "Data Scientist Jobs: " + d.Count)
            .style("left", (d3.mouse(this)[0]+400) + "px")
            .style("top", (d3.mouse(this)[1]) + ((window.innerHeight*2)+150) + "px")
    }
    var mouseclick = function(d){
          d3.select("#BubbleMap").selectAll("*").remove();
          d3.select("#BubbleMap").append("g");
          var Stadt_Wahl;
          switch (d.Ort){

            case "Frankfurt am Main":
                Stadt_Wahl = Frankfurt_am_Main;
                break;
            case "Koeln":
                Stadt_Wahl = Koeln;
                break;
            case "Hamburg":
                Stadt_Wahl = Hamburg;
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

    // Erstellung der Bubbles auf der Karte
    svg
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r", function(d){ return size(d.Count)})
        .attr("class", "circle")
        .style("fill", "69b3a2")

        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("click",mouseclick)
      .on("mouseleave", mouseleave)

var valuesToShow = [15,100,300]
var xHeight = 150   // y-Achsen Wert
var xCircle = 52   // x-Achsen Wert
var xLabel = 118    // Label Wert. x-Achse
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

// Zeichnet eine gepunktete Linie
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

// Fügt Text zu der zuvor erstellten Linie hinzu
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

//Legt den Abstand zum Rand des Containers fest
var margin = { top:20 , right:0 , bottom:40 , left:30 }

var screen_width;
var screen_height;

var chart_container_width;
var chart_container_height;

var chart_width;
var chart_height;

// Datensätze
var Stuttgart = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'Prepared_data/Bubble_Map_Drill_Down_27-JUNE-2019_Stuttgart.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 


var Koeln = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'Prepared_data/Bubble_Map_Drill_Down_27-JUNE-2019_Koeln.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 


var Frankfurt_am_Main = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'Prepared_data/Bubble_Map_Drill_Down_27-JUNE-2019_Frankfurt.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

	
var Hamburg = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'Prepared_data/Bubble_Map_Drill_Down_27-JUNE-2019_Hamburg.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 


var Berlin = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'Prepared_data/Bubble_Map_Drill_Down_27-JUNE-2019_Berlin.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 


function draw_bar_chart(data){
  // Achsen/Bars erstellen
  $('#dynamic_h2').text("Die häufigsten Fachbegriffe für die ausgewählte Stadt");
  define_chart();
  var horizontal_scale = d3.scaleBand().domain(data.map(function(item){return item.fachbegriff})).rangeRound([0,chart_width]);
  var vertical_scale = d3.scaleLinear().domain([0,d3.max(data, function(item){return item.Count})]).range([chart_height, 0]);
  var bar_width = chart_width / data.length - chart_width / data.length / 1.5;
  var bar_horizontal_margin = (chart_width / data.length - bar_width) / 2;
  var xAxis = d3.axisBottom(horizontal_scale);
  var yAxis = d3.axisLeft(vertical_scale);

  var chart = d3.select("#d3_wrapper svg").attr("width", chart_container_width).attr("height", chart_container_height)
    .select("#d3_wrapper svg g").attr("width", chart_width).attr("height", chart_height).attr("transform", "translate("+margin.left+", "+margin.top+")");

  var bar = chart.selectAll(".bar").data(data);
  chart.append("g").attr("class", "x axis").attr("transform", "translate(0,"+((chart_container_height - margin.bottom)-20)+")").call(xAxis).call(adjustxAxis);
  chart.append("g").attr("class", "y axis").call(yAxis);

  // Hover funktion einbauen
  var update = bar.select("rect").attr("x", function(d,i) {return horizontal_scale(d.fachbegriff) + bar_horizontal_margin})
    .attr("y", function(d){return vertical_scale(d.Count)})
    .attr("width", bar_width)
    .on("mouseover", function(d,i){
        d3.select(this.parentNode).append("text").attr("x", function(d,i) {return horizontal_scale(d.fachbegriff) + bar_horizontal_margin + bar_width/2 + 5}).text(d.Count).attr("y", function(d){return vertical_scale(d.Count) + 15});
      })
    .attr("height", function(d){ return chart_height - vertical_scale(d.Count)});

  //Balken erstellen
  var g = bar.enter().append("g").attr("class", "bar");
  g.append("rect").attr("x", function(d,i) {return horizontal_scale(d.fachbegriff) + bar_horizontal_margin})
    .attr("y", function(d){return vertical_scale(d.Count)})
    .attr("width", bar_width)
    .on("mouseover", function(d,i){
        d3.select(this.parentNode).append("text").attr("x", function(d,i) {return horizontal_scale(d.fachbegriff) + bar_horizontal_margin + bar_width/2 + 5}).text(d.Count).attr("y", function(d){return vertical_scale(d.Count) + 15});
      })
    .on("mouseout", function(d,i){
        d3.select(this.parentNode).selectAll("text").remove();
      })
    .transition().delay(function(d,i){return i * 10})
    .attr("height", function(d){ return chart_height - vertical_scale(d.Count)})
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
    $('#dynamic_h2').text("Anzahl der \"Data Scientist\" Jobs, pro Stadt");
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
