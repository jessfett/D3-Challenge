//SVG Information
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);



// ChartGroup
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);




// Read the Data
var file = "assets/data/data.csv"

d3.csv(file).then(successHandle, errorHandle);




// Use error handling function to append data and SVG objects
function errorHandle(error) {
  throw error;
} 


function successHandle(statesData) {




  // Loop through the Data & Convert to Number
  statesData.map(function (data) {
    data.income = +data.income;
    data.obesity = +data.obesity;
  });




  //  Create the Scales & Append
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.income)])
    .range([0, width]);


  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(statesData, d=> d.obesity)-1, d3.max(statesData, d => d.obesity)])
    .range([height, 0]);


var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(7);

var leftAxis = d3.axisLeft(yLinearScale);


  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


  chartGroup.append("g")
    .call(leftAxis);




  // ScatterPlot Circles

  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#7E1056")
    .attr("opacity", ".75")


  // Append text to circles 
  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));



  // Add a Tool Tip - Bonus

  var toolTip = d3.tip()
    .attr("class", "d3-toolTip")
    .offset([80, -60])
    .html(function (d) {
      return (`<b>${d.state}</b><br><i>Income:</i> $${d.income}<br><i>Obesity:</i> ${d.obesity}% `);
    });

  chartGroup.call(toolTip);


  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this)
    toolTip.classed("d3-toolTip", true);
  })
 
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });



  //Scatterplot Labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
    .attr("class", "axisText")
    .text("Income ($)");
}
