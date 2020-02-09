/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["accUtils","knockout","ojs/ojarraydataprovider","ojs/ojcorerouter","ojs/ojmodulerouter-adapter","ojs/ojknockoutrouteradapter","ojs/ojnavigationlist"],(function(e,t,o,i,n,a){return function(t){const i=[{path:"",redirect:"overview"},{path:"overview",detail:{label:"Overview"}},{path:"organization",detail:{label:"Organization"}},{path:"employees",detail:{label:"Employees"}},{path:"departments",detail:{label:"Departments"}}];this.dataProvider=new o(i.slice(1),{keyAttributes:"path"});let r=t.parentRouter.createChildRouter(i);this.module=new n(r,{viewPath:"views/",viewModelPath:"viewModels/"}),this.selection=new a(r),r.sync(),this.connected=function(){e.announce("Introduction page loaded.","assertive"),document.title="Introduction"},this.disconnected=function(){},this.transitionCompleted=function(){}}}));