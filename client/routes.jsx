import React  from "react";
import ReactDom from "react-dom";
import {mount} from "react-mounter";
import {MainLayout} from "./layouts/MainLayout";
import ComentariosWrapper from "./comentarios/ComentariosWrapper"

FlowRouter.route('/', {
    action() {
        mount(MainLayout, {
            content: (<ComentariosWrapper/>)
        })
    }
});