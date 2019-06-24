function draw_bubble_map(){
	
// Size ?
var width = 600
var height = 600


// The svg
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// The svg
//var svg = d3.select("svg"),
//    width = +svg.attr("width"),
//    height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
    .center([10.5, 50])                // GPS of location to zoom on
    .scale(2020)                       // This is like the zoom
    .translate([ width/2, height/2 ])


// Daten(Länge- und Breitegrad) für die Kreise bereitstellen
var markers = [
	// json muss noch vorbereitet werden.
  {long: 11.581981, lat: 48.135125, name: "München", jobs: 90}, // München
  {long: 9.182932, lat: 48.775846, name: "Stuttgart", jobs: 120}, // Stuttgart
  {long: 8.6821267, lat: 50.1109221, name: "Frankfurt am Main", jobs: 280}, //  Frankfurt am Main
  {long: 9.993682, lat: 53.551085, name: "Hamburg", jobs: 24}, // Hamburg
  {long: 13.404954, lat: 52.520007, name: "Berlin", jobs: 55} // Berlin
];

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

    // Filter data
    data.features = data.features.filter( function(d){return d.properties.name=="Germany"} )

    // Draw the map
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

    // Add a scale for bubble size
    var size = d3.scaleLinear()
      .domain([1,300])  // What's in the data
      .range([ 4, 50])  // Size in pixel

    // create a tooltip
    var Tooltip = d3.select("#my_dataviz")
      .append("div")
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
            .html(d.name + "<br>" + "long: " + d.long + "<br>" + "lat: " + d.lat)
            .style("left", (d3.mouse(this)[0]+400) + "px")
            .style("top", (d3.mouse(this)[1]) + ((window.innerHeight*2)+150) + "px")
    }
    var mouseclick = function(d){
        // draw_bubble_map([]);   Wahrscheinlich empty -> leer bei Bar Chart. Hier zeichnet nur neu
        //setTimeout(function(){  nur nen Timer
          d3.select("#my_dataviz").selectAll("*").remove();
          d3.select("#my_dataviz").append("g");
          // d3.selectAll("#my_dataviz");
          draw_bar_chart(months);
          //draw_bubble_replace();
          draw_show_months_button();
        //}, 1000);
      
    }
    
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
    }
    
    // Add circles:
    svg
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r", function(d){ return size(d.jobs)})
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("click",mouseclick)
      .on("mouseleave", mouseleave)

})}
function draw_show_months_button(){
  d3.select("#my_dataviz").append('text').attr("class", "show_months").attr("x", 130).attr("y", 8).text("Zurück zu Bubble Map").on("click", function(d){
    draw_months_back();
  });
}
function draw_months_back(d){
  //draw_bubble_replace([]);
  //setTimeout(function(){
    d3.select(".#my_dataviz").selectAll("*").remove();
    draw_bubble_map();
  //}, 1000);
}

// Ab Hier import von Bar Chart Vorlage

var margin = { top:10 , right:0 , bottom:30 , left:30 }

var screen_width;
var screen_height;

var chart_container_width;
var chart_container_height;

var chart_width;
var chart_height;

var months = [{"Nomen": "gemeinsam mit", "Häufigkeit": 4},{"Nomen": "Weitere Informationen", "Häufigkeit": 3},{"Nomen": "gute Kenntnisse", "Häufigkeit": 3},{"Nomen": "männliche Form", "Häufigkeit": 3},{"Nomen": "interdisziplinären Teams", "Häufigkeit": 3},{"Nomen": "familiar with", "Häufigkeit": 2},{"Nomen": "eng mit", "Häufigkeit": 2},{"Nomen": "gute Deutsch-", "Häufigkeit": 2},{"Nomen": "zukunftsweisenden Technologien", "Häufigkeit": 2},{"Nomen": "agilen Teams", "Häufigkeit": 2}];

// Starting point of the script execution
define_chart_dimensions();
generate_random_months_data();
//draw_chart_of_months(months);

//window.onresize = function (){
//  define_chart_dimensions();
//  draw_bar_chart(days);
//}

