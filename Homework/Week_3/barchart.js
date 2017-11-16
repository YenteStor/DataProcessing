// http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
// https://bost.ocks.org/mike/bar/3/

// canvas measures
var margin = {top: 20, right: 30, bottom: 80, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// ranges of x and y
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.05);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("data.json", function(error, data) {

    data.forEach(function(d) {
        d.Land = d.Land;
        d.Rokers = +d.Rokers;
    });

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
        .call(yAxis);

    chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Land); })
      .attr("y", function(d) { return y(d.Rokers); })
      .attr("height", function(d) { return height - y(d.Rokers); })
      .attr("width", x.rangeBand())
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div	.html(d.Rokers  + "<br/>"  + d.Land)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });
    // chart
  });
