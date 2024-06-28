import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const Container = styled.div`
  padding: 40px;
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  background: #32333b;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;

  &:hover .caption {
    visibility: visible;
    opacity: 1;
  }
`;

const Caption = styled.div`
  color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  height: 50px;
  transition: all 0.4s ease-out;
`;

const MultiLayoutVisualizations = () => {
  const treeRef = useRef();
  const clusterRef = useRef();
  const treemapRef = useRef();
  const packRef = useRef();
  const partitionRef = useRef();
  const sunburstRef = useRef();

  const data = {
    name: "A1",
    children: [
      {
        name: "B1",
        children: [
          { name: "C1", value: 100 },
          { name: "C2", value: 300 },
          { name: "C3", value: 200 }
        ]
      },
      { name: "B2", value: 200 }
    ]
  };

  useEffect(() => {
    const root = d3.hierarchy(data);

    const handleEvents = (selection) => {
      selection.on('mouseover', function() {
        const g = d3.select(this);
        const n = g.select('.the-node');

        if (n.classed('solid')) {
          n.transition().duration(400)
            .style('fill', "rgba(211,0,0,0.8)")
            .attr('r', 18);
        } else {
          n.transition().duration(400)
            .style('fill', "rgba(211,0,0,0.8)");
        }
        
        g.select('.label')
          .transition().duration(700)
          .style('fill', 'white');
      })
      .on('mouseout', function() {
        const g = d3.select(this);
        const n = g.select('.the-node');

        if (n.classed('solid')) {
          n.transition().duration(400)
            .style('fill', "#696969")
            .attr('r', 14);
        } else {
          n.transition().duration(400)
            .style('fill', "rgba(255,255,255,0.2)");
        }
        g.select('.label')
          .transition().duration(700)
          .style('fill', "black");
      });
    };

    // Tree Layout
    const treeLayout = d3.tree().size([400, 200]);
    treeLayout(root);

    const treeSvg = d3.select(treeRef.current);
    const treeNodes = treeSvg.select('g.nodes')
      .selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .classed('node', true)
      .call(handleEvents);

    treeNodes.append('circle')
      .classed('the-node solid', true)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 14)
      .style("fill", "#696969");

    treeNodes.append('text')
      .attr('class', 'label')
      .attr('dx', d => d.x)
      .attr('dy', d => d.y + 4)
      .text(d => d.data.name);

    treeSvg.select('g.links')
      .selectAll('line.link')
      .data(root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .style("stroke", "#5f5f5f");

    // Cluster Layout
    const clusterLayout = d3.cluster().size([400, 200]);
    clusterLayout(root);

    const clusterSvg = d3.select(clusterRef.current);
    const clusterNodes = clusterSvg.select('g.nodes')
      .selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .classed('node', true)
      .call(handleEvents);

    clusterNodes.append('circle')
      .classed('the-node solid', true)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 14)
      .style("fill", "#696969");

    clusterNodes.append('text')
      .attr('class', 'label')
      .attr('dx', d => d.x)
      .attr('dy', d => d.y + 4)
      .text(d => d.data.name);

    clusterSvg.select('g.links')
      .selectAll('line.link')
      .data(root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .style("stroke", "#5f5f5f");

    // Treemap Layout
    const treemapLayout = d3.treemap()
      .size([400, 200])
      .paddingOuter(20)
      .tile(d3.treemapSquarify.ratio(2));

    root.sum(d => d.value);
    treemapLayout(root);

    const treemapSvg = d3.select(treemapRef.current);
    const treemapNodes = treemapSvg.select('g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .call(handleEvents);

    treemapNodes.append('rect')
      .classed('the-node', true)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .style("fill", "rgba(255,255,255,0.2)")
      .style('stroke', "#2f2f2f");

    treemapNodes.append('text')
      .attr('class', 'label')
      .attr('dx', 12)
      .attr('dy', 14)
      .text(d => d.data.name);

    // Pack Layout
    const packLayout = d3.pack()
      .size([400, 200])
      .padding(10);

    packLayout(root);

    const packSvg = d3.select(packRef.current);
    const packNodes = packSvg.select('g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .call(handleEvents);

    packNodes.append('circle')
      .classed('the-node', true)
      .attr('r', d => d.r)
      .style('fill', "rgba(255,255,255,0.2)")
      .style('stroke', '#2f2f2f');

    packNodes.append('text')
      .attr('class', 'label')
      .attr('dy', 4)
      .attr('dx', 0)
      .text(d => d.children === undefined ? d.data.name : '');

    // Partition Layout
    const partitionLayout = d3.partition()
      .size([400, 200])
      .padding(2);

    partitionLayout(root);

    const partitionSvg = d3.select(partitionRef.current);
    const partitionNodes = partitionSvg.select('g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .call(handleEvents);

    partitionNodes.append('rect')
      .classed('the-node', true)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .style('fill', 'rgba(255,255,255,0.2)')
      .style('stroke', '#2f2f2f');

    partitionNodes.append('text')
      .attr('class', 'label')
      .attr('dx', 12)
      .attr('dy', 14)
      .text(d => d.data.name);

    // Sunburst Layout
    const radius = 100;
    const sunburstLayout = d3.partition()
      .size([2 * Math.PI, radius]);

    sunburstLayout(root);

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    const sunburstSvg = d3.select(sunburstRef.current);
    const sunburstNodes = sunburstSvg.select('g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr("class", "node")
      .call(handleEvents);

    sunburstNodes.append('path')
      .attr('d', arc)
      .classed('the-node', true)
      .style('fill', 'rgba(255,255,255,0.2)')
      .style('stroke', '#2f2f2f');

    sunburstNodes.append("text")
      .attr('class', 'label')
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dx", "-4")
      .attr("dy", ".5em")
      .text(d => d.parent ? d.data.name : "");

  }, []);

  return (
    <Container>
      <Wrapper>
        <svg ref={treeRef} className="graph" id="tree" width="400" height="200" viewBox="0 0 400 240">
          <g transform="translate(10,20)">
            <g className="links"></g>
            <g className="nodes"></g>
          </g>
        </svg>
        <Caption>tree layout</Caption>
      </Wrapper>

      <Wrapper>
        <svg ref={clusterRef} className="graph" id="cluster" width="400" height="200" viewBox="0 0 400 240">
          <g transform="translate(10,20)">
            <g className="links"></g>
            <g className="nodes"></g>
          </g>
        </svg>
        <Caption>cluster layout</Caption>
      </Wrapper>

      <Wrapper>
        <svg ref={treemapRef} className="graph" id="treemap" width="400" height="200" viewBox="0 0 400 220">
          <g transform="translate(0,10)"></g>
        </svg>
        <Caption>treemap layout</Caption>
      </Wrapper>

      <Wrapper>
        <svg ref={packRef} className="graph" id="pack" width="400" height="200" viewBox="0 0 400 220">
          <g transform="translate(5,10)"></g>
        </svg>
        <Caption>pack layout</Caption>
      </Wrapper>

      <Wrapper>
        <svg ref={partitionRef} className="graph" id="partition" width="400" height="200" viewBox="0 0 400 220">
          <g transform="translate(5,10)"></g>
        </svg>
        <Caption>partition layout</Caption>
      </Wrapper>

      <Wrapper>
        <svg ref={sunburstRef} className="graph" id="partition-sunburst" width="400" height="200" viewBox="0 0 400 220">
          <g transform="translate(200,110)"></g>
        </svg>
        <Caption>sunburst layout</Caption>
      </Wrapper>
    </Container>
  );
};

export default MultiLayoutVisualizations;
