Meteor.methods({
    addComentario(comentario) {
        Comentarios.insert({
            text: comentario,
            complete: false,
            createdAt: new Date()
        });
    },

    toggleComentario(id, status) {
        Comentarios.update(id, {
            $set: { complete: !status }
        });
    },

    deleteComentario(id) {
        Comentarios.remove(id);
    }

});