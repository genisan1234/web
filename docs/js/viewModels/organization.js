/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(
  ['knockout',
    'accUtils',
    'ojs/ojarraytreedataprovider',
    'ojs/ojarraydataprovider',
    'ojs/ojknockout-keyset',
    'ojs/ojtreeview',
    'ojs/ojavatar',
    'ojs/ojknockout'],
  function (ko, accUtils, ArrayTreeDataProvider, ArrayDataProvider, KeySet) {
    function OrganizationViewModel() {
      this.deptURL = 'https://apex.oracle.com/pls/apex/oraclejet/dept/';
      this.empURL = 'https://apex.oracle.com/pls/apex/oraclejet/hr/employees/';

      this.deptArray = ko.observable();
      this.empArray = ko.observable();
      this.dataProvider = ko.observable();
      this.expanded = new KeySet.ObservableKeySet().add(['research']);

      fetch(this.empURL)
        .then((response) => {
          return response.json();
        })
        .then((body) => {
          let tempArray = this.createTreeData(body.items);
          // this.buildStructure(body.items);
          this.empArray(new ArrayDataProvider(body.items, { keyAttributes: 'empno' }));
          this.dataProvider(new ArrayTreeDataProvider(tempArray, { keyAttributes: 'id' }));
        });

      fetch(this.deptURL)
        .then((response) => {
          return response.json();
        })
        .then((body) => {
          this.deptArray(new ArrayDataProvider(body.items, { keyAttributes: 'deptno' }));
        });

      this.createTreeData = (baseData) => {
        let org = {
          Accounting: { children: [] },
          Research: { children: [] },
          Sales: { children: [] },
          Operations: { children: [] }
        };
        baseData.forEach(emp => {
          switch (emp.deptno) {
            case 10:
              org.Accounting.children.push({ title: emp.ename, id: emp.ename, isLeaf: true });
              break;
            case 20:
              org.Research.children.push({ title: emp.ename, id: emp.ename, isLeaf: true });
              break;
            case 30:
              org.Sales.children.push({ title: emp.ename, id: emp.ename, isLeaf: true });
              break;
            case 40:
              org.Operations.children.push({ title: emp.ename, id: emp.ename, isLeaf: true });
              break;
            default:
              org.Accounting.children.push({ title: emp.ename, id: emp.ename, isLeaf: true });
          }
        });
        let finalOrg = [
          {
            title: 'Accounting', id: 'accounting', isLeaf: false, children: org.Accounting.children
          },
          {
            title: 'Research', id: 'research', isLeaf: false, children: org.Research.children
          },
          {
            title: 'Sales', id: 'sales', isLeaf: false, children: org.Sales.children
          },
          {
            title: 'Operations', id: 'operations', isLeaf: false, children: org.Operations.children
          }];

        return finalOrg;
      };

      // Experimenting on recursion of sorts
      // let tempStucture = new Set();
      // this.getChildren = (obj) => {
      //   let children = [];
      //   obj.forEach(emp => {

      //   });
      //   return children;
      // };
      // this.buildStructure = (data) => {
      //   data.forEach(emp => {
      //     let obj = {
      //       id: emp.empno,
      //       name: emp.ename,
      //       mgr: emp.mgr,
      //       children: []
      //     };
      //     data.forEach(emp2 => {
      //       if (emp2.mgr === emp.empno) { obj.children.push(emp2.ename); }
      //     });
      //     tempStucture.add(obj);
      //   });
      //   console.log(tempStucture.keys());
      //   console.log('Test: ' + JSON.stringify([...tempStucture]));
      // };

      // end experiments

      this.isLeaf = (value) => {
        return value;
      };

      this.getInitials = (value) => {
        return value.title.slice(0, 1);
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
      this.connected = function () {
        accUtils.announce('Organization content loaded', 'assertive');
        document.title = 'Intro - Organization';
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return OrganizationViewModel;
  }
);
