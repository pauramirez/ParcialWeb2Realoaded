Comentarios = new Mongo.Collection("comentarios");

Meteor.publish("allComentarios", function () {
    return Comentarios.find(/*{complete:false}*/);
});