function draw_bar_chart(days){
  var horizontal_scale = d3.scaleBand().domain(days.map(function(item){return item.Nomen})).rangeRound([10,chart_width]);
  var vertical_scale = d3.scaleLinear().domain([0,d3.max(days, function(item){return item.Häufigkeit})]).range([chart_height, 10]);
  var bar_width = chart_width / days.length - chart_width / days.length / 1.3;
  var bar_horizontal_margin = (chart_width / days.length - bar_width) / 1.5;
  var xAxis = d3.axisBottom(horizontal_scale);
  var yAxis = d3.axisLeft(vertical_scale);

  var chart = d3.select("#d3_wrapper svg").attr("width", chart_container_width).attr("height", chart_container_height)
    .select("g").attr("width", chart_width).attr("height", chart_height).attr("transform", "translate("+margin.left+", "+margin.top+")");

  var bar = chart.selectAll(".bar").data(days);

  d3.select(".x.axis").remove();
  chart.append("g").attr("class", "x axis").attr("transform", "translate(0,"+(chart_container_height - margin.bottom)+")").call(xAxis).call(adjustxAxisTextForDays);
  d3.select(".y.axis").remove();
  chart.append("g").attr("class", "y axis").call(yAxis);

  var g = bar.enter().append("g").attr("class", "bar");

  g.append("rect").attr("x", function(d,i) {return horizontal_scale(d.Nomen) + bar_horizontal_margin})
    .attr("y", function(d){return vertical_scale(d.Häufigkeit)})
    .attr("width", bar_width)
    .on("mouseover", function(d,i){
        d3.select(this.parentNode).append("text").attr("x", function(d,i) {return horizontal_scale(d.Nomen) + bar_horizontal_margin + bar_width/2 + 5}).text(d.Häufigkeit).attr("y", function(d){return vertical_scale(d.Quantity) + 15});
      })
    .on("mouseout", function(d,i){
        d3.select(this.parentNode).selectAll("text").remove();
      })
    .transition().delay(function(d,i){return i * 10})
    .attr("height", function(d){ return chart_height - vertical_scale(d.Häufigkeit)})
    .attr("class", "day_bar");

  var exit = bar.exit();
    exit.select("rect").transition().duration("1000").attr("height", "0");
}

function define_chart_dimensions(){
  screen_width = get_screen_width_height().width;
  screen_height = get_screen_width_height().height;

  chart_container_width = define_chart_container_width(screen_width);
  chart_container_height = define_chart_container_height(screen_height);

  chart_width = chart_container_width - margin.right - margin.left;
  chart_height = chart_container_height - margin.top - margin.bottom;
}
// function for swap
function month_selected(month){
  draw_chart_of_months([]);
  setTimeout(function(){
    d3.selectAll(".chart g").remove();
    d3.select(".chart").append("g");
    draw_bar_chart(months);
    draw_show_months_button();
  }, 1000);
}

function draw_bubble_map_back(d){
  //draw_bar_chart([]);
  //setTimeout(function(){
    d3.select(".chart").selectAll("*").remove();
    d3.select(".chart").append("g");
    draw_bubble_map(months);
  //}, 1000);
}

function adjustxAxisTextForMonths(selection){
  selection.selectAll("text").attr("transform", "translate(4,0)");
}

function adjustxAxisTextForDays(selection){
  selection.selectAll("text").attr("transform", "translate(4,0)");
}

function generate_random_months_data(){
  for(var i = 0; i < months.length; i++){
    months[i].Quantity = months[i].Quantity;
    // months[i].Quantity = Math.floor(Math.random() * (100 - 0) + 0);
  }
}

function draw_show_months_button(){
  d3.select(".chart").append('text').attr("class", "show_months").attr("x", 130).attr("y", 8).text("Zurück zu Bubble Map").on("click", function(d){
    draw_bubble_map_back();
  });
}

// return width was 1000. 
function define_chart_container_width(screen_width){
  if(screen_width > 1000) {
    return 1000;
  } else {
    return screen_width - 30;
  }
}

function define_chart_container_height(screen_height){
  if(screen_height > 500) {
    return 600;
  } else {
    return screen_height - 20;
  }
}

function get_screen_width_height(){
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  return {width:x, height:y}
}
