/*
Yente Stor
yentestor@gmail.com
Student (10676643) of Data Processing course of University of Amsterdam (2017)

this script imports test.svg and implements rectangle and text element with d3
this js file is implemented in test_svg.html
*/

var texts = ['100', '1000', '10000','100000','1000000', '10000000'];
var colors = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'];
var lengths = {top: 10, left: 10, elem_height: 20}

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    // remove existing rectangles
    d3.selectAll("rect").remove();

    // add color rectangles
    d3.select("body").select("svg").selectAll(".col")
      .data(colors)
    .enter().append("rect")
      .attr("class", "color_rect")
      .attr("x", lengths.left)
      .attr("y", function(d, i) {return lengths.top + i * 30; })
      .attr("height", lengths.elem_height )
      .attr("width", 29)
      .style("fill", function(d,i) {return colors[i];
      });

      // add text
      d3.select("body").select("svg").selectAll(".text")
        .data(texts)
      .enter().append("text")
        .attr("class","legend_text")
        .attr("x", lengths.left + 39)
        .attr("y", function(d, i) {
          return lengths.top + lengths.elem_height/2 + i * 30; })
        .style("text-anchor", "start")
        .style("alignment-baseline", "central")
        .text(function(d,i) {return texts[i]
        });

});
