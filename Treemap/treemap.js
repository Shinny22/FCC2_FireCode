// Data URL
const movieDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// Fetch the dataset
d3.json(movieDataUrl).then(data => {
  // Set up the SVG container
  const svg = d3.select("#treemap");
  const width = svg.attr("width");
  const height = svg.attr("height");

  // Set up the Treemap layout
  const treemap = d3.treemap()
    .size([width, height])
    .padding(1);

  // Set up the color scale for genres
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Process the data into a hierarchy
  const root = d3.hierarchy(data)
    .sum(d => d.value); // Sum the values for each node

  // Create the Treemap nodes
  treemap(root);

  // Create the rectangles (tiles)
  svg.selectAll(".tile")
    .data(root.leaves())
    .enter().append("rect")
    .attr("class", "tile")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .style("fill", d => colorScale(d.data.category))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .on("mouseover", function(event, d) {
      const tooltip = d3.select("#tooltip");
      tooltip.style("visibility", "visible")
        .attr("data-value", d.data.value)
        .html(`${d.data.name}<br>${d.data.category}<br>$${d.data.value.toLocaleString()}`);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("visibility", "hidden");
    });

  // Create the legend
  const legend = d3.select("#legend");

  const categories = [...new Set(data.children.map(d => d.name))];
  categories.forEach(category => {
    legend.append("div")
      .style("display", "inline-block")
      .style("margin", "0 10px")
      .html(`<div class="legend-item" style="background-color:${colorScale(category)}"></div> ${category}`);
  });
});
