/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
define(['ojs/ojcomposite', 'text!./demo-update-item-view.html', './demo-update-item-viewModel', 'text!./component.json', 'css!./demo-update-item-styles'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('demo-update-item', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);