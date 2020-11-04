/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['accUtils','knockout','jquery','ojs/ojarraydataprovider','ojs/ojmodel','ojs/ojcollectiondataprovider','ojs/ojlabel','ojs/ojchart','ojs/ojlistview','ojs/ojavatar',   'ojs/ojdialog',
'ojs/ojinputtext','demo-update-item/loader'],
 function(accUtils,ko,$,ArrayDataProvider,Model,CollectionDataProvider) {
    function DashboardViewModel() {
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      var self = this;
      //var url = 'js/store_data.json';
      self.activityDataProvider = ko.observable();
      self.itemsDataProvider = ko.observable();
      self.itemData = ko.observable('');            //holds data for Item details
      self.newItem = ko.observableArray([]);
      self.pieSeriesValue = ko.observableArray([]);
      self.activitySelected = ko.observable(false);
      self.selectedActivity = ko.observable();
      self.firstSelectedActivity = ko.observable();
            
      // Item selection observables
      self.itemSelected = ko.observable(false);
      self.selectedItem = ko.observable();
      self.firstSelectedItem = ko.observable()
      /*
      var lg_xl_view = '<h1><oj-label for="itemsList">Activity Items</oj-label></h1>' +
  '<oj-list-view style="font-size: 18px">' +
  '<ul>' +
  '<li>' +
  '<div class="oj-flex-item">' +
  '<p>SureCatch Baseball Glove</p>' +
  '<p>Western R16 Helmet</p>' +
  '<p>Western C1 Helmet</p>' +
  '<p>Western Bat</p>' +
  '</div>' +
  '</li>' +
  '<li>' +
  '<div class="oj-flex-item">' +
  '<p>Air-Lift Tire Pump</p>' +
  '<p>Intact Bike Helmet</p>' +
  '<p>Nimbus Bike Tire</p>' +
  '<p>Refill Water Bottle</p>' +
  '<p>Swift Boys 21 Speed</p>' +
  '</div>' +
  '</li>' +
  '</ul>' +
  '</oj-list-view>';
  //Display this content for small and medium screen sizes
var sm_md_view = '<div id="sm_md" style="background-color:lightcyan; padding: 10px; font-size: 10px">' +
'<h1><oj-label for="itemsList">Activity Details</oj-label></h1>' +
  '<oj-list-view style="font-size: 18px">' +
  '<ul>' +
  '<li>' +
  '<div class="oj-flex-item">' +
  '<p>SureCatch Baseball Glove</p>' +
  '<p>Western R16 Helmet</p>' +
  '<p>Western C1 Helmet</p>' +
  '<p>Western Bat</p>' +
  '</div>' +  
  '</li>' +
  '</ul>' +
  '</oj-list-view>'
  '</div>';
      var lgQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

      self.large = ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
      self.moduleConfig = ko.pureComputed(function () {
        var viewNodes = HtmlUtils.stringToNodeArray(self.large() ? lg_xl_view : sm_md_view);
        return { view: viewNodes };
        });
*/
/*
      $.getJSON(url).then(function(data){
              var activityarray  = data;
              self.activityDataProvider(new ArrayDataProvider(activityarray,{keyAttributes:'id'}));
              /*
              var itemsarray = data[0].items;
              self.itemsDataProvider(new ArrayDataProvider(itemsarray,{keyAttributes:'id'}));
              self.itemData(data[0].items[0]);
              // Create variable for Pie Chart series and populate observable
              var pieSeries = [
                { name: "Quantity in Stock", items: [self.itemData().quantity_instock] },
                { name: "Quantity Shipped", items: [self.itemData().quantity_shipped] }
              ];
              self.pieSeriesValue(pieSeries);
              
      });
  */
 var RESTurl = "https://apex.oracle.com/pls/apex/oraclejet/lp/activities/";
 var activityModel = Model.Model.extend({
  urlRoot: RESTurl,
  idAttribute: 'id'
});
self.myActivity = new activityModel();
var activityCollection = new Model.Collection.extend({
   url: RESTurl,
   model: self.myActivity,
   comparator: 'id'
});
/*An observable called activityDataProvider is already bound in the View file
*from the JSON example, so you don't need to update dashboard.html
*/
self.myActivityCol = new activityCollection();
self.activityDataProvider(new CollectionDataProvider(self.myActivityCol));

      self.selectedActivityChanged = function (event) {
        // Check whether click is an Activity selection or a deselection
        if (event.detail.value.length != 0) {
          // If selection, populate and display list
          //var itemsArray = self.firstSelectedActivity().data.items;
          // Populate items list using DataProvider fetch on key attribute
          //self.itemsDataProvider(new ArrayDataProvider(itemsArray, { keyAttributes: "id" }))
          var activityKey = self.firstSelectedActivity().data.id;
          //REST endpoint for the items list
            var url = "https://apex.oracle.com/pls/apex/oraclejet/lp/activities/" + activityKey + '/items/';
            function parseItem(response) {
              var img = 'css/images/product_images/jet_logo_256.png'
              if (response) {
                //if the response contains items, pick the first one
                if (response.items && response.items.length !== 0){response = response.items[0];}
                //if the response contains an image, retain it
                if (response.image !== null){img = response['image']; }
                return {
                  id: response['id'],
                  name: response['name'],
                  price: response['price'],
                  short_desc: response['short_desc'],
                  quantity: response['quantity'],
                  quantity_instock: response['quantity_instock'],
                  quantity_shipped: response['quantity_shipped'],
                  activity_id: response['activity_id'],
                  image: img
                };
              }
            }
            var itemModel = Model.Model.extend({
              urlRoot: url,
              parse: parseItem,
              idAttribute: 'id'
            });
            self.myItem = new itemModel();
          self.itemCollection = new Model.Collection.extend({
            url: url,
            model: self.myItem,
            comparator: 'id'
          });
          /*
          *An observable called itemsDataProvider is already bound in the View file
          *from the JSON example, so you don't need to update dashboard.html
          */
          self.myItemCol = new self.itemCollection();
          self.itemsDataProvider(new CollectionDataProvider(self.myItemCol));
          // Set List View properties
          self.activitySelected(true);
          self.itemSelected(false);
          // Clear item selection
          self.selectedItem([]);
          self.itemData();
        } else {
          // If deselection, hide list
          self.activitySelected(false);
          self.itemSelected(false); 
        }
      };
      /**
  * Handle selection from Activity Items list
  */
 self.showCreateDialog = function (event) {
  document.getElementById('createDialog').open();
}
self.showEditDialog = function (event) {
  document.getElementById('editDialog').open();
}
self.createItem = function (event, data) {
  document.getElementById('createDialog').close();
  var recordAttrs = {
    name: data.newItem.itemName,
    price: Number(data.newItem.price),
    short_desc: data.newItem.short_desc,
    quantity_instock: Number(data.newItem.quantity_instock),
    quantity_shipped: Number(data.newItem.quantity_shipped),
    quantity: (Number(data.newItem.quantity_instock) + Number(data.newItem.quantity_shipped)),
    activity_id: Number(self.firstSelectedActivity().data.id),
  };
  self.myItemCol.create(recordAttrs, {
    wait: true,  //Waits for the server call before setting attributes
    contentType: 'application/json',
    success: function (model, response) {
      console.log('Successfully created new item');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('Error in Create: ' + jqXHR.statusCode.caller);
    }
  });
}

self.showEditDialog = function (event) {
  document.getElementById('editDialog').open();
} 
self.updateItemSubmit = function (event) {
    //myItemCol holds the current data                                
    var myCollection = self.myItemCol;
    //itemData holds the dialog data
    var myModel = myCollection.get(self.itemData().id);
    myModel.parse = null;
    myModel.save(
      {
        'itemId': self.itemData().id,
        'name': self.itemData().name,
        'price': self.itemData().price,
        'short_desc': self.itemData().short_desc
      }, {
      contentType: 'application/json',
      success: function (model, response) {
        console.log('response: '+JSON.stringify(response));
        self.itemData.valueHasMutated();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(self.itemData().id + " -- " + jqXHR);
      }
    });
  document.getElementById('editDialog').close();
}
self.selectedItemChanged = function (event) {
  // Check whether click is an Activity Item selection or deselection
  if (event.detail.value.length != 0) {
    // If selection, populate and display list
         // Populate items list observable using firstSelectedXxx API
         self.itemData(self.firstSelectedItem().data);
         // Create variable and get attributes of the items list to set pie chart values
         var pieSeries = [
           { name: "Quantity in Stock", items: [self.itemData().quantity_instock] },
           { name: "Quantity Shipped", items: [self.itemData().quantity_shipped] }
         ];
         // Update the pie chart with the data
         self.pieSeriesValue(pieSeries);
         self.itemSelected(true);
  } else {
     // If deselection, hide list
     self.itemSelected(false);
  }
};
self.deleteItem = function (event, data) {
  var itemId = self.firstSelectedItem().data.id;
  var itemName = self.firstSelectedItem().data.name;
  var model = self.myItemCol.get(itemId);
  if (model) {
    var really = confirm("Are you sure you want to delete " + itemName + "?");
  }
  if (really){
    //Removes the model from the visible collection
    self.myItemCol.remove(model);
    //Removes the model from the data service
    model.destroy();
  }
};

      /*
      self.val = ko.observable('pie');
      var chartTypes = [
        { value: 'pie', label: 'Pie' },
        { value: 'bar', label: 'Bar' }
      ];
      self.chartTypesProvider= new ArrayDataProvider(chartTypes,{keyAttributes:'value'});
      var chartData = [
        { "id": 0, "series": "Baseball", "group": "Group A", "value": 42 },
        { "id": 1, "series": "Baseball", "group": "Group B", "value": 34 },
        { "id": 2, "series": "Bicycling", "group": "Group A", "value": 55 },
        { "id": 3, "series": "Bicycling", "group": "Group B", "value": 30 },
        { "id": 4, "series": "Skiing", "group": "Group A", "value": 36 },
        { "id": 5, "series": "Skiing", "group": "Group B", "value": 50 },
        { "id": 6, "series": "Soccer", "group": "Group A", "value": 22 },
        { "id": 7, "series": "Soccer", "group": "Group B", "value": 46 }
      ];
      self.chartDataProvider = new ArrayDataProvider(chartData,{keyAttributes:'id'});
      */
      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
