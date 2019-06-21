d3.json("data.json", function(error, nodeData) {    

    var TotalValue = nodeData.TotalValue

    // Variables
    var width = 960;
    var height = 960;
    var radius = (Math.min(width/2, height/2) / 1.5);

    var format_thousand = d3.format(",.4r")
    var format_percent = d3.format(".1%")

    //Custom Colors for each product
    fillcolor = {
    "Biscuits"           : "rgb(79, 33, 112)", //MDLZ Purple
    "Chocolate"          : "rgb(206, 17, 38)", //Delicious Red
    "Gum & Candy"        : "rgb(249, 86, 2)",  //Juicy Orange
    "Beverages"          : "rgb(186, 196, 5)", //Zesty Green
    "Cheese & Grocery"   : "rgb(252, 209, 22)"//Toasty Yellow
    }
    // color for text
    textcolor = {
    "Biscuits"           : "rgb(255,255,255)",
    "Chocolate"          : "rgb(255,255,255)",
    "Gum & Candy"        : "rgb(255,255,255)",
    "Beverages"          : "rgb(95,95,95)",
    "Cheese & Grocery"   : "rgb(95,95,95)"
    }

    // Create primary <g> element
    var g = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2 - 50) + ')');

    // Data strucure
    var partition = d3.partition()
        .size([2 * Math.PI, radius]);

    // Find data root
    var root = d3.hierarchy(nodeData)
        .sum(function (d) { return d.value})
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; }); //sort by value

    // Size arcs
    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });
    
    // Add a <g> element for each node;
    var slice = g.selectAll('g')
        .data(root.descendants())
        .enter().append('g')


    //Text in the center of the donut
    //slice.append("text")
    //    .data(root.ancestors())
    //    .attr("x", "0")
    //    .attr("y", "0")
    //    .attr("text-anchor", "middle")
    //    .attr("class", "center")
    //    .attr("font-size", function(){return 43})
    //    .text(function(d) {return format_thousand(d.data.TotalValue/1000000).replace(",","'")})
  	
  	//slice.append("text")
    //    .attr("x", "0")
    //    .attr("y", function(){return 35})
    //    .attr("text-anchor", "middle")
    //    .attr("class", "center")
    //    .attr("font-size", function(){return 25})
    //    .text("Million USD")


    slice.append('path')
        .attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill", function (d) { return fillcolor[((d.children ? d : d.parent).data.name)]; })

    slice.append('text')
        .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
        .attr("dx", function(d) { if      (d.data.value/TotalValue < 0.015 && d.height == 0 && ((d.x0 + d.x1) / Math.PI * 90) < 180) {return radius/6 + 5 }
                                  else if (d.data.value/TotalValue < 0.015 && d.height == 0 && ((d.x0 + d.x1) / Math.PI * 90) >= 180) {return -radius/6 - 5}
        	                      else {return 0}
        	                    })
        .attr("dy", function(d) { if   (d.data.value/TotalValue < 0.015 && d.height == 0) {return "+0.3em"}
                                  else {return "-0.25em"}}) 
        .attr("text-anchor", function(d) { if  (d.data.value/TotalValue < 0.015 && d.height == 0 && ((d.x0 + d.x1) / Math.PI * 90) < 180) {return "start"}
                                      else if (d.data.value/TotalValue < 0.015 && d.height == 0 && ((d.x0 + d.x1) / Math.PI * 90) >= 180) {return "end"}
                                      else {return "middle"}})
        .attr("class", "labels")
        .style("fill", function (d) { if   (d.data.value/TotalValue < 0.015 && d.height == 0) {return "rgb(95,95,95)";}
                                     else {return textcolor[((d.children ? d : d.parent).data.name)]; }
                                     })
        .attr("font-size", function(d) {return 12})         
        .text(function(d) { if (d.data.value/TotalValue < 0.015)  { return d.parent ? d.data.name + ' ' + format_percent(d.data.value/TotalValue) : "" } 
                            else                                  { return d.parent ? d.data.name : "" } }) //do not show the first node


    slice.append('text')
        .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
        .attr("dx", function(d) { console.log(d.data.name + ' - ' + d.height + ' - ' + (d.data.value/TotalValue))
                                  if      (d.data.value/TotalValue < 0.015 && d.height == 0 && ((d.x0 + d.x1) / Math.PI * 90) < 180) {return radius/6 + 10}
                                  else if (d.data.value/TotalValue < 0.015 && d.height == 0 && ((d.x0 + d.x1) / Math.PI * 90) >= 180) {return -radius/6 + 10}
                                  else {return 0}
                              })
        .attr("dy", function(d) { return "1em"}) 
        .attr("text-anchor", function(d) { return "middle"})
        .attr("class", "labels")
        .style("fill", function (d) { return textcolor[((d.children ? d : d.parent).data.name)]; })
        .attr("font-size", function(d) {return 12})         
        .text(function(d) { if      (d.height == 0 && d.data.value/TotalValue >= 0.015) {return d.parent ? format_percent(d.data.value/TotalValue) : "" }
                            else if (d.height == 1) {return d.parent ? format_percent(d.data.SubtotalValue/TotalValue) : "" } //do not show first node   
                          });         


    //TextRotation
    function computeTextRotation(d) {
        var angle = (d.x0 + d.x1) / Math.PI * 90;
        var realangle = (d.x1 - d.x0) / Math.PI * 180

        // Avoid upside-down labels
        if (realangle > 28 ) { 
            return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
        } else {
            return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
        }
    }




}) //end read-in data        