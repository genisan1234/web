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
    'ojs/ojconverter-number',
    'ojs/ojdatagrid',
    'ojs/ojfilmstrip',
    'ojs/ojchart',
    'ojs/ojpagingcontrol',
    'ojs/ojformlayout'],
  function (accUtils, $, ko, ArrayDataProvider, Context, KnockoutTemplateUtils, NumberConverter) {
    function DepartmentsViewModel() {
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;
      const deptURL = 'https://apex.oracle.com/pls/apex/oraclejet/hr/departments/';
      const empURL = 'https://apex.oracle.com/pls/apex/oraclejet/hr/employees/';
      this.dataReady = ko.observable(false);
      this.accountingCount = ko.observable(0);
      this.researchCount = ko.observable(0);
      this.salesCount = ko.observable(0);
      this.operationsCount = ko.observable(0);
      this.pagingModel = ko.observable();
      this.depts = ko.observableArray();

      this.getItemInitialDisplay = function (index) {
        return index < 1 ? '' : 'none';
      };

      fetch(empURL).then(response => response.json()).then(data => {
        this.salData = this.processEmpData(data);
      });

      this.deptTotals = ko.observableArray([]);
      this.chartDataProvider = new ArrayDataProvider(this.deptTotals, { keyAttributes: 'id' });
      this.totalSalary = 0;

      this.processEmpData = (data) => {
        let tempArray = data.items;
        this.deptTotals([
          {
            id: 0,
            series: 'Accounting',
            group: 'Group A',
            value: 0
          },
          {
            id: 1,
            series: 'Research',
            group: 'Group A',
            value: 0
          },
          {
            id: 2,
            series: 'Sales',
            group: 'Group A',
            value: 0
          },
          {
            id: 3,
            series: 'Operations',
            group: 'Group A',
            value: 0
          }
        ]);
        tempArray.forEach(item => {
          switch (item.deptno) {
            case 10:
              this.totalSalary += item.sal;
              this.deptTotals()[0].value += item.sal;
              this.accountingCount(this.accountingCount() + 1);
              break;
            case 20:
              this.totalSalary += item.sal;
              this.deptTotals()[1].value += item.sal;
              this.researchCount(this.researchCount() + 1);
              break;
            case 30:
              this.totalSalary += item.sal;
              this.deptTotals()[2].value += item.sal;
              this.salesCount(this.salesCount() + 1);
              break;
            case 40:
              this.totalSalary += item.sal;
              this.deptTotals()[3].value += item.sal;
              this.operationsCount(this.operationsCount() + 1);
              break;
            default:
              console.log('Unknown department: ' + item.deptno);
          }
        });
        return this.deptTotals(tempArray);
      };

      this.getEmpCount = (val) => {
        switch (val) {
          case 'accounting':
            return this.accountingCount();
          case 'research':
            return this.researchCount();
          case 'sales':
            return this.salesCount();
          case 'operations':
            return this.operationsCount();
          default:
            return 0;
        }
      };

      this.usdNumberConverter = new NumberConverter.IntlNumberConverter({
        style: "currency",
        currency: "USD",
        currencyDisplay: "code",
        pattern: "¤ ##,##0.00"
      });

      this.dgDataProvider = ko.observable();
      this.deptMap = ko.observable();
      $.getJSON(deptURL).then((depts) => {
        this.deptMap(new Map(Array.from(depts.items.map(dept => [dept.deptno, dept]))));
        let tempDeptArray = [];
        let tempArray = depts.items.map(dept => {
          tempDeptArray.push({ name: (dept.dname).toLowerCase(), loc: (dept.loc).toLowerCase() });
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
      });

      this.styleName = (string) => {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      this.getCellClassName = (cellContext) => {
        let key = cellContext.keys.column;
        if (key === 'deptno') {
          return 'oj-helper-justify-content-right small-cell';
        }
        if (key === 'dname' || key === 'loc') {
          return 'oj-sm-justify-content-flex-start med-cell';
        }
        return '';
      };

      this.getCellWidth = (cellContext) => {
        let key = cellContext.data;
        if (key === 'deptno') {
          return 'width:20%';
        }
        if (key === 'dname' || key === 'loc') {
          return 'width:40%';
        }
        return '';
      };

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
        document.title = 'Intro - Departments';
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
