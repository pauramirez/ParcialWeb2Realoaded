import React from 'react';
import ReactDOM from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react'

import ComentariosForm from './ComentariosForm'
import ComentariosSingle from './ComentarioSingle'

Comentarios = new Mongo.Collection("comentarios");

export default class ComentariosWrapper extends TrackerReact(React.Component) {

    constructor() {
        super();

        this.state = {
            subscription: {
                comentarios: Meteor.subscribe("allComentarios")
            }
        }
    }

    componentWillUnmount() {
        this.state.subscription.comentarios.stop();
    }

    comentarios() {
        return Comentarios.find().fetch();
    }


    render() {
        let res = this.comentarios();

        if (res.length < 1) {
            return (<div>Loading </div>)
        }

        console.log(this.comentarios());

        return (
            <div>
                <h1> Comentarios </h1>
                <ComentariosForm />
                <ul className="comentarios">
                    {this.comentarios().map((comentario) => {
                        return <ComentariosSingle key={comentario._id} comentario={comentario} />
                    })}
                </ul>
            </div>
        )
    }
}

