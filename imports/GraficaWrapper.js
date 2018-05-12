import React, { Component } from "react";

import "./api/NexBuses";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Col, Navbar, Nav, NavItem } from "reactstrap";

import propTypes from "prop-types";
import GraficaVisual from "./Grafica/Visual/GraficaVisual";
import * as d3 from "d3-collection";

class GraficaWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        setInterval(this.fetchData, 10000); 
    }

    fetchData() {
        Meteor.call("getGrafica", (err, { content }) => {
            if (err) console.log(err);
            const data = JSON.parse(content);
            if (data !== null && typeof data !== "undefined") {
                let nestedData = d3.nest().key(d => d.routeTag).entries(data.vehicle);
                let rutes = nestedData.map(({ key }) => key);
                this.setState({ data, nestedData, rutes });
            }
        });
    }

    render() {
        const copyright = (this.state.data !== null && typeof this.state.data !== "undefined") ?
            this.state.data.copyright : "";

        return (
            <div>
                <Col>
                    <h1>Grafica </h1>
                </Col>
                <Col className="center" sm={12}>
                    <GraficaVisual nestedData={this.state.nestedData} rutes={this.state.rutes} />
                </Col>
            </div>
        );
    }
}
GraficaWrapper.propTypes = {
    user: propTypes.object
};

export default withTracker(() => {
    let user = Meteor.user();
    if (user !== null && typeof user !== "undefined") {
        if (user.profile !== null && typeof user.profile !== "undefined") {
            user.username = user.profile.name;
        }
    }
    return {
        user: user
    };
})(GraficaWrapper);