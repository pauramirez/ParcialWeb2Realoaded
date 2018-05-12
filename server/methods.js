Meteor.methods({
    addComentario(comentario) {

        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized")
        }

        Comentarios.insert({
            text: comentario,
            complete: false,
            createdAt: new Date(),
            user: Meteor.userId()
        });
    },

    toggleComentario(comentario) {
        if (Meteor.userId() !== comentario.user) {
            throw new Meteor.Error("not-authorized")
        }
        Comentarios.update(comentario._id, {
            $set: { complete: !comentario.complete }
        });
    },

    deleteComentario(comentario) {
        if (Meteor.userId() !== comentario.user) {
            throw new Meteor.Error("not-authorized")
        }
        Comentarios.remove(comentario._id);
    },

    getGrafica() {
        let response = new Promise((resolve, reject) => {
            HTTP.call("GET","http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=0", (err, response) => {
                if (err) reject(err);
                resolve(response);
            });
        });
        return response;
    }
});