/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(
  ['accUtils',
    'jquery',
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojcontext',
    'ojs/ojknockouttemplateutils',
    'ojs/ojdatagrid',
    'ojs/ojfilmstrip',
    'ojs/ojchart',
    'ojs/ojpagingcontrol'],
  function (accUtils, $, ko, ArrayDataProvider, Context, KnockoutTemplateUtils) {
    function DepartmentsViewModel() {
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;
      const deptURL = 'https://apex.oracle.com/pls/apex/oraclejet/hr/departments/';
      this.dataReady = ko.observable(false);

      this.pagingModel = ko.observable();
      this.depts = ko.observableArray();

      this.getItemInitialDisplay = function (index) {
        return index < 1 ? '' : 'none';
      };

      const tempData = [
        {
          "id": 0,
          "series": "Series 1",
          "group": "Group A",
          "value": 42
        },
        {
          "id": 1,
          "series": "Series 2",
          "group": "Group A",
          "value": 55
        },
        {
          "id": 2,
          "series": "Series 3",
          "group": "Group A",
          "value": 36
        },
        {
          "id": 3,
          "series": "Series 4",
          "group": "Group A",
          "value": 22
        },
        {
          "id": 4,
          "series": "Series 5",
          "group": "Group A",
          "value": 22
        }
      ]
      this.chartDataProvider = new ArrayDataProvider(tempData, {keyAttributes: 'id'});

      this.dgDataProvider = ko.observable();
      this.deptMap = ko.observable();
      $.getJSON(deptURL).then((depts) => {
        this.deptMap(new Map(Array.from(depts.items.map(dept => [dept.deptno, dept]))));
        let tempDeptArray = [];
        let tempArray = depts.items.map(dept => {
          tempDeptArray.push({ name: dept.dname });
          return {
            deptno: dept.deptno,
            dname: dept.dname,
            loc: dept.loc
          };
        });
        this.depts(tempDeptArray);
        this.dgDataProvider(new ArrayDataProvider(tempArray, { keyAttributes: 'deptno' }));
        this.dataReady(true);

        let filmStrip = document.getElementById('deptFilmstrip');
        let busyContext = Context.getContext(filmStrip).getBusyContext();
        busyContext.whenReady().then(() => {
          // Set the Paging Control pagingModel
          this.pagingModel(filmStrip.getPagingModel());
        });
      })

      this.getCellClassName = (cellContext) => {
        let key = cellContext.keys.column;
        if (key === 'deptno') {
          return 'oj-helper-justify-content-right small-cell';
        } else if (key === 'dname' ||
          key === 'loc') {
          return 'oj-sm-justify-content-flex-start med-cell';
        }
        return '';
      };

      this.getCellWidth = (cellContext) => {
        let key = cellContext.data;
        if (key === 'deptno') {
          return 'width:20%';
        } else if (key === 'dname' || key === 'loc') {
          return 'width:40%';
        }
        return '';
      }

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
      this.connected = () => {
        accUtils.announce('Department content loaded', 'assertive');
        document.title = "Intro - Departments";
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
    return DepartmentsViewModel;
  }
);
