// dieses Beispiel verwendet v3 von d3.js und wurde entnommen von
// http://bl.ocks.org/Jverma/887877fc5c2c2d99be10 
// wird in der finalen Version nicht verwendet.
// eine Funktion weiter unten wird allerdings verwendet (chart_2_v4()).
function awesome_chart_example() {
	
	$(document).ready(
			function() {
				// set the dimensions of the canvas
				var margin = {
					top : 20,
					right : 20,
					bottom : 70,
					left : 40
				}, width = 600 - margin.left - margin.right, height = 300
						- margin.top - margin.bottom;

				// set the ranges
				var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .05);
				var y = d3.scale.linear().range([ height, 0 ]);

				// define the axis
				var xAxis = d3.svg.axis().scale(x).orient("bottom")
				var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

				// add the SVG element
				var svg = d3.select("#content").append("svg").attr("width",
						width + margin.left + margin.right).attr("height",
						height + margin.top + margin.bottom).append("g").attr(
						"transform",
						"translate(" + margin.left + "," + margin.top + ")");

				// load the data
				// das mit dem Servlet geht auch.
				// d3.json("/MavenApp/SimpleServlet", function(error, data) {
				d3.json("test.json", function(error, data) {

					data.forEach(function(d) {
						d.token = d.token;
						d.token_count = +d.token_count;
					});

					// scale the range of the data
					x.domain(data.map(function(d) {
						return d.token;
					}));
					y.domain([ 0, d3.max(data, function(d) {
						return d.token_count;
					}) ]);

					// add axis
					svg.append("g").attr("class", "x axis").attr("transform",
							"translate(0," + height + ")").call(xAxis)
							.selectAll("text").style("text-anchor", "end")
							.attr("dx", "-.8em").attr("dy", "-.55em").attr(
									"transform", "rotate(-90)");

					svg.append("g").attr("class", "y axis").call(yAxis).append(
							"text").attr("transform", "rotate(-90)").attr("y",
							5).attr("dy", ".71em").style("text-anchor", "end")
							.text("token_count");

					// Add bar chart
					svg.selectAll("bar").data(data).enter().append("rect")
							.attr("class", "bar").attr("x", function(d) {
								return x(d.token);
							}).attr("width", x.rangeBand()).attr("y",
									function(d) {
										return y(d.token_count);
									}).attr("height", function(d) {
								return height - y(d.token_count);
							});
				});
			});
};

// wird verwendet für 'Feature 2' auf der finalen Seite
function chart_2_v4(){	
	
	// load the data_set
	var data1 = (function () {
	    var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'Prepared_data/Project_Manager_Bar_Chart_27-JUNE-2019.json',
	        'dataType': "json",
	        'success': function (data) {
	            json = data;
	        }
	    });
	    return json;
	})(); 
		
	// set the dimensions and margins of the graph
	var margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 1000 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#chart_2_wrapper")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	// Initialize the X axis
	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .padding(0.2);
	var xAxis = svg.append("g")
	  .attr("transform", "translate(0," + height + ")")

	// Initialize the Y axis
	var y = d3.scaleLinear()
	  .range([ height, 0]);
	var yAxis = svg.append("g")
	  .attr("class", "myYaxis")

	// A function that create / update the plot for a given variable:
	function update(data) {

	  // Update the X axis
	  x.domain(data.map(function(d) { return d.jahre; }))
	  xAxis.call(d3.axisBottom(x))

	  // Update the Y axis
	  y.domain([0, d3.max(data, function(d) { return d.count }) ]);
	  yAxis.transition().duration(1000).call(d3.axisLeft(y));

	  // Create the u variable
	  var u = svg.selectAll("rect")
	    .data(data)

	  u
	    .enter()
	    .append("rect") // Add a new rect for each new elements
	    .merge(u) // get the already existing elements as well
	    .transition() // and apply changes to all of them
	    .duration(1000)
	      .attr("x", function(d) { return x(d.jahre); })
	      .attr("y", function(d) { return y(d.count); })
	      .attr("width", x.bandwidth())
	      .attr("height", function(d) { return height - y(d.count); })
	      .attr("fill", "#69b3a2")

	  // If less group in the new dataset, I delete the ones not in use anymore
	  u
	    .exit()
	    .remove()
	}

	// Initialize the plot with the first dataset
	update(data1)
	
	drill_down();
};

// wird nicht verwendet
function onclick_example() {
	// we need v3 here.
	require( ["d3_v3/d3.v3.min.js"], function(d3) { 
	$(document).ready(
			function() {
				// set the dimensions of the canvas
				var margin = {
					top : 20,
					right : 20,
					bottom : 70,
					left : 40
				}, width = 600 - margin.left - margin.right, height = 300
						- margin.top - margin.bottom;

				// set the ranges
				var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], 5);
				var y = d3.scale.linear().range([ height, 0 ]);

				// define the axis
				var xAxis = d3.svg.axis().scale(x).orient("bottom")
				var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

				// add the SVG element
				var svg = d3.select("#chart_2_wrapper").append("svg").attr("width",
						width + margin.left + margin.right).attr("height",
						height + margin.top + margin.bottom).append("g").attr(
						"transform",
						"translate(" + margin.left + "," + margin.top + ")");
				
				// load the data
				// das mit dem Servlet geht auch.
				// d3.json("/MavenApp/SimpleServlet", function(error, data) {
				d3.json("Aufgabe2.json", function(error, data) {

					data.forEach(function(d) {
						d.jahre = d.jahre;
						d.count = +d.count;
					});

					// scale the range of the data
					x.domain(data.map(function(d) {
						return d.jahre;
					}));
					y.domain([ 0, d3.max(data, function(d) {
						return d.count;
					}) ]);

					// add axis
					svg.append("g").attr("class", "x axis").attr("transform",
							"translate(0," + height + ")").call(xAxis)
							.selectAll("text").style("text-anchor", "end")
							.attr("dx", "-.8em").attr("dy", "-.55em").attr(
									"transform", "rotate(-90)");

					svg.append("g").attr("class", "y axis").call(yAxis).append(
							"text").attr("transform", "rotate(-90)").attr("y",
							5).attr("dy", ".71em").style("text-anchor", "end")
							.text("count");

					// Add bar chart
					svg.selectAll("bar").data(data).enter().append("rect")
							.attr("class", "bar").attr("x", function(d) {
								return x(d.jahre);
							}).attr("width", x.rangeBand()).attr("y",
									function(d) {
										return y(d.count);
									}).attr("height", function(d) {
								return height - y(d.count);
							});
				});
			});
});
};
