// Yente Stor
// University of Amsterdam
// Student Number: 10676643
var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width]);


var chart = d3.select(".chart")
    .attr("width", width);

d3.json('data.json', function(error, data){
  console.log(data)

  // var data = [4, 8, 15, 16, 23, 42];

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(d) {
        bla = d['Rokers']
        if (bla < 0){
          bla = 0
        }
        console.log(bla)
        return x(bla);
      })

      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d['Land']) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d['Land']; });
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
//
// var width_factor = d3.scale.linear()
//   .domain([0, d3.max(data)])
//   .range([0, 420]);
// d3.select(".chart")
//   .selectAll("div")
//     .data(data)
//   .enter().append("div") // dit loopt dus soort van over de elementen in data heen
//     .style("width", function(d){
//       console.log(d)
//       return width_factor(d) + "px"; })
//     .text(function(d) { return d; });
