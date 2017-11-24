/*
Yente Stor
yentestor@gmail.com
Student (10676643) of Data Processing course of University of Amsterdam (2017)

Sources:
changing radius of dots: http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
*/
// set margins
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// initialize svg
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.category10();


// load data
d3.json("data.json", function(error, data) {
  if (error){
    console.log(error)
  }

  // get data
  data.forEach(function(d) {
      d.lc_incidence = +d.lc_incidence;
      d.smokers = +d.smokers;
  });

  x.domain(d3.extent(data, function(d) { return d.smokers; })).nice();
  y.domain(d3.extent(data, function(d) { return d.lc_incidence; })).nice();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
   .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Smoking population (%)");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
   .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Male Lung Cancer Incidence");

    var tooltip = d3.select("body").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

    // tooltip mouseover event handler
    var tipMouseover = function(d) {
        // var color = colorScale(d.country);
        var html  = "<span style='color:" + color + ";'>" + d.country + "</span><br/>" +
                    "<b>" + d.lc_incidence + "</b> Lung cancer <br/>" +
                    d.smokers + "</b> Smoking";

        d3.select(this).attr({ r: 6 });

        tooltip.html(html)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
          .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0!

    };
    // tooltip mouseout event handler
    var tipMouseout = function(d) {
      d3.select(this).attr({ r: 3.5 })

      tooltip.transition()
          .duration(300)
          .style("opacity", 0);

    };

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.smokers); })
      .attr("cy", function(d) { return y(d.lc_incidence); })
      .style("fill", function(d) { return color(d.country); })
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);

  var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d, i) {
        return d;
      });
});
