// Fetch the data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(function(data) {
    const dataset = data;
    
    // Format the data for use
    const parseTime = d3.timeParse("%M:%S");
  
    dataset.forEach(d => {
      d.Time = parseTime(d.Time);
      d.Year = new Date(d.Year, 0, 1); // Convert year to Date object
    });
  
    // Set up SVG dimensions and margins
    const margin = {top: 20, right: 30, bottom: 60, left: 60};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    const svg = d3.select("#scatterplot")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Set up scales
    const x = d3.scaleTime()
      .domain(d3.extent(dataset, d => d.Year))
      .range([0, width]);
  
    const y = d3.scaleTime()
      .domain([d3.min(dataset, d => d.Time), d3.max(dataset, d => d.Time)])
      .range([height, 0]);
  
    // Add the X Axis
    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeYear.every(1))
      .tickFormat(d3.timeFormat("%Y"));
    
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    // Add the Y Axis
    const yAxis = d3.axisLeft(y)
      .tickFormat(d3.timeFormat("%M:%S"));
    
    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);
  
    // Add dots for the scatterplot
    const dot = svg.selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => d.Time)
      .attr("cx", d => x(d.Year))
      .attr("cy", d => y(d.Time))
      .attr("r", 5);
  
    // Add tooltip functionality
    const tooltip = d3.select("#tooltip");
  
    dot.on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("visibility", "visible");
      tooltip.html(d.Name + ": " + d.Nationality + "<br>" + d.Year.getFullYear() + "<br>" + d.Time.toISOString().substr(14, 5))
        .attr("data-year", d.Year)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    });
  
    dot.on("mouseout", function() {
      tooltip.transition()
        .duration(200)
        .style("visibility", "hidden");
    });
  });
  