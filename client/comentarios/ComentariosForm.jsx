import React, { Component } from 'react';

export default class ComentariosForm extends Component {

    addComentario(event) {
        event.preventDefault();
        var text = this.refs.comentario.value.trim();

        Meteor.call('addComentario', text, () => {
            this.refs.comentario.value = "";
        });
    }



    render() {
        return (
            <form className="new-comentarios" onSubmit={this.addComentario.bind(this)}>
                <input
                    type="text"
                    ref="comentario"
                    placeholder="Comentario"
                />
            </form>
        )
    }

}