// set the dimensions and margins of the graph
var margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

d3.json("data.json", function(data) {

  // Scales
  var x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.Sprache; })); // The domain of the X axis is the list of states.
  var y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 300]); // Domain of Y is from 0 to the max seen in the data

  var Tooltip = d3.select("#my_dataviz")
      .append("div")
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "20px")

  var mouseover = function(d) {
      Tooltip.style("opacity", 1)
    }
  var mousemove = function(d) {
    var coordinates = d3.mouse(svg.node());
      Tooltip
            .html("Anzahl: " + d.Anzahl)
            .style("left", (d3.mouse(this)[0]+350) + "px")
            .style("top", (d3.mouse(this)[1]+300) + "px")
            //.style("left", (d3.mouse(svg.node())))
            //.style("top", (d3.mouse(svg.node())))
  }
  var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
  }
  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#69b3a2")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return y(d['Anzahl']); })
          .startAngle(function(d) { return x(d.Sprache); })
          .endAngle(function(d) { return x(d.Sprache) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))
      .on("mouseover",mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

  // Add the labels
  svg.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (x(d.Sprache) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.Sprache) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Anzahl'])+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.Sprache)})
        .attr("transform", function(d) { return (x(d.Sprache) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "16px")
        .attr("alignment-baseline", "middle")

});