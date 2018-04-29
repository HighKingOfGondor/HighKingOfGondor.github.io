//measurements
var width = 900;
var height = 900;
var margin = { top: 10, right: 10, bottom: 100, left: 50 };
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

//axis
var dataXrange;
var dataYrange;
var xLabel;
var yLabel;

//chart variables
var chart;
var chartHeight;
var chartWidth;
var drawLine = false;

//chart data visuals
var genres = [];
var publishers = [];
var displays = [];
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
var yearRange;

//data
var data;
var parsedData = [];
var result;

init();
initChart();

function set (genresPassed, publishersPassed, displaysPassed, years) {
    genres = genresPassed.slice(0);
    publishers = publishersPassed.slice(0);
    displays = displaysPassed.slice(0);
    yearRange = years;
    if (displays.includes("Year")) {
        xLabel = "Year";
        yLabel = displays[0]=="Year" ? ylabel=displays[1] : ylabel=displays[0];
    } else {
        xLabel = displays[0];
        yLabel = displays[1];
    }
    if (d3.select(".x.axis").empty()) {
    	createAxis();
    } else {
    	resetAxis();
    	createAxis();
    }
    drawDots();
    drawAvgLine();
}

function init() {
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;
    d3.csv ("Video_Games_Sales_as_at_22_Dec_2016.csv", function (error, csv) {
        if (error) {
            return console.warn(error);
        } else {
            data = csv;
            data.forEach(function(d) {
                d.Global_Sales = +d.Global_Sales;
                if (d.Year_of_Release != "N/A")
                    d.Year_of_Release == +d.Year_of_Release;
                else d.Year_of_Release = null;
                //ignore games with <5 reviews
                //remove trivial values
                if (d.Critic_Score!="" && d.User_Score!="" && d.User_Score!="tbd") {
                    
                    d.Critic_Score = +d.Critic_Score;
                    d.User_Score = 10 * +d.User_Score;

                } else {
                    d.Critic_Score = null;
                    d.User_Score = null
                }
            });
            console.log("CSV loaded");
        }
    })
}

function initChart () {
    chart = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    chart.plotArea = chart.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function resetAxis () {
    d3.select(".x.axis")
        .remove();
    chart.select(".y.axis")
        .remove();
    chart.selectAll(".dot")
        .remove();
    chart.selectAll(".text")
    	.remove();
    d3.select("path.line").remove()
}

function createAxis () {
    //load the ranges
    dataYrange = d3.extent(data, function (d) { 
        if (yLabel == "Year")
            return d.Year_of_Release;
        else if (yLabel == "Sales")
            return d.Global_Sales;
        else if (yLabel == "Critic Score") 
            return d.Critic_Score;
        else if (yLabel == "User Score")
            return d.User_Score;
    });
    dataXrange = d3.extent(data, function (d) { 
        if (xLabel == "Year")
            return d.Year_of_Release;
        else if (xLabel == "Sales")
            return d.Global_Sales;
        else if (xLabel == "Critic Score") 
            return d.Critic_Score;
        else if (xLabel == "User Score")
            return d.User_Score; 
    });

    // x axis
    chart.xScale = d3.scaleLinear()
        .domain([d3.min(dataXrange), d3.max(dataXrange)])
        .range([0, chartWidth]);

    chart.xAxis = d3.axisBottom()
        .ticks(10, "d")
        .scale(chart.xScale);

    chart.xAxisContainer = chart.append("g")
        .attr("transform", "translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")")
    	.transition().duration(500)
    	.attr("class", "x axis")
        .call(chart.xAxis);

    // x axis header label
    chart.append("text")
        .style("font-size", "14px")
        .attr("font-family", "sans-serif")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (margin.left + chartWidth / 2.0) + ", " + (chartHeight + (margin.bottom / 2.0)) + ")")
        .transition().duration(500)
        .text(xLabel);

    // y axis labels
    chart.yScale = d3.scaleLinear()
        .domain([0, d3.max(dataYrange)])
        .range([chartHeight, 0]);

    chart.yAxis = d3.axisLeft()
        .ticks(10, "d")
        .scale(chart.yScale);

    chart.yAxisContainer = chart.append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        .transition().duration(500)
        .attr("class", "y axis")
        .call(chart.yAxis);

    // y axis header label
    chart.append('text')
        .style("font-size", "14px")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("class", "text")
        .attr("transform", "translate(" + (margin.left / 2.0) + ", " + (chartHeight / 2.0) + ") rotate(-90)")
        .transition().duration(500)
        .text(yLabel);
}

