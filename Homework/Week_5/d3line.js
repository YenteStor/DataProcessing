  /*
  Yente Stor
  yentestor@gmail.com
  Student (10676643) of Data Processing course of University of Amsterdam (2017)

  this script implements a graph in d3line.html that shows the minimal, average, and maximal
  temperature of either 2016 or 2015 at de bilt. Needs data2015.json and
  data2016.json for data.

  Sources:
  - http://bl.ocks.org/d3noob/4414436
  - https://gist.github.com/lamchau/405f2d69fb3c80ad724a
  - https://stackoverflow.com/questions/37774053/d3-function-to-parse-the-date-not-working
  */

// main function
function startjs(dataset = "data2015.json"){

  // set margins
  var margin = {top: 20, right: 100, bottom: 40, left: 60},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // remove old svg 
  d3.selectAll("svg").remove()

  // initialize svg
  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the date / time
  var	parseDate = d3.time.format("%Y%m%d").parse;

  // x and y scale functions
  var x = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 0]);

  // axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom").ticks(12);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left").ticks(25);

  // load data
  d3.json(dataset, function(error, data) {
    if (error) throw error;

    // tranform data
    data.forEach(function(d) {
      d.mini = +(d.mini / 10);
      d.gem = +(d.gem / 10);
      d.maxi = +(d.maxi / 10);
      d.date = parseDate(d.date);
    });

    // x and y domain
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([
     d3.min(data, function(d) { return d.mini; }),
     d3.max(data, function(d) { return d.maxi; })
    ]);

    // add x xAxis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .text("DATE");

    // een poging tot het alignen van de labels van de x as
    // var ticks =  d3.selectAll(".xaxis").selectAll("tick")
    // ticks.style("text-anchor", "start");

    // add y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -height/2)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("TEMPERATURE (Celsius)");

    // add lines
    var min_line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.mini); });

    var gem_line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.gem); });

    var max_line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.maxi); });

    // draw graph lines
    svg.append("path")
		  .attr("class", "line")
		  .attr("d", min_line(data))
      .style("stroke", "steelblue");
	  svg.append("path")
		  .attr("class", "line")
		  .attr("d", max_line(data))
      .style("stroke", "orangeRed");
	  svg.append("path")
      .attr("class", "line")
      .attr("d",gem_line(data))
      .style("stroke", "olive")
      .style("stroke-dasharray", "2");

    // crosshair
    var crosshair = svg.append("g")
      .attr("class", "line")
      .style("stroke-width", "1px");

    // create vertical line
    crosshair.append("line")
      .attr("id", "crosshairY")
      .attr("class", "crosshair");

    // domain for crosshair
    var yMin = y(d3.min(data, function(d) { return d.mini; }));
    var yMax = y(d3.max(data, function(d) { return d.maxi; }));
    var xMin = x(d3.min(data, function(d) { return d.date; }));
    var xMax = x(d3.min(data, function(d) { return d.date; }));

    // background crosshair text
    var backgroundText = svg.append("rect")
      .attr("width", 80)
      .attr("height", 60)
      .attr("y",0)
      .style("fill","white");

    // text crosshair
    var dateText = svg.append("text")
      .attr("y", 10)
      .style("text-decoration","underline");
    var maxText = svg.append("text")
      .attr("y", 25)
      .style("fill","orangeRed");
    var meanText = svg.append("text")
      .attr("y", 40)
      .style("fill", "olive");
    var minText = svg.append("text")
      .attr("y", 55)
      .style("fill", "steelblue");

    // date formatting for text crosshair
    var dateFormat = d3.time.format("%B %d");

    // crosshair background
    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width-2)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events","all")

      // crosshair mousevents
      .on("mouseover", function() {
          crosshair.style("display", null);
      })
      .on("mouseout", function() {
          // make crosshair elements invisible
          crosshair.style("display", "none");
          minText.text("");
          maxText.text("");
          meanText.text("");
          dateText.text("");
          backgroundText.style("opacity", 0);

      })
      .on("mousemove", function() {
          // save mouse position
          var mouse = d3.mouse(this);
          var x = mouse[0];
          var y = mouse[1];

          // index for data point of position
          var dataPoint = Math.round((x/width) * data.length);

          // draw crosshair
          crosshair.select("#crosshairY")
            .attr("x1", mouse[0])
            .attr("y1",yMin)
            .attr("x2", mouse[0])
            .attr("y2",yMax);

          // draw background square for text
          backgroundText.attr("x", x + 2)
            .style("opacity", 0.6);

          // draw crosshair text
          minText.attr("x", x + 5)
            .text(function() {
              return "min: " + data[dataPoint].mini
          });
          meanText.attr("x", x + 5)
            .text(function(){
            return "mean: " + data[dataPoint].gem
          });
          maxText.attr("x", x + 5)
            .text(function() {
            return "max: "+ data[dataPoint].maxi
          });
          dateText.attr("x", x + 5)
            .text(function() {
            return dateFormat(data[dataPoint].date)
          });
        });
  });
  // update when drop down menu is used
  d3.select('select').on("change",function(){
    // use the selected dataset
    var dataSelect = d3.select(this).node().value;
    startjs(dataSelect);
  })
};
