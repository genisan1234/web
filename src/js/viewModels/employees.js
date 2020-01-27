/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(
  ['accUtils',
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojvalidation-base',
    'ojs/ojknockout',
    'ojs/ojtable',
    'ojs/ojvalidation-datetime',
    'ojs/ojvalidation-number',
    'ojs/ojdialog',
    'ojs/ojlabel',
    'ojs/ojinputtext',
    'ojs/ojinputnumber',
    'ojs/ojvalidationgroup'
  ],
  function (accUtils, ko, ArrayDataProvider, ValidationBase) {
    function EmployeesViewModel() {

      this.selectedRow = ko.observable();
      this.editEmployeeId = ko.observable();
      this.editEmployeeName = ko.observable();
      this.editJob = ko.observable();
      this.editSal = ko.observable();
      this.editHireDate = ko.observable();
      this.editMgr = ko.observable();
      this.editComm = ko.observable();
      this.editDeptNo = ko.observable();

      this.groupValid = ko.observable();

      const baseURL = "https://apex.oracle.com/pls/apex/oraclejet/hr/employees/";

      const salOptions = {
        style: 'currency',
        currency: 'USD'
      };
      const salaryConverter = ValidationBase.Validation.converterFactory("number").createConverter(salOptions);

      // for date fields
      const dateOptions = {
        formatStyle: 'date',
        dateFormat: 'medium'
      };
      const dateConverter = ValidationBase.Validation.converterFactory("datetime").createConverter(dateOptions);

      // the use of arrow functions works just fine
      this.formatSal = data => salaryConverter.format(data);
      this.formatDate = data => dateConverter.format(data);

      this.data = ko.observableArray();
      $.getJSON(baseURL)
        .then(users => {
          let tempArray = users.items.map(item => {
            return {
              empno: item.empno,
              ename: item.ename,
              job: item.job,
              hiredate: item.hiredate,
              sal: item.sal,
              mgr: item.mgr,
              comm: item.comm,
              deptno: item.deptno
            };
          })
          this.data(tempArray);
        });

      this.dataProvider = new ArrayDataProvider(
        this.data, {
        keyAttributes: 'empno'
      });

      this.selectionChangedHandler = (event) => {
        if (event.detail.value.data) {
          let data = event.detail.value.data;
          document.getElementById('editDialog').open();
          this.editEmployeeId(data.empno);
          this.editEmployeeName(data.ename);
          this.editJob(data.job);
          this.editSal(data.sal);
          this.editHireDate(data.hiredate);
          this.editMgr(data.mgr);
          this.editComm(data.comm);
          this.editDeptNo(data.deptno);
        }
      }

      this.save = (event) => {
        // save edits to employee
        let url = baseURL + this.editEmployeeId();
        let newData = {
          ename: this.editEmployeeName(),
          job: this.editJob(),
          sal: this.editSal(),
          hiredate: this.editHireDate(),
          mgr: this.editMgr(),
          comm: this.editComm(),
          deptno: this.editDeptNo()
        }

        this.updateData(url, newData)
          .then((data) => {
            console.log(data);
            document.getElementById('editDialog').close();
            let element = document.getElementById('table');
            let currentRow = element.currentRow;

            if (currentRow != null) {
              this.data.splice(currentRow.rowIndex, 1, {
                empno: this.editEmployeeId(),
                ename: this.editEmployeeName(),
                job: this.editJob(),
                sal: this.editSal(),
                hiredate: this.editHireDate()
              });
            }
          });
      }

      this.cancel = (event) => {
        // cancel and close the dialog
        document.getElementById('editDialog').close();
      }

      this.updateData = (url, data) => {
        return fetch(url, {
          // credentials: 'same-origin', // 'include', default: 'omit'
          method: 'PUT',             // 'GET', 'PUT', 'DELETE', etc.
          body: JSON.stringify(data), // Use correct payload (matching 'Content-Type')
          headers: { 'Content-Type': 'application/json' },
        })
          .then(response => response.json())
          .catch(error => console.error(error))
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
      this.connected = function () {
        accUtils.announce('Employees content loaded', 'assertive');
        document.title = "Intro - Employees";
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
    return EmployeesViewModel;
  }
);
