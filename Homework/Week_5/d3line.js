  /*
  Yente Stor
  yentestor@gmail.com
  Student (10676643) of Data Processing course of University of Amsterdam (2017)

  Sources:
  - http://bl.ocks.org/d3noob/4414436
  - https://gist.github.com/lamchau/405f2d69fb3c80ad724a
  - https://stackoverflow.com/questions/37774053/d3-function-to-parse-the-date-not-working
  */
function startjs(){
  // set margins
  var margin = {top: 20, right: 100, bottom: 30, left: 60},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // initialize svg
  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the date / time
  var	parseDate = d3.time.format("%Y%m%d").parse;


  var x = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom").ticks(12);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left").ticks(30);

  d3.json("data.json", function(error, data) {
    if (error) throw error;

    // get data
    data.forEach(function(d) {
      d.mini = +(d.mini / 10);
      d.gem = +(d.gem / 10);
      d.maxi = +(d.maxi / 10);
      d.date = parseDate(d.date)
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([
     d3.min(data, function(d) { return d.mini; }),
     d3.max(data, function(d) { return d.maxi; })
    ]);
    console.log()

    // add x xAxis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
//     .append("text")
//      .attr("class", "label")
//      .attr("x", width)
//      .attr("y", -6)
//      .style("text-anchor", "end")
//      .text("date (month)");

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
      .text("temperature(Celsius)");

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


    var crosshair = svg.append("g")
      .attr("class", "line");

    // create vertical line
    crosshair.append("line")
      .attr("id", "crosshairY")
      .attr("class", "crosshair");

    var yMin = y(d3.min(data, function(d) { return d.mini; }))
    var yMax = y(d3.max(data, function(d) { return d.maxi; }))
    var xMin = x(d3.min(data, function(d) { return d.date; }))
    var xMax = x(d3.min(data, function(d) { return d.date; }))

    var dateText = svg.append("text")
      .attr("y", 10)
      .style("text-decoration","underline")
    var maxText = svg.append("text")
      .attr("y", 25)
    var meanText = svg.append("text")
      .attr("y", 40)
    var minText = svg.append("text")
      .attr("y", 55)



  var dateFormat = d3.time.format("%B %d");

    // console.log(data[150].mini)
    console.log(data.length)
    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events","all")
      .on("mouseover", function() {
          crosshair.style("display", null);
      })
      .on("mouseout", function() {
          crosshair.style("display", "none");
          minText.text("");
          maxText.text("");
          meanText.text("");
          dateText.text("");
      })
      .on("mousemove", function() {
          var mouse = d3.mouse(this);
          var x = mouse[0];
          var y = mouse[1];
          var data_point = Math.round((x/width) * data.length)

          crosshair.select("#crosshairY")
            .attr("x1", mouse[0])
            .attr("y1",yMin)
            .attr("x2", mouse[0])
            .attr("y2",yMax);

          minText.attr("x", x + 5)
          minText.text(function() {
              return "min: " + data[data_point].mini
          });

          meanText.attr("x", x + 5)
          meanText.text(function(){
            return "mean: " + data[data_point].gem
          });

          maxText.attr("x", x + 5)
          maxText.text(function() {
            return "max: "+ data[data_point].maxi
          });

          dateText.attr("x", x + 5)
          dateText.text(function() {
            console.log(data[data_point].date)
            console.log(dateFormat(data[data_point].date))
            return dateFormat(data[data_point].date)
          });



        })
  });
};
