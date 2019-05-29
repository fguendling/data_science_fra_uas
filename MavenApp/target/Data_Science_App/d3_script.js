// dieses Beispiel verwendet v3 von d3.js und wurde entnommen von
// http://bl.ocks.org/Jverma/887877fc5c2c2d99be10 

function awesome_chart_example(){
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
			var svg = d3.select("body").append("svg").attr("width",
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
						"translate(0," + height + ")").call(xAxis).selectAll(
						"text").style("text-anchor", "end").attr("dx", "-.8em")
						.attr("dy", "-.55em").attr("transform", "rotate(-90)");

				svg.append("g").attr("class", "y axis").call(yAxis).append(
						"text").attr("transform", "rotate(-90)").attr("y", 5)
						.attr("dy", ".71em").style("text-anchor", "end").text(
								"token_count");

				// Add bar chart
				svg.selectAll("bar").data(data).enter().append("rect").attr(
						"class", "bar").attr("x", function(d) {
					return x(d.token);
				}).attr("width", x.rangeBand()).attr("y", function(d) {
					return y(d.token_count);
				}).attr("height", function(d) {
					return height - y(d.token_count);
				});
			});
		});
};