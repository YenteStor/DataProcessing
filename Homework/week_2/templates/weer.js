// Name: Yente Stor
// Student number: 10676643

// This script imports a weather dataset and implements it in a graph in weer.html
// To run this file you need, weer.html and weer.py (to run the flask application)
// run '$ python3 -m http.server 8080' when in a directory that holds weer.py and
// a folder called templates that holds weer.html and weer.js
// sources for canvas elements:
// - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
// - https://stackoverflow.com/questions/1643320/get-month-name-from-date
// - https://stackoverflow.com/questions/3167928/drawing-rotated-text-on-a-html5-canvas


function getData(){
    // function that converts a multiline text with dates and temperatures
    // (YYYYMMDD,T) in a dictionary that has a key for an array of functional
    // dates and a key with an array of numeric temperatures
    // select raw data
    rows = document.getElementById('rawdata').value.split("\n");

    // dictionairy for functional data
    var data = {
        dates: [],
        temps: []
    };

    // get functional data
    for (row = 0; row < (rows.length - 1); row++){

        // seperate date and temperature string
        var row_string = rows[row].split(',');

        // stores date string (YYYYMMDD) as functional date
        data['dates'][row] = new Date(row_string[0].substring(0, 4),
        (Number(row_string[0].substring(4, 6))-1), row_string[0].substring(6, 8));

        // store temperature as number
        data['temps'][row] = Number(row_string[1]);
    };

    return data;
}


function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0];
    var domain_max = domain[1];
    var range_min = range[0];
    var range_max = range[1];

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min);
    var beta = range_max - alpha * domain_max;

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    };
}

// finds minimun and maximum value of numeric list or date list
function getDomain(data_list){

    // chech if input is numeric
    if (typeof(data_list[0]) != 'number'){
        console.log('sorry, that is not a number...');
        return undefined
    }

    // save biggest number
    var domain_min = data_list.reduce(function(a,b){
        return Math.min(a,b)
    });

    // save smallest number
    var domain_max = data_list.reduce(function(a,b){
        return Math.max(a,b)
    });

    return [domain_min, domain_max];
}

function relativeDays(dates_array){

    var days_array = []
    var ms_day = 86400000;
    var date_0 = dates_array[0].getTime() - ms_day;

    // calculate day number relative to date_0
    for(i = 0; i<dates_array.length; i++){
        days_array[i] = Math.round((dates_array[i].getTime() - date_0)/ms_day);
    }

    return days_array
}

function drawGraph(raw_x_array, y_array){
    // x_array  must be an array of the X values
    // y_array must be an array of the y values
    // uses the createTransform() function to get the transformed values
    // to fit into the graph

    x_array = relativeDays(raw_x_array);

    // get canvas and create 2d context
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(10, 10, 500, 400);

    // initiate measurements
    edge = 100;
    bg_width = 500;
    bg_height = 400;
    bg_edge = 30;
    graph_bottom = edge + bg_height - bg_edge;
    // top and right side of graph
    graph_side = edge + bg_edge;

    // graph background
    ctx.fillStyle = 'rgb(200, 200, 0)';
    ctx.fillRect(edge, edge, bg_width, bg_height);
    ctx.beginPath();

    // get transformation functions for x and y axis
    x_transform = createTransform(getDomain(x_array),[graph_side, edge + bg_width - bg_edge]);
    y_transform = createTransform(getDomain(y_array),[graph_bottom, graph_side]);
    x_axis_transform = createTransform(getDomain(y_array),[graph_bottom,graph_side]);

    // y axis
    ctx.moveTo(graph_side, graph_side);
    ctx.lineTo(graph_side, graph_bottom);
    ctx.stroke();

    // 0 degrees dashed line
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(graph_side, y_transform(0));
    ctx.lineTo(edge + bg_width - bg_edge, y_transform(0));
    ctx.stroke();

    // x axis
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(graph_side, graph_bottom );
    ctx.lineTo(edge + bg_width - bg_edge, graph_bottom);
    ctx.stroke();

    // month array for branches
    var months = ['Jan' ,'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec']
    branch_distance = (bg_width - (2 * bg_edge)) / months.length;
    var branch_len = 5;

    // initialize text
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = '10px serif';

    // x axis branches
    for (l = 0; l < x_array.length; l++){

      if (l != 0 && raw_x_array[l-1].getMonth() != raw_x_array[l].getMonth()){

        // branches
        ctx.moveTo(x_transform(x_array[l]), graph_bottom);
        ctx.lineTo(x_transform(x_array[l]), graph_bottom + branch_len);
        ctx.stroke();

        // month text
        ctx.fillText(months[raw_x_array[l].getMonth()],
        x_transform(x_array[l]) + branch_distance / 3,
        graph_bottom + branch_len * 2);

        // year text
        if (months[raw_x_array[l].getMonth()] == 'Jan'){
          ctx.fillText(raw_x_array[l].getFullYear(), x_transform(x_array[l]),
          graph_bottom + branch_len * 4)
         }

      // first branch text
      } else if (l == 0){

        // month text
        ctx.fillText(months[raw_x_array[l].getMonth()],
        x_transform(x_array[l]) + 3,
        graph_bottom + branch_len * 2)

        // year text
        ctx.fillText(raw_x_array[l].getFullYear(), x_transform(x_array[l]),
        graph_bottom + branch_len * 4)
      }
    };

    // y axis branches
    for (m = getDomain(y_array)[0]; m <getDomain(y_array)[1]; m++){
      if (m % 20 == 0){
        console.log("hi",m)
        // branches
        ctx.moveTo(graph_side, y_transform(m));
        ctx.lineTo(graph_side - branch_len, y_transform(m));
        ctx.stroke();
        // degrees
        ctx.fillText(m/10, graph_side - branch_len * 5, y_transform(m))
      }
    }

    // starting point of data graph
    ctx.beginPath();
    ctx.moveTo(x_transform(x_array[0]),y_transform(y_array[0]))

    // draw line through other data points
    for(k = 1; k < x_array.length; k++){
        ctx.lineTo(x_transform(x_array[k]),y_transform(y_array[k]))
    }
    ctx.stroke();

    // titles style
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgb(0, 0, 200)';

    // main title
    ctx.font = '25px tahoma';
    ctx.fillText('Temperatures in De Bilt (NL) in Yente Stor\'s First Year',
    edge + bg_width / 2, edge / 2);

    // x title
    ctx.font = '18px tahoma';
    ctx.fillText('Date', edge + bg_width / 2, graph_bottom + bg_edge * 1.5)
    console.log(graph_bottom+bg_edge)

    // y title
    y_title = 'average daily temperature (Celsius)'
    ctx.rotate(-Math.PI/2);

    ctx.fillText(y_title, - edge - bg_height/2, graph_side - bg_edge * 1.5)

};

function reqListener () {
  console.log(this.responseText);
}

function main(){
    // // een XMLHTTPRequest poging
    // request_object = new XMLHttpRequest;
    // request_object.open("GET", "http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi",true);
    //
    // request_object.onload = function() {
    //   console.log(request_object.responseText)
    // };
    // request_object.send();
    // data = getData();
    // days_ar = relativeDays(data['dates']);
    var data = getData()
    drawGraph(data['dates'],data['temps']);
    console.log(data['temps'])
};

main()
