/*
Yente Stor
yentestor@gmail.com
Student (10676643) of Data Processing course of University of Amsterdam (2017)

this script implements

Sources:
- https://bl.ocks.org/MariellaCC/raw/0055298b94fcf2c16940/
- http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
-http://datamaps.github.io/old
- http://bl.ocks.org/hunzy/9134534 voor de pie chart
*/

// set margins
var margin = {top: 20, right: 100, bottom: 40, left: 60},
    width = 960 - margin.left - margin.right,
    height = (1000 - margin.top - margin.bottom) / 2;
    radius = Math.min(width, height) / 2;

window.onload = function(){

  var svg = d3.select('body').select('svg')
    .attr('id', 'pieChart')
    .attr('width', width)
    .attr('height', height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  queue()
    .defer(d3.json, "hpi_data.json")
    .defer(d3.json, "suicide_data.json")
    .await(ready);

  var color = d3.scale.linear().domain([12,37]).range(['#1a0000','#ff0000']);

  function ready(error, hpiData, suicideData){
    if (error){
      throw error;
    };
    var hpiDict = {};

    hpiData.forEach(function(d) {
      d.hpi = +d.hpi;
      console.log(d.hpi)
      hpiDict[d.country] = d.hpi
    })

    console.log(color(hpiDict["Spain"]))

    var basic = new Datamap({
      element: document.getElementById("container"),
      projection: 'mercator',
      scope: 'world',
      setProjection: function(element) {
        var projection = d3.geo.mercator()
          .center([8, 54])
          .rotate([4.4, 0])
          .scale(540)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
          .projection(projection);

        return {path: path, projection: projection};
      },
      fills: {
        defaultFill: "#c5f49f",
        norway: color(hpiDict['Norway']),
        spain: color(hpiDict['Spain']),
        netherlands: color(hpiDict['Netherlands']),
        switzerland: color(hpiDict['Switzerland']),
        denmark: color(hpiDict['Denmark']),
        unitedKingdom: color(hpiDict['United Kingdom']),
        finland: color(hpiDict['Finland']),
        iceland: color(hpiDict['Iceland']),
        austria: color(hpiDict['Austria']),
        france: color(hpiDict['France']),
        ireland: color(hpiDict['Ireland']),
        germany: color(hpiDict['Germany']),
        malta: color(hpiDict['Malta']),
        italy: color(hpiDict['Italy']),
        sweden: color(hpiDict['Sweden']),
        portugal: color(hpiDict['Portugal']),
        belgium: color(hpiDict['Belgium']),
        greece: color(hpiDict['Greece']),
        luxembourg: color(hpiDict['Luxembourg']),
      },

      data: {
        NOR: { fillKey: "norway"},
        ESP: { fillKey: "spain"},
        NLD: { fillKey: "netherlands" },
        CHE: { fillKey: "switzerland" },
        DNK: { fillKey: "denmark" },
        GBR: { fillKey: "unitedKingdom" },
        FIN: { fillKey: "finland" },
        ISL: { fillKey: "iceland" },
        AUT: { fillKey: "austria" },
        FRA: { fillKey: "france" },
        IRL: { fillKey: "ireland" },
        DEU: { fillKey: "germany" },
        MLT: { fillKey: "malta" },
        ITA: { fillKey: "italy" },
        SWE: { fillKey: "sweden" },
        PRT: { fillKey: "portugal" },
        BEL: { fillKey: "belgium" },
        GRC: { fillKey: "greece" },
        LUX: { fillKey: "luxembourg" }
      },

      geographyConfig: {
        highlightBorderColor: '#bada55',
        popupTemplate: function(geography, data) {
          var secondLine = ''
          if (hpiDict[geography.properties.name] != undefined) {
            secondLine = '<b> HPI: ' +  hpiDict[geography.properties.name] + '</br>'
          }
          return '<div class="hoverinfo"><b>' + geography.properties.name  + '</br>' + secondLine + '</div> '
        },
        popupOnHover: true,
        highlightBorderColor: '#000000',
        highlightBorderWidth: 2,
        highlightFillColor: '#000000'
      },
    });

    var suicideDict = {}

    suicideData.forEach(function(d) {
      d.male = +d.male;
      d.female = +d.female;
      suicideDict[d.country] =[
        {gender:"male", suicides:d.male},
        {gender:"female", suicides:d.female}
      ];
    })
    console.log(suicideDict['Netherlands'])

    d3.select("#pieChart")

    var colorPie = d3.scale.category[""];

    var arc = d3.svg.arc()
      .outerRadius(radius-100)
      .innerRadius(0);


    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.suicides});

    var g = svg.selectAll(".fan")
			.data(pie(suicideDict["Netherlands"]))
			.enter()
			.append("g")
			.attr("class", "fan")

		g.append("path")
			.attr("d", arc)
			.attr("fill", function(d,i){ return colorPie(i); })

    //
    // arc.append("text")
    //   .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
    //   .attr("dy", "0.35em")
    //   .text(function(d) { return d.data.age; });

  }
}
