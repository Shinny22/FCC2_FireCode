const width = 1000;
const height = 600;
const legendWidth = 300;

const svg = d3.select("#choropleth")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

const legendSvg = d3.select("#legend")
    .attr("width", legendWidth)
    .attr("height", 50);

const educationDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

Promise.all([d3.json(countyDataUrl), d3.json(educationDataUrl)])
    .then(([countyData, educationData]) => {
        const educationMap = new Map(educationData.map(d => [d.fips, d]));

        const colorScale = d3.scaleThreshold()
            .domain([10, 20, 30, 40, 50])
            .range(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"]);

        const path = d3.geoPath();

        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(countyData, countyData.objects.counties).features)
            .enter().append("path")
            .attr("class", "county")
            .attr("d", path)
            .attr("fill", d => {
                const education = educationMap.get(d.id);
                return education ? colorScale(education.bachelorsOrHigher) : "#ccc";
            })
            .attr("data-fips", d => d.id)
            .attr("data-education", d => educationMap.get(d.id)?.bachelorsOrHigher || 0)
            .on("mouseover", (event, d) => {
                const education = educationMap.get(d.id);
                tooltip.style("visibility", "visible")
                    .html(`${education.area_name}, ${education.state}: ${education.bachelorsOrHigher}%`)
                    .attr("data-education", education.bachelorsOrHigher)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 30 + "px");
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));

        const legendScale = d3.scaleLinear()
            .domain([10, 50])
            .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(colorScale.domain())
            .tickFormat(d => d + "%")
            .tickSize(10);

        legendSvg.selectAll("rect")
            .data(colorScale.range().map((color, i) => {
                return { color, value: colorScale.domain()[i] };
            }))
            .enter().append("rect")
            .attr("x", (d, i) => i * (legendWidth / colorScale.domain().length))
            .attr("width", legendWidth / colorScale.domain().length)
            .attr("height", 20)
            .attr("fill", d => d.color);

        legendSvg.append("g")
            .attr("transform", "translate(0, 20)")
            .call(legendAxis);
    })
    .catch(error => console.error("Error loading data:", error));
