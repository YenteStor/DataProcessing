// var colors = [‘#ccece6’,’#99d8c9’,’#66c2a4’,’#41ae76’,’#238b45’,’#005824’];
var texts = ['aaa', 'bbb', 'ccc','ddd','eee', 'fff'];

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
    // remove existing rectangels
    d3.selectAll("rect").remove();

    d3.selectAll(".col")
      .data(colors)
    .enter().append(".rect")
      .attr("class", "color_rect")
      .attr("x", 100)
      .attr("y", function(d,i) { return y(d.Rokers); })
    //   .attr("height", function(d) { return height - y(d.Rokers); })
    //   .attr("width", x.rangeBand())


});
