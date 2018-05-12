Comentarios = new Mongo.Collection("comentarios");

Meteor.publish("allComentarios", function () {
    return Comentarios.find(/*{complete:false}*/);
});

Meteor.publish("userComentarios", function () {
    return Comentarios.find({user: this.userId});
});