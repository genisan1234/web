/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/demo-update-item-strings', 'ojs/ojcontext',   'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils', 'ojs/ojknockout','ojs/ojformlayout','ojs/ojinputtext','ojs/ojlabelvalue','ojs/ojvalidation-number'], function (ko, componentStrings, Context,ResponsiveUtils,ResponsiveKnockoutUtils) {
    
    function ExampleComponentModel(context) {
        var self = this;
        self.isSmall = ResponsiveKnockoutUtils.createMediaQueryObservable(
          ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));
      // For small screens: labels on top
      // For medium or bigger: labels inline
      self.labelEdge = ko.computed(function() {
        return self.isSmall() ? "top" : "start";
      }, self);
      self.currency = ko.observable()
      self.lengthValue1 = ko.observable();
      self.validators = ko.computed(function()
       {
        return [{
        type: 'length', 
        options: {min: 5, max: 50}}];
       });
        //At the start of your viewModel constructor
        var busyContext = Context.getContext(context.element).getBusyContext();
        var options = {"description": "Web Component Startup - Waiting for data"};
        self.busyResolve = busyContext.addBusyState(options);

        self.composite = context.element;

        //Example observable
        self.messageText = ko.observable('Hello from demo-update-item');
        self.properties = context.properties;
        self.res = componentStrings['demo-update-item'];
        // Example for parsing context properties
        // if (context.properties.name) {
        //     parse the context properties here
        // }

        //Once all startup and async activities have finished, relocate if there are any async activities
        self.busyResolve();
    };
    
    //Lifecycle methods - uncomment and implement if necessary 
    //ExampleComponentModel.prototype.activated = function(context){
    //};

    //ExampleComponentModel.prototype.connected = function(context){
    //};

    //ExampleComponentModel.prototype.bindingsApplied = function(context){
    //};

    //ExampleComponentModel.prototype.disconnected = function(context){
    //};

    //ExampleComponentModel.prototype.propertyChanged = function(context){
    //};

    return ExampleComponentModel;
});
