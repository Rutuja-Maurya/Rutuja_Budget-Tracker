// ExpensesPieChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ExpensesPieChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;
    const width = 300, height = 300, radius = Math.min(width, height) / 2;
    d3.select(ref.current).selectAll('*').remove();
    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.total);
    const arc = d3.arc().innerRadius(60).outerRadius(radius);
    svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));
    svg.selectAll('text')
      .data(pie(data))
      .enter().append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data['category__name']);
  }, [data]);

  return <svg ref={ref}></svg>;
}

export default ExpensesPieChart;