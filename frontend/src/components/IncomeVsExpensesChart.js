// IncomeVsExpensesChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function IncomeVsExpensesChart({ income, expenses }) {
  const ref = useRef();

  useEffect(() => {
    const data = [
      { label: 'Income', value: income },
      { label: 'Expenses', value: expenses }
    ];
    const width = 300, height = 300;
    d3.select(ref.current).selectAll('*').remove();
    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);
    const x = d3.scaleBand().domain(data.map(d => d.label)).range([40, width - 20]).padding(0.4);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value) || 1]).range([height - 40, 20]);
    svg.append('g').attr('transform', `translate(0,${height - 40})`).call(d3.axisBottom(x));
    svg.append('g').attr('transform', `translate(40,0)`).call(d3.axisLeft(y));
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - 40 - y(d.value))
      .attr('fill', (d, i) => i === 0 ? '#4caf50' : '#e57373');
  }, [income, expenses]);

  return <svg ref={ref}></svg>;
}

export default IncomeVsExpensesChart;