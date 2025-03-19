// Set up margins and dimensions
const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Tooltip setup
const tooltip = d3.select("#tooltip");

// Load the dataset
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(function(data) {

    // Prepare the data
    const dataset = data.data.map(d => ({
      date: new Date(d[0]),
      gdp: d[1]
    }));

    // Set up scales for x and y axes
    const xScale = d3.scaleTime()
      .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.gdp)])
      .nice()
      .range([height, 0]);

    // Create the x-axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeYear.every(5));

    // Create the y-axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(10)
      .tickFormat(d => d / 1000000000 + 'B');

    // Append the x-axis to the chart
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Append the y-axis to the chart
    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);

    // Create the bars for the bar chart
    svg.selectAll(".bar")
      .data(dataset)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d.date.toISOString())
      .attr("data-gdp", d => d.gdp)
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.gdp))
      .attr("width", width / dataset.length)
      .attr("height", d => height - yScale(d.gdp))
      .attr("index", (d, i) => i)
      .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("visibility", "visible");
        tooltip.html(d.date.getFullYear() + "<br>" + "$" + d.gdp.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " Billion")
          .attr("data-date", d.date.toISOString())
          .style("top", (event.pageY - 50) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition().duration(200).style("visibility", "hidden");
      });

  })
  .catch(function(error) {
    console.log(error);
  });
