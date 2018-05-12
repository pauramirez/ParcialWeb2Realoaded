import React, { Component } from 'react';

export default class ComentarioSingle extends Component {

    toggleChecked() {
        Meteor.call("toggleComentario", this.props.comentario._id, this.props.comentario.complete);
    }

    deleteComentario() {
        Meteor.call("deleteComentario", this.props.comentario._id);
    }

    render() {
        return (
            <li>
                <input type="checkbox"
                    readOnly={true}
                    checked={this.props.comentario.complete}
                    onClick={this.toggleChecked.bind(this)}
                />
                {this.props.comentario.text}
                <button className="btn-cancel"
                    onClick={this.deleteComentario.bind(this)}>
                    &times;
                    </button>
            </li>
            )
        }
}