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
define(['accUtils','knockout','jquery','ojs/ojarraydataprovider','ojs/ojlabel','ojs/ojchart','ojs/ojlistview','ojs/ojavatar'],
 function(accUtils,ko,$,ArrayDataProvider) {
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
      var url = 'js/store_data.json';
      self.activityDataProvider = ko.observable();
      self.itemsDataProvider = ko.observable();
      self.itemData = ko.observable('');            //holds data for Item details
      self.pieSeriesValue = ko.observableArray([]);
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
      $.getJSON(url).then(function(data){
              var activityarray  = data;
              self.activityDataProvider(new ArrayDataProvider(activityarray,{keyAttributes:'id'}));
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