function drawAvgLine () {
    var groups = data.reduce(function (r, o) {
        var k = o.Year_of_Release;
        if (r[k]) {
            if (o.Global_Sales) (r[k].Global_Sales += o.Global_Sales) && ++r[k].Average;
        } else {
           r[k] = o; 
           r[k].Average = 1; // taking 'Average' attribute as an items counter(on the first phase)
        }
        return r;
    }, {});
        
    // getting "average of Points"    
    result = Object.keys(groups).map(function (k) {
        groups[k].Average = Math.round(groups[k].Global_Sales/groups[k].Average);
        return groups[k];
    });
    console.log(result);
    var line = d3.line()
        .x(function(d) { if(d.Year_of_Release == null) {return 2020;} else { return chart.xScale(d.Year_of_Release);}})
        .y(function(d) { return chart.yScale(d.Average)});
    chart.plotArea.append("path")
        .datum(result)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("id", "line")
        .attr("class", "line")
        .attr("d", line);
}

function drawDots () {
    chart.plotArea.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { 
            if (xLabel == "Year")
                return chart.xScale(d.Year_of_Release)
            else if (xLabel == "Sales")
                return chart.xScale(d.Global_Sales);
            else if (xLabel == "Critic Score") 
                return chart.xScale(d.Critic_Score);
            else if (xLabel == "User Score") {
                if (d.User_Score = null)
                    return null;
                return chart.xScale(d.User_Score);
            }
        })

        //y position based on the value passed
        .attr("cy", function(d) { 
            if (yLabel == "Sales")
                return chart.yScale(d.Global_Sales);
            else if (yLabel == "Critic Score") 
                return chart.yScale(d.Critic_Score);
            else if (yLabel == "User Score")
                return chart.yScale(d.User_Score);
        })

        .attr("r", function(d) {
            if (xLabel=="Critic Score" || yLabel=="Critic Score") {
                if (d.Critic_Score==null)
                    return 0;
            }
            if (xLabel=="User Score" || yLabel=="User Score") {
                if (d.User_Score==null)
                    return 0;
            }
            return 2.5;
        })
        .style("fill", function(d) {
            if (d.Genre == "Action")
                return "steelblue";
            if (d.Genre == "Adventure")
                return "springgreen";
            if (d.Genre == "Fighting")
                return "maroon"
            if (d.Genre == "Misc")
                return "dimgray"
            if (d.Genre == "Platform")
                return "goldenrod"
            if (d.Genre == "Puzzle")
                return "darkslateblue"
            if (d.Genre == "Racing")
                return "brown"
            if (d.Genre == "Role-Playing")
                return "burlywood"
            if (d.Genre == "Shooter")
                return "saddlebrown"
            if (d.Genre == "Simulation")
                return "darkgreen"
            if (d.Genre == "Sports")
                return "darkmagenta"
            if (d.Genre == "Strategy")
                return "teal"
        })

        .style("opacity", 0.8)
        .style("stroke", "none")

        .filter(function(d) {
            //genres selected but no publishers
            if ((publishers === undefined || publishers.length == 0) && (typeof genres !== 'undefined' && genres.length > 0)) {
                for (var k = 0; k < genres.length; k++) {
                    if (d.Genre == genres[j]) {
                        return true
                    }
                }
                d3.select(this).style("opacity", 0.0);
                return false;
              //publishers passed but no genres
            } else if ((genres === undefined || genres.length == 0) && (typeof publishers !== 'undefined' && publishers.length > 0)) {
                for (var k = 0; k < publishers.length; k++) {
                    if (d.Publisher == publishers[k]) {
                        return true;
                    }
                }
                d3.select(this).style("opacity", 0.0);
                return false; 
            //both publishers and genres passed
            } else if ((typeof publishers !== 'undefined' && publishers.length > 0) && (typeof genres !== 'undefined' && genres.length > 0)) {
                console.log("here");
                for (var j = 0; j < genres.length; j++) {
                    for (var k = 0; k < publishers.length; k++) {
                        if ((d.Publisher == publishers[k]) && (d.Genre == genres[j])) {
                            return true;
                        }
                    }
                }
                d3.select(this).style("opacity", 0.0);
                return false;
            //nothing selected
            } else {
                return true;
            }
        })

        //tooltip
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(50)
                .attr("r", 3.5)
            div.transition()
                .duration(50)
                .style("opacity", 0.9)
            div.html(d.Name +
                "<br/>" + d.Publisher +
                "<br/>" + d.Platform +
                "<br/>Released " + d.Year_of_Release +
                "<br/>Rating: " + d.Rating +
                "<br/>Critics: " + d.Critic_Score + "/100" +
                "<br/>Users: " + d.User_Score + "/100")  
                .style("left", (d3.event.pageX+6) + "px")
                .style("top", (d3.event.pageY-6) + "px");
            })       
        //remove box when mouse is off
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(25)
                .attr("r",2.5)
            div.transition()        
                //.duration(0)      
                .style("opacity", 0);   
        });
}

