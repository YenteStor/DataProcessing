/*
Yente Stor
University of Amsterdam
Student Number: 10676643

This program imports data.json set and computes a bargraph in barchart.html
needs data.json and barchart.html and an internet connection to run.
run '$ python -m SimpleHTTPServer 8888' and open http://localhost:8888/barchart.html in your browser.

Sources for the barchart and d3 elements.
http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
https://bost.ocks.org/mike/bar/3/
tooltips
http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
*/

// canvas margins
var margin = {top: 20, right: 30, bottom: 80, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// scale functions for x and y
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.05);

var y = d3.scale.linear()
    .range([height, 0]);

// create scaled axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// initialize chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// tooltip for interactivity
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.json("data.json", function(error, data) {
    // get data
    data.forEach(function(d) {
        d.Land = d.Land;
        d.Rokers = +d.Rokers;
    });

    // scale with data
    x.domain(data.map(function(d) { return d.Land; }));
    y.domain([0, d3.max(data, function(d) { return d.Rokers; })]);

    // x axis
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "start")
      .attr("x", "1em")
      .attr("y", "0em")
      .attr("transform", "rotate(50)");

    // y axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")      // text label for the x axis
            .attr("x", -height/2)
            .attr("y", -30)
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("% vaste rokers");

    // bars
    chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Land); })
      .attr("y", function(d) { return y(d.Rokers); })
      .attr("height", function(d) { return height - y(d.Rokers); })
      .attr("width", x.rangeBand())

      // bubbletext with bar info
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity")
        div	.html(d.Rokers + '%' + "<br/>"  + d.Land)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 50) + "px")
          .style("width", "80px")
          .style("Height","40px")
          .style("background","lightgrey");
        })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });
  });
