
//// RENDERING THE BAR CHART IN D3////


// parse CSV and call createChart function
d3.csv("data.csv", function (rows) {
    var data = createObj(rows);
    createChart(data);
});

// creates a JSON-type object to be used in  createChart
function createObj(rows) {
    var obj = rows[0]
    var array = []
    for (const property in obj) {
        array.push(
            {
                letter: property,
                frequency: parseInt(obj[property]),
            }
        )
    }
    console.log('from d3 csv', array);
    return array;
}

// draws the graph and binds the data
function createChart(data) {

    // draw area for shape div
    var svg = d3.select("svg"),
        margin = { top: 20, right: 0, bottom: 50, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    // create the scales on the x and y axes
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
        y = d3.scaleLinear().rangeRound([height, 0]);

    // adjust drawing area to be inside the margins
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create domain and range based on data array 
    x.domain(data.map(function (d) { return d.letter; }));
    y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

    // create X axis (ticks, labels, title)
    g.append("g")
        .attr("class", "axis text axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "#000")
        .attr("transform",
            "translate(" + (width / 2) + " ," + margin.bottom + ")")
        .attr("text-anchor", "middle")
        .attr("class", "text")
        .text("Letter");

    // create Y axis (ticks, labels, title)
    g.append("g")
        .attr("class", "axis text axis--y")
        .call(d3.axisLeft(y).scale(y).tickSize(-width))
        .select(".tick:last-of-type")
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frequency");

    // bind the data to the (incoming) class bar divs
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", function (d) {
            max = d3.max(data, function (d) { return d.frequency; });
            return "rgb(255," + (255 - d.frequency / max * 255)  + ", 0)"
        })
        .attr("x", function (d) { return x(d.letter); })
        .attr("y", function (d) { return y(d.frequency); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.frequency); }) 
        .on("mouseover", function() {
            d3.select(this)
                .attr("fill", "tomato")})
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", function (d) {
                    max = d3.max(data, function (d) { return d.frequency; });
                    return "rgb(255," + (255 - d.frequency / max * 255)  + ", 0)"
                })
        });
};