import * as React from 'react';
import * as d3 from "d3";
import { useRef, useEffect } from 'react';


// LineChart margins
export const margin = {top: 20, right: 20, bottom: 20, left: 40}

// Common properties on series
export type Series = {
    // The y-value for each point.
    y: number
}

export type LineChartProps = {
    width: number,
    height: number,
    // the x-values length
    xAxisLength: number
    // y-value
    y: number
}

// Initialize ys with 0 
const initializeYs = (len: number): Series[] => {
    let series: Series[] = []
    for(let i = 0; i < len; i++) series.push({y: 0}) 
    return series
}


export const Linechart = (props: LineChartProps) => {
    const svgRef = useRef<SVGSVGElement>()
    const path = useRef<d3.Selection<SVGPathElement, unknown, null, undefined>>()
    const series = useRef<Series[]>(initializeYs(props.xAxisLength))
    const { width, height } = props

    // Dimensions
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const x = d3.scaleLinear()
    .domain([0, props.xAxisLength - 1])
    .range([0, innerWidth]);

    const y = d3.scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0])


    const line = d3.line<Series>()
    .x(function(_, i) { return x(i); })
    .y(function(d, i) { return y(d.y) });

    const updateLineChart = (value: number) => {
        series.current.push({y: value})
        // redraw the line, and slide it to the left
        path.current
                .attr("d", line)
                .attr("transform", null)
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("transform", "translate(" + x(-1) + ",0)")
        // pop the old data point off the front
        series.current.shift();
    }

    // Initilize drawing area
    useEffect(() => {
            const svg = d3.select(svgRef.current)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
            svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight);
    
            svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerHeight + ")")
                    .call(d3.axisBottom(x));
    
            svg.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(y));
            
            path.current = svg.append("g")
                    .attr("clip-path", "url(#clip)")
                    .append("path")
                    .datum(series.current)
                    .attr("class", "line")
                    .attr("d", line);
    }, [])

    // Update Linechart everytime props change
    useEffect(() => {
        updateLineChart(props.y)
    },[props])

    return <svg width={props.width} height={props.height} ref={svgRef} />
} 