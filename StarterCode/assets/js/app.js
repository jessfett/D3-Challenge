// Store width and height parameters to be used in later in the canvas

var svgWidth = 900;

var svgHeight = 600;




// Set svg margins 

var margin = {

  top: 50,

  right: 50,

  bottom: 80,

  left: 50

};




// Create the width and height based svg margins and parameters to fit chart group within the canvas

var width = svgWidth - margin.left - margin.right;

var height = svgHeight - margin.top - margin.bottom;




// Create the canvas to append the SVG group that contains the states data

// Give the canvas width and height calling the variables predifined.

var svg = d3.select("#scatter")

  .append("svg")

  .attr("width", svgWidth)

  .attr("height", svgHeight);




// Create the chartGroup that will contain the data

// Use transform attribute to fit it within the chart area

var chartGroup = svg.append("g")

  .attr("transform", `translate(${margin.left}, ${margin.top})`);




// Import Data




var file = "assets/data/data.csv"




// Function is called and passes csv data

d3.csv(file).then(successHandle, errorHandle);




// Use error handling function to append data and SVG objects

// If error exist it will be only visible in console

function errorHandle(error) {

  throw error;

} 




// Function takes in argument statesData

function successHandle(statesData) {




  // Loop through the data and pass argument data

  statesData.map(function (data) {

    data.income = +data.income;

    data.obesity = +data.obesity;

  });




  //  Create scale functions

  // Linear Scale takes the min to be displayed in axis, and the max of the data

  var xLinearScale = d3.scaleLinear()

    .domain([8.1, d3.max(statesData, d => d.income)])

    .range([0, width]);




  var yLinearScale = d3.scaleLinear()

    .domain([d3.min(statesData, d=> d.obesity)-1, d3.max(statesData, d => d.obesity)])

    .range([height, 0]);




  // Create axis functions by calling the scale functions




  var bottomAxis = d3.axisBottom(xLinearScale)

    // Adjust the number of ticks for the bottom axis  

    .ticks(7);

  var leftAxis = d3.axisLeft(yLinearScale);













  // Append the axes to the chart group 

  // Bottom axis moves using height 

  chartGroup.append("g")

    .attr("transform", `translate(0, ${height})`)

    .call(bottomAxis);

  // Left axis is already at 0,0

  // Only append the left axis 

  chartGroup.append("g")

    .call(leftAxis);







  // Create Circles for scatter plot

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



  // Step 6: Initialize tool tip

  // ==============================

  var toolTip = d3.tip()

    .attr("class", "tooltip")

    .offset([80, -60])

    .html(function (d) {

      return (`${d.state}<br>Income: $${d.income}<br>Obesity: ${d.obesity}% `);

    });





  // Step 7: Create tooltip in the chart

  // ==============================

  chartGroup.call(toolTip);




  // Step 8: Create event listeners to display and hide the tooltip

  // ==============================

  circlesGroup.on("mouseover", function (data) {

    toolTip.show(data, this);

  })

    // onmouseout event

    .on("mouseout", function (data) {

      toolTip.hide(data);

    });




  // Create axes labels

  chartGroup.append("text")

    .attr("transform", "rotate(-90)")

    .attr("y", 0 - margin.left)

    .attr("x", 0 - (height / 2))

    .attr("dy", "1em")

    .attr("class", "axisText")

    .text("Obese (%)");




  chartGroup.append("text")

    .attr("transform", `translate(${width / 2}, ${height + margin.top})`)

    .attr("class", "axisText")

    .text("Income ($)");

}
