function bubblemap() {

	require( ["d3_v4/d3.min.js"], function(d3) {   

	$(document).ready(
			function() {
				
	var width = 600
	var height = 600

	// The svg
	var svg = d3.select("#my_dataviz")
	  .append("svg")
		  .attr("width", width)
		  .attr("height", height)

	// Map and projection
	var projection = d3.geoMercator()
	    .center([13, 50])                  // GPS of location to zoom on
	    .scale(2040)                       // This is like the zoom
	    .translate([ width/2, height/2 ])

	// hier sollte eher ein json file eingelesen werden
	var markers = [
		{name: 'Frankfurt', long: 8.694224, lat: 50.130168, size: 219}, // size ist hier ein Wert zw. [1, 100] 
		{name: 'Wolfsburg', long: 9.694224, lat: 52.130168, size: 20},
 	];
	
	// Load external data and boot (das sind lediglich die Landesgrenzen)
	d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

	    // Filter data
	    data.features = data.features.filter( function(d){return d.properties.name=="Germany"} )

		// Add a scale for bubble size
		var size = d3.scaleLinear()
		  .domain([1,500])  // What's in the data, kann man wahrscheinlich auch anpassen
		  .range([ 4, 50])  // Size in pixel (min 4, max 50)
	    
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
	        
	        // create a tooltip
    var Tooltip = d3.select("#my_dataviz")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 1)
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
        .html(d.name + "<br>" + "Job_count: " + d.size)
        .style("left", (d3.mouse(this)[0]+10) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
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
	        .attr("r", function(d){ return size(d.size) })
//	        .attr("class", "circle")
	        .style("fill", "69b3a2")
	        .attr("stroke", "#69b3a2")
	        .attr("stroke-width", 3)
	        .attr("fill-opacity", .4)
	        .on("mouseover", mouseover)
	        .on("mousemove", mousemove)
	        .on("mouseleave", mouseleave)
	})
})});
};	