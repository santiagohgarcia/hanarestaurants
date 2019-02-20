sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models"
], function(BaseController, formatter, types, models) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Staff.Staff", {
		types: types,
		formatter: formatter,
		models: models,

		onEmployeesReceived: function(evt) {
			var data = evt.getParameter("data"),
				employeeList = this.byId("employeeList");
			if (data) {
				var firstEmployee = employeeList.getItems()[0];
				employeeList.setSelectedItem(firstEmployee);
				this.byId("employee").setBindingContext(firstEmployee.getBindingContext());
			}
		}

	});
});