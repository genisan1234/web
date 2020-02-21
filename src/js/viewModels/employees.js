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
    'ojs/ojconverterutils-i18n',
    'ojs/ojknockout',
    'ojs/ojtable',
    'ojs/ojvalidation-datetime',
    'ojs/ojvalidation-number',
    'ojs/ojdialog',
    'ojs/ojlabel',
    'ojs/ojinputtext',
    'ojs/ojinputnumber',
    'ojs/ojvalidationgroup',
    'ojs/ojavatar',
    'ojs/ojmessages',
    'ojs/ojformlayout'
  ],
  function (accUtils, ko, ArrayDataProvider, ValidationBase, ConverterUtilsI18n) {
    function EmployeesViewModel() {

      const empURL = 'https://apex.oracle.com/pls/apex/accjet/hr/employees/';
      const deptURL = 'https://apex.oracle.com/pls/apex/accjet/hr/departments/';

      this.createMessage = (data) => {
        return {
          severity: 'confirmation',
          summary: 'Updates saved',
          detail: 'The changes for employee ' + data.ename + ' have been saved.',
          closeAffordance: 'defaults',
          autoTimeout: -1,
          sound: 'defaults',
          timestamp: ConverterUtilsI18n.IntlConverterUtils.dateToLocalIso(new Date())
        };
      };

      this.positionObject = {
        my: { vertical: 'top', horizontal: 'start' },
        at: { vertical: 'top', horizontal: 'start' },
        of: '#table'
      };

      this.messages = ko.observableArray([]);
      this.messagesDataprovider = ko.observable();
      this.messagesDataprovider(new ArrayDataProvider(this.messages));

      this.selectedRow = ko.observable();
      this.activeRow = ko.observable();

      // edit dialog data variables
      this.editEmployeeId = ko.observable();
      this.editEmployeeName = ko.observable();
      this.editJob = ko.observable();
      this.editSal = ko.observable();
      this.editHireDate = ko.observable();
      this.editMgr = ko.observable();
      this.editComm = ko.observable();
      this.editDeptNo = ko.observable();

      this.groupValid = ko.observable();

      // detail data variables
      this.detailEmployeeId = ko.observable();
      this.detailEmployeeName = ko.observable();
      this.detailJob = ko.observable();
      this.detailSal = ko.observable();
      this.detailHireDate = ko.observable();
      this.detailMgr = ko.observable();
      this.detailComm = ko.observable();
      this.detailDeptNo = ko.observable();

      const salOptions = {
        style: 'currency',
        currency: 'USD'
      };
      const salaryConverter = ValidationBase.Validation.converterFactory('number').createConverter(salOptions);

      // for date fields
      const dateOptions = {
        formatStyle: 'date',
        dateFormat: 'medium'
      };
      const dateConverter = ValidationBase.Validation.converterFactory('datetime').createConverter(dateOptions);

      this.formatSal = data => salaryConverter.format(data);
      this.formatDate = data => dateConverter.format(data);

      this.deptMap = ko.observable();
      $.getJSON(deptURL).then(depts => {
        this.deptMap(new Map(Array.from(depts.items.map(dept => [dept.deptno, dept]))));
      });

      this.data = ko.observableArray();
      this.empMap = ko.observable();
      $.getJSON(empURL)
        .then(users => {
          this.empMap(new Map(Array.from(users.items.map(emp => [emp.empno, emp]))));
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
          });
          this.data(tempArray);
        });

      this.dataProvider = new ArrayDataProvider(
        this.data, { keyAttributes: 'empno' }
      );

      this.isDisabled = ko.observable(true);
      this.selectionChangedHandler = (event) => {
        let data = this.selectedRow().data;
        if (event.detail.previousValue.key) {
          document.getElementById(event.detail.previousValue.key + '-btn').setProperty('disabled', true);
        }
        if (event.detail.value.key) {
        document.getElementById(data.empno + '-btn').setProperty('disabled', false);
        }
      };

      this.editRow = (event) => {
        event.detail.originalEvent.stopPropagation();
        let data = this.selectedRow().data;
        document.getElementById('editDialog').open();
        this.editEmployeeId(data.empno);
        this.editEmployeeName(data.ename);
        this.editJob(data.job);
        this.editSal(data.sal);
        this.editHireDate(data.hiredate);
        this.editMgr(data.mgr);
        this.editComm(data.comm);
        this.editDeptNo(data.deptno);
      };

      this.save = () => {
        // save edits to employee
        let url = empURL + this.editEmployeeId();
        let newData = {
          ename: this.editEmployeeName(),
          job: this.editJob(),
          sal: this.editSal(),
          hiredate: this.editHireDate(),
          mgr: this.editMgr(),
          comm: this.editComm(),
          deptno: this.editDeptNo()
        };

        this.updateData(url, newData)
          .then(() => {
            document.getElementById('editDialog').close();
            let newMessage = this.createMessage({ ename: this.editEmployeeName() });
            this.messages.push(newMessage);
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
              document.getElementById(currentRow.rowKey + '-btn').setProperty('disabled', false);
            }
          });
      };

      this.cancel = () => {
        // cancel and close the dialog
        document.getElementById('editDialog').close();
      };

      this.updateData = (url, data) => {
        return fetch(url, {
          method: 'PUT', // 'GET', 'PUT', 'DELETE', etc.
          body: JSON.stringify(data), // Use correct payload (matching 'Content-Type')
          headers: { 'Content-Type': 'application/json' },
        })
          .then(response => response.json())
          .catch(error => console.error(error));
      };

      this.rowChangeHandler = (event) => {
        let data = event.detail;
        if (event.type === 'currentRowChanged' && data.value != null) {
          let rowIndex = data.value.rowIndex;
          let emp = this.data()[rowIndex];
          if (emp != null) {
            this.detailEmployeeId(emp.empno);
            this.detailEmployeeName(emp.ename);
            this.detailJob(emp.job);
            this.detailSal(salaryConverter.format(emp.sal));
            this.detailHireDate(emp.hiredate);
            this.detailMgr(this.getMgr(emp.mgr));
            this.detailDeptNo(this.getDept(emp.deptno));
          }
          this.activeRow(data.value);
        }
      };

      this.getDept = (id) => {
        if (id) {
          return this.deptMap().get(id).dname;
        }
        return 'No Department';
      };

      this.getMgr = (id) => {
        if (id) {
          return this.empMap().get(id).ename;
        }
        return 'No Manager';
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
        accUtils.announce('Employees content loaded.  As rows in the employees table are selected, more details are presented in the employee detail panel.', 'assertive');
        document.title = 'Intro - Employees';
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
    return EmployeesViewModel;
  }
);
