

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 940 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
var x = d3.scaleLinear()
    .range([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);
var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
var yAxis = d3.axisLeft(y);
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.csv("Video_Games_Sales_as_at_22_Dec_2016.csv", function(error, data) {
  	if (error) throw error;
	data.forEach(function(d) {
    	d.sales = +d.Global_Sales;
    	d.year = +d.Year_of_Release;
  	});
  	x.domain(d3.extent(data, function(d) { return d.year; }));
  	y.domain(d3.extent(data, function(d) { return d.sales; }));
  	svg.append("g")
      	.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
      	.call(xAxis)
    	.append("text")
	      	.attr("class", "label")
	      	.attr("x", width/2)
	      	.attr("y", 30)
	      	.style("font-size", "14px")
	      	.style("text-anchor", "middle")
	      	.text("Year of Release");
  	svg.append("g")
      	.attr("class", "y axis")
      	.call(yAxis)
    	.append("text")
	     	.attr("class", "label")
	      	.attr("transform", "rotate(-90)")
	      	.attr("x", -(height/2))
	      	.attr("y", -22)
		    .style("font-size", "14px")
			.style("text-anchor", "middle")
			.text("Global Sales (millions)");
  	svg.selectAll(".dot")
      	.data(data)
    	.enter().append("circle")
	      	.attr("class", "dot")
	      	.attr("r", 1.5)
	      	.attr("cx", function(d) { return x(d.year); })
	      	.attr("cy", function(d) { return y(d.sales); })
	      	.style("fill", "steelblue")
	      	.style("stroke", "none");
});