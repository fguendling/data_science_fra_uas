        var width = 450
		    height = 450
		    margin = 40
		    
		var radius = Math.min(width, height) / 2 - margin
		
		var svg = d3.select("#Pie_chart")
		  .append("svg")
		    .attr("width", width)
		    .attr("height", height)
		  .append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
		
		var data = {KPMG: 9, IQVIA: 20, Siemens_AG:20, Deutsche_Bahn:12, Union_Investment:12}
		var data2 = [{"Sprache": "Java", "Anzahl": 285},{"Sprache": "C#","Anzahl": 148},{"Sprache": "JavaScript","Anzahl": 97},{"Sprache": "C++","Anzahl": 76},{"Sprache": "PHP","Anzahl": 47},{"Sprache": "C","Anzahl": 35},{"Sprache": "Python","Anzahl": 24},{"Sprache": "ABAP","Anzahl": 19},{"Sprache": "TypeScript","Anzahl": 18},{"Sprache": "Perl","Anzahl": 9}]
		
		var color = d3.scaleOrdinal()
		  .domain(data)
		  .range(d3.schemeSet2);
		
		var pie = d3.pie()
		  .value(function(d) {return d.value; })
		var data_ready = pie(d3.entries(data))
		
		var arcGenerator = d3.arc()
		  .innerRadius(0)
		  .outerRadius(radius)
		
		svg
		  .selectAll('mySlices')
		  .data(data_ready)
		  .enter()
		  .append('path')
		    .attr('d', arcGenerator)
		    .attr('fill', function(d){ return(color(d.data.key)) })
		    .attr("stroke", "black")
		    .style("stroke-width", "2px")
		    .style("opacity", 0.7)
		    
		svg
		  .selectAll('mySlices')
		  .data(data_ready)
		  .enter()
		  .append('text')
		  .text(function(d){ return d.data.key + " " + d.data.value})
		  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
		  .style("text-anchor", "middle")
		  .style("font-size", 17)