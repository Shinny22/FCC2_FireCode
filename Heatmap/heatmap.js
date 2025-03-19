// Fetch the dataset
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(function(data) {
    const dataset = data;
    const baseTemperature = dataset.baseTemperature;
    const monthlyData = dataset.monthlyVariance;
  
    // Set the margins and dimensions for the SVG
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    // Create SVG container
    const svg = d3.select("#heatmap")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Prepare x and y scales
    const xScale = d3.scaleBand()
      .domain(d3.range(1754, 2016))
      .range([0, width])
      .padding(0.05);
  
    const yScale = d3.scaleBand()
      .domain(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
      .range([0, height])
      .padding(0.05);
  
    // Prepare color scale
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([d3.min(monthlyData, d => baseTemperature + d.variance), d3.max(monthlyData, d => baseTemperature + d.variance)]);
  
    // Add x-axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);
  
    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);
  
    // Create cells (rectangles) for the heat map
    svg.selectAll(".cell")
      .data(monthlyData)
      .enter().append("rect")
      .attr("class", "cell")
      .attr("data-month", d => d.month - 1) // Adjust month to 0-based
      .attr("data-year", d => d.year)
      .attr("data-temp", d => baseTemperature + d.variance)
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d3.timeFormat("%B")(new Date(0, d.month - 1))))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", d => colorScale(baseTemperature + d.variance))
      .on("mouseover", function(event, d) {
        const year = d.year;
        const month = d3.timeFormat("%B")(new Date(0, d.month - 1));
        const temp = baseTemperature + d.variance;
  
        d3.select("#tooltip")
          .style("visibility", "visible")
          .attr("data-year", year)
          .html(`${month} ${year}<br>${(temp).toFixed(1)}°C`);
      })
      .on("mouseout", function() {
        d3.select("#tooltip")
          .style("visibility", "hidden");
      });
  
    // Create legend
    const legend = d3.select("#legend");
    const legendData = colorScale.ticks(4);
  
    legend.selectAll(".legend-cell")
      .data(legendData)
      .enter().append("rect")
      .attr("class", "legend-cell")
      .attr("width", 30)
      .attr("height", 20)
      .attr("x", (d, i) => i * 35)
      .style("fill", d => colorScale(d));
  
  });
  