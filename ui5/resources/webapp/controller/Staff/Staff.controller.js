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
			this.setModel(models.createRestaurantsModel(), "restaurants"); //Add same model with other name for double binding
		},

		_onStaffMatched: function() {
			this._setSectionBlock(false);
		},

		onStaffReceived: function(evt) {
			var data = evt.getParameter("data"),
				staffList = this.byId("staffList");
			if (data && !this.byId("staff").getElementBinding()) {
				var firstStaff = staffList.getItems()[0];
				staffList.setSelectedItem(firstStaff);
				this._bindStaff(firstStaff.getBindingContext().getObject());
				this.byId("staffList").getBinding("items").detachDataReceived(this.onStaffReceived);
			}
		},

		_bindStaff: function(staff) {
			this.byId("staff").bindElement({
				path: `/Staff(StaffId=${staff.StaffId})`,
				parameters: {
					expand: "Restaurants"
				}
			});
		},

		onSelectStaff: function(evt) {
			this._bindStaff(evt.getParameter("listItem").getBindingContext().getObject());
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

		onEditStaff: function(evt) {
			this._setSectionBlock(evt.getParameter("pressed"));
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
				model.submitChanges()
					.then(this._success.bind(this))
					.catch(resp => {
						this._dialog.setBusy(false);
						this.openMessageDialog(resp);
					});
			}
		},

		_success: function() {
			var staff = this.byId("staff").getBindingContext().getObject();
			this.showMessageToast("StaffUpdated", [staff.StaffId, staff.UserId]);
			this._setSectionBlock(false);
		},

		onAddStaff: function() {
			var ctx = this.getModel().createEntry("/Staff", {
				properties: {
					"Name": "",
					"LastName": "",
					"UserId": "",
					"Restaurants": []
				}
			});
			this.byId("staff").unbindElement().setBindingContext(ctx);
			this._setSectionBlock(true);
		},

		isRestaurantMember: function(restaurantId, staffRestaurants) {
			return restaurantId && staffRestaurants &&
				staffRestaurants.map(r => this.getModel().getObject("/" + r))
				.some(r => r.RestaurantId === restaurantId);
		},

		onChangeRestaurantMember: function(evt) {
			var staff = this.byId("staff").getBindingContext().getObject();
			var restaurant = evt.getSource().getBindingContext("restaurants").getObject();
			models.updateRestaurantStaffRelation({
					RestaurantId: restaurant.RestaurantId,
					StaffId: staff.StaffId,
					Add: evt.getParameter("state")
				})
				.then(() => {
					this.showMessageToast("StaffUpdated", [staff.StaffId, staff.UserId]);
				});

		}

	});
});