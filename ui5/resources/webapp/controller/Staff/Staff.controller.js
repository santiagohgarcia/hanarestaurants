sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"restaurants/ui5/utils/Validator"
], function(BaseController, formatter, types, models, JSONModel, Fragment, Validator) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Staff.Staff", {
		types: types,
		formatter: formatter,
		models: models,

		onInit: function() {
			this.getRouter().getRoute("Staff").attachMatched(this._onStaffMatched.bind(this));
			this.setModel(new JSONModel(), "view");
		},

		_onStaffMatched: function() {
			this._setSectionBlock(false);
		},

		onEmployeesReceived: function(evt) {
			var data = evt.getParameter("data"),
				employeeList = this.byId("employeeList");
			if (data) {
				var firstEmployee = employeeList.getItems()[0];
				employeeList.setSelectedItem(firstEmployee);
				this.byId("employee").setBindingContext(firstEmployee.getBindingContext());
			}
		},

		onDeleteEmployee: function(evt) {
			var staffCtx = evt.getSource().getBindingContext();
			var staffId = staffCtx.getProperty("EmployeeId");
			this.getModel().remove(staffCtx.getPath(), {
				success: function() {
					this.showMessageToast("StaffDeleted", [staffId]);
				}.bind(this)
			});
		},

		onEditEmployee: function(evt) {
			this._setSectionBlock(evt.getSource().getPressed());
		},

		_setSectionBlock: function(edit) {
			this.getModel("view").setProperty("/Edit", edit);
			Fragment.load({
				name: `restaurants.ui5.view.Staff.fragments.Staff${ edit ? "Change" : "Display" }`
			}).then(form => this.byId("profileSection").destroyBlocks().addBlock(form));
		},

		onSave: function() {
			var model = this.getModel();
			if (Validator.isValid("staffFields", this.getView()) && model.hasPendingChanges()) {
				model.submitChanges({
					success: this.success.bind(this)
				});
			}
		},

		success: function() {
			var staffCtx = this.getView().getBindingContext();
			this.showMessageToast("StaffUpdated", [staffCtx.getProperty("EmployeeId")]);
			this._setSectionBlock(false);
		},

		onAddStaff: function() {
			var ctx = this.getModel().createEntry("/Employees");
			this.byId("employee").setBindingContext(ctx);
			this._setSectionBlock(true);
		}

	});
});