import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  state = { 
    company: "Apple", // Default Company
    selectedMonth: 'November' //Default Month
  };

  componentDidMount() {
    console.log(this.props.csv_data) // Use this data as default. When the user will upload data this props will provide you the updated data
    this.renderChart();
  }

  componentDidUpdate() {
    console.log(this.props.csv_data)
  }

  // Adding handler for changing the selected company
  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  }

  // Handler for changing the selected month
  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  renderChart = () => {
    // Save data to variable
    const data = this.props.csv_data;

    // Parse the date string into JavaScript Date objects
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach((d) => (d.date = parseDate(d.date)));

    // Set the dimensions of the chart
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 500,
      height = 300,
      innerWidth = 500 - margin.left - margin.right,
      innerHeight = 300 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3
      .select("#mysvg")
      .attr("width", width)
      .attr("height", height)
      .select("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set the scales for the axes
    const x_Scale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Date))
    .range([0, innerWidth]);

    const y_Scale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Open), d3.max(data, (d) => d.Open)])
    .range([innerHeight, 0]);

    // Create the line Generator
    const lineGenerator = d3
    .line()
    .curve(d3.curveCardinal)
    .x((d) => x_Scale(d.Date))
    .y((d) => y_Scale(d.Open));

    // Get the pathData
    const pathData = lineGenerator(data);

    // Use join to handle the enter, update, and exit of the line path
    svg
      .selectAll(".line-path")
      .data([data])
      .join("path")
      .attr("class", "line-path")
      .attr("d", pathData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2);

    // Add the X axis using join
    svg
      .selectAll(".x.axis")
      .data([null])
      .join("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x_Scale));

    // Add the Y axis using join
    svg
      .selectAll(".y.axis")
      .data([null])
      .join("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y_Scale));

      svg
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x_Scale(d.Date))
      .attr('cy', (d) => y_Scale(d.Open))
      .attr('r', 3);
  }

  render() {
    const options = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta']; // Use this data to create radio button
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Use this data to create dropdown

    return (
      <div className="child1">
        {/* Adding Radio button for company selection and learning to comment this way*/}
        <div>
          <label>Company:</label>
          {options.map((company) => (
            <label key={company} style={{ marginLeft: "10px" }}>
              <input type="radio" value={company} checked={this.state.company === company} onChange={this.handleCompanyChange}/>
              {company}
            </label>
          ))}
        </div>

        {/* Dropdown for month selection */}
        <div style={{ marginTop: "20px" }}>
          <label>Month:</label>
          <select value={this.state.selectedMonth} onChange={this.handleMonthChange} style={{ marginLeft: "10px" }}>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <svg id="mysvg" width="700" height="400">
          <g></g>
        </svg>
      </div>
    );
  }
}

export default Child1;
