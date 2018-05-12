import React, { Component } from "react";
import propTypes from "prop-types";

import * as d3 from "d3";

export default class GraficaBarras extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 1000,
      height: 720,
      nested: null
    };

    this.stackBarChart = this.stackBarChart.bind(this);
  }

  componentDidMount() {
    this.stackBarChart();
    console.clear();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.nestedData !== this.props.nestedData) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    this.stackBarChart();
  }

  distanceBetweenBuses(lat1, long1, lat2, long2) {
    function deg2grad(deg) {
      return deg * (Math.PI / 180);
    }

    const Radius = 6371; 
    const dLat = deg2grad(lat2 - lat1);
    const dLon = deg2grad(long2 - long1); 
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2grad(lat1)) * Math.cos(deg2grad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a));

    return Radius * c; 
  }

  stackBarChart() {
    let nested = this.props.nestedData.slice(); 
    let maxBuses = d3.max(nested.map((data) => data.values.length)); 

    nested = nested.map(rute => {
      rute.total = 0; 
      rute.values[0].distance = 0; 

      for (let i = 1; i < rute.values.length; i++) {
    
        const lat1 = Number(rute.values[i - 1].lat);
        const long1 = Number(rute.values[i - 1].lon);
        const lat2 = Number(rute.values[i].lat);
        const long2 = Number(rute.values[i].lon);

        const distance = this.distanceBetweenBuses(lat1, long1, lat2, long2);


        rute.values[i].distance = distance;
        rute.total += distance;
      }

      rute.values = rute.values.sort((bus1, bus2) => bus1.distance - bus2.distance);
      return rute;
    });

    nested = nested.sort((a, b) => b.total - a.total); 

    const keys = d3.range(maxBuses); 

    const stacked = d3.stack()
      .keys(keys)
      .value((d, key) => {
        return key < d.values.length ? d.values[key].distance : 0;
      })(nested);

    const height = this.state.height;
    const width = this.state.width;

  
    let svg = d3.select(this.node);

    svg.html("");

    const margin = { top: 20, right: 50, bottom: 30, left: 40 };
    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," +
        margin.top + ")");


    let x = d3.scaleBand()
      .rangeRound([0, width - margin.left - margin.right])
      .paddingInner(0.05)
      .align(0.1);

    let y = d3.scaleLinear()
      .rangeRound([height - margin.top - margin.bottom, 0]);

    let z = d3.scaleSequential(d3.interpolateYlGnBu);

    x.domain(nested.map(function (d) { return d.key; }));
    y.domain([0, d3.max(nested, function (d) { return d.total; })]).nice(); 
    z.domain([0, maxBuses]);

    g.append("g")
      .selectAll("g")
      .data(stacked)
      .enter().append("g")
      .attr("fill", function (d) { return z(d.key); })
      .attr("stroke", "black")
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("x", function (d) { return x(d.data.key); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Added distance");

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(-50," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) { return d; });

    this.props.setRutes(nested);
  }


  render() {
    const height = this.state.height;
    const width = this.state.width;
    return (
      <svg className="bargraph" ref={node => (this.node = node)} height={height} width={width} />
    );
  }
}

GraficaBarras.propTypes = {
  nestedData: propTypes.array.isRequired,
  rutes: propTypes.array.isRequired,
  setRutes: propTypes.func.isRequired
};