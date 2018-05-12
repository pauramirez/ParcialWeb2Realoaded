import React, { Component } from "react";
import propTypes from "prop-types";
import GraficaBarras from "./GraficaBarras";

export default class GraficaVisual extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rutesDistances: null
        };
        this.setrutes = this.setrutes.bind(this);
    }

    setrutes(rutesDistances) {
        this.setState({ rutesDistances });
    }

    render() {
        const graph = this.props.nestedData ?
            (<GraficaBarras
                nestedData={this.props.nestedData}
                rutes={this.props.rutes}
                setRutes={this.setrutes} />) : <p>Loading Data...</p>;
        return (
            <div>
                {graph}
            </div>

        );
    }
}

GraficaVisual.propTypes = {
    nestedData: propTypes.array,
    rutes: propTypes.array
};