import CsvFile from "../anon_carbon_data.csv";
import * as d3 from "d3";
// import { VictoryChart, VictoryBar, VictoryAxis } from "victory";
import { csv } from "d3";
import { useEffect, useRef, useState } from "react";

export default function ChartCreator() {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    csv(CsvFile).then((data) => {
      setData(data);
    });
  }, []);

  // const weeks = 51;
  // const xTicks = Array.from({ length: weeks }, (_, index) => index + 1);

  useEffect(() => {
    //container
    const w = 800;
    const h = 700;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("margin-top", "75px");

    //scaling
    const xScale = d3
      .scaleBand()
      .domain(data.map((val, i) => i))
      .range([0, w])
      .padding(0.5);

    const yScale = d3.scaleLinear().domain([0, h]).range([h, 0]);

    //axis
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    const yAxis = d3.axisLeft(yScale).ticks(10);
    svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);
    svg.append("g").call(yAxis);

    //Avg Data
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("x", (v, i) => xScale(i))
      .attr("y", yScale())
      .attr("width", xScale.bandwidth())
      .attr("height", (val) => h - yScale(val));
  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      {/* <VictoryChart domainPadding={10}>
        <VictoryAxis tickValues={xTicks} />
        <VictoryAxis dependentAxis tickFormat={(x) => x / 10} />
        <VictoryBar data={data} x="week" y="tCO2e"></VictoryBar>
      </VictoryChart> */}
    </div>
  );
}
