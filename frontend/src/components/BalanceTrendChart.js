// BalanceTrendChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BalanceTrendChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;
    d3.select(ref.current).selectAll('*').remove();

    const width = 300, height = 300, margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    const parseDate = d3.timeParse('%Y-%m-%d');
    const chartData = data.map(d => ({
      date: typeof d.date === 'string' ? parseDate(d.date) : new Date(d.date),
      balance: d.balance
    }));

    const x = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.balance) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Area
    const area = d3.area()
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.balance));

    svg.append('path')
      .datum(chartData)
      .attr('fill', '#b2dfdb')
      .attr('d', area);

    // Line
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.balance));

    svg.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#3949ab')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%d')));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={ref}></svg>;
}

export default BalanceTrendChart;