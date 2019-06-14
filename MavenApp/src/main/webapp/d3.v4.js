function bubblemap() {

	require( ["d3_v4/d3.min.js"], function(d3) {   

	$(document).ready(
			function() {
				
	// The svg
	var svg = d3.select("svg"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height");

	// Map and projection
	var projection = d3.geoMercator()
	    .center([8, 50])                // GPS of location to zoom on
	    .scale(1020)                       // This is like the zoom
	    .translate([ width/2, height/2 ])


	// Create data for circles:
	var markers = [
	  {long: 8.694224, lat: 50.130168}, // Frankfurt
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

	    // Add circles:
	    svg
	      .selectAll("myCircles")
	      .data(markers)
	      .enter()
	      .append("circle")
	        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
	        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
	        .attr("r", 14)
	        .style("fill", "69b3a2")
	        .attr("stroke", "#69b3a2")
	        .attr("stroke-width", 3)
	        .attr("fill-opacity", .4)
	})
})});
};
	