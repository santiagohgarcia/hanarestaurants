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
			this.setModel(new JSONModel({
				Edit: false
			}), "view");
		},

		_onStaffMatched: function() {
			this._setSectionBlock(false);
		},

		onStaffReceived: function(evt) {
			var data = evt.getParameter("data"),
				staffList = this.byId("staffList");
			if (data) {
				var firstStaff = staffList.getItems()[0];
				staffList.setSelectedItem(firstStaff);
				this._bindStaff(firstStaff.getBindingContext().getObject());
				this.byId("staffList").getBinding("items").detachDataReceived(this.onStaffReceived);
			}
		},

		_bindStaff: function(staff) {
			this.byId("staff").unbindElement();
			this.byId("staff").bindElement({
				path: `/Staff(StaffId=${staff.StaffId})`,
				parameters: {
					expand: "Restaurants"
				}
			});
		},

		onDeleteStaff: function(evt) {
			var staffCtx = evt.getSource().getBindingContext();
			var staffId = staffCtx.getProperty("StaffId");
			this.getModel().remove(staffCtx.getPath(), {
				success: function() {
					this.showMessageToast("StaffDeleted", [staffId]);
				}.bind(this)
			});
		},

		onEditProfile: function() {
			this._setSectionBlock(true);
		},

		_setSectionBlock: function(edit) {
			Fragment.load({
				name: `restaurants.ui5.view.Staff.fragments.Staff${ edit ? "Change" : "Display" }`
			}).then(form => this.byId("profileSection").destroyBlocks().addBlock(form));

			this.getModel("view").setProperty("/Edit", edit);
		},

		onSave: function() {
			var model = this.getModel();
			if (Validator.isValid("staffFields", this.getView()) && model.hasPendingChanges()) {
				model.submitChanges({
					success: this._success.bind(this)
				});
			}
		},

		_success: function() {
			var staff = this.byId("staff").getBindingContext().getObject();
			this.showMessageToast("StaffUpdated", [staff.StaffId, staff.UserId]);
			this._setSectionBlock(false);
		},

		onAddStaff: function() {
			var ctx = this.getModel().createEntry("/Staff");
			this.byId("staff").setBindingContext(ctx);
			this._setSectionBlock(true);
		},

		onChangeRestaurantMember: function(evt) {
			var staff = this.byId("staff").getBindingContext().getObject();
			var restaurant = evt.getSource().getBindingContext().getObject();
			models.updateRestaurantStaffRelation({
				RestaurantId: restaurant.RestaurantId,
				StaffId: staff.StaffId
			}, evt.getParameter("state"));
		}

	});
});